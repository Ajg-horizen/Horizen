import { NextResponse, type NextRequest } from 'next/server'
import { randomBytes, randomUUID } from 'node:crypto'
import { Resend } from 'resend'
import { writeClient } from '@/sanity/lib/writeClient'
import {
	SESSION_COOKIE,
	sessionSecret,
	verifySession,
} from '@/lib/dashboard-session'
import {
	cleanFields,
	clientMessage,
	isMessageTemplate,
	type MessageTemplate,
	messageCode,
	senderProfile,
} from '@/app/dashboard/seo/messageText'

export const runtime = 'nodejs'

/**
 * Beskeder fra Horizen til kunden (fanen "Beskeder", kun Horizen; Andreas
 * 5/11-2026). Servicebeskeder og opgaver, adskilt fra spørgsmålene.
 *
 * { template, to, fields, dryRun: true } giver emne og mail uden at sende.
 * { template, to, fields } sender og gemmer en kopi som seoClientMessage
 * (privat id "seo-message.…"), så fanen kan vise, hvad der er sendt. Hver
 * sendt besked får en ægthedskode (fx H-7F3K-92QD), som kunden kan slå op på
 * /tjek-mail; en kopieret mail uden kendt kode er altså ikke fra Horizen.
 *
 * Afsender: den Horizen-medarbejder, der er logget ind (fx
 * "Andreas José · Horizen <ajg@horizen.dk>"), med svar-til og en kopi til
 * samme adresse. Kundens svar lander altså i Horizen-indbakken.
 *
 * Kræver HORIZEN_RESEND_API_KEY: Horizens egen Resend-nøgle, hvor horizen.dk
 * er verificeret (kundens RESEND_API_KEY kan ikke sende fra horizen.dk).
 * Uden login (lokalt) bruges SEO_NOTIFY_FROM.
 */

// Flere modtagere sendes som én mail hver (se nedenfor)
const MAX_RECIPIENTS = 20
const EMAIL = /^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/
const FALLBACK_FROM =
	process.env.SEO_NOTIFY_FROM?.trim() || 'Horizen <onboarding@resend.dev>'

export async function POST(request: NextRequest) {
	const secret = sessionSecret()
	const session = secret
		? await verifySession(request.cookies.get(SESSION_COOKIE)?.value, secret)
		: null
	const local = !secret && process.env.NODE_ENV !== 'production'
	if (!local && session?.role !== 'horizen') {
		return NextResponse.json({ error: 'Kun for Horizen' }, { status: 403 })
	}

	let body: Record<string, unknown>
	try {
		body = (await request.json()) as Record<string, unknown>
	} catch {
		return NextResponse.json({ error: 'Ugyldig anmodning' }, { status: 400 })
	}
	if (!isMessageTemplate(body.template)) {
		return NextResponse.json({ error: 'Ukendt skabelon' }, { status: 400 })
	}

	const to = (typeof body.to === 'string' ? body.to : '')
		.split(/[,;\s]+/)
		.map((s) => s.trim())
		.filter(Boolean)
	if (
		!to.length ||
		to.length > MAX_RECIPIENTS ||
		!to.every((e) => EMAIL.test(e))
	) {
		return NextResponse.json(
			{
				error: `Modtager skal være 1-${MAX_RECIPIENTS} gyldige e-mailadresser`,
			},
			{ status: 400 },
		)
	}

	const fields = cleanFields(body.fields)
	if (!fields.intro) {
		return NextResponse.json({ error: 'Skriv en tekst' }, { status: 400 })
	}

	// navn og portræt ud fra login-mailen (Sanity-kontoens navn kan være et andet)
	const profile = senderProfile(
		session?.email,
		session?.name,
		process.env.SEO_SENDER_PHOTO,
	)
	const sender = profile.name
	const origin = new URL(request.url).origin
	const build = (code?: string) =>
		clientMessage({
			template: body.template as MessageTemplate,
			fields,
			sender,
			senderPhoto: profile.photo,
			origin,
			dashboardLink: `${origin}/dashboard/seo`,
			code,
			verifyBase: process.env.SEO_VERIFY_URL,
		})

	// Ægthedskoden laves kun ved rigtig afsendelse; kunden kan slå den op på /tjek-mail
	if (body.dryRun === true) {
		return NextResponse.json({ ok: true, dryRun: true, to, ...build() })
	}

	const key =
		process.env.HORIZEN_RESEND_API_KEY?.trim() || process.env.RESEND_API_KEY
	if (!key) {
		return NextResponse.json(
			{ error: 'Mail er ikke sat op (HORIZEN_RESEND_API_KEY mangler)' },
			{ status: 500 },
		)
	}
	const resend = new Resend(key)
	const own = session?.email?.toLowerCase().endsWith('@horizen.dk')
		? session.email
		: ''

	// Én mail pr. modtager: hver får sin egen kontrolkode, og ingen kan se de
	// andre modtagere. Kopien til afsenderen følger kun med den første.
	const sent: string[] = []
	const failed: string[] = []
	for (const [i, recipient] of to.entries()) {
		const code = messageCode(randomBytes(8))
		const mail = build(code)
		const { data, error } = await resend.emails.send({
			from: own ? `${sender || 'Horizen'} · Horizen <${own}>` : FALLBACK_FROM,
			to: [recipient],
			...(own && { replyTo: own, ...(i === 0 && { bcc: own }) }),
			subject: mail.subject,
			html: mail.html,
			text: mail.text,
		})
		if (error) {
			console.error(`[seo-message] Resend fejlede for ${recipient}:`, error)
			failed.push(`${recipient} (${error.message})`)
			continue
		}
		sent.push(recipient)
		try {
			await writeClient.create({
				_id: `seo-message.${randomUUID()}`,
				_type: 'seoClientMessage',
				sentAt: new Date().toISOString(),
				sentTo: recipient,
				sentToName: fields.name,
				sentBy: sender || 'Lokal test',
				template: body.template,
				code,
				// Resends id, så fanen kan vise, om mailen er leveret og åbnet
				resendId: data?.id,
				subject: mail.subject,
				html: mail.html,
			})
		} catch (err) {
			// mailen er sendt; uden kopi står den bare ikke i fanens liste
			console.error('[seo-message] Kunne ikke gemme beskeden:', err)
		}
	}

	if (!sent.length) {
		return NextResponse.json(
			{ error: `Mailen blev ikke sendt: ${failed.join(', ')}` },
			{ status: 502 },
		)
	}
	return NextResponse.json({ ok: true, sent, failed })
}
