'use client'

import { useMemo, useState } from 'react'
import { accent } from './_tokens'
import { STATUS_META } from './statusMeta'
import {
	DIRECTORY_INTERVAL_MONTHS,
	DIRECTORY_WHO,
	PLUS_MAIL_HINT,
	directoryChecklist,
	directoryChangeNote,
	directoryIntro,
	type DirectoryStep,
	type DirectoryWho,
} from './directories'

/** Farve pr. ansvar: "I skal selv" er gul, så den springer i øjnene. */
const WHO_STYLE: Record<DirectoryWho, { dot: string; bg: string; text: string; border: string }> = {
	horizen: {
		dot: STATUS_META.done.dot,
		bg: 'transparent',
		text: 'var(--color-foreground)',
		border: 'color-mix(in srgb, var(--color-foreground) 12%, transparent)',
	},
	adgang: {
		dot: 'var(--color-muted)',
		bg: 'transparent',
		text: 'var(--color-foreground)',
		border: 'color-mix(in srgb, var(--color-foreground) 12%, transparent)',
	},
	verificer: {
		dot: 'var(--color-muted)',
		bg: 'transparent',
		text: 'var(--color-foreground)',
		border: 'color-mix(in srgb, var(--color-foreground) 12%, transparent)',
	},
	kunde: {
		dot: STATUS_META.partial.dot,
		bg: STATUS_META.partial.bg,
		text: STATUS_META.partial.text,
		border: STATUS_META.partial.border,
	},
}

/** Forklaringen på hvert mærke (Andreas 23/11-2026: "ellers forstår jeg det ikke"). */
const WHO_EXPLAIN: Record<DirectoryWho, string> = {
	horizen:
		'Vi gør det hele, og I skal ikke foretage jer noget. Fx de små kataloger som Hotfrog og Infobel, hvor vi selv opretter profilen.',
	adgang:
		'Vi gør arbejdet, når I har givet os adgang til en konto, I selv ejer (fx jeres Facebook-side eller Google-profil). I beholder ejerskabet; vi bliver bare administrator.',
	verificer:
		'Vi gør arbejdet, men stedet skal have bekræftet, at det er jer. Det er typisk en kode, der kommer på jeres telefon eller mail, som I sender videre til os. Hvad der skal verificeres, står ved hvert punkt under "Det skal I bidrage med".',
	kunde:
		'Kun I kan gøre det, fordi det kræver jeres MitID, et login kun I har (fx CVR på virk.dk) eller jeres tid (mødet). Vi fortæller jer præcis, hvad der skal gøres.',
}

function WhoChip({ who }: { who: DirectoryWho }) {
	const st = WHO_STYLE[who]
	return (
		<span
			className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium"
			style={{ backgroundColor: st.bg, color: st.text, borderColor: st.border }}
		>
			<span aria-hidden className="size-1.5 rounded-full" style={{ backgroundColor: st.dot }} />
			{DIRECTORY_WHO[who].label}
		</span>
	)
}

export type DirectoryMark = { stepId: string; status: 'done' | 'skip'; at: string; by?: string }

type State = 'open' | 'due' | 'done' | 'skip'

function addMonths(iso: string, months: number) {
	const d = new Date(iso)
	d.setMonth(d.getMonth() + months)
	return d
}

