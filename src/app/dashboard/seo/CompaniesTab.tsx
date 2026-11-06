'use client'

import { useState } from 'react'
import type { CompaniesOverview, CompanyRow } from '@/lib/companies-shared'
import { GA4_RANGES, type Ga4Range } from '@/lib/ga4-shared'

/**
 * Fanen Besøgende → Virksomheder (Andreas 6/11-2026): hvilke virksomheder
 * der kigger forbi, ud fra hvem nettet er registreret til
 * (src/lib/companyLookup.ts, src/lib/companies.ts). Kun virksomheder, aldrig
 * personer.
 */

const card = 'rounded-2xl border border-foreground/[0.08] bg-white'
const eyebrow = 'text-muted text-xs font-medium tracking-[0.15em] uppercase'

const pct = (v: number) => `${v < 10 ? v.toFixed(1).replace('.', ',') : Math.round(v)} %`

const pageName = (path: string) => (path === '/' ? 'Forside' : path)

const shortDate = (iso?: string) =>
	iso
		? new Date(iso).toLocaleDateString('da-DK', {
				day: 'numeric',
				month: 'short',
				timeZone: 'Europe/Copenhagen',
			})
		: ''

const longDate = (day: string) =>
	new Date(`${day}T12:00:00`).toLocaleDateString('da-DK', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	})

/** Så mange virksomheder vises, før "Vis alle" */
const TOP = 25

function CompanyItem({ c }: { c: CompanyRow }) {
	return (
		<li className="border-foreground/[0.06] border-b last:border-0">
			<details className="group py-3">
				<summary className="flex cursor-pointer list-none items-baseline justify-between gap-3 text-sm">
					<span className="min-w-0">
						<span className="text-foreground font-medium">{c.name}</span>
						{c.country && c.country !== 'DK' && (
							<span className="text-muted ml-2 text-xs">{c.country}</span>
						)}
					</span>
					<span className="text-muted shrink-0 text-xs tabular-nums">
						{c.visits.toLocaleString('da-DK')} besøg ·{' '}
						{c.views.toLocaleString('da-DK')} {c.views === 1 ? 'side' : 'sider'} · senest{' '}
						{shortDate(c.lastSeen)}
					</span>
				</summary>
				<div className="mt-3 grid gap-3 pl-0.5 text-xs sm:grid-cols-[3fr_2fr]">
					<div>
						<p className="text-muted mb-1 font-medium">Sider, de så</p>
						<ul className="space-y-0.5">
							{c.pages.slice(0, 12).map((p) => (
								<li key={p.path} className="flex justify-between gap-3">
									<span className="text-foreground truncate" title={p.path}>
										{pageName(p.path)}
									</span>
									<span className="text-muted shrink-0 tabular-nums">{p.views}</span>
								</li>
							))}
						</ul>
					</div>
					{c.sources.length > 0 && (
						<div>
							<p className="text-muted mb-1 font-medium">Kom fra</p>
							<ul className="space-y-0.5">
								{c.sources.map((s) => (
									<li key={s.label} className="flex justify-between gap-3">
										<span className="text-foreground">{s.label}</span>
										<span className="text-muted tabular-nums">{s.visits}</span>
									</li>
								))}
							</ul>
						</div>
					)}
				</div>
			</details>
		</li>
	)
}

export default function CompaniesTab({ overview }: { overview: CompaniesOverview }) {
	const [range, setRange] = useState<Ga4Range>('thisMonth')
	const [all, setAll] = useState(false)
	const period = overview.periods[range]
	const shown = all ? period.companies : period.companies.slice(0, TOP)
	const share = period.checked ? (period.matched / period.checked) * 100 : 0

	return (
		<div>
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<h3 className="text-foreground text-lg font-medium tracking-[-0.01em]">
						Hvilke virksomheder kigger forbi?
					</h3>
					<p className="text-muted mt-2 max-w-3xl text-sm leading-relaxed">
						Besøg fra en virksomheds eget netværk, senest set øverst. Klik for at se, hvilke sider de så.
					</p>
				</div>
				<div className="border-foreground/[0.08] flex flex-wrap rounded-full border bg-white p-1">
					{GA4_RANGES.map((r) => (
						<button
							key={r.key}
							type="button"
							onClick={() => {
								setRange(r.key)
								setAll(false)
							}}
							className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
								range === r.key ? 'bg-foreground text-background' : 'text-foreground/60 hover:text-foreground'
							}`}
						>
							{r.label}
						</button>
					))}
				</div>
			</div>

			<div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div className={`p-6 ${card}`}>
					<span className={eyebrow}>Virksomheder</span>
					<div className="text-foreground mt-3 text-3xl font-normal tracking-[-0.03em] md:text-[2.5rem]">
						{period.companies.length.toLocaleString('da-DK')}
					</div>
					<p className="text-muted mt-2 text-xs">Forskellige virksomheder i perioden</p>
				</div>
				<div className={`p-6 ${card}`}>
					<span className={eyebrow}>Genkendt</span>
					<div className="text-foreground mt-3 text-3xl font-normal tracking-[-0.03em] md:text-[2.5rem]">
						{period.checked ? pct(share) : '–'}
					</div>
					<p className="text-muted mt-2 text-xs">
						{period.matched.toLocaleString('da-DK')} af {period.checked.toLocaleString('da-DK')} besøg kom
						fra en virksomheds net
					</p>
				</div>
			</div>

			<div className={`mt-6 p-6 ${card}`}>
				<span className={eyebrow}>Virksomheder</span>
				{period.companies.length === 0 ? (
					<p className="text-muted mt-3 text-sm">
						Ingen virksomheder i perioden endnu. Listen fyldes, når nogen besøger sitet fra en
						virksomheds eget net.
					</p>
				) : (
					<ul className="mt-2">
						{shown.map((c) => (
							<CompanyItem key={c.key} c={c} />
						))}
					</ul>
				)}
				{period.companies.length > TOP && (
					<button
						type="button"
						onClick={() => setAll((v) => !v)}
						className="text-foreground/60 hover:text-foreground mt-3 text-xs font-medium transition-colors"
					>
						{all ? 'Vis færre' : `Vis alle ${period.companies.length} virksomheder`}
					</button>
				)}
			</div>

			<p className="text-muted mt-4 max-w-3xl text-xs leading-relaxed">
				<span className="font-medium">Sådan skal listen læses:</span> Virksomheden findes ud fra, hvem
				netværket er registreret til i det offentlige IP-register. Sidder nogen på kontoret hos en
				virksomhed med eget net, står virksomheden her. Hjemme, på mobilen eller på et almindeligt
				internetabonnement kan man ikke se det, og så tælles besøget som ukendt. Vi ser aldrig, hvem
				personen er, og IP-adresser gemmes ikke.
				{overview.since && ` Opslagene startede ${longDate(overview.since)}.`}
			</p>
		</div>
	)
}
