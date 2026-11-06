/**
 * Google Analytics 4 — besøg til dashboardets fane Performance → Besøg
 * (Andreas 6/11-2026): hvilke sider der bliver set, hvor længe, og hvor
 * besøgerne kommer fra. Samme OAuth-login som Search Console
 * (src/lib/search-console.ts); refresh token'et skal have scopet
 * analytics.readonly (scripts/get-refresh-token.mjs beder om begge).
 *
 *   GA4_PROPERTY_ID  — ejendommens ID (et tal, fx 412345678), IKKE G-koden.
 *                      GA4 → Administrator → Ejendomsindstillinger.
 *
 * Hentes direkte fra GA4's Data API ved hvert besøg på dashboardet (to kald
 * med batchRunReports), så tallene altid er friske og intet gemmes i Sanity.
 * GA4 tæller kun besøgende, der har accepteret statistik-cookies.
 */

import { getAccessToken } from './search-console'

import {
	GA4_RANGES,
	type Ga4Overview,
	type Ga4Period,
	type Ga4Range,
	type Ga4Totals,
} from './ga4-shared'

export { GA4_RANGES, type Ga4Overview, type Ga4Range } from './ga4-shared'

/** GA4's standardkanaler på dansk */
const CHANNEL_LABELS: Record<string, string> = {
	'Organic Search': 'Google og andre søgemaskiner',
	'Paid Search': 'Annoncer i søgning',
	Direct: 'Direkte',
	Referral: 'Links fra andre sider',
	'Organic Social': 'Sociale medier',
	'Paid Social': 'Annoncer på sociale medier',
	Email: 'Mail',
	'Organic Video': 'Video',
	'Paid Video': 'Videoannoncer',
	Display: 'Bannerannoncer',
	'Cross-network': 'Google Ads (flere netværk)',
	'Organic Shopping': 'Shopping',
	'Paid Shopping': 'Shopping-annoncer',
	'Paid Other': 'Andre annoncer',
	Affiliates: 'Partnere',
	SMS: 'SMS',
	'Mobile Push Notifications': 'Push-beskeder',
	Audio: 'Lyd',
	Unassigned: 'Ukendt',
}

const PAGE_LIMIT = 15

const pad = (n: number) => String(n).padStart(2, '0')
const day = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

function dateRange(range: Ga4Range, now: Date) {
	if (range === 'thisMonth')
		return { startDate: day(new Date(now.getFullYear(), now.getMonth(), 1)), endDate: 'today' }
	if (range === 'lastMonth')
		return {
			startDate: day(new Date(now.getFullYear(), now.getMonth() - 1, 1)),
			endDate: day(new Date(now.getFullYear(), now.getMonth(), 0)),
		}
	return { startDate: '89daysAgo', endDate: 'today' }
}

type Row = {
	dimensionValues?: { value?: string }[]
	metricValues?: { value?: string }[]
}
type Report = { rows?: Row[] }

const num = (r: Row, i: number) => Number(r.metricValues?.[i]?.value ?? 0)
const dim = (r: Row, i: number) => r.dimensionValues?.[i]?.value ?? ''

async function batch(
	propertyId: string,
	token: string,
	requests: object[],
): Promise<Report[]> {
	const res = await fetch(
		`https://analyticsdata.googleapis.com/v1beta/properties/${encodeURIComponent(propertyId)}:batchRunReports`,
		{
			method: 'POST',
			headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
			body: JSON.stringify({ requests }),
			cache: 'no-store',
		},
	)
	if (!res.ok) throw new Error(`GA4 ${res.status}: ${(await res.text()).slice(0, 300)}`)
	return ((await res.json()).reports ?? []) as Report[]
}

export async function fetchGa4Overview(now = new Date()): Promise<Ga4Overview> {
	const propertyId = process.env.GA4_PROPERTY_ID?.trim()
	if (!propertyId) return { status: 'off' }
	try {
		const token = await getAccessToken()
		const ranges = GA4_RANGES.map((r) => dateRange(r.key, now))

		// Kald 1: totaler og kanaler (alle tre perioder i ét opslag hver).
		// Med flere perioder får hver række dimensionen "dateRange" med (date_range_0 …).
		const named = ranges.map((r, i) => ({ ...r, name: `r${i}` }))
		const [totalsReport, channelReport] = await batch(propertyId, token, [
			{
				dateRanges: named,
				metrics: [
					{ name: 'activeUsers' },
					{ name: 'sessions' },
					{ name: 'screenPageViews' },
					{ name: 'userEngagementDuration' },
				],
			},
			{
				dateRanges: named,
				dimensions: [{ name: 'sessionDefaultChannelGroup' }],
				metrics: [{ name: 'activeUsers' }],
				orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
			},
		])

		// Kald 2: top-sider, ét opslag pr. periode (så hver periode får sine egne top 15)
		const pageReports = await batch(
			propertyId,
			token,
			ranges.map((r) => ({
				dateRanges: [r],
				dimensions: [{ name: 'pagePath' }],
				metrics: [
					{ name: 'screenPageViews' },
					{ name: 'activeUsers' },
					{ name: 'userEngagementDuration' },
				],
				orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
				limit: PAGE_LIMIT,
			})),
		)

		const periods = {} as Record<Ga4Range, Ga4Period>
		GA4_RANGES.forEach((range, i) => {
			const rangeName = `r${i}`
			const totalRow = totalsReport.rows?.find((r) => dim(r, 0) === rangeName)
			const users = totalRow ? num(totalRow, 0) : 0
			const totals: Ga4Totals = {
				users,
				sessions: totalRow ? num(totalRow, 1) : 0,
				views: totalRow ? num(totalRow, 2) : 0,
				avgSeconds: users && totalRow ? num(totalRow, 3) / users : 0,
			}

			const channelRows = (channelReport.rows ?? []).filter((r) => dim(r, 1) === rangeName)
			const channelUsers = channelRows.reduce((a, r) => a + num(r, 0), 0)
			const channels = channelRows
				.map((r) => {
					const key = dim(r, 0)
					return {
						key,
						label: CHANNEL_LABELS[key] ?? key,
						users: num(r, 0),
						share: channelUsers ? (num(r, 0) / channelUsers) * 100 : 0,
					}
				})
				.sort((a, b) => b.users - a.users)

			const pages = (pageReports[i]?.rows ?? []).map((r) => {
				const views = num(r, 0)
				const pageUsers = num(r, 1)
				return {
					path: dim(r, 0) || '/',
					views,
					share: totals.views ? (views / totals.views) * 100 : 0,
					avgSeconds: pageUsers ? num(r, 2) / pageUsers : 0,
				}
			})

			periods[range.key] = { totals, pages, channels }
		})
		return { status: 'ok', periods }
	} catch (err) {
		console.error('[ga4] Kunne ikke hente besøg:', err)
		return { status: 'error', message: err instanceof Error ? err.message : String(err) }
	}
}