function formatDay(d: Date) {
	return d.toLocaleDateString('da-DK', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Copenhagen' })
}

function stateOf(mark: DirectoryMark | undefined, now: number): State {
	if (!mark) return 'open'
	if (mark.status === 'skip') return 'skip'
	return addMonths(mark.at, DIRECTORY_INTERVAL_MONTHS).getTime() > now ? 'done' : 'due'
}

/**
 * Profiler og kataloger (Andreas 23/11-2026): én lang rute i rækkefølge, som
 * gennemgås ved opstart af en ny kunde og derefter én gang om året. Et flueben
 * gælder i DIRECTORY_INTERVAL_MONTHS måneder og står derefter som "Skal tjekkes igen". Punkter, der
 * ikke passer til kunden, markeres "Ikke relevant" og tæller ikke med.
 * Horizen sætter flueben (POST /api/seo-directories); kunden ser listen uden
 * at kunne ændre den.
 */
export default function DirectoryChecklist({
	initial,
	editable,
}: {
	initial: DirectoryMark[]
	editable: boolean
}) {
	const [marks, setMarks] = useState<Record<string, DirectoryMark>>(
		Object.fromEntries(initial.map((m) => [m.stepId, m])),
	)
	const [busy, setBusy] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)
	// "Her har vi brug for jeres hjælp" (Andreas 23/11-2026): dagsordenen til mødet med kunden. Aldrig "Kun det, I skal …", det lyder hovent
	const [onlyClient, setOnlyClient] = useState(false)
	const now = useMemo(() => Date.now(), [])

	const steps = directoryChecklist.flatMap((p) => p.steps)
	const states = Object.fromEntries(steps.map((s) => [s.id, stateOf(marks[s.id], now)])) as Record<string, State>
	const relevant = steps.filter((s) => states[s.id] !== 'skip')
	const doneCount = relevant.filter((s) => states[s.id] === 'done').length
	const dueCount = relevant.filter((s) => states[s.id] === 'due').length
	const pct = relevant.length ? Math.round((doneCount / relevant.length) * 100) : 0
	const currentId = steps.find((s) => states[s.id] === 'open' || states[s.id] === 'due')?.id
	const nextRound = (() => {
		const dates = relevant
			.map((s) => marks[s.id])
			.filter((m): m is DirectoryMark => m?.status === 'done')
			.map((m) => addMonths(m.at, DIRECTORY_INTERVAL_MONTHS).getTime())
		return dates.length ? new Date(Math.min(...dates)) : null
	})()

	const status =
		doneCount === 0 && dueCount === 0
			? 'Ikke startet endnu'
			: dueCount > 0
				? `${dueCount} ${dueCount === 1 ? 'punkt skal' : 'punkter skal'} tjekkes igen`
				: doneCount === relevant.length
					? 'Alle profiler er på plads'
					: 'Gennemgangen er i gang'

	async function save(stepId: string, next: 'done' | 'skip' | 'open') {
		if (!editable || busy) return
		const before = marks
		setBusy(stepId)
		setError(null)
		setMarks((m) => {
			const copy = { ...m }
			if (next === 'open') delete copy[stepId]
			else copy[stepId] = { stepId, status: next, at: new Date().toISOString() }
			return copy
		})
		try {
			const res = await fetch('/api/seo-directories', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ stepId, status: next }),
			})
			if (!res.ok) {
				const j = (await res.json().catch(() => ({}))) as { error?: string }
				throw new Error(j.error || 'Kunne ikke gemme')
			}
		} catch (err) {
			setMarks(before)
			setError(err instanceof Error ? err.message : 'Kunne ikke gemme')
		} finally {
			setBusy(null)
		}
	}

	const numberOf = Object.fromEntries(steps.map((s, i) => [s.id, i + 1]))
	const clientSteps = relevant.filter((s) => s.who !== 'horizen')
	const shown = (s: DirectoryStep) => !onlyClient || (s.who !== 'horizen' && states[s.id] !== 'skip')
	return (
		<div>
			{/* Visning: hele listen eller kun kundens dagsorden (Andreas 23/11-2026: skal kunne ses tydeligt) */}
			<div
				className="mb-6 inline-flex flex-wrap gap-1 rounded-full border p-1"
				style={{ borderColor: 'color-mix(in srgb, var(--color-foreground) 15%, transparent)' }}
				role="group"
				aria-label="Vis punkter"
			>
				{[
					{ on: false, label: `Hele listen (${relevant.length})` },
					{ on: true, label: `Her har vi brug for jeres hjælp (${clientSteps.length})` },
				].map((b) => {
					const active = onlyClient === b.on
					return (
						<button
							key={b.label}
							type="button"
							onClick={() => setOnlyClient(b.on)}
							aria-pressed={active}
							className="cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition"
							style={
								active
									? { backgroundColor: accent, color: 'var(--color-background)' }
									: { color: 'var(--color-muted)' }
							}
						>
							{active && <span aria-hidden>✓ </span>}
							{b.label}
						</button>
					)
				})}
			</div>

			{onlyClient && (
				<div
					className="mb-8 rounded-2xl border p-5 md:p-6"
					style={{ backgroundColor: STATUS_META.partial.bg, borderColor: STATUS_META.partial.border, color: STATUS_META.partial.text }}
				>
					<h3 className="text-base font-medium tracking-[-0.01em]">
						Her har vi brug for jeres hjælp ({clientSteps.length} punkter)
					</h3>
					<p className="mt-2 max-w-3xl text-sm leading-relaxed">
						Her står kun de punkter, hvor I skal være med: give os adgang, sende os en kode eller gøre noget med jeres
						MitID. Ved hvert punkt står præcis hvad. Det meste klarer vi sammen på mødet på 20 minutter.{' '}
						{relevant.length - clientSteps.length} punkter, som Horizen klarer alene, er skjult.
					</p>
					<button
						type="button"
						onClick={() => setOnlyClient(false)}
						className="mt-3 cursor-pointer text-sm font-medium underline underline-offset-2"
					>
						Vis hele listen igen
					</button>
				</div>
			)}

			{!onlyClient && (
			<div
				className="border-foreground/[0.08] mb-8 rounded-2xl border bg-white p-5 md:p-6"
				style={dueCount > 0 ? { borderColor: STATUS_META.partial.dot, boxShadow: `0 0 0 1px ${STATUS_META.partial.dot}` } : undefined}
			>
				<div className="flex flex-wrap items-baseline justify-between gap-3">
					<h3 className="text-foreground text-base font-medium tracking-[-0.01em]">{status}</h3>
					<span className="text-foreground/55 text-[11px] font-medium tracking-[0.14em] uppercase">
						{doneCount} af {relevant.length} på plads
					</span>
				</div>
				<div className="bg-foreground/10 mt-4 h-1.5 overflow-hidden rounded-full" aria-hidden>
					<div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: STATUS_META.done.dot }} />
				</div>
				<p className="text-muted mt-4 max-w-3xl text-sm leading-relaxed">{directoryIntro}</p>
				<div className="text-muted mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
					<span>Gennemgås ved opstart og derefter én gang om året</span>
					{nextRound && <span className="text-foreground">Næste tjek: {formatDay(nextRound)}</span>}
					{steps.length - relevant.length > 0 && <span>{steps.length - relevant.length} ikke relevante for jer</span>}
				</div>
				<p className="text-foreground mt-3 max-w-3xl text-sm">{directoryChangeNote}</p>
				<div className="border-foreground/[0.08] mt-5 border-t pt-5">
					<h4 className="text-foreground text-sm font-medium">Sådan læser du mærkerne</h4>
					<ul className="mt-3 space-y-3">
						{(['horizen', 'adgang', 'verificer', 'kunde'] as DirectoryWho[]).map((w) => {
							const count = relevant.filter((s) => s.who === w).length
							return (
								<li key={w} className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:gap-4">
									<span className="shrink-0 sm:w-64">
										<WhoChip who={w} />
									</span>
									<span className="text-muted text-sm leading-relaxed">
										<span className="text-foreground font-medium">
											{count} {count === 1 ? 'punkt' : 'punkter'}.
										</span>{' '}
										{WHO_EXPLAIN[w]}
									</span>
								</li>
							)
						})}
						{editable && (
							<li className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:gap-4">
								<span className="shrink-0 sm:w-64">
									<span className="border-foreground/10 text-foreground inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium">
										<span aria-hidden className="font-semibold">+</span> mail
									</span>
								</span>
								<span className="text-muted text-sm leading-relaxed">
									<span className="text-foreground font-medium">Kun for Horizen.</span> Fortæller, hvordan
									kontoen oprettes, ikke hvem der gør arbejdet. Vi opretter kontoen med vores profil-mail og
									kundens navn efter et plustegn (fx profiler+kunde@horizen.dk). Alt lander i vores
									almindelige indbakke, men stedet ser en ny adresse pr. kunde. Kunden skal ikke oprette
									en mail. Står "+ mail" sammen med "I skal verificere", opretter vi kontoen, og
									kunden sender os bare den kode, stedet sender til deres telefon.
								</span>
							</li>
						)}
					</ul>
				</div>
				{!editable && <p className="text-muted mt-3 text-sm">Fluebenene sættes af Horizen, når et punkt er gjort.</p>}
				{error && <p className="mt-3 text-sm" style={{ color: STATUS_META.missing.text }}>{error}</p>}
			</div>
			)}

			<div className="space-y-10">
				{directoryChecklist.map((phase) => {
					const visible = phase.steps.filter(shown)
					if (visible.length === 0) return null
					const phaseRelevant = visible.filter((s) => states[s.id] !== 'skip')
					const phaseDone = phaseRelevant.filter((s) => states[s.id] === 'done').length
					return (
						<section key={phase.title}>
							<div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
								<h3 className="text-foreground text-lg font-medium tracking-[-0.01em]">{phase.title}</h3>
								<span className="text-foreground/55 text-[11px] font-medium tracking-[0.14em] uppercase">
									{phaseDone} af {phaseRelevant.length}
								</span>
							</div>
							{phase.intro && <p className="text-muted mb-3 text-sm">{phase.intro}</p>}
							<ol className="divide-foreground/[0.06] border-foreground/[0.08] divide-y rounded-2xl border bg-white">
								{visible.map((s) => {
									return (
										<StepRow
											key={s.id}
											number={numberOf[s.id]}
											step={s}
											state={states[s.id]}
											mark={marks[s.id]}
											current={s.id === currentId}
											editable={editable}
											busy={busy === s.id}
											onSave={(next) => save(s.id, next)}
										/>
									)
								})}
							</ol>
						</section>
					)
				})}
			</div>
		</div>
	)
}

