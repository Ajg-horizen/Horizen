/**
 * IP-adresse → virksomhed (Andreas 6/11-2026, fanen Besøgende → Virksomheder).
 *
 * Slår adressen op i det offentlige IP-register (RIPE RDAP; adresser uden for
 * Europa sendes automatisk videre til ARIN/APNIC osv.) og ser, hvem nettet er
 * registreret til. Sidder en besøgende på en virksomheds eget net, står
 * virksomheden der (fx "DANFOSS"). Sidder de hjemme, på mobilen eller på et
 * almindeligt udbydernet, står udbyderen der, og så returneres null.
 *
 * Kun virksomhedens navn og land bruges. Registerets kontaktpersoner (navne
 * på IT-ansvarlige o.l.) læses aldrig ud, og IP-adressen gemmes ingen steder.
 */

export type Company = { key: string; name: string; country?: string }

type RdapEntity = {
	handle?: string
	roles?: string[]
	vcardArray?: [string, [string, unknown, string, unknown][]]
}
type Rdap = {
	name?: string
	type?: string
	country?: string
	startAddress?: string
	endAddress?: string
	cidr0_cidrs?: { length?: number }[]
	remarks?: { description?: string[] }[]
	entities?: RdapEntity[]
}

/** Internetudbydere (danske og de største udenlandske) */
const ISP =
	/\b(tdc|nuuday|yousee|telenor|telia|norlys|stofa|hiper|hi3g|fastspeed|waoo|fibia|ewii|andels\.?net|kviknet|altibox|bolignet|comx|globalconnect|global connect|netgroup|dansk kabel|energi fyn|eniig|seas-?nve|verdo|jaynet|syd ?energi|nianet|cbb|lebara|oister|callme|telmore|teledanmark|tele danmark|vodafone|orange|deutsche telekom|telekom|t-mobile|comcast|verizon|at&t|charter|spectrum|bt|virgin|sky|liberty global|ziggo|kpn|swisscom|proximus|bredband2|bahnhof|ownit|tele2|elisa|ice\.?net|ip-only|quickline|sunrise|telefonica|movistar|vivo|claro|airtel|jio|starlink|spacex)\b/i

/** Hosting, sky, CDN og VPN: ikke en virksomheds kontor */
const HOSTING =
	/(amazon|aws|google|microsoft|msft|azure|cloudflare|akamai|fastly|digitalocean|hetzner|ovh|linode|vultr|oracle|apple|icloud|private relay|zscaler|netskope|m247|leaseweb|contabo|scaleway|alibaba|tencent|huawei cloud|nordvpn|expressvpn|surfshark|proton|mullvad|packethub|datacamp|choopa|hostinger|ionos|one\.com|unoeuro|simply\.com|curanet|team\.?blue|gigahost|meebox|cdn77|edgecast|limelight|level ?3|lumen|cogent|hurricane|ipxo|\bvpn\b|\bproxy\b|\btor\b|hosting|datacenter|data center|colocation|cloud)/i

/** Ord i netnavne, der betyder privat-, mobil- eller udbydernet */
const POOL = new Set(
	'nat cgn cgnat pool pools dyn dynamic dhcp ppp pppoe bras bng dsl adsl vdsl xdsl fiber fibre ftth fttb fttx cable kabel kabeltv catv broadband bb mobile mobil gprs lte umts 3g 4g 5g wifi wlan wireless residential resi customer customers cust kunde kunder subscriber subs privat private home infra infrastructure backbone core p2p ptp transfer guest public users clients'.split(' '),
)

/** Virksomhedsformer o.l., der gør en beskrivelse til et navn */
const COMPANY_SUFFIX =
	/\b(a\/s|aps|i\/s|ivs|p\/s|k\/s|amba|a\.m\.b\.a|ab|as|asa|oy|oyj|gmbh|ag|bv|nv|sa|sarl|srl|spa|ltd|limited|plc|inc|llc|corp|kommune|region|universitet|university|hospital|sygehus|gymnasium|skole|styrelse|ministeriet|politi|forsvaret)\b/i

/** Højst så mange adresser i et net, der skal tælle som én virksomhed */
const MAX_V4 = 4096 // /20 for tildelinger fra en udbyder
const MAX_V4_OWN = 65536 // /16 for virksomhedens eget (PI/legacy) net
const MIN_V6_PREFIX = 40

const cache = new Map<string, Company | null>()

