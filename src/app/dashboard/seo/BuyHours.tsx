'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { brand, hourDiscount, hourPackages } from './data'

/**
 * "Køb flere timer" (fra TUG, Andreas 19/11-2026): knap under timemåleren, der åbner
 * et vindue med en skyder fra 1 til 20 timer. Pris, rabat og besparelse
 * opdateres, mens man trækker (10 % fra 10 timer, 20 % ved 20). En bestilling sendes som
 * en opgave via /api/seo-task, så Horizen får en mail; der betales ikke her,
 * fakturaen sendes bagefter. Større opgaver går stadig gennem "Ny opgave"
 * med et tidsoverslag.
 */

const kr = (n: number) => `${n.toLocaleString('da-DK', { maximumFractionDigits: 0 })} kr.`

/** Så længe skal bestil-knappen holdes nede (ms) */
const HOLD_MS = 3000

/**
 * Bestil-knap, der skal HOLDES NEDE i 3 sekunder (Andreas 19/11-2026), så et
 * køb ikke kan ske ved et uheld. En cirkel fyldes, mens man holder; slipper
 * man før tid, nulstilles den. Virker med mus, touch og tastatur (hold
 * mellemrum eller Enter nede).
 */
export function HoldToConfirm({
	label,
	disabled,
	onConfirm,
	verb = 'bestille',
	hint,
}: {
	label: string
	disabled?: boolean
	onConfirm: () => void
	/** Handlingen i hjælpeteksten: "Hold knappen nede i 3 sekunder for at {verb}" */
	verb?: string
	/** Ekstra tekst efter hjælpeteksten, fx modtageren */
	hint?: string
}) {
	const [progress, setProgress] = useState(0)
	const raf = useRef(0)
	const startedAt = useRef(0)
	const holding = progress > 0

	const stop = () => {
		cancelAnimationFrame(raf.current)
		startedAt.current = 0
		setProgress(0)
	}
	const start = () => {
		if (disabled || startedAt.current) return
		startedAt.current = performance.now()
		const tick = (now: number) => {
			const p = Math.min(1, (now - startedAt.current) / HOLD_MS)
			setProgress(p)
			if (p < 1) {
				raf.current = requestAnimationFrame(tick)
			} else {
				startedAt.current = 0
				setProgress(0)
				onConfirm()
			}
		}
		raf.current = requestAnimationFrame(tick)
	}
	useEffect(() => () => cancelAnimationFrame(raf.current), [])

	const R = 9
	const C = 2 * Math.PI * R
	const secondsLeft = Math.ceil((1 - progress) * (HOLD_MS / 1000))
	return (
		<div className="flex flex-col items-stretch gap-1.5 sm:items-end">
			<button
				type="button"
				disabled={disabled}
				onPointerDown={(e) => {
					if (e.button !== 0) return
					e.currentTarget.setPointerCapture?.(e.pointerId)
					start()
				}}
				onPointerUp={stop}
				onPointerCancel={stop}
				onLostPointerCapture={stop}
				onKeyDown={(e) => {
					if (e.key === ' ' || e.key === 'Enter') {
						e.preventDefault()
						if (!e.repeat) start()
					}
				}}
				onKeyUp={(e) => {
					if (e.key === ' ' || e.key === 'Enter') stop()
				}}
				onBlur={stop}
				// Ingen kontekstmenu/markering ved langt tryk på mobil
				onContextMenu={(e) => e.preventDefault()}
				aria-label={`${label}. Hold knappen nede i 3 sekunder for at ${verb}.`}
				className="bg-foreground text-background inline-flex touch-none items-center justify-center gap-2.5 rounded-full px-5 py-2.5 text-sm font-medium transition-opacity select-none [-webkit-touch-callout:none] hover:opacity-90 disabled:opacity-50"
			>
				<svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true" className="shrink-0 -rotate-90">
					<circle cx="11" cy="11" r={R} fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
					<circle
						cx="11"
						cy="11"
						r={R}
						fill="none"
						stroke="currentColor"
						strokeWidth="2.5"
						strokeLinecap="round"
						strokeDasharray={C}
						strokeDashoffset={C * (1 - progress)}
					/>
				</svg>
				<span className="whitespace-nowrap">{label}</span>
			</button>
			{/* Teksten under knappen skifter, så knappen selv ikke ændrer bredde */}
			<span className="text-center text-[11px] text-foreground/50 tabular-nums sm:text-right" aria-live="polite">
				{holding ? `Bliv ved med at holde … ${secondsLeft}` : `Hold knappen nede i 3 sekunder for at ${verb}${hint ? ` · ${hint}` : ''}`}
			</span>
		</div>
	)
}

