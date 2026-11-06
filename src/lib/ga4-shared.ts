/**
 * Typer og perioder til GA4-besøg, delt mellem serveren (src/lib/ga4.ts) og
 * fanen Besøg (VisitsTab.tsx), så Google-login-koden ikke kommer med i browseren.
 */

export type Ga4Range = 'thisMonth' | 'lastMonth' | 'last90'

export const GA4_RANGES: { key: Ga4Range; label: string }[] = [
	{ key: 'thisMonth', label: 'Denne måned' },
	{ key: 'lastMonth', label: 'Sidste måned' },
	{ key: 'last90', label: 'Seneste 3 måneder' },
]

export type Ga4Totals = {
	users: number
	sessions: number
	views: number
	/** Gennemsnitlig aktiv tid pr. besøgende i sekunder */
	avgSeconds: number
}

export type Ga4Page = {
	path: string
	views: number
	/** Andel af alle sidevisninger i perioden, 0-100 */
	share: number
	avgSeconds: number
}

export type Ga4Channel = { key: string; label: string; users: number; share: number }

export type Ga4Period = {
	totals: Ga4Totals
	pages: Ga4Page[]
	channels: Ga4Channel[]
}

export type Ga4Overview =
	| { status: 'off' }
	| { status: 'error'; message: string }
	| { status: 'ok'; periods: Record<Ga4Range, Ga4Period> }
