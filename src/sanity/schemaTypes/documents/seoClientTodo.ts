import { defineArrayMember, defineField, defineType } from 'sanity'
import { VscChecklist } from 'react-icons/vsc'

const today = () => new Date().toISOString().slice(0, 10)

/**
 * En opgave til kunden i SEO-dashboardet, oprettet i Studio (Andreas
 * 16/11-2026: nye opgaver skal kunne laves uden kode og uden ny udrulning).
 *
 * Udgivet → lander i dashboardets Indbakke → "Nye opgaver". Kunden trykker
 * "Set, læg på min liste" (seoTodoSeen), og så står den under Opgaver →
 * "Jeres opgaver". Markeringerne gemmes under dokumentets id, så slet ikke en
 * opgave, kunden har markeret; skjul den i stedet. Ældre opgaver i
 * src/app/dashboard/seo/data.ts (clientTodos) vises stadig og står først.
 */
export default defineType({
	name: 'seoClientTodo',
	title: 'Opgave til kunden',
	icon: VscChecklist,
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			title: 'Opgaven',
			description: 'Kort og konkret, fx "Bed 3-5 kunder om en anmeldelse på Google".',
			type: 'string',
			validation: (r) => r.required().max(120),
		}),
		defineField({
			name: 'area',
			title: 'Område',
			description: 'Lille overskrift over opgaven, fx "Anmeldelser på Google".',
			type: 'string',
			validation: (r) => r.required().max(60),
		}),
		defineField({
			name: 'kind',
			title: 'Type',
			type: 'string',
			initialValue: 'handling',
			options: {
				list: [
					{ title: 'Handling: kunden skal gøre noget ("Det er gjort")', value: 'handling' },
					{ title: 'Godkendelse: kunden skal godkende noget ("Godkendt")', value: 'godkend' },
					{ title: 'Orientering: kunden skal bare se det ("Set")', value: 'laes' },
				],
				layout: 'radio',
			},
		}),
		defineField({
			name: 'askedAt',
			title: 'Sendt',
			description: 'Vises som "Sendt [dato]".',
			type: 'date',
			initialValue: today,
			validation: (r) => r.required(),
		}),
		defineField({
			name: 'why',
			title: 'Derfor er det vigtigt',
			description: 'I kundens sprog. Vises i den lyseblå boks.',
			type: 'text',
			rows: 4,
			validation: (r) => r.required(),
		}),
		defineField({
			name: 'steps',
			title: 'Sådan gør du (trin)',
			type: 'array',
			of: [defineArrayMember({ type: 'string' })],
		}),
		defineField({
			name: 'copyText',
			title: 'Tekst, kunden kan kopiere',
			description: 'Fx en SMS til kundens egne kunder. Får sin egen kopiér-knap.',
			type: 'object',
			fields: [
				defineField({ name: 'label', title: 'Knaptekst', type: 'string', initialValue: 'Kopiér beskeden' }),
				defineField({ name: 'text', title: 'Teksten', type: 'text', rows: 4 }),
			],
			options: { collapsible: true, collapsed: true },
		}),
		defineField({
			name: 'links',
			title: 'Links, kunden skal åbne',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'todoLink',
					fields: [
						defineField({ name: 'label', title: 'Tekst', type: 'string', validation: (r) => r.required() }),
						defineField({ name: 'href', title: 'Adresse', type: 'url', validation: (r) => r.required().uri({ allowRelative: true }) }),
						defineField({ name: 'hint', title: 'Lille forklaring', type: 'string' }),
						defineField({
							name: 'ask',
							title: 'Svarfelt under linket',
							description: 'Udfyld, hvis kunden skal kunne skrive en bemærkning pr. link (overskriften på feltet).',
							type: 'string',
						}),
					],
					preview: { select: { title: 'label', subtitle: 'href' } },
				}),
			],
		}),
		defineField({
			name: 'note',
			title: 'Felt til kundens bemærkning',
			type: 'object',
			options: { collapsible: true, collapsed: true },
			fields: [
				defineField({ name: 'label', title: 'Overskrift', type: 'string' }),
				defineField({ name: 'placeholder', title: 'Eksempel i feltet', description: 'Feltet vises kun, når dette er udfyldt.', type: 'string' }),
				defineField({ name: 'help', title: 'Kort forklaring', type: 'string' }),
				defineField({
					name: 'consent',
					title: 'Flueben om tilladelse',
					description: 'Fx "De har sagt ja til, at Horizen kontakter dem". Skal sættes, før en udfyldt bemærkning kan gemmes.',
					type: 'string',
				}),
			],
		}),
		defineField({
			name: 'priority',
			title: 'Rækkefølge',
			description: 'Lavt tal står først. Tomt = efter dem med tal, nyeste først.',
			type: 'number',
		}),
		defineField({
			name: 'closed',
			title: 'Lukket af Horizen',
			description: 'Fx klaret i telefonen. Opgaven flytter til "Klaret" med denne dato og tekst.',
			type: 'object',
			options: { collapsible: true, collapsed: true },
			fields: [
				defineField({ name: 'date', title: 'Dato', type: 'date' }),
				defineField({ name: 'text', title: 'Tekst', type: 'string' }),
			],
		}),
		defineField({
			name: 'hidden',
			title: 'Skjul i dashboardet',
			description: 'Brug dette i stedet for at slette en opgave.',
			type: 'boolean',
			initialValue: false,
		}),
	],
	orderings: [
		{ title: 'Nyeste først', name: 'askedDesc', by: [{ field: 'askedAt', direction: 'desc' }] },
		{ title: 'Rækkefølge', name: 'priorityAsc', by: [{ field: 'priority', direction: 'asc' }] },
	],
	preview: {
		select: { title: 'title', area: 'area', askedAt: 'askedAt', hidden: 'hidden' },
		prepare({ title, area, askedAt, hidden }) {
			return { title, subtitle: [hidden ? 'Skjult' : null, area, askedAt].filter(Boolean).join(' · ') }
		},
	},
})
