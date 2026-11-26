import {
	retainerHours,
	seoBonusHours,
	seoHourMax,
	seoHourMin,
	seoIntroBonus,
	seoPackagePrice,
	seoPackages,
	type SeoPackage,
} from '@/app/dashboard/seo/data'
import { escapeHtml } from '@/app/dashboard/seo/richtext'

/**
 * "Få en SEO-aftale" og "Opgradér" fra dashboardet (Andreas 20/11-2026, forslag A).
 *
 * Browseren sender kun pakkens id ({ seoInterest: { packageId, currentId? } });
 * navn og pris slås op her på serveren i seoPackages, så teksten i opgaven og
 * mailen altid passer med pakkerne. Opgaven gemmes med feltet seoInterest, så
 * den IKKE står blandt kundens ad hoc-opgaver, og mailen til Horizen får sit eget
 * emne ("Ny SEO-interesse: …"), så den ikke drukner i almindelige opgaver.
 */

const kr = (n: number) => `${n.toLocaleString('da-DK')} kr.`
export const seoPriceText = (p: SeoPackage, hours = p.hours) => {
	const price = seoPackagePrice(p, hours)
	return price == null ? 'efter aftale' : `${p.pricePrefix ? `${p.pricePrefix.toLowerCase()} ` : ''}${kr(price)}`
}
const t = (h: number) => `${h.toLocaleString('da-DK')} t`

/** Timerne fra browseren, hvis de er gyldige for pakken; ellers pakkens anbefalede timer. */
function pickHours(p: SeoPackage, raw: unknown) {
	if (!p.hours) return undefined
	const h = typeof raw === 'number' && Number.isFinite(raw) ? raw : NaN
	return h >= seoHourMin(p) && h <= seoHourMax(p) && Number.isInteger(h * 2) ? h : p.hours
}

export type SeoInterest = {
	pkg: SeoPackage
	current?: SeoPackage
	/** Kort mærke på opgaven, fx "Vækst", "Vækst → Profil" eller "Vækst: 5 t → 7 t" */
	label: string
	/** "Skru op" i den nuværende pakke: fra og til timer om måneden */
	raise?: { from: number; to: number }
	subject: string
	message: string
}

/** Læser { packageId, currentId } fra browseren; null, hvis pakken ikke findes. */
export function parseSeoInterest(raw: unknown, who: string): SeoInterest | null {
	const r = (raw ?? {}) as Record<string, unknown>
	const pkg = seoPackages.find((p) => p.id === r.packageId)
	if (!pkg) return null
	const current = typeof r.currentId === 'string' ? seoPackages.find((p) => p.id === r.currentId) : undefined
	// En "opgradering" skal gå op, ikke ned
	if (current && seoPackages.indexOf(current) > seoPackages.indexOf(pkg)) return null

	// Samme pakke = "skru op" (Andreas 25/11-2026). Kun op fra kundens timer i dag
	// (retainerHours slås op her, ikke i browseren); ned sker i en samtale.
	if (current && current.id === pkg.id) {
		const from = retainerHours || pkg.hours
		const to = typeof r.hours === 'number' && Number.isFinite(r.hours) ? r.hours : NaN
		if (!from || !(to > from) || to > Math.max(seoHourMax(pkg), from) || !Number.isInteger(to * 2)) return null
		const fromPrice = seoPriceText(pkg, from)
		const toPrice = seoPriceText(pkg, to)
		return {
			pkg,
			current,
			raise: { from, to },
			label: `${pkg.name}: ${t(from)} → ${t(to)}`,
			subject: `Flere SEO-timer: ${pkg.name} ${t(from)} → ${t(to)} (${toPrice}/md)`,
			message: `${who} vil gerne skrue op for SEO-aftalen (${pkg.name}) fra ${t(from)} til ${t(to)} om måneden, dvs. fra ${fromPrice} til ${toPrice} om måneden ekskl. moms.\n\nKontakt kunden inden for 1-2 hverdage.`,
		}
	}
	const hours = pickHours(pkg, r.hours)
	const price = seoPriceText(pkg, hours)
	// "Vækst · 4 t" i mærket; i teksten også, om det er de anbefalede timer
	const name = hours != null && hours !== pkg.hours ? `${pkg.name} · ${t(hours)}` : pkg.name
	const hoursNote =
		hours == null
			? ''
			: hours === pkg.hours
				? ` med de anbefalede ${t(hours)} om måneden`
				: ` med ${t(hours)} om måneden (anbefalet: ${t(pkg.hours!)})`
	// Introtilbud (bonustimer) gælder kun nye aftaler
	const bonus = current ? 0 : seoBonusHours(pkg, hours)
	const bonusNote = bonus
		? `\n\nIntrotilbud: +${t(bonus)} om måneden de første ${seoIntroBonus.months} måneder (i alt ${t(hours! + bonus)}) til samme pris.`
		: ''
	return current
		? {
				pkg,
				current,
				label: `${current.name} → ${name}`,
				subject: `Opgradering af SEO-aftale: ${current.name} → ${name} (${price}/md)`,
				message: `${who} vil gerne opgradere SEO-aftalen fra ${current.name} til ${pkg.name}${hoursNote}, ${price} om måneden ekskl. moms.\n\nKontakt kunden inden for 1-2 hverdage.`,
			}
		: {
				pkg,
				label: name,
				subject: `Ny SEO-interesse: ${name} (${price}/md)`,
				message: `${who} er interesseret i SEO-pakken ${pkg.name}${hoursNote}, ${price} om måneden ekskl. moms.${bonusNote}\n\nKontakt kunden inden for 1-2 hverdage med et tilbud.`,
			}
}

/** Kvittering til den, der sendte interessen (kun ved login, hvor e-mailen er kendt). */
export function seoInterestReceiptMail(i: SeoInterest, to: { name?: string }) {
	const hi = to.name ? `Hej ${to.name.split(' ')[0]}` : 'Hej'
	const what = i.raise
		? `jeres ønske om at skrue op for SEO-aftalen fra ${t(i.raise.from)} til ${t(i.raise.to)} om måneden`
		: i.current
		? `jeres ønske om at opgradere SEO-aftalen fra ${i.current.name} til ${i.pkg.name}`
		: `jeres interesse i SEO-pakken ${i.pkg.name}`
	const text = `${hi}\n\nTak for ${what}. Vi kontakter jer inden for 1-2 hverdage, så vi kan tage en snak om, hvad der passer jer bedst.\n\nDet er helt uforpligtende.\n\nVenlig hilsen\nAndreas José · Horizen`
	const html = `<p>${escapeHtml(hi)}</p>
<p>Tak for ${escapeHtml(what)}. Vi kontakter jer inden for 1-2 hverdage, så vi kan tage en snak om, hvad der passer jer bedst.</p>
<p>Det er helt uforpligtende.</p>
<p>Venlig hilsen<br>Andreas José · Horizen</p>`
	return {
		subject: i.raise
			? `Tak, vi har modtaget jeres ønske om ${t(i.raise.to)} om måneden`
			: i.current
				? `Tak, vi har modtaget jeres ønske om ${i.pkg.name}` : `Tak for jeres interesse i ${i.pkg.name}`,
		html,
		text,
	}
}
