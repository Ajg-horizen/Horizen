import { NextResponse, type NextRequest } from 'next/server'
import { writeClient } from '@/sanity/lib/writeClient'
import {
	SESSION_COOKIE,
	sessionSecret,
	verifySession,
} from '@/lib/dashboard-session'
import { monthlyChecklist } from '@/app/dashboard/seo/data'

export const runtime = 'nodejs'

/**
 * Sætter eller fjerner et flueben i månedens SEO-tjekliste (Andreas
 * 10/11-2026). Kun Horizen-rollen; kunden ser listen, men kan ikke ændre den.
 * Uden DASHBOARD_SESSION_SECRET er det kun åbent lokalt, som dashboardet selv.
 *
 * Body: { month: 'ÅÅÅÅ-MM', stepId, done: boolean }. Gemmes i dokumentet
 * "seo-checklist.ÅÅÅÅ-MM" (privat id, type seoMonthlyChecklist).
 */

const STEP_IDS = new Set(monthlyChecklist.flatMap((p) => p.steps.map((s) => s.id)))
const MONTH = /^\d{4}-(0[1-9]|1[0-2])$/

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
			{ error: 'Mangler SANITY_API_WRITE_TOKEN, så fluebenet kan ikke gemmes her' },
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
	const stepId = typeof body.stepId === 'string' ? body.stepId : ''
	const done = body.done === true
	if (!MONTH.test(month) || !STEP_IDS.has(stepId)) {
		return NextResponse.json({ error: 'Ukendt måned eller trin' }, { status: 400 })
	}

	const _id = `seo-checklist.${month}`
	try {
		await writeClient.createIfNotExists({ _id, _type: 'seoMonthlyChecklist', month, done: [] })
		const patch = writeClient.patch(_id).unset([`done[stepId=="${stepId}"]`])
		if (done) {
			patch.append('done', [
				{
					_key: stepId,
					_type: 'checklistDone',
					stepId,
					doneAt: new Date().toISOString(),
					doneBy: session?.name || session?.email || 'Horizen',
				},
			])
		}
		await patch.commit()
	} catch (err) {
		console.error('[seo-checklist] kunne ikke gemme', err)
		return NextResponse.json({ error: 'Kunne ikke gemme fluebenet' }, { status: 500 })
	}
	return NextResponse.json({ ok: true })
}
