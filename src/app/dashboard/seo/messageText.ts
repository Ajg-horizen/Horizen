/**
 * Beskeder fra Horizen til kunden (Andreas 5/11-2026): servicebeskeder og
 * opgaver, adskilt fra spørgsmålene. Uden andre afhængigheder, så både
 * fanen "Beskeder" (forhåndsvisning) og POST /api/seo-message (afsendelse)
 * bygger præcis samme mail.
 *
 * Horizen-stil: logo, hvidt kort
 * med tynd kant, afsenderens portræt og navn. Alt er venstrestillet, og hvad
 * kunden skal gøre, står i en grøn boks øverst og som nummererede opgaver.
 * Bygget med tabeller og inline-stil, så den holder i Gmail og Outlook.
 */

export const MESSAGE_TEMPLATES = [
	{
		key: 'sikkerhed',
		label: 'Sikker kommunikation',
		hint: 'Fortæl kunder og samarbejdspartnere om det verificerede mærke, og hvordan de tjekker en mail fra dig. Flere modtagere får hver deres mail med egen kode.',
	},
	{
		key: 'anmeldelser',
		label: 'Anmeldelser og billeder',
		hint: 'Beder kunden sende anmeldelseslinket til sine kunder og sende billeder af sine opgaver.',
	},
	{
		key: 'arbejdsrum',
		label: 'Nyt i din indbakke',
		hint: 'Generel påmindelse om, at der ligger spørgsmål eller opgaver i "Indbakke" i dashboardet. Knappen går direkte til indbakken. Passer til alle kunder.',
	},
	{
		key: 'loest',
		label: 'Opgaverne er løst',
		hint: 'Kort besked om, at kundens opgaver er løst, og at de gerne må vende tilbage, hvis noget ikke er, som det skal være. Knappen går direkte til Aktivitet i dashboardet, hvor kunden kan se, hvad der er lavet. Passer til alle kunder.',
	},
	{
		key: 'moede',
		label: 'Opsummering af møde',
		hint: 'Fast opbygning til opsummering efter et kundemøde: det aftalte, det gør vi nu, og det har vi brug for fra dig. Ret punkterne til, før du sender. Knappen går til dashboardet, hvis du ikke giver et andet link.',
	},
	{
		key: 'fri',
		label: 'Fri besked',
		hint: 'Overskrift, tekst med afsnitsoverskrifter, punkter og bokse, og evt. én knap.',
	},
] as const

export type MessageTemplate = (typeof MESSAGE_TEMPLATES)[number]['key']

export function isMessageTemplate(v: unknown): v is MessageTemplate {
	return MESSAGE_TEMPLATES.some((t) => t.key === v)
}

/** Udgangspunktet for "Opsummering af møde"; punkterne rettes til mødet før afsendelse. */
const MEETING_TEMPLATE_TEXT = `Tak for et godt møde. Her er en kort opsummering af det, vi talte om, og hvad vi aftalte.

**Det aftalte vi på mødet**
1. [Emne]: [hvad vi aftalte, og hvad det betyder for dig]
2. [Emne]: [hvad vi aftalte, og hvad det betyder for dig]

**Det gør vi nu**
[Det første, vi går i gang med], og derefter [det næste].

**Det har vi brug for fra dig**
[Fx svar på spørgsmålene i din indbakke].

Har jeg misforstået noget, eller mangler der noget, så skriv bare tilbage.`

/** Felterne i formularen. Ikke alle bruges af alle skabeloner. */
export type MessageFields = {
	/** Kundens fornavn, fx "Anne" */
	name: string
	heading: string
	/** Tekst; en tom linje giver nyt afsnit */
	intro: string
	/** anmeldelser: kundens link fra Google-profilen (g.page/r/…/review) */
	reviewLink: string
	/** anmeldelser: hilsenen i SMS'en, fx "Anne, Firmanavn ApS" */
	smsSign: string
	/** anmeldelser: bed også om billeder */
	askPhotos: boolean
	/** anmeldelser: teksten i den gule boks (vises kun uden anmeldelseslink) */
	priorityText: string
	/** anmeldelser: teksten over SMS'en */
	reviewText: string
	/** anmeldelser: SMS'en; linket og hilsenen sættes på automatisk */
	smsText: string
	/** anmeldelser: teksten om billeder; en tom linje giver nyt afsnit */
	photoText: string
	/** fri: knap */
	buttonText: string
	buttonLink: string
	/** fri: vis Horizens ydelser som små labels nederst (HORIZEN_SERVICES) */
	showServices: boolean
}

