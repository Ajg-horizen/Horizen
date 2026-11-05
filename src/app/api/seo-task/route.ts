import { NextResponse, after, type NextRequest } from 'next/server'
import { Resend } from 'resend'
import { writeClient } from '@/sanity/lib/writeClient'
import { escapeHtml, structuredTextToHtml } from '@/app/dashboard/seo/richtext'
import {
	SESSION_COOKIE,
	sessionSecret,
	verifySession,
} from '@/lib/dashboard-session'

export const runtime = 'nodejs'

/**
 * Opret SEO-opgaver fra dashboardet (/dashboard/seo → "Opgaver").
 *
 * Kunden kan oprette flere opgaver på én gang ({ tasks: [...] }). Hver opgave
 * gemmes som sit eget seoInboxItem (status "sendt"), men der sendes kun ÉN
 * samlet notifikations-mail. Den gamle form med én opgave ({ subject,
 * message, ... }) virker stadig.
 *
 * Kunden kan KUN oprette. Triage (godkendt/i gang/løst/blokeret) sker inde i
 * Sanity Studio, som er login-beskyttet — derfor er der bevidst ingen
 * status-ændrings-endpoint her.
 *
 * Afsender: er man logget ind med Sanity, læses navn og e-mail fra den
 * signerede login-cookie (kan ikke ændres udefra), og feltet "Fra" bruges
 * ikke. Kun ved kode-login (uden navn) bruges det, kunden selv skriver.
 *
 * Indtaget hærdes let: honeypot, rate-limit og længdegrænser. Mailen sendes
 * best-effort via Resend, HVIS RESEND_API_KEY er sat (se sendNotification).
 *
 * Kræver SANITY_API_WRITE_TOKEN (Editor-token) i miljøet for at kunne gemme.
 */

const MAX_SUBJECT = 200
const MAX_MESSAGE = 4000
const MAX_FROM = 120
const MAX_TASKS = 10
const VALID_PRIORITY = ['hoej', 'middel', 'lav'] as const
type Priority = (typeof VALID_PRIORITY)[number]
const VALID_HANDLING = ['timer5', 'timer10', 'estimat'] as const
type Handling = (typeof VALID_HANDLING)[number]

type Task = {
	subject: string
	message: string
	priority: Priority
	handling: Handling
}

// Afsender = et Resend-verificeret subdomæne (afsender på roden afvises af Resend).
// Neutral placeholder — skift til kundens verificerede afsender pr. projekt.
// Modtager = process.env.SEO_TASK_NOTIFY_TO (fallback herunder).
const NOTIFY_FROM =
	process.env.CONTACT_FROM_EMAIL ||
	'SEO-overblik <kontakt@send.dit-domæne.dk>'

/* ── Simpel in-memory rate-limit pr. instans ── */
const WINDOW_MS = 5 * 60_000
const MAX_IN_WINDOW = 40
const hits: number[] = []
function rateLimited(now: number) {
	while (hits.length && now - hits[0] > WINDOW_MS) hits.shift()
	if (hits.length >= MAX_IN_WINDOW) return true
	hits.push(now)
	return false
}

const PRIORITY_LABEL: Record<Priority, string> = {
	hoej: 'Høj',
	middel: 'Middel',
	lav: 'Lav',
}

const HANDLING_LABEL: Record<Handling, string> = {
	timer5: 'Op til 5 timer (forhåndsgodkendt — gå bare i gang)',
	timer10: 'Op til 10 timer (forhåndsgodkendt)',
	estimat: 'Ønsker et tidsoverslag først',
}

/**
 * Best-effort notifikations-mail via Resend. Sender kun hvis RESEND_API_KEY er
 * sat; fejler blødt — opgaverne er allerede gemt i Sanity når denne kaldes.
 * Afsender skal være et Resend-verificeret domæne (se NOTIFY_FROM).
 */
async function sendNotification(opts: {
	from: string
	to: string
	subject: string
	html: string
}) {
	const key = process.env.RESEND_API_KEY
	if (!key) {
		console.warn('[seo-task] RESEND_API_KEY mangler — sender ikke notifikation')
		return
	}
	try {
		const resend = new Resend(key)
		await resend.emails.send(opts)
	} catch (err) {
		console.error('[seo-task] Resend notifikation fejlede:', err)
	}
}

