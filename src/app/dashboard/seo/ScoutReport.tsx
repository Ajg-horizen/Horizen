'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { accent } from './_tokens'
import { STATUS_META } from './statusMeta'

/** Navnet, agenten skriver i doneBy, når den sætter et flueben i tjeklisten. */
export const SCOUT_NAME = 'SEO-spejderen'

// Trinnummeret i en logposts titel ("Månedens gennemgang, trin 4: …"). Poster uden trin
// kommer sidst. Samme regel som i page.tsx (en server-fil kan ikke kalde denne).
const trinNo = (t: string) => Number(/trin\s+(\d+)/i.exec(t)?.[1] ?? 999)

/** Releases i Studio (Horizens Studio har to arbejdsområder; rettelserne laves mod det live (production)). */
const STUDIO_RELEASES = '/admin/production/releases'

export type ScoutStep = { stepId: string; status: 'klaret' | 'forberedt' | 'dig'; note?: string }
export type ScoutLogDraft = {
	_key: string
	date: string
	title: string
	description: string
	kind?: 'seo' | 'udvikling'
	/** godkendt = enig, men ikke i loggen endnu; tilfoejet = sendt til loggen samlet. */
	status?: 'afventer' | 'godkendt' | 'tilfoejet' | 'afvist'
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
 * Månedens gennemgang. Rapporten er FORARBEJDE til Andreas' og Claudes fælles
 * gennemgang, ikke en ny arbejdsgang: knappen "Start gennemgangen med Claude"
 * kopierer en besked, han sætter ind i en samtale, og så tager de tjeklisten
 * punkt for punkt som altid. Punkter, de har løst, markerer Claude som løst
 * (work: loest), så de ikke overføres til næste måned. Intet herfra går til
 * kunden eller til Vores opgaver. Nederst forslag til aktivitetsloggen
 * (Godkend/Afvis, aldrig timer pr. post) og evt. rettelser i Studio.
 */
export default function ScoutReport({
	report,
	monthLabel,
	dataMonthLabel,
	stepTitles,
	clientName,
}: {
	report: ScoutReportData
	monthLabel: string
	dataMonthLabel?: string
	/** Trinenes navne fra tjeklisten, nøglet på stepId. */
	stepTitles: Record<string, string>
	/** Kundens navn (brand.client), bruges i beskeden til Claude. */
	clientName: string
}) {
	const [logs, setLogs] = useState<ScoutLogDraft[]>(report.logDrafts ?? [])
	const work: Record<string, WorkStatus> = Object.fromEntries((report.work ?? []).map((w) => [w._key, w.status]))
	const [copied, setCopied] = useState<string | null>(null)
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
	const open = items.filter((i) => statusOf(i.key) !== 'loest')
	const solved = items.length - open.length
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

	// Beskeden, Andreas sætter ind i en ny samtale med Claude (Andreas 27/11-2026):
	// så tager de gennemgangen sammen ud fra spejderens fund, som han plejer.
	const startPrompt = `Tag månedens gennemgang for ${clientName} ud fra SEO-spejderens rapport (seo-scout.${report.month}${created ? `, lavet ${created}` : ''}). Gå tjeklisten igennem med mig punkt for punkt, og skriv mine beslutninger ind i spejderens beslutningslog bagefter.`

	async function copyStart() {
		setError(null)
		try {
			await navigator.clipboard.writeText(startPrompt)
			setCopied('Kopieret. Sæt den ind i en ny samtale med Claude.')
		} catch {
			setCopied(null)
			setError('Kunne ikke kopiere. Markér teksten herunder og kopiér den selv.')
		}
	}

	// Alle godkendte poster sendes til aktivitetsloggen på én gang, når gennemgangen
	// er færdig, så de står i trin-rækkefølge, uanset hvilken rækkefølge de blev
	// godkendt i (Andreas 27/11-2026). "Godkend" alene poster intet.
	const router = useRouter()
	const approvedLogs = logs.filter((l) => l.status === 'godkendt').length
	const shownLogs = [...logs].sort((a, b) => trinNo(a.title) - trinNo(b.title))
	async function postApproved() {
		if (busy || !approvedLogs) return
		const before = logs
		setBusy('post')
		setError(null)
		setLogs((ls) => ls.map((l) => (l.status === 'godkendt' ? { ...l, status: 'tilfoejet' } : l)))
		try {
			await post({ month: report.month, action: 'post-logs' })
			router.refresh() // så posterne står i aktivitetsloggen med det samme
		} catch (err) {
			setLogs(before)
			setError(err instanceof Error ? err.message : 'Kunne ikke tilføje til aktivitetsloggen')
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
					{open.length > 0 && <Pill color={info}>{open.length} fund at gennemgå</Pill>}
					{solved > 0 && <Pill color={STATUS_META.done}>{solved} løst</Pill>}
					{pendingLogs > 0 && <Pill color={STATUS_META.partial}>{pendingLogs} logforslag venter</Pill>}
				</div>
				<div className="mt-5 flex flex-wrap items-center gap-3">
					<button
						type="button"
						onClick={copyStart}
						className="rounded-full px-5 py-2 text-sm font-medium"
						style={{ backgroundColor: info.dot, color: '#fff' }}
					>
						Start gennemgangen med Claude
					</button>
					<span className="text-muted text-sm">
						{copied ?? 'Kopierer en besked, du sætter ind i en ny samtale. Så tager I tjeklisten sammen, som du plejer.'}
					</span>
				</div>
				{error && <p className="text-muted mt-2 text-xs select-all">{startPrompt}</p>}
				{error && (
					<p className="mt-3 text-sm" style={{ color: STATUS_META.missing.text }}>
						{error}
					</p>
				)}
			</div>

			{/* Arbejdslisten */}
			{items.length > 0 && (
				<div className={card}>
					<span className={eyebrow}>Det fandt spejderen</span>
					<p className="text-muted mt-2 text-sm leading-relaxed">
						Udgangspunktet for jeres gennemgang. Punkter, I løser sammen, bliver markeret som løst, så de ikke kommer igen næste måned. Intet herfra går til kunden.
					</p>
					<ul className="mt-4 space-y-3">
						{items.map((it) => {
							const st = statusOf(it.key)
							const isDone = st === 'loest'
							const isNew = !isDone
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
										{isDone && <Pill color={STATUS_META.done}>Løst</Pill>}
									</div>
									<p className="text-foreground mt-1.5 text-[15px] font-medium leading-snug">{it.title}</p>
									{it.text && <p className="text-foreground/85 mt-1.5 text-sm leading-relaxed whitespace-pre-line">{it.text}</p>}
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
						Godkend dem, du er enig i, i den rækkefølge du vil. Intet kommer i aktivitetsloggen, før du trykker <strong className="text-foreground font-medium">Tilføj til aktivitetsloggen</strong>; så kommer alle de godkendte samlet og altid i trin-rækkefølge. Kunden ser kun dem. Aldrig timer pr. post.
					</p>
					{approvedLogs > 0 && (
						<div className="mt-4 flex flex-wrap items-center gap-3">
							<button
								type="button"
								disabled={busy === 'post'}
								onClick={postApproved}
								className="rounded-full px-5 py-2 text-sm font-medium"
								style={{ backgroundColor: STATUS_META.done.dot, color: 'var(--color-background)' }}
							>
								Tilføj {approvedLogs} {approvedLogs === 1 ? 'godkendt post' : 'godkendte poster'} til aktivitetsloggen
							</button>
							<span className="text-muted text-sm">Tryk, når I er færdige med gennemgangen.</span>
						</div>
					)}
					<ul className="mt-4 space-y-3">
						{shownLogs.map((l) => {
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
											<Pill
												color={
													status === 'tilfoejet' ? STATUS_META.done : status === 'godkendt' ? STATUS_META.partial : STATUS_META.missing
												}
											>
												{status === 'tilfoejet'
													? 'Tilføjet til aktivitetsloggen'
													: status === 'godkendt'
														? 'Godkendt · ikke tilføjet endnu'
														: 'Afvist'}
											</Pill>
											{status !== 'tilfoejet' && (
												<button
													type="button"
													disabled={busy === l._key}
													onClick={() => decide(l._key, 'afventer')}
													className="text-muted underline underline-offset-2"
												>
													Fortryd
												</button>
											)}
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
