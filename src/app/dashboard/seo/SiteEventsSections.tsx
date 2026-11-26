import { AI_SOURCES, type AiSource } from '@/lib/aiSources'
import type { LeadType } from '@/lib/siteEvents'
import { TRAFFIC_SOURCES, type TrafficSource } from '@/lib/trafficSource'
import type { SeoSnapshot } from './data'
import SeasonChart from './SeasonChart'
import { SEASON_HAS_DATA, smoothPath } from './season'
import { DarkTabLink } from './TabLink'

/**
 * Sektionerne under Performance → Henvendelser og AI-søgning, bygget på de anonyme tællere i
 * src/lib/siteEvents.ts:
 *   - "Henvendelser fra hjemmesiden": klik på telefon/mail, gennemførte bookinger
 *     (+ formularer, hvis projektets formular-API kalder recordLead('form')), ved
 *     siden af klik fra Google. Klik på booking- og kontaktknapper vises også, men
 *     tæller ikke som henvendelser (CLICK_ONLY herunder; Horizen, som Hos Dam)
 *   - "Hvor kom de fra?": samme henvendelser fordelt på besøgets kilde (Google Ads,
 *     organisk, Google My Business osv., se src/lib/trafficSource.ts)
 *   - "Besøg fra AI-tjenester": ChatGPT, Perplexity, Claude, Gemini, Copilot
 * Tællingen starter den måned, hvor den første hændelse kom; ingen opsætning pr. kunde.
 */

export type LeadEvent = {
	type: LeadType
	path: string
	source?: TrafficSource
	createdAt: string
}
export type AiVisit = { source: AiSource; path: string; createdAt: string }

const LEAD_COLUMNS: { key: LeadType; label: string; hint: string }[] = [
	{ key: 'form', label: 'Formularer', hint: 'Sendte formularer' },
	{
		key: 'phone',
		label: 'Klik på telefon',
		hint: 'Klik på telefonnummeret (typisk fra mobil)',
	},
	{ key: 'email', label: 'Klik på mail', hint: 'Klik på mailadressen' },
	{
		key: 'booked',
		label: 'Bookinger',
		hint: 'Gennemførte bookinger i kalenderen på sitet',
	},
	{
		key: 'booking',
		label: 'Klik på book tid',
		hint: 'Klik på en "Book tid"-knap, der åbner kalenderen (ikke nødvendigvis en gennemført booking)',
	},
	{
		key: 'contact',
		label: 'Klik til kontakt',
		hint: 'Klik på en knap eller et link til kontaktsiden, fx "Start et projekt", "Kontakt" eller "Book en gratis audit"',
	},
]

/**
 * Klik, der viser interesse, men ikke er en henvendelse i sig selv: den, der
 * booker eller skriver, har også klikket. De står i kortene, tabellen og "Her
 * skete henvendelserne", men tæller ikke med i "I alt", kurven, kilderne,
 * listen over seneste henvendelser, sæsonen og Overblik (Horizen, som Hos Dam).
 */
const CLICK_ONLY: LeadType[] = ['booking', 'contact']

/** Er hændelsen en henvendelse (formular, telefon, mail, booking) og ikke kun et klik? */
export function isInquiry(e: { type: LeadType }): boolean {
	return !CLICK_ONLY.includes(e.type)
}

/** Måneder ('ÅÅÅÅ-MM') fra første hændelse til nu, nyeste først. Ingen hændelser = kun indeværende måned. */
function monthsFromFirst(events: { createdAt: string }[], now: Date): string[] {
	const first = events.map((e) => e.createdAt.slice(0, 7)).sort()[0]
	const [y0, m0] = (first ?? `${now.getFullYear()}-${now.getMonth() + 1}`)
		.split('-')
		.map(Number)
	const out: string[] = []
	for (
		let y = y0, m = m0;
		y < now.getFullYear() ||
		(y === now.getFullYear() && m <= now.getMonth() + 1);
		m === 12 ? (y++, (m = 1)) : m++
	) {
		out.push(`${y}-${String(m).padStart(2, '0')}`)
	}
	return out.reverse()
}

function formatMonth(month: string): string {
	return new Date(`${month}-01T00:00:00`)
		.toLocaleDateString('da-DK', { month: 'long', year: 'numeric' })
		.replace(/^./, (c) => c.toUpperCase())
}

function Th({
	children,
	right,
}: {
	children: React.ReactNode
	right?: boolean
}) {
	return (
		<th
			className={`text-muted px-5 py-3 text-xs font-medium tracking-[0.1em] uppercase ${right ? 'text-right' : 'text-left'}`}
		>
			{children}
		</th>
	)
}

const card = 'rounded-2xl border border-foreground/[0.08] bg-white'

function CurrentMonth() {
	return <span className="text-muted ml-2 text-xs font-normal">indtil nu</span>
}

function TopPages({
	title,
	rows,
}: {
	title: string
	rows: [string, string][]
}) {
	if (!rows.length) return null
	return (
		<div className={`mt-6 p-6 ${card}`}>
			<span className="text-muted text-xs font-medium tracking-[0.15em] uppercase">
				{title}
			</span>
			<ul className="mt-3">
				{rows.map(([path, text]) => (
					<li
						key={path}
						className="border-foreground/[0.06] flex flex-wrap items-baseline justify-between gap-2 border-b py-2 text-sm last:border-0"
					>
						<code className="text-foreground text-xs">{path}</code>
						<span className="text-muted text-xs">{text}</span>
					</li>
				))}
			</ul>
		</div>
	)
}

