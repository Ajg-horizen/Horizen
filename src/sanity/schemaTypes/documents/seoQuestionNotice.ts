import { defineField, defineType } from 'sanity'
import { VscMail } from 'react-icons/vsc'

/**
 * En samlet besked til kunden om nye spørgsmål i SEO-dashboardet (Andreas
 * 1/11-2026: aldrig én mail pr. spørgsmål, men én besked, når en bunke er
 * samlet). Blev oprettet af den gamle knap "Send besked om N spørgsmål",
 * som 16/11-2026 blev afløst af skabelonen "Nyt i dit arbejdsrum" i Beskeder.
 * Typen bevares, så tidligere sendte beskeder stadig vises i historikken og
 * kan tjekkes på /tjek-mail.
 */
export default defineType({
	name: 'seoQuestionNotice',
	title: 'Besked om spørgsmål',
	icon: VscMail,
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
		defineField({
			name: 'code',
			title: 'Kontrolkode',
			type: 'string',
			description: 'Ægthedskoden i mærket nederst i mailen (slås op på /tjek-mail)',
		}),
		defineField({ name: 'subject', title: 'Emne', type: 'string' }),
		defineField({ name: 'count', title: 'Antal spørgsmål', type: 'number' }),
		defineField({
			name: 'questionKeys',
			title: 'Spørgsmål (nøgler)',
			type: 'array',
			of: [{ type: 'string' }],
		}),
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
