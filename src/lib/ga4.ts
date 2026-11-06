/**
 * Google Analytics 4 — rå besøgstal for en datoperiode til fanen
 * Performance → Besøg (src/lib/visits.ts syr dem sammen med sitets egne tal).
 * Samme OAuth-login som Search Console (src/lib/search-console.ts); refresh
 * token'et skal have scopet analytics.readonly (scripts/get-refresh-token.mjs
 * beder om begge).
 *
 *   GA4_PROPERTY_ID  — ejendommens ID (et tal, fx 412345678), IKKE G-koden.
 *                      GA4 → Administrator → Ejendomsindstillinger.
 *
 * Bruges kun for dagene FØR sitets egen tæller startede, så de to kilder
 * aldrig tæller det samme besøg. GA4 tæller kun besøgende, der har accepteret
 * statistik-cookies. Hentes direkte ved hvert besøg på dashboardet; intet gemmes.
 */

import { getAccessToken } from './search-console'
import type { TrafficSource } from './trafficSource'

/** Rå summer, så de kan lægges sammen med egne tal */
export type RawVisits = {
	visits: number
	views: number
	seconds: number
	pages: Map<string, { views: number; seconds: number }>
	sources: Map<TrafficSource, number>
}

/** GA4's standardkanaler oversat til sitets egne kilder (src/lib/trafficSource.ts) */
const CHANNEL_SOURCE: Record<string, TrafficSource> = {
	'Organic Search': 'google_organic',
	'Paid Search': 'google_ads',
	'Cross-network': 'google_ads',
	Display: 'google_ads',
	'Paid Shopping': 'google_ads',
	'Paid Video': 'google_ads',
	'Paid Other': 'google_ads',
	'Organic Social': 'social',
	'Paid Social': 'social',
	'AI Assistant': 'ai',
	Direct: 'direct',
	Unassigned: 'direct',
}

const PAGE_LIMIT = 250

type Row = {
	dimensionValues?: { value?: string }[]
	metricValues?: { value?: string }[]
}
type Report = { rows?: Row[] }

const num = (r: Row, i: number) => Number(r.metricValues?.[i]?.value ?? 0)
const dim = (r: Row, i: number) => r.dimensionValues?.[i]?.value ?? ''

export const ga4Configured = () => Boolean(process.env.GA4_PROPERTY_ID?.trim())

/** Besøg, sidevisninger, tid, sider og kilder fra GA4 for [startDate, endDate] (ÅÅÅÅ-MM-DD) */
export async function fetchGa4Raw(startDate: string, endDate: string): Promise<RawVisits> {
	const propertyId = process.env.GA4_PROPERTY_ID?.trim()
	if (!propertyId) throw new Error('GA4_PROPERTY_ID mangler')
	const token = await getAccessToken()
	const dateRanges = [{ startDate, endDate }]
	const res = await fetch(
		`https://analyticsdata.googleapis.com/v1beta/properties/${encodeURIComponent(propertyId)}:batchRunReports`,
		{
			method: 'POST',
			headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
			body: JSON.stringify({
				requests: [
					{
						dateRanges,
						metrics: [
							{ name: 'sessions' },
							{ name: 'screenPageViews' },
							{ name: 'userEngagementDuration' },
						],
					},
					{
						dateRanges,
						dimensions: [{ name: 'pagePath' }],
						metrics: [{ name: 'screenPageViews' }, { name: 'userEngagementDuration' }],
						orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
						limit: PAGE_LIMIT,
					},
					{
						dateRanges,
						dimensions: [{ name: 'sessionDefaultChannelGroup' }],
						metrics: [{ name: 'sessions' }],
					},
				],
			}),
			cache: 'no-store',
		},
	)
	if (!res.ok) throw new Error(`GA4 ${res.status}: ${(await res.text()).slice(0, 300)}`)
	const [totals, pages, channels] = ((await res.json()).reports ?? []) as Report[]

	const t = totals?.rows?.[0]
	const raw: RawVisits = {
		visits: t ? num(t, 0) : 0,
		views: t ? num(t, 1) : 0,
		seconds: t ? num(t, 2) : 0,
		pages: new Map(),
		sources: new Map(),
	}
	for (const r of pages?.rows ?? []) {
		raw.pages.set(dim(r, 0) || '/', { views: num(r, 0), seconds: num(r, 1) })
	}
	for (const r of channels?.rows ?? []) {
		const key = CHANNEL_SOURCE[dim(r, 0)] ?? 'referral'
		raw.sources.set(key, (raw.sources.get(key) ?? 0) + num(r, 0))
	}
	return raw
}