const notice =
	'rounded-2xl border border-amber-500/30 bg-amber-500/[0.06] p-6 text-sm leading-relaxed'

/**
 * Vises i stedet for tallene, når tællingerne ikke kan læses (læse-tokenet
 * mangler, eller Sanity afviste det). Uden token svarer Sanity med en tom
 * liste, og så ville fanen vise 0, selv om henvendelserne er talt og gemt.
 */
export function SiteEventsUnreadable({ isHorizen }: { isHorizen: boolean }) {
	if (!isHorizen) {
		return (
			<div className={notice}>
				<p className="text-foreground">
					Tallene kan ikke hentes lige nu, så de vises ikke her. Kontakt
					Horizen, hvis det varer ved.
				</p>
			</div>
		)
	}
	return (
		<div className={notice}>
			<p className="text-foreground font-medium">
				Tællingerne kan ikke læses, så tallene er skjult.
			</p>
			<p className="text-muted mt-2">
				Henvendelser og AI-besøg gemmes med private id&apos;er og kan kun læses
				med <code>SANITY_API_READ_TOKEN</code>. Den mangler i dette miljø, eller
				Sanity afviste den. Sæt et Viewer-token i Vercel (Production), og udrul
				igen. Fanen Opsætning viser, om nøglen findes.
			</p>
		</div>
	)
}

/**
 * Kun for Horizen: ingen hændelser endnu. Det er normalt de første dage, men
 * står det på 0 længe, er tælleren typisk ikke koblet på sitet.
 */
export function NoLeadsYet() {
	return (
		<div className={notice}>
			<p className="text-foreground font-medium">
				Ingen henvendelser talt endnu.
			</p>
			<p className="text-muted mt-2">
				Det er normalt lige efter opsætningen. Står det på 0 i mere end en uge,
				så tjek, at <code>SiteTracking</code> ligger i frontend-layoutet, at{' '}
				<code>/api/lead</code> svarer 405 på et almindeligt besøg, og at hvert
				formular-API kalder <code>recordLead(&apos;form&apos;, sti)</code>, når
				mailen er sendt.
			</p>
		</div>
	)
}

/* ── Seneste henvendelser: én linje pr. henvendelse med dag og klokkeslæt (Andreas 19/11-2026) ── */

const TZ = 'Europe/Copenhagen'
const TYPE_LABEL: Record<LeadType, string> = {
	form: 'Formular',
	phone: 'Telefon',
	email: 'Mail',
	booked: 'Booking',
	booking: 'Klik på book tid',
	contact: 'Klik til kontakt',
}
/** Gentagne klik (samme type, side og kilde) inden for så kort tid tælles som én linje. */
const REPEAT_MS = 15 * 60_000

/** 'ÅÅÅÅ-MM-DD' i dansk tid */
function dayKey(d: Date): string {
	return d.toLocaleDateString('sv-SE', { timeZone: TZ })
}

function dayLabel(key: string, now: Date): string {
	const today = dayKey(now)
	const yesterday = dayKey(new Date(now.getTime() - 86_400_000))
	const date = new Date(`${key}T12:00:00Z`)
		.toLocaleDateString('da-DK', {
			timeZone: TZ,
			weekday: 'long',
			day: 'numeric',
			month: 'long',
		})
	if (key === today) return `I dag · ${date}`
	if (key === yesterday) return `I går · ${date}`
	return date.replace(/^./, (c) => c.toUpperCase())
}

function clock(d: Date): string {
	return d.toLocaleTimeString('da-DK', {
		timeZone: TZ,
		hour: '2-digit',
		minute: '2-digit',
	})
}

type LeadRow = { first: Date; last: Date; e: LeadEvent; count: number }

function LeadDay({
	day,
	rows,
	now,
}: {
	day: string
	rows: LeadRow[]
	now: Date
}) {
	const total = rows.length
	const clicks = rows.reduce((a, r) => a + r.count, 0)
	// uden kilde = målt før kilden kom med; står som direkte/ukendt som i "Hvor kom de fra?"
	const sourceLabel = (s?: TrafficSource) =>
		TRAFFIC_SOURCES.find((t) => t.key === (s ?? 'direct'))?.label ?? 'Direkte / ukendt'
	return (
		<li className="border-foreground/[0.06] border-b last:border-0">
			<div className="bg-foreground/[0.02] flex items-baseline justify-between gap-3 px-5 py-2.5">
				<span className="text-foreground text-sm font-medium">
					{dayLabel(day, now)}
				</span>
				<span className="text-muted text-xs">
					{total} {total === 1 ? 'henvendelse' : 'henvendelser'}
					{clicks > total && ` (${clicks} klik)`}
				</span>
			</div>
			<ul>
				{rows.map((r) => (
					<li
						key={r.first.toISOString()}
						className="border-foreground/[0.04] grid grid-cols-[4.5rem_1fr] gap-x-4 gap-y-1 border-t px-5 py-3 text-sm sm:grid-cols-[4.5rem_7rem_1fr_auto] sm:items-baseline"
					>
						<span className="text-foreground font-medium tabular-nums">
							kl. {clock(r.first)}
						</span>
						<span className="text-foreground">
							{TYPE_LABEL[r.e.type] ?? r.e.type}
							{r.count > 1 && (
								<span className="text-muted text-xs">
									{' '}
									· {r.count} klik til kl. {clock(r.last)}
								</span>
							)}
						</span>
						<code className="text-muted col-start-2 truncate text-xs sm:col-start-auto">
							{r.e.path}
						</code>
						<span className="text-muted col-start-2 text-xs sm:col-start-auto sm:text-right">
							{sourceLabel(r.e.source)}
						</span>
					</li>
				))}
			</ul>
		</li>
	)
}

