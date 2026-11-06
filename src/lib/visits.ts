import { client } from '@/sanity/lib/client'
import { fetchGa4Raw, ga4Configured, type RawVisits } from './ga4'
import type { Ga4Period, Ga4Range, VisitsOverview } from './ga4-shared'
import { monthKey, type TrafficMonth } from './pageStats'
import { TRAFFIC_SOURCES, type TrafficSource } from './trafficSource'

/**
 * Fanen Performance → Besøg (Andreas 6/11-2026): ÉT samlet billede.
 *
 * Sitets egen tæller uden cookies (src/lib/pageStats.ts) er kilden fra den dag,
 * den startede (startedAt på første måneds-dokument). For dagene før hentes
 * Google Analytics (src/lib/ga4.ts), så historikken er med. De to perioder
 * overlapper aldrig, så intet besøg tælles to gange:
 *
 *   Google Analytics  [periodens start … dagen før tælleren startede]
 *   Egne tal          [tælleren startede … periodens slut]
 *
 * GA's kanaler er oversat til sitets egne kilder, så listen er den samme.
 */

const PAGE_LIMIT = 15

/** "ÅÅÅÅ-MM-DD" i dansk tid */
function dayKey(d: Date): string {
	return new Intl.DateTimeFormat('en-CA', {
		timeZone: 'Europe/Copenhagen',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	}).format(d)
}

function shiftMonth(month: string, by: number): string {
	const [y, m] = month.split('-').map(Number)
	const d = new Date(Date.UTC(y, m - 1 + by, 1))
	return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}

function lastDayOf(month: string): string {
	const [y, m] = month.split('-').map(Number)
	return `${month}-${String(new Date(Date.UTC(y, m, 0)).getUTCDate()).padStart(2, '0')}`
}

function dayBefore(day: string): string {
	const d = new Date(`${day}T12:00:00Z`)
	d.setUTCDate(d.getUTCDate() - 1)
	return d.toISOString().slice(0, 10)
}

const emptyRaw = (): RawVisits => ({
	visits: 0,
	views: 0,
	seconds: 0,
	pages: new Map(),
	sources: new Map(),
})

/** Lægger egne måneds-dokumenter og GA-tal sammen til ét sæt rå summer */
function merge(parts: RawVisits[]): RawVisits {
	const out = emptyRaw()
	for (const p of parts) {
		out.visits += p.visits
		out.views += p.views
		out.seconds += p.seconds
		for (const [path, v] of p.pages) {
			const cur = out.pages.get(path) ?? { views: 0, seconds: 0 }
			cur.views += v.views
			cur.seconds += v.seconds
			out.pages.set(path, cur)
		}
		for (const [k, n] of p.sources) out.sources.set(k, (out.sources.get(k) ?? 0) + n)
	}
	return out
}

function fromOwn(m: TrafficMonth): RawVisits {
	const raw = emptyRaw()
	raw.visits = m.visits ?? 0
	raw.views = m.views ?? 0
	raw.seconds = m.seconds ?? 0
	for (const p of Object.values(m.pages ?? {}))
		raw.pages.set(p.path, { views: p.views ?? 0, seconds: p.seconds ?? 0 })
	for (const [k, n] of Object.entries(m.sources ?? {}))
		raw.sources.set(k as TrafficSource, n ?? 0)
	return raw
}

function toPeriod(raw: RawVisits): Ga4Period {
	const totalSources = [...raw.sources.values()].reduce((a, b) => a + b, 0)
	return {
		totals: {
			visits: raw.visits,
			views: raw.views,
			avgSeconds: raw.visits ? raw.seconds / raw.visits : 0,
		},
		pages: [...raw.pages.entries()]
			.map(([path, p]) => ({
				path,
				views: p.views,
				share: raw.views ? (p.views / raw.views) * 100 : 0,
				avgSeconds: p.views ? p.seconds / p.views : 0,
			}))
			.filter((p) => p.views > 0)
			.sort((a, b) => b.views - a.views)
			.slice(0, PAGE_LIMIT),
		channels: [...raw.sources.entries()]
			.filter(([, n]) => n > 0)
			.map(([key, n]) => ({
				key,
				label: TRAFFIC_SOURCES.find((s) => s.key === key)?.label ?? key,
				visits: n,
				share: totalSources ? (n / totalSources) * 100 : 0,
			}))
			.sort((a, b) => b.visits - a.visits),
	}
}

async function getOwnMonths(months: string[]): Promise<TrafficMonth[]> {
	try {
		return (
			(await client
				.withConfig({
					token: process.env.SANITY_API_READ_TOKEN,
					useCdn: false,
					perspective: 'published',
					stega: false,
				})
				.fetch<TrafficMonth[]>(
					`*[_id in $ids]{ month, startedAt, visits, views, seconds, timed, pages, sources }`,
					{ ids: months.map((m) => `traffic.${m}`) },
					{ cache: 'no-store' },
				)) ?? []
		)
	} catch (err) {
		console.error('[dashboard] Kunne ikke hente egne besøgstal:', err)
		return []
	}
}

export async function getVisits(now = new Date()): Promise<VisitsOverview> {
	const current = monthKey(now)
	const months = [current, shiftMonth(current, -1), shiftMonth(current, -2)]
	const own = await getOwnMonths(months)
	return combineVisits(own, now, ga4Configured() ? fetchGa4Raw : null)
}

/**
 * Syr egne måneds-dokumenter og GA-tal sammen (adskilt fra hentningen, så
 * det kan testes med eksempeltal). fetchGa = null: kun egne tal.
 */
export async function combineVisits(
	own: TrafficMonth[],
	now: Date,
	fetchGa: ((start: string, end: string) => Promise<RawVisits>) | null,
): Promise<VisitsOverview> {
	const current = monthKey(now)
	const today = dayKey(now)
	const months = [current, shiftMonth(current, -1), shiftMonth(current, -2)]

	// Dagen, tælleren startede; GA bruges kun til og med dagen før
	const startedAt = own.map((m) => m.startedAt).filter(Boolean).sort()[0]
	const ownSince = startedAt ? dayKey(new Date(startedAt)) : undefined
	const gaLast = ownSince ? dayBefore(ownSince) : today

	const ranges: Record<Ga4Range, { start: string; end: string; months: string[] }> = {
		thisMonth: { start: `${current}-01`, end: today, months: [current] },
		lastMonth: { start: `${months[1]}-01`, end: lastDayOf(months[1]), months: [months[1]] },
		last3: { start: `${months[2]}-01`, end: today, months },
	}

	let gaError: string | undefined
	let gaUsed = false
	const periods = {} as Record<Ga4Range, Ga4Period>
	await Promise.all(
		(Object.keys(ranges) as Ga4Range[]).map(async (key) => {
			const r = ranges[key]
			const parts = own.filter((m) => r.months.includes(m.month)).map(fromOwn)
			const gaEnd = r.end < gaLast ? r.end : gaLast
			if (fetchGa && r.start <= gaEnd) {
				try {
					parts.push(await fetchGa(r.start, gaEnd))
					gaUsed = true
				} catch (err) {
					console.error('[ga4] Kunne ikke hente besøg:', err)
					gaError = err instanceof Error ? err.message : String(err)
				}
			}
			periods[key] = toPeriod(merge(parts))
		}),
	)

	const hasData = Object.values(periods).some((p) => p.totals.views > 0)
	if (!hasData) return { status: 'empty', gaError }
	return {
		status: 'ok',
		periods,
		ownSince,
		gaUntil: gaUsed ? gaLast : undefined,
		gaError,
	}
}