function ipv4Size(start?: string, end?: string): number {
	const n = (ip?: string) =>
		ip?.split('.').reduce((a, b) => a * 256 + Number(b), 0) ?? Number.NaN
	return n(end) - n(start) + 1
}

/** "DK-SOMEFIRMA-NET" → "Somefirma" */
function prettyNetname(netname: string): string {
	const words = netname
		.split(/[-_.\s]+/)
		.filter((w, i, all) => w && !(i === 0 && /^[a-z]{2}$/i.test(w) && all.length > 1))
		.filter((w) => !/^(net|lan|wan|network|networks|office|\d+)$/i.test(w))
	return words.map((w) => (w.length <= 3 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1).toLowerCase())).join(' ')
}

const slug = (name: string) =>
	`c_${name
		.toLowerCase()
		.normalize('NFKD')
		.replace(/æ/g, 'ae')
		.replace(/ø/g, 'oe')
		.replace(/å/g, 'aa')
		.replace(/[^a-z0-9]+/g, '_')
		.replace(/^_|_$/g, '')}`.slice(0, 80)

const looksLikeProvider = (s: string) => ISP.test(s) || HOSTING.test(s)

/** Vurderer ét RDAP-svar. Ren funktion, så den kan testes med eksempler. */
export function companyFromRdap(r: Rdap, ipv6: boolean): Company | null {
	const netname = r.name ?? ''
	const type = (r.type ?? '').toUpperCase()

	// Udbyderens store blokke og privat-/mobilnet
	if (type.includes('ALLOCATED')) return null
	if (netname.split(/[-_.\s]+/).some((t) => POOL.has(t.toLowerCase()))) return null
	if (ipv6) {
		const len = r.cidr0_cidrs?.[0]?.length ?? 0
		if (len < MIN_V6_PREFIX) return null
	} else {
		const size = ipv4Size(r.startAddress, r.endAddress)
		const own = /PI|LEGACY|ASSIGNED$/.test(type) && !type.includes('PA')
		if (!(size > 0) || size > (own ? MAX_V4_OWN : MAX_V4)) return null
	}

	const descr = (r.remarks ?? []).flatMap((x) => x.description ?? []).map((s) => s.trim())
	// Den registrerede organisation (RIPE: ORG-…, ARIN m.fl.: vCard kind=org).
	// Vedligeholdere (…-MNT) er tekniske konti og springes over.
	const vcard = (e: RdapEntity, key: string) => e.vcardArray?.[1]?.find((v) => v[0] === key)?.[3]
	const orgs = (r.entities ?? [])
		.filter((e) => e.roles?.includes('registrant') && !e.handle?.endsWith('-MNT'))
		.filter((e) => e.handle?.startsWith('ORG-') || vcard(e, 'kind') === 'org')
		.map((e) => vcard(e, 'fn'))
		.filter((fn): fn is string => typeof fn === 'string' && fn.length > 1)
	if (orgs.some(looksLikeProvider)) return null
	const org = orgs[0]

	const name =
		org ??
		descr.find((d) => COMPANY_SUFFIX.test(d) && d.length <= 80) ??
		(netname ? prettyNetname(netname) : '')

	if (!name || name.length < 2) return null
	if (looksLikeProvider(name) || looksLikeProvider(netname) || descr.slice(0, 2).some(looksLikeProvider))
		return null

	return { key: slug(name), name, country: r.country || undefined }
}

/** Slår en IP op. null = ingen virksomhed (eller opslaget fejlede). */
export async function lookupCompany(ip: string | null | undefined): Promise<Company | null> {
	if (!ip) return null
	ip = ip.trim()
	const ipv6 = ip.includes(':')
	// Lokale og private adresser
	if (/^(127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|::1$|f[cd]|fe80)/i.test(ip)) return null
	if (cache.has(ip)) return cache.get(ip) ?? null

	let result: Company | null = null
	try {
		const res = await fetch(`https://rdap.db.ripe.net/ip/${encodeURIComponent(ip)}`, {
			headers: { Accept: 'application/rdap+json' },
			signal: AbortSignal.timeout(2500),
			cache: 'no-store',
		})
		if (res.ok) result = companyFromRdap((await res.json()) as Rdap, ipv6)
	} catch {
		// Registeret svarede ikke: besøget tælles bare som ukendt
		return null
	}

	if (cache.size > 2000) cache.clear()
	cache.set(ip, result)
	return result
}
