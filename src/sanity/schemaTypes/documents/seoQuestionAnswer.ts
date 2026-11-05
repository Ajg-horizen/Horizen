import { defineField, defineType } from 'sanity'
import { VscCommentDiscussion } from 'react-icons/vsc'

/**
 * Svar på et spørgsmål fra SEO-dashboardets fane "Spørgsmål" (Andreas
 * 1/11-2026: kunden skriver svaret og trykker Gem; ingen mail, bureauet læser
 * det i dashboardet og her i Studio).
 *
 * Gemmes af POST /api/seo-answer med id `seo-answer.<key>`, hvor key er
 * spørgsmålets nøgle (questionKey i src/app/dashboard/seo/data.ts). Ét
 * dokument pr. spørgsmål; et nyt svar overskriver det gamle.
 */
export default defineType({
	name: 'seoQuestionAnswer',
	title: 'Svar på spørgsmål',
	icon: VscCommentDiscussion,
	type: 'document',
	fields: [
		defineField({
			name: 'key',
			title: 'Spørgsmålets nøgle',
			type: 'string',
			readOnly: true,
		}),
		defineField({
			name: 'question',
			title: 'Spørgsmål',
			type: 'text',
			rows: 2,
			readOnly: true,
		}),
		defineField({ name: 'answer', title: 'Svar', type: 'text', rows: 6 }),
		defineField({ name: 'answeredBy', title: 'Skrevet af', type: 'string' }),
		defineField({
			name: 'answeredEmail',
			title: 'E-mail',
			type: 'string',
			readOnly: true,
		}),
		defineField({ name: 'answeredAt', title: 'Gemt', type: 'datetime' }),
	],
	orderings: [
		{
			title: 'Nyeste først',
			name: 'answeredDesc',
			by: [{ field: 'answeredAt', direction: 'desc' }],
		},
	],
	preview: {
		select: { title: 'question', answer: 'answer', by: 'answeredBy' },
		prepare({ title, answer, by }) {
			return {
				title,
				subtitle: [by, answer].filter(Boolean).join(': '),
			}
		},
	},
})
