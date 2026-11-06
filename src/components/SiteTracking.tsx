'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
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
 *   3. Sidevisninger og aktiv tid pr. side (src/lib/pageStats.ts): én visning
 *      pr. side, og tiden, siden var synlig, sendes, når man går videre eller
 *      skjuler fanen. Første side i fanen tæller som et besøg med kilde.
 * Ingen cookies og intet gemt i browseren, så alle besøgende tælles, også dem
 * der siger nej i cookie-banneret.
 *
 * GA4/Google Ads kører via GTM efter samtykke (ConsentGtm.tsx), så her sendes
 * kun til dashboardets egne tællere.
 */
export default function SiteTracking() {
	const pathname = usePathname()
	const landed = useRef(false)

	useEffect(() => {
		const path = pathname || window.location.pathname
		send(
			'/api/pageview',
			JSON.stringify({
				type: 'view',
				path,
				landing: !landed.current,
				source: landingSource(),
			}),
		)
		landed.current = true

		// Aktiv tid: tæller kun, mens fanen er synlig
		let active = 0
		let since = document.visibilityState === 'visible' ? Date.now() : 0
		function flush() {
			if (since) active += Date.now() - since
			since = 0
			const seconds = Math.round(active / 1000)
			active = 0
			if (seconds > 0)
				send('/api/pageview', JSON.stringify({ type: 'time', path, seconds }))
		}
		function onVisibility() {
			if (document.visibilityState === 'hidden') flush()
			else since = Date.now()
		}
		document.addEventListener('visibilitychange', onVisibility)
		window.addEventListener('pagehide', flush)
		return () => {
			document.removeEventListener('visibilitychange', onVisibility)
			window.removeEventListener('pagehide', flush)
			// Ny side (klientnavigation): send tiden for den forrige
			flush()
		}
	}, [pathname])

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
