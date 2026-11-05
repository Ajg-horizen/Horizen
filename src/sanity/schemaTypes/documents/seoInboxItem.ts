import { defineField, defineType } from 'sanity'
import { VscInbox } from 'react-icons/vsc'

/**
 * SEO-opgave: en opgave/et ønske til SEO-arbejdet, som lander på det interne
 * SEO-dashboard (/dashboard/seo → fanen "Ad hoc").
 *
 * Oprettes af kunden via formularen i dashboardet (POST /api/seo-task) med
 * status "sendt" og en valgt prioritet + timeramme. Bureauet triagerer via
 * `status` her i Studio (login-beskyttet, så kunden kan ikke selv ændre status):
 *   sendt → godkendt → i gang → løst  (eller blokeret, hvis noget venter).
 * Løste opgaver flyttes automatisk over i dashboardets Aktivitets-log.
 *
 * NB: det interne `name` (seoInboxItem) må ikke ændres — API-endpoint og
 * dashboard-query afhænger af det. Kun visningsnavnet er "SEO-opgave".
 */
export default defineType({
	name: 'seoInboxItem',
	title: 'SEO-opgave',
	icon: VscInbox,
	type: 'document',
	fields: [
		defineField({ name: 'subject', title: 'Emne', type: 'string' }),
		defineField({ name: 'message', title: 'Besked', type: 'text', rows: 6 }),
		defineField({
			name: 'priority',
			title: 'Prioritet',
			type: 'string',
			initialValue: 'middel',
			options: {
				list: [
					{ title: 'Høj', value: 'hoej' },
					{ title: 'Middel', value: 'middel' },
					{ title: 'Lav', value: 'lav' },
				],
				layout: 'radio',
			},
		}),
		defineField({
			name: 'handling',
			title: 'Timeramme (kundens valg)',
			description:
				'Hvor mange timer må vi bruge på opgaven, før vi spørger? Op til 5/10 timer = forhåndsgodkendt, gå bare i gang. Ellers giver vi et tidsoverslag først.',
			type: 'string',
			initialValue: 'timer5',
			options: {
				list: [
					{ title: 'Op til 5 timer', value: 'timer5' },
					{ title: 'Op til 10 timer', value: 'timer10' },
					{ title: 'Giv et tidsoverslag først', value: 'estimat' },
				],
				layout: 'radio',
			},
		}),
		defineField({
			name: 'status',
			title: 'Status',
			type: 'string',
			initialValue: 'sendt',
			options: {
				list: [
					{ title: 'Sendt', value: 'sendt' },
					{ title: 'Godkendt', value: 'godkendt' },
					{ title: 'I gang', value: 'igang' },
					{ title: 'Løst', value: 'loest' },
					{ title: 'Blokeret', value: 'blokeret' },
				],
				layout: 'radio',
			},
		}),
		defineField({
			name: 'estimateHours',
			title: 'Estimeret tid (timer)',
			description:
				'Dit skøn over hvor lang tid opgaven tager. Vises på kortet, så kunden kan se det.',
			type: 'number',
		}),
		defineField({ name: 'fromName', title: 'Afsender (navn)', type: 'string' }),
		defineField({ name: 'fromEmail', title: 'Afsender (e-mail)', type: 'string' }),
		defineField({ name: 'receivedAt', title: 'Sendt', type: 'datetime' }),
		defineField({ name: 'notes', title: 'Interne noter', type: 'text', rows: 3 }),
	],
	orderings: [
		{
			title: 'Nyeste først',
			name: 'receivedDesc',
			by: [{ field: 'receivedAt', direction: 'desc' }],
		},
	],
	preview: {
		select: {
			title: 'subject',
			fromName: 'fromName',
			priority: 'priority',
			status: 'status',
			receivedAt: 'receivedAt',
		},
		prepare({ title, fromName, priority, status, receivedAt }) {
			const statusLabel: Record<string, string> = {
				sendt: '● Sendt',
				godkendt: '→ Godkendt',
				igang: '◐ I gang',
				loest: '✓ Løst',
				blokeret: '⨯ Blokeret',
			}
			const prio: Record<string, string> = {
				hoej: 'Høj',
				middel: 'Middel',
				lav: 'Lav',
			}
			const date = receivedAt
				? new Date(receivedAt).toLocaleDateString('da-DK')
				: ''
			const bits = [statusLabel[status] || status, prio[priority], date, fromName]
				.filter(Boolean)
				.join(' · ')
			return { title: title || '(intet emne)', subtitle: bits }
		},
	},
})