/** Gentagne klik samles, når de ligger tæt (fx 4 klik på mailen på 2 minutter). Nyeste først. */
function mergeRows(events: LeadEvent[]): LeadRow[] {
	const sorted = [...events].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
	const rows: LeadRow[] = []
	for (const e of sorted) {
		const t = new Date(e.createdAt)
		const prev = rows[rows.length - 1]
		if (
			prev &&
			prev.e.type === e.type &&
			prev.e.path === e.path &&
			prev.e.source === e.source &&
			prev.first.getTime() - t.getTime() <= REPEAT_MS &&
			dayKey(prev.first) === dayKey(t)
		) {
			prev.first = t
			prev.count += 1
		} else {
			rows.push({ first: t, last: t, e, count: 1 })
		}
	}
	return rows
}

/**
 * Én hændelse pr. henvendelse: gentagne klik (samme type, side og kilde inden
 * for et kvarter) slås sammen, så fx 4 tryk på telefonnummeret på 2 minutter
 * tæller som 1 (fra ACP, Andreas 23/11-2026). Bruges til alle tal, så
 * forsiden, månedstabellen, kilderne og siderne viser det samme som "Seneste
 * henvendelser". Rå klik ligger stadig i Sanity.
 */
export function uniqueLeads(events: LeadEvent[]): LeadEvent[] {
	return mergeRows(events).map((r) => ({ ...r.e, createdAt: r.first.toISOString() }))
}

const WEEKS_SHOWN = 12
/** Samme grøn som grafen under Synlighed (SearchTrendChart) */
const GREEN = '#34d399'
const DAY_MS = 86_400_000

/** Mandagen i ugen for en dag ('ÅÅÅÅ-MM-DD'), som 'ÅÅÅÅ-MM-DD'. */
function mondayOf(key: string): string {
	const d = new Date(`${key}T00:00:00Z`)
	return new Date(d.getTime() - ((d.getUTCDay() + 6) % 7) * DAY_MS)
		.toISOString()
		.slice(0, 10)
}

const Chevron = ({ group }: { group: 'latest' | 'month' }) => (
	<svg
		viewBox="0 0 24 24"
		className={`text-muted size-5 shrink-0 transition-transform ${group === 'latest' ? 'group-open/latest:rotate-180' : 'size-4 group-open/month:rotate-180'}`}
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		aria-hidden="true"
	>
		<path d="m6 9 6 6 6-6" />
	</svg>
)

/** Henvendelser pr. uge fra den uge, tællingen startede (højst 12 uger tilbage). */
function weeklyCounts(rows: LeadRow[], now: Date): { week: string; n: number }[] {
	if (!rows.length) return []
	const thisMonday = mondayOf(dayKey(now))
	const firstMonday = mondayOf(dayKey(rows[rows.length - 1].first))
	const weeks = Array.from({ length: WEEKS_SHOWN }, (_, i) =>
		new Date(new Date(`${thisMonday}T00:00:00Z`).getTime() - (WEEKS_SHOWN - 1 - i) * 7 * DAY_MS)
			.toISOString()
			.slice(0, 10),
	).filter((w) => w >= firstMonday)
	return weeks.map((week) => ({
		week,
		n: rows.filter((r) => mondayOf(dayKey(r.first)) === week).length,
	}))
}

function daysInMonth(month: string): number {
	const [y, m] = month.split('-').map(Number)
	return new Date(Date.UTC(y, m, 0)).getUTCDate()
}

/** Denne måned indtil i dag mod samme dag sidste måned (i dansk tid). */
function monthCompare(rows: LeadRow[], now: Date) {
	const today = dayKey(now)
	const month = today.slice(0, 7)
	const day = Number(today.slice(8, 10))
	const [y, m] = month.split('-').map(Number)
	const prev = m === 1 ? `${y - 1}-12` : `${y}-${String(m - 1).padStart(2, '0')}`
	const perDay = (mon: string) => {
		const out = new Array<number>(daysInMonth(mon) + 1).fill(0)
		for (const r of rows) {
			const k = dayKey(r.first)
			if (k.startsWith(mon)) out[Number(k.slice(8, 10))] += 1
		}
		return out
	}
	const cur = perDay(month)
	const before = perDay(prev)
	const sumTo = (a: number[], d: number) => a.slice(0, d + 1).reduce((x, v) => x + v, 0)
	const name = (mon: string) =>
		new Date(`${mon}-15T12:00:00Z`).toLocaleDateString('da-DK', { month: 'long' })
	// Sammenligningen giver kun mening, hvis tællingen kørte i sidste måned
	const first = rows.length ? dayKey(rows[rows.length - 1].first) : today
	const measuredPrev = first.slice(0, 7) <= prev
	return {
		month,
		prev,
		day,
		cur,
		before,
		curTotal: sumTo(cur, day),
		prevSamePoint: sumTo(before, Math.min(day, before.length - 1)),
		prevTotal: sumTo(before, before.length - 1),
		monthName: name(month),
		prevName: name(prev),
		measuredPrev,
	}
}

