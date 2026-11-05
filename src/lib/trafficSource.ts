import { detectAiSource } from './aiSources'

/**
 * Hvor en besøgende kom fra, da de landede på sitet. Gemmes sammen med hver
 * henvendelse (src/lib/siteEvents.ts), så dashboardet kan vise fx "3 fra
 * Google Ads, 2 fra organisk søgning".
 *
 * Kilden aflæses ÉN gang, når besøget starter (adressen + document.referrer), og
 * huskes kun i sidens hukommelse. Next.js skifter side uden at genindlæse, så
 * den overlever klik rundt på sitet, men intet gemmes i browseren (ingen
 * cookies), så alle besøgende tælles. Genindlæsning eller et senere besøg
 * starter forfra.
 */
export const TRAFFIC_SOURCES = [
	{
		key: 'google_ads',
		label: 'Google Ads',
		hint: 'Klik på en annonce (Google sætter gclid på adressen)',
	},
	{
		key: 'google_organic',
		label: 'Google, organisk',
		hint: 'De almindelige søgeresultater, altså SEO-arbejdet',
	},
	{
		key: 'google_profile',
		label: 'Google My Business',
		hint: 'Linket til hjemmesiden på Google My Business-profilen',
	},
	{
		key: 'ai',
		label: 'AI-tjenester',
		hint: 'ChatGPT, Perplexity, Claude osv.',
	},
	{
		key: 'other_search',
		label: 'Andre søgemaskiner',
		hint: 'Bing, DuckDuckGo, Ecosia osv.',
	},
	{ key: 'social', label: 'Sociale medier', hint: 'Facebook, Instagram osv.' },
	{
		key: 'referral',
		label: 'Andre sider',
		hint: 'Links fra andre hjemmesider',
	},
	{
		key: 'direct',
		label: 'Direkte / ukendt',
		hint: 'Skrev adressen, brugte et bogmærke, eller kilden kunne ikke ses',
	},
] as const

export type TrafficSource = (typeof TRAFFIC_SOURCES)[number]['key']

export function isTrafficSource(v: unknown): v is TrafficSource {
	return TRAFFIC_SOURCES.some((s) => s.key === v)
}

const SEARCH_HOSTS = [
	'bing.com',
	'duckduckgo.com',
	'yahoo.com',
	'ecosia.org',
	'startpage.com',
	'search.brave.com',
	'qwant.com',
	'yandex.com',
	'baidu.com',
]
const SOCIAL_HOSTS = [
	'facebook.com',
	'fb.com',
	'instagram.com',
	'linkedin.com',
	'lnkd.in',
	'x.com',
	't.co',
	'twitter.com',
	'pinterest.com',
	'tiktok.com',
	'youtube.com',
	'reddit.com',
	'snapchat.com',
]
// Det link, der står på Google My Business-profilen, skal have ?utm_source=gbp. Uden den
// ligner et klik fra profilen et organisk klik (begge kommer fra google.*).
const PROFILE_UTM = ['gbp', 'gmb', 'google_business', 'googlebusiness']
const PAID_MEDIUMS = ['cpc', 'ppc', 'paid', 'paidsearch', 'paid_search']

const matches = (host: string, hosts: readonly string[]) =>
	hosts.some((h) => host === h || host.endsWith(`.${h}`))

/** google.dk, www.google.com, google.co.uk osv. (Gemini fanges før, som AI). */
const isGoogleHost = (host: string) => /(^|\.)google\.[a-z.]{2,6}$/.test(host)

/**
 * Finder kilden ud fra landingsadressen og referreren. Rækkefølgen betyder
 * noget: annonce-mærker vinder over alt andet, fordi en annonce også kommer
 * fra google.dk.
 */
export function detectTrafficSource(
	href: string,
	referrer: string,
): TrafficSource {
	let params = new URLSearchParams()
	let ownHost = ''
	try {
		const url = new URL(href)
		params = url.searchParams
		ownHost = url.hostname.toLowerCase()
	} catch {}
	const utmSource = (params.get('utm_source') ?? '').toLowerCase()
	const utmMedium = (params.get('utm_medium') ?? '').toLowerCase()

	if (
		params.has('gclid') ||
		params.has('gbraid') ||
		params.has('wbraid') ||
		(utmSource.includes('google') && PAID_MEDIUMS.includes(utmMedium))
	)
		return 'google_ads'
	if (PROFILE_UTM.includes(utmSource) || PROFILE_UTM.includes(utmMedium))
		return 'google_profile'
	if (detectAiSource(referrer, utmSource || null)) return 'ai'

	let refHost = ''
	try {
		refHost = referrer ? new URL(referrer).hostname.toLowerCase() : ''
	} catch {}
	// Googles app på Android sender android-app://com.google.android.googlequicksearchbox
	if (isGoogleHost(refHost) || refHost.startsWith('com.google.android'))
		return 'google_organic'
	if (params.has('msclkid') || matches(refHost, SEARCH_HOSTS))
		return 'other_search'
	if (
		params.has('fbclid') ||
		utmMedium === 'social' ||
		matches(refHost, SOCIAL_HOSTS)
	)
		return 'social'
	if (refHost && refHost !== ownHost) return 'referral'
	if (utmSource) return 'referral'
	return 'direct'
}

let landing: TrafficSource | null = null

/**
 * Kilden for dette besøg (kun i browseren). Aflæses første gang, den kaldes,
 * og SiteTracking kalder den, så snart sitet er indlæst, så det sker på
 * landingssiden, før besøgeren klikker videre.
 */
export function landingSource(): TrafficSource {
	if (typeof window === 'undefined') return 'direct'
	landing ??= detectTrafficSource(window.location.href, document.referrer)
	return landing
}
