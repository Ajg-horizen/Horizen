import { NextResponse, type NextRequest } from 'next/server'
import { writeClient } from '@/sanity/lib/writeClient'
import {
	SESSION_COOKIE,
	sessionSecret,
	verifySession,
} from '@/lib/dashboard-session'
import { DIRECTORY_STEP_IDS } from '@/app/dashboard/seo/directories'

export const runtime = 'nodejs'

/**
 * Sætter et punkt i tjeklisten "Profiler og kataloger" (Andreas 23/11-2026).
 * Kun Horizen-rollen; kunden ser listen, men kan ikke ændre den. Uden
 * DASHBOARD_SESSION_SECRET er det kun åbent lokalt, som dashboardet selv.
 *
 * Body: { stepId, status: 'done' | 'skip' | 'open' }. Gemmes i dokumentet
 * "seo-directories.status" (privat id, type seoDirectoryChecklist). 'open'
 * fjerner punktet igen.
 */

const DOC_ID = 'seo-directories.status'
const STATUSES = new Set(['done', 'skip', 'open'])

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
	const stepId = typeof body.stepId === 'string' ? body.stepId : ''
	const status = typeof body.status === 'string' ? body.status : ''
	if (!DIRECTORY_STEP_IDS.has(stepId) || !STATUSES.has(status)) {
		return NextResponse.json({ error: 'Ukendt punkt eller status' }, { status: 400 })
	}

	try {
		await writeClient.createIfNotExists({ _id: DOC_ID, _type: 'seoDirectoryChecklist', items: [] })
		const patch = writeClient.patch(DOC_ID).unset([`items[stepId=="${stepId}"]`])
		if (status !== 'open') {
			patch.append('items', [
				{
					_key: stepId,
					_type: 'directoryMark',
					stepId,
					status,
					at: new Date().toISOString(),
					by: session?.name || session?.email || 'Horizen',
				},
			])
		}
		await patch.commit()
	} catch (err) {
		console.error('[seo-directories] kunne ikke gemme', err)
		return NextResponse.json({ error: 'Kunne ikke gemme punktet' }, { status: 500 })
	}
	return NextResponse.json({ ok: true })
}
