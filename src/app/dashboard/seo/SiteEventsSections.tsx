import { AI_SOURCES, type AiSource } from '@/lib/aiSources'
import type { LeadType } from '@/lib/siteEvents'
import { TRAFFIC_SOURCES, type TrafficSource } from '@/lib/trafficSource'
import type { SeoSnapshot } from './data'

/**
 * Sektionerne under Performance → Henvendelser og AI-søgning, bygget på de anonyme tællere i
 * src/lib/siteEvents.ts:
 *   - "Henvendelser fra hjemmesiden": klik på telefon/mail (+ formularer, hvis
 *     projektets formular-API kalder recordLead('form')), ved siden af klik fra Google
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
]

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
		({ form: 0, phone: 0, email: 0 }) as Record<LeadType, number>
	const sum = (c: Record<LeadType, number>) => c.form + c.phone + c.email

	const byMonth = new Map(months.map((m) => [m, empty()]))
	const byPage = new Map<string, Record<LeadType, number>>()
	for (const e of events) {
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
				Sendte formularer og klik på telefonnummer og mailadresse på sitet, talt
				anonymt (uden cookies, så alle besøgende tælles). Vises ved siden af
				klikkene fra Google, så vi kan se, om synligheden bliver til
				henvendelser.
			</p>

			<div className="mt-6 grid gap-4 sm:grid-cols-3">
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
				<table className="w-full min-w-[620px] text-sm">
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

			<LeadSources events={events} months={months} />

			<TopPages
				title="Her skete henvendelserne"
				rows={[...byPage.entries()]
					.sort((a, b) => sum(b[1]) - sum(a[1]))
					.slice(0, 8)
					.map(([path, c]) => [
						path,
						[
							c.form && `${c.form} formular${c.form === 1 ? '' : 'er'}`,
							c.phone && `${c.phone} telefon`,
							c.email && `${c.email} mail`,
						]
							.filter(Boolean)
							.join(' · '),
					])}
			/>

			<p className="text-muted mt-4 max-w-3xl text-xs leading-relaxed">
				<span className="font-medium">Ikke med her:</span> opkald, hvor nummeret
				tastes i hånden, og opkald direkte fra Google My Business (se Google
				Business Profile → Effektivitet). Et klik på telefonnummeret er et
				forsøg på at ringe, ikke nødvendigvis et gennemført opkald.
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
