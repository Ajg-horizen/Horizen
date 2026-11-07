import 'server-only'
import { client } from '@/sanity/lib/client'
import { monthKey } from './pageStats'

/**
 * Hvornår kundens folk har været inde i SEO-dashboardet (Andreas 7/11-2026).
 * Vises KUN for Horizen (ikonet øverst til højre, se LoginActivity.tsx),
 * aldrig for kunden. Formålet er at se, om kunden bruger dashboardet, og
 * opdage, hvis ingen har været inde i lang tid.
 *
 * Bevidst ingen lang log: pr. person og måned gemmes kun navn, e-mail, antal
 * besøg og seneste besøg, i ét privat dokument pr. måned,
 * "dashboardLogins.ÅÅÅÅ-MM" (punktum = privat id, kan kun læses med token).
 * Der læses højst LOOKBACK_MONTHS tilbage.
 *
 * Et besøg = kunden åbner /dashboard/seo. Genindlæsninger inden for
 * VISIT_GAP tæller som samme besøg. Horizens egne besøg (e-mail på
 * horizen.dk) og Horizen, der ser dashboardet som kunden (?som=kunde),
 * logges ikke.
 */

type PersonMonth = { name?: string; email: string; count?: number; lastAt?: string }
type MonthDoc = { month: string; people?: Record<string, PersonMonth> }

/** Genindlæsninger inden for 30 min er samme besøg */
const VISIT_GAP = 30 * 60_000
/** Så langt tilbage læses (og "ikke inde i X måneder" kan ses) */
const LOOKBACK_MONTHS = 12
/** Ingen fra kunden inde i så mange dage: orange prik på ikonet */
export const INACTIVE_DAYS = 30

const docId = (month: string) => `dashboardLogins.${month}`
const personKey = (email: string) =>
	`p_${email.replace(/[^a-z0-9]/g, '_')}`.slice(0, 120)

function privateClient(token: string | undefined) {
	return client.withConfig({
		token,
		useCdn: false,
		perspective: 'published',
		stega: false,
	})
}

/** Tæl et besøg fra kunden. Må aldrig vælte dashboardet. */
export async function recordDashboardVisit(
	name: string,
	email: string,
	now = new Date(),
): Promise<void> {
	const token = process.env.SANITY_API_WRITE_TOKEN
	const who = email.trim().toLowerCase()
	if (!token || !who) return
	const month = monthKey(now)
	const id = docId(month)
	const key = personKey(who)
	const sanity = privateClient(token)
	try {
		const lastAt = await sanity.fetch<string | null>(
			`*[_id == $id][0].people[$key].lastAt`,
			{ id, key },
			{ cache: 'no-store' },
		)
		if (lastAt && now.getTime() - new Date(lastAt).getTime() < VISIT_GAP)
			return

		await sanity
			.transaction()
			.createIfNotExists({
				_id: id,
				_type: 'dashboardLoginLog',
				month,
				people: {},
			})
			.patch(id, (p) =>
				p
					.setIfMissing({ people: {} })
					.setIfMissing({ [`people.${key}`]: { email: who, count: 0 } })
					.set({
						[`people.${key}.name`]: name.trim() || who,
						[`people.${key}.lastAt`]: now.toISOString(),
					})
					.inc({ [`people.${key}.count`]: 1 }),
			)
			.commit()
	} catch (err) {
		console.error('[dashboardLogins] kunne ikke gemme besøget', err)
	}
}

/** Pr. person: seneste besøg og antal besøg denne og sidste måned */
export type LoginPerson = {
	name: string
	email: string
	lastAt: string
	thisMonth: number
	lastMonth: number
}

function monthsBack(now: Date, n: number) {
	return Array.from({ length: n }, (_, i) => {
		const d = new Date(now)
		d.setUTCDate(15)
		d.setUTCMonth(d.getUTCMonth() - i)
		return monthKey(d)
	})
}

export async function getDashboardLogins(
	now = new Date(),
): Promise<LoginPerson[]> {
	const months = monthsBack(now, LOOKBACK_MONTHS)
	try {
		const docs =
			(await privateClient(process.env.SANITY_API_READ_TOKEN).fetch<
				MonthDoc[] | null
			>(
				`*[_id in $ids]{ month, people }`,
				{ ids: months.map(docId) },
				{ cache: 'no-store' },
			)) ?? []
		return combineLogins(docs, months[0], months[1])
	} catch (err) {
		console.error('[dashboardLogins] kunne ikke hente besøgene', err)
		return []
	}
}

