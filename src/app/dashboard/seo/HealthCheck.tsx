'use client'

import { useEffect, useState, type ReactNode } from 'react'
import {
	OPTIMIZE_SUBJECT,
	type HealthCategory,
	type HealthEntry,
	type HealthResult,
	type HealthStrategy,
} from './helbred/types'

/**
 * Performance → Sidens helbred. Googles PageSpeed Insights (Lighthouse) måler
 * forsiden den 3. i hver måned (/api/cron/page-health), og målingerne ligger i
 * Sanity. Viser den nyeste måling med udviklingen siden forrige måned og de
 * tidligere målinger. Computer vises først og er standard (Andreas' valg:
 * den ser pænest ud); mobil er et klik væk.
 *
 * "Mål nu" (helbred/route.ts) vises kun, når `canRun` er sand: altid for
 * Horizen, for kunden når healthCheckCustomerCanRun er slået til (standard).
 * Øverst står, hvornår der sidst blev målt og af hvem, så kunden kan se sin
 * seneste måling, når de kommer tilbage, og trykke igen for en ny.
 *
 * Øverst i rapporten står en samlet karakter (A+++ til F) som på en
 * energimærkning, og nederst kan kunden anmode om en optimering, som bliver
 * en almindelig opgave under Opgaver.
 */

const ENDPOINT = '/dashboard/seo/helbred'
const TZ = 'Europe/Copenhagen'

const CATEGORIES: { id: HealthCategory; label: string; hint: string }[] = [
	{
		id: 'performance',
		label: 'Hastighed',
		hint: 'Hvor hurtigt forsiden indlæses',
	},
	{
		id: 'accessibility',
		label: 'Tilgængelighed',
		hint: 'Om alle kan bruge siden, også med skærmlæser',
	},
	{
		id: 'best-practices',
		label: 'God praksis',
		hint: 'Sikkerhed og moderne teknik',
	},
	{ id: 'seo', label: 'Teknisk SEO', hint: 'Det tekniske grundlag for Google' },
]

const LAB_LABELS: Record<string, { label: string; hint: string }> = {
	'first-contentful-paint': {
		label: 'Første indhold vises',
		hint: 'Når de første tekster eller billeder dukker op.',
	},
	'largest-contentful-paint': {
		label: 'Siden er synlig',
		hint: 'Når det største element, ofte topbilledet, er vist.',
	},
	'total-blocking-time': {
		label: 'Ventetid før klik virker',
		hint: 'Hvor længe siden er optaget og ikke reagerer.',
	},
	'cumulative-layout-shift': {
		label: 'Ro i layoutet',
		hint: 'Hvor meget indholdet hopper under indlæsning. Lavere er bedre.',
	},
	'speed-index': {
		label: 'Hastighedsindeks',
		hint: 'Hvor hurtigt siden ser færdig ud.',
	},
}

const FIELD_LABELS: Record<string, string> = {
	LARGEST_CONTENTFUL_PAINT_MS: 'Siden er synlig',
	INTERACTION_TO_NEXT_PAINT: 'Reagerer på klik',
	CUMULATIVE_LAYOUT_SHIFT_SCORE: 'Ro i layoutet',
}

const FIELD_CATEGORY = {
	FAST: { label: 'God', color: 'var(--st-done-dot)' },
	AVERAGE: { label: 'Kan forbedres', color: 'var(--st-partial-dot)' },
	SLOW: { label: 'Dårlig', color: 'var(--st-missing-dot)' },
} as const

const ERRORS: Record<string, string> = {
	quota: 'Google har nået grænsen for målinger lige nu. Prøv igen senere.',
	cooldown: 'Der er lige blevet målt. Prøv igen om et par minutter.',
	forbidden: 'Du har ikke adgang til at måle.',
	'no-key':
		'PAGESPEED_API_KEY mangler i Vercel, eller sitet er ikke udrullet igen, efter den blev sat.',
	'no-url':
		'Sitets adresse mangler. Sæt NEXT_PUBLIC_BASE_URL eller PAGESPEED_URL til et https-domæne.',
	'not-saved':
		'Google målte, men målingen kunne ikke gemmes i Sanity. SANITY_API_WRITE_TOKEN (Editor) mangler i Vercel eller har for få rettigheder.',
	redirected:
		'Forsiden sender videre til en anden side (fx Vercels login). Sæt PAGESPEED_URL til sitets offentlige adresse.',
	failed: 'Målingen mislykkedes. Prøv igen om lidt.',
}

