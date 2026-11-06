import { createClient } from '@sanity/client'
import { client } from '@/sanity/lib/client'
import { projectId } from '@/sanity/env'
import type { Company } from './companyLookup'
import type { CompaniesOverview, CompaniesPeriod } from './companies-shared'
import type { Ga4Range } from './ga4-shared'
import { monthKey } from './pageStats'
import { TRAFFIC_SOURCES, type TrafficSource } from './trafficSource'

/**
 * Besøgende → Virksomheder (Andreas 6/11-2026): hvilke virksomheder der
 * kigger forbi, ud fra hvem nettet er registreret til (src/lib/companyLookup.ts).
 *
 * Gemmes som ét privat dokument pr. måned, "companies.ÅÅÅÅ-MM". Kun
 * virksomhedens navn, land, sider, kilder og antal. Ingen IP-adresser, ingen
 * personer, intet i browseren. Som pageStats.ts tæller kun Vercel Production,
 * og der skrives også til development.
 *
 *   checked = besøg, der blev slået op · matched = heraf fra en virksomhed
 *   c.<nøgle> = { name, country, visits, views, firstSeen, lastSeen,
 *                 pages.<side> = { path, views }, sources.<kilde> = antal }
 */

type CompanyDoc = {
	name: string
	country?: string
	visits?: number
	views?: number
	firstSeen?: string
	lastSeen?: string
	pages?: Record<string, { path: string; views?: number }>
	sources?: Partial<Record<TrafficSource, number>>
}

type CompaniesMonth = {
	month: string
	startedAt?: string
	checked?: number
	matched?: number
	c?: Record<string, CompanyDoc>
}

const pageKey = (path: string) => `p${path.replace(/[^a-zA-Z0-9]/g, '_')}`.slice(0, 120)
const docId = (month: string) => `companies.${month}`

/** Én sidevisning. company = null: besøget kom ikke fra en virksomheds net. */
export async function recordCompanyView(
	company: Company | null,
	path: string,
	landing: boolean,
	source: TrafficSource,
): Promise<void> {
	// Kun det første opslag i et besøg tæller med i "slået op"; resten er
	// uinteressante, når der ikke er en virksomhed
	if (!company && !landing) return
	const token = process.env.SANITY_API_WRITE_TOKEN
	const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
	if (!token || process.env.VERCEL_ENV !== 'production') return

	const month = monthKey()
	const now = new Date().toISOString()
	const datasets = dataset === 'production' ? ['production', 'development'] : [dataset]
	for (const ds of datasets) {
		try {
			const sanity = createClient({ projectId, dataset: ds, apiVersion: '2024-01-01', token, useCdn: false })
			let patch = sanity.patch(docId(month))
			if (landing) patch = patch.inc({ checked: 1, ...(company && { matched: 1 }) })
			if (company) {
				const c = `c.${company.key}`
				const pk = pageKey(path)
				patch = patch
					.setIfMissing({
						[c]: {
							name: company.name,
							country: company.country,
							visits: 0,
							views: 0,
							firstSeen: now,
							pages: {},
							sources: {},
						},
					})
					.setIfMissing({ [`${c}.pages.${pk}`]: { path, views: 0 } })
				if (landing) patch = patch.setIfMissing({ [`${c}.sources.${source}`]: 0 })
				patch = patch.inc({
					[`${c}.views`]: 1,
					[`${c}.pages.${pk}.views`]: 1,
					...(landing && { [`${c}.visits`]: 1, [`${c}.sources.${source}`]: 1 }),
				})
			}
			let tx = sanity
				.transaction()
				.createIfNotExists({
					_id: docId(month),
					_type: 'siteCompanies',
					month,
					startedAt: now,
					checked: 0,
					matched: 0,
					c: {},
				})
				.patch(patch)
			// Sanity udfører set før setIfMissing i samme patch, så "senest set"
			// kommer i en patch for sig, efter at virksomheden er oprettet
			if (company)
				tx = tx.patch(sanity.patch(docId(month)).set({ [`c.${company.key}.lastSeen`]: now }))
			await tx.commit()
		} catch (err) {
			// Må aldrig vælte noget for den besøgende
			console.error(`[companies] kunne ikke gemme i ${ds}`, err)
		}
	}
}

