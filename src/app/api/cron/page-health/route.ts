import { NextResponse } from 'next/server'
import {
	measureBoth,
	pageHealthKey,
	pageHealthUrl,
	savePageHealth,
} from '@/lib/pagespeed'

/**
 * Cron: måler forsiden (mobil + computer) med Googles PageSpeed Insights og
 * gemmer målingen som pageHealth i Sanity. Kører i skyen den 3. i hver måned
 * (vercel.json), samme dag som Search Console-tallene, men som sin egen kørsel,
 * så en fejl i den ene ikke stopper den anden.
 *
 * Sikkerhed: Vercel Cron sender "Authorization: Bearer <CRON_SECRET>". Uden
 * CRON_SECRET kan ruten kun kaldes lokalt (hver kørsel bruger kvote og skriver
 * til Sanity). Kræver PAGESPEED_API_KEY og SANITY_API_WRITE_TOKEN.
 */
export const dynamic = 'force-dynamic'
export const maxDuration = 120

export async function GET(request: Request) {
	const cronSecret = process.env.CRON_SECRET
	if (cronSecret) {
		if (request.headers.get('authorization') !== `Bearer ${cronSecret}`)
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	} else if (process.env.NODE_ENV === 'production') {
		return NextResponse.json({ error: 'CRON_SECRET mangler' }, { status: 401 })
	}

	const url = pageHealthUrl()
	const key = pageHealthKey()
	if (!url || !key)
		return NextResponse.json(
			{
				error:
					'PAGESPEED_API_KEY eller et https-domæne (NEXT_PUBLIC_BASE_URL) mangler.',
			},
			{ status: 500 },
		)

	try {
		const entry = await savePageHealth(await measureBoth(url, key), 'cron')
		return NextResponse.json({
			ok: true,
			id: entry.id,
			mobile: entry.mobile?.scores ?? null,
			desktop: entry.desktop?.scores ?? null,
		})
	} catch (err) {
		console.error('[cron/page-health]', err)
		return NextResponse.json(
			{ error: err instanceof Error ? err.message : 'Ukendt fejl' },
			{ status: 500 },
		)
	}
}
