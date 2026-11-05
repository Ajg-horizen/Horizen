import { NextResponse, type NextRequest } from 'next/server'
import { projectId } from '@/sanity/lib/env'
import {
	SESSION_COOKIE,
	SESSION_DAYS,
	roleForEmail,
	sessionSecret,
	signSession,
} from '@/lib/dashboard-session'

export const runtime = 'nodejs'

/**
 * Log ind på SEO-dashboardet med Sanity (/dashboard/login).
 *
 *   POST { token }  Studio-tokenet fra browseren. Bekræftes hos Sanity
 *                   (users/me på projektet); kun brugere med en rolle i
 *                   projektet slipper ind. Sætter en signeret cookie.
 *   DELETE          Log ud (sletter cookien).
 *
 * Tokenet bruges kun til at spørge Sanity, hvem brugeren er, og gemmes ikke.
 * Rollen i dashboardet afgøres af e-mailen (se roleForEmail).
 */

/* ── Simpel in-memory rate-limit pr. instans ── */
const WINDOW_MS = 5 * 60_000
const MAX_IN_WINDOW = 30
const hits: number[] = []
function rateLimited(now: number) {
	while (hits.length && now - hits[0] > WINDOW_MS) hits.shift()
	if (hits.length >= MAX_IN_WINDOW) return true
	hits.push(now)
	return false
}

type SanityMe = {
	id?: string
	name?: string
	email?: string
	role?: string | null
	roles?: { name: string }[]
}

export async function POST(request: NextRequest) {
	const secret = sessionSecret()
	if (!secret)
		return NextResponse.json({ error: 'not-configured' }, { status: 500 })
	if (rateLimited(Date.now()))
		return NextResponse.json({ error: 'rate-limited' }, { status: 429 })

	const body = await request.json().catch(() => null)
	const token = typeof body?.token === 'string' ? body.token.trim() : ''
	if (!token || token.length > 4000)
		return NextResponse.json({ error: 'no-token' }, { status: 400 })

	let me: SanityMe | null = null
	try {
		const res = await fetch(
			`https://${projectId}.api.sanity.io/v2021-06-07/users/me`,
			{
				headers: { Authorization: `Bearer ${token}` },
				cache: 'no-store',
				signal: AbortSignal.timeout(10_000),
			},
		)
		if (res.ok) me = await res.json()
	} catch (err) {
		console.error('[dashboard-auth] Sanity svarede ikke:', err)
		return NextResponse.json({ error: 'failed' }, { status: 502 })
	}

	const member = Boolean(me?.role || me?.roles?.length)
	if (!me?.id || !me.email || !member)
		return NextResponse.json({ error: 'denied' }, { status: 403 })

	const session = {
		role: roleForEmail(me.email),
		name: me.name || me.email,
		email: me.email,
		exp: Date.now() + SESSION_DAYS * 24 * 60 * 60_000,
	}
	const response = NextResponse.json({ ok: true, role: session.role })
	response.cookies.set(SESSION_COOKIE, await signSession(session, secret), {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		path: '/',
		maxAge: SESSION_DAYS * 24 * 60 * 60,
	})
	return response
}

export async function DELETE() {
	const response = NextResponse.json({ ok: true })
	response.cookies.delete(SESSION_COOKIE)
	return response
}
