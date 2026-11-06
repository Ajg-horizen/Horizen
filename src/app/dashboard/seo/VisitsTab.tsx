'use client'

import { useState } from 'react'
import { GA4_RANGES, type Ga4Period, type Ga4Range, type VisitsOverview } from '@/lib/ga4-shared'

/**
 * Fanen Performance → Besøg (Andreas 6/11-2026): ét samlet billede af,
 * hvilke sider der bliver set, hvor længe og hvor besøgene kom fra. Tallene
 * er sitets egne (uden cookies, alle besøgende) fra den dag, tælleren startede,
 * og Google Analytics for dagene før (src/lib/visits.ts). Her vælges kun periode.
 */

const card = 'rounded-2xl border border-foreground/[0.08] bg-white'
const notice =
	'rounded-2xl border border-amber-500/30 bg-amber-500/[0.06] p-6 text-sm leading-relaxed'
const eyebrow = 'text-muted text-xs font-medium tracking-[0.15em] uppercase'

/** 95 → "1 min 35 sek", 40 → "40 sek" */
function duration(seconds: number) {
	const s = Math.round(seconds)
	if (s < 60) return `${s} sek`
	const m = Math.floor(s / 60)
	return `${m} min${s % 60 ? ` ${s % 60} sek` : ''}`
}

const pct = (v: number) =>
	`${v < 10 ? v.toFixed(1).replace('.', ',') : Math.round(v)} %`

/** "/" → "Forside", "/cases/acp" står som stien */
const pageName = (path: string) => (path === '/' ? 'Forside' : path)

const longDate = (day: string) =>
	new Date(`${day}T12:00:00`).toLocaleDateString('da-DK', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	})

function Bar({ share }: { share: number }) {
	return (
		<div className="bg-foreground/[0.06] mt-2 h-1.5 w-full overflow-hidden rounded-full">
			<div
				className="h-full rounded-full"
				style={{ width: `${Math.max(share, 1)}%`, background: 'var(--st-done-dot, #00b67a)' }}
			/>
		</div>
	)
}

/** Så mange sider vises, før "Vis alle sider" */
const TOP_PAGES = 10