function combineLogins(
	docs: MonthDoc[],
	thisMonth: string,
	lastMonth: string,
): LoginPerson[] {
	const people = new Map<string, LoginPerson>()
	for (const doc of docs)
		for (const p of Object.values(doc.people ?? {})) {
			if (!p?.email || !p.lastAt) continue
			const cur = people.get(p.email) ?? {
				name: p.name || p.email,
				email: p.email,
				lastAt: p.lastAt,
				thisMonth: 0,
				lastMonth: 0,
			}
			if (p.lastAt >= cur.lastAt) {
				cur.lastAt = p.lastAt
				cur.name = p.name || cur.name
			}
			if (doc.month === thisMonth) cur.thisMonth += p.count ?? 0
			if (doc.month === lastMonth) cur.lastMonth += p.count ?? 0
			people.set(p.email, cur)
		}
	return [...people.values()].sort((a, b) => b.lastAt.localeCompare(a.lastAt))
}

/* ── Klar til visning: formateret på serveren i dansk tid, så server og browser viser det samme ── */

export type LoginSummary = {
	people: {
		name: string
		email: string
		/** fx "6. nov. kl. 14.32" */
		last: string
		/** fx "i dag", "i går", "for 47 dage siden" */
		ago: string
		days: number
		thisMonth: number
		lastMonth: number
	}[]
	/** Dage siden nogen fra kunden sidst var inde (null = ingen, siden loggen startede) */
	daysSinceAny: number | null
	inactive: boolean
	/** fx "nov." og "okt." */
	thisMonthLabel: string
	lastMonthLabel: string
}

const TZ = 'Europe/Copenhagen'
const dayKeyFmt = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' })
const dateFmt = new Intl.DateTimeFormat('da-DK', { timeZone: TZ, day: 'numeric', month: 'short' })
const yearFmt = new Intl.DateTimeFormat('da-DK', { timeZone: TZ, day: 'numeric', month: 'short', year: 'numeric' })
const timeFmt = new Intl.DateTimeFormat('da-DK', { timeZone: TZ, hour: '2-digit', minute: '2-digit' })
const monthFmt = new Intl.DateTimeFormat('da-DK', { timeZone: TZ, month: 'short' })

/** Hele kalenderdage mellem to tidspunkter i dansk tid */
function calendarDays(from: Date, to: Date) {
	const a = Date.parse(dayKeyFmt.format(from))
	const b = Date.parse(dayKeyFmt.format(to))
	return Math.round((b - a) / 86_400_000)
}

function agoLabel(days: number) {
	if (days <= 0) return 'i dag'
	if (days === 1) return 'i går'
	if (days < 60) return `for ${days} dage siden`
	return `for ${Math.floor(days / 30)} måneder siden`
}

export function summarizeLogins(
	people: LoginPerson[],
	now = new Date(),
): LoginSummary {
	const rows = people.map((p) => {
		const d = new Date(p.lastAt)
		const days = calendarDays(d, now)
		const date = (days > 300 ? yearFmt : dateFmt).format(d)
		return {
			name: p.name,
			email: p.email,
			last: `${date} kl. ${timeFmt.format(d).replace(':', '.')}`,
			ago: agoLabel(days),
			days,
			thisMonth: p.thisMonth,
			lastMonth: p.lastMonth,
		}
	})
	const daysSinceAny = rows.length ? Math.min(...rows.map((r) => r.days)) : null
	const prev = new Date(now)
	prev.setUTCDate(15)
	prev.setUTCMonth(prev.getUTCMonth() - 1)
	return {
		people: rows,
		daysSinceAny,
		inactive: daysSinceAny !== null && daysSinceAny >= INACTIVE_DAYS,
		thisMonthLabel: monthFmt.format(now),
		lastMonthLabel: monthFmt.format(prev),
	}
}

/** Lokalt uden rigtige besøg: eksempler, så visningen kan ses under udvikling */
export function exampleLogins(now = new Date()): LoginPerson[] {
	const ago = (h: number) => new Date(now.getTime() - h * 3_600_000).toISOString()
	return [
		{ name: 'Eksempel Kunde', email: 'kunde@eksempel.dk', lastAt: ago(2), thisMonth: 6, lastMonth: 14 },
		{ name: 'Anden Bruger', email: 'bruger@eksempel.dk', lastAt: ago(24 * 95), thisMonth: 0, lastMonth: 0 },
	]
}
