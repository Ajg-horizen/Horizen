'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import {
	brand,
	seoHourMax,
	seoHourMin,
	seoBonusHours,
	seoHourStep,
	seoIntroBonus,
	seoPackagePrice,
	seoPackages,
	seoPackageTerms,
	type SeoPackage,
} from './data'

/**
 * Faner, der kun er åbne med en månedlig SEO-aftale (Andreas 20/11-2026, model B
 * "smagsprøve"). Uden aftale står fanen grå i menuen med en lås, og siden viser
 * ét tal åbent + en sløret skitse af resten + knappen "Få en SEO-aftale". Vi
 * måler stadig alt i baggrunden; kun visningen er låst, så historikken ligger
 * klar, den dag kunden starter.
 *
 * Skitsen er en fast illustration, aldrig kundens rigtige data, så tallene
 * heller ikke kan læses i browserens kildekode.
 */

export const SEO_LOCK_HINT = 'Indgår i en månedlig SEO-aftale hos Horizen'

const kr = (n: number) => `${n.toLocaleString('da-DK')} kr.`
const t = (h: number) => `${h.toLocaleString('da-DK')} t`
const priceText = (p: SeoPackage, hours = p.hours) => {
	const price = seoPackagePrice(p, hours)
	return price == null ? 'Efter aftale' : `${p.pricePrefix ? `${p.pricePrefix} ` : ''}${kr(price)}`
}

type Preview = 'chart' | 'list' | 'grid'

function Skeleton({ kind }: { kind: Preview }) {
	const bar = 'rounded-md bg-foreground/[0.08]'
	if (kind === 'chart') {
		const h = [30, 45, 38, 60, 52, 70, 64, 82, 75, 90]
		return (
			<div className="flex h-40 items-end gap-2">
				{h.map((v, i) => (
					<div key={i} className={`flex-1 ${bar}`} style={{ height: `${v}%` }} />
				))}
			</div>
		)
	}
	if (kind === 'grid') {
		return (
			<div className="grid grid-cols-12 gap-1.5">
				{Array.from({ length: 72 }, (_, i) => (
					<div
						key={i}
						className="h-7 rounded-md bg-foreground"
						style={{ opacity: 0.04 + ((i * 37) % 11) / 60 }}
					/>
				))}
			</div>
		)
	}
	return (
		<div className="space-y-3">
			{[80, 65, 90, 55, 72].map((w, i) => (
				<div key={i} className="flex items-center gap-4">
					<div className={`h-4 w-16 ${bar}`} />
					<div className={`h-4 ${bar}`} style={{ width: `${w}%` }} />
				</div>
			))}
		</div>
	)
}

const EMBLEM_PATHS: Record<string, string> = {
	// Start: spire · Vækst: pil op · Profil: skjold · Førende: stjerne · Enterprise: krone
	start: 'M12 21v-8M12 13c0-4 3-6 7-6 0 4-3 6-7 6zM12 15c0-3-2-5-6-5 0 3 2 5 6 5z',
	vaekst: 'M3 17l6-6 4 4 8-8M15 7h6v6',
	profil: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
	foerende: 'M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9z',
	enterprise: 'M3 8l4 4 5-7 5 7 4-4-2 11H5z',
}

/** Pakkens emblem (Andreas 20/11-2026: klare navne + emblem) */
export function PackageEmblem({ id, className = 'size-4' }: { id: string; className?: string }) {
	const d = EMBLEM_PATHS[id]
	if (!d) return null
	return (
		<svg
			viewBox="0 0 24 24"
			className={className}
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d={d} />
		</svg>
	)
}

/** Lille hængelås til menuen og knappen */
export function LockIcon({ className = 'size-3.5' }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 24 24"
			className={className}
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<rect x="4" y="11" width="16" height="10" rx="2" />
			<path d="M8 11V7a4 4 0 0 1 8 0v4" />
		</svg>
	)
}

