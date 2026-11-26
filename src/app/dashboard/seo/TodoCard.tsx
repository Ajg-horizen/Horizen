'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { ClientTodo } from './data'

export type LinkNote = { label: string; text: string }
export type TodoDone = { note: string; by: string; at: string; consent?: boolean; linkNotes?: LinkNote[] }
/** Kunden har set opgaven og lagt den på sin to-do-liste (Andreas 16/11-2026). */
export type TodoSeen = { by: string; at: string }

const STATUS = {
	bg: 'var(--st-done-bg)',
	border: 'var(--st-done-border)',
	text: 'var(--st-done-text)',
	dot: 'var(--st-done-dot)',
}

const fmtDate = (iso: string) =>
	new Date(iso).toLocaleDateString('da-DK', { day: 'numeric', month: 'long', year: 'numeric' })

/** Knap og status pr. opgavetype (Andreas 16/11-2026). */
const TODO_KINDS = {
	handling: { button: 'Det er gjort', status: 'Gjort' },
	// Kun til orientering: "Set" lukker den helt (Andreas 16/11-2026)
	laes: { button: 'Set', status: 'Set' },
	godkend: { button: 'Godkendt', status: 'Godkendt' },
} as const

/**
 * Ét foldbart kort i Indbakken (Andreas 15/11 + 16/11-2026): hvorfor
 * opgaven er vigtig, hvad vi har gjort klar, og en knap efter opgavens type.
 * Markeringen gemmes i Sanity (POST /api/seo-todo), så Horizen kan se datoen
 * og følge op. "Fortryd" sletter den igen. Farverne følger dashboardets lyse
 * og mørke tema.
 *
 * En ny opgave (ikke set endnu) står under "Nye opgaver" med knappen "Set, læg
 * på min liste". Så flytter den til Opgaver → "Jeres opgaver", hvor datoen for "Set"
 * vises (Andreas 16/11-2026). Opgaver til orientering lukkes helt med "Set".
 */
