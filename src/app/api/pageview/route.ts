import { cleanPath } from '@/lib/siteEvents'
import { recordPageview, recordTime } from '@/lib/pageStats'
import { isTrafficSource } from '@/lib/trafficSource'

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

	if (body.type === 'view') {
		await recordPageview(
			path,
			body.landing === true,
			isTrafficSource(body.source) ? body.source : 'direct',
		)
	} else if (body.type === 'time' && typeof body.seconds === 'number') {
		await recordTime(path, body.seconds)
	}
	return done
}
