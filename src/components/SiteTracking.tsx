'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { detectAiSource } from '@/lib/aiSources'
import { landingSource } from '@/lib/trafficSource'

/**
 * Anonym måling til SEO-dashboardet (se src/lib/siteEvents.ts):
 *   1. Besøg fra en AI-tjeneste (ChatGPT, Perplexity osv.) tælles én gang, når
 *      besøgeren lander. Klik videre har sitet selv som referrer og tælles ikke.
 *   2. Klik på telefonnumre (tel:), mailadresser (mailto:), "Book tid"-knapper
 *      (alt med data-cal-link eller et cal.com-link) og knapper/links til
 *      kontaktsiden ("Start et projekt", "Kontakt", "Book en gratis audit" osv.)
 *      overalt på sitet, med én lytter, så nye knapper og moduler kommer med
 *      automatisk. Gennemførte bookinger meldes fra CalEmbed.tsx med
 *      hændelsen BOOKED_EVENT og sendes herfra. Hvert
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
/** Booking-knapperne åbner Cal.com-popup'en via data-cal-link (CalEmbed.tsx). */
const BOOKING = '[data-cal-link], a[href^="https://cal.com/"], a[href^="https://app.cal.com/"]'
/** Knapper og links til kontaktsiden (relative og fulde adresser). */
const CONTACT =
	'a[href="/kontakt"], a[href^="/kontakt?"], a[href^="/kontakt#"], a[href^="https://horizen.dk/kontakt"], a[href^="https://www.horizen.dk/kontakt"]'
/** Sendes på window fra CalEmbed.tsx, når en booking er gennemført i popup'en. */
export const BOOKED_EVENT = 'horizen:booked'

type ClickType = 'phone' | 'email' | 'booking' | 'contact'

function clickType(el: Element): ClickType {
	const href = el.getAttribute('href') ?? ''
	if (href.startsWith('tel:')) return 'phone'
	if (href.startsWith('mailto:')) return 'email'
	if (el.matches(BOOKING)) return 'booking'
	return 'contact'
}

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
				`a[href^="tel:"], a[href^="mailto:"], ${BOOKING}, ${CONTACT}`,
			)
			if (!link) return
			const type = clickType(link)
			const path = window.location.pathname
			send(
				'/api/lead',
				JSON.stringify({ type, path, source: landingSource() }),
			)
		}
		// Gennemført booking i Cal.com-popup'en (CalEmbed.tsx)
		function onBooked() {
			send(
				'/api/lead',
				JSON.stringify({
					type: 'booked',
					path: window.location.pathname,
					source: landingSource(),
				}),
			)
		}
		document.addEventListener('click', onClick, { capture: true })
		window.addEventListener(BOOKED_EVENT, onBooked)
		return () => {
			document.removeEventListener('click', onClick, { capture: true })
			window.removeEventListener(BOOKED_EVENT, onBooked)
		}
	}, [])

	return null
}

/** sendBeacon når frem, selv om siden forlades; ellers fetch med keepalive */
function send(url: string, body: string) {
	if (!navigator.sendBeacon?.(url, body)) {
		fetch(url, { method: 'POST', body, keepalive: true }).catch(() => {})
	}
}
