'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { TAB_NAV_EVENT } from './TabLink'
import HorizenLogo from './HorizenLogo'

/**
 * App-skal til SEO-dashboardet: svævende, afrundet glaspanel til venstre med
 * menuen (underpunkter foldes ud under det aktive punkt), og en let topbjælke
 * med sti, knap til lys/mørk tilstand og en primær handling ("Opret ny
 * opgave"). På mobil ligger menuen bag en knap og glider ind fra venstre.
 *
 * Punkter med `bottom` står nederst under "Kun Horizen" (siden sender dem
 * kun med, når Horizen er logget ind).
 *
 * Har et punkt både `content` og `children`, er `content` punktets overblik
 * ("Overblik" i menuen), og underpunkterne er egne sider.
 *
 * Adresse i URL-hash: #v=<punkt>&s=<underpunkt>. Gamle links fra fane-
 * udgaven (#v=analytics&r=ai, #v=status&w=plan) oversættes automatisk.
 */

export type ShellSub = { id: string; label: string; content: ReactNode }

export type ShellItem = {
	id: string
	label: string
	icon: IconName
	/** Lille tekst efter navnet, fx "7/32". */
	meta?: string
	content?: ReactNode
	children?: ShellSub[]
	/** Placér nederst under "Kun Horizen" (Kom i gang, Værktøjer, Opsætning). */
	bottom?: boolean
	/** Link ud af dashboardet i stedet for en side (fx Studio). */
	href?: string
	/** Gamle adresser, der også skal åbne punktet (fx 'status' → Strategi). */
	alias?: string[]
	/** "Nyt siden sidst"-prik: vises, når localStorage[notifyKey] !== notifyValue. */
	notifyKey?: string
	notifyValue?: string
}

type IconName =
	| 'folder'
	| 'pen'
	| 'back'
	| 'rocket'
	| 'tools'
	| 'home'
	| 'chart'
	| 'users'
	| 'question'
	| 'activity'
	| 'tasks'
	| 'settings'
	| 'mail'
	| 'sun'
	| 'moon'

const ICONS: Record<IconName, ReactNode> = {
	back: <path d="M9 14 4 9l5-5M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />,
	pen: <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16zM13.5 6.5l4 4" />,
	folder: (
		<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
	),
	rocket: (
		<>
			<path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2" />
			<path d="M9 12a12 12 0 0 1 11-9 12 12 0 0 1-9 11l-2 1-2-2z" />
			<path d="M9 12H5l2-4h4M12 15v4l4-2v-4" />
		</>
	),
	tools: (
		<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z" />
	),
	home: (
		<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
	),
	users: (
		<>
			<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
			<circle cx="9" cy="7" r="4" />
			<path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
		</>
	),
	chart: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
	question: (
		<>
			<circle cx="12" cy="12" r="9" />
			<path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17h.01" />
		</>
	),
	activity: <path d="M3 12h4l3-8 4 16 3-8h4" />,
	tasks: (
		<path d="M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2" />
	),
	settings: (
		<>
			<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" />
			<circle cx="16" cy="6" r="2" />
			<circle cx="10" cy="12" r="2" />
			<circle cx="18" cy="18" r="2" />
		</>
	),
	mail: (
		<>
			<rect x="3" y="5" width="18" height="14" rx="2" />
			<path d="m3 7 9 6 9-6" />
		</>
	),
	sun: (
		<>
			<circle cx="12" cy="12" r="4" />
			<path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
		</>
	),
	moon: <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />,
}

/**
 * Farve pr. menupunkt i lys tilstand (dashboard.css → --tone-*). I mørk
 * tilstand er farverne currentColor, så menuen ser ud som før.
 */
const ICON_TONE: Partial<Record<IconName, string>> = {
	home: 'var(--tone-blue)',
	chart: 'var(--tone-green)',
	activity: 'var(--tone-orange)',
	tasks: 'var(--tone-green)',
	question: 'var(--tone-violet)',
	folder: 'var(--tone-pink)',
}

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
	return (
		<svg
			viewBox="0 0 24 24"
			width={size}
			height={size}
			className="shrink-0"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden
		>
			{ICONS[name]}
		</svg>
	)
}

