'use client'

import { useState } from 'react'
import {
	SEASON_HAS_DATA,
	SEASON_REFRESH_MONTH,
	SEASON_SERVICES,
	SEASON_UPDATED,
	seasonUpdateDue,
	allServicesIndex,
	seasonIndex,
	smoothPath,
} from './season'

/**
 * Henvendelser og sæson (Andreas 20/11-2026): jeres henvendelser pr. måned
 * (grønne søjler) oven på Googles sæsonkurve for ydelsen (grå kurve, årets
 * gennemsnit = 100). Så kan man se, om et fald skyldes sæsonen eller os.
 *
 * Samme mørke stil som grafen under Synlighed. Søjler og tekst er HTML, kun
 * kurven er SVG (strakt til bredden), så intet bliver forvrænget på mobil.
 */

const GREEN = '#34d399'
const MUTED = 'rgba(255,255,255,0.5)'
const MONTH_NAMES = ['januar', 'februar', 'marts', 'april', 'maj', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'december']
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec']
const HIGH = 115 // indeks fra hvor en måned regnes som højsæson

function season(m: number): { name: string; tint?: string } {
	if (m === 12 || m <= 2) return { name: 'Vinter', tint: 'rgba(147,197,253,0.07)' }
	if (m <= 5) return { name: 'Forår' }
	if (m <= 8) return { name: 'Sommer', tint: 'rgba(253,224,71,0.05)' }
	return { name: 'Efterår' }
}

type Range = 12 | 24

