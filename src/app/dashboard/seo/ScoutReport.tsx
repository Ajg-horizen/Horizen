'use client'

import { useState } from 'react'
import { accent } from './_tokens'
import { STATUS_META } from './statusMeta'

/** Navnet, agenten skriver i doneBy, når den sætter et flueben i tjeklisten. */
export const SCOUT_NAME = 'SEO-spejderen'

/** Releases i Studio (Horizens Studio har to arbejdsområder; rettelserne laves mod det live (production)). */
const STUDIO_RELEASES = '/admin/production/releases'

export type ScoutStep = { stepId: string; status: 'klaret' | 'forberedt' | 'dig'; note?: string }
export type ScoutLogDraft = {
	_key: string
	date: string
	title: string
	description: string
	kind?: 'seo' | 'udvikling'
	status?: 'afventer' | 'godkendt' | 'afvist'
}
/** Status på et punkt i Andreas' arbejdsliste (Andreas 27/11-2026). */
export type WorkStatus = 'ny' | 'laest' | 'loest'
export type ScoutReportData = {
	month: string
	dataMonth?: string
	createdAt?: string
	summary?: string
	steps?: ScoutStep[]
	actions?: { _key: string; title: string; why?: string; inRelease?: boolean }[]
	/** Punkter fra tidligere måneder, der ikke blev løst. Står øverst. */
	carriedOver?: { _key: string; title: string; why?: string; fromMonth?: string }[]
	/** Andreas' status pr. punkt: _key er "a:<handling>", "s:<trin>" eller "c:<overført>". */
	work?: { _key: string; status: WorkStatus; at?: string }[]
	releaseId?: string
	releaseTitle?: string
	releaseCount?: number
	logDrafts?: ScoutLogDraft[]
	message?: { heading?: string; intro?: string; insight?: string; status?: 'kladde' | 'klar' }
}

export const SCOUT_STEP_LABEL: Record<ScoutStep['status'], string> = {
	klaret: 'Klaret af SEO-spejderen',
	forberedt: 'Forberedt til dig',
	dig: 'Kun dig',
}

const card = 'border-foreground/[0.08] rounded-2xl border bg-white p-5 md:p-6'
const eyebrow = 'text-foreground/55 text-[11px] font-medium tracking-[0.14em] uppercase'

const MONTHS = ['januar', 'februar', 'marts', 'april', 'maj', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'december']
const monthName = (m?: string) => (m ? MONTHS[Number(m.slice(5, 7)) - 1] ?? m : '')

async function post(body: Record<string, unknown>) {
	const res = await fetch('/api/seo-scout', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(body),
	})
	if (!res.ok) {
		const j = (await res.json().catch(() => ({}))) as { error?: string }
		throw new Error(j.error || 'Kunne ikke gemme')
	}
}

type WorkItem = { key: string; kind: string; title: string; text?: string; tag?: string }

/**
 * SEO-spejderens månedsrapport (Andreas 27/11-2026), kun under Kun Horizen →
 * Månedens gennemgang. Øverst Andreas' arbejdsliste: alt, spejderen har fundet,
 * med status Ny → Læst → Løst. "Læst" er hans grønne lys til, at Claude må løse
 * punktet i en session ("tag månedens gennemgang"); "Løst" sætter han selv, når
 * det er gjort. Intet herfra går til kunden eller til Vores opgaver. Ikke-løste
 * punkter overføres af spejderen til næste måned. Nederst forslag til
 * aktivitetsloggen (Godkend/Afvis, aldrig timer pr. post) og evt. rettelser i Studio.
 */