/**
 * Kortet øverst i Henvendelser: "hvordan går det denne måned?" ét sted (Andreas
 * 20/11-2026). Stort tal, piller og den løbende kurve (denne måned mod sidste
 * måned, dag for dag). Samme mørke stil som grafen under Synlighed.
 */
function LeadHero({ rows, now }: { rows: LeadRow[]; now: Date }) {
	if (!rows.length) return null
	const c = monthCompare(rows, now)
	const diff = c.curTotal - c.prevSamePoint
	const weeks = weeklyCounts(rows, now)
	const fullWeeks = weeks.slice(0, -1).map((w) => w.n)
	const avg = fullWeeks.length ? fullWeeks.reduce((a, b) => a + b, 0) / fullWeeks.length : null
	const latest = rows[0]
	const cap = (t: string) => t.replace(/^./, (ch) => ch.toUpperCase())

	// Løbende kurve: x = dag 1-31, y = henvendelser i måneden indtil den dag
	const W = 1000
	const H = 200
	const maxDay = 31
	const top = Math.max(1, c.curTotal, c.measuredPrev ? c.prevTotal : 0)
	const x = (d: number) => ((d - 1) / (maxDay - 1)) * W
	const y = (n: number) => H - (n / top) * (H - 24)
	// Blød kurve med punkter kun på dage med henvendelser (trappen var svær at læse)
	const curve = (perDay: number[], lastDay: number) => {
		let n = 0
		const pts = [{ x: x(1), y: y(0) }]
		for (let day = 1; day <= lastDay; day++) {
			if (!perDay[day]) continue
			n += perDay[day]
			if (day === 1) pts[0] = { x: x(1), y: y(n) }
			else pts.push({ x: x(day), y: y(n) })
		}
		if (pts[pts.length - 1].x < x(lastDay)) pts.push({ x: x(lastDay), y: y(n) })
		return { d: smoothPath(pts), total: n }
	}
	const cur = curve(c.cur, c.day)
	const prev = curve(c.before, c.before.length - 1)

	const soft = 'rgba(255,255,255,0.08)'
	const dim = 'rgba(255,255,255,0.5)'

	return (
		<div
			className="mt-6 rounded-3xl p-6 md:p-8"
			style={{
				backgroundColor: '#0e0f0f',
				border: '1px solid rgba(255,255,255,0.08)',
				color: '#fff',
			}}
		>
			<div className="grid gap-8 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:items-end">
				<div>
					<span className="text-[11px] tracking-[0.14em] uppercase" style={{ color: dim }}>
						Henvendelser i {c.monthName} indtil nu
					</span>
					<p className="mt-2 text-5xl font-normal tracking-[-0.04em] tabular-nums md:text-6xl">
						{c.curTotal}
					</p>
					<div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
						{c.measuredPrev && (
							<span
								className="rounded-full px-2.5 py-1 font-medium"
								style={
									diff >= 0
										? { backgroundColor: `${GREEN}26`, color: GREEN }
										: { backgroundColor: soft, color: 'rgba(255,255,255,0.75)' }
								}
							>
								{diff > 0
									? `${diff} foran ${c.prevName} pr. ${c.day}.`
									: diff < 0
										? `${-diff} bagud for ${c.prevName} pr. ${c.day}.`
										: `Lige med ${c.prevName} pr. ${c.day}.`}
							</span>
						)}
						{avg !== null && (
							<span className="rounded-full px-2.5 py-1" style={{ backgroundColor: soft, color: 'rgba(255,255,255,0.75)' }}>
								{avg.toLocaleString('da-DK', { maximumFractionDigits: 1 })} pr. uge i snit
							</span>
						)}
						<span className="rounded-full px-2.5 py-1" style={{ backgroundColor: soft, color: 'rgba(255,255,255,0.75)' }}>
							Seneste: {dayLabel(dayKey(latest.first), now).split(' · ')[0].toLowerCase()} kl.{' '}
							{clock(latest.first)} · {TYPE_LABEL[latest.e.type] ?? latest.e.type}
						</span>
					</div>
					{/* Kun når fanen Sæsoner har kundens egne tal (ellers er den skjult for kunden) */}
					{SEASON_HAS_DATA && (
						<div className="mt-6">
							<DarkTabLink to={{ v: 'analytics', s: 'saeson' }}>Er det sæson? Se Sæsoner</DarkTabLink>
						</div>
					)}
				</div>

				<div>
					<div className="relative h-40">
						<svg
							viewBox={`0 0 ${W} ${H}`}
							preserveAspectRatio="none"
							className="absolute inset-0 h-full w-full overflow-visible"
							role="img"
							aria-label={`${c.curTotal} henvendelser i ${c.monthName} indtil nu mod ${c.prevSamePoint} på samme tid i ${c.prevName}`}
						>
							<defs>
								<linearGradient id="lead-hero-fill" x1="0" y1="0" x2="0" y2="1">
									<stop offset="0%" stopColor={GREEN} stopOpacity="0.3" />
									<stop offset="100%" stopColor={GREEN} stopOpacity="0" />
								</linearGradient>
							</defs>
							<line x1="0" y1={H} x2={W} y2={H} stroke="rgba(255,255,255,0.15)" vectorEffect="non-scaling-stroke" />
							<line
								x1={x(c.day)} y1="0" x2={x(c.day)} y2={H}
								stroke="rgba(255,255,255,0.2)"
								strokeDasharray="3 4"
								vectorEffect="non-scaling-stroke"
							/>
							{c.measuredPrev && (
								<path
									d={prev.d}
									fill="none"
									stroke="rgba(255,255,255,0.45)"
									strokeWidth="2"
									strokeDasharray="6 5"
									vectorEffect="non-scaling-stroke"
								/>
							)}
							<path d={`${cur.d} L${x(c.day)} ${H} L${x(1)} ${H} Z`} fill="url(#lead-hero-fill)" />
							<path
								d={cur.d}
								fill="none"
								stroke={GREEN}
								strokeWidth="2.5"
								strokeLinejoin="round"
								strokeLinecap="round"
								vectorEffect="non-scaling-stroke"
							/>
						</svg>
						<span
							className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
							style={{
								left: `${(x(c.day) / W) * 100}%`,
								top: `${(y(cur.total) / H) * 100}%`,
								backgroundColor: GREEN,
								boxShadow: `0 0 0 3px #0e0f0f, 0 0 14px ${GREEN}`,
							}}
						/>
						<span
							className="absolute -translate-y-1/2 pl-3 text-xs font-medium tabular-nums"
							style={{ left: `${(x(c.day) / W) * 100}%`, top: `${(y(cur.total) / H) * 100}%`, color: GREEN }}
						>
							{cur.total}
						</span>
						{c.measuredPrev && (
							<span
								className="absolute right-0 -translate-y-full pb-1 text-xs tabular-nums"
								style={{ top: `${(y(prev.total) / H) * 100}%`, color: dim }}
							>
								{prev.total}
							</span>
						)}
					</div>
					<div className="mt-2 flex justify-between text-[11px]" style={{ color: dim }}>
						<span>1.</span>
						<span>15.</span>
						<span>31.</span>
					</div>
					<div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
						<span className="flex items-center gap-1.5">
							<span className="inline-block h-0.5 w-4 rounded" style={{ backgroundColor: GREEN }} />
							<span>
								<span className="font-medium" style={{ color: "#fff" }}>{cap(c.monthName)} {c.curTotal}</span> indtil nu
							</span>
						</span>
						{c.measuredPrev && (
							<span className="flex items-center gap-1.5">
								<span className="inline-block w-4 border-t-2 border-dashed" style={{ borderColor: dim }} />
								<span>
									<span className="font-medium" style={{ color: "#fff" }}>
										{cap(c.prevName)} {c.prevSamePoint}
									</span>{' '}
									på samme dag ({c.prevTotal} i alt)
								</span>
							</span>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

function LatestLeads({ events, now }: { events: LeadEvent[]; now: Date }) {
	if (!events.length) return null
	const rows = mergeRows(events)

	// dage samlet under deres måned, nyeste først
	const months = new Map<string, Map<string, LeadRow[]>>()
	for (const r of rows) {
		const day = dayKey(r.first)
		const month = months.get(day.slice(0, 7)) ?? new Map<string, LeadRow[]>()
		month.set(day, [...(month.get(day) ?? []), r])
		months.set(day.slice(0, 7), month)
	}
	const latest = rows[0]
	const latestText = `${dayLabel(dayKey(latest.first), now)} kl. ${clock(latest.first)} · ${TYPE_LABEL[latest.e.type] ?? latest.e.type} · ${latest.e.path}`

	return (
		<details className={`group/latest mt-10 overflow-hidden ${card}`}>
			<summary className="hover:bg-foreground/[0.015] flex cursor-pointer list-none items-center justify-between gap-4 p-5 transition-colors md:p-6 [&::-webkit-details-marker]:hidden">
				<span className="min-w-0">
					<span className="text-foreground block text-lg font-medium tracking-[-0.01em]">
						Seneste henvendelser
					</span>
					<span className="text-muted mt-1 block text-sm">
						Seneste: {latestText}
					</span>
				</span>
				<Chevron group="latest" />
			</summary>

			<div className="border-foreground/[0.08] border-t">

				<p className="text-muted px-5 pt-5 pb-3 text-sm leading-relaxed">
					Hver henvendelse med dag og klokkeslæt (dansk tid), nyeste først. Flere
					klik af samme slags på samme side inden for et kvarter står som én
					linje, fordi det typisk er den samme person.
				</p>

				<ul>
					{[...months.entries()].map(([month, days], i) => {
						const monthRows = [...days.values()].flat()
						const clicks = monthRows.reduce((a, r) => a + r.count, 0)
						return (
							<li key={month} className="border-foreground/[0.08] border-t">
								<details className="group/month" open={i === 0}>
									<summary className="hover:bg-foreground/[0.015] flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-3.5 transition-colors [&::-webkit-details-marker]:hidden">
										<span className="text-foreground text-sm font-medium">
											{formatMonth(month)}
										</span>
										<span className="text-muted flex items-center gap-3 text-xs">
											{monthRows.length}{' '}
											{monthRows.length === 1 ? 'henvendelse' : 'henvendelser'}
											{clicks > monthRows.length && ` (${clicks} klik)`}
											<Chevron group="month" />
										</span>
									</summary>
									<ul className="border-foreground/[0.06] border-t">
										{[...days.entries()].map(([day, r]) => (
											<LeadDay key={day} day={day} rows={r} now={now} />
										))}
									</ul>
								</details>
							</li>
						)
					})}
				</ul>
			</div>
		</details>
	)
}

export function LeadsSection({
	events,
	snapshots,
	now,
}: {
	events: LeadEvent[]
	snapshots: SeoSnapshot[]
	now: string
}) {
	const months = monthsFromFirst(events, new Date(now))
	const current = months[0]
	const empty = () =>
		({ form: 0, phone: 0, email: 0, booked: 0, booking: 0, contact: 0 }) as Record<
			LeadType,
			number
		>
	// Klik på book tid og til kontakt står for sig og tæller ikke med i "I alt"
	const sum = (c: Record<LeadType, number>) =>
		c.form + c.phone + c.email + c.booked
	const clicksOnly = (c: Record<LeadType, number>) => c.booking + c.contact
	const leads = uniqueLeads(events)
	// Kun henvendelser i kurven, kilderne og listen (CLICK_ONLY er ikke henvendelser)
	const inquiries = events.filter(isInquiry)

	const byMonth = new Map(months.map((m) => [m, empty()]))
	const byPage = new Map<string, Record<LeadType, number>>()
	for (const e of leads) {
		const c = byMonth.get(e.createdAt.slice(0, 7))
		if (c && e.type in c) c[e.type] += 1
		const p = byPage.get(e.path) ?? empty()
		if (e.type in p) p[e.type] += 1
		byPage.set(e.path, p)
	}
	const cur = byMonth.get(current) ?? empty()
	const clicks = new Map(snapshots.map((s) => [s.month, s.clicks]))

	return (
		<section>
			<p className="text-muted max-w-3xl text-sm leading-relaxed">
				Sendte formularer, klik på telefonnummer og mailadresse og gennemførte
				bookinger på sitet, talt anonymt (uden cookies, så alle besøgende
				tælles). Vises ved siden af klikkene fra Google, så vi kan se, om
				synligheden bliver til henvendelser. Flere klik af samme slags på samme
				side inden for et kvarter tæller som én henvendelse. Klik på
				&quot;Book tid&quot; og på knapper til kontaktsiden vises for sig: de
				viser interesse, men er ikke en henvendelse, før nogen booker eller
				skriver.
			</p>

			<LeadHero rows={mergeRows(inquiries)} now={new Date(now)} />


			<div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{LEAD_COLUMNS.map((t) => (
					<div key={t.key} className={`p-6 ${card}`}>
						<span className="text-muted text-xs font-medium tracking-[0.15em] uppercase">
							{t.label}
						</span>
						<div className="text-foreground mt-3 text-3xl font-normal tracking-[-0.03em] md:text-[2.5rem]">
							{cur[t.key]}
						</div>
						<p className="text-muted mt-2 text-xs">
							{formatMonth(current)} indtil nu
						</p>
						<p className="text-muted mt-2 text-xs leading-relaxed">{t.hint}</p>
					</div>
				))}
			</div>

			<div className={`mt-6 overflow-x-auto ${card}`}>
				<table className="w-full min-w-[980px] text-sm">
					<thead>
						<tr className="border-foreground/[0.08] border-b">
							<Th>Måned</Th>
							<Th right>Klik fra Google</Th>
							{LEAD_COLUMNS.map((t) => (
								<Th key={t.key} right>
									{t.label}
								</Th>
							))}
							<Th right>I alt</Th>
						</tr>
					</thead>
					<tbody>
						{months.map((m) => {
							const c = byMonth.get(m)!
							const g = clicks.get(m)
							return (
								<tr
									key={m}
									className="border-foreground/[0.06] border-b last:border-0"
								>
									<td className="text-foreground px-5 py-3 font-medium">
										{formatMonth(m)}
										{m === current && <CurrentMonth />}
									</td>
									<td className="text-foreground px-5 py-3 text-right">
										{g != null ? (
											g.toLocaleString('da-DK')
										) : (
											<span className="text-muted">kommer den 3.</span>
										)}
									</td>
									{LEAD_COLUMNS.map((t) => (
										<td
											key={t.key}
											className="text-foreground px-5 py-3 text-right"
										>
											{c[t.key]}
										</td>
									))}
									<td className="text-foreground px-5 py-3 text-right font-medium">
										{sum(c)}
									</td>
								</tr>
							)
						})}
					</tbody>
				</table>
			</div>

			<LeadSources events={leads.filter(isInquiry)} months={months} />

			<LatestLeads events={inquiries} now={new Date(now)} />

			<TopPages
				title="Her skete henvendelserne"
				rows={[...byPage.entries()]
					.sort((a, b) => sum(b[1]) + clicksOnly(b[1]) - (sum(a[1]) + clicksOnly(a[1])))
					.slice(0, 8)
					.map(([path, c]) => [
						path,
						[
							c.form && `${c.form} formular${c.form === 1 ? '' : 'er'}`,
							c.phone && `${c.phone} telefon`,
							c.email && `${c.email} mail`,
							c.booked && `${c.booked} booket`,
							c.booking && `${c.booking} klik på book tid`,
							c.contact && `${c.contact} klik til kontakt`,
						]
							.filter(Boolean)
							.join(' · '),
					])}
			/>

			<p className="text-muted mt-4 max-w-3xl text-xs leading-relaxed">
				<span className="font-medium">Ikke med her:</span> opkald, hvor nummeret
				tastes i hånden, og opkald direkte fra Google My Business (se Google
				Business Profile → Effektivitet). Et klik på telefonnummeret er et
				forsøg på at ringe, ikke nødvendigvis et gennemført opkald. Bookinger
				tæller kun dem, der bookes i kalenderen her på sitet, ikke via et
				direkte cal.com-link.
			</p>
		</section>
	)
}

// Altid vist (også med 0), så Google Ads og SEO kan stilles op mod hinanden.
// De øvrige kilder vises kun, når de har haft mindst én henvendelse.
const CORE_SOURCES: TrafficSource[] = [
	'google_ads',
	'google_organic',
	'google_profile',
	'direct',
]

/** Henvendelserne fordelt på, hvor besøgeren kom fra. Uden kilde = Direkte / ukendt. */
function LeadSources({
	events,
	months,
}: {
	events: LeadEvent[]
	months: string[]
}) {
	const current = months[0]
	const sourceOf = (e: LeadEvent): TrafficSource => e.source ?? 'direct'
	const shown = TRAFFIC_SOURCES.filter(
		(s) =>
			CORE_SOURCES.includes(s.key) || events.some((e) => e.source === s.key),
	)
	const empty = () =>
		Object.fromEntries(TRAFFIC_SOURCES.map((s) => [s.key, 0])) as Record<
			TrafficSource,
			number
		>
	const byMonth = new Map(months.map((m) => [m, empty()]))
	for (const e of events) {
		const c = byMonth.get(e.createdAt.slice(0, 7))
		if (c) c[sourceOf(e)] += 1
	}
	const cur = byMonth.get(current) ?? empty()
	const firstWithSource = events
		.filter((e) => e.source)
		.map((e) => e.createdAt)
		.sort()[0]
	const unmeasured = events.some(
		(e) => !e.source && (!firstWithSource || e.createdAt < firstWithSource),
	)

	return (
		<div className="mt-10">
			<h3 className="text-foreground text-lg font-medium tracking-[-0.01em]">
				Hvor kom henvendelserne fra?
			</h3>
			<p className="text-muted mt-2 max-w-3xl text-sm leading-relaxed">
				Hver henvendelse får den kilde med, besøgeren kom fra, da de landede på
				sitet. Så kan vi se, hvor mange der kommer fra annoncerne, og hvor mange
				der kommer fra SEO-arbejdet.
			</p>

			<div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
				{shown.map((s) => (
					<div key={s.key} className={`p-6 ${card}`}>
						<span className="text-muted text-xs font-medium tracking-[0.15em] uppercase">
							{s.label}
						</span>
						<div className="text-foreground mt-3 text-3xl font-normal tracking-[-0.03em] md:text-[2.5rem]">
							{cur[s.key]}
						</div>
						<p className="text-muted mt-2 text-xs">
							{formatMonth(current)} indtil nu
						</p>
						<p className="text-muted mt-2 text-xs leading-relaxed">{s.hint}</p>
					</div>
				))}
			</div>

			<div className={`mt-6 overflow-x-auto ${card}`}>
				<table className="w-full min-w-[620px] text-sm">
					<thead>
						<tr className="border-foreground/[0.08] border-b">
							<Th>Måned</Th>
							{shown.map((s) => (
								<Th key={s.key} right>
									{s.label}
								</Th>
							))}
							<Th right>I alt</Th>
						</tr>
					</thead>
					<tbody>
						{months.map((m) => {
							const c = byMonth.get(m)!
							return (
								<tr
									key={m}
									className="border-foreground/[0.06] border-b last:border-0"
								>
									<td className="text-foreground px-5 py-3 font-medium">
										{formatMonth(m)}
										{m === current && <CurrentMonth />}
									</td>
									{shown.map((s) => (
										<td
											key={s.key}
											className="text-foreground px-5 py-3 text-right"
										>
											{c[s.key]}
										</td>
									))}
									<td className="text-foreground px-5 py-3 text-right font-medium">
										{Object.values(c).reduce((a, b) => a + b, 0)}
									</td>
								</tr>
							)
						})}
					</tbody>
				</table>
			</div>

			<p className="text-muted mt-4 max-w-3xl text-xs leading-relaxed">
				<span className="font-medium">Sådan skal tallene læses:</span> kilden
				aflæses, når besøget starter, og huskes, mens besøgeren klikker rundt.
				Lukker de siden og kommer igen senere via et bogmærke, står de som
				direkte/ukendt. Klik fra Google My Business kan kun skilles fra organisk
				søgning, når linket på profilen ender på <code>?utm_source=gbp</code>.
				Opkald direkte fra annoncen eller profilen kommer aldrig forbi sitet og
				står i Google Ads og Google My Business.
				{unmeasured &&
					(firstWithSource
						? ` Kilden er målt fra ${new Date(firstWithSource).toLocaleDateString('da-DK', { day: 'numeric', month: 'long', year: 'numeric' })}; henvendelser fra før står som direkte/ukendt.`
						: ' Kilden måles fra næste henvendelse; de hidtidige står som direkte/ukendt.')}
			</p>
		</div>
	)
}

export function AiVisitsSection({
	visits,
	now,
}: {
	visits: AiVisit[]
	now: string
}) {
	const months = monthsFromFirst(visits, new Date(now))
	const current = months[0]
	const empty = () =>
		Object.fromEntries(AI_SOURCES.map((s) => [s.key, 0])) as Record<
			AiSource,
			number
		>
	const sum = (c: Record<AiSource, number>) =>
		Object.values(c).reduce((a, b) => a + b, 0)

	const byMonth = new Map(months.map((m) => [m, empty()]))
	const byPage = new Map<string, number>()
	for (const v of visits) {
		const c = byMonth.get(v.createdAt.slice(0, 7))
		if (c && v.source in c) c[v.source] += 1
		byPage.set(v.path, (byPage.get(v.path) ?? 0) + 1)
	}
	const cur = byMonth.get(current) ?? empty()

	return (
		<section>
			<p className="text-muted max-w-3xl text-sm leading-relaxed">
				Besøgende, der klikker ind på sitet fra et svar i ChatGPT, Perplexity,
				Claude, Gemini eller Copilot, talt anonymt (uden cookies). Det viser, om
				AI-tjenesterne bruger og linker til indholdet, når folk spørger dem i
				stedet for at google.
			</p>

			<div className="mt-6 grid gap-4 sm:grid-cols-3">
				<div className={`p-6 ${card}`}>
					<span className="text-muted text-xs font-medium tracking-[0.15em] uppercase">
						Besøg fra AI i alt
					</span>
					<div className="text-foreground mt-3 text-3xl font-normal tracking-[-0.03em] md:text-[2.5rem]">
						{sum(cur)}
					</div>
					<p className="text-muted mt-2 text-xs">
						{formatMonth(current)} indtil nu
					</p>
				</div>
				<div className={`p-6 sm:col-span-2 ${card}`}>
					<span className="text-muted text-xs font-medium tracking-[0.15em] uppercase">
						Fordelt på tjeneste
					</span>
					<ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
						{AI_SOURCES.map((s) => (
							<li
								key={s.key}
								className="text-foreground flex justify-between text-sm"
							>
								<span>{s.label}</span>
								<span className="font-medium">{cur[s.key]}</span>
							</li>
						))}
					</ul>
				</div>
			</div>

			<div className={`mt-6 overflow-x-auto ${card}`}>
				<table className="w-full min-w-[620px] text-sm">
					<thead>
						<tr className="border-foreground/[0.08] border-b">
							<Th>Måned</Th>
							{AI_SOURCES.map((s) => (
								<Th key={s.key} right>
									{s.label}
								</Th>
							))}
							<Th right>I alt</Th>
						</tr>
					</thead>
					<tbody>
						{months.map((m) => {
							const c = byMonth.get(m)!
							return (
								<tr
									key={m}
									className="border-foreground/[0.06] border-b last:border-0"
								>
									<td className="text-foreground px-5 py-3 font-medium">
										{formatMonth(m)}
										{m === current && <CurrentMonth />}
									</td>
									{AI_SOURCES.map((s) => (
										<td
											key={s.key}
											className="text-foreground px-5 py-3 text-right"
										>
											{c[s.key]}
										</td>
									))}
									<td className="text-foreground px-5 py-3 text-right font-medium">
										{sum(c)}
									</td>
								</tr>
							)
						})}
					</tbody>
				</table>
			</div>

			<TopPages
				title="Her landede de"
				rows={[...byPage.entries()]
					.sort((a, b) => b[1] - a[1])
					.slice(0, 8)
					.map(([p, n]) => [p, `${n} besøg`])}
			/>

			<p className="text-muted mt-4 max-w-3xl text-xs leading-relaxed">
				<span className="font-medium">Ikke med her:</span> når en AI nævner
				virksomheden, uden at nogen klikker, og AI-svar i Googles egne
				søgeresultater (de tæller som klik fra Google). Nogle apps sender ikke,
				hvor besøgeren kom fra, så tallet er et minimum.
			</p>
		</section>
	)
}

/** Fanen Synlighed → Sæsoner: Googles sæson pr. ydelse med jeres henvendelser pr. måned ovenpå. */
export function SeasonSection({ events, now }: { events: LeadEvent[]; now: string }) {
	// Klik på book tid og til kontakt er ikke henvendelser
	const rows = mergeRows(events.filter(isInquiry))
	const leads: Record<string, number> = {}
	for (const r of rows) {
		const m = dayKey(r.first).slice(0, 7)
		leads[m] = (leads[m] ?? 0) + 1
	}
	const first = rows.length ? dayKey(rows[rows.length - 1].first).slice(0, 7) : '9999-12'
	return (
		<SeasonChart leads={leads} firstMonth={first} currentMonth={dayKey(new Date(now)).slice(0, 7)} />
	)
}
