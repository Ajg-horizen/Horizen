/**
 * Beskeder fra Horizen til kunden (Andreas 5/11-2026): servicebeskeder og
 * opgaver, adskilt fra spørgsmålene. Uden andre afhængigheder, så både
 * fanen "Beskeder" (forhåndsvisning) og POST /api/seo-message (afsendelse)
 * bygger præcis samme mail.
 *
 * Samme Horizen-stil som mailen om spørgsmål (noticeText.ts): logo, hvidt kort
 * med tynd kant, afsenderens portræt og navn. Alt er venstrestillet, og hvad
 * kunden skal gøre, står i en grøn boks øverst og som nummererede opgaver.
 * Bygget med tabeller og inline-stil, så den holder i Gmail og Outlook.
 */

export const MESSAGE_TEMPLATES = [
	{
		key: 'anmeldelser',
		label: 'Anmeldelser og billeder',
		hint: 'Beder kunden sende anmeldelseslinket til sine kunder og sende billeder af sine opgaver.',
	},
	{
		key: 'sikkerhed',
		label: 'Sikker kommunikation',
		hint: 'Fortæl kunder og samarbejdspartnere om det verificerede mærke, og hvordan de tjekker en mail fra dig. Flere modtagere får hver deres mail med egen kode.',
	},
	{
		key: 'fri',
		label: 'Fri besked',
		hint: 'Overskrift, tekst og evt. én knap.',
	},
] as const

export type MessageTemplate = (typeof MESSAGE_TEMPLATES)[number]['key']

export function isMessageTemplate(v: unknown): v is MessageTemplate {
	return MESSAGE_TEMPLATES.some((t) => t.key === v)
}

/** Felterne i formularen. Ikke alle bruges af alle skabeloner. */
export type MessageFields = {
	/** Kundens fornavn, fx "Michael" */
	name: string
	heading: string
	/** Tekst; en tom linje giver nyt afsnit */
	intro: string
	/** anmeldelser: kundens link fra Google-profilen (g.page/r/…/review) */
	reviewLink: string
	/** anmeldelser: hilsenen i SMS'en, fx "Michael, Malerfirma Seitz" */
	smsSign: string
	/** anmeldelser: bed også om billeder */
	askPhotos: boolean
	/** fri: knap */
	buttonText: string
	buttonLink: string
}

export const MAX_FIELD = 3000

export function cleanFields(raw: unknown): MessageFields {
	const r = (raw && typeof raw === 'object' ? raw : {}) as Record<
		string,
		unknown
	>
	const str = (k: string, max = 200) =>
		(typeof r[k] === 'string' ? (r[k] as string) : '').trim().slice(0, max)
	return {
		name: str('name', 60),
		heading: str('heading', 140),
		intro: str('intro', MAX_FIELD),
		reviewLink: str('reviewLink', 300),
		smsSign: str('smsSign', 80),
		askPhotos: r.askPhotos !== false,
		buttonText: str('buttonText', 60),
		buttonLink: str('buttonLink', 300),
	}
}

/** Standardtekster pr. skabelon; Horizen retter dem til kunden i formularen. */
export function defaultFields(
	template: MessageTemplate,
	base: Partial<MessageFields> = {},
): MessageFields {
	const common = {
		name: '',
		reviewLink: '',
		smsSign: '',
		askPhotos: true,
		buttonText: '',
		buttonLink: '',
		...base,
	}
	if (template === 'anmeldelser') {
		return {
			...common,
			heading: 'Sådan kommer vi hurtigere frem på Google sammen',
			intro:
				'Når folk søger efter en virksomhed som din i området, viser Google først et kort med tre firmaer. Det er dem, folk ringer til. Hvem der kommer med på kortet, afgøres især af anmeldelser og billeder på Google-profilen.\n\nJeg står for hjemmesiden og profilen. Men anmeldelser og billeder kan kun du skaffe, og det er dem, der flytter mest lige nu. Der er to ting, du kan gøre for at hjælpe mig med at få dig hurtigere i mål.',
		}
	}
	if (template === 'sikkerhed') {
		return {
			...common,
			name: '',
			heading: 'Et ekstra lag af sikkerhed på vores mails',
			intro:
				'Vi lever i en tid med usikkerhed, hvor cyberangreb, phishing og falske mails desværre er blevet en del af hverdagen. Hos Horizen tager vi det ansvar alvorligt, både for vores egen forretning og for dem, vi arbejder med.\n\nDu får denne besked, fordi du har været i kontakt med os inden for de seneste 12 måneder.',
		}
	}
	return { ...common, heading: '', intro: '' }
}

