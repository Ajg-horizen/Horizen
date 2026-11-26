'use client'

import { useState } from 'react'
import type { ChecklistPhase } from './data'
import { accent } from './_tokens'
import { STATUS_META } from './statusMeta'
import TabLink from './TabLink'

export type ChecklistDone = { stepId: string; doneAt: string; doneBy?: string }
export type ChecklistHistory = { month: string; done: number; total: number }

/**
 * Månedens tjekliste (Andreas 10/11-2026): den faste rute gennem den
 * månedlige gennemgang som én lodret tidslinje, samme stil som "Rækkefølgen"
 * på Strategi → Plan (ACP). Det næste trin er fremhævet ("Her er vi nu"),
 * færdige trin har flueben. Horizen sætter flueben (gemmes i Sanity via
 * POST /api/seo-checklist); kunden ser den samme liste uden at kunne ændre
 * den. Starter forfra den 3. i måneden (når Search Console-tallene er hentet).
 */
export default function MonthlyChecklist({
	month,
	monthLabel,
	phases,
	initialDone,
	editable,
	history,
}: {
	month: string
	monthLabel: string
	phases: ChecklistPhase[]
	initialDone: ChecklistDone[]
	editable: boolean
	/** Ikke vist (Andreas 15/11-2026: intet tidsestimat for nu). */
	hours?: string
	history: ChecklistHistory[]
}) {
	const [done, setDone] = useState<Record<string, ChecklistDone>>(
		Object.fromEntries(initialDone.map((d) => [d.stepId, d])),
	)
	const [busy, setBusy] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)

	const steps = phases.flatMap((p) => p.steps.map((s) => ({ ...s, phase: p.title })))
	const doneCount = steps.filter((s) => done[s.id]).length
	const pct = steps.length ? Math.round((doneCount / steps.length) * 100) : 0
	const currentId = steps.find((s) => !done[s.id])?.id

	async function toggle(stepId: string) {
		if (!editable || busy) return
		const next = !done[stepId]
		const before = done
		setBusy(stepId)
		setError(null)
		setDone((d) => {
			const copy = { ...d }
			if (next) copy[stepId] = { stepId, doneAt: new Date().toISOString() }
			else delete copy[stepId]
			return copy
		})
		try {
			const res = await fetch('/api/seo-checklist', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ month, stepId, done: next }),
			})
			if (!res.ok) {
				const j = (await res.json().catch(() => ({}))) as { error?: string }
				throw new Error(j.error || 'Kunne ikke gemme')
			}
		} catch (err) {
			setDone(before)
			setError(err instanceof Error ? err.message : 'Kunne ikke gemme')
		} finally {
			setBusy(null)
		}
	}

	return (
		<div>
			{/* Fremdrift for måneden */}
			<div className="border-foreground/[0.08] mb-8 rounded-2xl border bg-white p-5 md:p-6">
				<div className="flex flex-wrap items-baseline justify-between gap-3">
					<h3 className="text-foreground text-base font-medium tracking-[-0.01em]">{monthLabel}</h3>
					<span className="text-foreground/55 text-[11px] font-medium tracking-[0.14em] uppercase">
						{doneCount} af {steps.length} trin
					</span>
				</div>
				<div className="bg-foreground/10 mt-4 h-1.5 overflow-hidden rounded-full" aria-hidden>
					<div
						className="h-full rounded-full transition-all"
						style={{ width: `${pct}%`, backgroundColor: STATUS_META.done.dot }}
					/>
				</div>
				<p className="text-muted mt-4 text-sm leading-relaxed">
					Hver måned går vi den samme rute igennem fra top til bund, så intet bliver glemt. Listen starter forfra den 3. i måneden, når månedens tal fra Google er hentet.
					{!editable && ' Fluebenene sættes af Horizen, når et trin er gennemført.'}
				</p>
				{error && <p className="mt-3 text-sm" style={{ color: STATUS_META.missing.text }}>{error}</p>}
			</div>

			{/* Tidslinjen */}
			<ol className="relative">
				{steps.map((s, i) => {
					const d = done[s.id]
					const current = s.id === currentId
					const last = i === steps.length - 1
					const newPhase = i === 0 || steps[i - 1].phase !== s.phase
					return (
						<li key={s.id} className="relative flex gap-4 pb-4 md:gap-6">
							<div className="flex shrink-0 flex-col items-center">
								<span
									className="relative z-10 flex size-9 items-center justify-center rounded-full text-sm font-semibold tabular-nums"
									style={
										d
											? { backgroundColor: STATUS_META.done.dot, color: 'var(--color-background)' }
											: current
												? { backgroundColor: accent, color: 'var(--color-background)' }
												: { border: '1px solid var(--color-foreground)', opacity: 0.35 }
									}
								>
									{d ? '✓' : i + 1}
								</span>
								{!last && <span aria-hidden className="bg-foreground/10 mt-1 w-px flex-1" />}
							</div>

							<div
								className="border-foreground/[0.08] mb-2 flex-1 rounded-2xl border bg-white p-5 md:p-6"
								style={
									current
										? { borderColor: accent, boxShadow: `0 0 0 1px ${accent}` }
										: d
											? { opacity: 0.7 }
											: undefined
								}
							>
								<div className="flex flex-wrap items-center gap-x-3 gap-y-1">
									<h3 className="text-foreground text-base font-medium tracking-[-0.01em]">{s.title}</h3>
									<span className="text-foreground/55 text-[11px] font-medium tracking-[0.14em] uppercase">
										{newPhase ? `${s.phase}${s.quarterly || s.yearlyMonth ? ' · ' : ''}` : ''}
										{s.quarterly ? 'Hver 3. måned' : s.yearlyMonth ? 'Én gang om året' : ''}
									</span>
									{current && (
										<span className="border-foreground/10 text-foreground inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium">
											<span aria-hidden className="size-1.5 rounded-full" style={{ backgroundColor: accent }} />
											Her er vi nu
										</span>
									)}
								</div>

								<div className="mt-4 grid gap-4 md:grid-cols-[1.4fr_1fr]">
									<p className="text-muted text-sm leading-relaxed">{s.description}</p>

									<button
										type="button"
										onClick={() => toggle(s.id)}
										disabled={!editable || busy === s.id}
										aria-pressed={!!d}
										aria-label={d ? `Fjern flueben: ${s.title}` : `Sæt flueben: ${s.title}`}
										className={`flex items-start gap-3 self-start rounded-xl p-3 text-left text-sm ${
											editable ? 'cursor-pointer hover:opacity-90' : 'cursor-default'
										}`}
										style={{
											backgroundColor: d
												? STATUS_META.done.bg
												: 'color-mix(in srgb, var(--color-foreground) 4%, transparent)',
											color: d ? STATUS_META.done.text : undefined,
										}}
									>
										<span
											aria-hidden
											className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border text-[10px]"
											style={{ borderColor: d ? STATUS_META.done.dot : 'var(--color-muted)' }}
										>
											{d && '✓'}
										</span>
										<span>
											<span className="text-foreground/55 block text-[11px] font-medium tracking-[0.14em] uppercase">
												{d ? 'Gennemført' : 'Checkpoint'}
											</span>
											<span className="text-foreground">
												{/* Ingen dato (Andreas 23/11-2026): datoen er klik-datoen, ikke den dag,
												    arbejdet blev gjort, så den kan være misvisende. Hvornår står i aktivitetsloggen. */}
												{d
													? 'Trinnet er gennemgået'
													: editable
														? 'Markér som gennemført'
														: 'Ikke gennemført endnu'}
											</span>
										</span>
									</button>
								</div>
							</div>
						</li>
					)
				})}
			</ol>

			{history.length > 0 && (
				<div className="mt-10">
					<h4 className="text-foreground mb-3 text-base font-medium">Tidligere måneder</h4>
					<ul className="text-muted space-y-1 text-sm">
						{history.map((h) => (
							<li key={h.month}>
								{h.month}: {h.done} af {h.total} trin gennemført
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	)
}

/**
 * Lille udgave af månedens tjekliste til Overblik (Andreas 10/11-2026: "ret
 * meget in my face"): fremdrift, næste trin og en påmindelse, når en ny måned
 * er startet. Knappen fører til Strategi → Løbende drift.
 */
export function ChecklistCard({
	monthLabel,
	phases,
	done,
	nextStart,
}: {
	monthLabel: string
	phases: ChecklistPhase[]
	done: ChecklistDone[]
	/** Ikke vist (Andreas 15/11-2026: intet tidsestimat for nu). */
	hours?: string
	nextStart: string
}) {
	const ids = new Set(done.map((d) => d.stepId))
	const steps = phases.flatMap((p) => p.steps)
	const doneCount = steps.filter((s) => ids.has(s.id)).length
	const pct = steps.length ? Math.round((doneCount / steps.length) * 100) : 0
	const nextIndex = steps.findIndex((s) => !ids.has(s.id))
	const next = nextIndex >= 0 ? steps[nextIndex] : null
	const status =
		doneCount === 0
			? 'Ny måned: gennemgangen venter'
			: next
				? 'Gennemgangen er i gang'
				: `Alt gennemført for ${monthLabel.toLowerCase()}`

	return (
		<div
			className="border-foreground/[0.08] rounded-3xl border bg-white p-5 md:p-6"
			style={doneCount === 0 ? { borderColor: accent, boxShadow: `0 0 0 1px ${accent}` } : undefined}
		>
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<span className="text-foreground/55 text-[11px] font-medium tracking-[0.14em] uppercase">
						Månedens tjekliste · {monthLabel}
					</span>
					<h3 className="text-foreground mt-1 flex items-center gap-2 text-lg font-medium tracking-[-0.01em]">
						{doneCount === 0 && <span aria-hidden className="size-2 rounded-full" style={{ backgroundColor: accent }} />}
						{status}
					</h3>
				</div>
				<TabLink to={{ v: 'projekt', s: 'drift' }}>Åbn tjeklisten</TabLink>
			</div>

			<div className="bg-foreground/10 mt-4 h-1.5 overflow-hidden rounded-full" aria-hidden>
				<div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: STATUS_META.done.dot }} />
			</div>

			<div className="text-muted mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 text-sm">
				<span>
					{doneCount} af {steps.length} trin
					{next && (
						<>
							{' · '}
							<span className="text-foreground">
								Næste: {nextIndex + 1}. {next.title}
							</span>
						</>
					)}
				</span>
				<span>Starter forfra {nextStart}</span>
			</div>
		</div>
	)
}
