import { defineField, defineType } from 'sanity'
import { VscEye } from 'react-icons/vsc'

/**
 * En opgave fra SEO-dashboardets "Nye opgaver", som kunden har set og lagt på
 * sin to-do-liste (Andreas 16/11-2026). Indbakken viser kun det nye; når
 * kunden trykker "Set, læg på min liste", flytter opgaven til "Din
 * to-do-liste", og vi har dokumenteret, at den er modtaget.
 *
 * Gemmes af POST /api/seo-todo (`seen: true`) med id `seo-todo-seen.<id>`.
 * Ét dokument pr. opgave, adskilt fra seoTodoDone, så "Fortryd" på en gjort
 * opgave ikke sender den tilbage til indbakken.
 */
export default defineType({
	name: 'seoTodoSeen',
	title: 'Set: to-do til kunden',
	icon: VscEye,
	type: 'document',
	readOnly: true,
	fields: [
		defineField({ name: 'todoId', title: 'Opgavens nøgle', type: 'string' }),
		defineField({ name: 'title', title: 'Opgave', type: 'string' }),
		defineField({ name: 'seenBy', title: 'Set af', type: 'string' }),
		defineField({ name: 'seenEmail', title: 'E-mail', type: 'string' }),
		defineField({ name: 'seenAt', title: 'Set', type: 'datetime' }),
	],
	orderings: [
		{
			title: 'Nyeste først',
			name: 'seenDesc',
			by: [{ field: 'seenAt', direction: 'desc' }],
		},
	],
	preview: {
		select: { title: 'title', by: 'seenBy' },
		prepare({ title, by }) {
			return { title, subtitle: by ? `Set af ${by}` : 'Set' }
		},
	},
})