/* ─── Samlet karakter ───────────────────────────────────────── */

/** Skalaen, bedst først. Farverne er dashboardets egne statusfarver (dæmpet grøn, gul, rød). */
const GRADES = [
	{ grade: 'A+++', min: 98, label: 'Fremragende', tone: 'done' },
	{ grade: 'A++', min: 95, label: 'Fremragende', tone: 'done' },
	{ grade: 'A+', min: 90, label: 'Rigtig god', tone: 'done' },
	{ grade: 'A', min: 85, label: 'God', tone: 'done' },
	{ grade: 'B', min: 75, label: 'Pæn', tone: 'partial' },
	{ grade: 'C', min: 65, label: 'Kan forbedres', tone: 'partial' },
	{ grade: 'D', min: 50, label: 'Under middel', tone: 'missing' },
	{ grade: 'F', min: 0, label: 'Dårlig', tone: 'missing' },
] as const

/** Flade, tekst og kant i en statusfarve (dashboard.css → --st-*) */
const toneStyle = (tone: (typeof GRADES)[number]['tone']) => ({
	backgroundColor: `var(--st-${tone}-bg)`,
	color: `var(--st-${tone}-text)`,
	border: `1px solid var(--st-${tone}-border)`,
})

/** Gennemsnit af de kategorier, Google gav en score (null, hvis ingen) */
function overallScore(result: HealthResult) {
	const values = CATEGORIES.map((c) => result.scores[c.id]).filter(
		(v): v is number => v != null,
	)
	if (!values.length) return null
	return {
		score: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
		missing: CATEGORIES.length - values.length,
	}
}

const gradeFor = (score: number) =>
	GRADES.find((g) => score >= g.min) ?? GRADES[GRADES.length - 1]

/** Lighthouse' egne grænser: 90+ grøn, 50-89 gul, under 50 rød */
function scoreColor(score: number | null) {
	if (score == null) return 'var(--st-later-dot)'
	if (score >= 90) return 'var(--st-done-dot)'
	if (score >= 50) return 'var(--st-partial-dot)'
	return 'var(--st-missing-dot)'
}

const fmtSeconds = (ms: number) =>
	`${(ms / 1000).toLocaleString('da-DK', { maximumFractionDigits: 1 })} s`

function fieldValue(id: string, percentile: number) {
	if (id === 'CUMULATIVE_LAYOUT_SHIFT_SCORE')
		return (percentile / 100).toLocaleString('da-DK', {
			maximumFractionDigits: 2,
		})
	if (id === 'INTERACTION_TO_NEXT_PAINT') return `${percentile} ms`
	return fmtSeconds(percentile)
}

/** "3. november kl. 06.30" (altid dansk tid, så server og browser er enige) */
function fmtMeasured(iso: string) {
	const d = new Date(iso)
	const date = d.toLocaleDateString('da-DK', {
		day: 'numeric',
		month: 'long',
		timeZone: TZ,
	})
	const time = d.toLocaleTimeString('da-DK', {
		hour: '2-digit',
		minute: '2-digit',
		timeZone: TZ,
	})
	return `${date} kl. ${time}`
}

const fmtShortDate = (iso: string) =>
	new Date(iso).toLocaleDateString('da-DK', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
		timeZone: TZ,
	})

const monthName = (month: string) =>
	new Date(`${month}-15T12:00:00Z`).toLocaleDateString('da-DK', {
		month: 'long',
		timeZone: TZ,
	})

