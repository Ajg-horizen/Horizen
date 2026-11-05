import { isAiSource } from '@/lib/aiSources'
import { cleanPath, recordAiVisit } from '@/lib/siteEvents'

export const runtime = 'nodejs'

/**
 * Tæller besøg, der kommer fra en AI-tjeneste (SiteTracking.tsx genkender
 * kilden ud fra referrer/utm_source), anonymt til SEO-dashboardet.
 * Svarer altid 204.
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
	if (!isAiSource(body.source)) return done

	await recordAiVisit(body.source, cleanPath(body.path))
	return done
}
