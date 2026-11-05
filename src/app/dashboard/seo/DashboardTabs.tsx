'use client'

import { useState, useEffect, useRef, type ReactNode } from 'react'
import { TAB_NAV_EVENT } from './TabLink'

type Tab = {
	id: string
	label: string
	content: ReactNode
	/**
	 * Valgfri "nyt siden sidst"-prik. Prikken vises, når localStorage[notifyKey]
	 * !== notifyValue, og ryddes, når fanen åbnes. Pr. bruger (localStorage), så
	 * det virker på en statisk side. notifyValue skal ændre sig, når der kommer nyt.
	 */
	notifyKey?: string
	notifyValue?: string
}

/** localStorage kan kaste (privat vindue, blokeret lager); prikken er kun en bekvemmelighed. */
function readSeen(key: string): string | null {
	try {
		return localStorage.getItem(key)
	} catch {
		return null
	}
}

function markSeen(key: string, value: string) {
	try {
		localStorage.setItem(key, value)
	} catch {
		// ignorér
	}
}

function NotifyDot() {
	return (
		<span
			className="h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]"
			aria-label="Nyt siden sidst"
		/>
	)
}

/**
 * Fane-bar i Horizen-stil.
 *   - variant="underline" (default): topfaner — aktiv = tekst + 2px understregning.
 *   - variant="pill": underfaner — aktiv = sort pille (bg-foreground text-background).
 *
 * Sæt syncKey for at gøre fanen adresserbar via URL-hash, så en TabLink kan
 * hoppe direkte hertil (og en bestemt fane kan bogmærkes/deles). syncKey skal
 * være unik pr. DashboardTabs-instans på siden.
 */
export default function DashboardTabs({
	tabs,
	defaultTab,
	variant = 'underline',
	syncKey,
}: {
	tabs: Tab[]
	defaultTab?: string
	variant?: 'underline' | 'pill'
	syncKey?: string
}) {
	const [active, setActive] = useState(defaultTab ?? tabs[0].id)
	const content = tabs.find((t) => t.id === active)?.content

	// Hvilke faner har uset nyt indhold. Beregnes efter mount, så SSR og
	// hydration matcher (localStorage findes kun i browseren).
	const [unseen, setUnseen] = useState<Record<string, boolean>>({})
	useEffect(() => {
		const next: Record<string, boolean> = {}
		for (const tab of tabs) {
			if (!tab.notifyKey || !tab.notifyValue) continue
			next[tab.id] = readSeen(tab.notifyKey) !== tab.notifyValue
		}
		setUnseen((prev) => ({ ...next, ...prev }))
		// Kun ved mount.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// Den åbne fane er set, uanset om den blev åbnet ved klik, via link (hash) eller ved start.
	useEffect(() => {
		const tab = tabs.find((t) => t.id === active)
		if (!tab?.notifyKey || !tab.notifyValue) return
		markSeen(tab.notifyKey, tab.notifyValue)
		setUnseen((prev) => ({ ...prev, [tab.id]: false }))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [active])

	// Hash-synk: gør fanen adresserbar. Kun aktiv når syncKey er sat.
	const tabsRef = useRef(tabs)
	tabsRef.current = tabs
	useEffect(() => {
		if (!syncKey) return
		const sync = () => {
			const v = new URLSearchParams(window.location.hash.slice(1)).get(syncKey)
			if (v && tabsRef.current.some((t) => t.id === v)) setActive(v)
		}
		sync()
		window.addEventListener('hashchange', sync)
		window.addEventListener(TAB_NAV_EVENT, sync)
		return () => {
			window.removeEventListener('hashchange', sync)
			window.removeEventListener(TAB_NAV_EVENT, sync)
		}
	}, [syncKey])

	function selectTab(id: string) {
		setActive(id)
		if (syncKey) {
			const sp = new URLSearchParams(window.location.hash.slice(1))
			sp.set(syncKey, id)
			history.replaceState(null, '', `#${sp.toString()}`)
		}
	}

	if (variant === 'pill') {
		return (
			<>
				<div className="mb-10 flex flex-wrap gap-2">
					{tabs.map((tab) => {
						const isActive = active === tab.id
						return (
							<button
								key={tab.id}
								type="button"
								onClick={() => selectTab(tab.id)}
								className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
									isActive
										? 'bg-foreground text-background'
										: 'bg-foreground/[0.04] text-foreground/60 hover:text-foreground'
								}`}
							>
								{tab.label}
								{unseen[tab.id] && <NotifyDot />}
							</button>
						)
					})}
				</div>
				<div>{content}</div>
			</>
		)
	}

	return (
		<>
			<div className="border-foreground/[0.08] mb-10 flex gap-1 overflow-x-auto border-b">
				{tabs.map((tab) => {
					const isActive = active === tab.id
					return (
						<button
							key={tab.id}
							type="button"
							onClick={() => selectTab(tab.id)}
							className={`relative inline-flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
								isActive
									? 'text-foreground after:bg-foreground after:absolute after:inset-x-0 after:bottom-0 after:h-0.5'
									: 'text-foreground/50 hover:text-foreground/80'
							}`}
						>
							{tab.label}
							{unseen[tab.id] && <NotifyDot />}
						</button>
					)
				})}
			</div>
			<div>{content}</div>
		</>
	)
}
