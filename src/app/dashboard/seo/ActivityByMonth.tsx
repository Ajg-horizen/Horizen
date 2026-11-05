'use client'

import { useState } from 'react'
import { ink, muted, accent, withAlpha } from './_tokens'
import type { ActivityEntry, ActivityKind } from './data'

const KIND_META: Record<ActivityKind, { label: string; bg: string; text: string }> = {
	seo: { label: 'SEO', bg: 'var(--st-done-bg)', text: 'var(--st-done-text)' },
	udvikling: { label: 'Udvikling', bg: 'var(--st-info-bg)', text: 'var(--st-info-text)' },
}

/** Lille mærke på en log-post: "SEO" eller "Udvikling". */
export function ActivityKindTag({ kind, className = '' }: { kind: ActivityKind; className?: string }) {
	const m = KIND_META[kind]
	return (
		<span
			className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${className}`}
			style={{ backgroundColor: m.bg, color: m.text }}
		>
			{m.label}
		</span>
	)
}

/** 'ÅÅÅÅ-MM-DD' -> 'ÅÅÅÅ-MM' */
function monthKey(date: string) {
	return date.slice(0, 7)
}

/** 'ÅÅÅÅ-MM' -> 'Juni 2026' (stort begyndelsesbogstav) */
function monthLabel(key: string) {
	const label = new Date(`${key}-01T00:00:00`).toLocaleDateString('da-DK', {
		month: 'long',
		year: 'numeric',
	})
	return label.charAt(0).toUpperCase() + label.slice(1)
}

function MonthEntries({ entries }: { entries: ActivityEntry[] }) {
	return (
		<ol className="space-y-0">
			{entries.map((entry, i) => {
				const isLast = i === entries.length - 1
				const date = new Date(entry.date).toLocaleDateString('da-DK', {
					day: 'numeric',
					month: 'long',
					year: 'numeric',
				})
				return (
					<li key={`${entry.date}-${entry.title}`} className="flex gap-4">
						<div className="flex flex-col items-center">
							<span
								className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
								style={{ backgroundColor: accent }}
							/>
							{!isLast && (
								<span
									className="w-px flex-1"
									style={{ backgroundColor: withAlpha(ink, 0.12) }}
								/>
							)}
						</div>
						<div className={isLast ? 'pb-0' : 'pb-6'}>
							<div className="flex flex-wrap items-baseline gap-2.5">
								<h4
									className="text-base font-medium tracking-[-0.01em]"
									style={{ color: ink }}
								>
									{entry.title}
								</h4>
								<span className="text-xs" style={{ color: muted }}>
									{date}
								</span>
								{entry.kind && <ActivityKindTag kind={entry.kind} />}
								{typeof entry.hours === 'number' && (
									<span
										className="rounded-full px-2 py-0.5 text-xs font-medium"
										style={{
											backgroundColor: withAlpha(ink, 0.06),
											color: muted,
										}}
									>
										Opgavetid: {entry.hours} t
									</span>
								)}
							</div>
							<p
								className="mt-1.5 text-sm leading-relaxed"
								style={{ color: muted }}
							>
								{entry.description}
							</p>
						</div>
					</li>
				)
			})}
		</ol>
	)
}

/**
 * Aktivitet grupperet pr. måned som en eksklusiv accordion: hver måned er en
 * foldbar sektion, kun én åben ad gangen. Data-drevet (kun måneder med poster
 * vises; nye måneder dukker op af sig selv). Default = nyeste måned foldet ud,
 * så listen ikke bliver en lang scroll.
 */
export default function ActivityByMonth({ items }: { items: ActivityEntry[] }) {
	const groups = new Map<string, ActivityEntry[]>()
	for (const item of items) {
		const k = monthKey(item.date)
		const arr = groups.get(k)
		if (arr) arr.push(item)
		else groups.set(k, [item])
	}
	const months = [...groups.keys()].sort().reverse() // nyeste først
	const [open, setOpen] = useState<string | null>(months[0] ?? null)

	return (
		<div className="space-y-3">
			{months.map((k) => {
				const isOpen = open === k
				const entries = groups.get(k) ?? []
				return (
					<div
						key={k}
						className="overflow-hidden rounded-2xl bg-white"
						style={{
							border: `1px solid ${withAlpha(ink, 0.08)}`,
						}}
					>
						<button
							type="button"
							onClick={() => setOpen(isOpen ? null : k)}
							aria-expanded={isOpen}
							className="flex w-full items-center justify-between px-5 py-4 text-left"
						>
							<span className="flex items-center gap-3">
								<span
									className="text-base font-medium tracking-[-0.01em]"
									style={{ color: ink }}
								>
									{monthLabel(k)}
								</span>
								<span
									className="rounded-full px-2 py-0.5 text-xs font-medium"
									style={{
										backgroundColor: withAlpha(accent, 0.1),
										color: accent,
									}}
								>
									{entries.length}
								</span>
							</span>
							<svg
								viewBox="0 0 24 24"
								className="h-4 w-4 transition-transform"
								style={{
									color: withAlpha(ink, 0.5),
									transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
								}}
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								aria-hidden="true"
							>
								<path d="m6 9 6 6 6-6" />
							</svg>
						</button>

						{isOpen && (
							<div className="px-5 pb-5">
								<MonthEntries entries={entries} />
							</div>
						)}
					</div>
				)
			})}
		</div>
	)
}
