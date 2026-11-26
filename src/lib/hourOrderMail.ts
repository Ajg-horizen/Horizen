/**
 * Mails ved køb af klippekort-timer fra SEO-dashboardet (fra TUG, Andreas
 * 19/11-2026). Begge bygges på Horizens besked-skabelon fra fanen "Beskeder"
 * ("Fri besked" i src/app/dashboard/seo/messageText.ts). Skabelonen er ikke
 * valgbar under Beskeder; mailene sendes af systemet.
 *
 * 1. Besked til Horizen: kunden er afsender (kundens logo, navn og personen,
 *    der bestilte), med prisen og hvad der skal gøres bagefter (faktura →
 *    status i Studio). Uden Horizens kontrolkode, Trustpilot og advarslen om
 *    falske mails, som kun giver mening i mails fra Horizen.
 * 2. Kvittering til den, der bestilte: fra Andreas José · Horizen, med en
 *    rigtig kontrolkode, prisen, og at timerne kommer på klippekortet, når
 *    fakturaen er betalt.
 *
 * Prisen regnes her på serveren ud fra hourPackages, så et manipuleret beløb
 * fra browseren aldrig ender i en mail. Kundens navn, domæne og logo kommer fra
 * `brand` i data.ts. Bruges af /api/seo-task og af testscriptet
 * scripts/test-klippekort-mails.ts.
 */
import { brand, hourDiscount, hourPackages } from '@/app/dashboard/seo/data'
import { cleanFields, clientMessage, senderProfile } from '@/app/dashboard/seo/messageText'

const VAT = 0.25

/** Horizens afsender (samme som under Beskeder) */
export const ORDER_SENDER_EMAIL = 'ajg@horizen.dk'

/**
 * Kunden som afsender af bestillingen (beskeden til Horizen): logo og navn
 * øverst i mailen. Logoet er en PNG, fordi Gmail ikke viser SVG
 * (scripts/make-email-logo.mjs). Uden logo står kundens navn som tekst.
 */
export const ORDER_CLIENT = {
	name: brand.client,
	site: brand.domain,
	logo: brand.emailLogo || undefined,
	logoWidth: brand.emailLogoWidth,
	logoHeight: brand.emailLogoHeight,
}

export type HourQuote = {
	hours: number
	pricePerHour: number
	full: number
	discount: number
	saved: number
	/** Pris ekskl. moms */
	price: number
	vat: number
	/** Pris inkl. moms */
	total: number
}

/** Gyldigt antal timer (heltal inden for min/max), ellers null */
export function parseOrderHours(raw: unknown): number | null {
	const n = Number(raw)
	if (!Number.isInteger(n)) return null
	if (n < hourPackages.min || n > hourPackages.max) return null
	return n
}

export function hourQuote(hours: number): HourQuote {
	const { pricePerHour } = hourPackages
	const discount = hourDiscount(hours)
	const full = hours * pricePerHour
	const price = Math.round(full * (1 - discount))
	const vat = Math.round(price * VAT)
	return { hours, pricePerHour, full, discount, saved: full - price, price, vat, total: price + vat }
}

const kr = (n: number) => `${n.toLocaleString('da-DK', { maximumFractionDigits: 0 })} kr.`
export const timerWord = (n: number) => (n === 1 ? 'time' : 'timer')

/** Emne og tekst til opgaven, der gemmes i Sanity (seoInboxItem) */
export function orderTaskText(q: HourQuote) {
	return {
		subject: `Bestilling af ${q.hours} ${timerWord(q.hours)} til klippekortet`,
		message: [
			`Vi vil gerne købe ${q.hours} ${timerWord(q.hours)} til klippekortet.`,
			`Pris: ${kr(q.price)} ekskl. moms (${kr(q.pricePerHour)}/time${
				q.discount ? `, ${Math.round(q.discount * 100)} % rabat` : ''
			}).`,
			'Send gerne en faktura.',
		].join('\n'),
	}
}

/** Prisen som grøn boks i skabelonen (linjer med ">") */
function priceBox(q: HourQuote) {
	return [
		`> **${q.hours} ${timerWord(q.hours)} til klippekortet**`,
		`> ${kr(q.pricePerHour)} pr. time${q.discount ? `, ${Math.round(q.discount * 100)} % rabat: −${kr(q.saved)}` : ''}`,
		`> **I alt ${kr(q.price)} ekskl. moms** (${kr(q.total)} inkl. moms)`,
	].join('\n')
}

