import type {
	HealthEntry,
	HealthResult,
	HealthStrategy,
	HealthTrigger,
} from './types'

/**
 * Eksempeldata til "Sidens helbred", kun lokalt (uden PAGESPEED_API_KEY eller
 * uden et rigtigt https-domæne). Tallene er opdigtede, men realistiske, og
 * `monthsAgo` giver lidt lavere tal, så udviklingen kan ses.
 */
function exampleResult(
	strategy: HealthStrategy,
	measuredAt: string,
	monthsAgo: number,
): HealthResult {
	const mobile = strategy === 'mobile'
	const dip = monthsAgo * 6
	return {
		url: 'https://horizen.dk/',
		strategy,
		measuredAt,
		scores: {
			performance: (mobile ? 74 : 96) - dip,
			accessibility: 92 - monthsAgo * 3,
			'best-practices': 100,
			seo: 100 - monthsAgo * 8,
		},
		lab: [
			{
				id: 'first-contentful-paint',
				value: mobile ? '1,9 s' : '0,5 s',
				score: mobile ? 0.86 : 1,
			},
			{
				id: 'largest-contentful-paint',
				value: mobile ? '3,6 s' : '1,1 s',
				score: mobile ? 0.6 : 0.97,
			},
			{
				id: 'total-blocking-time',
				value: mobile ? '180 ms' : '20 ms',
				score: mobile ? 0.91 : 1,
			},
			{ id: 'cumulative-layout-shift', value: '0,02', score: 1 },
			{
				id: 'speed-index',
				value: mobile ? '3,1 s' : '0,9 s',
				score: mobile ? 0.82 : 1,
			},
		],
		field: null,
		opportunities: mobile
			? [
					{ title: 'Vis billeder i formater af nyere dato', savingsMs: 820 },
					{
						title: 'Fjern ressourcer, der blokerer gengivelsen',
						savingsMs: 450,
					},
					{ title: 'Reducer ubrugt JavaScript', savingsMs: 300 },
				]
			: [],
	}
}

export function exampleEntry(
	date: Date,
	monthsAgo: number,
	trigger: HealthTrigger = 'cron',
): HealthEntry {
	const measuredAt = date.toISOString()
	return {
		id: `example-${measuredAt}`,
		month: measuredAt.slice(0, 7),
		measuredAt,
		trigger,
		mobile: exampleResult('mobile', measuredAt, monthsAgo),
		desktop: exampleResult('desktop', measuredAt, monthsAgo),
	}
}

/** To månedlige målinger (den 3. i denne og forrige måned) */
export function exampleHistory(now = new Date()): HealthEntry[] {
	const at = (back: number) =>
		new Date(now.getFullYear(), now.getMonth() - back, 3, 6, 30)
	return [exampleEntry(at(0), 0), exampleEntry(at(1), 1)]
}