/** localStorage kan kaste (privat vindue); det er kun bekvemmelighed. */
function readStore(key: string) {
	try {
		return localStorage.getItem(key)
	} catch {
		return null
	}
}
function writeStore(key: string, value: string) {
	try {
		localStorage.setItem(key, value)
	} catch {}
}

/** Læser punkt + underpunkt fra hash, inkl. gamle fane-adresser. */
function readHash(): { v?: string; s?: string } {
	const sp = new URLSearchParams(window.location.hash.slice(1))
	return {
		v: sp.get('v') ?? undefined,
		s: sp.get('s') ?? sp.get('r') ?? sp.get('w') ?? undefined,
	}
}

/** Glasflade til navigation og knapper (samme som kortene) */
const glass = 'border border-foreground/[0.08] bg-white backdrop-blur-xl'

function ThemeToggle() {
	const [theme, setTheme] = useState<'light' | 'dark'>('dark')
	useEffect(() => {
		setTheme(
			document.documentElement.dataset.theme === 'light' ? 'light' : 'dark',
		)
	}, [])
	function flip() {
		const next = theme === 'dark' ? 'light' : 'dark'
		document.documentElement.dataset.theme = next
		writeStore('dash-theme', next)
		setTheme(next)
	}
	return (
		<button
			type="button"
			onClick={flip}
			className={`text-foreground/80 hover:text-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${glass}`}
			aria-label={
				theme === 'dark' ? 'Skift til lys tilstand' : 'Skift til mørk tilstand'
			}
			title={theme === 'dark' ? 'Lys tilstand' : 'Mørk tilstand'}
		>
			<Icon name={theme === 'dark' ? 'sun' : 'moon'} />
		</button>
	)
}

