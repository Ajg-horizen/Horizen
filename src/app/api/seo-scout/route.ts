import { NextResponse, type NextRequest } from 'next/server'
import { writeClient } from '@/sanity/lib/writeClient'
import {
	SESSION_COOKIE,
	sessionSecret,
	verifySession,
} from '@/lib/dashboard-session'

export const runtime = 'nodejs'

/**
 * Horizens svar på SEO-spejderens månedsrapport (Andreas 27/11-2026).
 * Kun Horizen-rollen; uden DASHBOARD_SESSION_SECRET kun åbent lokalt.
 *
 * Body (altid med month: 'ÅÅÅÅ-MM'):
 * - { action: 'log', key, decision: 'godkendt' | 'afvist' | 'afventer', hours? }
 *   Godkender eller afviser et forslag til aktivitetsloggen. Timerne sætter
 *   Andreas selv; spejderen sætter aldrig timer.
 * - { action: 'insight', insight }  Gemmer Andreas' egen indsigt i kundebeskeden.
 * - { action: 'message', ready: boolean }  Kladden er klar til fanen Beskeder.
 *
 * Gemmes i dokumentet "seo-scout.ÅÅÅÅ-MM" (type seoScoutReport), som
 * spejderen selv opretter.
 */
const MONTH = /^\d{4}-(0[1-9]|1[0-2])$/
const KEY = /^[A-Za-z0-9_-]{1,64}$/
const MAX_TEXT = 3000

export async function POST(request: NextRequest) {
	const secret = sessionSecret()
	const session = secret
		? await verifySession(request.cookies.get(SESSION_COOKIE)?.value, secret)
		: null
	const local = !secret && process.env.NODE_ENV !== 'production'
	if (!local && session?.role !== 'horizen') {
		return NextResponse.json({ error: 'Kun for Horizen' }, { status: 403 })
	}
	if (!process.env.SANITY_API_WRITE_TOKEN) {
		return NextResponse.json(
			{ error: 'Mangler SANITY_API_WRITE_TOKEN, så svaret kan ikke gemmes her' },
			{ status: 500 },
		)
	}

	let body: Record<string, unknown>
	try {
		body = (await request.json()) as Record<string, unknown>
	} catch {
		return NextResponse.json({ error: 'Ugyldig anmodning' }, { status: 400 })
	}
	const month = typeof body.month === 'string' ? body.month : ''
	if (!MONTH.test(month)) {
		return NextResponse.json({ error: 'Ukendt måned' }, { status: 400 })
	}
	const _id = `seo-scout.${month}`
	const by = session?.name || session?.email || 'Horizen'
	const now = new Date().toISOString()

	try {
		const exists = await writeClient.fetch<string | null>(`*[_id == $id][0]._id`, { id: _id })
		if (!exists) {
			return NextResponse.json({ error: 'Spejderens rapport findes ikke' }, { status: 404 })
		}

		if (body.action === 'log') {
			const key = typeof body.key === 'string' ? body.key : ''
			const decision = body.decision
			if (!KEY.test(key) || (decision !== 'godkendt' && decision !== 'afvist' && decision !== 'afventer')) {
				return NextResponse.json({ error: 'Ukendt forslag eller beslutning' }, { status: 400 })
			}
			const rawHours = typeof body.hours === 'number' ? body.hours : Number(body.hours)
			const hours = Number.isFinite(rawHours) && rawHours > 0 && rawHours <= 100 ? Math.round(rawHours * 4) / 4 : null
			const base = `logDrafts[_key=="${key}"]`
			const patch = writeClient.patch(_id).set({
				[`${base}.status`]: decision,
				[`${base}.decidedAt`]: decision === 'afventer' ? null : now,
				[`${base}.decidedBy`]: decision === 'afventer' ? null : by,
			})
			if (decision === 'godkendt' && hours) patch.set({ [`${base}.hours`]: hours })
			else patch.unset([`${base}.hours`])
			await patch.commit()
		} else if (body.action === 'insight') {
			const insight = typeof body.insight === 'string' ? body.insight.slice(0, MAX_TEXT) : ''
			await writeClient.patch(_id).setIfMissing({ message: {} }).set({ 'message.insight': insight }).commit()
		} else if (body.action === 'message') {
			const ready = body.ready === true
			await writeClient
				.patch(_id)
				.setIfMissing({ message: {} })
				.set({ 'message.status': ready ? 'klar' : 'kladde' })
				.commit()
		} else {
			return NextResponse.json({ error: 'Ukendt handling' }, { status: 400 })
		}
	} catch (err) {
		console.error('[seo-scout] kunne ikke gemme', err)
		return NextResponse.json({ error: 'Kunne ikke gemme' }, { status: 500 })
	}
	return NextResponse.json({ ok: true })
}