function SeasonChartView({
	leads,
	firstMonth,
	currentMonth,
}: {
	/** Henvendelser pr. måned, 'ÅÅÅÅ-MM' → antal */
	leads: Record<string, number>
	/** Første måned med måling ('ÅÅÅÅ-MM') */
	firstMonth: string
	/** Indeværende måned i dansk tid ('ÅÅÅÅ-MM') */
	currentMonth: string
}) {
	const [service, setService] = useState<string>('alle')
	const [range, setRange] = useState<Range>(12)

	const selected = SEASON_SERVICES.find((s) => s.key === service)
	const index = selected ? seasonIndex(selected.volumes) : allServicesIndex()

	// De seneste 12/24 måneder, sluttende med indeværende måned
	const [cy, cm] = currentMonth.split('-').map(Number)
	const months = Array.from({ length: range }, (_, i) => {
		const t = cy * 12 + (cm - 1) - (range - 1 - i)
		const y = Math.floor(t / 12)
		const m = (t % 12) + 1
		const key = `${y}-${String(m).padStart(2, '0')}`
		return {
			key,
			y,
			m,
			idx: index[m - 1],
			n: key >= firstMonth ? (leads[key] ?? 0) : null,
			current: key === currentMonth,
		}
	})
	const maxN = Math.max(1, ...months.map((x) => x.n ?? 0))
	const maxIdx = Math.max(...index) * 1.08

	const W = 1000
	const H = 200
	const colX = (i: number) => ((i + 0.5) / months.length) * W
	const curve = smoothPath(months.map((x, i) => ({ x: colX(i), y: H - (x.idx / maxIdx) * H })))

	const now = months[months.length - 1]
	const nowLevel =
		now.idx >= HIGH ? 'højsæson' : now.idx <= 85 ? 'lavsæson' : 'en almindelig måned'
	const unmeasured = months.filter((x) => x.n === null).length

	const chip = (active: boolean) =>
		active
			? { backgroundColor: '#fff', color: '#0e0f0f' }
			: { backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)' }

	const card = {
		backgroundColor: '#0e0f0f',
		border: '1px solid rgba(255,255,255,0.08)',
		color: '#fff',
	}
	const thisMonth = cm
	// Et år siden sidste opdatering = tallene skal opdateres (samme regel som mærkaten øverst)
	const stale = seasonUpdateDue(new Date(cy, cm - 1, 15))
	const source = (
		<p className="mt-6 text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
			Kilde: Googles søgninger i Danmark pr. måned (via Ubersuggest), ét primært søgeord pr.
			ydelse. Opdateret {SEASON_UPDATED}. Sæsonen er stabil fra år til år, så tallene opdateres
			én gang om året i {MONTH_NAMES[SEASON_REFRESH_MONTH - 1]} (et trin i månedens tjekliste).
		</p>
	)

	return (
		<>
		{/* Årshjul: alle ydelser på én gang, til planlægning */}
		<div className="rounded-3xl p-6 md:p-8" style={card}>
			<span className="text-[11px] tracking-[0.14em] uppercase" style={{ color: MUTED }}>
				Årshjul
			</span>
			<p className="mt-2 text-xl font-normal tracking-[-0.02em] md:text-2xl">
				Hvornår søger folk efter hvad?
			</p>
			<p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
				Jo kraftigere grøn, jo flere søgninger på Google i den måned. Den hvide prik er,
				hvornår en kampagne bør starte, så den kører, før søgningerne topper. Peg på en
				firkant for at se tallet, og klik på en ydelse for at se den i grafen nedenfor.
			</p>

			<div className="mt-6 grid grid-cols-[minmax(6.5rem,9rem)_repeat(12,minmax(0,1fr))] items-center gap-1 sm:gap-1.5">
				<span />
				{MONTHS.map((m, i) => (
					<span key={m} className="flex justify-center">
						<span
							className="rounded-full px-1.5 py-0.5 text-center text-[10px] sm:px-2 sm:text-[11px]"
							style={
								i + 1 === thisMonth
									? { backgroundColor: '#fff', color: '#0e0f0f', fontWeight: 600 }
									: { color: MUTED }
							}
						>
							<span className="sm:hidden">{m[0]}</span>
							<span className="max-sm:hidden">{m}</span>
						</span>
					</span>
				))}
				{SEASON_SERVICES.map((s) => {
					const idx = seasonIndex(s.volumes)
					const active = service === s.key
					return (
						<div key={s.key} className="contents">
							<button
								type="button"
								onClick={() => setService(active ? 'alle' : s.key)}
								className="truncate rounded-lg px-2 py-1.5 text-left text-xs transition-colors sm:text-sm"
								style={active ? { backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff' } : { color: 'rgba(255,255,255,0.8)' }}
							>
								{s.label}
							</button>
							{idx.map((v, i) => (
								<span
									key={i}
									className="relative flex h-7 items-center justify-center rounded-md sm:h-8"
									title={`${s.label}, ${MONTH_NAMES[i]}: ${
										v === 100
											? 'som en gennemsnitlig måned'
											: `${Math.abs(v - 100)} % ${v > 100 ? 'flere' : 'færre'} søgninger end en gennemsnitlig måned`
									}${s.campaignStart.includes(i + 1) ? '. Start kampagnen her' : ''}`}
									style={{
										// Gennemsigtig baggrund (ikke opacity), så kampagneprikken står skarpt
										backgroundColor: `rgba(52,211,153,${Math.min(1, Math.max(0.07, (v - 45) / 115)).toFixed(2)})`,
									}}
								>
									{s.campaignStart.includes(i + 1) && (
										<span
											className="size-2.5 rounded-full"
											style={{ backgroundColor: '#fff', boxShadow: '0 0 0 2px #0e0f0f' }}
										/>
									)}
								</span>
							))}
						</div>
					)
				})}
			</div>

			{/* Farveforklaring */}
			<div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
				<span className="flex items-center gap-2">
					Få søgninger
					<span
						className="inline-block h-2.5 w-24 rounded-full"
						style={{ background: 'linear-gradient(to right, rgba(52,211,153,0.07), rgba(52,211,153,1))' }}
					/>
					Mange søgninger
				</span>
				<span className="flex items-center gap-1.5">
					<span className="inline-block size-2.5 rounded-full" style={{ backgroundColor: '#fff' }} />
					Start kampagnen
				</span>
				<span className="flex items-center gap-1.5">
					<span
						className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
						style={{ backgroundColor: '#fff', color: '#0e0f0f' }}
					>
						{MONTHS[thisMonth - 1]}
					</span>
					Denne måned
				</span>
			</div>

			{stale && (
				<p
					className="mt-5 rounded-xl px-4 py-3 text-xs"
					style={{ backgroundColor: 'rgba(250,178,25,0.12)', color: '#fcd34d' }}
				>
					Sæsontallene er fra {SEASON_UPDATED} og skal opdateres. Det sker som et trin i
					månedens tjekliste.
				</p>
			)}

			<ul className="mt-6 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
				{SEASON_SERVICES.map((s) => (
					<li key={s.key}>
						<span className="font-medium">{s.label}</span>{' '}
						<span className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
							(søgeord: {s.keyword})
						</span>
						<span className="block text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
							{s.campaign}
						</span>
					</li>
				))}
			</ul>
			{source}
		</div>

		<div
			className="mt-6 rounded-3xl p-6 md:p-8"
			style={{
				backgroundColor: '#0e0f0f',
				border: '1px solid rgba(255,255,255,0.08)',
				color: '#fff',
			}}
		>
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div className="max-w-xl">
					<span className="text-[11px] tracking-[0.14em] uppercase" style={{ color: MUTED }}>
						Sæson
					</span>
					<p className="mt-2 text-xl font-normal tracking-[-0.02em] md:text-2xl">
						Henvendelser og sæson
					</p>
					<p className="mt-2 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
						{MONTH_NAMES[now.m - 1].replace(/^./, (c) => c.toUpperCase())}{' '}
						er {nowLevel} for {selected ? selected.label.toLowerCase() : 'jeres ydelser'}{' '}
						på Google (indeks {now.idx}, hvor 100 er årets gennemsnit).
					</p>
				</div>
				<div className="flex rounded-full p-1" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
					{([12, 24] as Range[]).map((r) => (
						<button
							key={r}
							type="button"
							onClick={() => setRange(r)}
							className="rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
							style={range === r ? chip(true) : { color: 'rgba(255,255,255,0.6)' }}
						>
							{r} mdr.
						</button>
					))}
				</div>
			</div>

			<div className="mt-5 flex flex-wrap gap-2">
				{[{ key: 'alle', label: 'Alle ydelser' }, ...SEASON_SERVICES].map((s) => (
					<button
						key={s.key}
						type="button"
						onClick={() => setService(s.key)}
						className="rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
						style={chip(service === s.key)}
					>
						{s.label}
					</button>
				))}
			</div>

			{/* Grafen */}
			<div className="relative mt-8 h-56">
				{/* Årstider i baggrunden */}
				<div className="absolute inset-0 flex">
					{months.map((x, i) => {
						const s = season(x.m)
						const starts = i === 0 || season(months[i - 1].m).name !== s.name
						return (
							<div
								key={x.key}
								className="relative flex-1"
								style={{
									backgroundColor: s.tint,
									borderLeft: starts && i > 0 ? '1px solid rgba(255,255,255,0.07)' : undefined,
								}}
							>
								{starts && (
									<span
										className="absolute top-1 left-1.5 text-[10px] tracking-[0.08em] whitespace-nowrap uppercase"
										style={{ color: 'rgba(255,255,255,0.4)' }}
									>
										{s.name}
									</span>
								)}
								{x.idx >= HIGH && (
									<span
										className="absolute inset-x-0 bottom-0 h-1"
										style={{ backgroundColor: `${GREEN}55` }}
									/>
								)}
							</div>
						)
					})}
				</div>

				{/* Googles sæsonkurve */}
				<svg
					viewBox={`0 0 ${W} ${H}`}
					preserveAspectRatio="none"
					className="absolute inset-x-0 top-6 bottom-0 h-[calc(100%-1.5rem)] w-full overflow-visible"
					aria-hidden="true"
				>
					<path
						d={curve}
						fill="none"
						stroke="rgba(255,255,255,0.45)"
						strokeWidth="2"
						strokeDasharray="5 4"
						strokeLinecap="round"
						vectorEffect="non-scaling-stroke"
					/>
				</svg>

				{/* Henvendelser pr. måned */}
				<div className="absolute inset-x-0 top-6 bottom-1 flex items-end">
					{months.map((x) => (
						<div
							key={x.key}
							className="flex h-full flex-1 flex-col items-center justify-end px-[3px]"
							title={`${MONTHS[x.m - 1]} ${x.y}: ${x.n === null ? 'ikke målt' : `${x.n} ${x.n === 1 ? 'henvendelse' : 'henvendelser'}${x.current ? ' indtil nu' : ''}`} · Google-indeks ${x.idx}`}
						>
							{x.n !== null && x.n > 0 && (
								<span className="mb-1 text-xs font-medium tabular-nums" style={{ color: GREEN }}>
									{x.n}
								</span>
							)}
							{x.n !== null && x.n > 0 && (
								<div
									className="w-full max-w-8 rounded-t-md"
									style={{
										height: `${(x.n / maxN) * 70}%`,
										background: x.current
											? `repeating-linear-gradient(135deg, ${GREEN}66 0 4px, ${GREEN}22 4px 8px)`
											: `linear-gradient(to top, ${GREEN}66, ${GREEN})`,
										boxShadow: x.current ? `inset 0 0 0 1px ${GREEN}99` : `0 0 16px ${GREEN}40`,
									}}
								/>
							)}
						</div>
					))}
				</div>
			</div>

			{/* Måneder */}
			<div className="mt-2 flex">
				{months.map((x, i) => (
					<span
						key={x.key}
						className={`flex-1 text-center text-[10px] leading-tight sm:text-[11px] ${range === 24 && i % 2 ? 'max-sm:invisible' : ''}`}
						style={{ color: x.current ? '#fff' : MUTED }}
					>
						{MONTHS[x.m - 1]}
						{(x.m === 1 || i === 0) && (
							<span className="block" style={{ color: 'rgba(255,255,255,0.35)' }}>
								{x.y}
							</span>
						)}
					</span>
				))}
			</div>

			{/* Forklaring */}
			<div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
				<span className="flex items-center gap-1.5">
					<span className="inline-block size-2.5 rounded-sm" style={{ backgroundColor: GREEN }} />
					Jeres henvendelser
				</span>
				<span className="flex items-center gap-1.5">
					<span className="inline-block w-4 border-t-2 border-dashed" style={{ borderColor: 'rgba(255,255,255,0.5)' }} />
					Søgninger på Google (gennemsnit = 100)
				</span>
				<span className="flex items-center gap-1.5">
					<span className="inline-block h-1 w-4 rounded-sm" style={{ backgroundColor: `${GREEN}55` }} />
					Højsæson
				</span>
				{unmeasured > 0 && <span>Tomme måneder er fra før målingen startede.</span>}
			</div>

			{/* Hvad betyder det? */}
			<div
				className="mt-6 rounded-2xl p-5"
				style={{ backgroundColor: 'rgba(96,165,250,0.10)', border: '1px solid rgba(96,165,250,0.18)' }}
			>
				{selected ? (
					<>
						<p className="text-sm font-medium">{selected.label}: sådan er sæsonen</p>
						<dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
							<div>
								<dt className="text-xs" style={{ color: MUTED }}>Flest søgninger</dt>
								<dd>{selected.high}</dd>
							</div>
							<div>
								<dt className="text-xs" style={{ color: MUTED }}>Færrest søgninger</dt>
								<dd>{selected.low}</dd>
							</div>
						</dl>
						<p className="mt-3 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
							{selected.why}
						</p>
						<p className="mt-3 text-sm leading-relaxed">
							<span className="font-medium">Kampagner:</span>{' '}
							<span style={{ color: 'rgba(255,255,255,0.75)' }}>{selected.campaign}</span>
						</p>
					</>
				) : (
					<>
						<p className="text-sm font-medium">Sådan læser I grafen</p>
						<p className="mt-2 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
							Den stiplede kurve viser, hvornår folk søger efter jeres ydelser. Færre
							henvendelser i en måned, hvor kurven er lav, er sæsonen og ikke et
							problem. Sammenlign derfor altid med samme måned sidste år. Vælg en
							ydelse ovenfor for at se dens egen sæson.
						</p>
						<ul className="mt-3 grid gap-1.5 text-sm sm:grid-cols-2">
							{SEASON_SERVICES.map((s) => (
								<li key={s.key}>
									<span className="font-medium">{s.label}:</span>{' '}
									<span style={{ color: 'rgba(255,255,255,0.7)' }}>flest {s.high}</span>
								</li>
							))}
						</ul>
					</>
				)}
			</div>

			<p className="mt-4 text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
				Sæsontal: søgninger i Danmark pr. måned på ét søgeord pr. ydelse
				{selected ? ` ("${selected.keyword}")` : ''}, opdateret {SEASON_UPDATED}. Sæsonen er stabil,
				så tallene opdateres én gang om året.
			</p>
		</div>
		</>
	)
}

type SeasonChartProps = Parameters<typeof SeasonChartView>[0]

/**
 * Uden kundens egne sæsontal er fanen tom (Andreas 20/11-2026): den viser,
 * hvordan årshjulet kommer til at se ud, men aldrig tal, vi ikke måler på.
 */
export default function SeasonChart(props: SeasonChartProps) {
	if (!SEASON_HAS_DATA) return <SeasonEmpty />
	return <SeasonChartView {...props} />
}

function SeasonEmpty() {
	return (
		<div
			className="rounded-3xl p-6 md:p-8"
			style={{ backgroundColor: '#0e0f0f', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}
		>
			<span className="text-[11px] tracking-[0.14em] uppercase" style={{ color: MUTED }}>
				Årshjul
			</span>
			<p className="mt-2 text-xl font-normal tracking-[-0.02em] md:text-2xl">Hvornår søger folk efter hvad?</p>
			<p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
				Her kommer jeres årshjul: hvornår folk søger mest efter hver af jeres ydelser på Google, og
				hvornår en kampagne bør starte, så den kører, før søgningerne topper. Vi lægger tallene ind,
				når søgeordene for jeres ydelser er på plads.
			</p>
			{/* Tom skitse af årshjulet: ingen tal, kun formen */}
			<div className="mt-6 grid grid-cols-[minmax(6.5rem,9rem)_repeat(12,minmax(0,1fr))] items-center gap-1 sm:gap-1.5" aria-hidden="true">
				<span />
				{MONTHS.map((m) => (
					<span key={m} className="text-center text-[10px] sm:text-[11px]" style={{ color: MUTED }}>
						<span className="sm:hidden">{m[0]}</span>
						<span className="max-sm:hidden">{m}</span>
					</span>
				))}
				{[0, 1, 2].map((r) => (
					<div key={r} className="contents">
						<span className="h-3 w-20 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />
						{MONTHS.map((m) => (
							<span key={m} className="h-7 rounded-md sm:h-8" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }} />
						))}
					</div>
				))}
			</div>
		</div>
	)
}
