/**
 * Mailen om nye spørgsmål i SEO-dashboardet. Kun afhængig af messageText.ts
 * (mærket), så både panelet i dashboardet (forhåndsvisning) og POST
 * /api/seo-question-notify (afsendelse) bruger præcis samme mail.
 *
 * Opbygning efter Andreas' reference (Sanitys mails, 1/11-2026): Horizen-logo
 * øverst, et hvidt kort med tynd kant, afsenderens billede og navn, en stor
 * overskrift, kort tekst, én mørk knap og en diskret bundtekst. Bygget med
 * tabeller og inline-stil, så den holder i Gmail og Outlook. Spørgsmålene står
 * ikke i mailen; de besvares i dashboardet.
 *
 * Som alle mails fra Horizen har den mærket "Verificeret af Horizen" med
 * kontrolkode og "Pas på falske mails" (Andreas 6/11-2026).
 */

import { HORIZEN_PHONE, verifyBadge } from './messageText'

const escapeHtml = (s: string) =>
	s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')

const INK = '#0f0f0f'
const MUTED = '#6b6b6b'
const LINE = '#e6e6e1'
const ACCENT = '#00b67a' // Horizens grønne accent
const FONT =
	"Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"

/** "Andreas Juhl" → "AJ" */
const initials = (name: string) =>
	name
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((p) => p[0]?.toUpperCase())
		.join('') || 'H'

