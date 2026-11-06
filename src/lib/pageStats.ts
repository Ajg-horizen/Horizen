import { createClient, type Patch } from '@sanity/client'
import { projectId } from '@/sanity/env'
import type { TrafficSource } from './trafficSource'

/**
 * Anonym besøgstæller uden cookies (Andreas 6/11-2026) til fanen
 * Performance → Besøg: besøg, sidevisninger, tid pr. side og kilde for ALLE
 * besøgende, også dem der siger nej til cookies. Supplerer GA4, som kun ser
 * dem, der har sagt ja.
 *
 * Intet gemmes i browseren og ingen IP-adresser eller id'er gemmes her: kun
 * samlede tal pr. måned i ét dokument, "traffic.ÅÅÅÅ-MM" (punktum = privat id,
 * læses kun med SANITY_API_READ_TOKEN). Tallene lægges til med atomare inc(),
 * så samtidige besøg ikke overskriver hinanden.
 *
 *   visits  = sider, et besøg landede på (første side i et nyt faneblad)
 *   views   = alle sidevisninger
 *   pages.<nøgle> = { path, views, seconds, timed } (timed = antal tidsmålinger)
 *   sources.<kilde> = besøg pr. kilde (Google Ads, organisk osv.)
 *
 * Som siteEvents.ts tæller kun Vercel Production, så test og previews ikke
 * kommer med, og der skrives også til development, så dashboardet lokalt
 * viser det samme.
 */

export type PageStat = { path: string; views: number; seconds: number; timed: number }

export type TrafficMonth = {
	month: string
	startedAt?: string
	visits?: number
	views?: number
	seconds?: number
	timed?: number
	pages?: Record<string, PageStat>
	sources?: Partial<Record<TrafficSource, number>>
}

/** Højst 30 min pr. måling, så en glemt fane ikke trækker gennemsnittet op */
export const MAX_SECONDS = 30 * 60

/** "ÅÅÅÅ-MM" i dansk tid */
export function monthKey(now = new Date()): string {
	const parts = new Intl.DateTimeFormat('en-CA', {
		timeZone: 'Europe/Copenhagen',
		year: 'numeric',
		month: '2-digit',
	}).formatToParts(now)
	const get = (t: string) => parts.find((p) => p.type === t)?.value
	return `${get('year')}-${get('month')}`
}

/** Stien som feltnavn ("/cases/acp" → "p_cases_acp"); stien selv gemmes i path */
const pageKey = (path: string) =>
	`p${path.replace(/[^a-zA-Z0-9]/g, '_')}`.slice(0, 120)

const docId = (month: string) => `traffic.${month}`

async function write(
	month: string,
	build: (patch: Patch) => Patch,
) {
	const token = process.env.SANITY_API_WRITE_TOKEN
	const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
	if (!token || process.env.VERCEL_ENV !== 'production') return
	const datasets = dataset === 'production' ? ['production', 'development'] : [dataset]

	for (const ds of datasets) {
		try {
			const client = createClient({
				projectId,
				dataset: ds,
				apiVersion: '2024-01-01',
				token,
				useCdn: false,
			})
			await client
				.transaction()
				.createIfNotExists({
					_id: docId(month),
					_type: 'siteTraffic',
					month,
					startedAt: new Date().toISOString(),
					visits: 0,
					views: 0,
					seconds: 0,
					timed: 0,
					pages: {},
					sources: {},
				})
				.patch(build(client.patch(docId(month))))
				.commit()
		} catch (err) {
			// Tælleren må aldrig vælte noget for den besøgende
			console.error(`[pageStats] kunne ikke gemme i ${ds}`, err)
		}
	}
}

/** En sidevisning; landing = første side i besøget (tæller som et besøg med kilde) */
export async function recordPageview(
	path: string,
	landing: boolean,
	source: TrafficSource,
): Promise<void> {
	const k = pageKey(path)
	await write(monthKey(), (p) => {
		let patch = p.setIfMissing({ [`pages.${k}`]: { path, views: 0, seconds: 0, timed: 0 } })
		if (landing) patch = patch.setIfMissing({ [`sources.${source}`]: 0 })
		return patch.inc({
			views: 1,
			[`pages.${k}.views`]: 1,
			...(landing && { visits: 1, [`sources.${source}`]: 1 }),
		})
	})
}

/** Aktiv tid på en side (sekunder, sendt når siden forlades) */
export async function recordTime(path: string, seconds: number): Promise<void> {
	const s = Math.max(0, Math.min(MAX_SECONDS, Math.round(seconds)))
	if (!s) return
	const k = pageKey(path)
	await write(monthKey(), (p) =>
		p
			.setIfMissing({ [`pages.${k}`]: { path, views: 0, seconds: 0, timed: 0 } })
			.inc({ seconds: s, timed: 1, [`pages.${k}.seconds`]: s, [`pages.${k}.timed`]: 1 }),
	)
}
