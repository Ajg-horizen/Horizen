'use client'

import { useEffect, useRef, useState } from 'react'
import { LuCheck as Check, LuClock as Clock, LuZap as Zap } from 'react-icons/lu'
import { accent, ink, muted, white, withAlpha } from './_tokens'
import { StructuredText } from './StructuredText'
import type {
	InboxItem,
	InboxStatus,
	InboxPriority,
	InboxHandling,
} from './data'

/* ─── Status ────────────────────────────────────────────────── */

const STATUS_META: Record<
	InboxStatus,
	{ label: string; bg: string; text: string; border: string; dot: string }
> = {
	sendt: {
		label: 'Sendt',
		bg: withAlpha(ink, 0.06),
		text: ink,
		border: withAlpha(ink, 0.12),
		dot: withAlpha(ink, 0.45),
	},
	godkendt: {
		label: 'Godkendt',
		bg: 'var(--st-done-bg)',
		text: 'var(--st-done-text)',
		border: 'var(--st-done-border)',
		dot: 'var(--st-done-dot)',
	},
	igang: {
		label: 'I gang',
		bg: 'var(--st-partial-bg)',
		text: 'var(--st-partial-text)',
		border: 'var(--st-partial-border)',
		dot: 'var(--st-partial-dot)',
	},
	loest: {
		label: 'Løst',
		bg: 'var(--st-done-bg)',
		text: 'var(--st-done-text)',
		border: 'var(--st-done-border)',
		dot: 'var(--st-done-dot)',
	},
	blokeret: {
		label: 'Blokeret',
		bg: 'var(--st-missing-bg)',
		text: 'var(--st-missing-text)',
		border: 'var(--st-missing-border)',
		dot: 'var(--st-missing-dot)',
	},
}

/* ─── Prioritet ─────────────────────────────────────────────── */

const PRIORITY_META: Record<
	InboxPriority,
	{ label: string; color: string; rank: number }
> = {
	hoej: { label: 'Høj', color: 'var(--st-missing-dot)', rank: 0 },
	middel: { label: 'Middel', color: 'var(--st-partial-dot)', rank: 1 },
	lav: { label: 'Lav', color: withAlpha(ink, 0.4), rank: 2 },
}

/**
 * Håndtering. "Gå bare i gang" (timer5) er standard: vi går i gang og bruger
 * af retaineren, og kun hvis opgaven ser ud til at tage over 5 timer, vender
 * vi tilbage med et overslag. timer10 vælges ikke længere, men ældre opgaver
 * kan have den, så den skal stadig kunne vises.
 */
/** Farver pr. håndtering: grøn = vi går i gang, blå = vi venter på jeres ok. */
const GO_TONE = {
	bg: 'var(--st-done-bg)',
	text: 'var(--st-done-text)',
	border: 'var(--st-done-border)',
	dot: 'var(--st-done-dot)',
}
const WAIT_TONE = {
	bg: 'var(--st-info-bg)',
	text: 'var(--st-info-text)',
	border: 'var(--st-info-border)',
	dot: 'var(--st-info-dot)',
}

const HANDLING_META: Record<
	InboxHandling,
	{ label: string; tone: typeof GO_TONE; Icon: typeof Zap }
> = {
	timer5: { label: 'Vi går bare i gang', tone: GO_TONE, Icon: Zap },
	timer10: { label: 'Vi går bare i gang', tone: GO_TONE, Icon: Zap },
	// Neutral formulering: kortet kan også være godkendt eller løst.
	estimat: { label: 'Tidsoverslag først', tone: WAIT_TONE, Icon: Clock },
}

const HANDLING_CHOICES: {
	value: InboxHandling
	title: string
	text: string
	badge?: string
}[] = [
	{
		value: 'timer5',
		title: 'Gå bare i gang',
		// Teksten bygges i GoAheadText ud fra månedens timer.
		text: '',
		badge: 'Standard',
	},
	{
		value: 'estimat',
		title: 'Giv et tidsoverslag først',
		text: 'Vi går ikke i gang endnu. I får et overslag over timerne, og vi starter først, når I har sagt ok.',
	},
]

