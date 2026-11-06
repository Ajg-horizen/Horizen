'use client'

import { useState } from 'react'
import { GA4_RANGES, type Ga4Overview, type Ga4Range } from '@/lib/ga4-shared'

/**
 * Fanen Performance → Besøg (Andreas 6/11-2026): GA4 i en enkel udgave. Tre
 * tal øverst, de mest sete sider med andel og tid, og hvor besøgerne kom fra.
 * Data hentes i src/lib/ga4.ts; her vælges kun periode.
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

export default function VisitsTab({
	overview,
	isHorizen,
}: {
	overview: Ga4Overview
	isHorizen: boolean
}) {
	const [range, setRange] = useState<Ga4Range>('thisMonth')

	if (overview.status === 'off') {
		return (
			<div className={notice}>
				<p className="text-foreground font-medium">Besøg er ikke sat op endnu.</p>
				{isHorizen && (
					<p className="text-muted mt-2">
						Sæt <code>GA4_PROPERTY_ID</code> (GA4-ejendommens ID, et tal) i Vercel,
						slå Google Analytics Data API til i Google Cloud, og kør{' '}
						<code>node scripts/get-refresh-token.mjs</code> igen, så Google-adgangen
						også dækker GA4. Se fanen Opsætning.
					</p>
				)}
			</div>
		)
	}

	if (overview.status === 'error') {
		return (
			<div className={notice}>
				<p className="text-foreground font-medium">Besøgstallene kan ikke hentes lige nu.</p>
				{isHorizen && (
					<p className="text-muted mt-2 break-words">
						GA4 svarede: <code>{overview.message}</code>. Typisk mangler
						Google-adgangen GA4 (kør <code>get-refresh-token.mjs</code> igen), Data
						API er ikke slået til, eller <code>GA4_PROPERTY_ID</code> er forkert.
					</p>
				)}
			</div>
		)
	}

	const p = overview.periods[range]
	const kpis = [
		{ label: 'Besøgende', value: p.totals.users.toLocaleString('da-DK'), hint: 'Forskellige personer' },
		{ label: 'Sidevisninger', value: p.totals.views.toLocaleString('da-DK'), hint: 'Sider set i alt' },
		{ label: 'Tid på sitet', value: duration(p.totals.avgSeconds), hint: 'Gennemsnitlig aktiv tid pr. besøgende' },
	]

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
					{p.pages.length === 0 ? (
						<p className="text-muted mt-3 text-sm">Ingen sidevisninger i perioden.</p>
					) : (
						<ul className="mt-2">
							{p.pages.map((page) => (
								<li
									key={page.path}
									className="border-foreground/[0.06] border-b py-3 last:border-0"
								>
									<div className="flex items-baseline justify-between gap-3 text-sm">
										<span className="text-foreground min-w-0 truncate font-medium" title={page.path}>
											{pageName(page.path)}
										</span>
										<span className="text-foreground shrink-0 tabular-nums">
											{pct(page.share)}
										</span>
									</div>
									<Bar share={page.share} />
									<p className="text-muted mt-1.5 text-xs tabular-nums">
										{page.views.toLocaleString('da-DK')} visninger · {duration(page.avgSeconds)} i snit
									</p>
								</li>
							))}
						</ul>
					)}
				</div>

				<div className={`p-6 ${card}`}>
					<span className={eyebrow}>Hvor kom de fra?</span>
					{p.channels.length === 0 ? (
						<p className="text-muted mt-3 text-sm">Ingen besøg i perioden.</p>
					) : (
						<ul className="mt-2">
							{p.channels.map((c) => (
								<li
									key={c.key}
									className="border-foreground/[0.06] border-b py-3 last:border-0"
								>
									<div className="flex items-baseline justify-between gap-3 text-sm">
										<span className="text-foreground font-medium">{c.label}</span>
										<span className="text-foreground shrink-0 tabular-nums">{pct(c.share)}</span>
									</div>
									<Bar share={c.share} />
									<p className="text-muted mt-1.5 text-xs tabular-nums">
										{c.users.toLocaleString('da-DK')} besøgende
									</p>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>

			<p className="text-muted mt-4 max-w-3xl text-xs leading-relaxed">
				<span className="font-medium">Sådan skal tallene læses:</span> tallene kommer
				fra Google Analytics og tæller kun besøgende, der har sagt ja til
				statistik-cookies. Brug dem til at se, hvilke sider der er populære, og
				hvordan det udvikler sig, mere end som det præcise antal besøgende. Tid på
				siden er den tid, siden var åben og i brug.
			</p>
		</div>
	)
}
