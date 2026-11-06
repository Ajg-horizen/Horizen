/**
 * Typer og perioder til fanen Performance → Besøg, delt mellem serveren
 * (src/lib/visits.ts, src/lib/ga4.ts) og fanen (VisitsTab.tsx), så
 * Google-login-koden ikke kommer med i browseren.
 */

export type Ga4Range = 'thisMonth' | 'lastMonth' | 'last3' | 'last12' | 'all'

export const GA4_RANGES: { key: Ga4Range; label: string }[] = [
	{ key: 'thisMonth', label: 'Denne måned' },
	{ key: 'lastMonth', label: 'Sidste måned' },
	{ key: 'last3', label: '3 måneder' },
	{ key: 'last12', label: '12 måneder' },
	{ key: 'all', label: 'Alt' },
]

export type Ga4Totals = {
	/** Besøg (en ny fane på sitet / en GA4-session) */
	visits: number
	views: number
	/** Gennemsnitlig aktiv tid pr. besøg i sekunder */
	avgSeconds: number
}

export type Ga4Page = {
	path: string
	views: number
	/** Andel af alle sidevisninger i perioden, 0-100 */
	share: number
	/** Gennemsnitlig aktiv tid pr. visning i sekunder */
	avgSeconds: number
}

export type Ga4Channel = { key: string; label: string; visits: number; share: number }

export type Ga4Period = {
	totals: Ga4Totals
	pages: Ga4Page[]
	channels: Ga4Channel[]
}

/**
 * Én samlet visning: egne tal uden cookies fra den dag, tælleren startede
 * (ownSince), og Google Analytics for dagene før (gaUntil = sidste dag med
 * GA-tal). Perioderne overlapper aldrig, så intet tælles dobbelt.
 */
export type VisitsOverview =
	| { status: 'empty'; gaError?: string }
	| {
			status: 'ok'
			periods: Record<Ga4Range, Ga4Period>
			ownSince?: string
			gaUntil?: string
			gaError?: string
	  }
