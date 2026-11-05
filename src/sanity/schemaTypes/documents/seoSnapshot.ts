import { defineField, defineType } from 'sanity'
import { VscGraphLine } from 'react-icons/vsc'

/**
 * SEO-snapshot: et fast månedligt datapunkt fra Google Search Console (og
 * senere GA4), så dashboardet kan vise udviklingen måned for måned.
 *
 * Oprettes automatisk af et cron-job (POST /api/cron/seo-snapshot) den 3. i
 * hver måned, som henter FORRIGE måneds tal og gemmer dem her. Kører den 3.
 * (ikke 1.) fordi Search Console-data har 2-3 dages forsinkelse, så vi er
 * sikre på at fange hele måneden. Dokument-id er deterministisk
 * (`seoSnapshot-ÅÅÅÅ-MM`), så gentagne kørsler opdaterer samme måned frem for
 * at oprette dubletter.
 *
 * Kan også oprettes/rettes manuelt i Studio, hvis man vil taste tal ind i
 * hånden (fx før cron'en er koblet på Google).
 */
export default defineType({
	name: 'seoSnapshot',
	title: 'SEO-snapshot (måned)',
	icon: VscGraphLine,
	type: 'document',
	fields: [
		defineField({
			name: 'month',
			title: 'Måned (ÅÅÅÅ-MM)',
			type: 'string',
			description: 'Hvilken måned tallene dækker, fx "2026-08".',
			validation: (Rule) =>
				Rule.required().regex(/^\d{4}-\d{2}$/, {
					name: 'ÅÅÅÅ-MM',
					invert: false,
				}),
		}),
		defineField({
			name: 'capturedAt',
			title: 'Hentet',
			type: 'datetime',
			description: 'Hvornår tallene blev hentet fra Google.',
		}),
		defineField({
			name: 'source',
			title: 'Kilde',
			type: 'string',
			initialValue: 'search-console',
			options: {
				list: [
					{ title: 'Google Search Console', value: 'search-console' },
					{ title: 'Manuelt indtastet', value: 'manual' },
				],
				layout: 'radio',
			},
		}),

		/* ── Google Search Console (hele sitet, forrige måned) ── */
		defineField({
			name: 'clicks',
			title: 'Klik',
			type: 'number',
			description: 'Samlede klik fra Google-søgning.',
			fieldset: 'searchConsole',
		}),
		defineField({
			name: 'impressions',
			title: 'Visninger',
			type: 'number',
			description: 'Hvor ofte sitet blev vist i søgeresultaterne.',
			fieldset: 'searchConsole',
		}),
		defineField({
			name: 'ctr',
			title: 'CTR (%)',
			type: 'number',
			description: 'Klikrate: klik delt med visninger, i procent.',
			fieldset: 'searchConsole',
		}),
		defineField({
			name: 'avgPosition',
			title: 'Snit-position',
			type: 'number',
			description: 'Gennemsnitlig placering på tværs af alle søgninger.',
			fieldset: 'searchConsole',
		}),

		/* ── Top-søgeord (query-dimensionen, samme måned) ── */
		defineField({
			name: 'topQueries',
			title: 'Top-søgeord (Search Console)',
			type: 'array',
			description:
				'De søgninger sitet fik flest klik/visninger på i måneden. Hentes automatisk sammen med totalerne.',
			of: [
				{
					type: 'object',
					name: 'searchQuery',
					fields: [
						{ name: 'query', title: 'Søgning', type: 'string' },
						{ name: 'clicks', title: 'Klik', type: 'number' },
						{ name: 'impressions', title: 'Visninger', type: 'number' },
						{ name: 'ctr', title: 'CTR (%)', type: 'number' },
						{ name: 'position', title: 'Position', type: 'number' },
					],
					preview: {
						select: { title: 'query', clicks: 'clicks', position: 'position' },
						prepare: ({
							title,
							clicks,
							position,
						}: {
							title?: string
							clicks?: number
							position?: number
						}) => ({
							title: title || '(uden søgning)',
							subtitle: `${clicks ?? 0} klik · position ${position ?? '—'}`,
						}),
					},
				},
			],
		}),
	],
	fieldsets: [
		{
			name: 'searchConsole',
			title: 'Google Search Console',
			options: { columns: 2 },
		},
	],
	orderings: [
		{
			title: 'Måned, nyeste først',
			name: 'monthDesc',
			by: [{ field: 'month', direction: 'desc' }],
		},
	],
	preview: {
		select: { month: 'month', clicks: 'clicks', impressions: 'impressions' },
		prepare: ({ month, clicks, impressions }) => ({
			title: month || '(uden måned)',
			subtitle:
				clicks != null || impressions != null
					? `${clicks ?? 0} klik · ${impressions ?? 0} visninger`
					: 'Ingen tal endnu',
		}),
	},
})
