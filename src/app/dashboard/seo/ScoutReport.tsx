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
export type ScoutReportData = {
	month: string
	dataMonth?: string
	createdAt?: string
	summary?: string
	steps?: ScoutStep[]
	actions?: { _key: string; title: string; why?: string; inRelease?: boolean }[]
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

/**
 * SEO-spejderens månedsrapport (Andreas 27/11-2026), kun for Horizen, over
 * Månedens tjekliste på Strategi → Løbende drift. Spejderen har gennemgået
 * tjeklisten den 3.; her ser Andreas resultatet, godkender forslag til
 * aktivitetsloggen og finder rettelserne, der ligger klar i Studio. Ingen
 * kundebesked (Andreas 27/11-2026): kunden informeres via aktivitetsloggen.
 */
export default function ScoutReport({
	report,
	monthLabel,
	dataMonthLabel,
}: {
	report: ScoutReportData
	monthLabel: string
	dataMonthLabel?: string
}) {
	const [logs, setLogs] = useState<ScoutLogDraft[]>(report.logDrafts ?? [])
	const [busy, setBusy] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)

	const steps = report.steps ?? []
	const count = (s: ScoutStep['status']) => steps.filter((x) => x.status === s).length
	const pending = logs.filter((l) => (l.status ?? 'afventer') === 'afventer').length
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

	async function decide(key: string, decision: 'godkendt' | 'afvist' | 'afventer') {
		if (busy) return
		const before = logs
		setBusy(key)
		setError(null)
		setLogs((ls) =>
			ls.map((l) =>
				l._key === key ? { ...l, status: decision } : l,
			),
		)
		try {
			await post({ month: report.month, action: 'log', key, decision })
		} catch (err) {
			setLogs(before)
			setError(err instanceof Error ? err.message : 'Kunne ikke gemme')
		} finally {
			setBusy(null)
		}
	}

	return (
		<section aria-labelledby="scout-heading" className="space-y-4">
			{/* Overblik */}
			<div className={card} style={{ borderColor: accent, boxShadow: `0 0 0 1px ${accent}` }}>
				<div className="flex flex-wrap items-baseline justify-between gap-3">
					<span className={eyebrow}>SEO-spejderen · Rapport for {monthLabel.toLowerCase()}</span>
					{dataMonthLabel && (
						<span className="text-muted text-xs">Tallene er fra {dataMonthLabel.toLowerCase()}</span>
					)}
				</div>
				<h3 id="scout-heading" className="text-foreground mt-2 text-lg font-medium tracking-[-0.01em]">
					{created ? `Gennemgang fra ${created}` : 'Gennemgangen er klar til dig'}
				</h3>
				{report.summary && (
					<p className="text-foreground/80 mt-3 text-sm leading-relaxed whitespace-pre-line">{report.summary}</p>
				)}
				<div className="mt-4 flex flex-wrap gap-2 text-xs">
					<Pill color={STATUS_META.done}>{count('klaret')} klaret af spejderen</Pill>
					<Pill color={STATUS_META.partial}>{count('forberedt')} forberedt til dig</Pill>
					<Pill color={STATUS_META.missing}>{count('dig')} kun dig</Pill>
					{pending > 0 && <Pill color={STATUS_META.partial}>{pending} logforslag venter</Pill>}
				</div>
				{error && (
					<p className="mt-3 text-sm" style={{ color: STATUS_META.missing.text }}>
						{error}
					</p>
				)}
			</div>

			{/* Handlinger og rettelser */}
			{(report.actions?.length || report.releaseId) && (
				<div className={card}>
					<span className={eyebrow}>Det foreslår spejderen, vi går i gang med</span>
					{report.actions?.length ? (
						<ol className="mt-3 space-y-3">
							{report.actions.map((a, i) => (
								<li key={a._key} className="flex gap-3 text-sm">
									<span className="text-foreground/55 w-5 shrink-0 font-medium tabular-nums">{i + 1}.</span>
									<span>
										<span className="text-foreground font-medium">{a.title}</span>
										{a.inRelease && (
											<span
												className="ml-2 rounded-full px-2 py-0.5 text-[11px] font-medium"
												style={{ backgroundColor: STATUS_META.done.bg, color: STATUS_META.done.text }}
											>
												Ligger klar som rettelse
											</span>
										)}
										{a.why && <span className="text-muted mt-1 block leading-relaxed">{a.why}</span>}
									</span>
								</li>
							))}
						</ol>
					) : null}
					{report.releaseId && (
						<div className="bg-foreground/[0.03] mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl p-4 text-sm">
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
							return (
								<li key={l._key} className="border-foreground/[0.08] rounded-xl border p-4">
									<div className="flex flex-wrap items-baseline justify-between gap-2">
										<span className="text-foreground text-sm font-medium">{l.title}</span>
										<span className="text-muted text-xs tabular-nums">{l.date}</span>
									</div>
									<p className="text-muted mt-1 text-sm leading-relaxed whitespace-pre-line">
										{l.description.replace(/\*\*|\+\+/g, '')}
									</p>
									{status === 'afventer' ? (
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
												className="border-foreground/15 text-foreground rounded-full border px-4 py-1.5 text-sm"
											>
												Afvis
											</button>
										</div>
									) : (
										<div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
											<Pill color={status === 'godkendt' ? STATUS_META.done : STATUS_META.missing}>
												{status === 'godkendt'
													? 'Godkendt'
													: 'Afvist'}
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
		<span className="rounded-full px-2.5 py-1 font-medium" style={{ backgroundColor: color.bg, color: color.text }}>
			{children}
		</span>
	)
}
