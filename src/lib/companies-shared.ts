import type { Ga4Range } from './ga4-shared'

/**
 * Typer til fanen Besøgende → Virksomheder, delt mellem serveren
 * (src/lib/companies.ts) og fanen (CompaniesTab.tsx).
 */

export type CompanyRow = {
	key: string
	name: string
	country?: string
	/** Besøg (en ny fane på sitet) fra virksomhedens net */
	visits: number
	views: number
	lastSeen?: string
	/** Mest sete sider, flest først */
	pages: { path: string; views: number }[]
	/** Kilder (label), flest først */
	sources: { label: string; visits: number }[]
}

export type CompaniesPeriod = {
	companies: CompanyRow[]
	/** Besøg, der blev slået op */
	checked: number
	/** Heraf fra en virksomheds net */
	matched: number
}

export type CompaniesOverview = {
	periods: Record<Ga4Range, CompaniesPeriod>
	/** Første dag med opslag (ÅÅÅÅ-MM-DD) */
	since?: string
}