export default function ScoutReport({
	report,
	monthLabel,
	dataMonthLabel,
	stepTitles,
}: {
	report: ScoutReportData
	monthLabel: string
	dataMonthLabel?: string
	/** Trinenes navne fra tjeklisten, nøglet på stepId. */
	stepTitles: Record<string, string>
}) {
	const [logs, setLogs] = useState<ScoutLogDraft[]>(report.logDrafts ?? [])
	const [work, setWork] = useState<Record<string, WorkStatus>>(
		Object.fromEntries((report.work ?? []).map((w) => [w._key, w.status])),
	)
	const [busy, setBusy] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)

	const steps = report.steps ?? []
	const items: WorkItem[] = [
		...(report.carriedOver ?? []).map((c) => ({
			key: `c:${c._key}`,
			kind: `Overført fra ${monthName(c.fromMonth) || 'sidste måned'}`,
			title: c.title,
			text: c.why,
		})),
		...(report.actions ?? []).map((a) => ({
			key: `a:${a._key}`,
			kind: 'Handling',
			title: a.title,
			text: a.why,
			tag: a.inRelease ? 'Ligger klar som rettelse i Studio' : undefined,
		})),
		...steps
			.filter((s) => s.status !== 'klaret')
			.map((s) => ({
				key: `s:${s.stepId}`,
				kind: SCOUT_STEP_LABEL[s.status],
				title: stepTitles[s.stepId] ?? s.stepId,
				text: s.note,
			})),
	]
	const statusOf = (k: string): WorkStatus => work[k] ?? 'ny'
	const unread = items.filter((i) => statusOf(i.key) === 'ny').length
	const approved = items.filter((i) => statusOf(i.key) === 'laest').length
	const pendingLogs = logs.filter((l) => (l.status ?? 'afventer') === 'afventer').length
	// Datoen for gennemgangen står tydeligt øverst (Andreas 27/11-2026), så det er
	// til at se, om det er denne måneds rapport. En ny måned giver et nyt dokument.
	const created = report.createdAt
		? new Date(report.createdAt).toLocaleDateString('da-DK', {
				timeZone: 'Europe/Copenhagen',
				day: 'numeric',
				month: 'long',
				year: 'numeric',
			})
		: null

	async function setStatus(key: string, status: WorkStatus) {
		if (busy) return
		const before = work
		setBusy(key)
		setError(null)
		setWork((w) => ({ ...w, [key]: status }))
		try {
			await post({ month: report.month, action: 'work', key, status })
		} catch (err) {
			setWork(before)
			setError(err instanceof Error ? err.message : 'Kunne ikke gemme')
		} finally {
			setBusy(null)
		}
	}

	async function decide(key: string, decision: 'godkendt' | 'afvist' | 'afventer') {
		if (busy) return
		const before = logs
		setBusy(key)
		setError(null)
		setLogs((ls) => ls.map((l) => (l._key === key ? { ...l, status: decision } : l)))
		try {
			await post({ month: report.month, action: 'log', key, decision })
		} catch (err) {
			setLogs(before)
			setError(err instanceof Error ? err.message : 'Kunne ikke gemme')
		} finally {
			setBusy(null)
		}
	}

	const info = { bg: 'var(--st-info-bg)', text: 'var(--st-info-text)', dot: 'var(--st-info-dot)', border: 'var(--st-info-border)' }

	return (
		<section aria-labelledby="scout-heading" className="space-y-4">
			{/* Overblik */}
			<div className={card} style={{ borderColor: accent, boxShadow: `0 0 0 1px ${accent}` }}>
				<div className="flex flex-wrap items-baseline justify-between gap-3">
					<span className={eyebrow}>SEO-spejderen · Rapport for {monthLabel.toLowerCase()}</span>
					{dataMonthLabel && <span className="text-muted text-xs">Tallene er fra {dataMonthLabel.toLowerCase()}</span>}
				</div>
				<h3 id="scout-heading" className="text-foreground mt-2 text-lg font-medium tracking-[-0.01em]">
					{created ? `Gennemgang fra ${created}` : 'Gennemgangen er klar til dig'}
				</h3>
				{report.summary && (
					<p className="text-foreground/80 mt-3 text-sm leading-relaxed whitespace-pre-line">{report.summary}</p>
				)}
				<div className="mt-4 flex flex-wrap gap-2 text-xs">
					{unread > 0 && <Pill color={info}>{unread} at læse</Pill>}
					{approved > 0 && <Pill color={STATUS_META.partial}>{approved} læst, klar til at blive løst</Pill>}
					{pendingLogs > 0 && <Pill color={STATUS_META.partial}>{pendingLogs} logforslag venter</Pill>}
					{unread === 0 && approved === 0 && pendingLogs === 0 && <Pill color={STATUS_META.done}>Alt er læst og løst</Pill>}
				</div>
				{error && (
					<p className="mt-3 text-sm" style={{ color: STATUS_META.missing.text }}>
						{error}
					</p>
				)}
			</div>

			{/* Arbejdslisten */}
			{items.length > 0 && (
				<div className={card}>
					<span className={eyebrow}>Din arbejdsliste</span>
					<p className="text-muted mt-2 text-sm leading-relaxed">
						De blå punkter er nye. Tryk <strong className="text-foreground font-medium">Læst</strong>, når du er enig, så må Claude gå i gang, næste gang du siger "tag månedens gennemgang". Tryk <strong className="text-foreground font-medium">Løst</strong>, når det er gjort. Intet herfra går til kunden.
					</p>
					<ul className="mt-4 space-y-3">
						{items.map((it) => {
							const st = statusOf(it.key)
							const isNew = st === 'ny'
							const isDone = st === 'loest'
							return (
								<li
									key={it.key}
									className="rounded-xl border p-4"
									style={
										isNew
											? { backgroundColor: info.bg, borderColor: info.border }
											: isDone
												? { opacity: 0.6, borderColor: 'color-mix(in srgb, var(--color-foreground) 8%, transparent)' }
												: { borderColor: 'color-mix(in srgb, var(--color-foreground) 8%, transparent)' }
									}
								>
									<div className="flex flex-wrap items-center gap-2">
										<span className="text-[11px] font-medium tracking-[0.1em] uppercase" style={{ color: isNew ? info.text : undefined }}>
											{it.kind}
										</span>
										{it.tag && <Pill color={STATUS_META.done}>{it.tag}</Pill>}
										{!isNew && (
											<Pill color={isDone ? STATUS_META.done : STATUS_META.partial}>{isDone ? 'Løst' : 'Læst · klar til at blive løst'}</Pill>
										)}
									</div>
									<p className="text-foreground mt-1.5 text-[15px] font-medium leading-snug">{it.title}</p>
									{it.text && <p className="text-foreground/85 mt-1.5 text-sm leading-relaxed whitespace-pre-line">{it.text}</p>}
									<div className="mt-3 flex flex-wrap items-center gap-2">
										{isNew && (
											<button
												type="button"
												disabled={busy === it.key}
												onClick={() => setStatus(it.key, 'laest')}
												className="rounded-full px-4 py-1.5 text-sm font-medium"
												style={{ backgroundColor: info.dot, color: '#fff' }}
											>
												Læst
											</button>
										)}
										{!isDone && (
											<button
												type="button"
												disabled={busy === it.key}
												onClick={() => setStatus(it.key, 'loest')}
												className="border-foreground/15 text-foreground rounded-full border bg-white px-4 py-1.5 text-sm"
											>
												Løst
											</button>
										)}
										{!isNew && (
											<button
												type="button"
												disabled={busy === it.key}
												onClick={() => setStatus(it.key, isDone ? 'laest' : 'ny')}
												className="text-muted text-sm underline underline-offset-2"
											>
												Fortryd
											</button>
										)}
									</div>
								</li>
							)
						})}
					</ul>
				</div>
			)}

			{/* Rettelser i Studio */}
			{report.releaseId && (
				<div className={`${card} flex flex-wrap items-center justify-between gap-3 text-sm`}>
					<span>
						<span className="text-foreground font-medium">
							{report.releaseCount ?? 0} {report.releaseCount === 1 ? 'rettelse ligger' : 'rettelser ligger'} klar
						</span>
						<span className="text-muted block">
							I releasen “{report.releaseTitle || 'SEO-spejderen'}”. Intet er live, før du publicerer. Du kan rette eller fjerne den enkelte ændring.
						</span>
					</span>
					<a
						href={STUDIO_RELEASES}
						target="_blank"
						rel="noopener"
						className="border-foreground/15 text-foreground rounded-full border px-4 py-2 text-sm font-medium hover:opacity-80"
					>
						Se rettelserne i Studio
					</a>
				</div>
			)}

			{/* Forslag til aktivitetsloggen */}
			{logs.length > 0 && (
				<div className={card}>
					<span className={eyebrow}>Forslag til aktivitetsloggen</span>
					<p className="text-muted mt-2 text-sm leading-relaxed">
						Kunden ser kun de poster, du godkender. Der sættes aldrig timer på den enkelte post; timerne for gennemgangen lægger du selv ind samlet, når du er færdig.
					</p>
					<ul className="mt-4 space-y-3">
						{logs.map((l) => {
							const status = l.status ?? 'afventer'
							const waiting = status === 'afventer'
							return (
								<li
									key={l._key}
									className="rounded-xl border p-4"
									style={
										waiting
											? { backgroundColor: info.bg, borderColor: info.border }
											: { borderColor: 'color-mix(in srgb, var(--color-foreground) 8%, transparent)' }
									}
								>
									<div className="flex flex-wrap items-baseline justify-between gap-2">
										<span className="text-foreground text-[15px] font-medium">{l.title}</span>
										<span className="text-muted text-xs tabular-nums">{l.date}</span>
									</div>
									<p className="text-foreground/85 mt-1.5 text-sm leading-relaxed whitespace-pre-line">
										{l.description.replace(/\*\*|\+\+/g, '')}
									</p>
									{waiting ? (
										<div className="mt-3 flex flex-wrap items-center gap-2">
											<button
												type="button"
												disabled={busy === l._key}
												onClick={() => decide(l._key, 'godkendt')}
												className="rounded-full px-4 py-1.5 text-sm font-medium"
												style={{ backgroundColor: STATUS_META.done.dot, color: 'var(--color-background)' }}
											>
												Godkend
											</button>
											<button
												type="button"
												disabled={busy === l._key}
												onClick={() => decide(l._key, 'afvist')}
												className="border-foreground/15 text-foreground rounded-full border bg-white px-4 py-1.5 text-sm"
											>
												Afvis
											</button>
										</div>
									) : (
										<div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
											<Pill color={status === 'godkendt' ? STATUS_META.done : STATUS_META.missing}>
												{status === 'godkendt' ? 'Godkendt' : 'Afvist'}
											</Pill>
											<button
												type="button"
												disabled={busy === l._key}
												onClick={() => decide(l._key, 'afventer')}
												className="text-muted underline underline-offset-2"
											>
												Fortryd
											</button>
										</div>
									)}
								</li>
							)
						})}
					</ul>
				</div>
			)}
		</section>
	)
}

function Pill({ color, children }: { color: { bg: string; text: string }; children: React.ReactNode }) {
	return (
		<span className="rounded-full px-2.5 py-1 text-xs font-medium" style={{ backgroundColor: color.bg, color: color.text }}>
			{children}
		</span>
	)
}
