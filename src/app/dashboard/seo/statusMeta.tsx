import type { SeoStatus } from './data'

/**
 * Semantisk status-opslag + badges, delt mellem dashboardets faner (page.tsx,
 * PagesTabs.tsx). Grøn = færdig, gul = i gang, rød = mangler. Farverne er
 * CSS-variabler fra dashboard.css, så de skifter med lys/mørk tilstand. Ingen client-only
 * features, så modulet virker både i server- og client-komponenter.
 */
export const STATUS_META: Record<
	SeoStatus,
	{ label: string; dot: string; bg: string; text: string; border: string }
> = {
	done: { label: 'Færdig', dot: 'var(--st-done-dot)', bg: 'var(--st-done-bg)', text: 'var(--st-done-text)', border: 'var(--st-done-border)' },
	partial: { label: 'I gang', dot: 'var(--st-partial-dot)', bg: 'var(--st-partial-bg)', text: 'var(--st-partial-text)', border: 'var(--st-partial-border)' },
	missing: { label: 'Mangler', dot: 'var(--st-missing-dot)', bg: 'var(--st-missing-bg)', text: 'var(--st-missing-text)', border: 'var(--st-missing-border)' },
}

export function StatusDot({ status }: { status: SeoStatus }) {
	return (
		<span
			className="h-2 w-2 shrink-0 rounded-full"
			style={{ backgroundColor: STATUS_META[status].dot }}
		/>
	)
}

/** Visning for mangler markeret `later` på et teknisk punkt. */
export const LATER_META = {
	label: 'Senere',
	dot: 'var(--st-later-dot)',
	bg: 'var(--st-later-bg)',
	text: 'var(--st-later-text)',
	border: 'var(--st-later-border)',
}

export function StatusBadge({ status, later = false }: { status: SeoStatus; later?: boolean }) {
	const m = later ? LATER_META : STATUS_META[status]
	return (
		<span
			className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
			style={{ backgroundColor: m.bg, color: m.text, border: `1px solid ${m.border}` }}
		>
			<span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: m.dot }} />
			{m.label}
		</span>
	)
}
