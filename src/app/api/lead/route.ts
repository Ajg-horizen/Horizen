import { cleanPath, isLeadType, recordLead } from '@/lib/siteEvents'
import { isTrafficSource } from '@/lib/trafficSource'

export const runtime = 'nodejs'

/**
 * Tæller klik på telefonnummer og mailadresse (sendt fra SiteTracking.tsx)
 * anonymt til SEO-dashboardet. Formularer tælles ikke herfra: kald
 * recordLead('form', sti) i formularens eget API, når mailen er sendt.
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
	if (
		/bot|crawl|spider|preview|headless/i.test(
			req.headers.get('user-agent') ?? '',
		)
	)
		return done

	let body: Record<string, unknown>
	try {
		body = JSON.parse(await req.text())
	} catch {
		return done
	}
	if (!isLeadType(body.type) || body.type === 'form') return done

	await recordLead(
		body.type,
		cleanPath(body.path),
		isTrafficSource(body.source) ? body.source : undefined,
	)
	return done
}
