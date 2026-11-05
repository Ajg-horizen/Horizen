'use client'

import { useEffect } from 'react'
import { detectAiSource } from '@/lib/aiSources'
import { landingSource } from '@/lib/trafficSource'

/**
 * Anonym måling til SEO-dashboardet (se src/lib/siteEvents.ts):
 *   1. Besøg fra en AI-tjeneste (ChatGPT, Perplexity osv.) tælles én gang, når
 *      besøgeren lander. Klik videre har sitet selv som referrer og tælles ikke.
 *   2. Klik på telefonnumre (tel:) og mailadresser (mailto:) overalt på sitet,
 *      med én lytter, så nye knapper og moduler kommer med automatisk. Hvert
 *      klik får besøgets kilde med (Google Ads, organisk osv.), aflæst på
 *      landingssiden og husket i hukommelsen (src/lib/trafficSource.ts).
 * Ingen cookies og intet gemt i browseren, så alle besøgende tælles.
 *
 * Horizen måler i GA4/Google Ads via GTM, så her sendes kun til dashboardets
 * egne tællere (se src/lib/siteEvents.ts).
 */
export default function SiteTracking() {
	useEffect(() => {
		// Aflæs kilden nu, på landingssiden, før besøgeren klikker videre
		landingSource()
		const source = detectAiSource(
			document.referrer,
			new URLSearchParams(window.location.search).get('utm_source'),
		)
		if (!source) return
		const path = window.location.pathname
		send('/api/ai-visit', JSON.stringify({ source, path }))
	}, [])

	useEffect(() => {
		function onClick(e: MouseEvent) {
			const link = (e.target as Element | null)?.closest?.(
				'a[href^="tel:"], a[href^="mailto:"]',
			)
			if (!link) return
			const type = link.getAttribute('href')!.startsWith('tel:')
				? 'phone'
				: 'email'
			const path = window.location.pathname
			send(
				'/api/lead',
				JSON.stringify({ type, path, source: landingSource() }),
			)
		}
		document.addEventListener('click', onClick, { capture: true })
		return () =>
			document.removeEventListener('click', onClick, { capture: true })
	}, [])

	return null
}

/** sendBeacon når frem, selv om siden forlades; ellers fetch med keepalive */
function send(url: string, body: string) {
	if (!navigator.sendBeacon?.(url, body)) {
		fetch(url, { method: 'POST', body, keepalive: true }).catch(() => {})
	}
}
