import { defineField, defineType } from 'sanity'
import { VscCheck } from 'react-icons/vsc'

/**
 * En opgave fra SEO-dashboardets "Din to-do", som kunden har markeret som
 * gjort (Andreas 15/11-2026). Opgaverne står i src/app/dashboard/seo/data.ts
 * (clientTodos); her gemmes kun, at den er gjort, hvornår og af hvem, plus en
 * eventuel bemærkning (fx navne på samarbejdspartnere).
 *
 * Gemmes af POST /api/seo-todo med id `seo-todo.<id>`. Ét dokument pr.
 * opgave; "Fortryd" i dashboardet sletter det.
 */
export default defineType({
	name: 'seoTodoDone',
	title: 'Gjort: to-do til kunden',
	icon: VscCheck,
	type: 'document',
	fields: [
		defineField({
			name: 'todoId',
			title: 'Opgavens nøgle',
			type: 'string',
			readOnly: true,
		}),
		defineField({
			name: 'title',
			title: 'Opgave',
			type: 'string',
			readOnly: true,
		}),
		defineField({ name: 'note', title: 'Bemærkning', type: 'text', rows: 4 }),
		defineField({
			name: 'linkNotes',
			title: 'Bemærkninger pr. afsnit',
			type: 'array',
			of: [
				{
					type: 'object',
					name: 'linkNote',
					fields: [
						defineField({ name: 'label', title: 'Afsnit', type: 'string', readOnly: true }),
						defineField({ name: 'text', title: 'Bemærkning', type: 'text', rows: 3 }),
					],
					preview: { select: { title: 'label', subtitle: 'text' } },
				},
			],
		}),
		defineField({
			name: 'consent',
			title: 'Horizen må kontakte dem',
			description: 'Kunden har bekræftet, at personerne i bemærkningen har sagt ja til at blive kontaktet.',
			type: 'boolean',
		}),
		defineField({ name: 'doneBy', title: 'Markeret af', type: 'string' }),
		defineField({
			name: 'doneEmail',
			title: 'E-mail',
			type: 'string',
			readOnly: true,
		}),
		defineField({ name: 'doneAt', title: 'Gjort', type: 'datetime' }),
	],
	orderings: [
		{
			title: 'Nyeste først',
			name: 'doneDesc',
			by: [{ field: 'doneAt', direction: 'desc' }],
		},
	],
	preview: {
		select: { title: 'title', by: 'doneBy', note: 'note' },
		prepare({ title, by, note }) {
			return { title, subtitle: [by, note].filter(Boolean).join(': ') }
		},
	},
})
