/**
 * Cookie-samtykke (GDPR). Gemmes i localStorage og deles med resten af sitet
 * via en browser-event, så GA og banneret reagerer uden reload.
 *
 * Eksport:
 *  - getConsent() / setConsent() / acceptAll() / rejectAll() / resetConsent()
 *  - subscribe(callback): lyt på ændringer
 *  - hasConsent(category): boolean tjek
 *
 * Tracking (GA4, senere evt. Google Ads) må ikke sætte cookies uden samtykke.
 * src/components/ConsentGtm.tsx indlæser først GTM (GA4 + Google Ads) efter accept
 * og oversætter valget til Google Consent Mode v2.
 */

export type ConsentCategory = 'necessary' | 'statistics' | 'marketing'

export type Consent = {
	necessary: true
	statistics: boolean
	marketing: boolean
	timestamp: string
	version: number
}

const STORAGE_KEY = 'horizen.consent'
const EVENT_NAME = 'horizen:consent-change'
// Ændres kategorierne eller teksten væsentligt, så bump VERSION. Så bliver
// alle spurgt igen, fordi et gammelt samtykke ikke længere gælder.
const VERSION = 1

export function getConsent(): Consent | null {
	if (typeof window === 'undefined') return null
	try {
		const raw = localStorage.getItem(STORAGE_KEY)
		if (!raw) return null
		const parsed = JSON.parse(raw) as Consent
		if (parsed.version !== VERSION) return null
		return parsed
	} catch {
		return null
	}
}

export function setConsent(
	partial: Partial<Pick<Consent, 'statistics' | 'marketing'>>,
): Consent {
	const current = getConsent()
	const next: Consent = {
		necessary: true,
		statistics: partial.statistics ?? current?.statistics ?? false,
		marketing: partial.marketing ?? current?.marketing ?? false,
		timestamp: new Date().toISOString(),
		version: VERSION,
	}
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
	} catch {}
	window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: next }))
	return next
}

export function acceptAll(): Consent {
	return setConsent({ statistics: true, marketing: true })
}

export function rejectAll(): Consent {
	return setConsent({ statistics: false, marketing: false })
}

/** Sletter valget og åbner banneret igen (footer-linket "Cookie-indstillinger"). */
export function resetConsent(): void {
	if (typeof window === 'undefined') return
	try {
		localStorage.removeItem(STORAGE_KEY)
	} catch {}
	window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: null }))
}

export function hasConsent(category: ConsentCategory): boolean {
	if (category === 'necessary') return true
	return !!getConsent()?.[category]
}

export function subscribe(
	callback: (consent: Consent | null) => void,
): () => void {
	if (typeof window === 'undefined') return () => {}
	const handler = (e: Event) =>
		callback((e as CustomEvent<Consent | null>).detail ?? null)
	window.addEventListener(EVENT_NAME, handler)
	return () => window.removeEventListener(EVENT_NAME, handler)
}
