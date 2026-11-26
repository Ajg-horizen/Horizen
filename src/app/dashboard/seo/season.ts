/**
 * Sæson pr. ydelse: hvor meget der søges på Google i hver kalendermåned
 * (Danmark, Ubersuggest `keyword_overview` med locId 2208, sprog da). Ét
 * primært søgeord pr. ydelse fra kundens keyword-master.md.
 *
 * UDFYLDES PR. KUNDE. Templaten har INGEN tal (Andreas 20/11-2026): uden
 * kundens egne søgetal er fanen Synlighed → Sæsoner tom og forklarer kun, hvad
 * der kommer. Vis aldrig en anden kundes tal som eksempel.
 *
 * Format pr. ydelse (eksempel, ikke rigtige tal):
 *   { key: 'ydelse', label: 'Ydelse', keyword: 'søgeord',
 *     volumes: [jan, feb, …, dec], high: 'november til februar', low: 'juni til august',
 *     why: 'Hvorfor sæsonen ser sådan ud.', campaignStart: [10], campaign: 'Start i oktober …' }
 *
 * Sæsonen er stabil fra år til år, så tallene opdateres én gang om året
 * (fx i november). Det er kun formen, der bruges: hver måned vises som et
 * indeks, hvor årets gennemsnit = 100.
 */

export type SeasonService = {
	key: string
	label: string
	keyword: string
	/** Søgninger pr. måned, januar til december */
	volumes: number[]
	/** Kort forklaring til dashboardet: hvornår, og hvorfor */
	high: string
	low: string
	why: string
	/** Måneder (1-12), hvor en kampagne bør starte, så den kører, før søgningerne topper. Tom = ingen fast sæson */
	campaignStart: number[]
	/** Råd til kampagner og indhold */
	campaign: string
}

/** Hvornår tallene er hentet (vises øverst i fanen). Udfyldes sammen med SEASON_SERVICES */
export const SEASON_UPDATED: string = ''
/** Samme dato som ISO (ÅÅÅÅ-MM-DD), så dashboardet kan advare, når tallene er over et år gamle */
export const SEASON_UPDATED_ISO: string = ''
/** Tallene opdateres hvert år i denne måned (trin i månedens tjekliste) */
export const SEASON_REFRESH_MONTH = 11

const MONTH_NAMES = ['januar', 'februar', 'marts', 'april', 'maj', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'december']

/** Sæsontallene skal opdateres, når der er gået et år siden sidst (så vises en gul mærkat). */
export function seasonUpdateDue(now = new Date()): boolean {
	if (!SEASON_HAS_DATA || !SEASON_UPDATED_ISO) return false
	const [y, m] = SEASON_UPDATED_ISO.split('-').map(Number)
	return now.getFullYear() * 12 + now.getMonth() + 1 - (y * 12 + m) >= 12
}

/** Datalinjen øverst i fanen Sæsoner (som "Opdateres automatisk den 3." under SEO). */
export function seasonDataNote(): string {
	if (!SEASON_HAS_DATA) return 'Her kommer jeres sæsoner: hvornår folk søger efter hver af jeres ydelser på Google. Tallene lægges ind, når søgeordene for jeres ydelser er på plads.'
	const [y, m] = SEASON_UPDATED_ISO.split('-').map(Number)
	const nextYear = m < SEASON_REFRESH_MONTH ? y : y + 1
	return `Googles søgninger i Danmark, et helt års tal pr. måned for hver ydelse (via Ubersuggest). Hentet ${SEASON_UPDATED}. Opdateres én gang om året, næste gang i ${MONTH_NAMES[SEASON_REFRESH_MONTH - 1]} ${nextYear}.`
}

/** Kundens ydelser med søgetal pr. måned. Tom = fanen viser en tom udgave. */
export const SEASON_SERVICES: SeasonService[] = []

/** Har kunden rigtige sæsontal? Uden dem er fanen tom (ingen eksempeltal). */
export const SEASON_HAS_DATA = SEASON_SERVICES.length > 0

/** Indeks pr. måned (januar til december), årets gennemsnit = 100. */
export function seasonIndex(volumes: number[]): number[] {
	const avg = volumes.reduce((a, b) => a + b, 0) / volumes.length
	return volumes.map((v) => Math.round((v / avg) * 100))
}

/** Gennemsnit af alle ydelsers indeks, så de store søgeord ikke overdøver de små. */
export function allServicesIndex(): number[] {
	if (!SEASON_SERVICES.length) return new Array(12).fill(100)
	const all = SEASON_SERVICES.map((s) => seasonIndex(s.volumes))
	return Array.from({ length: 12 }, (_, m) =>
		Math.round(all.reduce((a, idx) => a + idx[m], 0) / all.length),
	)
}

/** Blød, monoton kurve gennem punkterne (Fritsch–Carlson): ingen bump over/under data. */
export function smoothPath(pts: { x: number; y: number }[]): string {
	if (pts.length < 2) return pts.length ? `M${pts[0].x} ${pts[0].y}` : ''
	const n = pts.length
	const m = pts.slice(0, -1).map((p, i) => (pts[i + 1].y - p.y) / (pts[i + 1].x - p.x))
	const t = pts.map((_, i) =>
		i === 0 ? m[0] : i === n - 1 ? m[n - 2] : m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2,
	)
	for (let i = 0; i < n - 1; i++) {
		if (m[i] === 0) {
			t[i] = 0
			t[i + 1] = 0
			continue
		}
		const a = t[i] / m[i]
		const b = t[i + 1] / m[i]
		const h = a * a + b * b
		if (h > 9) {
			const k = 3 / Math.sqrt(h)
			t[i] = k * a * m[i]
			t[i + 1] = k * b * m[i]
		}
	}
	let d = `M${pts[0].x} ${pts[0].y}`
	for (let i = 0; i < n - 1; i++) {
		const dx = (pts[i + 1].x - pts[i].x) / 3
		d += ` C${pts[i].x + dx} ${pts[i].y + t[i] * dx} ${pts[i + 1].x - dx} ${pts[i + 1].y - t[i + 1] * dx} ${pts[i + 1].x} ${pts[i + 1].y}`
	}
	return d
}