/** Månedens retainer-timer (fra data.ts: retainerHours + monthlyUsage). */
export type RetainerHours = {
	total: number
	used: number
	monthName: string
	/** 'klippekort' = købte timer uden månedsramme (fra dec. 2026) */
	kind?: 'retainer' | 'klippekort'
}

const fmtHours = (n: number) => n.toLocaleString('da-DK', { maximumFractionDigits: 1 })

/**
 * Teksten i "Gå bare i gang": grænsen er kundens månedlige timer, og kunden
 * ser, hvor mange der er tilbage, før de vælger. Tallene er kun rigtige, når
 * monthlyUsage i data.ts er opdateret.
 */
function GoAheadText({ hours }: { hours?: RetainerHours }) {
	if (!hours) {
		return (
			<>
				Vi går i gang med det samme og bruger af jeres timer. Bliver opgaven
				stor, hører I fra os først.
			</>
		)
	}
	const left = Math.max(0, hours.total - hours.used)
	if (hours.kind === 'klippekort') {
		return left > 0 ? (
			<>
				Vi går i gang med det samme og trækker timerne fra klippekortet.{' '}
				<strong className="font-semibold" style={{ color: ink }}>
					I har {fmtHours(left)} {left === 1 ? 'time' : 'timer'} tilbage på klippekortet.
				</strong>{' '}
				Bliver opgaven større end det, hører I fra os først.
			</>
		) : (
			<>
				<strong className="font-semibold" style={{ color: ink }}>
					Der er ingen timer på klippekortet lige nu.
				</strong>{' '}
				Vi vender tilbage med et tidsoverslag, før vi går i gang.
			</>
		)
	}
	return (
		<>
			Vi går i gang med det samme og bruger af jeres timer.{' '}
			<strong className="font-semibold" style={{ color: ink }}>
				{left > 0
					? `I har ${fmtHours(left)} af ${fmtHours(hours.total)} timer tilbage i ${hours.monthName}.`
					: `Alle ${fmtHours(hours.total)} timer i ${hours.monthName} er brugt.`}
			</strong>{' '}
			Bliver opgaven større end jeres {fmtHours(hours.total)} månedlige timer,
			hører I fra os først.
		</>
	)
}

/** Lille farvet mærke på opgavekortet, så man straks kan se håndteringen. */
function HandlingTag({ handling }: { handling: InboxHandling }) {
	const { label, tone, Icon } = HANDLING_META[handling] ?? HANDLING_META.timer5
	return (
		<span
			className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
			style={{ backgroundColor: tone.bg, color: tone.text, border: `1px solid ${tone.border}` }}
		>
			<Icon aria-hidden className="h-3 w-3" strokeWidth={2.25} />
			{label}
		</span>
	)
}

function StatusBadge({ status }: { status: InboxStatus }) {
	const m = STATUS_META[status] ?? STATUS_META.sendt
	return (
		<span
			className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
			style={{ backgroundColor: m.bg, color: m.text, border: `1px solid ${m.border}` }}
		>
			<span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: m.dot }} />
			{m.label}
		</span>
	)
}

function PriorityTag({ priority }: { priority?: InboxPriority }) {
	const m = PRIORITY_META[priority ?? 'middel']
	return (
		<span
			className="inline-flex items-center gap-1.5 text-xs font-medium"
			style={{ color: m.color }}
		>
			<span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: m.color }} />
			{m.label} prioritet
		</span>
	)
}

function formatDate(iso?: string) {
	if (!iso) return ''
	return new Date(iso).toLocaleDateString('da-DK', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	})
}

/* ─── Kort (læsevisning) ────────────────────────────────────── */

