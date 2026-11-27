/**
 * Google Search Console — henter site-totaler for en måned via OAuth refresh
 * token (bruger-login, IKKE service-account-nøgle). Credentials kommer fra
 * env-vars, så det kan køre i skyen (Vercel Cron) uden nogen lokal maskine:
 *
 *   GOOGLE_OAUTH_CLIENT_ID      — OAuth-klientens id
 *   GOOGLE_OAUTH_CLIENT_SECRET  — OAuth-klientens hemmelighed
 *   GOOGLE_OAUTH_REFRESH_TOKEN  — den fornybare billet (fra scripts/get-refresh-token.mjs)
 *
 * Refresh token'et byttes til et kortlivet access token ved hvert kald.
 */

export type SearchConsoleMetrics = {
	clicks: number
	impressions: number
	ctr: number // procent, 1 decimal
	avgPosition: number
}

/** Forrige hele måned som "ÅÅÅÅ-MM". */
export function prevMonth(now = new Date()): string {
	const d = new Date(now.getFullYear(), now.getMonth() - 1, 1)
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

/** Første + sidste dag i måneden som "ÅÅÅÅ-MM-DD". */
function monthRange(month: string): { startDate: string; endDate: string } {
	const [y, m] = month.split('-').map(Number)
	const lastDay = new Date(y, m, 0).getDate()
	return { startDate: `${month}-01`, endDate: `${month}-${String(lastDay).padStart(2, '0')}` }
}

/** Bytter refresh token til et kortlivet access token (bruges også af src/lib/ga4.ts). */
export async function getAccessToken(): Promise<string> {
	const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID
	const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET
	const refreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN
	if (!clientId || !clientSecret || !refreshToken) {
		throw new Error(
			'Mangler GOOGLE_OAUTH_CLIENT_ID / _CLIENT_SECRET / _REFRESH_TOKEN i env.',
		)
	}
	const res = await fetch('https://oauth2.googleapis.com/token', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			client_id: clientId,
			client_secret: clientSecret,
			refresh_token: refreshToken,
			grant_type: 'refresh_token',
		}),
	})
	if (!res.ok) throw new Error(`OAuth token ${res.status}: ${await res.text()}`)
	return (await res.json()).access_token as string
}

/**
 * Henter site-totaler (klik, visninger, CTR%, snit-position) for én måned.
 * `site` er en domæne-property på formen "sc-domain:kunde.dk".
 */
export async function fetchSearchConsoleMonth(
	site: string,
	month: string,
): Promise<SearchConsoleMetrics> {
	const { startDate, endDate } = monthRange(month)
	const token = await getAccessToken()
	const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
		site,
	)}/searchAnalytics/query`
	const res = await fetch(url, {
		method: 'POST',
		headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
		body: JSON.stringify({ startDate, endDate, dimensions: [] }),
	})
	if (!res.ok) throw new Error(`Search Console ${res.status}: ${await res.text()}`)

	const row = (await res.json()).rows?.[0]
	if (!row) return { clicks: 0, impressions: 0, ctr: 0, avgPosition: 0 }
	return {
		clicks: Math.round(row.clicks ?? 0),
		impressions: Math.round(row.impressions ?? 0),
		ctr: Math.round((row.ctr ?? 0) * 1000) / 10, // 0-1 → procent m. 1 decimal
		avgPosition: Math.round((row.position ?? 0) * 10) / 10,
	}
}

/** Ét søgeord fra Search Console med dets tal for måneden. */
export type SearchConsoleQuery = {
	query: string
	clicks: number
	impressions: number
	ctr: number // procent, 1 decimal
	position: number // 1 decimal
}

/**
 * Henter de mest sete søgninger (query-dimensionen) for én måned. Google
 * sorterer selv rækkerne efter klik. `limit` er hvor mange vi gemmer.
 * Bemærk: Google skjuler nogle sjældne/anonymiserede søgninger, så summen af
 * disse rækker er mindre end site-totalen. Det er forventet.
 */
export async function fetchSearchConsoleQueries(
	site: string,
	month: string,
	limit = 25,
): Promise<SearchConsoleQuery[]> {
	const { startDate, endDate } = monthRange(month)
	const token = await getAccessToken()
	const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
		site,
	)}/searchAnalytics/query`
	const res = await fetch(url, {
		method: 'POST',
		headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
		body: JSON.stringify({ startDate, endDate, dimensions: ['query'], rowLimit: limit }),
	})
	if (!res.ok) throw new Error(`Search Console (søgeord) ${res.status}: ${await res.text()}`)

	const rows: Array<{
		keys?: string[]
		clicks?: number
		impressions?: number
		ctr?: number
		position?: number
	}> = (await res.json()).rows ?? []
	return rows.map((r) => ({
		query: r.keys?.[0] ?? '',
		clicks: Math.round(r.clicks ?? 0),
		impressions: Math.round(r.impressions ?? 0),
		ctr: Math.round((r.ctr ?? 0) * 1000) / 10,
		position: Math.round((r.position ?? 0) * 10) / 10,
	}))
}

