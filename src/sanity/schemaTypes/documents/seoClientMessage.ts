import { defineField, defineType } from 'sanity'
import { VscSend } from 'react-icons/vsc'

/**
 * En besked fra Horizen til kunden (fanen "Beskeder" i SEO-dashboardet,
 * Andreas 5/11-2026): servicebeskeder og opgaver, adskilt fra spørgsmålene.
 * Oprettes af POST /api/seo-message, når beskeden er sendt, med hele mailen
 * (`html`), så den kan vises igen. Privat id ("seo-message.…").
 */
export default defineType({
	name: 'seoClientMessage',
	title: 'Besked til kunden',
	icon: VscSend,
	type: 'document',
	readOnly: true,
	fields: [
		defineField({ name: 'sentAt', title: 'Sendt', type: 'datetime' }),
		defineField({ name: 'sentTo', title: 'Til', type: 'string' }),
		defineField({
			name: 'sentToName',
			title: 'Modtagerens navn',
			type: 'string',
		}),
		defineField({ name: 'sentBy', title: 'Sendt af', type: 'string' }),
		defineField({ name: 'template', title: 'Skabelon', type: 'string' }),
		defineField({
			name: 'code',
			title: 'Ægthedskode',
			type: 'string',
			description: 'Kunden kan slå koden op på /tjek-mail',
		}),
		defineField({ name: 'subject', title: 'Emne', type: 'string' }),
		defineField({
			name: 'resendId',
			title: 'Resend-id',
			type: 'string',
			description: 'Bruges til at hente, om mailen er leveret og åbnet',
		}),
		defineField({ name: 'html', title: 'Mailen (HTML)', type: 'text' }),
	],
	orderings: [
		{
			title: 'Nyeste først',
			name: 'sentDesc',
			by: [{ field: 'sentAt', direction: 'desc' }],
		},
	],
	preview: {
		select: { title: 'subject', to: 'sentTo', at: 'sentAt' },
		prepare({ title, to, at }) {
			return {
				title,
				subtitle: [to, at && new Date(at).toLocaleString('da-DK')]
					.filter(Boolean)
					.join(' · '),
			}
		},
	},
})
