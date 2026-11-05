'use client'

import { useState } from 'react'
import { ink as platinumBlueBase, muted, withAlpha } from './_tokens'

/**
 * Status for SEO-tjekket øverst på "Teknisk SEO": hvornår det sidst er kørt,
 * og hvad det fandt.
 *
 * Data: Sanity-dokumentet `seo-check-latest` (type seoCheckRun), skrevet af
 * `npm run seo:check:report` (kører mod det live site med den indloggede
 * Sanity-bruger, så der skal ingen token oprettes). Køres på anmodning og før
 * merge. Automatisk kørsel via GitHub er bevidst udskudt (kræver en
 * Sanity-token pr. projekt).
 */

export type SeoCheckFinding = {
	_key?: string
	page: string
	rule?: string
	message: string
	severity: 'error' | 'warning'
}

export type SeoCheckRun = {
	ranAt: string
	trigger: 'deploy' | 'weekly' | 'manual'
	url?: string
	pages: number
	errors: number
	warnings: number
	runUrl?: string
	findings: SeoCheckFinding[]
}

const TONE = {
	ok: { dot: 'var(--st-done-dot)', bg: 'var(--st-done-bg)', text: 'var(--st-done-text)', border: 'var(--st-done-border)' },
	error: { dot: 'var(--st-missing-dot)', bg: 'var(--st-missing-bg)', text: 'var(--st-missing-text)', border: 'var(--st-missing-border)' },
	warn: { dot: 'var(--st-partial-dot)', bg: 'var(--st-partial-bg)', text: 'var(--st-partial-text)', border: 'var(--st-partial-border)' },
	none: { dot: 'var(--st-later-dot)', bg: 'var(--st-later-bg)', text: 'var(--st-later-text)', border: 'var(--st-later-border)' },
}

const TRIGGER_TEXT: Record<SeoCheckRun['trigger'], string> = {
	deploy: 'kørt før opdatering af sitet',
	weekly: 'ugentligt tjek af live-sitet',
	manual: 'kørt mod det live site',
}

const fmt = (iso: string, withTime = true) =>
	new Date(iso).toLocaleString('da-DK', {
		timeZone: 'Europe/Copenhagen',
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
	})

/** Kort forklaring på kortet: hvad tjekket er, og hvad det ikke er. */
const DESCRIPTION =
	'Et internt værktøj, der holder styr på sitets SEO, efterhånden som sitet vokser. Det tjekker, at de søgeord, vi har valgt til hver side, faktisk står på siden i titel, overskrift og beskrivelse. Ændrer vi strategi eller søgeord, kører vi tjekket, så planen og siderne altid er synkroniseret. Samtidig fanger det tekniske fejl som manglende overskrifter og døde links. Det måler ikke placeringer i Google og vurderer ikke, om teksterne er gode.'

export default function SeoCheckStatus({ run }: { run: SeoCheckRun | null }) {
	const state: keyof typeof TONE = !run ? 'none' : run.errors > 0 ? 'error' : 'ok'
	const [open, setOpen] = useState(state === 'error')
	const t = TONE[state]

	const headline = !run ? 'Endnu ikke kørt' : state === 'error' ? `${run.errors} fejl fundet` : 'Alt i orden'

	const shown = run ? run.findings.filter((f) => (state === 'error' ? true : f.severity === 'warning')) : []
	const sorted = [...shown].sort((a, b) => (a.severity === b.severity ? 0 : a.severity === 'error' ? -1 : 1))

	return (
		<div className="rounded-2xl bg-white p-6" style={{ boxShadow: `0 1px 3px ${withAlpha(platinumBlueBase, 0.06)}` }}>
			<div className="flex flex-wrap items-start justify-between gap-6">
				<div className="flex items-start gap-4">
					<span
						className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
						style={{ backgroundColor: t.bg, border: `1px solid ${t.border}` }}
						aria-hidden
					>
						{state === 'ok' ? (
							<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={t.dot} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
								<path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
							</svg>
						) : (
							<span className="text-sm font-semibold" style={{ color: t.dot }}>
								{state === 'none' ? '…' : '!'}
							</span>
						)}
					</span>
					<div>
						<span className="text-xs font-medium tracking-[0.15em] uppercase" style={{ color: withAlpha(platinumBlueBase, 0.5) }}>
							SEO-tjek
						</span>
						<h3 className="mt-1 text-xl font-medium tracking-[-0.02em]" style={{ color: platinumBlueBase }}>
							{headline}
						</h3>
						<p className="mt-1 text-sm" style={{ color: muted }}>
							{run ? (
								<>
									Senest kørt {fmt(run.ranAt)} · {TRIGGER_TEXT[run.trigger] ?? TRIGGER_TEXT.manual}
								</>
							) : (
								'Tjekket er ikke kørt endnu. Det køres før opdateringer af sitet og på anmodning.'
							)}
						</p>
					</div>
				</div>
			</div>

			<p className="mt-4 max-w-3xl text-sm leading-relaxed" style={{ color: muted }}>
				{DESCRIPTION}
			</p>

			{run && (
				<div className="mt-5 flex flex-wrap items-center gap-2">
					<Chip label={`${run.pages} sider tjekket`} />
					<Chip label={`${run.errors} fejl`} tone={run.errors ? TONE.error : undefined} />
					<Chip label={`${run.warnings} advarsler`} tone={run.warnings ? TONE.warn : undefined} />
					{run.runUrl && (
						<a href={run.runUrl} target="_blank" rel="noreferrer" className="ml-1 text-xs font-medium underline underline-offset-2" style={{ color: platinumBlueBase }}>
							Se kørslen på GitHub
						</a>
					)}
				</div>
			)}

			{state === 'error' && (
				<p className="mt-5 rounded-xl p-4 text-sm leading-relaxed" style={{ backgroundColor: t.bg, color: t.text, border: `1px solid ${t.border}` }}>
					Fejlene bliver rettet. Siderne virker stadig, men de er ikke optimeret til Google, før rettelsen er ude.
				</p>
			)}

			{sorted.length > 0 && (
				<div className="mt-5 border-t pt-4" style={{ borderColor: withAlpha(platinumBlueBase, 0.08) }}>
					<button type="button" onClick={() => setOpen((o) => !o)} className="text-sm font-medium" style={{ color: platinumBlueBase }}>
						{open ? 'Skjul detaljer' : `Se ${sorted.length === 1 ? 'detaljen' : `de ${sorted.length} detaljer`}`}
					</button>
					{open && (
						<ul className="mt-3 space-y-2">
							{sorted.map((f, i) => (
								<li key={f._key ?? `${f.page}-${i}`} className="flex gap-3 text-sm">
									<span
										className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
										style={{ backgroundColor: f.severity === 'error' ? TONE.error.dot : TONE.warn.dot }}
									/>
									<span style={{ color: muted }}>
										<span className="font-medium" style={{ color: platinumBlueBase }}>
											{f.page}
										</span>{' '}
										{f.message}
									</span>
								</li>
							))}
						</ul>
					)}
				</div>
			)}
		</div>
	)
}

function Chip({ label, tone }: { label: string; tone?: { bg: string; text: string; border: string } }) {
	return (
		<span
			className="rounded-full px-3 py-1 text-xs font-medium"
			style={{
				backgroundColor: tone?.bg ?? withAlpha(platinumBlueBase, 0.05),
				color: tone?.text ?? platinumBlueBase,
				border: `1px solid ${tone?.border ?? 'transparent'}`,
			}}
		>
			{label}
		</span>
	)
}
