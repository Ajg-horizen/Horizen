/**
 * Dashboard-lokale design-tokens (neutrale — kunde-agnostiske).
 *
 * Værdierne er CSS-variabler fra dashboard.css, så lys og mørk tilstand virker
 * automatisk. Holdes som et lille JS-modul, så de "levende" dele af dashboardet (Ad hoc-
 * formular, timetæller, aktivitetslog) kan bygges med inline styles + withAlpha
 * uden at trække Tailwind-utility-klasser gennem hver linje. Spejler de neutrale
 * farver i dashboardets egen stylesheet (src/app/dashboard/dashboard.css).
 *
 * Kun brugt af /dashboard/seo — bevidst uafhængigt af det offentlige designsystem
 * (src/styles/app.css). Skift til en kundes brand ved at justere værdierne her og
 * de tilsvarende --color-* i dashboard.css.
 *
 * Accenten er en dæmpet grøn (samme grøn som "Færdig"; skift til kundens brandfarve pr. projekt), brugt sparsomt: prikker i aktivitetsloggen,
 * timebjælken og det, der haster i "Fokus nu". Kortene er hvide på off-white side. Status-farver (grøn/gul/rød) er
 * semantiske og hardcodes lokalt i komponenterne.
 */

/** Overskrifter og primær tekst (near-black = Horizens foreground) */
export const ink = 'var(--color-foreground)'
/** Dæmpet tekst (≈ foreground/60) */
export const muted = 'var(--color-muted)'
/** Gennemgående accent: prikker, progress, understregning. */
export const accent = 'var(--accent)'
/** Hvide flader (inputs/popover) */
export const white = 'var(--color-popover)'

/**
 * Farve med given alpha. Tokens er CSS-variabler (så lys/mørk tilstand virker),
 * og dem blandes med color-mix; almindelige hex-farver (#rrggbb) → rgba.
 */
export function withAlpha(hex: string, alpha: number): string {
	if (hex.startsWith('var('))
		return `color-mix(in srgb, ${hex} ${Math.round(alpha * 1000) / 10}%, transparent)`
	const h = hex.replace('#', '')
	const r = parseInt(h.slice(0, 2), 16)
	const g = parseInt(h.slice(2, 4), 16)
	const b = parseInt(h.slice(4, 6), 16)
	return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
