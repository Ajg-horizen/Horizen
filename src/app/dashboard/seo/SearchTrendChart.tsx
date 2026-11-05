'use client'

import { useMemo, useRef, useState } from 'react'
import type { SearchTrend } from './searchTrend'

/**
 * Sort graf over klik og visninger fra Google, i samme stil som grafen på
 * horizen.dk (mørkt kort, grøn linje med gradient, lysende slutpunkt).
 *
 * Perioden vælges mellem 3, 6 og 12 måneder (data: de 12 seneste hele
 * måneder, opdateres den 3.). Ved 3 måneder er linjen et glidende 7-dages
 * gennemsnit med de rå dagstal svagt bagved; ved 6 og 12 måneder vises tal pr.
 * uge, så kurven ikke bliver uoverskuelig. Relanceringen markeres med en
 * stiplet linje.
 *
 * Linjer og flader tegnes i en SVG, der strækkes til kortets bredde
 * (preserveAspectRatio="none"). Tekst og punkter er HTML ovenpå, så de ikke
 * bliver forvrænget på mobil.
 */

type Metric = 'impressions' | 'clicks'
type Range = 3 | 6 | 12

const METRICS: { key: Metric; label: string; unit: string }[] = [
	{ key: 'impressions', label: 'Visninger', unit: 'visninger' },
	{ key: 'clicks', label: 'Klik', unit: 'klik' },
]
const RANGES: Range[] = [3, 6, 12]

const W = 1000
const H = 240
// Grøn som grafen på horizen.dk; neutral, så den passer til alle kunder
const LINE = '#34d399'
const MUTED = 'rgba(255,255,255,0.45)'
const MONTHS = [
	'jan',
	'feb',
	'mar',
	'apr',
	'maj',
	'jun',
	'jul',
	'aug',
	'sep',
	'okt',
	'nov',
	'dec',
]

/** Ét punkt på grafen: en dag (3 mdr.) eller en uge (6 og 12 mdr.). */
type Point = { date: string; at: string; value: number; line: number }

const fmt = (n: number) =>
	n.toLocaleString('da-DK', { maximumFractionDigits: 1 })

function shortDate(iso: string, year = false) {
	const [y, m, d] = iso.split('-').map(Number)
	return `${d}. ${MONTHS[m - 1]}${year ? ` ${y}` : ''}`
}

/** Pæn øvre grænse til y-aksen (1, 2, 5, 10, 20, 50 …). */
function niceMax(v: number) {
	if (v <= 0) return 1
	const p = 10 ** Math.floor(Math.log10(v))
	return ([1, 2, 5, 10].find((s) => s * p >= v) ?? 10) * p
}

function rollingAvg(values: number[], win = 7) {
	return values.map((_, i) => {
		const slice = values.slice(Math.max(0, i - win + 1), i + 1)
		return slice.reduce((a, b) => a + b, 0) / slice.length
	})
}

const segmented = {
	wrap: { backgroundColor: 'rgba(255,255,255,0.06)' },
	on: { backgroundColor: '#fff', color: '#0e0f0f' },
	off: { backgroundColor: 'transparent', color: 'rgba(255,255,255,0.6)' },
}

