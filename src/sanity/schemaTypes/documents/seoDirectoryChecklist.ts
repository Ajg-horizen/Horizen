import { defineField, defineType } from 'sanity'
import { VscChecklist } from 'react-icons/vsc'

/**
 * Tjeklisten "Profiler og kataloger" i SEO-dashboardet (Andreas 23/11-2026):
 * ét dokument pr. projekt, privat id "seo-directories.status". Skrives kun af
 * POST /api/seo-directories (Horizen), vises kun i dashboardet og står i
 * dashboardOnlyTypes, så den aldrig ses i Studio.
 */
export default defineType({
	name: 'seoDirectoryChecklist',
	title: 'Profiler og kataloger',
	icon: VscChecklist,
	type: 'document',
	readOnly: true,
	fields: [
		defineField({
			name: 'items',
			title: 'Punkter',
			type: 'array',
			of: [
				{
					type: 'object',
					name: 'directoryMark',
					fields: [
						defineField({ name: 'stepId', title: 'Punkt', type: 'string' }),
						defineField({
							name: 'status',
							title: 'Status',
							type: 'string',
							options: { list: ['done', 'skip'] },
						}),
						defineField({ name: 'at', title: 'Tidspunkt', type: 'datetime' }),
						defineField({ name: 'by', title: 'Af', type: 'string' }),
					],
				},
			],
		}),
	],
	preview: { prepare: () => ({ title: 'Profiler og kataloger' }) },
})