// Uden 0/O, 1/I/L, så koden er let at skrive af
const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

/** Ægthedskode til en sendt besked, fx "H-7F3K-92QD". `random` = 8 tal fra 0-255. */
export function messageCode(random: ArrayLike<number>): string {
	const c = Array.from(
		{ length: 8 },
		(_, i) => CODE_CHARS[random[i] % CODE_CHARS.length],
	)
	return `H-${c.slice(0, 4).join('')}-${c.slice(4).join('')}`
}

/** Renser en kode, kunden har skrevet: store bogstaver, kun tegn fra koden */
export function normalizeCode(raw: string): string {
	const c = raw
		.toUpperCase()
		.replace(/[^A-Z0-9]/g, '')
		.replace(/^H/, '')
	return c.length === 8 ? `H-${c.slice(0, 4)}-${c.slice(4)}` : ''
}

/** Portræt af afsenderen i public/email; `override` (SEO_SENDER_PHOTO) vinder. */
// Horizens afsendere pr. login-mail. Navnet på Sanity-kontoen kan være et andet
// (fx "Horizen Glarbjerg"), så navn og portræt i mailen kommer herfra.
const HORIZEN_SENDERS: Record<string, { name: string; photo: string }> = {
	'ajg@horizen.dk': { name: 'Andreas José', photo: '/email/andreas.jpg' },
}

/**
 * Navn og portræt på afsenderen ud fra login-mailen. Ukendte afsendere får
 * navnet fra login og ingen portræt. `photoOverride` (SEO_SENDER_PHOTO) vinder.
 */
export function senderProfile(
	email?: string,
	name?: string,
	photoOverride?: string,
): { name: string; photo?: string } {
	const known = HORIZEN_SENDERS[(email ?? '').trim().toLowerCase()]
	return {
		name: known?.name ?? (name ?? '').trim(),
		photo: photoOverride?.trim() || known?.photo,
	}
}

const escapeHtml = (s: string) =>
	s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')

