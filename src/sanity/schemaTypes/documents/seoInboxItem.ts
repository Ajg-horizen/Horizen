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
 * Bestillinger af klippekort-timer gemmes også her (med orderHours/orderPrice/
 * orderStatus) og vises i dashboardet under Kun Horizen → Klippekort, ikke
 * blandt opgaverne.
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
			title: 'Håndtering (kundens valg)',
			description:
				'"Gå bare i gang" (standard) = gå i gang og brug af retaineren; ser opgaven ud til at tage over 5 timer, sendes et overslag først. Ellers ønsker kunden et tidsoverslag, før vi går i gang.',
			type: 'string',
			initialValue: 'timer5',
			options: {
				list: [
					{ title: 'Gå bare i gang', value: 'timer5' },
					{ title: 'Op til 10 timer (ældre valg)', value: 'timer10' },
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
		// Køb af klippekort-timer fra dashboardet ("Køb flere timer", fra TUG
		// 19/11-2026). Felterne vises kun på bestillinger. Sæt "Betalt", når
		// fakturaen er betalt: så kommer timerne på kundens klippekort i dashboardet.
		defineField({
			name: 'orderStatus',
			title: 'Bestilling af timer: status',
			description:
				'Vises i dashboardet under Kun Horizen → Klippekort. "Betalt" lægger timerne på kundens klippekort.',
			type: 'string',
			initialValue: 'bestilt',
			hidden: ({ document }) => !document?.orderHours,
			options: {
				list: [
					{ title: 'Bestilt (faktura ikke sendt)', value: 'bestilt' },
					{ title: 'Faktura sendt', value: 'faktureret' },
					{ title: 'Betalt (timerne er på klippekortet)', value: 'betalt' },
					{ title: 'Annulleret', value: 'annulleret' },
				],
				layout: 'radio',
			},
		}),
		defineField({
			// "Få en SEO-aftale" / "Opgradér" fra dashboardet (20/11-2026): står ikke
			// blandt kundens ad hoc-opgaver, men Horizen får en mail og kan følge op her
			name: 'seoInterest',
			title: 'SEO-interesse (pakke)',
			type: 'string',
			readOnly: true,
			hidden: ({ document }) => !document?.seoInterest,
		}),
		defineField({
			name: 'orderHours',
			title: 'Bestilling af timer: antal',
			type: 'number',
			readOnly: true,
			hidden: ({ document }) => !document?.orderHours,
		}),
		defineField({
			name: 'orderPrice',
			title: 'Bestilling af timer: pris ekskl. moms (kr.)',
			type: 'number',
			readOnly: true,
			hidden: ({ document }) => !document?.orderHours,
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
			orderHours: 'orderHours',
			orderStatus: 'orderStatus',
		},
		prepare({ title, fromName, priority, status, receivedAt, orderHours, orderStatus }) {
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
			const orderLabel: Record<string, string> = {
				bestilt: '● Bestilt',
				faktureret: '◐ Faktura sendt',
				betalt: '✓ Betalt',
				annulleret: '⨯ Annulleret',
			}
			// Bestilling af timer: bestillingens status i stedet for opgavens
			const first = orderHours
				? orderLabel[orderStatus || 'bestilt']
				: statusLabel[status] || status
			const bits = [first, orderHours ? null : prio[priority], date, fromName]
				.filter(Boolean)
				.join(' · ')
			return { title: title || '(intet emne)', subtitle: bits }
		},
	},
})
