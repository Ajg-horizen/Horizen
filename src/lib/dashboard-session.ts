/**
 * Login til SEO-dashboardet med Sanity: når nogen er logget ind i Studio,
 * bekræfter /api/dashboard-auth brugeren hos Sanity og sætter en signeret
 * cookie. proxy.ts læser cookien ved hvert besøg på /dashboard.
 *
 * Cookien er "<payload>.<signatur>" (base64url), signeret med HMAC-SHA256 og
 * DASHBOARD_SESSION_SECRET. Den kan læses, men ikke ændres uden hemmeligheden.
 * Bruger WebCrypto, så modulet virker både i proxy og i API-ruter.
 */

export const SESSION_COOKIE = 'dash_session'
export const SESSION_DAYS = 7

export type DashboardRole = 'horizen' | 'kunde'

export type DashboardSession = {
	role: DashboardRole
	name: string
	email: string
	/** Udløb (ms siden 1970) */
	exp: number
}

export const sessionSecret = () =>
	process.env.DASHBOARD_SESSION_SECRET?.trim() || null

/** Horizen = e-mail på Horizens domæne (DASHBOARD_HORIZEN_DOMAIN, standard horizen.dk) */
export function roleForEmail(email: string): DashboardRole {
	const domain = (process.env.DASHBOARD_HORIZEN_DOMAIN || 'horizen.dk')
		.trim()
		.toLowerCase()
	return email.trim().toLowerCase().endsWith(`@${domain}`) ? 'horizen' : 'kunde'
}

const encoder = new TextEncoder()

function toBase64Url(bytes: Uint8Array) {
	let s = ''
	for (const b of bytes) s += String.fromCharCode(b)
	return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(value: string) {
	const s = atob(value.replace(/-/g, '+').replace(/_/g, '/'))
	return Uint8Array.from(s, (c) => c.charCodeAt(0))
}

function hmacKey(secret: string) {
	return crypto.subtle.importKey(
		'raw',
		encoder.encode(secret),
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign', 'verify'],
	)
}

export async function signSession(
	session: DashboardSession,
	secret: string,
): Promise<string> {
	const payload = toBase64Url(encoder.encode(JSON.stringify(session)))
	const sig = await crypto.subtle.sign(
		'HMAC',
		await hmacKey(secret),
		encoder.encode(payload),
	)
	return `${payload}.${toBase64Url(new Uint8Array(sig))}`
}

/** Gyldig, uændret og ikke udløbet session, ellers null */
export async function verifySession(
	cookie: string | undefined,
	secret: string,
): Promise<DashboardSession | null> {
	const [payload, sig] = cookie?.split('.') ?? []
	if (!payload || !sig) return null
	try {
		const ok = await crypto.subtle.verify(
			'HMAC',
			await hmacKey(secret),
			fromBase64Url(sig),
			encoder.encode(payload),
		)
		if (!ok) return null
		const session = JSON.parse(
			new TextDecoder().decode(fromBase64Url(payload)),
		) as DashboardSession
		if (session.role !== 'horizen' && session.role !== 'kunde') return null
		return session.exp > Date.now() ? session : null
	} catch {
		return null
	}
}