type Ctx = {
	/** Sidens adresse, så logo og billeder kan hentes af mailprogrammet */
	origin: string
	/** Kontrolkoden (messageCode); kun i kvitteringen fra Horizen */
	code?: string
	verifyBase?: string
	/** Andet logo end ORDER_CLIENT.logo, fx "cid:…" i testmails */
	clientLogo?: string
}

function build(ctx: Ctx, fields: Record<string, unknown>, fromClient?: Parameters<typeof clientMessage>[0]['fromClient']) {
	const profile = senderProfile(ORDER_SENDER_EMAIL)
	return clientMessage({
		template: 'fri',
		fields: cleanFields(fields),
		sender: profile.name,
		senderPhoto: profile.photo,
		origin: ctx.origin,
		dashboardLink: `${ctx.origin}/dashboard/seo`,
		code: ctx.code,
		verifyBase: ctx.verifyBase,
		fromClient,
	})
}

/* ── 1. Besked til Horizen ────────────────────────────────────── */

export function orderNotificationMail(q: HourQuote, who: { name?: string; email?: string }, ctx: Ctx) {
	// Ved kode-login er "navnet" bare kundens navn; så vises ingen person
	const person = who.name?.trim() && who.name.trim() !== ORDER_CLIENT.name ? who.name.trim() : ''
	const mail = build(
		ctx,
		{
			name: 'Andreas',
			heading: `Bestilling af ${q.hours} ${timerWord(q.hours)} til klippekortet`,
			intro: [
				`Vi vil gerne købe ${q.hours} ${timerWord(q.hours)} til klippekortet. Send gerne en faktura.`,
				priceBox(q),
				'---',
				'## Til Horizen',
				`1. Send en faktura på ${kr(q.total)} inkl. moms${who.email ? ` til ${who.email}` : ''}.`,
				`2. Sæt bestillingens status til **Faktura sendt** i Studio, og til **Betalt**, når den er betalt. Så kommer timerne på klippekortet i dashboardet.`,
				who.email
					? `${person || 'Afsenderen'} har fået en kvittering på mail. Bestillingen står også i dashboardet under Kun Horizen → Klippekort og som opgave i Studio.`
					: 'Der er ikke sendt en kvittering, fordi bestillingen kom fra et kode-login uden e-mail. Bestillingen står i dashboardet under Kun Horizen → Klippekort og som opgave i Studio.',
			].join('\n\n'),
			buttonText: 'Åbn Studio',
			buttonLink: `${ctx.origin}/admin`,
		},
		{
			name: ORDER_CLIENT.name,
			logo: ctx.clientLogo ?? ORDER_CLIENT.logo,
			logoWidth: ORDER_CLIENT.logoWidth,
			logoHeight: ORDER_CLIENT.logoHeight,
			person,
			personEmail: who.email,
		},
	)
	return {
		...mail,
		subject: `${ORDER_CLIENT.name}: bestilling af ${q.hours} ${timerWord(q.hours)} til klippekortet (${kr(q.price)})`,
	}
}

/* ── 2. Kvittering til kunden ─────────────────────────────────── */

export function orderReceiptMail(q: HourQuote, who: { name?: string }, ctx: Ctx) {
	const first = who.name?.trim().split(/\s+/)[0] ?? ''
	const mail = build(ctx, {
		name: first,
		heading: 'Tak for jeres bestilling',
		intro: [
			`Vi har modtaget jeres bestilling af ${q.hours} ${timerWord(q.hours)} til klippekortet, og vi sender en faktura hurtigst muligt.`,
			priceBox(q),
			'Timerne kommer på klippekortet, så snart fakturaen er betalt. Du kan altid se, hvor mange timer der er tilbage, under Overblik i dashboardet. Timerne bruges på rettelser, nye funktioner og SEO på hjemmesiden, når I har brug for dem.',
			'Har du spørgsmål til bestillingen, er du velkommen til at svare på denne mail.',
		].join('\n\n'),
		buttonText: 'Se klippekortet',
		buttonLink: `${ctx.origin}/dashboard/seo#v=overblik`,
	})
	return { ...mail, subject: `Kvittering: ${q.hours} ${timerWord(q.hours)} til klippekortet` }
}