export const MAX_FIELD = 3000

/** Det, Horizen tilbyder, vist som labels med ikon i "Fri besked" (Andreas
 * 6/11-2026). Fagtermer, ingen produktnavne. Ikonerne er PNG i
 * public/email/ikoner (Gmail viser ikke SVG). */
export const HORIZEN_SERVICES = [
	{ label: 'Softwareudvikling', icon: 'software' },
	{ label: 'Komplekse systemer og integrationer', icon: 'systemer' },
	{ label: 'AI-automatisering', icon: 'ai-automatisering' },
	{ label: 'Private AI (på egne data)', icon: 'private-ai' },
	{ label: 'Sikkerhed og kryptering', icon: 'sikkerhed' },
	{ label: 'SEO', icon: 'seo' },
	{ label: 'GEO (synlighed i AI-søgning)', icon: 'geo' },
	{ label: 'Google Ads', icon: 'annoncer' },
]

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
		priorityText: str('priorityText', MAX_FIELD),
		reviewText: str('reviewText', MAX_FIELD),
		smsText: str('smsText', 600),
		photoText: str('photoText', MAX_FIELD),
		buttonText: str('buttonText', 60),
		buttonLink: str('buttonLink', 300),
		showServices: r.showServices === true,
	}
}

/**
 * En færdig kladde til fanen "Beskeder" (clientMessageDrafts i data.ts): skabelon
 * og felter er udfyldt på forhånd, så Horizen kun skal tjekke og trykke send.
 */
export type MessageDraft = {
	/** Fast nøgle, fx "moede-2026-11-10" */
	id: string
	/** Teksten på knappen under "Klar til afsendelse" */
	label: string
	template: MessageTemplate
	/** Modtager(e), adskilt med komma; tom = Horizen skriver selv */
	to?: string
	fields: Partial<MessageFields>
}

/**
 * Standardteksterne i "Anmeldelser og billeder". Neutrale, så de passer til
 * alle brancher (håndværker, klinik, rengøring …); rettes til i formularen
 * før afsendelse (Andreas 10/11-2026). Tomme felter falder tilbage hertil.
 */
