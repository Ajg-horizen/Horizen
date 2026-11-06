'use client'

import { useState } from 'react'
import { GA4_RANGES, type Ga4Overview, type Ga4Period, type Ga4Range } from '@/lib/ga4-shared'
import type { OwnVisits } from '@/lib/visits'

/**
 * Fanen Performance → Besøg (Andreas 6/11-2026). To kilder i samme enkle form:
 *   - "Alle besøg": egne tællere uden cookies (src/lib/pageStats.ts), så ALLE
 *     besøgende tælles, også dem der siger nej i cookie-banneret.
 *   - "Google Analytics": GA4 (src/lib/ga4.ts), kun dem der har sagt ja, men
 *     med Googles egen kanalopdeling.
 * Tre tal øverst, de mest sete sider med andel og tid, og hvor besøgerne kom fra.
 */

type Source = 'own' | 'ga4'

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

function Switch<T extends string>({
	value,
	options,
	onChange,
}: {
	value: T
	options: { key: T; label: string }[]
	onChange: (v: T) => void
}) {
	return (
		<div className="border-foreground/[0.08] flex rounded-full border bg-white p-1">
			{options.map((o) => (
				<button
					key={o.key}
					type="button"
					onClick={() => onChange(o.key)}
					className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
						value === o.key
							? 'bg-foreground text-background'
							: 'text-foreground/60 hover:text-foreground'
					}`}
				>
					{o.label}
				</button>
			))}
		</div>
	)
}

function PeriodView({ period, source }: { period: Ga4Period; source: Source }) {
	const own = source === 'own'
	const kpis = [
		{
			label: own ? 'Besøg' : 'Besøgende',
			value: period.totals.users.toLocaleString('da-DK'),
			hint: own ? 'Alle besøg, også uden cookies' : 'Forskellige personer med samtykke',
		},
		{ label: 'Sidevisninger', value: period.totals.views.toLocaleString('da-DK'), hint: 'Sider set i alt' },
		{
			label: own ? 'Tid pr. besøg' : 'Tid på sitet',
			value: duration(period.totals.avgSeconds),
			hint: own ? 'Gennemsnitlig aktiv tid pr. besøg' : 'Gennemsnitlig aktiv tid pr. besøgende',
		},
	]
	const unit = own ? 'besøg' : 'besøgende'

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
							{period.pages.map((page) => (
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
										{c.users.toLocaleString('da-DK')} {unit}
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
	overview,
	own,
	isHorizen,
}: {
	overview: Ga4Overview
	own: OwnVisits
	isHorizen: boolean
}) {
	const [range, setRange] = useState<Ga4Range>('thisMonth')
	const [source, setSource] = useState<Source>(own.status === 'ok' ? 'own' : 'ga4')

	const started =
		own.status === 'ok' && own.startedAt
			? new Date(own.startedAt).toLocaleDateString('da-DK', { day: 'numeric', month: 'long', year: 'numeric' })
			: null

	let body: React.ReactNode
	if (source === 'own') {
		body =
			own.status === 'ok' ? (
				<PeriodView period={own.periods[range]} source="own" />
			) : (
				<div className={`mt-6 ${notice}`}>
					<p className="text-foreground font-medium">Ingen egne besøgstal endnu.</p>
					<p className="text-muted mt-2">
						De anonyme tællere starter, så snart sitet med tælleren er udrullet, og
						de første besøg kommer ind. Indtil da kan du se Google Analytics.
					</p>
				</div>
			)
	} else if (overview.status === 'ok') {
		body = <PeriodView period={overview.periods[range]} source="ga4" />
	} else if (overview.status === 'off') {
		body = (
			<div className={`mt-6 ${notice}`}>
				<p className="text-foreground font-medium">Google Analytics er ikke sat op her.</p>
				{isHorizen && (
					<p className="text-muted mt-2">
						Sæt <code>GA4_PROPERTY_ID</code> i Vercel, slå Google Analytics Data API til,
						og kør <code>node scripts/get-refresh-token.mjs --vercel</code>. Se fanen Opsætning.
					</p>
				)}
			</div>
		)
	} else {
		body = (
			<div className={`mt-6 ${notice}`}>
				<p className="text-foreground font-medium">Google Analytics kan ikke hentes lige nu.</p>
				{isHorizen && (
					<p className="text-muted mt-2 break-words">
						GA4 svarede: <code>{overview.message}</code>
					</p>
				)}
			</div>
		)
	}

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
				<div className="flex flex-wrap gap-2">
					<Switch
						value={source}
						options={[
							{ key: 'own', label: 'Alle besøg' },
							{ key: 'ga4', label: 'Google Analytics' },
						]}
						onChange={setSource}
					/>
					<Switch value={range} options={GA4_RANGES} onChange={setRange} />
				</div>
			</div>

			{body}

			<p className="text-muted mt-4 max-w-3xl text-xs leading-relaxed">
				<span className="font-medium">Sådan skal tallene læses:</span>{' '}
				{source === 'own' ? (
					<>
						“Alle besøg” tælles anonymt af sitet selv, uden cookies og uden at gemme
						noget om den besøgende, så alle kommer med, også dem der siger nej til
						cookies. Et besøg er en ny fane på sitet; vi genkender ikke den samme person
						igen. Tid er den tid, siden var synlig og i brug.
						{started && ` Tallene er talt siden ${started}.`}
					</>
				) : (
					<>
						Google Analytics tæller kun besøgende, der har sagt ja til statistik-cookies.
						Brug det til at se tendenser og Googles egen kanalopdeling; det præcise antal
						besøg står under “Alle besøg”.
					</>
				)}
			</p>
		</div>
	)
}
