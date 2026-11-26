import { defineField, defineType } from 'sanity'
import { VscQuestion } from 'react-icons/vsc'

const today = () => new Date().toISOString().slice(0, 10)

/**
 * Et spørgsmål til kunden i SEO-dashboardet, oprettet i Studio (Andreas
 * 16/11-2026: uden kode og uden ny udrulning). Udgivet → Indbakke →
 * "Spørgsmål". Kunden svarer direkte i dashboardet (seoQuestionAnswer under
 * dokumentets id), og så flytter det ned under "Besvaret". Slet ikke et
 * besvaret spørgsmål; skjul det i stedet. Ældre spørgsmål i
 * src/app/dashboard/seo/data.ts vises stadig og står først.
 */
export default defineType({
	name: 'seoClientQuestion',
	title: 'Spørgsmål til kunden',
	icon: VscQuestion,
	type: 'document',
	fields: [
		defineField({
			name: 'question',
			title: 'Spørgsmålet',
			type: 'string',
			validation: (r) => r.required().max(200),
		}),
		defineField({
			name: 'area',
			title: 'Område',
			description: 'Lille overskrift, fx "Priser på siderne".',
			type: 'string',
			validation: (r) => r.required().max(60),
		}),
		defineField({
			name: 'context',
			title: 'Derfor spørger vi',
			description: 'Vises i den lyseblå boks.',
			type: 'text',
			rows: 4,
			validation: (r) => r.required(),
		}),
		defineField({
			name: 'askedAt',
			title: 'Sendt',
			type: 'date',
			initialValue: today,
			validation: (r) => r.required(),
		}),
		defineField({
			name: 'answer',
			title: 'Afklaret af Horizen',
			description: 'Fx aftalt på et møde. Vises som svar, og spørgsmålet flytter under "Besvaret".',
			type: 'object',
			options: { collapsible: true, collapsed: true },
			fields: [
				defineField({ name: 'date', title: 'Dato', type: 'date' }),
				defineField({ name: 'text', title: 'Svaret', type: 'text', rows: 3 }),
			],
		}),
		defineField({
			name: 'hidden',
			title: 'Skjul i dashboardet',
			description: 'Brug dette i stedet for at slette et spørgsmål.',
			type: 'boolean',
			initialValue: false,
		}),
	],
	orderings: [{ title: 'Nyeste først', name: 'askedDesc', by: [{ field: 'askedAt', direction: 'desc' }] }],
	preview: {
		select: { title: 'question', area: 'area', askedAt: 'askedAt', hidden: 'hidden' },
		prepare({ title, area, askedAt, hidden }) {
			return { title, subtitle: [hidden ? 'Skjult' : null, area, askedAt].filter(Boolean).join(' · ') }
		},
	},
})