export function noticeMail({
	count,
	name,
	link,
	sender,
	senderPhoto,
	origin,
	code,
	verifyBase,
}: {
	count: number
	/** Kundens navn, fx "Ramin" (tomt giver bare "Hej") */
	name: string
	/** Absolut link til fanen Spørgsmål */
	link: string
	/** Afsenderens fulde navn fra dashboard-login */
	sender: string
	/** Sti eller adresse til afsenderens portræt; uden vises initialer */
	senderPhoto?: string
	/** Sidens adresse, så logo og billede kan hentes af mailprogrammet */
	origin: string
	/** Ægthedskoden (messageCode), laves først ved afsendelse; uden står en pladsholder */
	code?: string
	/** Adressen til tjek-siden (SEO_VERIFY_URL); standard er sidens egen /tjek-mail */
	verifyBase?: string
}) {
	const what = count === 1 ? 'et nyt spørgsmål' : `${count} nye spørgsmål`
	const firstName = sender.trim().split(/\s+/)[0] || 'Horizen'
	const subject = `Du har fået ${what} i SEO-dashboardet`
	const heading = `Du har fået ${what}`
	const greeting = name.trim() ? `Hej ${name.trim()}` : 'Hej'
	const line = `Der er ${what} til dig i SEO-dashboardet, som gerne må besvares hurtigst muligt. Følg linket herunder, så kommer du direkte til dem.`
	const how =
		'Svaret skrives direkte under hvert spørgsmål og gemmes med Gem. Det kan altid rettes bagefter.'
	const button = 'Se spørgsmålene'
	const from = `Spørgsmål fra ${firstName}`
	const abs = (src: string) => (/^https?:\/\//.test(src) ? src : origin + src)
	const verifyUrl = verifyBase?.trim() || `${origin}/tjek-mail`

	const text = [
		greeting,
		'',
		line,
		link,
		'',
		how,
		...(code
			? [
					'',
					`Verificeret af Horizen. Kontrolkode ${code}: ${verifyUrl}?kode=${code}`,
				]
			: []),
		'',
		'Venlig hilsen',
		...(sender.trim() ? [sender, 'Horizen'] : ['Horizen']),
		'',
		`Pas på falske mails: Jeg opkræver aldrig andet end det, vi har aftalt, og jeg beder aldrig om kortoplysninger eller adgangskoder på mail. Får du en mail om betaling eller et abonnement, der ikke passer med vores aftale, også fra andre, så se bort fra den eller ring til mig først: ${HORIZEN_PHONE}. Mine mails har altid en kontrolkode, som du kan tjekke på ${verifyUrl}.`,
	].join('\n')

	const avatar = senderPhoto
		? `<img src="${escapeHtml(abs(senderPhoto))}" width="40" height="40" alt="${escapeHtml(firstName)}" style="display:block;width:40px;height:40px;border-radius:20px;border:0;object-fit:cover">`
		: `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td width="40" height="40" align="center" valign="middle" style="width:40px;height:40px;border-radius:20px;background:#e8f0e4;color:#2f7a3a;font-family:${FONT};font-size:14px;font-weight:700">${escapeHtml(initials(sender))}</td></tr></table>`

	const dot = `<span style="color:${ACCENT};padding:0 10px">&#9679;</span>`
	const footerLink = (href: string, label: string) =>
		`<a href="${escapeHtml(href)}" style="color:${INK};text-decoration:none;font-weight:600">${label}</a>`

	const html = `<!doctype html>
<html lang="da">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light only">
<title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#ffffff">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(`${greeting}, ${line}`)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff">
<tr><td align="center" style="padding:48px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:480px">
<tr><td align="center" style="padding-bottom:40px">
<img src="${escapeHtml(abs('/email/horizen-logo.png'))}" width="120" height="24" alt="Horizen" style="display:block;width:120px;height:auto;border:0">
</td></tr>
<tr><td style="border:1px solid ${LINE};border-radius:16px;padding:44px 40px 40px;font-family:${FONT};color:${INK}">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center"><tr>
<td valign="middle" style="padding-right:12px">${avatar}</td>
<td valign="middle" style="font-family:${FONT};font-size:14px;color:${MUTED}">${escapeHtml(from)}</td>
</tr></table>
<h1 style="margin:28px 0 0;font-family:${FONT};font-size:28px;line-height:1.2;font-weight:700;color:${INK};text-align:center">${escapeHtml(heading)}</h1>
<p style="margin:28px 0 0;font-size:15px;line-height:1.6"><strong>${escapeHtml(greeting)}</strong><br>${escapeHtml(line)}</p>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:32px auto 0"><tr>
<td align="center" style="background:${INK};border-radius:10px"><a href="${escapeHtml(link)}" style="display:inline-block;padding:14px 26px;font-family:${FONT};font-size:15px;font-weight:600;color:#ffffff;text-decoration:none">${button}</a></td>
</tr></table>
<p style="margin:32px 0 0;font-size:13px;line-height:1.6;color:${MUTED}">${escapeHtml(how)}</p>
<p style="margin:24px 0 0;font-size:15px;line-height:1.6">Venlig hilsen<br>${sender.trim() ? `<strong>${escapeHtml(sender)}</strong><br><span style="color:${MUTED}">Horizen</span>` : '<strong>Horizen</strong>'}</p>
${verifyBadge({ gif: abs('/email/horizen-maerke.gif'), code, verifyUrl })}
</td></tr>
<tr><td style="padding:24px 0 0">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td bgcolor="#1a1a18" style="border:1px solid #3a3a36;border-radius:12px;padding:16px 20px;font-family:${FONT};font-size:13px;line-height:1.6;color:#d6d6d0;background:#1a1a18">
<strong style="color:#ffffff">Pas på falske mails.</strong> Jeg opkræver aldrig andet end det, vi har aftalt, og jeg beder aldrig om kortoplysninger eller adgangskoder på mail. Får du en mail om betaling eller et abonnement, der ikke passer med vores aftale, også fra andre, så se bort fra den eller ring til mig først: <a href="tel:${HORIZEN_PHONE.replace(/\s/g, '')}" style="color:#ffffff;font-weight:600;text-decoration:none;white-space:nowrap">${HORIZEN_PHONE}</a>. Mine mails er altid verificeret med en kontrolkode, som du kan tjekke.
</td></tr></table>
</td></tr>
<tr><td align="center" style="padding-top:32px;font-family:${FONT};font-size:14px">
${footerLink('https://horizen.dk', 'Horizen')}${dot}${footerLink(link, 'SEO-dashboard')}${dot}${footerLink('https://horizen.dk/kontakt', 'Kontakt')}
</td></tr>
<tr><td align="center" style="padding-top:14px;font-family:${FONT};font-size:12px;color:#8a8a8a">
Du får denne mail, fordi Horizen arbejder på din hjemmeside.
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`

	return { subject, text, html }
}
