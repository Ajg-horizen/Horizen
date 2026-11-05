'use client'

import type { ReactNode } from 'react'

/** Event som adresserbare DashboardTabs (dem med syncKey) lytter på. */
export const TAB_NAV_EVENT = 'dashboard-tab-nav'

/**
 * Skifter dashboard-faner ved at skrive fane-valgene i URL-hash og fyre et
 * event, som hver DashboardTabs-instans med syncKey reagerer på. Virker på
 * tværs af de to fane-lag: fx { v: 'status', w: 'sider' } åbner det yderste
 * lag "Arbejdsrum" og det inderste "Sider & søgeord" i ét klik.
 */
export function gotoTab(params: Record<string, string>) {
	if (typeof window === 'undefined') return
	const sp = new URLSearchParams(window.location.hash.slice(1))
	for (const [k, v] of Object.entries(params)) sp.set(k, v)
	history.replaceState(null, '', `#${sp.toString()}`)
	window.dispatchEvent(new CustomEvent(TAB_NAV_EVENT))
}

/** Genvejs-knap: hopper til en fane-kombination og scroller til fane-området. */
export default function TabLink({
	to,
	scrollTo,
	children,
}: {
	to: Record<string, string>
	scrollTo?: string
	children: ReactNode
}) {
	return (
		<button
			type="button"
			onClick={() => {
				gotoTab(to)
				if (scrollTo) {
					requestAnimationFrame(() =>
						document
							.getElementById(scrollTo)
							?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
					)
				}
			}}
			className="group inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-foreground/[0.04] px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-foreground/[0.08]"
		>
			{children}
			<span
				className="transition-transform duration-300 group-hover:translate-x-0.5"
				aria-hidden="true"
			>
				→
			</span>
		</button>
	)
}
