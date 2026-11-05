'use client'

import { useState } from 'react'
import { keywordMetrics, type PageDetail, type SeoStatus } from './data'
import { STATUS_META, StatusBadge } from './statusMeta'
import { ink, muted, white, withAlpha } from './_tokens'

/** Målgruppe for sider uden `segment`, når andre sider har en. */
const OTHER_SEGMENT = 'Øvrige'

/* ─── Småkomponenter ────────────────────────────────────────── */

function CheckIcon() {
	return (
		<svg
			viewBox="0 0 16 16"
			className="mt-0.5 h-3.5 w-3.5 shrink-0"
			fill="none"
			aria-hidden="true"
		>
			<path
				d="M3 8.5l3 3L13 4.5"
				stroke={STATUS_META.done.dot}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}

function PendingIcon() {
	return (
		<span
			className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full border-2"
			style={{ borderColor: STATUS_META.missing.dot }}
			aria-hidden="true"
		/>
	)
}

function Label({ children }: { children: React.ReactNode }) {
	return (
		<span className="text-foreground/50 text-xs font-medium tracking-[0.15em] uppercase">
			{children}
		</span>
	)
}

function Tag({
	children,
	title,
	warn = false,
}: {
	children: React.ReactNode
	title?: string
	warn?: boolean
}) {
	return (
		<span
			className="rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap"
			style={
				warn
					? {
							backgroundColor: STATUS_META.partial.bg,
							color: STATUS_META.partial.text,
							border: `1px solid ${STATUS_META.partial.border}`,
						}
					: {
							backgroundColor: withAlpha(ink, 0.06),
							color: withAlpha(ink, 0.65),
						}
			}
			title={title}
		>
			{children}
		</span>
	)
}

const NOINDEX_TITLE =
	'Bevidst holdt ude af Google, fx en landingsside til annoncer, så den ikke konkurrerer med en anden side om samme søgeord.'

const MONTHS_DA = [
	'januar',
	'februar',
	'marts',
	'april',
	'maj',
	'juni',
	'juli',
	'august',
	'september',
	'oktober',
	'november',
	'december',
]

/** 'ÅÅÅÅ-MM-DD' → 'D. måned ÅÅÅÅ' (uden locale-afhængighed). */
function formatDateDa(iso: string) {
	const [y, m, d] = iso.split('-').map(Number)
	return `${d}. ${MONTHS_DA[(m ?? 1) - 1] ?? ''} ${y}`
}

/** Grønt "tjekket med data · dato" eller gråt "hypotese", så man ser om et søgeord er kontrolleret. */
function KeywordCheckBadge({ verifiedDate }: { verifiedDate?: string }) {
	if (verifiedDate) {
		return (
			<span
				className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium"
				style={{
					backgroundColor: STATUS_META.done.bg,
					color: STATUS_META.done.text,
					border: `1px solid ${STATUS_META.done.border}`,
				}}
			>
				<span
					className="h-1.5 w-1.5 rounded-full"
					style={{ backgroundColor: STATUS_META.done.dot }}
				/>
				Tjekket med data · {formatDateDa(verifiedDate)}
			</span>
		)
	}
	return (
		<span
			className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
			style={{
				backgroundColor: withAlpha(ink, 0.04),
				color: muted,
				border: `1px solid ${withAlpha(ink, 0.1)}`,
			}}
		>
			Hypotese, ikke tjekket endnu
		</span>
	)
}

/** Fjern parentes-suffiks som "(lavt volumen)" før opslag i keywordMetrics. */
function cleanKeyword(kw: string): string {
	return kw.replace(/\s*\([^)]*\)\s*$/, '').trim()
}

/** Farve på SD-tallet: grøn = let, gul = middel, rød = svær. */
function sdColor(sd: number): string {
	if (sd < 20) return STATUS_META.done.text
	if (sd < 40) return STATUS_META.partial.text
	return STATUS_META.missing.text
}

function KeywordPill({
	keyword,
	primary = false,
}: {
	keyword: string
	primary?: boolean
}) {
	const metric = keywordMetrics[cleanKeyword(keyword)]
	return (
		<span
			className={`bg-foreground/[0.04] text-foreground inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 ${
				primary ? 'text-sm font-medium' : 'text-xs'
			}`}
		>
			{keyword}
			{metric && (
				<span
					className="font-normal whitespace-nowrap"
					style={{ fontSize: '11px', color: muted }}
				>
					{metric.volume.toLocaleString('da-DK')}/md ·{' '}
					<span style={{ color: sdColor(metric.sd), fontWeight: 500 }}>
						SD {metric.sd}
					</span>
				</span>
			)}
		</span>
	)
}

