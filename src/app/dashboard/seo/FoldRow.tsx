'use client'

import { useState, type ReactNode } from 'react'
import { ink, muted, white, withAlpha } from './_tokens'

/**
 * Fælles foldet række til dashboardets arbejdslister (Teknisk SEO og Plan).
 *
 * Sammenfoldet vises kun det, man skimmer efter: titel og en linje med
 * status, prioritet, dato og alder. De lange tekster ligger i `children` og
 * vises først, når rækken foldes ud.
 */

const MONTHS = [
	'jan.',
	'feb.',
	'mar.',
	'apr.',
	'maj',
	'jun.',
	'jul.',
	'aug.',
	'sep.',
	'okt.',
	'nov.',
	'dec.',
]

/** Punkter, der har været åbne så længe, får et alders-mærke. */
export const STALE_MONTHS = 3

/** "4. okt. 2026", kort og læsbart i en tæt liste. */
export function formatAdded(iso: string): string {
	const [y, m, d] = iso.split('-').map(Number)
	if (!y || !m || !d) return iso
	return `${d}. ${MONTHS[m - 1]} ${y}`
}

/** Hele måneder siden datoen. */
export function monthsSince(iso: string, now: Date): number {
	const [y, m, d] = iso.split('-').map(Number)
	if (!y || !m || !d) return 0
	let months = (now.getFullYear() - y) * 12 + (now.getMonth() + 1 - m)
	if (now.getDate() < d) months -= 1
	return Math.max(0, months)
}

/**
 * Dato + evt. alders-mærke til meta-linjen i en FoldRow.
 * `pending` = punktet er ikke løst endnu; kun de får alders-mærket.
 */
export function AddedMeta({
	addedAt,
	pending,
	now,
}: {
	addedAt?: string
	pending: boolean
	now: Date
}) {
	if (!addedAt) return null
	const age = monthsSince(addedAt, now)
	return (
		<>
			<span className="tabular-nums">Tilføjet {formatAdded(addedAt)}</span>
			{pending && age >= STALE_MONTHS && (
				<span
					className="rounded-full px-2 py-0.5 font-medium tabular-nums"
					style={{ backgroundColor: withAlpha(ink, 0.06), color: muted }}
				>
					{age} mdr. gammel
				</span>
			)}
		</>
	)
}

/** Lille farvet status-prik med tekst. */
export function Dot({
	color,
	children,
}: {
	color: string
	children: ReactNode
}) {
	return (
		<span
			className="inline-flex items-center gap-1.5 font-medium"
			style={{ color }}
		>
			<span
				className="h-1.5 w-1.5 rounded-full"
				style={{ backgroundColor: color }}
			/>
			{children}
		</span>
	)
}

export default function FoldRow({
	eyebrow,
	title,
	meta,
	children,
}: {
	eyebrow?: string
	title: string
	meta: ReactNode
	children: ReactNode
}) {
	const [open, setOpen] = useState(false)

	return (
		<div
			className="border-foreground/[0.08] overflow-hidden rounded-2xl border"
			style={{ backgroundColor: white }}
		>
			<button
				type="button"
				onClick={() => setOpen(!open)}
				aria-expanded={open}
				className="flex w-full items-start justify-between gap-4 p-5 text-left transition-colors hover:bg-black/[0.015]"
			>
				<span className="min-w-0">
					{eyebrow && (
						<span className="text-foreground/50 mb-1.5 block text-xs font-medium tracking-[0.15em] uppercase">
							{eyebrow}
						</span>
					)}
					<span className="text-foreground block text-base font-medium tracking-[-0.01em]">
						{title}
					</span>
					<span
						className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs"
						style={{ color: muted }}
					>
						{meta}
					</span>
				</span>
				<svg
					viewBox="0 0 24 24"
					className="mt-1 size-4 shrink-0 transition-transform"
					style={{
						transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
						color: withAlpha(ink, 0.45),
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

			{open && <div className="px-5 pb-5">{children}</div>}
		</div>
	)
}

/** Knap der viser en sammenfoldet gruppe af løste punkter. */
export function ShowDoneButton({
	count,
	label,
	onClick,
}: {
	count: number
	label: string
	onClick: () => void
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="text-foreground rounded-full px-4 py-2 text-xs font-medium transition-colors"
			style={{ backgroundColor: withAlpha(ink, 0.06) }}
		>
			Vis {count} {label}
		</button>
	)
}
