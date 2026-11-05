'use client'

import { useState, type ReactNode } from 'react'
import {
	serviceCatalog,
	serviceCatalogFoundationHours,
	serviceCatalogNote,
	type CatalogCategory,
	type CatalogImpact,
} from './data'
import { STATUS_META } from './statusMeta'
import { ink, muted, white, withAlpha } from './_tokens'

/**
 * Katalog over mulige nye sider (tilkøb) på Plan-fanen: kategorier som foldbare
 * rækker med bølge, impact, antal sider og timeskøn; foldet ud vises undersiderne
 * med slug, "1. bølge" og evt. lovkrav. Skjules, når kataloget er tomt.
 */

const IMPACT_META: Record<
	CatalogImpact,
	{ label: string; bg: string; text: string; dot: string }
> = {
	high: {
		label: 'Høj impact',
		bg: STATUS_META.done.bg,
		text: STATUS_META.done.text,
		dot: STATUS_META.done.dot,
	},
	medium: {
		label: 'Middel impact',
		bg: withAlpha(ink, 0.06),
		text: ink,
		dot: withAlpha(ink, 0.55),
	},
	low: {
		label: 'Lav impact',
		bg: withAlpha(ink, 0.04),
		text: muted,
		dot: withAlpha(ink, 0.3),
	},
}

// Amber = "obs / bundet krav".
const AMBER = {
	bg: STATUS_META.partial.bg,
	text: STATUS_META.partial.text,
	border: STATUS_META.partial.border,
}
const NEUTRAL = { bg: withAlpha(ink, 0.06), text: ink }

function Badge({
	children,
	bg,
	text,
	border,
}: {
	children: ReactNode
	bg: string
	text: string
	border?: string
}) {
	return (
		<span
			className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap"
			style={{
				backgroundColor: bg,
				color: text,
				border: border ? `1px solid ${border}` : undefined,
			}}
		>
			{children}
		</span>
	)
}