function TaskCard({ item }: { item: InboxItem }) {
	const from = item.fromName || item.fromEmail || ''
	const date = formatDate(item.receivedAt)
	return (
		<div
			className="rounded-2xl bg-white p-5"
			style={{ border: `1px solid ${withAlpha(ink, 0.08)}` }}
		>
			<div className="flex flex-wrap items-start justify-between gap-3">
				<h4
					className="text-base font-medium tracking-[-0.01em]"
					style={{ color: ink }}
				>
					{item.subject || '(uden emne)'}
				</h4>
				<StatusBadge status={item.status} />
			</div>

			<div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
				<PriorityTag priority={item.priority} />
				{item.handling && <HandlingTag handling={item.handling} />}
				{typeof item.estimateHours === 'number' && (
					<span className="text-xs" style={{ color: muted }}>
						Estimat: {item.estimateHours} t
					</span>
				)}
			</div>

			<div className="mt-3 text-sm leading-relaxed" style={{ color: ink }}>
				<StructuredText text={item.message} />
			</div>
			{(from || date) && (
				<p className="mt-3 text-xs" style={{ color: muted }}>
					Sendt{from ? ` af ${from}` : ''}
					{date ? ` · ${date}` : ''}
				</p>
			)}
		</div>
	)
}

/* ─── Panel: formular + liste ───────────────────────────────── */

const PRIORITY_CHOICES: { value: InboxPriority; label: string }[] = [
	{ value: 'hoej', label: 'Høj' },
	{ value: 'middel', label: 'Middel' },
	{ value: 'lav', label: 'Lav' },
]

/** Diskret pille-vælger: markeret = blød grå flade, umarkeret = dæmpet tekst. */
function ChoicePill({
	active,
	onClick,
	children,
}: {
	active: boolean
	onClick: () => void
	children: React.ReactNode
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
			style={{
				backgroundColor: active ? withAlpha(ink, 0.07) : 'transparent',
				color: active ? ink : withAlpha(ink, 0.5),
			}}
		>
			{children}
		</button>
	)
}

/** Lille tekst-knap til formaterings-værktøjslinjen. onMouseDown-preventDefault
 *  bevarer markeringen i tekstfeltet, så "Fed" kan omkranse det markerede. */
function FormatBtn({
	onClick,
	children,
}: {
	onClick: () => void
	children: React.ReactNode
}) {
	return (
		<button
			type="button"
			onMouseDown={(e) => e.preventDefault()}
			onClick={onClick}
			className="rounded-md px-2 py-1 text-xs font-medium transition-colors"
			style={{ color: withAlpha(ink, 0.6) }}
		>
			{children}
		</button>
	)
}

/* ─── Nye opgaver (kladder, sendes samlet) ──────────────────── */

type Draft = {
	key: number
	subject: string
	message: string
	priority: InboxPriority
	handling: InboxHandling
}

const MAX_DRAFTS = 10

let draftSeq = 0
const newDraft = (): Draft => ({
	key: ++draftSeq,
	subject: '',
	message: '',
	priority: 'middel',
	handling: 'timer5',
})

const inputStyle = {
	backgroundColor: white,
	border: `1px solid ${withAlpha(ink, 0.12)}`,
	color: ink,
}

