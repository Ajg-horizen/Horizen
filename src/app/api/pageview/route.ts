import { cleanPath } from '@/lib/siteEvents'
import { cookies, draftMode } from 'next/headers'
import { SESSION_COOKIE } from '@/lib/dashboard-session'
import { recordPageview, recordTime } from '@/lib/pageStats'
import { isTrafficSource } from '@/lib/trafficSource'
import { lookupCompany } from '@/lib/companyLookup'
import { recordCompanyView } from '@/lib/companies'

export const runtime = 'nodejs'

/**
 * Anonym besøgstælling uden cookies (sendt fra SiteTracking.tsx), se
 * src/lib/pageStats.ts:
 *   { type: 'view', path, landing, source }  en sidevisning
 *   { type: 'time', path, seconds }          aktiv tid, når siden forlades
 * Svarer altid 204, så klienten aldrig venter.
 */
export async function POST(req: Request) {
	const done = new Response(null, { status: 204 })

	// Kun kald fra sitet selv, og åbenlyse bots springes over
	const host = req.headers.get('host')
	const origin = req.headers.get('origin') ?? req.headers.get('referer') ?? ''
	try {
		if (!host || new URL(origin).host !== host) return done
	} catch {
		return done
	}
	if (/bot|crawl|spider|preview|headless|lighthouse/i.test(req.headers.get('user-agent') ?? ''))
		return done

	let body: Record<string, unknown>
	try {
		body = JSON.parse(await req.text())
	} catch {
		return done
	}
	const path = cleanPath(body.path)
	// Det interne dashboard og Studio tælles ikke
	if (path.startsWith('/dashboard') || path.startsWith('/admin')) return done
	// Vores egne besøg tælles heller ikke: logget ind på SEO-dashboardet
	// (dash_session gælder hele sitet i 7 dage, også for kunden) eller en side
	// set gennem Studio/Presentation (draft mode)
	if ((await cookies()).has(SESSION_COOKIE) || (await draftMode()).isEnabled) return done

	if (body.type === 'view') {
		const landing = body.landing === true
		const source = isTrafficSource(body.source) ? body.source : 'direct'
		// Virksomhed ud fra nettet (src/lib/companyLookup.ts). Vercel sætter selv
		// x-forwarded-for til den besøgendes adresse; den gemmes ingen steder.
		const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? req.headers.get('x-real-ip')
		await Promise.all([
			recordPageview(path, landing, source),
			process.env.VERCEL_ENV === 'production'
				? lookupCompany(ip).then((c) => recordCompanyView(c, path, landing, source))
				: null,
		])
	} else if (body.type === 'time' && typeof body.seconds === 'number') {
		await recordTime(path, body.seconds)
	}
	return done
}
