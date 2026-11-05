import { unstable_cache } from 'next/cache'
import {
	fetchSearchConsoleDaily,
	type SearchConsoleDay,
} from '@/lib/search-console'
import { siteLaunchDate } from './data'

/**
 * Dagstal (klik + visninger) for de seneste 12 hele måneder til grafen på
 * SEO-fanen. Følger samme rytme som de månedlige nøgletal: en ny måned kommer
 * med den 3. i måneden, og indtil da genbruges svaret fra cachen. Google
 * spørges altså reelt én gang om måneden (samme OAuth-adgang som den månedlige
 * cron: GOOGLE_OAUTH_* + SEARCH_CONSOLE_SITE).
 *
 * Lokalt findes Google-adgangen typisk ikke. Så vises tydeligt markerede
 * eksempeldata, så grafen kan ses under udvikling. I produktion vises aldrig
 * eksempeldata: mangler adgangen, vises grafen ikke.
 */

export type SearchTrend = {
	days: SearchConsoleDay[]
	demo: boolean
	/** Dagen det nye site gik live (siteLaunchDate i data.ts); markeres i grafen. */
	relaunch: string | null
}

const RELAUNCH = siteLaunchDate
const MONTHS = 12

function isoDay(d: Date) {
	return d.toISOString().slice(0, 10)
}

/**
 * Periode: de 12 seneste hele måneder, der er "udgivet". En måned regnes som
 * klar fra den 3. i måneden efter (samme dag som de månedlige nøgletal).
 */
function period(now = new Date()) {
	const back = now.getUTCDate() >= 3 ? 1 : 2
	const end = new Date(
		Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - back + 1, 0),
	)
	const start = new Date(
		Date.UTC(end.getUTCFullYear(), end.getUTCMonth() - MONTHS + 1, 1),
	)
	return { start, end }
}

/** Alle datoer i perioden, så dage uden visninger står som 0 i stedet for at mangle. */
function fillDays(
	rows: SearchConsoleDay[],
	start: Date,
	end: Date,
): SearchConsoleDay[] {
	const byDate = new Map(rows.map((r) => [r.date, r]))
	const out: SearchConsoleDay[] = []
	for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
		const date = isoDay(d)
		out.push(byDate.get(date) ?? { date, clicks: 0, impressions: 0 })
	}
	return out
}

// Nøglen indeholder perioden, så en ny måned (den 3.) giver et nyt opslag.
// Ellers holdes svaret i op til 32 dage.
const fetchCached = unstable_cache(
	async (site: string, startDate: string, endDate: string) =>
		fetchSearchConsoleDaily(site, startDate, endDate),
	['gsc-daily-monthly'],
	{ revalidate: 60 * 60 * 24 * 32 },
)

/** Lav trafik før relanceringen, så stigning, kun til lokal visning uden Google-adgang. */
function demoDays(start: Date, end: Date): SearchConsoleDay[] {
	const days = fillDays([], start, end)
	const launchDate = RELAUNCH ?? days[Math.floor(days.length * 0.75)].date
	const launch = days.findIndex((d) => d.date >= launchDate)
	return days.map((d, i) => {
		const wave = Math.sin(i * 1.7) * 0.5 + Math.sin(i * 0.45) * 0.3
		const after = launch >= 0 && i >= launch ? i - launch : -1
		const base = after < 0 ? 3 + wave * 2 : 20 + after * 1.1
		const impressions = Math.max(
			0,
			Math.round(base + wave * 8 + (i % 7 < 5 ? 4 : -3)),
		)
		return {
			date: d.date,
			impressions,
			clicks: Math.max(0, Math.round(impressions * 0.02 + wave)),
		}
	})
}

export async function getSearchTrend(): Promise<SearchTrend | null> {
	const { start, end } = period()

	const site = process.env.SEARCH_CONSOLE_SITE
	const hasAccess =
		site &&
		process.env.GOOGLE_OAUTH_CLIENT_ID &&
		process.env.GOOGLE_OAUTH_CLIENT_SECRET &&
		process.env.GOOGLE_OAUTH_REFRESH_TOKEN

	if (!hasAccess) {
		return process.env.NODE_ENV === 'development'
			? { days: demoDays(start, end), demo: true, relaunch: RELAUNCH }
			: null
	}

	try {
		const rows = await fetchCached(site, isoDay(start), isoDay(end))
		return {
			days: fillDays(rows, start, end),
			demo: false,
			relaunch: RELAUNCH,
		}
	} catch (err) {
		console.error(
			'[dashboard] Kunne ikke hente dagstal fra Search Console:',
			err,
		)
		return null
	}
}
