import { defineField, defineType } from 'sanity'
import { VscPulse } from 'react-icons/vsc'

/**
 * Sidens helbred: én Lighthouse-måling af forsiden (mobil + computer) fra
 * Googles PageSpeed Insights. Vises under Performance → Sidens helbred.
 *
 * Oprettes automatisk den 3. i hver måned af et cron-job
 * (/api/cron/page-health, id `pageHealth-ÅÅÅÅ-MM`) og ekstra, når Horizen
 * trykker "Mål nu" i dashboardet. Udviklingen regnes måned for måned.
 *
 * Scorerne ligger som tal-felter, så de kan læses her i Studio; hele målingen
 * (forslag, tider m.m.) ligger som JSON i `details`.
 */

const scores = (name: string, title: string) =>
	defineField({
		name,
		title,
		type: 'object',
		options: { columns: 2 },
		fields: [
			defineField({ name: 'performance', title: 'Hastighed', type: 'number' }),
			defineField({
				name: 'accessibility',
				title: 'Tilgængelighed',
				type: 'number',
			}),
			defineField({
				name: 'bestPractices',
				title: 'God praksis',
				type: 'number',
			}),
			defineField({ name: 'seo', title: 'Teknisk SEO', type: 'number' }),
		],
	})

export default defineType({
	name: 'pageHealth',
	title: 'Sidens helbred (måling)',
	icon: VscPulse,
	type: 'document',
	readOnly: true,
	fields: [
		defineField({
			name: 'month',
			title: 'Måned (ÅÅÅÅ-MM)',
			type: 'string',
		}),
		defineField({
			name: 'measuredAt',
			title: 'Målt',
			type: 'datetime',
		}),
		defineField({
			name: 'trigger',
			title: 'Målt af',
			type: 'string',
			options: {
				list: [
					{ title: 'Månedlig (automatisk)', value: 'cron' },
					{ title: 'Horizen (Mål nu)', value: 'horizen' },
					{ title: 'Kunden (Mål nu)', value: 'kunde' },
				],
			},
		}),
		defineField({ name: 'measuredBy', title: 'Målt af (navn)', type: 'string' }),
		defineField({ name: 'url', title: 'Adresse', type: 'url' }),
		scores('mobileScores', 'Mobil'),
		scores('desktopScores', 'Computer'),
		defineField({
			name: 'details',
			title: 'Hele målingen (JSON)',
			type: 'text',
			rows: 4,
		}),
	],
	orderings: [
		{
			title: 'Nyeste først',
			name: 'measuredAtDesc',
			by: [{ field: 'measuredAt', direction: 'desc' }],
		},
	],
	preview: {
		select: {
			measuredAt: 'measuredAt',
			trigger: 'trigger',
			perf: 'mobileScores.performance',
		},
		prepare: ({ measuredAt, trigger, perf }) => ({
			title: measuredAt
				? new Date(measuredAt).toLocaleString('da-DK')
				: '(uden dato)',
			subtitle: `${trigger === 'cron' ? 'Månedlig' : 'Mål nu'} · Hastighed (mobil) ${perf ?? '–'}`,
		}),
	},
})
