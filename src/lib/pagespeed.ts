import 'server-only'
import { createClient } from '@sanity/client'
import type {
	HealthEntry,
	HealthResult,
	HealthStrategy,
	HealthTrigger,
} from '@/app/dashboard/seo/helbred/types'

/**
 * "Sidens helbred": måler forsiden med Googles PageSpeed Insights (Lighthouse)
 * og gemmer resultatet i Sanity som et pageHealth-dokument. Bruges af den
 * månedlige cron (/api/cron/page-health) og af "Mål nu" i dashboardet
 * (/dashboard/seo/helbred).
 *
 * Kræver PAGESPEED_API_KEY (gratis, Google Cloud → PageSpeed Insights API):
 * uden nøgle giver Google ingen kvote. Adressen er PAGESPEED_URL, ellers
 * NEXT_PUBLIC_BASE_URL, og kommer aldrig udefra.
 */

const CATEGORIES = [
	'performance',
	'accessibility',
	'best-practices',
	'seo',
] as const

/** Laboratoriemålinger fra Lighthouse, i den rækkefølge de vises */
const LAB_AUDITS = [
	'first-contentful-paint',
	'largest-contentful-paint',
	'total-blocking-time',
	'cumulative-layout-shift',
	'speed-index',
] as const

/** Rigtige brugere (Chrome-data, kun ved nok trafik) */
const FIELD_METRICS = [
	'LARGEST_CONTENTFUL_PAINT_MS',
	'INTERACTION_TO_NEXT_PAINT',
	'CUMULATIVE_LAYOUT_SHIFT_SCORE',
] as const

/** Forsidens https-adresse, eller null (localhost, preview eller ikke sat) */
export function pageHealthUrl(): string | null {
	const raw = (
		process.env.PAGESPEED_URL ||
		process.env.NEXT_PUBLIC_BASE_URL ||
		''
	).trim()
	try {
		const url = new URL(raw)
		if (
			url.protocol !== 'https:' ||
			/^(localhost|127\.|\[::1\])/.test(url.hostname)
		)
			return null
		return url.origin + '/'
	} catch {
		return null
	}
}

export const pageHealthKey = () => process.env.PAGESPEED_API_KEY?.trim() || null

/** Fejltekst, når forsiden sender videre til et andet domæne */
export const REDIRECTED = 'Forsiden sendte videre til'
/** Fejltekst, når målingen ikke kunne gemmes (oftest mangler SANITY_API_WRITE_TOKEN) */
export const NOT_SAVED = 'Kunne ikke gemme målingen i Sanity'

/** Kør én Lighthouse-måling hos Google (typisk 15-30 sek.) */
export async function measurePage(
	url: string,
	strategy: HealthStrategy,
	key: string,
): Promise<HealthResult> {
	const api = new URL(
		'https://www.googleapis.com/pagespeedonline/v5/runPagespeed',
	)
	api.searchParams.set('url', url)
	api.searchParams.set('strategy', strategy)
	api.searchParams.set('locale', 'da')
	// API'et vil have kategorinavnene som BEST_PRACTICES osv.; "best-practices"
	// afvises i stilhed, så God praksis ellers altid kommer tilbage uden score
	for (const c of CATEGORIES)
		api.searchParams.append('category', c.toUpperCase().replace('-', '_'))
	api.searchParams.set('key', key)

	const res = await fetch(api, {
		cache: 'no-store',
		signal: AbortSignal.timeout(55_000),
	})
	if (!res.ok)
		throw new Error(
			`PageSpeed svarede ${res.status}: ${(await res.text()).slice(0, 300)}`,
		)
	const json = await res.json()
	// Fx Vercels login-side på en beskyttet adresse: så måles den forkerte side
	const finalUrl = json.lighthouseResult?.finalDisplayedUrl
	if (finalUrl && new URL(finalUrl).host !== new URL(url).host)
		throw new Error(`${REDIRECTED} ${finalUrl}`)
	return slim(json, url, strategy)
}

/** Mobil og computer parallelt; én fejlende enhed vælter ikke den anden */
export async function measureBoth(
	url: string,
	key: string,
): Promise<Pick<HealthEntry, 'mobile' | 'desktop'>> {
	const [mobile, desktop] = await Promise.allSettled([
		measurePage(url, 'mobile', key),
		measurePage(url, 'desktop', key),
	])
	for (const r of [mobile, desktop])
		if (r.status === 'rejected') console.error('[pagespeed]', r.reason)
	if (mobile.status === 'rejected' && desktop.status === 'rejected')
		throw mobile.reason instanceof Error
			? mobile.reason
			: new Error('PageSpeed fejlede')
	return {
		mobile: mobile.status === 'fulfilled' ? mobile.value : null,
		desktop: desktop.status === 'fulfilled' ? desktop.value : null,
	}
}