/** Siden, der vises i stedet for en låst fane. */
export function LockedTab({
	eyebrow,
	title,
	teaser,
	points,
	preview,
	signedInAs,
}: {
	eyebrow: string
	title: string
	/** Det ene tal, der vises åbent, fx "Du fik 3 henvendelser i november" */
	teaser?: ReactNode
	/** Hvad kunden får adgang til med en aftale */
	points: string[]
	preview: Preview
	signedInAs?: string
}) {
	return (
		<div className="space-y-6">
			<div>
				<span className="text-foreground/55 inline-flex items-center gap-1.5 text-[11px] font-medium tracking-[0.14em] uppercase">
					<LockIcon className="size-3" />
					{eyebrow} · indgår i SEO-aftalen
				</span>
				<h2 className="text-foreground mt-2 text-2xl font-semibold tracking-tight md:text-[1.75rem]" style={{ lineHeight: 1.1 }}>
					{title}
				</h2>
			</div>

			{teaser && (
				<div className="border-foreground/[0.08] rounded-2xl border bg-white p-6">
					<p className="text-foreground text-lg leading-relaxed">{teaser}</p>
				</div>
			)}

			<div className="border-foreground/[0.08] relative overflow-hidden rounded-2xl border bg-white">
				<div className="pointer-events-none p-6 blur-[3px] select-none" aria-hidden="true">
					<Skeleton kind={preview} />
				</div>
				<div className="absolute inset-0 flex items-center justify-center bg-white/40 p-6 backdrop-blur-[1px]">
					<div className="max-w-md text-center">
						<span className="bg-foreground/[0.06] text-foreground mx-auto inline-flex size-10 items-center justify-center rounded-full">
							<LockIcon className="size-4" />
						</span>
						<p className="text-foreground mt-3 font-medium">Resten kan ses med en SEO-aftale</p>
						<p className="text-muted mt-1 text-sm">
							Vi måler det hele tiden, så historikken ligger klar, den dag I starter.
						</p>
						<div className="mt-4">
							<SeoInterestButton from={eyebrow} signedInAs={signedInAs} />
						</div>
					</div>
				</div>
			</div>

			<div className="border-foreground/[0.08] rounded-2xl border bg-white p-6">
				<p className="text-foreground text-sm font-medium">Med en SEO-aftale får I</p>
				<ul className="mt-3 space-y-2 text-sm">
					{points.map((p) => (
						<li key={p} className="text-muted flex gap-2.5">
							<span className="text-foreground" aria-hidden="true">
								✓
							</span>
							{p}
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}

/**
 * "Få en SEO-aftale": vindue med de faste SEO-pakker fra
 * data.ts (seoPackages). Pakken med et mærke ("Mest valgt") er valgt fra start.
 * Sendes som en opgave til Horizen via /api/seo-task, ligesom "Køb flere
 * timer". Det er en interesse, ikke et køb: Horizen vender tilbage med et tilbud.
 */
export function SeoInterestButton({
	from,
	signedInAs,
	variant = 'primary',
	currentId,
	currentHours,
}: {
	from: string
	signedInAs?: string
	/** 'link' = diskret link (timekortet); 'badge' = pakkemærket på Overblik */
	variant?: 'primary' | 'link' | 'badge'
	/** Kundens nuværende pakke: så bliver vinduet til "Jeres SEO-pakke" (skru op eller opgradér) */
	currentId?: string | null
	/** Kundens nuværende timer om måneden (retainerHours); ellers pakkens anbefalede */
	currentHours?: number
}) {
	const currentIdx = currentId ? seoPackages.findIndex((p) => p.id === currentId) : -1
	const current = currentIdx >= 0 ? seoPackages[currentIdx] : undefined
	// Kundens timer i dag i den nuværende pakke
	const curHours = current ? (currentHours || current.hours) : undefined
	// Ved en aftale: den nuværende og de større pakker. Skift ned sker i en samtale.
	const list = current ? seoPackages.slice(currentIdx) : seoPackages
	// Med en aftale starter vinduet på jeres egen pakke (Andreas 25/11-2026: skru
	// gradvist op, som Miljøkontoret); uden aftale på "Mest valgt"
	const initial = current ?? seoPackages.find((p) => p.badge) ?? seoPackages[0]
	const hasBigger = current ? currentIdx < seoPackages.length - 1 : true
	// Timer, en pakke starter på, når den vælges
	const startHours = (p: SeoPackage) => (p.id === current?.id ? curHours : p.hours)
	const [open, setOpen] = useState(false)
	// Eksemplet i introtilbuddet: den mest valgte pakke
	const example = seoPackages.find((p) => p.badge && p.hours) ?? seoPackages.find((p) => p.hours)
	const [pick, setPick] = useState<SeoPackage | undefined>(initial)
	// Timer i den valgte pakke; starter på pakkens anbefalede timer
	const [hours, setHours] = useState<number | undefined>(initial ? startHours(initial) : undefined)
	const choose = (p: SeoPackage) => {
		setPick(p)
		setHours(startHours(p))
	}
	// Egen pakke valgt: kun "skru op" kan sendes
	const pickIsCurrent = !!current && pick?.id === current.id
	const canSend = !!pick && (!pickIsCurrent || (hours ?? 0) > (curHours ?? 0))
	const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
	const [error, setError] = useState('')
	const [mounted, setMounted] = useState(false)
	useEffect(() => setMounted(true), [])

	useEffect(() => {
		if (!open) return
		const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
		window.addEventListener('keydown', onKey)
		return () => window.removeEventListener('keydown', onKey)
	}, [open])

	async function send() {
		if (!pick) return
		setState('sending')
		setError('')
		const who = signedInAs || brand.client
		try {
			const res = await fetch('/api/seo-task', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				// Kun pakkens id: navn, pris og tekst bygges på serveren (src/lib/seoInterestMail.ts)
				body: JSON.stringify({
					seoInterest: { packageId: pick.id, currentId: current?.id, hours },
					from: who,
					website: '',
				}),
			})
			const data = await res.json().catch(() => ({}))
			if (!res.ok) throw new Error(data?.error || 'Beskeden kunne ikke sendes')
			setState('sent')
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Beskeden kunne ikke sendes')
			setState('error')
		}
	}

	const dialog = (
		<div
			className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-black/40 p-4"
			onClick={() => setOpen(false)}
		>
			<div
				role="dialog"
				aria-modal="true"
				aria-label="Interesseret i en SEO-aftale"
				className="border-foreground/[0.08] my-auto w-full max-w-2xl rounded-3xl border bg-white p-6 shadow-xl md:p-8"
				onClick={(e) => e.stopPropagation()}
			>
				{state === 'sent' && pick ? (
					<div className="text-center">
						<p className="text-foreground text-xl font-semibold tracking-tight">Tak, vi har fået jeres besked</p>
						<p className="text-muted mt-2 text-sm leading-relaxed">
							{pickIsCurrent
								? `Vi kontakter jer inden for 1-2 hverdage om at skrue op til ${t(hours ?? 0)} om måneden.`
								: current
								? `Vi kontakter jer inden for 1-2 hverdage om opgraderingen til ${pick.name}${hours ? ` med ${t(hours)} om måneden` : ''}.`
								: `Vi kontakter jer inden for 1-2 hverdage om SEO-pakken ${pick.name}${hours ? ` med ${t(hours)} om måneden` : ''}. Det er helt uforpligtende.`}
						</p>
						<button
							type="button"
							onClick={() => setOpen(false)}
							className="bg-foreground text-background mt-6 rounded-full px-5 py-2.5 text-sm font-medium"
						>
							Luk
						</button>
					</div>
				) : (
					<>
						<p className="text-foreground flex items-center gap-2 text-xl font-semibold tracking-tight">
							{current && <PackageEmblem id={current.id} className="size-5" />}
							{current ? `Jeres SEO-pakke: ${current.name}` : 'Interesseret i en SEO-aftale?'}
						</p>
						{current ? (
							<p className="text-muted mt-2 text-sm leading-relaxed">
								{hasBigger
									? 'Vil I have mere fart på, kan I skrue op for timerne i jeres pakke eller vælge en større pakke. Vil I ned i timer eller skifte til en mindre pakke, så skriv til os.'
									: 'Vil I have mere fart på, kan I skrue op for timerne. Vil I ned i timer, så skriv til os.'}
							</p>
						) : (
						<p className="text-muted mt-2 text-sm leading-relaxed">
							Hver pakke har et antal timer om måneden, som vi anbefaler. Passer pakken ikke helt, kan I
								skrue timerne op eller ned i stedet for at skifte pakke, og I kan altid følge med i, hvad
								timerne går til. Vi tilpasser indsatsen hver måned efter, hvad der giver
							mest effekt, også nye sider og blogindlæg, når der er brug for dem. I sender bare en besked,
							og vi vender tilbage med et tilbud.
						</p>
						)}

						<div className="mt-6 space-y-2" role="radiogroup" aria-label="SEO-pakker">
							{list.map((p) => {
								const on = pick?.id === p.id
								const isCurrent = current?.id === p.id
								const h = on ? hours : startHours(p)
								const adjusted = on && h != null && h !== p.hours
								// Egen pakke: kan kun skrues op fra jeres timer i dag
								const minH = isCurrent ? (curHours ?? seoHourMin(p)) : seoHourMin(p)
								const maxH = isCurrent ? Math.max(seoHourMax(p), curHours ?? 0) : seoHourMax(p)
								const extra = isCurrent && h != null && curHours != null ? h - curHours : 0
								// Introtilbud: kun for nye kunder, ikke ved opgradering
								const bonus = current ? 0 : seoBonusHours(p, h)
								// Puf mod næste pakke, når de justerede timer koster tæt på den
								const next = seoPackages[seoPackages.indexOf(p) + 1]
								const nowPrice = seoPackagePrice(p, h)
								const nudge =
									on && next?.price != null && next.hours && nowPrice != null && nowPrice >= next.price * 0.8
										? next.price - nowPrice
										: null
								const step = (d: number) =>
									setHours((x) => Math.min(maxH, Math.max(minH, (x ?? p.hours ?? 0) + d)))
								return (
									<div
										key={p.id}
										className={`rounded-2xl border transition-colors ${
											on
												? 'border-foreground bg-foreground/[0.04]'
												: 'border-foreground/[0.1] hover:bg-foreground/[0.02]'
										}`}
									>
									<button
										type="button"
										role="radio"
										aria-checked={on}
										onClick={() => choose(p)}
										className="w-full p-4 text-left"
									>
										<div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
											<span className="flex items-center gap-2">
												<span
													className={`inline-flex size-4 items-center justify-center rounded-full border ${on ? 'border-foreground' : 'border-foreground/30'}`}
													aria-hidden="true"
												>
													{on && <span className="bg-foreground size-2 rounded-full" />}
												</span>
												<PackageEmblem id={p.id} className="text-foreground/70 size-4" />
												<span className="text-foreground font-semibold">{p.name}</span>
												{isCurrent && (
													<span className="border-foreground/20 text-foreground/70 rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase">
														Jeres pakke
													</span>
												)}
												{p.badge && !current && (
													<span className="rounded-full bg-[var(--st-done-dot,#34d399)] px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[#0e0f0f] uppercase">
														{p.badge}
													</span>
												)}
											</span>
											<span className="text-right">
												<span className="text-foreground block text-sm font-medium tabular-nums">
													{priceText(p, h)}
													{p.price != null && <span className="text-muted font-normal"> /md</span>}
												</span>
												{p.hours != null && (
													<span className="text-muted block text-xs tabular-nums">
														{isCurrent
															? extra > 0
																? `${t(h!)} om måneden · i dag ${t(curHours!)}`
																: `${t(h!)} om måneden · jeres timer i dag`
															: adjusted
																? `${t(h!)} om måneden`
																: `${t(p.hours)} om måneden · anbefalet`}
													</span>
												)}
												{on && bonus > 0 && (
													// Gul = tilbud (Andreas 25/11-2026), så det ikke flyder sammen med det grønne "Mest valgt".
													// Kun på den valgte pakke, så listen ikke bliver for tung.
													<span className="mt-1 inline-block rounded-full bg-amber-300 px-2 py-0.5 text-[10px] font-semibold text-[#1f1600] tabular-nums">
														+{t(bonus)} ekstra hver måned de første {seoIntroBonus.months} mdr.
													</span>
												)}
											</span>
										</div>
										<p className="text-muted mt-1.5 pl-6 text-sm leading-relaxed">{p.fits}</p>
										{on && (
											<ul className="mt-3 space-y-1 pl-6 text-sm">
												{p.includes.map((x) => (
													<li key={x} className="text-foreground/80 flex gap-2">
														<span aria-hidden="true">✓</span>
														{x}
													</li>
												))}
											</ul>
										)}
									</button>
									{on && p.hours != null && h != null && (
										<div className="border-foreground/[0.08] mx-4 mb-4 ml-10 rounded-xl border bg-white p-3">
											<div className="flex flex-wrap items-center justify-between gap-3">
												<div>
													<p className="text-foreground text-sm font-medium">Timer om måneden</p>
													<p className="text-muted text-xs">
														{isCurrent
															? extra > 0
																? `+${t(extra)} om måneden = ${kr(extra * (seoPackagePrice(p, 1) ?? 0))} mere om måneden.`
																: `I har ${t(curHours!)} om måneden i dag. Tryk + for at skrue op.`
															: adjusted
																? `Vi anbefaler ${t(p.hours)} til ${p.name}. Prisen følger timerne.`
																: 'Det anbefaler vi. I kan skrue op eller ned.'}
														{!current && seoIntroBonus.percent > 0 && h < p.hours && (
															<> Bonustimerne gælder ved {t(p.hours)} eller flere.</>
														)}
													</p>
												</div>
												<div className="flex items-center gap-1.5">
													<button
														type="button"
														aria-label="Færre timer"
														onClick={() => step(-seoHourStep)}
														disabled={h <= minH}
														className="border-foreground/15 text-foreground hover:bg-foreground/[0.04] inline-flex size-8 items-center justify-center rounded-full border text-lg leading-none disabled:opacity-30"
													>
														−
													</button>
													<span className="text-foreground w-14 text-center font-semibold tabular-nums" aria-live="polite">
														{t(h)}
													</span>
													<button
														type="button"
														aria-label="Flere timer"
														onClick={() => step(seoHourStep)}
														disabled={h >= maxH}
														className="border-foreground/15 text-foreground hover:bg-foreground/[0.04] inline-flex size-8 items-center justify-center rounded-full border text-lg leading-none disabled:opacity-30"
													>
														+
													</button>
												</div>
											</div>
										{nudge != null && next && (
												<p className="mt-2.5 rounded-lg bg-[var(--st-done-dot,#34d399)]/15 px-3 py-2 text-xs leading-relaxed text-foreground">
													{nudge > 0
														? `For ${kr(nudge)} mere om måneden får I ${next.name} med ${t(next.hours!)} og alt, hvad der hører til.`
														: `${next.name} med ${t(next.hours!)} koster det samme og indeholder mere.`}{' '}
													<button type="button" onClick={() => choose(next)} className="font-medium underline underline-offset-2">
														Se {next.name}
													</button>
												</p>
											)}
										</div>
									)}
									</div>
								)
							})}
						</div>

						{!current && (
						<div className="bg-foreground/[0.03] mt-6 rounded-2xl p-4 text-sm leading-relaxed">
							<p className="text-foreground font-medium">Det skal I forvente</p>
							<ul className="text-muted mt-2 space-y-1.5">
								{seoIntroBonus.percent > 0 && (
									<li>
										<span className="text-foreground font-medium">Introtilbud:</span> de første{' '}
										{seoIntroBonus.months} måneder lægger vi ekstra timer oven i pakken, uden at I betaler mere. {example?.hours != null && (
											<>
												Med {example.name} får I fx {t(example.hours + seoBonusHours(example))} om måneden til prisen for{' '}
												{t(example.hours)}.{' '}
											</>
										)}
										Det gør vi, fordi starten kræver mest
										arbejde. Bagefter fortsætter pakken med de almindelige timer til samme pris.
									</li>
								)}
								<li>
									Vi går i gang fra første dag, men resultaterne af SEO kan oftest først ses efter 3 til 6
									måneder. Det er en investering, der vokser gradvist over tid.
								</li>
								<li>
									Ingen bindingsperiode, kun en opsigelse på løbende måned plus {seoPackageTerms.noticeMonths} måned.
									Siger I fx op midt i november, kører aftalen til og med december.
								</li>
							</ul>
							<p className="text-muted mt-3 text-xs">{seoPackageTerms.note}</p>
						</div>
						)}

						{state === 'error' && <p className="mt-4 text-sm text-red-600">{error}</p>}

						<div className="mt-6 flex flex-wrap justify-end gap-2">
							<button
								type="button"
								onClick={() => setOpen(false)}
								className="text-foreground hover:bg-foreground/[0.04] rounded-full px-4 py-2.5 text-sm"
							>
								Annullér
							</button>
							<button
								type="button"
								onClick={send}
								disabled={!canSend || state === 'sending'}
								className="bg-foreground text-background rounded-full px-5 py-2.5 text-sm font-medium disabled:opacity-60"
							>
								{state === 'sending'
									? 'Sender …'
									: !pick
										? 'Kontakt Horizen'
										: pick.pricePrefix || pick.price == null
											? 'Kontakt Horizen'
											: pickIsCurrent
												? `Skru op til ${t(hours ?? 0)} om måneden`
												: current
												? `Opgradér til ${pick.name}${hours != null && hours !== pick.hours ? ` (${t(hours)})` : ''}`
												: `Send interesse for ${pick.name}${hours != null && hours !== pick.hours ? ` (${t(hours)})` : ''}`}
							</button>
						</div>
					</>
				)}
			</div>
		</div>
	)

	const openDialog = () => {
		setState('idle')
		setPick(initial)
		setHours(initial ? startHours(initial) : undefined)
		setOpen(true)
	}

	if (variant === 'badge' && current)
		return (
			<>
				<button
					type="button"
					onClick={openDialog}
					title="Jeres SEO-pakke. Klik for at se den eller opgradere"
					className="border-foreground/[0.12] text-foreground hover:bg-foreground/[0.04] inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors"
				>
					<PackageEmblem id={current.id} className="size-3.5" />
					SEO · {current.name}
				</button>
				{open && mounted && createPortal(dialog, document.body)}
			</>
		)

	return (
		<>
			<button
				type="button"
				onClick={openDialog}
				className={
					variant === 'link'
						? 'text-foreground/70 hover:text-foreground mt-1 text-xs font-medium underline underline-offset-2'
						: 'bg-foreground text-background rounded-full px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-85'
				}
			>
				Få en SEO-aftale
			</button>
			{open && mounted && createPortal(dialog, document.body)}
		</>
	)
}
