import { defineField, defineType } from 'sanity'
import { VscTelescope } from 'react-icons/vsc'

/**
 * SEO-spejderens månedsrapport (Andreas 27/11-2026). Én pr. måned, privat id
 * "seo-scout.ÅÅÅÅ-MM". Skrives af agenten SEO-spejderen den 3. i måneden, når
 * den har gennemgået Månedens tjekliste. Andreas læser den i dashboardet
 * (Strategi → Løbende drift), godkender eller afviser forslag til
 * aktivitetsloggen (aldrig timer pr. post), skriver sin egen indsigt i
 * kundebeskeden og publicerer rettelserne i Studio → Releases.
 * Ændres i dashboardet via POST /api/seo-scout. Står i dashboardOnlyTypes.
 */
export default defineType({
	name: 'seoScoutReport',
	title: 'SEO-spejderens rapport',
	icon: VscTelescope,
	type: 'document',
	readOnly: true,
	fields: [
		defineField({ name: 'month', title: 'Måned (ÅÅÅÅ-MM)', type: 'string' }),
		defineField({ name: 'dataMonth', title: 'Tallene er fra (ÅÅÅÅ-MM)', type: 'string' }),
		defineField({ name: 'createdAt', title: 'Lavet', type: 'datetime' }),
		defineField({ name: 'summary', title: 'Kort fortalt', type: 'text' }),
		defineField({
			name: 'steps',
			title: 'Tjeklistens trin',
			type: 'array',
			of: [
				{
					type: 'object',
					name: 'scoutStep',
					fields: [
						defineField({ name: 'stepId', title: 'Trin', type: 'string' }),
						defineField({
							name: 'status',
							title: 'Status',
							type: 'string',
							options: { list: ['klaret', 'forberedt', 'dig'] },
						}),
						defineField({ name: 'note', title: 'Note', type: 'text' }),
					],
				},
			],
		}),
		defineField({
			name: 'actions',
			title: 'Foreslåede handlinger',
			type: 'array',
			of: [
				{
					type: 'object',
					name: 'scoutAction',
					fields: [
						defineField({ name: 'title', title: 'Handling', type: 'string' }),
						defineField({ name: 'why', title: 'Hvorfor', type: 'text' }),
						defineField({ name: 'inRelease', title: 'Ligger klar som rettelse', type: 'boolean' }),
					],
				},
			],
		}),
		defineField({
			name: 'carriedOver',
			title: 'Overført fra tidligere måneder',
			type: 'array',
			of: [
				{
					type: 'object',
					name: 'scoutCarried',
					fields: [
						defineField({ name: 'title', title: 'Punkt', type: 'string' }),
						defineField({ name: 'why', title: 'Hvorfor', type: 'text' }),
						defineField({ name: 'fromMonth', title: 'Fra måned (ÅÅÅÅ-MM)', type: 'string' }),
					],
				},
			],
		}),
		defineField({
			name: 'work',
			title: 'Andreas\' arbejdsliste (status pr. punkt)',
			description: 'ny → laest (Claude må løse det) → loest (sat af Andreas). _key er a:<handling>, s:<trin> eller c:<overført>.',
			type: 'array',
			of: [
				{
					type: 'object',
					name: 'scoutWork',
					fields: [
						defineField({ name: 'status', title: 'Status', type: 'string', options: { list: ['ny', 'laest', 'loest'] } }),
						defineField({ name: 'at', title: 'Tidspunkt', type: 'datetime' }),
						defineField({ name: 'by', title: 'Af', type: 'string' }),
					],
				},
			],
		}),
		defineField({ name: 'releaseId', title: 'Release med rettelser', type: 'string' }),
		defineField({ name: 'releaseTitle', title: 'Releasens navn', type: 'string' }),
		defineField({ name: 'releaseCount', title: 'Antal rettelser', type: 'number' }),
		defineField({
			name: 'logDrafts',
			title: 'Forslag til aktivitetsloggen',
			type: 'array',
			of: [
				{
					type: 'object',
					name: 'scoutLogDraft',
					fields: [
						defineField({ name: 'date', title: 'Dato', type: 'date' }),
						defineField({ name: 'title', title: 'Titel', type: 'string' }),
						defineField({ name: 'description', title: 'Tekst', type: 'text' }),
						defineField({
							name: 'kind',
							title: 'Mærke',
							type: 'string',
							options: { list: ['seo', 'udvikling'] },
						}),
						defineField({
							name: 'status',
							title: 'Status',
							type: 'string',
							// godkendt = Andreas er enig, men posten er IKKE i aktivitetsloggen endnu.
							// tilfoejet = sendt til aktivitetsloggen samlet (Andreas 27/11-2026).
							options: { list: ['afventer', 'godkendt', 'tilfoejet', 'afvist'] },
						}),
						defineField({ name: 'hours', title: 'Timer (bruges ikke: aldrig timer pr. post)', type: 'number', hidden: true }),
						defineField({ name: 'decidedAt', title: 'Besluttet', type: 'datetime' }),
						defineField({ name: 'decidedBy', title: 'Af', type: 'string' }),
						defineField({ name: 'postedAt', title: 'Tilføjet til aktivitetsloggen', type: 'datetime' }),
					],
				},
			],
		}),
		defineField({
			name: 'message',
			title: 'Kundebesked (kladde)',
			type: 'object',
			fields: [
				defineField({ name: 'heading', title: 'Overskrift', type: 'string' }),
				defineField({ name: 'intro', title: 'Tekst', type: 'text' }),
				defineField({ name: 'insight', title: 'Din indsigt', type: 'text' }),
				defineField({
					name: 'status',
					title: 'Status',
					type: 'string',
					options: { list: ['kladde', 'klar'] },
				}),
			],
		}),
	],
	preview: { select: { title: 'month' } },
})