export default function BuyHours({
	signedInAs,
	emphasis = false,
	label = 'Køb flere udviklingstimer',
}: {
	signedInAs?: string
	emphasis?: boolean
	/** Knapteksten; "Køb timer", når kunden ingen timer har endnu */
	label?: string
}) {
	const [open, setOpen] = useState(false)
	const [hours, setHours] = useState(hourPackages.start)
	const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
	const [error, setError] = useState('')
	const router = useRouter()

	useEffect(() => {
		if (!open) return
		const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
		document.addEventListener('keydown', onKey)
		return () => document.removeEventListener('keydown', onKey)
	}, [open])

	const { pricePerHour, min, max, tiers, presets, note } = hourPackages
	// Det genvejskort, skyderen står nærmest (lyser op, mens man trækker)
	const nearest = presets.reduce((best, p) => (Math.abs(p - hours) < Math.abs(best - hours) ? p : best), presets[0])
	const discount = hourDiscount(hours)
	const full = hours * pricePerHour
	const price = Math.round(full * (1 - discount))
	const saved = full - price
	// Næste rabattrin, så kunden kan se, hvad et par timer mere giver
	const next = tiers.find((t) => t.from > hours)
	const pick = { hours, discount }

	async function order() {
		setState('sending')
		setError('')
		try {
			const res = await fetch('/api/seo-task', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					// Serveren regner prisen og bygger opgaven + mails (src/lib/hourOrderMail.ts)
					order: { hours: pick.hours },
					from: signedInAs || brand.client,
					website: '',
				}),
			})
			const data = await res.json().catch(() => ({}))
			if (!res.ok) throw new Error(data?.error || 'Bestillingen kunne ikke sendes')
			setState('sent')
			// Henter siden igen, så bestillingen straks står på klippekortet (og under Kun Horizen → Klippekort)
			router.refresh()
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Bestillingen kunne ikke sendes')
			setState('error')
		}
	}

	return (
		<>
			<button
				type="button"
				onClick={() => {
					setOpen(true)
					setState('idle')
				}}
				className={
					emphasis
						? 'bg-foreground text-background mt-3 inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-opacity hover:opacity-85'
						: 'mt-2 text-xs font-medium text-foreground/70 underline underline-offset-2 hover:text-foreground'
				}
			>
				{label}
			</button>

			{/* Portal til <body>: kortene i dashboardet har effekter (transform/filter),
			    som ellers ville låse vinduet inde i kortet. */}
			{open &&
				typeof document !== 'undefined' &&
				createPortal(
					<div
						className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
						onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
						role="dialog"
						aria-modal="true"
						aria-labelledby="buy-hours-title"
					>
						<div className="w-full max-w-xl rounded-3xl bg-white p-6 text-left shadow-2xl sm:p-8" data-lenis-prevent>
							<div className="mb-6 flex items-start justify-between gap-4">
								<div>
									<p className="text-[11px] font-medium tracking-[0.14em] text-foreground/55 uppercase">Klippekort</p>
									<h2 id="buy-hours-title" className="font-display mt-1 text-2xl font-bold text-foreground">
										Køb udviklingstimer
									</h2>
									<p className="mt-1 text-sm text-foreground/60">
										Træk for at vælge antal timer. Fra 10 timer får I rabat. Højst {hourPackages.max} timer pr. bestilling.
									</p>
								</div>
								<button
									type="button"
									onClick={() => setOpen(false)}
									aria-label="Luk"
									className="rounded-full p-1 text-foreground/40 hover:text-foreground"
								>
									<svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
										<path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
									</svg>
								</button>
							</div>

							{state === 'sent' ? (
								<div
									className="rounded-2xl p-6 text-center"
									style={{
										backgroundColor: 'var(--st-done-bg)',
										color: 'var(--st-done-text)',
									}}
								>
									<p className="text-base font-semibold">Tak, bestillingen er sendt</p>
									<p className="mt-1 text-sm">
										Vi har modtaget jeres bestilling på {pick.hours} {pick.hours === 1 ? 'time' : 'timer'} og sender en faktura. Timerne
										kommer på klippekortet, så snart den er betalt, og kan bruges, når I har brug for dem.
									</p>

								</div>
							) : (
								<>
									{/* Genvejskort: viser rabatten med det samme; klik flytter skyderen */}
									<div className="mb-3 grid grid-cols-3 gap-3" role="group" aria-label="Hurtigvalg">
										{presets.map((p) => {
											const d = hourDiscount(p)
											const pPrice = Math.round(p * pricePerHour * (1 - d))
											const on = p === nearest
											return (
												<button
													key={p}
													type="button"
													onClick={() => setHours(p)}
													aria-pressed={hours === p}
													className={`relative rounded-2xl border p-3 text-left transition-colors sm:p-4 ${
														on ? 'border-foreground bg-foreground/[0.03]' : 'border-foreground/[0.1] hover:border-foreground/30'
													}`}
												>
													{d > 0 && (
														<span
															// Massiv grøn flade, så kortets ramme ikke skinner igennem mærket
															// (Andreas 19/11-2026). Virker i både lyst og mørkt tema.
															className="absolute -top-2.5 right-2 rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap"
															style={{
																backgroundColor: 'var(--st-done-text)',
																color: 'var(--color-background)',
															}}
														>
															Spar {Math.round(d * 100)} %
														</span>
													)}
													<span className="block text-xl font-bold text-foreground tabular-nums sm:text-2xl">
														{p} {p === 1 ? 'time' : 'timer'}
													</span>
													<span className="mt-0.5 block text-sm text-foreground/70">{kr(pPrice)}</span>
												</button>
											)
										})}
									</div>

									<div className="rounded-2xl border border-foreground/[0.1] p-5">
										<div className="flex items-end justify-between gap-4">
											<div>
												<span className="text-4xl font-bold text-foreground tabular-nums">{hours}</span>
												<span className="ml-1 text-lg text-foreground/60">{hours === 1 ? 'time' : 'timer'}</span>
											</div>
											<div className="text-right">
												<span className="block text-2xl font-bold text-foreground tabular-nums">{kr(price)}</span>
												{saved > 0 ? (
													<span className="text-xs text-foreground/50">
														<s>{kr(full)}</s> · {kr(Math.round(price / hours))}
														/time
													</span>
												) : (
													<span className="text-xs text-foreground/50">{kr(pricePerHour)}/time</span>
												)}
											</div>
										</div>

										<input
											type="range"
											min={min}
											max={max}
											step={1}
											value={hours}
											onChange={(e) => setHours(Number(e.target.value))}
											aria-label="Antal timer"
											aria-valuetext={`${hours} timer, ${kr(price)}`}
											className="mt-5 w-full cursor-pointer accent-[var(--st-done-text)]"
										/>
										{/* Rabattrin under skyderen */}
										<div className="relative mt-1 h-5 text-[11px] text-foreground/50">
											<span className="absolute left-0">{min} t</span>
											{tiers.map((t) => (
												<span
													key={t.from}
													className="absolute -translate-x-1/2 whitespace-nowrap"
													style={{
														left: `${((t.from - min) / (max - min)) * 100}%`,
														...(t.from === max ? { transform: 'translateX(-100%)' } : {}),
													}}
												>
													{t.from} t · −{Math.round(t.discount * 100)} %
												</span>
											))}
										</div>

										<div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
											{saved > 0 ? (
												<span
													className="rounded-full px-2.5 py-1 text-xs font-semibold"
													style={{
														backgroundColor: 'var(--st-done-bg)',
														color: 'var(--st-done-text)',
													}}
												>
													I sparer {kr(saved)} ({Math.round(discount * 100)} %)
												</span>
											) : null}
											{next && (
												<span className="text-xs text-foreground/55">
													Træk op til {next.from} timer, så sparer I {Math.round(next.discount * 100)} %.
												</span>
											)}
										</div>
									</div>

									<p className="mt-4 text-xs text-foreground/50">{note}</p>
									{state === 'error' && (
										<p className="mt-2 text-sm" style={{ color: 'var(--st-missing-text)' }}>
											{error}
										</p>
									)}

									<div className="mt-6 flex flex-col-reverse items-stretch justify-between gap-3 sm:flex-row sm:items-center">
										<a
											href="#v=opgaver&ny=1"
											onClick={() => setOpen(false)}
											className="text-sm text-foreground/60 underline underline-offset-2 hover:text-foreground"
										>
											Større opgave? Bed om et tidsoverslag
										</a>
										<HoldToConfirm
											disabled={state === 'sending'}
											onConfirm={order}
											label={
												state === 'sending' ? 'Sender …' : `Bestil ${pick.hours} ${pick.hours === 1 ? 'time' : 'timer'} · ${kr(price)}`
											}
										/>
									</div>
								</>
							)}
						</div>
					</div>,
					document.body,
				)}
		</>
	)
}
