/** Delte typer for "Sidens helbred" (måling, Sanity og HealthCheck.tsx) */

export type HealthStrategy = 'mobile' | 'desktop'

export type HealthCategory =
	| 'performance'
	| 'accessibility'
	| 'best-practices'
	| 'seo'

export type HealthResult = {
	url: string
	strategy: HealthStrategy
	measuredAt: string
	/** 0-100 pr. kategori (null, hvis Lighthouse ikke gav en score) */
	scores: Record<HealthCategory, number | null>
	/** Laboratoriemålinger: værdi som tekst (fx "1,8 s") og Lighthouse-score 0-1 */
	lab: { id: string; value: string; score: number | null }[]
	/** Rigtige brugere fra Chrome (kun ved nok trafik); 'origin' = hele sitet */
	field: {
		scope: 'page' | 'origin'
		overall: 'FAST' | 'AVERAGE' | 'SLOW' | null
		metrics: {
			id: string
			percentile: number
			category: 'FAST' | 'AVERAGE' | 'SLOW'
		}[]
	} | null
	/** Største forbedringsmuligheder med anslået besparelse */
	opportunities: { title: string; savingsMs: number }[]
}

/** Emnet på opgaven, når kunden anmoder om optimering (bruges også til at se, om der allerede er anmodet) */
export const OPTIMIZE_SUBJECT = 'Optimering af siden (Sidens helbred)'

/** Hvem satte målingen i gang: den månedlige cron, Horizen eller kunden */
export type HealthTrigger = 'cron' | 'horizen' | 'kunde'

/** Én måling (mobil + computer), som den gemmes i Sanity (pageHealth) */
export type HealthEntry = {
	id: string
	/** ÅÅÅÅ-MM, måneden målingen er taget i */
	month: string
	measuredAt: string
	trigger: HealthTrigger
	/** Hvem der trykkede "Mål nu" (navn fra Sanity-login); tom ved cron og kode-login */
	measuredBy?: string
	mobile: HealthResult | null
	desktop: HealthResult | null
}
