import { NextResponse, type NextRequest } from 'next/server'
import { writeClient } from '@/sanity/lib/writeClient'
import { DASHBOARD_NAME_HEADER, DASHBOARD_USER_HEADER } from '@/lib/dashboard-user'
import {
	NOT_SAVED,
	REDIRECTED,
	measureBoth,
	pageHealthKey,
	pageHealthUrl,
	savePageHealth,
} from '@/lib/pagespeed'
import { healthCheckCustomerCanRun } from '../data'
import { exampleEntry } from './example'

export const runtime = 'nodejs'
// To Lighthouse-målinger hos Google (parallelt) tager typisk 15-30 sek.
export const maxDuration = 60

/**
 * "Mål nu" under Performance → Sidens helbred: måler forsiden (mobil +
 * computer) og gemmer målingen i Sanity som den nyeste. Den faste måling
 * kommer ellers den 3. i hver måned (/api/cron/page-health).
 *
 * Ligger under /dashboard, så adgangs-gaten i src/proxy.ts også dækker ruten
 * og sætter brugernavnet. Horizen må altid; kunden kun, hvis
 * healthCheckCustomerCanRun er slået til i data.ts. Kunden får en kort pause
 * (COOLDOWN) mellem to målinger, så et dobbeltklik ikke giver to.
 * Lokalt uden nøgle eller https-domæne svares med eksempeldata (gemmes ikke).
 */

/** Pause mellem to målinger for kunden (Horizen kan altid måle) */
const COOLDOWN = 10 * 60_000

export async function POST(request: NextRequest) {
	const user = request.headers.get(DASHBOARD_USER_HEADER)
	const isHorizen = user === 'horizen'
	const measuredBy =
		decodeURIComponent(request.headers.get(DASHBOARD_NAME_HEADER) ?? '') ||
		undefined
	if (!isHorizen && !(user === 'kunde' && healthCheckCustomerCanRun))
		return NextResponse.json({ error: 'forbidden' }, { status: 403 })

	const url = pageHealthUrl()
	const key = pageHealthKey()
	if ((!url || !key) && process.env.NODE_ENV !== 'production') {
		// Lille pause, så "måler nu" også kan ses lokalt
		await new Promise((r) => setTimeout(r, 2500))
		return NextResponse.json({
			entry: {
				...exampleEntry(new Date(), 0, isHorizen ? 'horizen' : 'kunde'),
				measuredBy,
			},
			example: true,
		})
	}
	if (!key) return NextResponse.json({ error: 'no-key' }, { status: 500 })
	if (!url) return NextResponse.json({ error: 'no-url' }, { status: 500 })

	if (!isHorizen) {
		const last = await writeClient
			.fetch<
				string | null
			>(`*[_type == "pageHealth" && trigger != "cron"] | order(measuredAt desc)[0].measuredAt`)
			.catch(() => null)
		if (last && Date.now() - new Date(last).getTime() < COOLDOWN)
			return NextResponse.json({ error: 'cooldown' }, { status: 429 })
	}

	try {
		const entry = await savePageHealth(
			await measureBoth(url, key),
			isHorizen ? 'horizen' : 'kunde',
			measuredBy,
		)
		return NextResponse.json({ entry })
	} catch (err) {
		console.error('[helbred]', err)
		const message = err instanceof Error ? err.message : ''
		const error = /\b429\b/.test(message)
			? 'quota'
			: message.startsWith(REDIRECTED)
				? 'redirected'
				: message.startsWith(NOT_SAVED)
					? 'not-saved'
					: 'failed'
		return NextResponse.json({ error }, { status: 502 })
	}
}