function shiftMonth(month: string, by: number): string {
	const [y, m] = month.split('-').map(Number)
	const d = new Date(Date.UTC(y, m - 1 + by, 1))
	return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}

const sourceLabel = (k: string) => TRAFFIC_SOURCES.find((s) => s.key === k)?.label ?? k

/** Lægger måneder sammen til én liste over virksomheder */
function toPeriod(months: CompaniesMonth[]): CompaniesPeriod {
	type Merged = {
		name: string
		country?: string
		visits: number
		views: number
		lastSeen?: string
		pages: Map<string, number>
		sources: Map<string, number>
	}
	const merged = new Map<string, Merged>()
	let checked = 0
	let matched = 0
	for (const m of months) {
		checked += m.checked ?? 0
		matched += m.matched ?? 0
		for (const [key, c] of Object.entries(m.c ?? {})) {
			const cur: Merged = merged.get(key) ?? {
				name: c.name,
				country: c.country,
				visits: 0,
				views: 0,
				pages: new Map(),
				sources: new Map(),
			}
			cur.visits += c.visits ?? 0
			cur.views += c.views ?? 0
			if (c.lastSeen && (!cur.lastSeen || c.lastSeen > cur.lastSeen)) cur.lastSeen = c.lastSeen
			for (const p of Object.values(c.pages ?? {}))
				cur.pages.set(p.path, (cur.pages.get(p.path) ?? 0) + (p.views ?? 0))
			for (const [s, n] of Object.entries(c.sources ?? {}))
				cur.sources.set(s, (cur.sources.get(s) ?? 0) + (n ?? 0))
			merged.set(key, cur)
		}
	}
	return {
		checked,
		matched,
		companies: [...merged.entries()]
			.map(([key, c]) => ({
				key,
				name: c.name,
				country: c.country,
				visits: c.visits,
				views: c.views,
				lastSeen: c.lastSeen,
				pages: [...c.pages.entries()]
					.map(([path, views]) => ({ path, views }))
					.sort((a, b) => b.views - a.views),
				sources: [...c.sources.entries()]
					.filter(([, n]) => n > 0)
					.map(([s, n]) => ({ label: sourceLabel(s), visits: n }))
					.sort((a, b) => b.visits - a.visits),
			}))
			.filter((c) => c.views > 0)
			// Senest set først, så nye besøg står øverst
			.sort((a, b) => (b.lastSeen ?? '').localeCompare(a.lastSeen ?? '') || b.views - a.views),
	}
}

export async function getCompanies(now = new Date()): Promise<CompaniesOverview> {
	let months: CompaniesMonth[] = []
	try {
		months =
			(await client
				.withConfig({
					token: process.env.SANITY_API_READ_TOKEN,
					useCdn: false,
					perspective: 'published',
					stega: false,
				})
				.fetch<CompaniesMonth[]>(
					`*[_type == "siteCompanies" && string::startsWith(_id, "companies.")]{ month, startedAt, checked, matched, c }`,
					{},
					{ cache: 'no-store' },
				)) ?? []
	} catch (err) {
		console.error('[dashboard] Kunne ikke hente virksomheder:', err)
	}

	const current = monthKey(now)
	const back = (n: number) => Array.from({ length: n }, (_, i) => shiftMonth(current, -i))
	const pick: Record<Ga4Range, string[] | 'all'> = {
		thisMonth: [current],
		lastMonth: [shiftMonth(current, -1)],
		last3: back(3),
		last12: back(12),
		all: 'all',
	}
	const periods = {} as Record<Ga4Range, CompaniesPeriod>
	for (const key of Object.keys(pick) as Ga4Range[]) {
		const want = pick[key]
		periods[key] = toPeriod(months.filter((m) => want === 'all' || want.includes(m.month)))
	}
	const started = months.map((m) => m.startedAt).filter(Boolean).sort()[0]
	return { periods, since: started?.slice(0, 10) }
}