/** Renser én opgave; null hvis beskrivelsen mangler. */
function cleanTask(raw: unknown): Task | null {
	const t = (raw ?? {}) as Record<string, unknown>
	const message = (typeof t.message === 'string' ? t.message : '')
		.trim()
		.slice(0, MAX_MESSAGE)
	if (!message) return null
	return {
		subject:
			(typeof t.subject === 'string' ? t.subject : '')
				.trim()
				.slice(0, MAX_SUBJECT) || '(uden emne)',
		message,
		priority: VALID_PRIORITY.includes(t.priority as Priority)
			? (t.priority as Priority)
			: 'middel',
		handling: VALID_HANDLING.includes(t.handling as Handling)
			? (t.handling as Handling)
			: 'timer5',
	}
}

export async function POST(request: NextRequest) {
	if (rateLimited(Date.now())) {
		return NextResponse.json({ error: 'For mange anmodninger' }, { status: 429 })
	}

	let body: Record<string, unknown>
	try {
		body = (await request.json()) as Record<string, unknown>
	} catch {
		return NextResponse.json({ error: 'Ugyldig anmodning' }, { status: 400 })
	}

	// Honeypot — lad boten tro det lykkedes uden at gemme noget.
	if (typeof body.website === 'string' && body.website.trim().length > 0) {
		return NextResponse.json({ ok: true, items: [] })
	}

	const rawTasks = Array.isArray(body.tasks) ? body.tasks : [body]
	if (rawTasks.length > MAX_TASKS) {
		return NextResponse.json(
			{ error: `Højst ${MAX_TASKS} opgaver ad gangen` },
			{ status: 400 },
		)
	}
	const tasks = rawTasks.map(cleanTask)
	if (!tasks.length || tasks.some((t) => !t)) {
		return NextResponse.json(
			{ error: 'Hver opgave skal have en beskrivelse' },
			{ status: 400 },
		)
	}
	const valid = tasks as Task[]

	const secret = sessionSecret()
	const session = secret
		? await verifySession(request.cookies.get(SESSION_COOKIE)?.value, secret)
		: null
	const fromName = (
		session?.name || (typeof body.from === 'string' ? body.from : '')
	)
		.trim()
		.slice(0, MAX_FROM)
	const fromEmail = session?.email ?? ''
	const receivedAt = new Date().toISOString()

	// Alle opgaver gemmes i én transaktion: enten kommer de alle med, eller ingen.
	const docs = valid.map((t) => ({
		_id: crypto.randomUUID(),
		_type: 'seoInboxItem',
		...t,
		status: 'sendt',
		fromName,
		fromEmail,
		receivedAt,
	}))
	try {
		const tx = writeClient.transaction()
		for (const doc of docs) tx.create(doc)
		await tx.commit()
	} catch (err) {
		console.error('[seo-task] Sanity write failed:', err)
		return NextResponse.json(
			{
				error:
					valid.length > 1
						? 'Kunne ikke gemme opgaverne'
						: 'Kunne ikke gemme opgaven',
			},
			{ status: 500 },
		)
	}

	// Én samlet notifikations-mail (best-effort — opgaverne er allerede gemt).
	// Sendes EFTER svaret er flushet, så brugeren ikke venter på Resend.
	const to = process.env.SEO_TASK_NOTIFY_TO || 'ajg@horizen.dk'
	const many = valid.length > 1
	const taskHtml = valid
		.map(
			(t, i) => `
				<h3>${many ? `${i + 1}. ` : ''}${escapeHtml(t.subject)}</h3>
				<p><strong>Prioritet:</strong> ${PRIORITY_LABEL[t.priority]}<br>
				<strong>Håndtering:</strong> ${HANDLING_LABEL[t.handling]}</p>
				${structuredTextToHtml(t.message)}
			`,
		)
		.join('<hr>')
	after(() =>
		sendNotification({
			from: NOTIFY_FROM,
			to,
			subject: many
				? `${valid.length} nye ad hoc-opgaver`
				: `Ny ad hoc-opgave (${PRIORITY_LABEL[valid[0].priority]})`,
			html: `
				<h2>${many ? `${valid.length} nye SEO-opgaver` : 'Ny SEO-opgave'} i dashboardet</h2>
				${
					fromName
						? `<p><strong>Fra:</strong> ${escapeHtml(fromName)}${
								fromEmail ? ` (${escapeHtml(fromEmail)})` : ''
							}</p>`
						: ''
				}
				<hr>
				${taskHtml}
				<hr>
				<p style="color:#666;font-size:12px">Åbn Studio → SEO-opgaver for at godkende/triagere.</p>
			`,
		}),
	)

	return NextResponse.json({
		ok: true,
		items: docs.map((doc) => ({
			_id: doc._id,
			subject: doc.subject,
			message: doc.message,
			priority: doc.priority,
			handling: doc.handling,
			status: doc.status,
			fromName: doc.fromName,
			fromEmail: doc.fromEmail,
			receivedAt: doc.receivedAt,
		})),
	})
}