function PeriodView({ period }: { period: Ga4Period }) {
	const [allPages, setAllPages] = useState(false)
	const pages = allPages ? period.pages : period.pages.slice(0, TOP_PAGES)
	const kpis = [
		{ label: 'Besøg', value: period.totals.visits.toLocaleString('da-DK'), hint: 'Besøg på sitet i perioden' },
		{ label: 'Sidevisninger', value: period.totals.views.toLocaleString('da-DK'), hint: 'Sider set i alt' },
		{ label: 'Tid pr. besøg', value: duration(period.totals.avgSeconds), hint: 'Gennemsnitlig aktiv tid' },
	]

	return (
		<>
			<div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
				{kpis.map((k) => (
					<div key={k.label} className={`p-6 ${card}`}>
						<span className={eyebrow}>{k.label}</span>
						<div className="text-foreground mt-3 text-3xl font-normal tracking-[-0.03em] md:text-[2.5rem]">
							{k.value}
						</div>
						<p className="text-muted mt-2 text-xs">{k.hint}</p>
					</div>
				))}
			</div>

			<div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[3fr_2fr]">
				<div className={`p-6 ${card}`}>
					<span className={eyebrow}>Mest sete sider</span>
					{period.pages.length === 0 ? (
						<p className="text-muted mt-3 text-sm">Ingen sidevisninger i perioden.</p>
					) : (
						<ul className="mt-2">
							{pages.map((page) => (
								<li key={page.path} className="border-foreground/[0.06] border-b py-3 last:border-0">
									<div className="flex items-baseline justify-between gap-3 text-sm">
										<span className="text-foreground min-w-0 truncate font-medium" title={page.path}>
											{pageName(page.path)}
										</span>
										<span className="text-foreground shrink-0 tabular-nums">{pct(page.share)}</span>
									</div>
									<Bar share={page.share} />
									<p className="text-muted mt-1.5 text-xs tabular-nums">
										{page.views.toLocaleString('da-DK')} visninger · {duration(page.avgSeconds)} i snit
									</p>
								</li>
							))}
						</ul>
					)}
					{period.pages.length > TOP_PAGES && (
						<button
							type="button"
							onClick={() => setAllPages((v) => !v)}
							className="text-foreground/60 hover:text-foreground mt-3 text-xs font-medium transition-colors"
						>
							{allPages ? 'Vis færre' : `Vis alle ${period.pages.length} sider`}
						</button>
					)}
				</div>

				<div className={`p-6 ${card}`}>
					<span className={eyebrow}>Hvor kom de fra?</span>
					{period.channels.length === 0 ? (
						<p className="text-muted mt-3 text-sm">Ingen besøg i perioden.</p>
					) : (
						<ul className="mt-2">
							{period.channels.map((c) => (
								<li key={c.key} className="border-foreground/[0.06] border-b py-3 last:border-0">
									<div className="flex items-baseline justify-between gap-3 text-sm">
										<span className="text-foreground font-medium">{c.label}</span>
										<span className="text-foreground shrink-0 tabular-nums">{pct(c.share)}</span>
									</div>
									<Bar share={c.share} />
									<p className="text-muted mt-1.5 text-xs tabular-nums">
										{c.visits.toLocaleString('da-DK')} besøg
									</p>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</>
	)
}

export default function VisitsTab({
	visits,
	isHorizen,
}: {
	visits: VisitsOverview
	isHorizen: boolean
}) {
	const [range, setRange] = useState<Ga4Range>('thisMonth')

	const source =
		visits.status === 'ok' && visits.ownSince
			? `Tallene tælles af sitet selv uden cookies, så alle besøg kommer med, også dem der siger nej til cookies. Tællingen startede ${longDate(visits.ownSince)}${visits.gaUntil ? '; før den dag kommer tallene fra Google Analytics, som kun så dem med samtykke' : ''}.`
			: 'Tallene kommer fra Google Analytics, som kun ser dem, der har sagt ja til cookies, indtil sitets egen tæller er i gang.'

	return (
		<div>
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<h3 className="text-foreground text-lg font-medium tracking-[-0.01em]">
						Hvem kommer forbi, og hvad ser de?
					</h3>
					<p className="text-muted mt-2 max-w-3xl text-sm leading-relaxed">
						De mest sete sider, hvor længe folk bliver, og hvor de kom fra.
					</p>
				</div>
				<div className="border-foreground/[0.08] flex rounded-full border bg-white p-1">
					{GA4_RANGES.map((r) => (
						<button
							key={r.key}
							type="button"
							onClick={() => setRange(r.key)}
							className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
								range === r.key
									? 'bg-foreground text-background'
									: 'text-foreground/60 hover:text-foreground'
							}`}
						>
							{r.label}
						</button>
					))}
				</div>
			</div>

			{visits.status === 'ok' ? (
				<PeriodView key={range} period={visits.periods[range]} />
			) : (
				<div className={`mt-6 ${notice}`}>
					<p className="text-foreground font-medium">Ingen besøgstal endnu.</p>
					<p className="text-muted mt-2">
						Tallene kommer, så snart de første besøg er talt.
						{isHorizen &&
							' Vil du have historik med fra før, så sæt GA4_PROPERTY_ID og Google-adgangen op (se fanen Opsætning).'}
					</p>
				</div>
			)}

			{isHorizen && visits.gaError && (
				<p className="text-muted mt-4 max-w-3xl text-xs leading-relaxed break-words">
					Google Analytics svarede ikke, så tallene fra før tællingen mangler: <code>{visits.gaError}</code>
				</p>
			)}

			<p className="text-muted mt-4 max-w-3xl text-xs leading-relaxed">
				<span className="font-medium">Sådan skal tallene læses:</span> {source} Et besøg er en
				ny fane på sitet. Tid er den tid, siden var synlig og i brug.
			</p>
		</div>
	)
}