/** Ét opgavekort i formularen: emne, beskrivelse, prioritet og timeramme. */
function DraftCard({
	draft,
	number,
	onChange,
	onRemove,
	autoFocus,
	hours,
}: {
	draft: Draft
	number: number
	onChange: (patch: Partial<Draft>) => void
	onRemove: () => void
	autoFocus: boolean
	hours?: RetainerHours
}) {
	const messageRef = useRef<HTMLTextAreaElement>(null)
	const subjectRef = useRef<HTMLInputElement>(null)
	const { message } = draft

	useEffect(() => {
		if (!autoFocus) return
		subjectRef.current?.focus({ preventScroll: true })
		subjectRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
	}, [autoFocus])

	// Omkrans markeringen (til **fed**).
	function surround(wrap: string) {
		const ta = messageRef.current
		if (!ta) return
		const { selectionStart: s, selectionEnd: e } = ta
		const sel = message.slice(s, e) || 'tekst'
		onChange({ message: message.slice(0, s) + wrap + sel + wrap + message.slice(e) })
		requestAnimationFrame(() => {
			ta.focus()
			ta.setSelectionRange(s + wrap.length, s + wrap.length + sel.length)
		})
	}

	// Indsæt et liste-præfiks i starten af en (ny) linje.
	function insertLinePrefix(prefix: string) {
		const ta = messageRef.current
		if (!ta) return
		const s = ta.selectionStart
		const before = message.slice(0, s)
		const lead = before.length > 0 && !before.endsWith('\n') ? '\n' : ''
		const insert = lead + prefix
		onChange({ message: before + insert + message.slice(s) })
		requestAnimationFrame(() => {
			ta.focus()
			const pos = s + insert.length
			ta.setSelectionRange(pos, pos)
		})
	}

	// Vis forhåndsvisning når beskeden faktisk indeholder formatering.
	const hasFormatting = /(^|\n)\s*([-*]\s|\d+[.)]\s)|\*\*[^*]+\*\*/.test(message)

	return (
		<div
			className="rounded-2xl bg-white p-5 md:p-6"
			style={{ border: `1px solid ${withAlpha(ink, 0.08)}` }}
		>
			<div className="mb-3 flex items-center justify-between gap-3">
				<span
					className="text-xs font-medium tracking-[0.14em] uppercase"
					style={{ color: withAlpha(ink, 0.5) }}
				>
					Opgave {number}
				</span>
				<button
					type="button"
					onClick={onRemove}
					className="text-xs font-medium underline-offset-2 hover:underline"
					style={{ color: withAlpha(ink, 0.5) }}
				>
					Fjern
				</button>
			</div>
			<input
				ref={subjectRef}
				type="text"
				value={draft.subject}
				onChange={(e) => onChange({ subject: e.target.value })}
				placeholder="Emne (valgfrit)"
				maxLength={200}
				className="w-full rounded-[12px] px-4 py-2.5 text-sm outline-none"
				style={inputStyle}
			/>
			{/* Formaterings-værktøjslinje */}
			<div className="mt-3 flex flex-wrap items-center gap-0.5">
				<FormatBtn onClick={() => insertLinePrefix('- ')}>• Punktliste</FormatBtn>
				<FormatBtn onClick={() => insertLinePrefix('1. ')}>1. Nummereret</FormatBtn>
				<FormatBtn onClick={() => surround('**')}>Fed</FormatBtn>
			</div>
			<textarea
				ref={messageRef}
				value={message}
				onChange={(e) => onChange({ message: e.target.value })}
				placeholder="Beskriv opgaven — brug knapperne ovenfor til punkter og lister…"
				rows={4}
				maxLength={4000}
				className="mt-1 w-full rounded-[12px] px-4 py-2.5 text-sm outline-none"
				style={inputStyle}
			/>
			{hasFormatting && (
				<div
					className="mt-2 rounded-[12px] p-3"
					style={{ backgroundColor: withAlpha(ink, 0.03) }}
				>
					<span className="text-xs font-medium" style={{ color: muted }}>
						Forhåndsvisning
					</span>
					<div className="mt-1 text-sm leading-relaxed" style={{ color: ink }}>
						<StructuredText text={message} />
					</div>
				</div>
			)}

			{/* Prioritet */}
			<div className="mt-4 flex flex-wrap items-center gap-1.5">
				<span className="mr-1 text-xs font-medium" style={{ color: muted }}>
					Prioritet
				</span>
				{PRIORITY_CHOICES.map((p) => {
					const active = draft.priority === p.value
					const color = PRIORITY_META[p.value].color
					return (
						<ChoicePill
							key={p.value}
							active={active}
							onClick={() => onChange({ priority: p.value })}
						>
							<span
								className="h-1.5 w-1.5 rounded-full"
								style={{ backgroundColor: color, opacity: active ? 1 : 0.4 }}
							/>
							{p.label}
						</ChoicePill>
					)
				})}
			</div>

			{/* Håndtering: "Gå bare i gang" er valgt på forhånd */}
			<div className="mt-5">
				<span className="text-xs font-medium" style={{ color: muted }}>
					Hvordan skal vi gribe den an?
				</span>
				<div
					className="mt-2 grid gap-3 sm:grid-cols-2"
					role="radiogroup"
					aria-label="Hvordan skal vi gribe den an?"
				>
					{HANDLING_CHOICES.map((h) => {
						const active = draft.handling === h.value
						const { tone, Icon } = HANDLING_META[h.value]
						return (
							<button
								key={h.value}
								type="button"
								role="radio"
								aria-checked={active}
								onClick={() => onChange({ handling: h.value })}
								className="relative flex items-start gap-3 rounded-2xl p-4 text-left transition-colors"
								style={
									active
										? {
												backgroundColor: tone.bg,
												border: `1.5px solid ${tone.dot}`,
											}
										: {
												backgroundColor: 'transparent',
												border: `1.5px solid ${withAlpha(ink, 0.12)}`,
											}
								}
							>
								<span
									aria-hidden
									className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
									style={{
										backgroundColor: active ? tone.dot : withAlpha(ink, 0.06),
										color: active ? white : withAlpha(ink, 0.5),
									}}
								>
									<Icon className="h-4 w-4" strokeWidth={2.25} />
								</span>
								<span className="min-w-0 flex-1">
									<span className="flex flex-wrap items-center gap-2">
										<span
											className="text-sm font-semibold"
											style={{ color: active ? tone.text : ink }}
										>
											{h.title}
										</span>
										{h.badge && (
											<span
												className="rounded-full px-2 py-0.5 text-[0.65rem] font-medium tracking-wide uppercase"
												style={{
													backgroundColor: withAlpha(ink, 0.06),
													color: withAlpha(ink, 0.6),
												}}
											>
												{h.badge}
											</span>
										)}
									</span>
									<span
										className="mt-1 block text-xs leading-relaxed"
										style={{ color: muted }}
									>
										{h.value === 'timer5' ? <GoAheadText hours={hours} /> : h.text}
									</span>
								</span>
								<span
									aria-hidden
									className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
									style={
										active
											? { backgroundColor: tone.dot, color: white }
											: { border: `1.5px solid ${withAlpha(ink, 0.2)}` }
									}
								>
									{active && <Check className="h-3 w-3" strokeWidth={3} />}
								</span>
							</button>
						)
					})}
				</div>
			</div>
		</div>
	)
}