function CatalogRow({ cat }: { cat: CatalogCategory }) {
	const [open, setOpen] = useState(false)
	const im = IMPACT_META[cat.impact]
	const legalCount = cat.subpages.filter((s) => s.legalNote).length

	return (
		<div
			className="border-foreground/[0.08] overflow-hidden rounded-2xl border"
			style={{ backgroundColor: white }}
		>
			<button
				type="button"
				onClick={() => setOpen((o) => !o)}
				aria-expanded={open}
				className="flex w-full items-start gap-4 p-5 text-left transition-colors hover:bg-black/[0.015]"
			>
				<span
					className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium"
					style={{ backgroundColor: ink, color: white }}
				>
					{cat.number}
				</span>

				<div className="min-w-0 flex-1">
					<div className="flex flex-wrap items-center gap-2">
						<h4 className="text-foreground text-base font-medium tracking-[-0.01em]">
							{cat.name}
						</h4>
						{cat.existingMainPage && (
							<Badge bg={STATUS_META.done.bg} text={STATUS_META.done.text}>
								Har hovedside
							</Badge>
						)}
					</div>
					<p
						className="mt-1.5 text-xs leading-relaxed"
						style={{ color: muted }}
					>
						{cat.note}
					</p>
				</div>

				<div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
					<Badge bg={im.bg} text={im.text}>
						<span
							className="h-1.5 w-1.5 rounded-full"
							style={{ backgroundColor: im.dot }}
						/>
						{im.label}
					</Badge>
					<Badge {...NEUTRAL}>Bølge {cat.priority}</Badge>
					<Badge {...NEUTRAL}>{cat.subpages.length} sider</Badge>
					<Badge {...NEUTRAL}>~{cat.estimateHours} t</Badge>
					<svg
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
						style={{
							color: withAlpha(ink, 0.45),
							transform: open ? 'rotate(180deg)' : 'none',
							transition: 'transform 0.2s ease',
						}}
					>
						<path d="m6 9 6 6 6-6" />
					</svg>
				</div>
			</button>

			{open && (
				<div className="border-foreground/[0.08] border-t px-5 pb-4">
					{legalCount > 0 && (
						<p
							className="mt-4 mb-1 text-xs font-medium"
							style={{ color: AMBER.text }}
						>
							{legalCount}{' '}
							{legalCount === 1 ? 'underside har' : 'undersider har'} et bundet
							juridisk krav, der skal med i teksten.
						</p>
					)}
					<ul>
						{cat.subpages.map((s) => (
							<li
								key={s.slug}
								className="border-foreground/[0.06] border-b py-3 last:border-0"
							>
								<div className="flex flex-wrap items-center gap-2">
									<span className="text-foreground text-sm font-medium">
										{s.title}
									</span>
									{s.firstWave && (
										<Badge
											bg={STATUS_META.done.bg}
											text={STATUS_META.done.text}
										>
											1. bølge
										</Badge>
									)}
									{s.legalNote && (
										<Badge
											bg={AMBER.bg}
											text={AMBER.text}
											border={AMBER.border}
										>
											Lovkrav
										</Badge>
									)}
								</div>
								<code className="mt-1 block text-xs" style={{ color: muted }}>
									{cat.base}/{s.slug}
								</code>
								{s.legalNote && (
									<p
										className="mt-1.5 rounded-lg px-3 py-2 text-xs leading-relaxed"
										style={{
											backgroundColor: AMBER.bg,
											color: AMBER.text,
											border: `1px solid ${AMBER.border}`,
										}}
									>
										{s.legalNote}
									</p>
								)}
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	)
}

function StatTile({ value, label }: { value: string; label: string }) {
	return (
		<div
			className="rounded-2xl px-4 py-3"
			style={{ backgroundColor: withAlpha(ink, 0.04) }}
		>
			<div className="text-foreground text-xl font-medium tracking-[-0.02em]">
				{value}
			</div>
			<div className="mt-0.5 text-xs" style={{ color: muted }}>
				{label}
			</div>
		</div>
	)
}

export default function ServiceCatalog() {
	if (serviceCatalog.length === 0) return null

	const totalSubpages = serviceCatalog.reduce(
		(n, c) => n + c.subpages.length,
		0,
	)
	const contentHours = serviceCatalog.reduce((n, c) => n + c.estimateHours, 0)
	const firstWaveCount = serviceCatalog.reduce(
		(n, c) => n + c.subpages.filter((s) => s.firstWave).length,
		0,
	)
	const totalHours = contentHours + serviceCatalogFoundationHours

	return (
		<div>
			<div
				className="border-foreground/[0.08] rounded-3xl border p-6 md:p-7"
				style={{ backgroundColor: white }}
			>
				<div className="flex flex-wrap items-start justify-between gap-3">
					<div>
						<span className="text-foreground/50 text-xs font-medium tracking-[0.15em] uppercase">
							Uden for aftalen
						</span>
						<h3 className="text-foreground mt-1 text-xl font-medium tracking-[-0.02em] md:text-2xl">
							Katalog over mulige nye sider
						</h3>
					</div>
					<Badge bg={AMBER.bg} text={AMBER.text} border={AMBER.border}>
						Tilkøb · eget projekt
					</Badge>
				</div>

				<p
					className="mt-3 max-w-3xl text-sm leading-relaxed"
					style={{ color: muted }}
				>
					{serviceCatalogNote}
				</p>

				<div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
					<StatTile value={String(totalSubpages)} label="nye undersider" />
					<StatTile value={String(serviceCatalog.length)} label="kategorier" />
					<StatTile value={String(firstWaveCount)} label="i 1. bølge" />
					<StatTile
						value={`~${totalHours} t`}
						label={
							serviceCatalogFoundationHours
								? `inkl. ${serviceCatalogFoundationHours} t fundament`
								: 'i alt'
						}
					/>
				</div>
			</div>

			<div className="mt-4 grid gap-3">
				{serviceCatalog.map((cat) => (
					<CatalogRow key={cat.number} cat={cat} />
				))}
			</div>
		</div>
	)
}