function StepRow({
	number,
	step,
	state,
	mark,
	current,
	editable,
	busy,
	onSave,
}: {
	number: number
	step: DirectoryStep
	state: State
	mark?: DirectoryMark
	current: boolean
	editable: boolean
	busy: boolean
	onSave: (next: 'done' | 'skip' | 'open') => void
}) {
	const done = state === 'done'
	const due = state === 'due'
	const skip = state === 'skip'
	const circle = done
		? { backgroundColor: STATUS_META.done.dot, color: 'var(--color-background)' }
		: due
			? { backgroundColor: STATUS_META.partial.dot, color: 'var(--color-background)' }
			: current
				? { backgroundColor: accent, color: 'var(--color-background)' }
				: { border: '1px solid var(--color-foreground)', opacity: 0.35 }

	// Ingen dato ved afkrydsede punkter (Andreas 23/11-2026: "for mit vedkommende ligegyldigt").
	// Datoen gemmes stadig, så punktet kan blive "Skal tjekkes igen" efter et år.
	const statusText = done
		? 'Gjort'
		: due
			? 'Skal tjekkes igen'
			: skip
				? 'Ikke relevant'
				: editable
					? 'Markér som gjort'
					: 'Ikke gjort endnu'

	return (
		<li
			className="flex gap-4 p-4 md:p-5"
			style={
				current
					? { boxShadow: `inset 3px 0 0 ${accent}` }
					: skip
						? { opacity: 0.45 }
						: done
							? { opacity: 0.75 }
							: undefined
			}
		>
			<span
				className="flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold tabular-nums"
				style={skip ? { border: '1px dashed var(--color-foreground)', opacity: 0.35 } : circle}
				aria-hidden
			>
				{done ? '✓' : skip ? '–' : number}
			</span>

			<div className="min-w-0 flex-1">
				<div className="flex flex-wrap items-center gap-x-3 gap-y-1">
					<span className="text-foreground text-base font-medium" style={skip ? { textDecoration: 'line-through' } : undefined}>
						{step.title}
					</span>
					<WhoChip who={step.who} />
					{editable && step.plusMail && (
						<span
							title={PLUS_MAIL_HINT}
							className="border-foreground/10 text-foreground inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium"
						>
							<span aria-hidden className="font-semibold">+</span> mail
						</span>
					)}
					{step.forWhom && (
						<span className="border-foreground/10 text-foreground/60 rounded-full border px-2 py-0.5 text-[11px]">
							{step.forWhom}
						</span>
					)}
					{current && (
						<span className="border-foreground/10 text-foreground inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium">
							<span aria-hidden className="size-1.5 rounded-full" style={{ backgroundColor: accent }} />
							Her er vi nu
						</span>
					)}
				</div>
				<p className="text-muted mt-1.5 max-w-3xl text-sm leading-relaxed">{step.description}</p>
				{step.clientPart && (
					<p className="text-foreground mt-1.5 max-w-3xl text-sm">
						<span className="font-medium">{step.who === 'kunde' ? 'Det skal I gøre:' : 'Det skal I bidrage med:'}</span>{' '}
						{step.clientPart}.
					</p>
				)}
				{editable && step.plusMail && (
					<p className="text-muted mt-1.5 max-w-3xl text-xs">
						<span className="text-foreground font-medium">Anvendes plus-mail her:</span> {PLUS_MAIL_HINT}
					</p>
				)}
				{editable && step.url && (
					<a
						href={step.url}
						target="_blank"
						rel="noopener noreferrer"
						className="text-foreground/70 hover:text-foreground mt-2 inline-block text-xs underline underline-offset-2"
					>
						{step.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')} ↗
					</a>
				)}
			</div>

			<div className="flex shrink-0 flex-col items-end gap-2">
				<button
					type="button"
					onClick={() => onSave(done ? 'open' : 'done')}
					disabled={!editable || busy || skip}
					aria-pressed={done}
					aria-label={done ? `Fjern flueben: ${step.title}` : `Sæt flueben: ${step.title}`}
					className={`flex max-w-[15rem] items-start gap-2 rounded-xl px-3 py-2 text-left text-xs ${
						editable && !skip ? 'cursor-pointer hover:opacity-90' : 'cursor-default'
					}`}
					style={{
						backgroundColor: done
							? STATUS_META.done.bg
							: due
								? STATUS_META.partial.bg
								: 'color-mix(in srgb, var(--color-foreground) 4%, transparent)',
						color: done ? STATUS_META.done.text : due ? STATUS_META.partial.text : undefined,
					}}
				>
					<span
						aria-hidden
						className="mt-px flex size-3.5 shrink-0 items-center justify-center rounded border text-[9px]"
						style={{ borderColor: done ? STATUS_META.done.dot : 'var(--color-muted)' }}
					>
						{done && '✓'}
					</span>
					<span>{statusText}</span>
				</button>
				{editable && !done && (
					<button
						type="button"
						onClick={() => onSave(skip ? 'open' : 'skip')}
						disabled={busy}
						className="text-foreground/50 hover:text-foreground cursor-pointer text-[11px] underline underline-offset-2"
					>
						{skip ? 'Gør relevant igen' : 'Ikke relevant'}
					</button>
				)}
			</div>
		</li>
	)
}