export type SearchConsolePage = {
	page: string
	clicks: number
	impressions: number
	ctr: number // procent, 1 decimal
	position: number // 1 decimal
}

/**
 * Tal pr. side (page-dimensionen) for én måned (Andreas 27/11-2026), så
 * SEO-spejderen kan se, hvordan de valgte sider og søgeord klarer sig. `page`
 * gemmes som sti (fx "/branding"), så den kan matches mod dashboardets sider.
 */
export async function fetchSearchConsolePages(
	site: string,
	month: string,
	limit = 50,
): Promise<SearchConsolePage[]> {
	const { startDate, endDate } = monthRange(month)
	const token = await getAccessToken()
	const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
		site,
	)}/searchAnalytics/query`
	const res = await fetch(url, {
		method: 'POST',
		headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
		body: JSON.stringify({ startDate, endDate, dimensions: ['page'], rowLimit: limit }),
	})
	if (!res.ok) throw new Error(`Search Console (sider) ${res.status}: ${await res.text()}`)
	const rows: Array<{ keys?: string[]; clicks?: number; impressions?: number; ctr?: number; position?: number }> =
		(await res.json()).rows ?? []
	return rows.map((r) => {
		const raw = r.keys?.[0] ?? ''
		let page = raw
		try {
			const u = new URL(raw)
			page = u.pathname || '/'
		} catch {}
		return {
			page,
			clicks: Math.round(r.clicks ?? 0),
			impressions: Math.round(r.impressions ?? 0),
			ctr: Math.round((r.ctr ?? 0) * 1000) / 10,
			position: Math.round((r.position ?? 0) * 10) / 10,
		}
	})
}

export type SearchConsoleSitemap = {
	path: string
	lastSubmitted?: string
	lastDownloaded?: string
	errors: number
	warnings: number
	submitted: number
	indexed: number
}

/**
 * Sitemaps, som Google kender for sitet (Andreas 27/11-2026): hvornår de sidst
 * blev læst, fejl/advarsler og indsendte sider. Google udfylder ikke længere
 * altid "indexed", så den kan stå som 0; brug den med forsigtighed.
 */
export async function fetchSearchConsoleSitemaps(site: string): Promise<SearchConsoleSitemap[]> {
	const token = await getAccessToken()
	const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/sitemaps`
	const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
	if (!res.ok) throw new Error(`Search Console (sitemaps) ${res.status}: ${await res.text()}`)
	const list: Array<{
		path?: string
		lastSubmitted?: string
		lastDownloaded?: string
		errors?: string | number
		warnings?: string | number
		contents?: Array<{ submitted?: string | number; indexed?: string | number }>
	}> = (await res.json()).sitemap ?? []
	return list.map((s) => ({
		path: s.path ?? '',
		lastSubmitted: s.lastSubmitted,
		lastDownloaded: s.lastDownloaded,
		errors: Number(s.errors ?? 0),
		warnings: Number(s.warnings ?? 0),
		submitted: (s.contents ?? []).reduce((n, c) => n + Number(c.submitted ?? 0), 0),
		indexed: (s.contents ?? []).reduce((n, c) => n + Number(c.indexed ?? 0), 0),
	}))
}

/** Én dag fra Search Console (site-totaler). */
export type SearchConsoleDay = {
	date: string // "ÅÅÅÅ-MM-DD"
	clicks: number
	impressions: number
}

/**
 * Henter klik og visninger pr. dag i perioden (date-dimensionen). Dage uden
 * visninger kommer ikke med fra Google; dem fylder grafen selv ud med 0.
 * Google er typisk 2-3 dage bagud, så de nyeste dage mangler.
 */
export async function fetchSearchConsoleDaily(
	site: string,
	startDate: string,
	endDate: string,
): Promise<SearchConsoleDay[]> {
	const token = await getAccessToken()
	const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
		site,
	)}/searchAnalytics/query`
	const res = await fetch(url, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			startDate,
			endDate,
			dimensions: ['date'],
			rowLimit: 500,
		}),
	})
	if (!res.ok)
		throw new Error(`Search Console (dage) ${res.status}: ${await res.text()}`)

	const rows: Array<{
		keys?: string[]
		clicks?: number
		impressions?: number
	}> = (await res.json()).rows ?? []
	return rows
		.map((r) => ({
			date: r.keys?.[0] ?? '',
			clicks: Math.round(r.clicks ?? 0),
			impressions: Math.round(r.impressions ?? 0),
		}))
		.filter((d) => d.date)
		.sort((a, b) => a.date.localeCompare(b.date))
}