/** Hash-signal fra knappen "Opret ny opgave" (#v=opgaver&ny=1). */
function takeNewTaskSignal() {
	const sp = new URLSearchParams(window.location.hash.slice(1))
	if (!sp.has('ny')) return false
	sp.delete('ny')
	history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${sp}`)
	return true
}

/**
 * Siden "Opgaver": de aktive opgaver øverst og lige under dem formularen til
 * nye. Kunden kan lægge flere opgaver i kø ("Tilføj opgave") og sende dem
 * samlet. Hver bliver sin egen opgave i Studio, men der sendes én mail.
 * Afsenderen er den, der er logget ind med Sanity (serveren læser den fra
 * login-cookien); kun ved kode-login spørges der om et navn.
 */
export default function OpgaverPanel({
	items: initial,
	signedInAs,
	hours,
}: {
	items: InboxItem[]
	/** Navnet fra Sanity-login. Er det kendt, spørges der ikke om afsender. */
	signedInAs?: string
	/** Månedens retainer-timer; vises i "Gå bare i gang". Uden retainer: udelades. */
	hours?: RetainerHours
}) {
	const [items, setItems] = useState<InboxItem[]>(initial)
	const [drafts, setDrafts] = useState<Draft[]>([])
	const [focusKey, setFocusKey] = useState<number | null>(null)
	const [from, setFrom] = useState('')
	const [website, setWebsite] = useState('') // honeypot
	const [submitting, setSubmitting] = useState(false)
	const [error, setError] = useState('')
	const [sentCount, setSentCount] = useState(0)

	// Seneste kladder til addDraft, som også kaldes fra hash-lytteren
	const draftsRef = useRef(drafts)
	draftsRef.current = drafts

	// Tilføj et nyt kort, eller gå til det sidste, hvis det stadig er tomt.
	function addDraft() {
		setSentCount(0)
		const prev = draftsRef.current
		const last = prev.at(-1)
		if (last && !last.subject.trim() && !last.message.trim()) {
			// Ny værdi, så kortet scroller frem igen, selvom det allerede havde fokus
			setFocusKey(null)
			requestAnimationFrame(() => setFocusKey(last.key))
			return
		}
		if (prev.length >= MAX_DRAFTS) return
		const d = newDraft()
		setDrafts([...prev, d])
		setFocusKey(d.key)
	}

	// "Opret ny opgave" øverst på siden åbner et kort her
	useEffect(() => {
		const onHash = () => takeNewTaskSignal() && addDraft()
		onHash()
		window.addEventListener('hashchange', onHash)
		return () => window.removeEventListener('hashchange', onHash)
		// Kun ved mount; addDraft læser kladderne via draftsRef
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	function update(key: number, patch: Partial<Draft>) {
		setDrafts((prev) => prev.map((d) => (d.key === key ? { ...d, ...patch } : d)))
	}

	const missing = drafts.findIndex((d) => !d.message.trim())

	async function submit(e: React.FormEvent) {
		e.preventDefault()
		if (!drafts.length || missing !== -1 || submitting) return
		setSubmitting(true)
		setError('')
		try {
			const res = await fetch('/api/seo-task', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					tasks: drafts.map(({ subject, message, priority, handling }) => ({
						subject,
						message,
						priority,
						handling,
					})),
					from,
					website,
				}),
			})
			const data = await res.json()
			if (!res.ok) throw new Error(data?.error || 'Noget gik galt')
			const created = (data.items ?? []) as InboxItem[]
			setItems((prev) => [...created, ...prev])
			setSentCount(drafts.length)
			setDrafts([])
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Noget gik galt')
		} finally {
			setSubmitting(false)
		}
	}

	// Sortér: højeste prioritet først, derefter nyeste.
	const sorted = [...items].sort((a, b) => {
		const pa = PRIORITY_META[a.priority ?? 'middel'].rank
		const pb = PRIORITY_META[b.priority ?? 'middel'].rank
		if (pa !== pb) return pa - pb
		return (b.receivedAt ?? '').localeCompare(a.receivedAt ?? '')
	})

	return (
		<div>
			<div className="mb-8">
				<span
					className="text-xs font-medium tracking-[0.2em] uppercase"
					style={{ color: withAlpha(ink, 0.45) }}
				>
					Ad hoc
				</span>
				<h2
					className="mt-2 text-2xl font-semibold tracking-tight md:text-[1.75rem]"
					style={{ color: ink, lineHeight: 1.1 }}
				>
					Ad hoc-opgaver
				</h2>
				<p
					className="mt-3 max-w-3xl text-sm leading-relaxed"
					style={{ color: muted }}
				>
					Løbende ønsker og opgaver kan skrives her — SEO, indhold, nye sider,
					grafik eller andre tilføjelser til sitet. Som udgangspunkt går vi bare
					i gang og bruger af jeres timer. Fylder en opgave mere end jeres
					månedlige timer, spørger vi først.
				</p>
			</div>

			{/* Aktive opgaver (løste ligger i Aktivitet) */}
			<h3 className="mb-4 text-lg font-medium tracking-[-0.01em]" style={{ color: ink }}>
				Aktive opgaver{' '}
				<span className="text-sm font-normal" style={{ color: muted }}>
					({sorted.length})
				</span>
			</h3>
			{sorted.length === 0 ? (
				<div
					className="rounded-2xl bg-white p-8 text-center"
					style={{ border: `1px solid ${withAlpha(ink, 0.08)}` }}
				>
					<p className="text-sm" style={{ color: muted }}>
						Ingen aktive opgaver. Opret den første herunder.
					</p>
				</div>
			) : (
				<div className="grid gap-4 md:grid-cols-2">
					{sorted.map((item) => (
						<TaskCard key={item._id} item={item} />
					))}
				</div>
			)}

			{/* Nye opgaver: lægges i kø og sendes samlet */}
			<form onSubmit={submit} className="mt-12" id="nye-opgaver">
				<h3 className="text-lg font-medium tracking-[-0.01em]" style={{ color: ink }}>
					Nye opgaver
				</h3>
				<p className="mt-1 mb-4 max-w-2xl text-sm leading-relaxed" style={{ color: muted }}>
					<span
						className="mr-2 inline-flex rounded-full px-2 py-0.5 text-xs font-medium"
						style={{ backgroundColor: 'var(--st-done-bg)', color: 'var(--st-done-text)' }}
					>
						Nyt
					</span>
					I behøver ikke sende én opgave ad gangen. Tilføj alle de opgaver, I har,
					og send dem samlet. Hver opgave får sin egen prioritet.
				</p>

				{sentCount > 0 && (
					<p
						className="mb-4 rounded-2xl px-4 py-3 text-sm"
						style={{
							backgroundColor: 'var(--st-done-bg)',
							color: 'var(--st-done-text)',
						}}
						role="status"
					>
						{sentCount === 1 ? 'Opgaven er sendt' : `${sentCount} opgaver er sendt`} ✓
						Du finder {sentCount === 1 ? 'den' : 'dem'} under Aktive opgaver.
					</p>
				)}

				<div className="space-y-4">
					{drafts.map((d, i) => (
						<DraftCard
							key={d.key}
							draft={d}
							number={i + 1}
							onChange={(patch) => update(d.key, patch)}
							onRemove={() => setDrafts((prev) => prev.filter((x) => x.key !== d.key))}
							autoFocus={focusKey === d.key}
							hours={hours}
						/>
					))}
				</div>

				<button
					type="button"
					onClick={addDraft}
					disabled={drafts.length >= MAX_DRAFTS}
					className="mt-4 flex w-full items-center justify-center gap-3 rounded-2xl px-5 py-4 text-left transition-colors hover:bg-foreground/[0.03] disabled:opacity-50"
					style={{ border: `1.5px dashed ${withAlpha(accent, 0.55)}` }}
				>
					<span
						aria-hidden
						className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-base leading-none"
						style={{ backgroundColor: withAlpha(accent, 0.14), color: accent }}
					>
						+
					</span>
					<span>
						<span className="block text-sm font-medium" style={{ color: ink }}>
							{drafts.length ? 'Tilføj en opgave mere' : 'Tilføj opgave'}
						</span>
						<span className="block text-xs" style={{ color: muted }}>
							{drafts.length
								? `${drafts.length} ${drafts.length === 1 ? 'opgave' : 'opgaver'} klar. Tilføj flere, og send dem samlet.`
								: 'I kan tilføje flere opgaver og sende dem samlet.'}
						</span>
					</span>
				</button>

				{drafts.length > 0 && (
					<div
						className="mt-4 rounded-2xl bg-white p-5 md:p-6"
						style={{ border: `1px solid ${withAlpha(ink, 0.08)}` }}
					>
						{signedInAs ? (
							<p className="text-sm" style={{ color: muted }}>
								Sendes som <span style={{ color: ink }}>{signedInAs}</span>
							</p>
						) : (
							<input
								type="text"
								value={from}
								onChange={(e) => setFrom(e.target.value)}
								placeholder="Fra — navn (valgfrit)"
								maxLength={120}
								className="w-full rounded-[12px] px-4 py-2.5 text-sm outline-none sm:max-w-sm"
								style={inputStyle}
							/>
						)}

						{/* Honeypot — skjult for mennesker */}
						<input
							type="text"
							value={website}
							onChange={(e) => setWebsite(e.target.value)}
							tabIndex={-1}
							autoComplete="off"
							aria-hidden="true"
							style={{ position: 'absolute', left: '-9999px', width: 1, height: 1 }}
						/>

						<div className="mt-4 flex flex-wrap items-center gap-3">
							<button
								type="submit"
								disabled={submitting || missing !== -1}
								className="rounded-full px-5 py-2.5 text-sm font-medium transition-opacity disabled:opacity-50"
								style={{ backgroundColor: ink, color: white }}
							>
								{submitting
									? 'Sender…'
									: drafts.length === 1
										? 'Send opgaven'
										: `Send ${drafts.length} opgaver`}
							</button>
							{missing !== -1 && !submitting && (
								<span className="text-sm" style={{ color: muted }}>
									{drafts.length === 1
										? 'Skriv en beskrivelse af opgaven.'
										: `Opgave ${missing + 1} mangler en beskrivelse.`}
								</span>
							)}
							{error && (
								<span className="text-sm" style={{ color: 'var(--st-missing-text)' }}>
									{error}
								</span>
							)}
						</div>
					</div>
				)}
			</form>
		</div>
	)
}