export default function DashboardShell({
	nav,
	defaultItem,
	brand,
	updatedLabel,
	action,
	notice,
	footer,
	signedInAs,
}: {
	nav: ShellItem[]
	defaultItem: string
	brand: { client: string; domain: string }
	/** Navn ved login med Sanity: vises nederst i menuen med "Log ud" */
	signedInAs?: string
	updatedLabel?: ReactNode
	/** Primær handling øverst til højre, fx "Opret ny opgave". */
	action?: ReactNode
	/** Besked over indholdet, fx når Horizen ser dashboardet som kunden. */
	notice?: ReactNode
	footer?: ReactNode
}) {
	const [active, setActive] = useState(defaultItem)
	const [sub, setSub] = useState<string | undefined>()
	const [menuOpen, setMenuOpen] = useState(false)
	const [unseen, setUnseen] = useState<Record<string, boolean>>({})

	const item = nav.find((n) => n.id === active) ?? nav[0]
	// Punkter uden eget overblik åbner deres første underpunkt
	const subId = sub ?? (item.content ? undefined : item.children?.[0]?.id)
	const subItem = item.children?.find((c) => c.id === subId)
	const content = subItem?.content ?? item.content

	// Hash → valgt side (ved start, ved tilbage/frem og ved TabLink-hop)
	useEffect(() => {
		const sync = () => {
			const { v, s } = readHash()
			// Et underpunkt, der er flyttet til et andet punkt (fx Henvendelser fra
			// Synlighed til Besøgende), findes stadig via sit eget id
			const target =
				(s ? nav.find((n) => n.children?.some((c) => c.id === s)) : undefined) ??
				nav.find((n) => n.id === v || (v && n.alias?.includes(v)))
			if (!target) return
			setActive(target.id)
			setSub(target.children?.some((c) => c.id === s) ? s : undefined)
		}
		sync()
		window.addEventListener('hashchange', sync)
		window.addEventListener(TAB_NAV_EVENT, sync)
		return () => {
			window.removeEventListener('hashchange', sync)
			window.removeEventListener(TAB_NAV_EVENT, sync)
		}
		// nav er stabil pr. render af siden
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		const next: Record<string, boolean> = {}
		for (const n of nav)
			if (n.notifyKey && n.notifyValue)
				next[n.id] = readStore(n.notifyKey) !== n.notifyValue
		setUnseen(next)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (item.notifyKey && item.notifyValue) {
			writeStore(item.notifyKey, item.notifyValue)
			setUnseen((p) => ({ ...p, [item.id]: false }))
		}
	}, [item])

	function go(id: string, s?: string) {
		setActive(id)
		setSub(s)
		setMenuOpen(false)
		const sp = new URLSearchParams()
		sp.set('v', id)
		if (s) sp.set('s', s)
		history.replaceState(null, '', `#${sp.toString()}`)
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	async function signOut() {
		await fetch('/api/dashboard-auth', { method: 'DELETE' }).catch(() => {})
		window.location.assign('/dashboard/login?ud=1')
	}

	const top = nav.filter((n) => !n.bottom)
	const bottom = nav.filter((n) => n.bottom)
	const initial = (brand.client.match(/\p{L}/u)?.[0] ?? '·').toUpperCase()

	const navLink = (n: ShellItem) => {
		const isActive = n.id === item.id
		return (
			<li key={n.id}>
				{n.href ? (
					<a
						href={n.href}
						className="text-foreground/65 hover:bg-foreground/[0.06] hover:text-foreground flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors"
					>
						<Icon name={n.icon} size={17} />
						<span className="min-w-0 flex-1 truncate">{n.label}</span>
						<span aria-hidden className="text-xs opacity-50">
							↗
						</span>
					</a>
				) : (
					<button
						type="button"
						onClick={() => go(n.id)}
						aria-current={isActive && !subId ? 'page' : undefined}
						className={`relative flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${
							isActive
								? 'bg-foreground text-background'
								: 'text-foreground/65 hover:bg-foreground/[0.06] hover:text-foreground'
						}`}
					>
						<span
							className="flex"
							style={isActive ? undefined : { color: ICON_TONE[n.icon] }}
						>
							<Icon name={n.icon} size={17} />
						</span>
						<span className="min-w-0 flex-1 truncate">{n.label}</span>
						{unseen[n.id] && (
							<span
								className="h-1.5 w-1.5 rounded-full"
								style={{ backgroundColor: 'var(--accent)' }}
								aria-label="Nyt"
							/>
						)}
						{n.meta && (
							<span className="text-[11px] tabular-nums opacity-60">
								{n.meta}
							</span>
						)}
					</button>
				)}
				{isActive && n.children && (
					<ul className="border-foreground/[0.1] mt-3 mb-3 ml-[21px] space-y-0.5 border-l pl-3">
						{item.content && (
							<SubLink on={!subId} onClick={() => go(n.id)}>
								Overblik
							</SubLink>
						)}
						{n.children.map((c) => (
							<SubLink
								key={c.id}
								on={c.id === subId}
								onClick={() => go(n.id, c.id)}
							>
								{c.label}
							</SubLink>
						))}
					</ul>
				)}
			</li>
		)
	}

	// Glaspanelet til venstre: afrundet, svævende med luft omkring
	const sidebar = (
		<div className={`flex h-full flex-col rounded-3xl p-4 ${glass}`}>
			<div className="flex items-center gap-3 px-1.5 pt-1">
				<span
					className="bg-foreground text-background flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-sm font-semibold"
					aria-hidden
				>
					{initial}
				</span>
				<div className="min-w-0">
					<p className="text-foreground truncate text-sm font-semibold tracking-tight">
						{brand.client}
					</p>
					<p className="text-foreground/50 truncate text-xs">{brand.domain}</p>
				</div>
			</div>

			<p className="text-foreground/40 mt-8 px-3 text-[10px] font-medium tracking-[0.16em] uppercase">
				SEO-overblik
			</p>
			<nav className="mt-2 flex-1 overflow-y-auto" aria-label="Dashboard">
				<ul className="space-y-1">{top.map(navLink)}</ul>
			</nav>

			{/* Kun Horizen (vises kun for Horizen-login) */}
			{bottom.length > 0 && (
				<div className="mb-2">
					<p className="text-foreground/40 mb-2 px-3 text-[10px] font-medium tracking-[0.16em] uppercase">
						Kun Horizen
					</p>
					<ul className="space-y-1">{bottom.map(navLink)}</ul>
				</div>
			)}
			{/* Tilbage til Studio: lige over stregen, samme sted for alle */}
			<a
				href="/admin"
				className="text-foreground/55 hover:bg-foreground/[0.06] hover:text-foreground mb-3 flex items-center gap-3 rounded-2xl px-3 py-2 text-sm transition-colors"
			>
				<Icon name="back" size={17} />
				Tilbage til Studio
			</a>
			{signedInAs && (
				<div className="mb-3 flex items-center gap-2 px-3 text-xs">
					<span className="text-foreground/50 min-w-0 flex-1 truncate">
						{signedInAs}
					</span>
					<button
						type="button"
						onClick={signOut}
						className="text-foreground/55 hover:text-foreground shrink-0 font-medium transition-colors"
					>
						Log ud
					</button>
				</div>
			)}
			<div className="border-foreground/[0.08] border-t pt-3">
				{/* Horizen som stille signatur: logo i dæmpet tekstfarve, følger lys/mørk */}
				<a
					href="https://horizen.dk"
					target="_blank"
					rel="noopener noreferrer"
					className="text-foreground/40 hover:text-foreground/80 flex items-center gap-2 px-3 transition-colors"
					aria-label="Powered by Horizen"
				>
					<span className="text-[11px]">Powered by</span>
					<HorizenLogo className="h-[11px] w-auto" />
				</a>
			</div>
		</div>
	)

	return (
		<div className="min-h-screen lg:grid lg:grid-cols-[288px_1fr]">
			{/* Menu: svævende glaspanel på desktop */}
			<aside className="sticky top-0 hidden h-screen p-4 pr-0 lg:block">
				{sidebar}
			</aside>

			{/* Menu: skuffe på mobil */}
			{menuOpen && (
				<div
					className="fixed inset-0 z-50 lg:hidden"
					role="dialog"
					aria-modal="true"
					aria-label="Menu"
				>
					<div
						className="absolute inset-0 bg-black/40 backdrop-blur-sm"
						onClick={() => setMenuOpen(false)}
					/>
					<div className="bg-background absolute inset-y-3 left-3 w-[82vw] max-w-[300px] rounded-3xl">
						{sidebar}
					</div>
				</div>
			)}

			<div className="min-w-0">
				{/* Topbjælke: sti til venstre, tilstand og primær handling til højre */}
				<header className="sticky top-0 z-30 px-3 pt-3 md:px-8 md:pt-4 xl:px-12">
					<div className="mx-auto flex max-w-[1920px] items-center gap-3">
						<button
							type="button"
							onClick={() => setMenuOpen(true)}
							className={`text-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-full lg:hidden ${glass}`}
							aria-label="Åbn menu"
						>
							<svg
								viewBox="0 0 24 24"
								width="18"
								height="18"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								aria-hidden
							>
								<path d="M4 7h16M4 12h16M4 17h16" />
							</svg>
						</button>
						<div
							className={`hidden min-w-0 items-center gap-2 rounded-full px-4 py-2 text-sm sm:flex ${glass}`}
						>
							<span className="text-foreground/50">{item.label}</span>
							{subItem && (
								<>
									<span className="text-foreground/25">/</span>
									<span className="text-foreground font-medium">
										{subItem.label}
									</span>
								</>
							)}
						</div>
						{updatedLabel && (
							<span className="text-foreground/45 hidden truncate text-xs xl:block">
								{updatedLabel}
							</span>
						)}
						<div className="ml-auto flex items-center gap-2">
							<ThemeToggle />
							{action}
						</div>
					</div>
				</header>

				<main className="mx-auto max-w-[1920px] px-3 pt-8 pb-16 md:px-8 xl:px-12">
					{notice && <div className="mb-6">{notice}</div>}
					{/* Ny nøgle pr. side, så indholdet toner blødt ind ved hvert skift */}
					<div key={`${item.id}-${subId ?? ''}`} className="dash-fade">
						{content}
					</div>
					{footer && <div className="mt-20">{footer}</div>}
				</main>
			</div>
		</div>
	)
}

function SubLink({
	on,
	onClick,
	children,
}: {
	on: boolean
	onClick: () => void
	children: ReactNode
}) {
	return (
		<li>
			<button
				type="button"
				onClick={onClick}
				aria-current={on ? 'page' : undefined}
				className={`w-full rounded-xl px-3 py-1.5 text-left text-[13px] transition-colors ${
					on
						? 'bg-foreground/[0.08] text-foreground font-medium'
						: 'text-foreground/55 hover:bg-foreground/[0.04] hover:text-foreground'
				}`}
			>
				{children}
			</button>
		</li>
	)
}