const isUrl = (s: string) => /^https:\/\/[^\s"<>]+$/.test(s)

const INK = '#0f0f0f'
const MUTED = '#6b6b6b'
const FAINT = '#8a8a8a'
const LINE = '#e6e6e1'
const ACCENT = '#00b67a' // Horizens grønne accent
const BG = '#141414' // mat-sort baggrund rundt om det hvide kort
// Horizens nummer (horizen.dk/kontakt); står i bemærkningen om falske mails
export const HORIZEN_PHONE = '+45 28 12 76 52'
const FONT =
	"Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"

const initials = (name: string) =>
	name
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((p) => p[0]?.toUpperCase())
		.join('') || 'H'

/** Afsnit adskilt af tomme linjer → <p>; enkelte linjeskift → <br> */
const paragraphs = (text: string, style: string) =>
	text
		.split(/\n\s*\n/)
		.map((p) => p.trim())
		.filter(Boolean)
		.map(
			(p) => `<p style="${style}">${escapeHtml(p).replace(/\n/g, '<br>')}</p>`,
		)
		.join('\n')

const label = (text: string, color = FAINT) =>
	`<span style="display:block;font-size:11px;letter-spacing:.08em;text-transform:uppercase;font-weight:700;color:${color};margin-bottom:6px">${text}</span>`

const button = (href: string, text: string, outline = false) =>
	outline
		? `<a href="${escapeHtml(href)}" style="display:inline-block;padding:7px 14px;border-radius:8px;border:1px solid ${INK};color:${INK};font-size:13px;font-weight:600;text-decoration:none">${escapeHtml(text)}</a>`
		: `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0 0"><tr><td style="background:${INK};border-radius:10px"><a href="${escapeHtml(href)}" style="display:inline-block;padding:14px 26px;font-family:${FONT};font-size:15px;font-weight:600;color:#ffffff;text-decoration:none">${escapeHtml(text)}</a></td></tr></table>`

const step = (n: number, title: string) =>
	`<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:44px 0 0"><tr><td valign="middle" style="padding-right:12px"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td width="28" height="28" align="center" valign="middle" style="width:28px;height:28px;border-radius:14px;background:${ACCENT};color:#ffffff;font-family:${FONT};font-size:13px;font-weight:700">${n}</td></tr></table></td><td valign="middle" style="font-family:${FONT};font-size:20px;line-height:1.3;font-weight:700;color:${INK}">${escapeHtml(title)}</td></tr></table>`

const P = `margin:16px 0 0;font-size:15px;line-height:1.6`
const SMALL = `margin:8px 0 0;font-size:12px;line-height:1.5;color:${FAINT}`

/** Mærket "Verificeret af Horizen" med kontrolkode og link til tjek-siden. */
function verifyBadge({
	gif,
	code,
	verifyUrl,
	margin = '32px 0 0',
	example = false,
}: {
	gif: string
	code?: string
	verifyUrl: string
	margin?: string
	/** Kun til fremvisning: ingen link, i stedet ordet "Eksempel" */
	example?: boolean
}) {
	const href = `${verifyUrl}${code ? `?kode=${encodeURIComponent(code)}` : ''}`
	return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="margin:${margin};background:#ffffff;border:1px solid ${LINE};border-radius:12px"><tr>
<td valign="middle" width="62" style="width:62px;padding:12px 0 12px 14px"><img src="${escapeHtml(gif)}" width="46" height="46" alt="" style="display:block;width:46px;height:46px;border:0"></td>
<td valign="middle" style="padding:12px 8px;font-family:${FONT}">
<p style="margin:0;font-size:14px;font-weight:700;color:${INK}">Verificeret af Horizen</p>
<p style="margin:2px 0 0;font-size:12px;line-height:1.5;color:${MUTED}">Kontrolkode <span style="font-family:'SF Mono',Menlo,Consolas,monospace;color:${INK};font-weight:600;letter-spacing:.04em">${escapeHtml(code || 'H-XXXX-XXXX')}</span></p>
</td>
<td valign="middle" align="right" style="padding:12px 18px 12px 0;font-family:${FONT};font-size:13px">${example ? `<span style="color:${FAINT}">Eksempel</span>` : `<a href="${escapeHtml(href)}" style="color:${MUTED};text-decoration:underline">Verificér</a>`}</td>
</tr></table>`
}

function securityBody(verifyUrl: string, gif: string) {
	const steps: [string, string][] = [
		[
			'Find mærket',
			'Nederst i alle mails fra os står "Verificeret af Horizen" med et lille pixel-hjerte og en kontrolkode.',
		],
		[
			'Klik på "Verificér"',
			`Så ser I, hvem der har sendt mailen, og hvornår. I kan også skrive koden på ${verifyUrl}. Prøv det gerne på denne mail.`,
		],
		[
			'Ring ved den mindste tvivl',
			`Står koden ikke der, er mailen ikke fra os. Ring til os på ${HORIZEN_PHONE}, før I svarer eller klikker.`,
		],
	]
	const html = `
<p style="margin:40px 0 0;font-size:11px;letter-spacing:.08em;text-transform:uppercase;font-weight:700;color:${FAINT}">Vores tiltag</p>
<p style="margin:8px 0 0;font-size:15px;line-height:1.6">Fremover lægger vi et ekstra sikkerhedslag på alle vores mails. Hver mail fra Horizen får et verificeringsmærke og sin egen kontrolkode, så I altid kan tjekke, at den er ægte og faktisk kommer fra os.</p>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0 0"><tr>
<td bgcolor="#f6f6f3" style="background:#f6f6f3;border-radius:16px;padding:36px 28px 28px">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center"><tr><td align="center">
<img src="${escapeHtml(gif)}" width="112" height="112" alt="Horizens verificeringsmærke" style="display:block;width:112px;height:112px;border:0;margin:0 auto">
</td></tr></table>
<p style="margin:18px 0 0;font-family:${FONT};font-size:13px;line-height:1.5;color:${MUTED};text-align:center">Sådan ser mærket ud nederst i vores mails</p>
${verifyBadge({
	gif,
	code: 'H-7F3K-92QD',
	verifyUrl,
	margin: '16px 0 0',
	example: true,
})}
</td></tr></table>

<p style="margin:40px 0 0;font-size:11px;letter-spacing:.08em;text-transform:uppercase;font-weight:700;color:${FAINT}">Sådan verificerer I en mail fra os</p>
${steps
	.map(
		(
			[title, text],
			i,
		) => `${step(i + 1, title).replace('margin:44px 0 0', i ? 'margin:24px 0 0' : 'margin:14px 0 0')}
<p style="margin:8px 0 0 40px;font-size:15px;line-height:1.6">${escapeHtml(text)}</p>`,
	)
	.join('\n')}`
	const text = [
		'Vores tiltag: Fremover lægger vi et ekstra sikkerhedslag på alle vores mails. Hver mail fra Horizen får et verificeringsmærke og sin egen kontrolkode.',
		'',
		'Sådan verificerer I en mail fra os:',
		...steps.map(([t, x], i) => `${i + 1}. ${t}: ${x}`),
	].join('\n')
	return { html, text }
}

function reviewBody(f: MessageFields, origin: string) {
	const link = isUrl(f.reviewLink) ? f.reviewLink : ''
	const sms = `Hej [navn]. Tak for opgaven på [vej/by]. Vil du hjælpe mig med at skrive et par ord på Google om, hvordan du oplevede arbejdet? Det tager et minut: ${link || '[link]'}${f.smsSign ? `\nVenlig hilsen ${f.smsSign}` : ''}`
	const qr = link
		? `${origin}/api/seo-message/qr?d=${encodeURIComponent(link)}`
		: ''
	const tasks = [
		`<strong>1.</strong> Bed dine kunder om en anmeldelse (SMS'en er klar nedenfor)`,
		...(f.askPhotos
			? [`<strong>2.</strong> Send mig 10 billeder af dine opgaver`]
			: []),
	]

	const html = `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 0"><tr>
<td style="background:#eef6f1;border-left:3px solid ${ACCENT};border-radius:8px;padding:16px 20px;font-size:15px;line-height:1.6">
${label(f.askPhotos ? 'To ting, du kan gøre for at hjælpe mig' : 'Det kan du gøre for at hjælpe mig', '#00875a')}
${tasks.join('<br>\n')}
</td></tr></table>

${step(1, 'Hjælp mig med anmeldelser')}
<p style="margin:12px 0 0;font-size:15px;line-height:1.6">Send SMS'en til dine kunder fra det seneste år, og fremover samme dag, du afleverer en opgave. Hver anmeldelse rykker dig tættere på kortet.</p>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0 0;border:1px solid ${LINE};border-radius:12px"><tr><td style="padding:0">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td style="padding:14px 18px;border-bottom:1px solid ${LINE};font-size:13px;font-weight:700">SMS til dine kunder</td>
<td align="right" style="padding:10px 14px;border-bottom:1px solid ${LINE}"><a href="${escapeHtml(`sms:?&body=${encodeURIComponent(sms)}`)}" style="display:inline-block;padding:7px 14px;border-radius:8px;background:${INK};color:#ffffff;font-size:13px;font-weight:600;text-decoration:none">Åbn i SMS</a></td>
</tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td style="background:#f6f6f3;padding:16px 18px;border-radius:0 0 12px 12px;font-family:'SF Mono',Menlo,Consolas,monospace;font-size:13px;line-height:1.65;color:${INK}">${escapeHtml(sms).replace(/\n/g, '<br>')}</td>
</tr></table>
</td></tr></table>
<p style="${SMALL}">På mobilen åbner knappen din beskedapp med teksten skrevet ind. Ret [navn] og [vej/by], og vælg kunden.</p>
${
	qr
		? `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0 0;border:1px solid ${LINE};border-radius:12px"><tr>
<td valign="middle" width="120" style="width:120px;padding:16px 0 16px 18px"><img src="${escapeHtml(qr)}" width="96" height="96" alt="QR-kode til anmeldelser" style="display:block;width:96px;height:96px;border:0"></td>
<td valign="middle" style="padding:16px 18px 16px 8px">
<p style="margin:0;font-size:13px;font-weight:700">QR-kode til anmeldelser</p>
<p style="margin:4px 0 12px;font-size:13px;line-height:1.55;color:${MUTED}">Lad kunden scanne den, når I står sammen. Print den på tilbud og fakturaer, eller sæt den på bilen.</p>
${button(`${qr}&download=1`, 'Hent QR-koden', true)}
</td></tr></table>`
		: ''
}
${
	f.askPhotos
		? `
${step(2, 'Send mig dine billeder')}
<p style="margin:12px 0 0;font-size:15px;line-height:1.6">Svar bare på denne mail med 10 billeder af dine egne opgaver, gerne før og efter, et af dig selv og et af bilen. Så lægger jeg dem op på profilen for dig.</p>`
		: ''
}

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:40px 0 0"><tr>
<td style="border-top:1px solid ${LINE};padding-top:20px;font-size:13px;line-height:1.6;color:${MUTED}">
${label('Godt at vide')}
Spørg alle kunder, ikke kun dem, du tror er glade. Aldrig rabat eller gave for en anmeldelse, og ikke familie eller venner. Svar gerne på alle anmeldelser, også de kritiske.
</td></tr></table>`

	const text = [
		'Det kan du gøre for at hjælpe mig:',
		'',
		'1. Bed dine kunder om en anmeldelse. SMS du kan sende:',
		sms,
		...(f.askPhotos
			? ['', '2. Svar på denne mail med 10 billeder af dine opgaver.']
			: []),
	].join('\n')

	return { html, text }
}

export function clientMessage({
	template,
	fields,
	sender,
	senderPhoto,
	origin,
	dashboardLink,
	code,
	verifyBase,
}: {
	template: MessageTemplate
	fields: MessageFields
	/** Afsenderens fulde navn, fx "Andreas José" */
	sender: string
	/** Sti eller adresse til afsenderens portræt; uden vises initialer */
	senderPhoto?: string
	/** Sidens adresse, så logo, portræt og QR-kode kan hentes af mailprogrammet */
	origin: string
	/** Kundens SEO-dashboard i bundlinjen; tom (mails fra horizen.dk) udelader linket */
	dashboardLink: string
	/** Ægthedskoden (newMessageCode), laves først ved afsendelse; uden står en pladsholder */
	code?: string
	/** Adressen til tjek-siden (SEO_VERIFY_URL); standard er sidens egen /tjek-mail */
	verifyBase?: string
}) {
	const abs = (src: string) => (/^https?:\/\//.test(src) ? src : origin + src)
	const verifyUrl = verifyBase?.trim() || `${origin}/tjek-mail`
	const who = sender.trim() || 'Horizen'
	// "Horizen" som anden linje, kun når en person står som afsender
	const team = sender.trim() ? '<br>Horizen' : ''
	const heading =
		fields.heading ||
		(template === 'fri'
			? 'Besked fra Horizen'
			: defaultFields(template).heading)
	const subject = heading
	const greeting = fields.name ? `Hej ${fields.name}` : 'Hej'

	const body =
		template === 'anmeldelser'
			? reviewBody(fields, origin)
			: template === 'sikkerhed'
				? securityBody(verifyUrl, abs('/email/horizen-maerke.gif'))
				: {
						html:
							isUrl(fields.buttonLink) && fields.buttonText
								? button(fields.buttonLink, fields.buttonText)
								: '',
						text:
							isUrl(fields.buttonLink) && fields.buttonText
								? `${fields.buttonText}: ${fields.buttonLink}`
								: '',
					}

	const avatar = senderPhoto
		? `<img src="${escapeHtml(abs(senderPhoto))}" width="56" height="56" alt="${escapeHtml(who)}" style="display:block;width:56px;height:56px;border-radius:28px;border:0;object-fit:cover">`
		: `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td width="56" height="56" align="center" valign="middle" style="width:56px;height:56px;border-radius:28px;background:#e8f0e4;color:#2f7a3a;font-family:${FONT};font-size:16px;font-weight:700">${escapeHtml(initials(who))}</td></tr></table>`

	const dot = `<span style="color:${ACCENT};padding:0 10px">&#9679;</span>`
	const footerLink = (href: string, text: string) =>
		`<a href="${escapeHtml(href)}" style="color:#f5f5f0;text-decoration:none;font-weight:600">${text}</a>`
	const preheader = fields.intro.split(/\n/)[0]?.slice(0, 140) || heading

	const html = `<!doctype html>
<html lang="da">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light only">
<title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${BG}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG}" style="background:${BG}">
<tr><td align="center" style="padding:56px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:760px">
<tr><td bgcolor="#ffffff" style="background:#ffffff;border-radius:16px;padding:48px 56px 44px;font-family:${FONT};color:${INK};text-align:left">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td valign="middle"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
<td valign="middle" style="padding-right:12px">${avatar}</td>
<td valign="middle" style="font-family:${FONT};font-size:14px;line-height:1.4;color:${MUTED}"><strong style="color:${INK}">${escapeHtml(who)}</strong>${team}</td>
</tr></table></td>
</tr></table>
<h1 style="margin:28px 0 0;font-family:${FONT};font-size:28px;line-height:1.2;font-weight:700;color:${INK}">${escapeHtml(heading)}</h1>
<p style="margin:20px 0 0;font-size:15px;line-height:1.6"><strong>${escapeHtml(greeting)}</strong></p>
${paragraphs(fields.intro, P.replace('16px 0 0', '8px 0 0'))}
${body.html}
<p style="margin:32px 0 0;font-size:15px;line-height:1.6">Venlig hilsen<br><strong>${escapeHtml(who)}</strong>${team ? `<br><span style="color:${MUTED}">Horizen</span>` : ''}</p>
${verifyBadge({ gif: abs('/email/horizen-maerke.gif'), code, verifyUrl })}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:32px 0 0"><tr>
<td align="center" style="border-top:1px solid ${LINE};padding-top:32px"><img src="${escapeHtml(abs('/email/horizen-logo.png'))}" width="140" height="27" alt="Horizen" style="display:block;width:140px;height:auto;border:0;margin:0 auto"></td>
</tr></table>
</td></tr>
<tr><td style="padding:24px 0 0">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td style="border:1px solid #3a3a36;border-radius:12px;padding:16px 20px;font-family:${FONT};font-size:13px;line-height:1.6;color:#d6d6d0">
<strong style="color:#ffffff">Pas på falske mails.</strong> Jeg opkræver aldrig andet end det, vi har aftalt, og jeg beder aldrig om kortoplysninger eller adgangskoder på mail. Får du en mail om betaling eller et abonnement, der ikke passer med vores aftale, også fra andre, så se bort fra den eller ring til mig først: <a href="tel:${HORIZEN_PHONE.replace(/\s/g, '')}" style="color:#ffffff;font-weight:600;text-decoration:none;white-space:nowrap">${HORIZEN_PHONE}</a>. Mine mails er altid verificeret med en kontrolkode, som du kan tjekke.
</td></tr></table>
</td></tr>
<tr><td align="left" style="padding:28px 0 0 2px;font-family:${FONT};font-size:13px">
${footerLink('https://horizen.dk', 'Horizen')}${dot}${dashboardLink ? `${footerLink(dashboardLink, 'SEO-dashboard')}${dot}` : ''}${footerLink('https://horizen.dk/kontakt', 'Kontakt')}
</td></tr>
<tr><td align="left" style="padding:12px 0 0 2px;font-family:${FONT};font-size:12px;color:${FAINT}">
${dashboardLink ? 'Du får denne mail, fordi Horizen arbejder på din hjemmeside.' : 'Du får denne mail, fordi du har været i kontakt med Horizen.'}
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`

	const text = [
		greeting,
		'',
		fields.intro,
		...(body.text ? ['', body.text] : []),
		'',
		...(code
			? [
					'',
					`Verificeret af Horizen. Kontrolkode ${code}: ${verifyUrl}?kode=${code}`,
				]
			: []),
		'',
		'Venlig hilsen',
		who,
		...(sender.trim() ? ['Horizen'] : []),
		'',
		`Pas på falske mails: Jeg opkræver aldrig andet end det, vi har aftalt, og jeg beder aldrig om kortoplysninger eller adgangskoder på mail. Får du en mail om betaling eller et abonnement, der ikke passer med vores aftale, også fra andre, så se bort fra den eller ring til mig først: ${HORIZEN_PHONE}. Mine mails har altid en kontrolkode, som du kan tjekke på ${verifyUrl}.`,
	].join('\n')

	return { subject, text, html }
}
