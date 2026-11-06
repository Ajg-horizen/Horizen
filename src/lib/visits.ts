import { client } from '@/sanity/lib/client'
import type { Ga4Period, Ga4Range } from './ga4-shared'
import { monthKey, type TrafficMonth } from './pageStats'
import { TRAFFIC_SOURCES } from './trafficSource'

/**
 * Egne tal uden cookies til fanen Performance → Besøg (se src/lib/pageStats.ts),
 * lagt i samme form som GA4-tallene, så fanen kan vise begge:
 *   totals.users     = besøg (vi genkender ikke personer, så det er besøg)
 *   totals.avgSeconds = aktiv tid pr. besøg
 *   pages.avgSeconds  = aktiv tid pr. visning af siden
 *   channels          = besøg pr. kilde (samme kilder som Henvendelser)
 * "Seneste 3 måneder" er denne og de to forrige måneder.
 */

export type OwnVisits =
	| { status: 'empty' }
	| { status: 'ok'; startedAt?: string; periods: Record<Ga4Range, Ga4Period> }

const PAGE_LIMIT = 15

function shiftMonth(month: string, by: number): string {
	const [y, m] = month.split('-').map(Number)
	const d = new Date(Date.UTC(y, m - 1 + by, 1))
	return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}

function toPeriod(months: TrafficMonth[]): Ga4Period {
	let visits = 0
	let views = 0
	let seconds = 0
	const pages = new Map<string, { views: number; seconds: number }>()
	const sources = new Map<string, number>()
	for (const m of months) {
		visits += m.visits ?? 0
		views += m.views ?? 0
		seconds += m.seconds ?? 0
		for (const p of Object.values(m.pages ?? {})) {
			const cur = pages.get(p.path) ?? { views: 0, seconds: 0 }
			cur.views += p.views ?? 0
			cur.seconds += p.seconds ?? 0
			pages.set(p.path, cur)
		}
		for (const [k, n] of Object.entries(m.sources ?? {}))
			sources.set(k, (sources.get(k) ?? 0) + (n ?? 0))
	}
	const totalSources = [...sources.values()].reduce((a, b) => a + b, 0)
	return {
		totals: { users: visits, sessions: visits, views, avgSeconds: visits ? seconds / visits : 0 },
		pages: [...pages.entries()]
			.map(([path, p]) => ({
				path,
				views: p.views,
				share: views ? (p.views / views) * 100 : 0,
				avgSeconds: p.views ? p.seconds / p.views : 0,
			}))
			.sort((a, b) => b.views - a.views)
			.slice(0, PAGE_LIMIT),
		channels: [...sources.entries()]
			.filter(([, n]) => n > 0)
			.map(([key, n]) => ({
				key,
				label: TRAFFIC_SOURCES.find((s) => s.key === key)?.label ?? key,
				users: n,
				share: totalSources ? (n / totalSources) * 100 : 0,
			}))
			.sort((a, b) => b.users - a.users),
	}
}

/** Henter de tre seneste måneders tællere med read-token; fejler blødt til 'empty'. */
export async function getOwnVisits(now = new Date()): Promise<OwnVisits> {
	const current = monthKey(now)
	const ids = [0, -1, -2].map((by) => `traffic.${shiftMonth(current, by)}`)
	try {
		const rows = await client
			.withConfig({
				token: process.env.SANITY_API_READ_TOKEN,
				useCdn: false,
				perspective: 'published',
				stega: false,
			})
			.fetch<TrafficMonth[]>(
				`*[_id in $ids]{ month, startedAt, visits, views, seconds, timed, pages, sources }`,
				{ ids },
				{ cache: 'no-store' },
			)
		if (!rows?.length) return { status: 'empty' }
		const byMonth = (m: string) => rows.filter((r) => r.month === m)
		return {
			status: 'ok',
			startedAt: rows.map((r) => r.startedAt).filter(Boolean).sort()[0],
			periods: {
				thisMonth: toPeriod(byMonth(current)),
				lastMonth: toPeriod(byMonth(shiftMonth(current, -1))),
				last90: toPeriod(rows),
			},
		}
	} catch (err) {
		console.error('[dashboard] Kunne ikke hente egne besøgstal:', err)
		return { status: 'empty' }
	}
}