export const REVIEW_TEXT_DEFAULTS = {
	priorityText:
		'Indtil Google har verificeret profilen, kommer du ikke med på kortet, og dine kunder kan ikke skrive anmeldelser. Alt det andet i denne mail virker først rigtigt, når profilen er på plads. Log ind på Google Business Profile, og følg Googles trin. Beder Google om en video eller en kode, så gør det med det samme. Sidder du fast, så ring eller skriv til mig, så klarer vi det sammen.',
	reviewText:
		'Send SMS\'en til dine kunder fra det seneste år, og fremover samme dag, du har haft dem. Hver anmeldelse rykker dig tættere på kortet.',
	smsText:
		'Hej [navn]. Tak fordi du valgte mig. Vil du hjælpe mig med at skrive et par ord på Google om, hvordan du oplevede det? Det tager et minut:',
	photoText:
		'Jeg har brug for mindst 10 billeder fra din hverdag. Ikke kun resultater: det vigtigste er billeder med mennesker. Dig i gang med arbejdet, dine omgivelser og gerne et smil. Det er dem, der gør profilen menneskelig, og det er dem, kunderne kigger efter.\n\nLav gerne en mappe i Dropbox eller Google Drev, og del den med mig. Så lægger du bare billederne derind, efterhånden som du tager dem, og jeg sørger for, at de kommer på hjemmesiden og profilen. Du kan også bare svare på denne mail med dem.',
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
		priorityText: '',
		reviewText: '',
		smsText: '',
		photoText: '',
		buttonText: '',
		buttonLink: '',
		showServices: false,
		...base,
	}
	if (template === 'anmeldelser') {
		return {
			...common,
			// Kundens egne tekster fra data.ts (clientMessageDefaults) vinder
			priorityText: common.priorityText || REVIEW_TEXT_DEFAULTS.priorityText,
			reviewText: common.reviewText || REVIEW_TEXT_DEFAULTS.reviewText,
			smsText: common.smsText || REVIEW_TEXT_DEFAULTS.smsText,
			photoText: common.photoText || REVIEW_TEXT_DEFAULTS.photoText,
			heading: 'Sådan kommer vi hurtigere frem på Google sammen',
			intro:
				'Når folk søger efter en virksomhed som din i området, viser Google først et kort med tre firmaer. Det er dem, folk ringer til. Hvem der kommer med på kortet, afgøres især af anmeldelser og billeder på Google-profilen.\n\nJeg står for hjemmesiden og profilen. Men anmeldelser og billeder kan kun du skaffe, og det er dem, der flytter mest lige nu. Der er to ting, du kan gøre for at hjælpe mig med at få dig hurtigere i mål.',
		}
	}
	if (template === 'moede') {
		// Generisk mødeopsummering til alle kunder (Andreas 15/11-2026, fra Miljøkontoret)
		return {
			...common,
			heading: 'Opsummering af vores møde',
			intro: MEETING_TEMPLATE_TEXT,
			buttonText: common.buttonText || 'Se dit dashboard',
		}
	}
	if (template === 'arbejdsrum') {
		// Generisk påmindelse til alle kunder (Andreas 15/11-2026)
		return {
			...common,
			heading: 'Der ligger noget til dig i dit dashboard',
			intro:
				'Der ligger spørgsmål og opgaver i dit dashboard, som du meget gerne må tage stilling til, når du har lejlighed. Det kan have betydning for vores SEO-indsats og udviklingen af din hjemmeside. Jo før vi får dine svar, jo mere effektivt kan vi arbejde videre med den.\n\nDu finder dem under "Indbakke". Under Spørgsmål skriver du svaret direkte under spørgsmålet. Under Nye opgaver trykker du "Set, læg på min liste", så flytter opgaven over på din liste under Opgaver → Jeres opgaver, og den tager du, når du har tid.',
		}
	}
	if (template === 'loest') {
		// Generisk besked, når en opgave er løst (Andreas 19/11-2026). Ikke
		// specifik om opgaven: knappen viser kunden det hele under Aktivitet.
		return {
			...common,
			heading: 'Opgaverne er løst',
			// Ingen tidsfrist og intet om beregning (Andreas 19/11-2026: god
			// relation, det skal ikke lyde "boss'et"). Bare en opfordring til at
			// tjekke det leverede og vende tilbage.
			intro:
				'Vi har nu løst de opgaver, du har bedt os om. I aktivitetsloggen i dit dashboard kan du se, hvad der er lavet, og hvor du finder det.\n\nKig gerne tingene igennem, når du har tid. Er der noget, der ikke er, som det skal være, er du velkommen til at svare på denne mail eller oprette en ny opgave i dashboardet, så ser vi på det.',
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
/**
 * Horizens Trustpilot under logoet i bunden af mailen (Andreas 10/11-2026: kun
 * som tillidsmærke, ingen opfordring til anmeldelse). Tallene står fast her og
 * rettes i hånden, når scoren ændrer sig; billedet med stjerner skal passe til
 * scoren (public/email/trustpilot-stjerner-4-5.png). Tjekket 10/11-2026.
 */
const TRUSTPILOT = {
	url: 'https://dk.trustpilot.com/review/horizen.dk',
	score: '4,5',
	count: 13,
	stars: '/email/trustpilot-stjerner-4-5.png',
}
const FONT =
	"Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"

const initials = (name: string) =>
	name
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((p) => p[0]?.toUpperCase())
		.join('') || 'H'

/** Et afsnit med kun "---" giver en blød skillestreg */
const DIVIDER = /^-{3,}$/
const divider = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 12px"><tr><td style="border-top:1px solid ${LINE};font-size:0;line-height:0;height:1px">&nbsp;</td></tr></table>`

/** Afsnit adskilt af tomme linjer → <p>; enkelte linjeskift → <br> */
const paragraphs = (text: string, style: string) =>
	text
		.split(/\n\s*\n/)
		.map((p) => p.trim())
		.filter(Boolean)
		.map((p) =>
			DIVIDER.test(p)
				? divider
				: `<p style="${style}">${escapeHtml(p)
						.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
						.replace(/\n/g, '<br>')}</p>`,
		)
		.join('\n')

/** **fed** står uden stjerner og "---" uden streg i tekstudgaven */
const plain = (text: string) =>
	text
		.replace(/\*\*(.+?)\*\*/g, '$1')
		.replace(/^\s*-{3,}\s*$/gm, '')
		.replace(/\n{3,}/g, '\n\n')

const label = (text: string, color = FAINT) =>
	`<span style="display:block;font-size:11px;letter-spacing:.08em;text-transform:uppercase;font-weight:700;color:${color};margin-bottom:6px">${text}</span>`

/** Horizens ydelser som små labels (fri besked med showServices) */
const servicesBlock = (abs: (src: string) => string) =>
	`<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f6f6f3" style="margin:32px 0 0;background:#f6f6f3;border-radius:12px"><tr><td style="padding:20px 20px 12px;font-family:${FONT}">
${label('Det kan Horizen også hjælpe med')}
<p style="margin:4px 0 0;line-height:1">${HORIZEN_SERVICES.map(
		(s) =>
			`<span style="display:inline-block;margin:0 6px 8px 0;padding:7px 12px 7px 10px;border:1px solid ${LINE};border-radius:999px;background:#ffffff;font-size:13px;line-height:1.2;font-weight:600;color:${INK};white-space:nowrap"><img src="${escapeHtml(abs(`/email/ikoner/${s.icon}.png`))}" width="14" height="14" alt="" style="display:inline-block;width:14px;height:14px;border:0;vertical-align:-2px;margin-right:6px">${escapeHtml(s.label)}</span>`,
	).join('')}</p>
</td></tr></table>`

const button = (href: string, text: string, outline = false) =>
	outline
		? `<a href="${escapeHtml(href)}" style="display:inline-block;padding:7px 14px;border-radius:8px;border:1px solid ${INK};color:${INK};font-size:13px;font-weight:600;text-decoration:none">${escapeHtml(text)}</a>`
		: `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0 0"><tr><td style="background:${INK};border-radius:10px"><a href="${escapeHtml(href)}" style="display:inline-block;padding:14px 26px;font-family:${FONT};font-size:15px;font-weight:600;color:#ffffff;text-decoration:none">${escapeHtml(text)}</a></td></tr></table>`

const step = (n: number, title: string) =>
	`<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:44px 0 0"><tr><td valign="middle" style="padding-right:12px"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td width="28" height="28" align="center" valign="middle" style="width:28px;height:28px;border-radius:14px;background:${ACCENT};color:#ffffff;font-family:${FONT};font-size:13px;font-weight:700">${n}</td></tr></table></td><td valign="middle" style="font-family:${FONT};font-size:20px;line-height:1.3;font-weight:700;color:${INK}">${escapeHtml(title)}</td></tr></table>`

const P = `margin:16px 0 0;font-size:15px;line-height:1.6`
const SMALL = `margin:8px 0 0;font-size:12px;line-height:1.5;color:${FAINT}`

/**
 * Let opsætning i "Fri besked" (fra Miljøkontoret, Andreas 10/11-2026:
 * kundemails skal se professionelle ud). Afsnit adskilles af tomme linjer:
 *   ## Overskrift      → afsnitsoverskrift
 *   > linje            → grøn boks (alle linjer i afsnittet med >)
 *   1. tekst           → nummereret punkt med grøn cirkel
 *   - tekst            → punkt med grøn prik (en linje pr. punkt)
 *   ---                → blød skillestreg
 *   **fed**            → fed tekst, overalt
 */
const inline = (s: string) =>
	escapeHtml(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')

function richText(text: string): string {
	return text
		.split(/\n\s*\n/)
		.map((b) => b.trim())
		.filter(Boolean)
		.map((block) => {
			if (DIVIDER.test(block)) return divider
			const ls = block.split('\n').map((l) => l.trim())
			if (ls[0].startsWith('## ')) {
				const h = `<h2 style="margin:36px 0 0;font-family:${FONT};font-size:19px;line-height:1.3;font-weight:700;color:${INK}">${inline(ls[0].slice(3))}</h2>`
				const rest = ls.slice(1).join('\n').trim()
				return rest ? `${h}\n${richText(rest)}` : h
			}
			if (ls.every((l) => l.startsWith('>'))) {
				const inner = ls.map((l) => inline(l.replace(/^>\s?/, ''))).join('<br>')
				return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0 0"><tr>
<td style="background:#eef6f1;border-left:3px solid ${ACCENT};border-radius:8px;padding:16px 20px;font-family:${FONT};font-size:15px;line-height:1.6;color:${INK}">${inner}</td></tr></table>`
			}
			const num = ls[0].match(/^(\d+)\.\s+(.*)$/)
			if (num) {
				const body = [num[2], ...ls.slice(1)].map(inline).join('<br>')
				return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:16px 0 0"><tr>
<td valign="top" width="40" style="width:40px;padding-top:1px"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td width="26" height="26" align="center" valign="middle" style="width:26px;height:26px;border-radius:13px;background:${ACCENT};color:#ffffff;font-family:${FONT};font-size:13px;font-weight:700">${num[1]}</td></tr></table></td>
<td valign="top" style="font-family:${FONT};font-size:15px;line-height:1.6;color:${INK}">${body}</td></tr></table>`
			}
			if (ls.every((l) => l.startsWith('- '))) {
				return ls
					.map(
						(l) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:10px 0 0"><tr>
<td valign="top" width="22" style="width:22px;padding-top:9px"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td width="7" height="7" style="width:7px;height:7px;border-radius:4px;background:${ACCENT};font-size:0;line-height:0">&nbsp;</td></tr></table></td>
<td valign="top" style="font-family:${FONT};font-size:15px;line-height:1.6;color:${INK}">${inline(l.slice(2))}</td></tr></table>`,
					)
					.join('\n')
			}
			return `<p style="${P}">${ls.map(inline).join('<br>')}</p>`
		})
		.join('\n')
}

/** Fri besked uden opsætningstegn, til tekstudgaven og preheaderen. */
const plainRich = (text: string) =>
	plain(
		text
			.split('\n')
			.map((l) =>
				l
					.replace(/^\s*##\s+(.*)$/, (_, h: string) => h.toUpperCase())
					.replace(/^\s*>\s?/, ''),
			)
			.join('\n'),
	)

/** Mærket "Verificeret af Horizen" med kontrolkode og link til tjek-siden. */
export function verifyBadge({
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
	// Rettede tekster fra formularen; tomme felter falder tilbage til standarden
	const t = (k: keyof typeof REVIEW_TEXT_DEFAULTS) =>
		f[k]?.trim() || REVIEW_TEXT_DEFAULTS[k]
	const sms = `${t('smsText')} ${link || '[link]'}${f.smsSign ? `\nVenlig hilsen ${f.smsSign}` : ''}`
	const qr = link
		? `${origin}/api/seo-message/qr?d=${encodeURIComponent(link)}`
		: ''
	const tasks = [
		`<strong>1.</strong> Bed dine kunder om en anmeldelse (SMS'en er klar nedenfor)`,
		...(f.askPhotos
			? [`<strong>2.</strong> Send mig billeder, gerne med mennesker`]
			: []),
	]
	const BODY = `margin:12px 0 0;font-size:15px;line-height:1.6`

	// Uden anmeldelseslink er profilen ikke verificeret endnu. Så er det den
	// vigtigste opgave, og den står øverst i en farvet boks (Andreas 10/11-2026).
	const priority = link
		? ''
		: `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 0"><tr>
<td style="background:#fff4e5;border:2px solid #f59e0b;border-radius:10px;padding:18px 20px;font-size:15px;line-height:1.6">
${label('⚠ Det vigtigste lige nu', '#b42318')}
<p style="margin:0;font-family:${FONT};font-size:18px;line-height:1.35;font-weight:700;color:${INK}">Få din Google-profil verificeret</p>
${paragraphs(t('priorityText'), 'margin:10px 0 0;font-size:15px;line-height:1.6')}
${button('https://business.google.com/', 'Åbn Google-profilen')}
</td></tr></table>`

	const html = `${priority}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 0"><tr>
<td style="background:#eef6f1;border-left:3px solid ${ACCENT};border-radius:8px;padding:16px 20px;font-size:15px;line-height:1.6">
${label(f.askPhotos ? 'To ting, du kan gøre for at hjælpe mig' : 'Det kan du gøre for at hjælpe mig', '#00875a')}
${tasks.join('<br>\n')}
</td></tr></table>

${step(1, 'Hjælp mig med anmeldelser')}
${paragraphs(t('reviewText'), BODY)}

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0 0;border:1px solid ${LINE};border-radius:12px"><tr><td style="padding:0">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td style="padding:14px 18px;border-bottom:1px solid ${LINE};font-size:13px;font-weight:700">SMS til dine kunder</td>
<td align="right" style="padding:10px 14px;border-bottom:1px solid ${LINE}"><a href="${escapeHtml(`sms:?&body=${encodeURIComponent(sms)}`)}" style="display:inline-block;padding:7px 14px;border-radius:8px;background:${INK};color:#ffffff;font-size:13px;font-weight:600;text-decoration:none">Åbn i SMS</a></td>
</tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td style="background:#f6f6f3;padding:16px 18px;border-radius:0 0 12px 12px;font-family:'SF Mono',Menlo,Consolas,monospace;font-size:13px;line-height:1.65;color:${INK}">${escapeHtml(sms).replace(/\n/g, '<br>')}</td>
</tr></table>
</td></tr></table>
<p style="${SMALL}">På mobilen åbner knappen din beskedapp med teksten skrevet ind. Ret det i [klammer], og vælg kunden.${link ? '' : ' Linket til anmeldelser sender jeg, så snart din Google-profil er verificeret.'}</p>
${
	qr
		? `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0 0;border:1px solid ${LINE};border-radius:12px"><tr>
<td valign="middle" width="120" style="width:120px;padding:16px 0 16px 18px"><img src="${escapeHtml(qr)}" width="96" height="96" alt="QR-kode til anmeldelser" style="display:block;width:96px;height:96px;border:0"></td>
<td valign="middle" style="padding:16px 18px 16px 8px">
<p style="margin:0;font-size:13px;font-weight:700">QR-kode til anmeldelser</p>
<p style="margin:4px 0 12px;font-size:13px;line-height:1.55;color:${MUTED}">Lad kunden scanne den, når I står sammen. Print den på tilbud og fakturaer, eller hæng den op, hvor dine kunder ser den.</p>
${button(`${qr}&download=1`, 'Hent QR-koden', true)}
</td></tr></table>`
		: ''
}
${
	f.askPhotos
		? `
${step(2, 'Send mig dine billeder')}
${paragraphs(t('photoText'), BODY)}
<p style="${SMALL}">Spørg altid først, hvis en kunde eller andre er med på billedet.</p>`
		: ''
}

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:40px 0 0"><tr>
<td style="border-top:1px solid ${LINE};padding-top:20px;font-size:13px;line-height:1.6;color:${MUTED}">
${label('Godt at vide')}
Spørg alle kunder, ikke kun dem, du tror er glade. Aldrig rabat eller gave for en anmeldelse, og ikke familie eller venner. Svar gerne på alle anmeldelser, også de kritiske.
</td></tr></table>`

	const text = [
		...(link
			? []
			: [
					'DET VIGTIGSTE LIGE NU: Få din Google-profil verificeret.',
					t('priorityText'),
					'',
				]),
		'Det kan du gøre for at hjælpe mig:',
		'',
		'1. Bed dine kunder om en anmeldelse.',
		t('reviewText'),
		'SMS du kan sende:',
		sms,
		...(f.askPhotos ? ['', '2. Send mig dine billeder.', t('photoText')] : []),
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
	fromClient,
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
	/**
	 * Systemmail FRA kunden TIL Horizen (fx bestilling af klippekort-timer,
	 * Andreas 19/11-2026): kundens logo og navn øverst, personen der sendte den,
	 * og hilsen fra personen. Uden Horizens kontrolkode, Trustpilot og advarsel
	 * om falske mails, som kun giver mening i mails fra Horizen.
	 */
	fromClient?: {
		name: string
		/** PNG (Gmail viser ikke SVG); sti, https- eller cid:-adresse */
		logo?: string
		logoWidth?: number
		logoHeight?: number
		person?: string
		personEmail?: string
	}
}) {
	const abs = (src: string) => (/^(https?:\/\/|cid:)/.test(src) ? src : origin + src)
	const verifyUrl = verifyBase?.trim() || `${origin}/tjek-mail`
	const who = fromClient ? fromClient.person?.trim() || fromClient.name : sender.trim() || 'Horizen'
	// Anden linje i hilsenen: "Horizen", eller kundens navn når en person fra kunden står som afsender
	const teamName = fromClient ? (fromClient.person?.trim() ? fromClient.name : '') : sender.trim() ? 'Horizen' : ''
	const team = teamName ? `<br>${escapeHtml(teamName)}` : ''
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
				: template === 'loest'
					? (() => {
							// Knappen går direkte til Aktivitet (#v=aktivitet)
							const link = `${dashboardLink || `${origin}/dashboard/seo`}#v=aktivitet`
							return {
								html: button(link, 'Se aktivitetsloggen'),
								text: `Se aktivitetsloggen: ${link}`,
							}
						})()
				: template === 'arbejdsrum'
					? (() => {
							// Knappen går direkte til arbejdsrummet (#v=arbejdsrum)
							const link = `${dashboardLink || `${origin}/dashboard/seo`}#v=arbejdsrum`
							return {
								html: button(link, 'Gå til din indbakke'),
								text: `Gå til din indbakke: ${link}`,
							}
						})()
					: (() => {
							// Mødeopsummering uden eget link: knappen går til dashboardet
							const link = isUrl(fields.buttonLink)
								? fields.buttonLink
								: template === 'moede'
									? dashboardLink || `${origin}/dashboard/seo`
									: ''
							return {
								html: link && fields.buttonText ? button(link, fields.buttonText) : '',
								text: link && fields.buttonText ? `${fields.buttonText}: ${link}` : '',
							}
						})()

	// Horizens ydelser nederst, kun i "Fri besked" og kun når det er slået til
	const services = template === 'fri' && fields.showServices

	const avatar = senderPhoto
		? `<img src="${escapeHtml(abs(senderPhoto))}" width="56" height="56" alt="${escapeHtml(who)}" style="display:block;width:56px;height:56px;border-radius:28px;border:0;object-fit:cover">`
		: `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td width="56" height="56" align="center" valign="middle" style="width:56px;height:56px;border-radius:28px;background:#e8f0e4;color:#2f7a3a;font-family:${FONT};font-size:16px;font-weight:700">${escapeHtml(initials(who))}</td></tr></table>`

	const dot = `<span style="color:${ACCENT};padding:0 10px">&#9679;</span>`
	const footerLink = (href: string, text: string) =>
		`<a href="${escapeHtml(href)}" style="color:#f5f5f0;text-decoration:none;font-weight:600">${text}</a>`
	const introPlain = template === 'fri' ? plainRich(fields.intro) : plain(fields.intro)
	const preheader = introPlain.trim().split(/\n/)[0]?.slice(0, 140) || heading

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
${
	fromClient
		? `${
				fromClient.logo
					? `<img src="${escapeHtml(abs(fromClient.logo))}" width="${fromClient.logoWidth ?? 200}" height="${fromClient.logoHeight ?? 42}" alt="${escapeHtml(fromClient.name)}" style="display:block;width:${fromClient.logoWidth ?? 200}px;height:auto;border:0">`
					: `<p style="margin:0;font-size:18px;font-weight:700;color:${INK}">${escapeHtml(fromClient.name)}</p>`
			}${
				fromClient.person
					? `<p style="margin:14px 0 0;font-family:${FONT};font-size:14px;line-height:1.4;color:${MUTED}">Sendt af <strong style="color:${INK}">${escapeHtml(fromClient.person)}</strong>${fromClient.personEmail ? ` · <a href="mailto:${escapeHtml(fromClient.personEmail)}" style="color:${MUTED}">${escapeHtml(fromClient.personEmail)}</a>` : ''}</p>`
					: ''
			}`
		: `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td valign="middle"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
<td valign="middle" style="padding-right:12px">${avatar}</td>
<td valign="middle" style="font-family:${FONT};font-size:14px;line-height:1.4;color:${MUTED}"><strong style="color:${INK}">${escapeHtml(who)}</strong>${team}</td>
</tr></table></td>
</tr></table>`
}
${
	// "Nyt i dit arbejdsrum": brev med udråbstegn, så kunden straks kan se, at
	// der er noget at tage stilling til (Andreas 16/11-2026). Billede, ikke
	// SVG, så det vises i alle mailprogrammer.
	template === 'arbejdsrum'
		? `<img src="${escapeHtml(abs('/email/arbejdsrum-brev.png'))}" width="64" height="64" alt="Ny besked" style="display:block;width:64px;height:64px;border:0;margin:28px 0 0">`
		: template === 'loest'
			? // Grønt flueben (PNG, ikke SVG, så det vises i alle mailprogrammer)
				`<img src="${escapeHtml(abs('/email/opgave-loest.png'))}" width="64" height="64" alt="Løst" style="display:block;width:64px;height:64px;border:0;margin:28px 0 0">`
			: ''
}
<h1 style="margin:${template === 'arbejdsrum' || template === 'loest' ? '16px' : '28px'} 0 0;font-family:${FONT};font-size:28px;line-height:1.2;font-weight:700;color:${INK}">${escapeHtml(heading)}</h1>
<p style="margin:20px 0 0;font-size:15px;line-height:1.6"><strong>${escapeHtml(greeting)}</strong></p>
${template === 'fri' ? richText(fields.intro) : paragraphs(fields.intro, P.replace('16px 0 0', '8px 0 0'))}
${body.html}
<p style="margin:32px 0 0;font-size:15px;line-height:1.6">Venlig hilsen<br><strong>${escapeHtml(who)}</strong>${teamName ? `<br><span style="color:${MUTED}">${escapeHtml(teamName)}</span>` : ''}</p>
${services ? servicesBlock(abs) : ''}
${fromClient ? '' : verifyBadge({ gif: abs('/email/horizen-maerke.gif'), code, verifyUrl })}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:32px 0 0"><tr>
<td align="center" style="border-top:1px solid ${LINE};padding-top:32px"><img src="${escapeHtml(abs('/email/horizen-logo.png'))}" width="140" height="27" alt="Horizen" style="display:block;width:140px;height:auto;border:0;margin:0 auto"></td>
</tr>
${
	fromClient
		? ''
		: `<tr><td align="center" style="padding-top:18px">
<a href="${TRUSTPILOT.url}" style="text-decoration:none;color:${INK}"><table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto"><tr>
<td valign="middle" style="padding-right:10px;font-family:${FONT};font-size:15px;font-weight:700;color:${INK};white-space:nowrap"><span style="color:${ACCENT}">&#9733;</span>&nbsp;Trustpilot</td>
<td valign="middle" style="padding-right:10px"><img src="${escapeHtml(abs(TRUSTPILOT.stars))}" width="108" height="20" alt="${TRUSTPILOT.score} ud af 5 stjerner" style="display:block;width:108px;height:20px;border:0"></td>
<td valign="middle" style="font-family:${FONT};font-size:13px;color:${MUTED};white-space:nowrap"><strong style="color:${INK}">${TRUSTPILOT.score}</strong> · ${TRUSTPILOT.count} anmeldelser</td>
</tr></table></a>
`
}</td></tr></table>
</td></tr>
${
	fromClient
		? ''
		: `<tr><td style="padding:24px 0 0">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td style="border:1px solid #3a3a36;border-radius:12px;padding:16px 20px;font-family:${FONT};font-size:13px;line-height:1.6;color:#d6d6d0">
<strong style="color:#ffffff">Pas på falske mails.</strong> Jeg opkræver aldrig andet end det, vi har aftalt, og jeg beder aldrig om kortoplysninger eller adgangskoder på mail. Får du en mail om betaling eller et abonnement, der ikke passer med vores aftale, også fra andre, så se bort fra den eller ring til mig først: <a href="tel:${HORIZEN_PHONE.replace(/\s/g, '')}" style="color:#ffffff;font-weight:600;text-decoration:none;white-space:nowrap">${HORIZEN_PHONE}</a>. Mine mails er altid verificeret med en kontrolkode, som du kan tjekke.
</td></tr></table>
</td></tr>
`
}
<tr><td align="left" style="padding:28px 0 0 2px;font-family:${FONT};font-size:13px">
${footerLink('https://horizen.dk', 'Horizen')}${dot}${dashboardLink ? `${footerLink(dashboardLink, 'Dashboard')}${dot}` : ''}${footerLink('https://horizen.dk/kontakt', 'Kontakt')}
</td></tr>
<tr><td align="left" style="padding:12px 0 0 2px;font-family:${FONT};font-size:12px;color:${FAINT}">
${fromClient ? `Sendt automatisk fra SEO-dashboardet for ${escapeHtml(fromClient.name)}.` : dashboardLink ? 'Du får denne mail, fordi Horizen arbejder på din hjemmeside.' : 'Du får denne mail, fordi du har været i kontakt med Horizen.'}
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`

	const text = [
		greeting,
		'',
		introPlain,
		...(body.text ? ['', body.text] : []),
		'',
		...(code && !fromClient
			? [
					'',
					`Verificeret af Horizen. Kontrolkode ${code}: ${verifyUrl}?kode=${code}`,
				]
			: []),
		'',
		'Venlig hilsen',
		who,
		...(teamName ? [teamName] : []),
		...(services
			? ['', `Det kan Horizen også hjælpe med: ${HORIZEN_SERVICES.map((s) => s.label).join(', ')}.`]
			: []),
		...(fromClient ? [] : ['']),
		...(fromClient ? [] : [`Pas på falske mails: Jeg opkræver aldrig andet end det, vi har aftalt, og jeg beder aldrig om kortoplysninger eller adgangskoder på mail. Får du en mail om betaling eller et abonnement, der ikke passer med vores aftale, også fra andre, så se bort fra den eller ring til mig først: ${HORIZEN_PHONE}. Mine mails har altid en kontrolkode, som du kan tjekke på ${verifyUrl}.`]),
	].join('\n')

	return { subject, text, html }
}