export default function TodoCard({
	todo,
	index,
	done: initial,
	seen,
}: {
	todo: ClientTodo
	index: number
	done?: TodoDone
	seen?: TodoSeen
}) {
	const router = useRouter()
	const [done, setDone] = useState(initial)
	const [note, setNote] = useState(initial?.note ?? '')
	const [state, setState] = useState<'idle' | 'saving' | 'error'>('idle')
	const [copied, setCopied] = useState(false)
	const [consent, setConsent] = useState(initial?.consent ?? false)
	// Et lille svarfelt pr. link, fx pr. afsnit, der skal godkendes (Andreas 15/11-2026)
	const [linkNotes, setLinkNotes] = useState<Record<string, string>>(() =>
		Object.fromEntries((initial?.linkNotes ?? []).map((n) => [n.label, n.text])),
	)
	const filledLinkNotes = (todo.links ?? [])
		.filter((l) => l.ask && linkNotes[l.label]?.trim())
		.map((l) => ({ label: l.label, text: linkNotes[l.label].trim() }))
	const isDone = Boolean(done || todo.closed)
	// Udfyldt kontaktinfo kræver fluebenet om tilladelse (Andreas 15/11-2026)
	const needsConsent = Boolean(todo.noteConsent && note.trim() && !consent)

	async function save(markDone: boolean) {
		setState('saving')
		try {
			const res = await fetch('/api/seo-todo', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					id: todo.id,
					done: markDone,
					note,
					consent: Boolean(todo.noteConsent && consent),
					linkNotes: filledLinkNotes,
				}),
			})
			const data = (await res.json()) as { done?: TodoDone | null }
			if (!res.ok) throw new Error()
			setDone(data.done ?? undefined)
			setState('idle')
			// Hent siden igen, så tallet i menuen, "X opgaver venter på dig" og
			// bjælken på Overblik følger med med det samme (Andreas 15/11-2026)
			router.refresh()
		} catch {
			setState('error')
		}
	}

	// Ny opgave set: læg den på to-do-listen (Andreas 16/11-2026)
	async function markSeen() {
		setState('saving')
		try {
			const res = await fetch('/api/seo-todo', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id: todo.id, seen: true }),
			})
			if (!res.ok) throw new Error()
			setState('idle')
			router.refresh()
		} catch {
			setState('error')
		}
	}

	async function copy() {
		if (!todo.copyText) return
		try {
			await navigator.clipboard.writeText(todo.copyText.text)
			setCopied(true)
			setTimeout(() => setCopied(false), 2500)
		} catch {
			setCopied(false)
		}
	}

	// Knap og status efter opgavens type (Andreas 16/11-2026)
	const kind = TODO_KINDS[todo.kind ?? 'handling']
	// Ny = endnu ikke set og ikke klaret. Orienteringer lukkes direkte med "Set".
	const isNew = !isDone && !seen
	const toList = isNew && todo.kind !== 'laes'
	// Klarede vises som en diskret historik-række med datoen synlig (Andreas 16/11-2026)
	const doneDate = isDone ? fmtDate(todo.closed?.date ?? done!.at) : ''

	return (
		<li
			className={cn(
				'border border-foreground/[0.08] bg-white',
				isDone ? 'rounded-2xl opacity-85' : 'rounded-3xl',
			)}
		>
			{/* Foldbar som Spørgsmål (Andreas 16/11-2026): sammenfoldet ses kun
			    område, status og opgaven; ét åbent ad gangen (fælles name). */}
			<details name="todo" className="group">
			<summary
				className={cn(
					'flex cursor-pointer list-none items-start gap-3 [&::-webkit-details-marker]:hidden',
					isDone ? 'px-4 py-3 md:px-5' : 'p-5 md:p-6',
				)}
			>
				<span
					className={cn(
						'flex shrink-0 items-center justify-center rounded-full font-medium',
						isDone ? 'h-6 w-6 text-xs' : 'h-7 w-7 text-sm',
					)}
					style={
						isDone
							? { backgroundColor: STATUS.bg, color: STATUS.text, border: `1px solid ${STATUS.border}` }
							: { backgroundColor: 'color-mix(in srgb, var(--color-foreground) 6%, transparent)' }
					}
				>
					{isDone ? (
						<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-label={kind.status}>
							<path d="M5 12.5 10 17 19 7" />
						</svg>
					) : (
						index + 1
					)}
				</span>
				<span className="min-w-0 flex-1">
					<span className="flex flex-wrap items-center gap-x-3 gap-y-1">
						<span className="text-xs font-medium tracking-[0.14em] text-foreground/50 uppercase">{todo.area}</span>
						<span className="flex items-center gap-1.5 text-xs text-foreground/55">
							<span
								className="h-1.5 w-1.5 rounded-full"
								style={{
									backgroundColor: isDone
										? 'color-mix(in srgb, var(--color-foreground) 30%, transparent)'
										: 'var(--st-partial-dot)',
								}}
							/>
							{isDone ? `${kind.status} ${doneDate}` : isNew ? 'Ny' : 'På din liste'}
						</span>
					</span>
					<span
						className={cn(
							'block leading-snug',
							isDone ? 'mt-1 text-sm text-foreground/70' : 'mt-1.5 text-base font-medium text-foreground',
						)}
					>
						{todo.title}
					</span>
				</span>
				<svg
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-hidden
					className="mt-1 shrink-0 text-foreground/45 transition-transform group-open:rotate-180"
				>
					<path d="m6 9 6 6 6-6" />
				</svg>
			</summary>
			<div className={isDone ? 'px-4 pb-4 md:px-5' : 'px-5 pb-5 md:px-6 md:pb-6'}>
			<p className="text-foreground/40 text-xs">
				Sendt {fmtDate(todo.askedAt)}
				{seen && ` · Set ${fmtDate(seen.at)}`}
			</p>

			{!isDone && (
				<>
					{/* Hvorfor: lyseblå boks, så begrundelsen skiller sig ud fra
					    trinene (Andreas 15/11-2026) */}
					<div
						className="mt-4 flex gap-3 rounded-2xl border p-4"
						style={{ backgroundColor: 'var(--st-info-bg)', borderColor: 'var(--st-info-border)' }}
					>
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden
							className="mt-0.5 shrink-0"
							style={{ color: 'var(--st-info-text)' }}
						>
							<circle cx="12" cy="12" r="9" />
							<path d="M12 11v5M12 8h.01" />
						</svg>
						<div>
							<p className="text-xs font-semibold tracking-[0.14em] uppercase" style={{ color: 'var(--st-info-text)' }}>
								Derfor er det vigtigt
							</p>
							<p className="mt-1.5 text-sm leading-relaxed text-foreground/90">{todo.why}</p>
						</div>
					</div>

					{todo.steps && todo.steps.length > 0 && (
						<div className="mt-5">
							<p className="text-xs font-semibold tracking-[0.14em] text-foreground/60 uppercase">Sådan gør du</p>
							<ol className="mt-3 space-y-3">
								{todo.steps.map((s, i) => (
									<li key={s} className="flex items-start gap-3 text-sm leading-relaxed text-foreground/85">
										<span
											className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums text-foreground"
											style={{ backgroundColor: 'color-mix(in srgb, var(--color-foreground) 8%, transparent)' }}
										>
											{i + 1}
										</span>
										<span className="pt-0.5">{s}</span>
									</li>
								))}
							</ol>
						</div>
					)}

					{todo.links && todo.links.length > 0 && (
						<div className="mt-5 space-y-3">
							{todo.links.map((l, i) => (
								<div key={l.href} className="rounded-2xl border border-foreground/10">
									<a
										href={l.href}
										target="_blank"
										rel="noopener"
										className="group flex items-center gap-3 rounded-2xl p-3 transition-colors hover:bg-foreground/[0.04]"
									>
										<span className="min-w-0 flex-1">
											<span className="block text-sm font-medium text-foreground">{l.label}</span>
											{l.hint && <span className="block text-xs text-foreground/50">{l.hint}</span>}
										</span>
										<span className="flex shrink-0 items-center gap-1 text-xs font-medium text-foreground/55">
											Åbn
											<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="transition-transform group-hover:translate-x-0.5">
												<path d="M7 17 17 7M8 7h9v9" />
											</svg>
										</span>
									</a>
									{l.ask && (
										<div className="border-t border-foreground/10 px-3 pt-2 pb-3">
											<label htmlFor={`todo-${todo.id}-${i}`} className="text-xs text-foreground/55">
												{l.ask}
											</label>
											<textarea
												id={`todo-${todo.id}-${i}`}
												value={linkNotes[l.label] ?? ''}
												onChange={(e) => setLinkNotes((p) => ({ ...p, [l.label]: e.target.value }))}
												rows={2}
												maxLength={1000}
												placeholder="Skriv kort, hvad der er forkert, og hvad der er det rigtige"
												className="border-foreground/[0.12] bg-background text-foreground focus:border-foreground/40 mt-1 w-full rounded-xl border px-3 py-2 text-sm leading-relaxed outline-none"
											/>
										</div>
									)}
								</div>
							))}
						</div>
					)}

					{todo.copyText && (
						<div
							className="mt-5 rounded-2xl border border-foreground/10 p-4"
							style={{ backgroundColor: 'color-mix(in srgb, var(--color-foreground) 4%, var(--color-background))' }}
						>
							<p className="text-xs font-semibold tracking-[0.14em] text-foreground/60 uppercase">Beskeden, du kan sende</p>
							<p className="mt-2 border-l-2 border-foreground/20 pl-3 text-sm leading-relaxed whitespace-pre-line text-foreground">
								{todo.copyText.text}
							</p>
							<button
								type="button"
								onClick={copy}
								className="border-foreground/[0.15] text-foreground hover:bg-foreground/[0.04] mt-3 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors"
							>
								<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
									{copied ? (
										<path d="M5 12.5 10 17 19 7" />
									) : (
										<>
											<rect x="9" y="9" width="11" height="11" rx="2" />
											<path d="M5 15V5a2 2 0 0 1 2-2h10" />
										</>
									)}
								</svg>
								{copied ? 'Kopieret' : todo.copyText.label}
							</button>
						</div>
					)}

					{todo.notePlaceholder && (
						<div className="mt-5">
							<label
								htmlFor={`todo-${todo.id}`}
								className="text-foreground/60 text-xs font-semibold tracking-[0.14em] uppercase"
							>
								{todo.noteLabel ?? 'Skriv her'}
							</label>
							{todo.noteHelp && (
								<p className="mt-1 text-sm leading-relaxed text-foreground/60">{todo.noteHelp}</p>
							)}
							<textarea
								id={`todo-${todo.id}`}
								value={note}
								onChange={(e) => setNote(e.target.value)}
								rows={3}
								maxLength={4000}
								placeholder={todo.notePlaceholder}
								className="border-foreground/[0.12] bg-background text-foreground focus:border-foreground/40 mt-1.5 w-full rounded-2xl border px-4 py-3 text-sm leading-relaxed outline-none"
							/>
							{todo.noteConsent && (
								<label
									className="mt-3 flex cursor-pointer items-start gap-3 rounded-2xl border p-3 text-sm leading-relaxed"
									style={
										needsConsent
											? { backgroundColor: 'var(--st-partial-bg)', borderColor: 'var(--st-partial-border)' }
											: { borderColor: 'color-mix(in srgb, var(--color-foreground) 12%, transparent)' }
									}
								>
									<input
										type="checkbox"
										checked={consent}
										onChange={(e) => setConsent(e.target.checked)}
										className="mt-0.5 h-4 w-4 shrink-0 accent-current"
									/>
									<span className="font-medium text-foreground">{todo.noteConsent}</span>
								</label>
							)}
						</div>
					)}

					<div className="mt-5 flex flex-wrap items-center gap-3">
						{toList && (
							<button
								type="button"
								onClick={markSeen}
								disabled={state === 'saving'}
								className="bg-foreground text-background rounded-full px-5 py-2 text-sm font-medium transition-opacity disabled:opacity-40"
							>
								{state === 'saving' ? 'Gemmer…' : 'Set, læg på min liste'}
							</button>
						)}
						<button
							type="button"
							onClick={() => save(true)}
							disabled={state === 'saving' || needsConsent}
							className={
								toList
									? 'text-foreground/70 hover:text-foreground border-foreground/[0.15] rounded-full border px-5 py-2 text-sm font-medium transition-colors disabled:opacity-40'
									: 'bg-foreground text-background rounded-full px-5 py-2 text-sm font-medium transition-opacity disabled:opacity-40'
							}
						>
							{state === 'saving' && !toList
								? 'Gemmer…'
								: filledLinkNotes.length > 0
									? 'Send mine bemærkninger'
									: (todo.doneLabel ?? kind.button)}
						</button>
						{needsConsent && (
							<span className="text-sm" style={{ color: 'var(--st-partial-text)' }}>
								Sæt flueben, så vi ved, at vi må kontakte dem.
							</span>
						)}
						{state === 'error' && (
							<span className="text-sm text-red-600">Det blev ikke gemt (fejl ved forbindelsen).</span>
						)}
					</div>
				</>
			)}

			{isDone && (
				<div
					className="mt-4 rounded-2xl p-4"
					style={{ backgroundColor: STATUS.bg, border: `1px solid ${STATUS.border}` }}
				>
					<p className="text-xs font-medium tracking-[0.14em] uppercase" style={{ color: STATUS.text }}>
						{kind.status} · {fmtDate(todo.closed?.date ?? done!.at)}
						{done?.by && !todo.closed && ` · ${done.by}`}
					</p>
					{(todo.closed?.text || done?.note) && (
						<p className="mt-1.5 text-sm leading-relaxed whitespace-pre-line text-foreground">
							{todo.closed?.text || done?.note}
						</p>
					)}
					{done?.linkNotes && done.linkNotes.length > 0 && (
						<ul className="mt-2 space-y-2">
							{done.linkNotes.map((n) => (
								<li key={n.label} className="text-sm leading-relaxed">
									<span className="block text-xs font-medium text-foreground/60">{n.label}</span>
									<span className="whitespace-pre-line text-foreground">{n.text}</span>
								</li>
							))}
						</ul>
					)}
					{done?.consent && (
						<p className="mt-1.5 text-sm font-medium" style={{ color: STATUS.text }}>
							Horizen må kontakte dem.
						</p>
					)}
					{done && !todo.closed && (
						<button
							type="button"
							onClick={() => save(false)}
							disabled={state === 'saving'}
							className="border-foreground/[0.15] text-foreground/70 hover:text-foreground hover:bg-foreground/[0.04] mt-3 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors"
						>
							{/* Træk markeringen tilbage, hvis opgaven alligevel ikke er klaret (Andreas 16/11-2026) */}
							{state === 'saving' ? 'Gemmer…' : 'Markér som ikke løst'}
						</button>
					)}
					{state === 'error' && (
						<p className="mt-2 text-sm text-red-600">Det blev ikke gemt (fejl ved forbindelsen).</p>
					)}
				</div>
			)}
			</div>
			</details>
		</li>
	)
}
