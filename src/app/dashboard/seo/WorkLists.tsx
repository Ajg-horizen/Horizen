'use client'

import { useState } from 'react'
import type { ActionItem, SeoPriority, TechnicalItem } from './data'
import FoldRow, { AddedMeta, Dot, ShowDoneButton } from './FoldRow'
import { LATER_META, STATUS_META } from './statusMeta'
import { muted } from './_tokens'

/**
 * Dashboardets arbejdslister som foldede rækker: Teknisk SEO og Plan-fanens
 * action items. Åbne punkter står øverst (høj prioritet først); de løste er
 * foldet væk bag en knap, så listen viser det, der skal laves.
 */

const PRIORITY_META: Record<SeoPriority, { label: string; color: string }> = {
	high: { label: 'Høj prioritet', color: 'var(--st-missing-dot)' },
	medium: { label: 'Mellem prioritet', color: 'var(--st-partial-dot)' },
	low: { label: 'Lav prioritet', color: 'var(--st-later-dot)' },
}

const PRIORITY_ORDER: Record<SeoPriority, number> = {
	high: 0,
	medium: 1,
	low: 2,
}
const byPriority = (
	a: { priority: SeoPriority },
	b: { priority: SeoPriority },
) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]

function GroupHeading({
	dot,
	title,
	count,
}: {
	dot: string
	title: string
	count: number
}) {
	return (
		<div className="mb-4 flex items-baseline gap-3">
			<span
				className="h-2.5 w-2.5 rounded-full"
				style={{ backgroundColor: dot }}
			/>
			<h3 className="text-foreground text-lg font-medium tracking-[-0.01em]">
				{title}
			</h3>
			<span className="text-xs tabular-nums" style={{ color: muted }}>
				{count}
			</span>
		</div>
	)
}

/* ─── Teknisk SEO ───────────────────────────────────────────── */

function TechnicalRow({ item, now }: { item: TechnicalItem; now: Date }) {
	// Samme 'Senere'-markering som tællerne øverst.
	const later = item.status === 'missing' && !!item.later
	const status = later
		? { label: LATER_META.label, color: LATER_META.text }
		: {
				label: STATUS_META[item.status].label,
				color: STATUS_META[item.status].dot,
			}
	const p = PRIORITY_META[item.priority]

	return (
		<FoldRow
			eyebrow={item.category}
			title={item.title}
			meta={
				<>
					<Dot color={status.color}>{status.label}</Dot>
					<span style={{ color: p.color }}>{p.label}</span>
					<AddedMeta
						addedAt={item.addedAt}
						pending={item.status !== 'done'}
						now={now}
					/>
				</>
			}
		>
			<p className="text-foreground text-sm leading-relaxed">
				<span className="font-medium">Handling: </span>
				{item.action}
			</p>
			<p className="mt-2 text-xs leading-relaxed" style={{ color: muted }}>
				{item.finding}
			</p>
		</FoldRow>
	)
}

const OPEN_GROUPS: {
	key: string
	title: string
	description: string
	dot: string
	match: (i: TechnicalItem) => boolean
}[] = [
	{
		key: 'missing',
		title: 'Mangler',
		description: 'Skal løses, for at SEO-grundlaget er på plads.',
		dot: STATUS_META.missing.dot,
		match: (i) => i.status === 'missing' && !i.later,
	},
	{
		key: 'partial',
		title: 'I gang',
		description: 'Delvist på plads, mangler en sidste hånd.',
		dot: STATUS_META.partial.dot,
		match: (i) => i.status === 'partial',
	},
	{
		key: 'later',
		title: 'Senere',
		description:
			'Mangler, men hører til et senere tidspunkt (fx når bloggen eller sprogmodulet kommer).',
		dot: LATER_META.dot,
		match: (i) => i.status === 'missing' && !!i.later,
	},
]

export function TechnicalList({
	items,
	now,
}: {
	items: TechnicalItem[]
	now: string
}) {
	const [showDone, setShowDone] = useState(false)
	const today = new Date(now)
	const doneItems = items.filter((i) => i.status === 'done').sort(byPriority)

	return (
		<div className="space-y-10">
			{OPEN_GROUPS.map((group) => {
				const groupItems = items.filter(group.match).sort(byPriority)
				if (groupItems.length === 0) return null
				return (
					<div key={group.key}>
						<GroupHeading
							dot={group.dot}
							title={group.title}
							count={groupItems.length}
						/>
						<p className="-mt-2 mb-4 text-sm" style={{ color: muted }}>
							{group.description}
						</p>
						<div className="space-y-2">
							{groupItems.map((item) => (
								<TechnicalRow key={item.title} item={item} now={today} />
							))}
						</div>
					</div>
				)
			})}

			{doneItems.length > 0 &&
				(showDone ? (
					<div>
						<GroupHeading
							dot={STATUS_META.done.dot}
							title="Færdige"
							count={doneItems.length}
						/>
						<div className="space-y-2">
							{doneItems.map((item) => (
								<TechnicalRow key={item.title} item={item} now={today} />
							))}
						</div>
					</div>
				) : (
					<ShowDoneButton
						count={doneItems.length}
						label="færdige punkter"
						onClick={() => setShowDone(true)}
					/>
				))}
		</div>
	)
}

/* ─── Plan: action items ────────────────────────────────────── */

export function ActionList({
	items,
	now,
}: {
	items: ActionItem[]
	now: string
}) {
	const [showDone, setShowDone] = useState(false)
	const today = new Date(now)
	const open = items.filter((i) => !i.done).sort(byPriority)
	const done = items.filter((i) => i.done)

	const row = (item: ActionItem) => {
		const p = PRIORITY_META[item.priority]
		return (
			<FoldRow
				key={item.title}
				title={item.title}
				meta={
					<>
						{item.done ? (
							<Dot color={STATUS_META.done.dot}>Færdig</Dot>
						) : (
							<Dot color={p.color}>{p.label}</Dot>
						)}
						<AddedMeta
							addedAt={item.addedAt}
							pending={!item.done}
							now={today}
						/>
					</>
				}
			>
				<p className="text-sm leading-relaxed" style={{ color: muted }}>
					{item.description}
				</p>
			</FoldRow>
		)
	}

	return (
		<div className="space-y-4">
			<div className="space-y-2">{open.map(row)}</div>
			{done.length > 0 &&
				(showDone ? (
					<div className="space-y-2">{done.map(row)}</div>
				) : (
					<ShowDoneButton
						count={done.length}
						label="løste opgaver"
						onClick={() => setShowDone(true)}
					/>
				))}
		</div>
	)
}