/** Næste månedlige måling: den 3. i denne måned eller den næste */
function nextRunLabel() {
	const now = new Date()
	const day = Number(
		now.toLocaleDateString('en-US', { day: 'numeric', timeZone: TZ }),
	)
	const next = new Date(
		now.getFullYear(),
		now.getMonth() + (day < 3 ? 0 : 1),
		3,
		12,
	)
	return next.toLocaleDateString('da-DK', { day: 'numeric', month: 'long' })
}

const card = 'rounded-3xl border border-foreground/[0.08] bg-white'

export default function HealthCheck({
	domain,
	history,
	canRun,
	example,
	optimizeHours,
	optimizeRequestedAt,
}: {
	domain: string
	history: HealthEntry[]
	canRun: boolean
	example: boolean
	/** Timeskøn for en optimering (data.ts); 0 = ingen knap */
	optimizeHours: number
	/** Dato for en åben anmodning om optimering, så den ikke sendes to gange */
	optimizeRequestedAt?: string
}) {
	const [strategy, setStrategy] = useState<HealthStrategy>('desktop')
	const [entries, setEntries] = useState(history)
	const [running, setRunning] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const latest = entries[0]
	const result = latest?.[strategy] ?? null
	// Udviklingen regnes fra den nyeste måling i en tidligere måned
	const previous =
		latest && entries.find((e) => e.month < latest.month && e[strategy])
	const older = entries.slice(1).filter((e) => e[strategy])

	async function run() {
		setRunning(true)
		setError(null)
		try {
			const res = await fetch(ENDPOINT, { method: 'POST' })
			const d = await res.json()
			if (d.entry) setEntries((p) => [d.entry, ...p])
			if (d.error) setError(ERRORS[d.error] ?? ERRORS.failed)
		} catch {
			setError(ERRORS.failed)
		} finally {
			setRunning(false)
		}
	}

	return (
		<div className="space-y-6">
			{/* Hvad der er målt, hvornår, enhed og evt. knap */}
			<div className={`${card} flex flex-wrap items-center gap-4 p-5 md:p-6`}>
				<div className="min-w-0 flex-1">
					<p className="text-foreground text-sm font-semibold">
						Forsiden{' '}
						<span className="text-foreground/45 font-normal">· {domain}</span>
					</p>
					<p className="text-foreground/50 mt-0.5 text-xs">
						{latest
							? `Seneste måling ${fmtMeasured(latest.measuredAt)}${
									latest.trigger === 'cron'
										? ' (automatisk)'
										: latest.measuredBy
											? ` af ${latest.measuredBy}`
											: ''
								}. `
							: ''}
						Måles automatisk den 3. i hver måned, næste gang {nextRunLabel()}
						{canRun ? '. Tryk Mål nu for en ny måling.' : '.'}
					</p>
				</div>
				{example && (
					<span
						className="rounded-full px-2.5 py-1 text-[11px] font-medium"
						style={{
							backgroundColor: 'var(--st-partial-bg)',
							color: 'var(--st-partial-text)',
						}}
					>
						Eksempeldata (kun lokalt)
					</span>
				)}
				<div
					className="bg-foreground/[0.06] flex rounded-full p-1"
					role="tablist"
					aria-label="Vælg enhed"
				>
					{(['desktop', 'mobile'] as const).map((s) => (
						<button
							key={s}
							type="button"
							role="tab"
							aria-selected={strategy === s}
							onClick={() => setStrategy(s)}
							className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
								strategy === s
									? 'bg-foreground text-background'
									: 'text-foreground/60 hover:text-foreground'
							}`}
						>
							{s === 'mobile' ? 'Mobil' : 'Computer'}
						</button>
					))}
				</div>
				{canRun && (
					<button
						type="button"
						onClick={run}
						disabled={running}
						className="bg-foreground text-background rounded-full px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
					>
						{running ? 'Måler…' : 'Mål nu'}
					</button>
				)}
			</div>

			{error && (
				<p
					className="rounded-2xl px-5 py-3 text-sm"
					style={{
						backgroundColor: 'var(--st-missing-bg)',
						color: 'var(--st-missing-text)',
					}}
					role="alert"
				>
					{error}
				</p>
			)}

			{running ? (
				<Measuring />
			) : result ? (
				<HealthReport
					result={result}
					previous={previous?.[strategy] ?? null}
					previousLabel={previous ? monthName(previous.month) : ''}
					strategy={strategy}
					optimize={
						optimizeHours > 0 ? (
							<OptimizeRequest
								hours={optimizeHours}
								requestedAt={optimizeRequestedAt}
								latest={latest}
							/>
						) : null
					}
				/>
			) : (
				<div className={`${card} p-8 text-center md:p-12`}>
					<p className="text-foreground text-base font-medium">
						Ingen måling endnu
					</p>
					<p className="text-foreground/55 mx-auto mt-2 max-w-md text-sm leading-relaxed">
						Den første måling kommer automatisk den {nextRunLabel()}
						{canRun ? ', eller tryk på Mål nu for at måle med det samme' : ''}.
					</p>
				</div>
			)}

			{!running && older.length > 0 && (
				<div className={`${card} p-6`}>
					<p className="text-foreground/55 text-[11px] font-medium tracking-[0.14em] uppercase">
						Tidligere målinger · {strategy === 'mobile' ? 'mobil' : 'computer'}
					</p>
					<div className="mt-3 overflow-x-auto">
						<table className="w-full min-w-[520px] text-sm">
							<thead>
								<tr className="text-foreground/45 text-left text-xs">
									<th className="py-2 pr-4 font-medium">Målt</th>
									{CATEGORIES.map((c) => (
										<th key={c.id} className="py-2 pr-4 text-right font-medium">
											{c.label}
										</th>
									))}
								</tr>
							</thead>
							<tbody className="divide-foreground/[0.06] divide-y">
								{older.map((e) => (
									<tr key={e.id}>
										<td className="text-foreground/70 py-2.5 pr-4">
											{fmtShortDate(e.measuredAt)}
											{e.trigger !== 'cron' && (
												<span className="text-foreground/40 ml-2 text-xs">
													{e.measuredBy ? e.measuredBy.split(' ')[0] : 'ekstra'}
												</span>
											)}
										</td>
										{CATEGORIES.map((c) => {
											const v = e[strategy]?.scores[c.id] ?? null
											return (
												<td
													key={c.id}
													className="py-2.5 pr-4 text-right tabular-nums"
												>
													<span
														className="mr-2 inline-block h-1.5 w-1.5 rounded-full align-middle"
														style={{ backgroundColor: scoreColor(v) }}
														aria-hidden
													/>
													<span className="text-foreground font-medium">
														{v ?? '–'}
													</span>
												</td>
											)
										})}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}

			<p className="text-foreground/45 text-xs leading-relaxed">
				Tallene kommer fra Googles PageSpeed Insights (Lighthouse), den samme
				måling som på pagespeed.web.dev. De svinger et par point fra gang til
				gang, fordi netværk og server aldrig er helt ens. Derfor måles der på en
				fast dag hver måned, så det er udviklingen over tid, man ser.
			</p>
		</div>
	)
}

/** Vises, mens Google måler (mobil og computer på samme tid) */
function Measuring() {
	const [elapsed, setElapsed] = useState(0)
	useEffect(() => {
		const t = setInterval(() => setElapsed((n) => n + 1), 1000)
		return () => clearInterval(t)
	}, [])
	return (
		<div className={`${card} p-8 text-center md:p-12`} aria-live="polite">
			<div className="bg-foreground/[0.08] mx-auto h-1 max-w-sm overflow-hidden rounded-full">
				<div
					className="health-progress h-full w-1/3 rounded-full"
					style={{ backgroundColor: 'var(--accent)' }}
				/>
			</div>
			<p className="text-foreground mt-6 text-base font-medium">
				Google indlæser forsiden på mobil og computer
			</p>
			<p className="text-foreground/50 mt-1 text-sm">
				Det tager typisk 15 til 30 sekunder · {elapsed} sek.
			</p>
		</div>
	)
}

function HealthReport({
	result,
	previous,
	previousLabel,
	strategy,
	optimize,
}: {
	result: HealthResult
	/** Samme enhed i en tidligere måned, til udviklingen */
	previous: HealthResult | null
	previousLabel: string
	strategy: HealthStrategy
	/** "Anmod om optimering"-boksen, vist lige over forslagene */
	optimize?: ReactNode
}) {
	return (
		<>
			<GradeCard
				result={result}
				previous={previous}
				previousLabel={previousLabel}
				strategy={strategy}
			/>
			<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
				{CATEGORIES.map((c) => (
					<div
						key={c.id}
						className={`${card} flex flex-col items-center p-5 text-center md:p-6`}
					>
						<ScoreRing score={result.scores[c.id]} />
						<p className="text-foreground mt-4 text-sm font-semibold">
							{c.label}
						</p>
						<p className="text-foreground/50 mt-1 text-xs leading-relaxed">
							{c.hint}
						</p>
						<Delta
							now={result.scores[c.id]}
							before={previous?.scores[c.id] ?? null}
							since={previousLabel}
						/>
					</div>
				))}
			</div>

			<div className="grid gap-4 lg:grid-cols-2">
				<div className={`${card} p-6`}>
					<p className="text-foreground/55 text-[11px] font-medium tracking-[0.14em] uppercase">
						Målt af Google
					</p>
					<ul className="divide-foreground/[0.06] mt-3 divide-y">
						{result.lab.map((m) => {
							const meta = LAB_LABELS[m.id]
							if (!meta) return null
							return (
								<li key={m.id} className="flex items-center gap-4 py-3">
									<span
										className="h-2 w-2 shrink-0 rounded-full"
										style={{
											backgroundColor: scoreColor(
												m.score == null ? null : m.score * 100,
											),
										}}
										aria-hidden
									/>
									<div className="min-w-0 flex-1">
										<p className="text-foreground text-sm font-medium">
											{meta.label}
										</p>
										<p className="text-foreground/50 text-xs">{meta.hint}</p>
									</div>
									<span className="text-foreground text-sm font-semibold tabular-nums">
										{m.value}
									</span>
								</li>
							)
						})}
					</ul>
				</div>

				<div className="space-y-4">
					{result.field && (
						<div className={`${card} p-6`}>
							<p className="text-foreground/55 text-[11px] font-medium tracking-[0.14em] uppercase">
								Rigtige besøgende
							</p>
							<p className="text-foreground/50 mt-1 text-xs">
								Fra Chrome-brugere de seneste 28 dage
								{result.field.scope === 'origin' ? ', hele sitet' : ''}.
							</p>
							<ul className="mt-3 space-y-2">
								{result.field.metrics.map((m) => (
									<li key={m.id} className="flex items-center gap-3 text-sm">
										<span
											className="h-2 w-2 shrink-0 rounded-full"
											style={{
												backgroundColor: FIELD_CATEGORY[m.category].color,
											}}
											aria-hidden
										/>
										<span className="text-foreground min-w-0 flex-1">
											{FIELD_LABELS[m.id]}
										</span>
										<span className="text-foreground/50 text-xs">
											{FIELD_CATEGORY[m.category].label}
										</span>
										<span className="text-foreground font-semibold tabular-nums">
											{fieldValue(m.id, m.percentile)}
										</span>
									</li>
								))}
							</ul>
						</div>
					)}

					{optimize}
					<div className={`${card} p-6`}>
						<p className="text-foreground/55 text-[11px] font-medium tracking-[0.14em] uppercase">
							Det kan gøre siden hurtigere
						</p>
						{result.opportunities.length ? (
							<ul className="mt-3 space-y-3">
								{result.opportunities.map((o) => (
									<li
										key={o.title}
										className="flex items-baseline gap-4 text-sm"
									>
										<span className="text-foreground min-w-0 flex-1">
											{o.title}
										</span>
										<span className="text-foreground/50 shrink-0 text-xs tabular-nums">
											ca. {fmtSeconds(o.savingsMs)}
										</span>
									</li>
								))}
							</ul>
						) : (
							<p className="text-foreground/60 mt-3 text-sm">
								Google har ingen større forslag til forsiden lige nu.
							</p>
						)}
					</div>
				</div>
			</div>
		</>
	)
}

/** Samlet karakter som på en energimærkning: stort mærke + hele skalaen */
function GradeCard({
	result,
	previous,
	previousLabel,
	strategy,
}: {
	result: HealthResult
	previous: HealthResult | null
	previousLabel: string
	strategy: HealthStrategy
}) {
	const overall = overallScore(result)
	if (!overall) return null
	const g = gradeFor(overall.score)
	const before = previous ? overallScore(previous) : null
	return (
		<div className={`${card} flex flex-wrap items-center gap-5 p-5 md:gap-7 md:p-6`}>
			<div
				className="flex h-20 w-24 shrink-0 items-center justify-center rounded-2xl text-3xl font-semibold tracking-tight md:h-24 md:w-28 md:text-4xl"
				style={toneStyle(g.tone)}
				aria-label={`Samlet karakter ${g.grade}`}
			>
				{g.grade}
			</div>
			<div className="min-w-0 flex-1">
				<p className="text-foreground/55 text-[11px] font-medium tracking-[0.14em] uppercase">
					Samlet karakter · {strategy === 'mobile' ? 'mobil' : 'computer'}
				</p>
				<p className="text-foreground mt-1 text-xl font-semibold tracking-tight">
					{g.label}
				</p>
				<p className="text-foreground/55 mt-1 text-xs leading-relaxed">
					Samlet score {overall.score} af 100, gennemsnittet af de fire målinger
					{overall.missing ? ' (hastigheden kunne ikke måles denne gang)' : ''}.
					{before && previousLabel
						? ` I ${previousLabel}: ${gradeFor(before.score).grade}.`
						: ''}
				</p>
			</div>
			{/* Skalaen: den aktuelle karakter er fremhævet */}
			<ol className="flex w-full flex-wrap gap-1 lg:w-auto" aria-label="Skala">
				{GRADES.map((x) => {
					const current = x.grade === g.grade
					return (
						<li
							key={x.grade}
							className={`rounded-full px-2.5 py-1 text-[11px] font-semibold tabular-nums ${
								current ? '' : 'bg-foreground/[0.04] text-foreground/40 border border-transparent'
							}`}
							style={current ? toneStyle(x.tone) : undefined}
						>
							{x.grade}
						</li>
					)
				})}
			</ol>
		</div>
	)
}

/**
 * Anmod om optimering: bliver en opgave (seoInboxItem) via /api/seo-task med
 * de aktuelle tal og Googles forslag, så vi kan gå direkte i gang.
 */
function OptimizeRequest({
	hours,
	requestedAt,
	latest,
}: {
	hours: number
	requestedAt?: string
	latest: HealthEntry
}) {
	const [sentAt, setSentAt] = useState(requestedAt)
	const [sending, setSending] = useState(false)
	const [error, setError] = useState(false)
	const hoursLabel =
		hours === 1
			? 'en times arbejde'
			: `${String(hours).replace('.', ',')} timers arbejde`

	async function request() {
		setSending(true)
		setError(false)
		const line = (r: HealthResult | null, name: string) => {
			if (!r) return `- ${name}: ingen måling`
			const o = overallScore(r)
			const s = CATEGORIES.map(
				(c) => `${c.label} ${r.scores[c.id] ?? '–'}`,
			).join(', ')
			return `- **${name}:** ${o ? `karakter ${gradeFor(o.score).grade} (${o.score}/100)` : ''}, ${s}`
		}
		const tips = (latest.desktop ?? latest.mobile)?.opportunities ?? []
		const message = [
			`Anmodet fra Sidens helbred. Cirka ${hoursLabel}.`,
			'',
			`Seneste måling ${fmtMeasured(latest.measuredAt)}:`,
			line(latest.desktop, 'Computer'),
			line(latest.mobile, 'Mobil'),
			...(tips.length
				? ['', 'Googles forslag:', ...tips.map((t) => `- ${t.title} (ca. ${fmtSeconds(t.savingsMs)})`)]
				: []),
		].join('\n')
		try {
			const res = await fetch('/api/seo-task', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					tasks: [
						{ subject: OPTIMIZE_SUBJECT, message, priority: 'middel', handling: 'timer5' },
					],
				}),
			})
			if (!res.ok) throw new Error()
			setSentAt(new Date().toISOString())
		} catch {
			setError(true)
		} finally {
			setSending(false)
		}
	}

	return (
		<div className={`${card} flex flex-wrap items-center gap-3 px-5 py-4`}>
			<div className="min-w-0 flex-1">
				<p className="text-foreground text-sm font-medium">Optimering af siden</p>
				<p className="text-foreground/55 mt-0.5 text-xs">
					{sentAt
						? `Anmodet ${fmtMeasured(sentAt)}. Ligger under Opgaver.`
						: `Cirka ${hoursLabel}.`}
				</p>
				{error && (
					<p className="mt-1 text-xs" style={{ color: 'var(--st-missing-text)' }} role="alert">
						Kunne ikke sendes. Prøv igen om lidt.
					</p>
				)}
			</div>
			{sentAt ? (
				<a
					href="#v=opgaver"
					className="text-foreground/60 hover:text-foreground text-xs font-medium underline-offset-2 hover:underline"
				>
					Se under Opgaver
				</a>
			) : (
				<button
					type="button"
					onClick={request}
					disabled={sending}
					className="border-foreground/[0.15] text-foreground hover:bg-foreground/[0.06] rounded-full border px-4 py-1.5 text-xs font-medium transition-colors disabled:opacity-50"
				>
					{sending ? 'Sender…' : 'Anmod'}
				</button>
			)}
		</div>
	)
}

/** "↑ 6 siden oktober": udviklingen siden forrige måneds måling */
function Delta({
	now,
	before,
	since,
}: {
	now: number | null
	before: number | null
	since: string
}) {
	if (now == null || before == null) return null
	const diff = now - before
	return (
		<p
			className="mt-3 text-xs font-medium tabular-nums"
			style={{
				color:
					diff > 0
						? 'var(--st-done-dot)'
						: diff < 0
							? 'var(--st-missing-dot)'
							: 'var(--color-muted)',
			}}
		>
			{diff > 0 ? `↑ ${diff}` : diff < 0 ? `↓ ${-diff}` : '±0'} siden {since}
		</p>
	)
}

/** Rund score 0-100, der tæller op og fyldes, når den vises */
function ScoreRing({ score }: { score: number | null }) {
	const [shown, setShown] = useState(0)

	useEffect(() => {
		if (score == null) return
		if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
			setShown(score)
			return
		}
		let start = 0
		let raf = 0
		const step = (t: number) => {
			if (!start) start = t
			const p = Math.min(1, (t - start) / 1000)
			setShown(Math.round(score * (1 - Math.pow(1 - p, 3))))
			if (p < 1) raf = requestAnimationFrame(step)
		}
		raf = requestAnimationFrame(step)
		return () => cancelAnimationFrame(raf)
	}, [score])

	const color = scoreColor(score)
	const ring =
		'radial-gradient(farthest-side, transparent calc(100% - 8px), #000 calc(100% - 7px))'

	return (
		<div className="relative h-24 w-24">
			<div
				aria-hidden
				className="absolute inset-0 rounded-full"
				style={{
					background:
						'color-mix(in srgb, var(--color-foreground) 8%, transparent)',
					maskImage: ring,
					WebkitMaskImage: ring,
				}}
			/>
			<div
				aria-hidden
				className="absolute inset-0 rounded-full"
				style={{
					background: color,
					maskImage: `${ring}, conic-gradient(#000 ${shown / 100}turn, transparent 0)`,
					WebkitMaskImage: `${ring}, conic-gradient(#000 ${shown / 100}turn, transparent 0)`,
					maskComposite: 'intersect',
					WebkitMaskComposite: 'source-in',
				}}
			/>
			<span
				className="text-foreground absolute inset-0 flex items-center justify-center text-2xl font-semibold tabular-nums"
				aria-label={score == null ? 'Ingen score' : `${score} ud af 100`}
			>
				{score == null ? '–' : shown}
			</span>
		</div>
	)
}