/* ─── Detalje-visning ───────────────────────────────────────── */

function PageDetailView({ page }: { page: PageDetail }) {
	return (
		<div className="space-y-8">
			<div className="border-foreground/10 flex flex-wrap items-baseline justify-between gap-3 border-b pb-5">
				<div>
					<h3 className="text-foreground text-2xl font-medium tracking-[-0.02em]">
						{page.name}
					</h3>
					<p className="text-foreground/50 mt-1 font-mono text-xs">
						{page.slug}
					</p>
				</div>
				<div className="flex flex-wrap items-center gap-2">
					{page.isNew && <Tag>Ny side</Tag>}
					{page.segment && <Tag>{page.segment}</Tag>}
					{page.indexing === 'noindex' && (
						<Tag warn title={NOINDEX_TITLE}>
							Ikke indekseret
						</Tag>
					)}
					<StatusBadge status={page.status} />
				</div>
			</div>

			<div className="border-foreground/[0.08] bg-foreground/[0.02] rounded-2xl border p-5">
				<Label>Næste skridt</Label>
				<p className="text-foreground mt-2 text-sm leading-relaxed">
					{page.nextStep}
				</p>
			</div>

			<div>
				<div className="flex flex-wrap items-center gap-2">
					<Label>Søgeord</Label>
					<KeywordCheckBadge verifiedDate={page.keywordsVerified} />
				</div>
				<div className="mt-3 space-y-3">
					<div className="flex flex-wrap items-baseline gap-2">
						<span className="text-foreground/50 w-24 shrink-0 text-xs">
							Primært
						</span>
						<KeywordPill keyword={page.keywords.primary} primary />
					</div>
					{page.keywords.secondary.length > 0 && (
						<div className="flex flex-wrap items-baseline gap-2">
							<span className="text-foreground/50 w-24 shrink-0 text-xs">
								Sekundære
							</span>
							<div className="flex flex-wrap gap-2">
								{page.keywords.secondary.map((kw) => (
									<KeywordPill key={kw} keyword={kw} />
								))}
							</div>
						</div>
					)}
				</div>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				{page.completedTasks.length > 0 && (
					<div>
						<h4 className="mb-3">
							<Label>Færdige opgaver ({page.completedTasks.length})</Label>
						</h4>
						<ul className="space-y-2">
							{page.completedTasks.map((task) => (
								<li key={task} className="flex items-start gap-2 text-sm">
									<CheckIcon />
									<span className="text-foreground">{task}</span>
								</li>
							))}
						</ul>
					</div>
				)}

				{page.pendingTasks.length > 0 && (
					<div
						className="rounded-2xl p-5"
						style={{
							backgroundColor: STATUS_META.missing.bg,
							border: `1px solid ${STATUS_META.missing.border}`,
						}}
					>
						<h4
							className="mb-3 text-xs font-medium tracking-[0.15em] uppercase"
							style={{ color: STATUS_META.missing.text }}
						>
							Manglende opgaver ({page.pendingTasks.length})
						</h4>
						<ul className="space-y-2">
							{page.pendingTasks.map((task) => (
								<li key={task} className="flex items-start gap-2 text-sm">
									<PendingIcon />
									<span className="text-foreground">{task}</span>
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
		</div>
	)
}

/* ─── Filter- og tabel-hjælpere ─────────────────────────────── */

const STATUS_FILTERS: {
	key: 'all' | SeoStatus
	label: string
	dot?: string
}[] = [
	{ key: 'all', label: 'Alle statusser' },
	{ key: 'done', label: 'Færdig', dot: STATUS_META.done.dot },
	{ key: 'partial', label: 'I gang', dot: STATUS_META.partial.dot },
	{ key: 'missing', label: 'Mangler', dot: STATUS_META.missing.dot },
]

function FilterButton({
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
			style={
				active
					? { backgroundColor: ink, color: white }
					: {
							backgroundColor: white,
							color: withAlpha(ink, 0.65),
							border: `1px solid ${withAlpha(ink, 0.12)}`,
						}
			}
		>
			{children}
		</button>
	)
}

function SearchIcon() {
	return (
		<svg
			viewBox="0 0 20 20"
			className="h-4 w-4 shrink-0"
			fill="none"
			aria-hidden="true"
		>
			<circle
				cx="9"
				cy="9"
				r="6"
				stroke={withAlpha(ink, 0.4)}
				strokeWidth="1.6"
			/>
			<path
				d="M14 14l4 4"
				stroke={withAlpha(ink, 0.4)}
				strokeWidth="1.6"
				strokeLinecap="round"
			/>
		</svg>
	)
}

type SortKey = 'default' | 'volume' | 'sd'

function Th({
	children,
	num,
	sortKey,
	activeSort,
	onSort,
}: {
	children: React.ReactNode
	num?: boolean
	sortKey?: 'volume' | 'sd'
	activeSort?: SortKey
	onSort?: (s: SortKey) => void
}) {
	const clickable = !!sortKey && !!onSort
	return (
		<th
			className={`px-3 py-2.5 text-xs font-medium tracking-[0.05em] uppercase ${
				num ? 'text-right' : 'text-left'
			} ${clickable ? 'cursor-pointer select-none' : ''}`}
			style={{
				color: withAlpha(ink, 0.5),
				borderBottom: `1px solid ${withAlpha(ink, 0.1)}`,
			}}
			onClick={
				clickable
					? () => onSort!(activeSort === sortKey ? 'default' : sortKey!)
					: undefined
			}
		>
			{children}
			{clickable && activeSort === sortKey ? ' ↓' : ''}
		</th>
	)
}

function Td({ children, num }: { children: React.ReactNode; num?: boolean }) {
	return (
		<td
			className={`px-3 py-2.5 align-middle ${num ? 'text-right tabular-nums' : 'text-left'}`}
			style={{ borderBottom: `1px solid ${withAlpha(ink, 0.06)}` }}
		>
			{children}
		</td>
	)
}

function Dash() {
	return <span style={{ color: withAlpha(ink, 0.35) }}>–</span>
}

/* ─── Søgning, filtre, tabel + detalje ──────────────────────── */

export default function PagesTabs({ pages }: { pages: PageDetail[] }) {
	const [activeSlug, setActiveSlug] = useState(pages[0]?.slug)
	const active = pages.find((p) => p.slug === activeSlug) ?? pages[0]

	const [q, setQ] = useState('')
	const [seg, setSeg] = useState<string>('all')
	const [stat, setStat] = useState<'all' | SeoStatus>('all')
	const [sort, setSort] = useState<SortKey>('default')

	// Målgrupper og søgeordstal er valgfrie pr. projekt: findes de ikke, skjules filter og kolonner.
	const segmentOf = (p: PageDetail) => p.segment ?? OTHER_SEGMENT
	const hasSegments = pages.some((p) => p.segment)
	const segments = hasSegments ? Array.from(new Set(pages.map(segmentOf))) : []
	const hasMetrics = Object.keys(keywordMetrics).length > 0

	const query = q.trim().toLowerCase()
	const visible = pages
		.filter((p) => seg === 'all' || segmentOf(p) === seg)
		.filter((p) => stat === 'all' || p.status === stat)
		.filter(
			(p) =>
				!query ||
				p.name.toLowerCase().includes(query) ||
				p.keywords.primary.toLowerCase().includes(query),
		)
		.sort((a, b) => {
			const va = keywordMetrics[cleanKeyword(a.keywords.primary)]
			const vb = keywordMetrics[cleanKeyword(b.keywords.primary)]
			if (sort === 'volume') return (vb?.volume ?? -1) - (va?.volume ?? -1)
			if (sort === 'sd') return (va?.sd ?? 999) - (vb?.sd ?? 999)
			return 0
		})

	if (!active) return null

	const colCount = 3 + (hasSegments ? 1 : 0) + (hasMetrics ? 2 : 0)

	return (
		<div>
			<div className="flex flex-col gap-3">
				<div className="flex flex-wrap items-center gap-3">
					<label
						className="flex min-w-[220px] flex-1 items-center gap-2 rounded-xl px-3 py-2.5"
						style={{
							backgroundColor: white,
							border: `1px solid ${withAlpha(ink, 0.12)}`,
						}}
					>
						<SearchIcon />
						<input
							value={q}
							onChange={(e) => setQ(e.target.value)}
							placeholder="Søg efter side eller søgeord..."
							className="text-foreground w-full bg-transparent text-sm outline-none"
						/>
					</label>
					{hasSegments && (
						<div className="flex flex-wrap gap-1.5">
							<FilterButton
								active={seg === 'all'}
								onClick={() => setSeg('all')}
							>
								Alle
							</FilterButton>
							{segments.map((s) => (
								<FilterButton
									key={s}
									active={seg === s}
									onClick={() => setSeg(s)}
								>
									{s}
								</FilterButton>
							))}
						</div>
					)}
				</div>
				<div className="flex flex-wrap items-center gap-1.5">
					{STATUS_FILTERS.map((st) => (
						<FilterButton
							key={st.key}
							active={stat === st.key}
							onClick={() => setStat(st.key)}
						>
							{st.dot && (
								<span
									className="h-1.5 w-1.5 rounded-full"
									style={{ backgroundColor: st.dot }}
								/>
							)}
							{st.label}
						</FilterButton>
					))}
				</div>
			</div>

			<p className="mt-3 text-xs" style={{ color: muted }}>
				{visible.length} af {pages.length} sider
			</p>

			<div
				className="mt-2 overflow-x-auto rounded-2xl"
				style={{
					backgroundColor: white,
					border: `1px solid ${withAlpha(ink, 0.08)}`,
				}}
			>
				<table className="w-full border-collapse text-sm">
					<thead>
						<tr>
							<Th>Side</Th>
							{hasSegments && <Th>Målgruppe</Th>}
							<Th>Status</Th>
							<Th>Primært søgeord</Th>
							{hasMetrics && (
								<>
									<Th num sortKey="volume" activeSort={sort} onSort={setSort}>
										Vol./md
									</Th>
									<Th num sortKey="sd" activeSort={sort} onSort={setSort}>
										SD
									</Th>
								</>
							)}
						</tr>
					</thead>
					<tbody>
						{visible.map((p) => {
							const m = keywordMetrics[cleanKeyword(p.keywords.primary)]
							const isActive = p.slug === activeSlug
							return (
								<tr
									key={p.slug}
									onClick={() => setActiveSlug(p.slug)}
									className="cursor-pointer"
									style={{
										backgroundColor: isActive
											? withAlpha(ink, 0.04)
											: 'transparent',
									}}
								>
									<Td>
										<span className="text-foreground font-medium">
											{p.name}
										</span>
										{p.isNew && (
											<span
												className="ml-2 rounded-full px-1.5 py-0.5 text-[10px] font-medium"
												style={{
													backgroundColor: withAlpha(ink, 0.06),
													color: withAlpha(ink, 0.6),
												}}
											>
												ny
											</span>
										)}
										{p.indexing === 'noindex' && (
											<span
												className="ml-2 rounded-full px-1.5 py-0.5 text-[10px] font-medium"
												style={{
													backgroundColor: STATUS_META.partial.bg,
													color: STATUS_META.partial.text,
													border: `1px solid ${STATUS_META.partial.border}`,
												}}
												title={NOINDEX_TITLE}
											>
												noindex
											</span>
										)}
									</Td>
									{hasSegments && (
										<Td>
											<Tag>{segmentOf(p)}</Tag>
										</Td>
									)}
									<Td>
										<StatusBadge status={p.status} />
									</Td>
									<Td>
										<span style={{ color: withAlpha(ink, 0.75) }}>
											{p.keywords.primary}
										</span>
									</Td>
									{hasMetrics && (
										<>
											<Td num>
												{m ? m.volume.toLocaleString('da-DK') : <Dash />}
											</Td>
											<Td num>
												{m ? (
													<span
														style={{ color: sdColor(m.sd), fontWeight: 500 }}
													>
														{m.sd}
													</span>
												) : (
													<Dash />
												)}
											</Td>
										</>
									)}
								</tr>
							)
						})}
						{visible.length === 0 && (
							<tr>
								<td
									colSpan={colCount}
									className="px-4 py-8 text-center text-sm"
									style={{ color: muted }}
								>
									Ingen sider matcher filtrene.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			<div className="border-foreground/[0.08] bg-white mt-6 rounded-2xl border p-6 md:p-8">
				<PageDetailView page={active} />
			</div>
		</div>
	)
}
