import { NextResponse, type NextRequest } from 'next/server'
import { writeClient } from '@/sanity/lib/writeClient'
import {
	SESSION_COOKIE,
	sessionSecret,
	verifySession,
} from '@/lib/dashboard-session'
import { getClientTodos } from '@/app/dashboard/seo/clientItems'

export const runtime = 'nodejs'

/**
 * Markér en opgave fra SEO-dashboardets "Din to-do" som gjort (Andreas
 * 15/11-2026). Gemmes i Sanity som seoTodoDone med id `seo-todo.<id>`, så
 * Horizen kan se, hvornår den er klaret, og følge op på resten. `done: false`
 * sletter markeringen igen ("Fortryd").
 *
 * `seen: true` (Andreas 16/11-2026): kunden har set en ny opgave og lagt den på
 * sin to-do-liste ("Set, læg på min liste"). Gemmes som seoTodoSeen med id
 * `seo-todo-seen.<id>`, så indbakken kun viser det nye, og vi har datoen for,
 * at opgaven er modtaget.
 *
 * Kræver login til dashboardet (samme signerede cookie som /dashboard). Uden
 * DASHBOARD_SESSION_SECRET er det kun åbent lokalt, som dashboardet selv
 * (src/proxy.ts). Id'et skal høre til en kendt opgave (data.ts eller Studio), så der ikke
 * kan oprettes vilkårlige dokumenter.
 */

const MAX_NOTE = 4000

/* ── Simpel in-memory rate-limit pr. instans ── */
const WINDOW_MS = 5 * 60_000
const MAX_IN_WINDOW = 60
const hits: number[] = []
function rateLimited(now: number) {
	while (hits.length && now - hits[0] > WINDOW_MS) hits.shift()
	if (hits.length >= MAX_IN_WINDOW) return true
	hits.push(now)
	return false
}

export async function POST(request: NextRequest) {
	if (rateLimited(Date.now())) {
		return NextResponse.json({ error: 'For mange anmodninger' }, { status: 429 })
	}

	// samme adgang som dashboardet
	const secret = sessionSecret()
	const session = secret
		? await verifySession(request.cookies.get(SESSION_COOKIE)?.value, secret)
		: null
	if (!session && (secret || process.env.NODE_ENV === 'production')) {
		return NextResponse.json({ error: 'login' }, { status: 401 })
	}

	let body: Record<string, unknown>
	try {
		body = (await request.json()) as Record<string, unknown>
	} catch {
		return NextResponse.json({ error: 'Ugyldig anmodning' }, { status: 400 })
	}

	const id = typeof body.id === 'string' ? body.id : ''
	// data.ts + opgaver oprettet i Studio
	const todo = (await getClientTodos()).find((t) => t.id === id)
	if (!todo) {
		return NextResponse.json({ error: 'Ukendt opgave' }, { status: 400 })
	}
	if (body.seen === true) {
		const seenDoc = {
			_id: `seo-todo-seen.${id}`,
			_type: 'seoTodoSeen',
			todoId: id,
			title: todo.title,
			seenBy: session?.name || 'Lokal test',
			seenEmail: session?.email ?? '',
			seenAt: new Date().toISOString(),
		}
		try {
			await writeClient.createOrReplace(seenDoc)
			return NextResponse.json({ ok: true, seen: { by: seenDoc.seenBy, at: seenDoc.seenAt } })
		} catch (err) {
			console.error('[seo-todo] Sanity write failed (seen):', err)
			return NextResponse.json({ error: 'Kunne ikke gemme' }, { status: 500 })
		}
	}

	const note = (typeof body.note === 'string' ? body.note : '').trim().slice(0, MAX_NOTE)
	// Tilladelse til, at Horizen kontakter dem i bemærkningen (kun på opgaver med flueben)
	const consent = Boolean(todo.noteConsent && body.consent === true)
	if (todo.noteConsent && note && !consent && body.done !== false) {
		return NextResponse.json({ error: 'Mangler tilladelse' }, { status: 400 })
	}

	// Svar pr. link (fx pr. afsnit); kun links med svarfelt i data.ts tages med
	const askLabels = new Set((todo.links ?? []).filter((l) => l.ask).map((l) => l.label))
	const linkNotes = (Array.isArray(body.linkNotes) ? body.linkNotes : [])
		.map((n) => n as Record<string, unknown>)
		.filter((n) => typeof n.label === 'string' && askLabels.has(n.label) && typeof n.text === 'string')
		.map((n, i) => ({
			_key: `n${i}`,
			label: n.label as string,
			text: (n.text as string).trim().slice(0, 1000),
		}))
		.filter((n) => n.text)

	const _id = `seo-todo.${id}`
	try {
		if (body.done === false) {
			await writeClient.delete(_id)
			return NextResponse.json({ ok: true, done: null })
		}
		const doc = {
			_id,
			_type: 'seoTodoDone',
			todoId: id,
			title: todo.title,
			note,
			consent,
			linkNotes,
			doneBy: session?.name || 'Lokal test',
			doneEmail: session?.email ?? '',
			doneAt: new Date().toISOString(),
		}
		await writeClient.createOrReplace(doc)
		return NextResponse.json({
			ok: true,
			done: {
				note: doc.note,
				by: doc.doneBy,
				at: doc.doneAt,
				consent: doc.consent,
				linkNotes: linkNotes.map(({ label, text }) => ({ label, text })),
			},
		})
	} catch (err) {
		console.error('[seo-todo] Sanity write failed:', err)
		return NextResponse.json({ error: 'Kunne ikke gemme' }, { status: 500 })
	}
}