/**
 * Gem en måling i Sanity. Måledata er fakta, ikke indhold, så den skrives (som
 * seoSnapshot) til alle datasets i SEO_SNAPSHOT_DATASETS, så tallene også ses
 * lokalt. Den månedlige har et fast id pr. måned (ingen dubletter ved genkørsel).
 */
export async function savePageHealth(
	result: Pick<HealthEntry, 'mobile' | 'desktop'>,
	trigger: HealthTrigger,
	measuredBy?: string,
): Promise<HealthEntry> {
	const measuredAt = new Date().toISOString()
	const month = copenhagenMonth(new Date())
	const id =
		trigger === 'cron'
			? `pageHealth-${month}`
			: `pageHealth-${trigger}-${measuredAt.replace(/\D/g, '').slice(0, 14)}`

	const doc = {
		_id: id,
		_type: 'pageHealth',
		month,
		measuredAt,
		trigger,
		...(measuredBy ? { measuredBy } : {}),
		url: result.mobile?.url ?? result.desktop?.url,
		mobileScores: studioScores(result.mobile),
		desktopScores: studioScores(result.desktop),
		details: JSON.stringify(result),
	}

	const written: string[] = []
	for (const dataset of snapshotDatasets()) {
		const sanity = createClient({
			projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
			dataset,
			apiVersion: '2024-01-01',
			token: process.env.SANITY_API_WRITE_TOKEN,
			useCdn: false,
		})
		try {
			await sanity.createOrReplace(doc)
			written.push(dataset)
		} catch (err) {
			console.error(`[pagespeed] kunne ikke skrive til ${dataset}`, err)
		}
	}
	if (!written.length) throw new Error(NOT_SAVED)

	return { id, month, measuredAt, trigger, measuredBy, ...result }
}

/** Samme datasets som de månedlige Search Console-tal */
function snapshotDatasets() {
	return (
		process.env.SEO_SNAPSHOT_DATASETS ||
		process.env.NEXT_PUBLIC_SANITY_DATASET ||
		'production'
	)
		.split(',')
		.map((d) => d.trim())
		.filter(Boolean)
}

function copenhagenMonth(date: Date) {
	return new Intl.DateTimeFormat('sv-SE', {
		timeZone: 'Europe/Copenhagen',
		year: 'numeric',
		month: '2-digit',
	}).format(date)
}

/** Scorerne som tal-felter, så de kan læses direkte i Studio */
function studioScores(r: HealthResult | null) {
	if (!r) return undefined
	return {
		performance: r.scores.performance ?? undefined,
		accessibility: r.scores.accessibility ?? undefined,
		bestPractices: r.scores['best-practices'] ?? undefined,
		seo: r.scores.seo ?? undefined,
	}
}

/* eslint-disable @typescript-eslint/no-explicit-any -- PageSpeed-svaret er stort og utypet */
function slim(json: any, url: string, strategy: HealthStrategy): HealthResult {
	const lh = json.lighthouseResult ?? {}
	const audits = lh.audits ?? {}
	const field = json.loadingExperience?.metrics
		? json.loadingExperience
		: json.originLoadingExperience

	return {
		url,
		strategy,
		measuredAt: new Date().toISOString(),
		scores: Object.fromEntries(
			CATEGORIES.map((c) => {
				const s = lh.categories?.[c]?.score
				return [c, typeof s === 'number' ? Math.round(s * 100) : null]
			}),
		) as HealthResult['scores'],
		lab: LAB_AUDITS.filter((id) => audits[id]).map((id) => ({
			id,
			value: audits[id].displayValue ?? '',
			score: typeof audits[id].score === 'number' ? audits[id].score : null,
		})),
		field: field?.metrics
			? {
					scope: field === json.loadingExperience ? 'page' : 'origin',
					overall: field.overall_category ?? null,
					metrics: FIELD_METRICS.filter((k) => field.metrics[k]).map((k) => ({
						id: k,
						percentile: field.metrics[k].percentile,
						category: field.metrics[k].category,
					})),
				}
			: null,
		// De største forbedringsmuligheder (Lighthouse-tekster på dansk via locale=da).
		// Nyere Lighthouse angiver besparelsen i metricSavings, ældre i details.
		opportunities: Object.values<any>(audits)
			.map((a) => ({ a, savings: savingsMs(a) }))
			.filter(
				({ a, savings }) =>
					typeof a.score === 'number' && a.score < 0.9 && savings > 0,
			)
			.sort((x, y) => y.savings - x.savings)
			.slice(0, 4)
			.map(({ a, savings }) => ({
				title: String(a.title),
				savingsMs: Math.round(savings),
			})),
	}
}

function savingsMs(audit: any): number {
	const m = audit.metricSavings ?? {}
	return Math.max(m.LCP ?? 0, m.FCP ?? 0, audit.details?.overallSavingsMs ?? 0)
}
/* eslint-enable @typescript-eslint/no-explicit-any */