export default function SearchTrendChart({ trend }: { trend: SearchTrend }) {
	const [metric, setMetric] = useState<Metric>('impressions')
	const [range, setRange] = useState<Range>(3)
	const [hover, setHover] = useState<number | null>(null)
	const plotRef = useRef<HTMLDivElement>(null)
	const meta = METRICS.find((m) => m.key === metric)!
	const weekly = range > 3

	const { days, points, max, total, change } = useMemo(() => {
		// Dagene i de seneste `range` hele måneder
		const last = trend.days.at(-1)?.date ?? ''
		const [ly, lm] = last.split('-').map(Number)
		const from = new Date(Date.UTC(ly, lm - range, 1))
			.toISOString()
			.slice(0, 10)
		const days = trend.days.filter((d) => d.date >= from)
		const raw = days.map((d) => d[metric])

		let points: Point[]
		if (!weekly) {
			const avg = rollingAvg(raw)
			points = days.map((d, i) => ({
				date: d.date,
				at: d.date,
				value: raw[i],
				line: avg[i],
			}))
		} else {
			// Uger på 7 dage regnet fra periodens start, placeret ved ugens sidste
			// dag. En sidste kort uge lægges til den forrige, så den ikke ser ud
			// som et fald.
			points = []
			for (let i = 0; i < days.length; i += 7) {
				const sum = raw.slice(i, i + 7).reduce((a, b) => a + b, 0)
				const at = days[Math.min(i + 6, days.length - 1)].date
				const prev = points.at(-1)
				if (days.length - i < 7 && prev) {
					prev.value += sum
					prev.line += sum
					prev.at = at
				} else points.push({ date: days[i].date, at, value: sum, line: sum })
			}
		}

		const max = niceMax(
			Math.max(...points.map((p) => Math.max(p.value, p.line)), 1),
		)
		const total = raw.reduce((a, b) => a + b, 0)
		// Seneste måned mod måneden før: samme sammenligning som nøgletallene.
		const lastMonth = last.slice(0, 7)
		const prevMonth = new Date(Date.UTC(ly, lm - 2, 1))
			.toISOString()
			.slice(0, 7)
		const sumMonth = (m: string) =>
			days
				.filter((d) => d.date.startsWith(m))
				.reduce((a, d) => a + d[metric], 0)
		const prev = sumMonth(prevMonth)
		const change = prev > 0 ? ((sumMonth(lastMonth) - prev) / prev) * 100 : null
		return { days, points, max, total, change }
	}, [trend.days, metric, range, weekly])

	const n = points.length
	// Position i grafen for en dato (0-1), ud fra periodens første og sidste dag
	const t0 = Date.parse(days[0]?.date ?? '')
	const t1 = Date.parse(days.at(-1)?.date ?? '')
	const datePos = (iso: string) => (Date.parse(iso) - t0) / (t1 - t0 || 1)
	const x = (i: number) => datePos(points[i].at) * W
	const y = (v: number) => H - (v / max) * H
	const pct = (v: number) => `${(v * 100).toFixed(3)}%`

	const line = points
		.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.line).toFixed(1)}`)
		.join(' ')
	const area = `${line} L${W},${H} L0,${H} Z`
	const rawLine = weekly
		? ''
		: points
				.map(
					(p, i) =>
						`${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`,
				)
				.join(' ')

	// Månedsmærker ved den 1. i hver måned (ved 12 mdr. kun hver anden på mobil)
	const monthTicks = days
		.filter((d) => d.date.endsWith('-01') && d.date !== days[0]?.date)
		.map((d, i) => ({ date: d.date, pos: datePos(d.date), odd: i % 2 === 1 }))

	const relaunchPos =
		trend.relaunch &&
		trend.relaunch > (days[0]?.date ?? '') &&
		trend.relaunch <= (days.at(-1)?.date ?? '')
			? datePos(trend.relaunch)
			: null

	function onMove(e: React.PointerEvent) {
		const rect = plotRef.current?.getBoundingClientRect()
		if (!rect || n === 0) return
		const f = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
		// Nærmeste punkt i tid (punkterne ligger ikke nødvendigvis med lige afstand)
		let best = 0
		for (let i = 1; i < n; i++)
			if (Math.abs(x(i) / W - f) < Math.abs(x(best) / W - f)) best = i
		setHover(best)
	}

	const hi = hover ?? n - 1
	const hp = points[hi]

	return (
		<div
			className="rounded-3xl p-6 md:p-8"
			style={{
				backgroundColor: '#0e0f0f',
				border: '1px solid rgba(255,255,255,0.08)',
				color: '#fff',
			}}
		>
			{/* Hoved */}
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<p
						className="text-[11px] tracking-[0.14em] uppercase"
						style={{ color: MUTED }}
					>
						Google-søgning · sidste {range} måneder
					</p>
					<p className="mt-2 text-2xl font-normal tracking-[-0.03em] md:text-[1.75rem]">
						{fmt(total)}{' '}
						<span
							className="text-base"
							style={{ color: 'rgba(255,255,255,0.5)' }}
						>
							{meta.unit}
						</span>
					</p>
					<div
						className="mt-2 flex flex-wrap items-center gap-2 text-xs"
						style={{ color: MUTED }}
					>
						{days[0] && (
							<span>
								{shortDate(days[0].date, true)} til{' '}
								{shortDate(days.at(-1)!.date, true)}
							</span>
						)}
						{change != null && (
							<span
								className="rounded-full px-2 py-0.5 font-medium"
								style={{
									backgroundColor:
										change >= 0
											? 'rgba(52,211,153,0.14)'
											: 'rgba(255,255,255,0.08)',
									color: change >= 0 ? LINE : 'rgba(255,255,255,0.7)',
								}}
							>
								{change >= 0 ? '+' : ''}
								{Math.round(change)} % i{' '}
								{MONTHS[Number(days.at(-1)!.date.slice(5, 7)) - 1]} mod måneden
								før
							</span>
						)}
						{trend.demo && (
							<span
								className="rounded-full px-2 py-0.5 font-medium"
								style={{
									backgroundColor: 'rgba(255,200,80,0.15)',
									color: '#ffd27a',
								}}
							>
								Eksempeldata (kun lokalt)
							</span>
						)}
					</div>
				</div>

				{/* Vælg tal og periode */}
				<div className="flex flex-wrap gap-2">
					<div
						className="flex rounded-full p-1"
						style={segmented.wrap}
						role="tablist"
						aria-label="Vælg tal"
					>
						{METRICS.map((m) => (
							<button
								key={m.key}
								type="button"
								role="tab"
								aria-selected={metric === m.key}
								onClick={() => setMetric(m.key)}
								className="rounded-full px-4 py-1.5 text-xs font-medium transition-colors"
								style={metric === m.key ? segmented.on : segmented.off}
							>
								{m.label}
							</button>
						))}
					</div>
					<div
						className="flex rounded-full p-1"
						style={segmented.wrap}
						role="tablist"
						aria-label="Vælg periode"
					>
						{RANGES.map((r) => (
							<button
								key={r}
								type="button"
								role="tab"
								aria-selected={range === r}
								onClick={() => {
									setRange(r)
									setHover(null)
								}}
								className="rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
								style={range === r ? segmented.on : segmented.off}
							>
								{r} mdr.
							</button>
						))}
					</div>
				</div>
			</div>

			{/* Graf */}
			<div className="mt-10 flex gap-3">
				{/* y-akse */}
				<div
					className="relative w-8 shrink-0 text-right text-[10px]"
					style={{ height: H, color: 'rgba(255,255,255,0.35)' }}
					aria-hidden
				>
					{[1, 0.5, 0].map((f) => (
						<span
							key={f}
							className="absolute right-0 -translate-y-1/2"
							style={{ top: `${(1 - f) * 100}%` }}
						>
							{fmt(max * f)}
						</span>
					))}
				</div>

				<div className="min-w-0 flex-1">
					<div
						ref={plotRef}
						className="relative cursor-crosshair touch-none"
						style={{ height: H }}
						onPointerMove={onMove}
						onPointerDown={onMove}
						onPointerLeave={() => setHover(null)}
					>
						<svg
							viewBox={`0 0 ${W} ${H}`}
							preserveAspectRatio="none"
							className="absolute inset-0 h-full w-full overflow-visible"
							aria-hidden
						>
							<defs>
								<linearGradient
									id="searchTrendFill"
									x1="0"
									y1="0"
									x2="0"
									y2="1"
								>
									<stop offset="0%" stopColor={LINE} stopOpacity="0.32" />
									<stop offset="100%" stopColor={LINE} stopOpacity="0" />
								</linearGradient>
							</defs>
							{[0, 0.5, 1].map((f) => (
								<line
									key={f}
									x1="0"
									x2={W}
									y1={H * f}
									y2={H * f}
									stroke="rgba(255,255,255,0.07)"
									vectorEffect="non-scaling-stroke"
								/>
							))}
							{rawLine && (
								<path
									d={rawLine}
									fill="none"
									stroke="rgba(255,255,255,0.16)"
									strokeWidth="1"
									vectorEffect="non-scaling-stroke"
								/>
							)}
							<path d={area} fill="url(#searchTrendFill)" />
							<path
								d={line}
								fill="none"
								stroke={LINE}
								strokeWidth="2.5"
								strokeLinejoin="round"
								strokeLinecap="round"
								vectorEffect="non-scaling-stroke"
							/>
							{relaunchPos != null && (
								<line
									x1={relaunchPos * W}
									x2={relaunchPos * W}
									y1="0"
									y2={H}
									stroke="rgba(255,255,255,0.35)"
									strokeDasharray="4 4"
									vectorEffect="non-scaling-stroke"
								/>
							)}
							{hover != null && (
								<line
									x1={x(hover)}
									x2={x(hover)}
									y1="0"
									y2={H}
									stroke="rgba(255,255,255,0.25)"
									strokeDasharray="2 3"
									vectorEffect="non-scaling-stroke"
								/>
							)}
						</svg>

						{/* Mærkat for relanceringen */}
						{relaunchPos != null && (
							<span
								className="pointer-events-none absolute -top-6 -translate-x-1/2 text-[10px] whitespace-nowrap"
								style={{
									left: pct(relaunchPos),
									color: 'rgba(255,255,255,0.55)',
								}}
							>
								Nyt site
							</span>
						)}

						{/* Punkt: slutpunktet med glød, eller det man peger på */}
						{hp && (
							<>
								<span
									className="pointer-events-none absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full"
									style={{
										left: pct(x(hi) / W),
										top: pct(y(hp.line) / H),
										backgroundColor: LINE,
										opacity: 0.22,
									}}
								/>
								<span
									className="pointer-events-none absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
									style={{
										left: pct(x(hi) / W),
										top: pct(y(hp.line) / H),
										backgroundColor: LINE,
									}}
								/>
							</>
						)}

						{/* Tooltip */}
						{hover != null && hp && (
							<div
								className="pointer-events-none absolute top-0 z-10 rounded-xl px-3 py-2 text-xs whitespace-nowrap"
								style={{
									left: pct(x(hover) / W),
									transform: `translateX(${hover > n * 0.7 ? 'calc(-100% - 12px)' : '12px'})`,
									backgroundColor: '#fff',
									color: '#0e0f0f',
									boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
								}}
							>
								<div className="font-medium">
									{weekly
										? `Uge fra ${shortDate(hp.date)}`
										: shortDate(hp.date)}
								</div>
								<div className="mt-0.5">
									{fmt(hp.value)} {meta.unit}
								</div>
								{!weekly && (
									<div style={{ color: 'rgba(14,15,15,0.55)' }}>
										7-dages snit: {fmt(hp.line)}
									</div>
								)}
							</div>
						)}
					</div>

					{/* Månedsmærker */}
					<div
						className="relative mt-3 h-4 text-[11px]"
						style={{ color: 'rgba(255,255,255,0.4)' }}
						aria-hidden
					>
						{monthTicks.map(({ date, pos, odd }) => (
							<span
								key={date}
								className={`absolute -translate-x-1/2 ${range === 12 && odd ? 'hidden sm:inline' : ''}`}
								style={{ left: pct(pos) }}
							>
								{MONTHS[Number(date.slice(5, 7)) - 1]}
							</span>
						))}
					</div>
				</div>
			</div>

			<p
				className="mt-6 text-xs leading-relaxed"
				style={{ color: 'rgba(255,255,255,0.4)' }}
			>
				{weekly
					? 'Tal pr. uge.'
					: 'Grøn linje: gennemsnit over 7 dage. De enkelte dage står svagt bagved.'}{' '}
				Peg på grafen for at se tallene. Kilde: Google Search Console. Opdateres
				den 3. i hver måned, ligesom nøgletallene ovenfor.
			</p>
		</div>
	)
}
