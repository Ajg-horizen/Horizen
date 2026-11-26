import type { Finding, FindingStatus } from './data'

/**
 * Fund-register (kun Horizen, Andreas 15/11-2026): ét sted for fund og løse
 * ender med dato for fundet og for løsningen. Åbne og ventende punkter står
 * øverst (ældste først, med alders-mærke efter 3 måneder), udskudte for sig,
 * og klarede nederst som historik. Data: `findings` i data.ts.
 */

const STALE_MONTHS = 3

const STATUS: Record<FindingStatus, { label: string; dot: string }> = {
	aaben: { label: 'Åben', dot: 'var(--st-partial-dot)' },
	venter: { label: 'Venter', dot: 'var(--st-info-text)' },
	udskudt: { label: 'Udskudt', dot: 'color-mix(in srgb, var(--color-foreground) 35%, transparent)' },
	klaret: { label: 'Klaret', dot: 'var(--st-done-dot)' },
}

const fmt = (iso: string) =>
	new Date(iso).toLocaleDateString('da-DK', { day: 'numeric', month: 'short', year: 'numeric' })

function monthsSince(iso: string, now: Date) {
	const [y, m, d] = iso.split('-').map(Number)
	let months = (now.getFullYear() - y) * 12 + (now.getMonth() + 1 - m)
	if (now.getDate() < d) months -= 1
	return Math.max(0, months)
}

const chip =
	'rounded-full px-2 py-0.5 text-[11px] font-medium text-foreground/60'
const chipStyle = { backgroundColor: 'color-mix(in srgb, var(--color-foreground) 6%, transparent)' }

function Row({ f, now }: { f: Finding; now: Date }) {
	const st = STATUS[f.status]
	const age = f.status === 'klaret' ? 0 : monthsSince(f.foundAt, now)
	return (
		<li className="rounded-2xl border border-foreground/[0.08] bg-white p-4 md:p-5">
			<div className="flex flex-wrap items-center gap-2">
				<span className="flex items-center gap-1.5 text-xs font-medium text-foreground/70">
					<span className="h-2 w-2 rounded-full" style={{ backgroundColor: st.dot }} />
					{st.label}
				</span>
				<span className={chip} style={chipStyle}>
					{f.category}
				</span>
				<span className={chip} style={chipStyle}>
					{f.owner}
				</span>
				{age >= STALE_MONTHS && (
					<span
						className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
						style={{ backgroundColor: 'var(--st-partial-bg)', color: 'var(--st-partial-text)' }}
					>
						{age} mdr. gammel
					</span>
				)}
				<span className="ms-auto text-xs text-foreground/45">
					Fundet {fmt(f.foundAt)} · {f.source}
				</span>
			</div>
			<p
				className={`mt-2 text-sm leading-snug font-medium text-foreground ${f.status === 'klaret' ? 'text-foreground/70' : ''}`}
			>
				{f.title}
			</p>
			{f.note && f.status !== 'klaret' && (
				<p className="mt-1 text-sm leading-relaxed text-foreground/60">{f.note}</p>
			)}
			{f.status === 'klaret' && f.doneAt && (
				<p className="mt-1 text-sm leading-relaxed text-foreground/60">
					<span className="font-medium" style={{ color: 'var(--st-done-text)' }}>
						Klaret {fmt(f.doneAt)}
					</span>
					{f.doneNote ? `: ${f.doneNote}` : ''}
				</p>
			)}
		</li>
	)
}

function Group({
	title,
	items,
	now,
	hint,
}: {
	title: string
	items: Finding[]
	now: Date
	hint?: string
}) {
	if (items.length === 0) return null
	return (
		<section className="mt-8 first:mt-0">
			<h3 className="text-xs font-semibold tracking-[0.14em] text-foreground/60 uppercase">
				{title} ({items.length})
			</h3>
			{hint && <p className="mt-1 text-sm text-foreground/50">{hint}</p>}
			<ol className="mt-3 space-y-2">
				{items.map((f) => (
					<Row key={f.id} f={f} now={now} />
				))}
			</ol>
		</section>
	)
}

export default function FindingsTab({ items }: { items: Finding[] }) {
	const now = new Date()
	const byFound = (a: Finding, b: Finding) => a.foundAt.localeCompare(b.foundAt)
	const open = items.filter((f) => f.status === 'aaben' || f.status === 'venter').sort(byFound)
	const later = items.filter((f) => f.status === 'udskudt').sort(byFound)
	const done = items
		.filter((f) => f.status === 'klaret')
		.sort((a, b) => (b.doneAt ?? '').localeCompare(a.doneAt ?? ''))
	const count = (s: FindingStatus) => items.filter((f) => f.status === s).length

	return (
		<div>
			<div className="mb-8">
				<span className="text-[11px] font-medium tracking-[0.14em] text-foreground/55 uppercase">
					Kun Horizen
				</span>
				<h2
					className="mt-2 text-2xl font-semibold tracking-tight text-foreground md:text-[1.75rem]"
					style={{ lineHeight: 1.1 }}
				>
					Fund-register
				</h2>
				<p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
					Alt, vi har fundet, og alt, der står åbent, med dato for, hvornår det blev fundet, og hvornår det blev løst.
					Opdateres i tjeklistens trin 14 og efter hver session. Kunden kan ikke se siden.
				</p>
				<div className="mt-4 flex flex-wrap gap-2 text-xs">
					{(['aaben', 'venter', 'udskudt', 'klaret'] as FindingStatus[]).map((s) => (
						<span
							key={s}
							className="flex items-center gap-1.5 rounded-full border border-foreground/10 px-3 py-1 text-foreground/70"
						>
							<span className="h-2 w-2 rounded-full" style={{ backgroundColor: STATUS[s].dot }} />
							{count(s)} {STATUS[s].label.toLowerCase()}
						</span>
					))}
				</div>
			</div>
			<Group title="Åbne og ventende" items={open} now={now} hint="Ældste først. Et mærke viser, når noget har ligget i over 3 måneder." />
			<Group title="Udskudt" items={later} now={now} hint="Bevidst sat til side, med begrundelse." />
			{done.length > 0 && (
				<details className="group mt-8">
					<summary className="cursor-pointer list-none text-xs font-semibold tracking-[0.14em] text-foreground/60 uppercase [&::-webkit-details-marker]:hidden">
						Klaret ({done.length}) <span className="text-foreground/40 normal-case">· vis historik</span>
					</summary>
					<ol className="mt-3 space-y-2">
						{done.map((f) => (
							<Row key={f.id} f={f} now={now} />
						))}
					</ol>
				</details>
			)}
		</div>
	)
}
