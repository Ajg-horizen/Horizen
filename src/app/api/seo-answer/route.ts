import { NextResponse, type NextRequest } from 'next/server'
import { writeClient } from '@/sanity/lib/writeClient'
import {
	SESSION_COOKIE,
	sessionSecret,
	verifySession,
} from '@/lib/dashboard-session'
import { clientQuestions, questionKey } from '@/app/dashboard/seo/data'

export const runtime = 'nodejs'

/**
 * Gem kundens svar på et spørgsmål fra SEO-dashboardets fane "Spørgsmål"
 * (Andreas 1/11-2026). Ingen mail: svaret gemmes i Sanity som
 * seoQuestionAnswer og vises i dashboardet og i Studio.
 *
 * Kræver login til dashboardet (samme signerede cookie som /dashboard). Uden
 * DASHBOARD_SESSION_SECRET er det kun åbent lokalt, som dashboardet selv
 * (src/proxy.ts). Nøglen skal høre til et af spørgsmålene i data.ts, så der
 * ikke kan oprettes vilkårlige dokumenter. Et tomt svar sletter det gemte.
 */

const MAX_ANSWER = 4000

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
		return NextResponse.json(
			{ error: 'For mange anmodninger' },
			{ status: 429 },
		)
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

	const key = typeof body.key === 'string' ? body.key : ''
	const question = clientQuestions.find((q) => questionKey(q) === key)
	if (!question) {
		return NextResponse.json({ error: 'Ukendt spørgsmål' }, { status: 400 })
	}
	const answer = (typeof body.answer === 'string' ? body.answer : '')
		.trim()
		.slice(0, MAX_ANSWER)

	const _id = `seo-answer.${key}`
	try {
		if (!answer) {
			await writeClient.delete(_id)
			return NextResponse.json({ ok: true, answer: null })
		}
		const doc = {
			_id,
			_type: 'seoQuestionAnswer',
			key,
			question: question.question,
			answer,
			answeredBy: session?.name || 'Lokal test',
			answeredEmail: session?.email ?? '',
			answeredAt: new Date().toISOString(),
		}
		await writeClient.createOrReplace(doc)
		return NextResponse.json({
			ok: true,
			answer: {
				text: doc.answer,
				by: doc.answeredBy,
				at: doc.answeredAt,
			},
		})
	} catch (err) {
		console.error('[seo-answer] Sanity write failed:', err)
		return NextResponse.json(
			{ error: 'Kunne ikke gemme svaret' },
			{ status: 500 },
		)
	}
}
