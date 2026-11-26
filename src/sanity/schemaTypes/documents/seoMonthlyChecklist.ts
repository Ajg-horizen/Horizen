import { defineField, defineType } from 'sanity'
import { VscChecklist } from 'react-icons/vsc'

/**
 * Månedens tjekliste i SEO-dashboardet (Andreas 10/11-2026): én pr. måned,
 * privat id "seo-checklist.ÅÅÅÅ-MM". Skrives kun af POST /api/seo-checklist
 * (Horizen), vises kun i dashboardet og står i dashboardOnlyTypes, så den
 * aldrig ses i Studio.
 */
export default defineType({
	name: 'seoMonthlyChecklist',
	title: 'Månedens SEO-tjekliste',
	icon: VscChecklist,
	type: 'document',
	readOnly: true,
	fields: [
		defineField({ name: 'month', title: 'Måned (ÅÅÅÅ-MM)', type: 'string' }),
		defineField({
			name: 'done',
			title: 'Gennemførte trin',
			type: 'array',
			of: [
				{
					type: 'object',
					name: 'checklistDone',
					fields: [
						defineField({ name: 'stepId', title: 'Trin', type: 'string' }),
						defineField({ name: 'doneAt', title: 'Tidspunkt', type: 'datetime' }),
						defineField({ name: 'doneBy', title: 'Af', type: 'string' }),
					],
				},
			],
		}),
	],
	preview: { select: { title: 'month' } },
})
