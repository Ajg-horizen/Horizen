import { NextResponse } from 'next/server'
import { projectId } from '@/sanity/env'
import { createClient } from '@sanity/client'
import {
	fetchSearchConsoleMonth,
	fetchSearchConsoleQueries,
	prevMonth,
} from '@/lib/search-console'

/**
 * Cron: gemmer forrige måneds Search Console-tal som et seoSnapshot i Sanity.
 * Kører i skyen (Vercel Cron, se vercel.json) den 3. i hver måned — helt
 * uafhængigt af nogen lokal computer.
 *
 * Sikkerhed: Vercel Cron sender automatisk "Authorization: Bearer <CRON_SECRET>"
 * når CRON_SECRET er sat i env, så kun Vercel (ikke tilfældige besøgende) kan
 * trigge den. Kan også køres manuelt: /api/cron/seo-snapshot?month=2026-08
 * (kræver samme Bearer-header).
 */
export const dynamic = 'force-dynamic'

// Kundens Search Console-property, fx "sc-domain:kunde.dk". Sættes per projekt
// i Vercel-env (SEARCH_CONSOLE_SITE), så templaten er kunde-uafhængig. Kræver
// desuden GOOGLE_OAUTH_CLIENT_ID/_CLIENT_SECRET/_REFRESH_TOKEN, CRON_SECRET og
// SANITY_API_WRITE_TOKEN i Vercel.
const SC_SITE = process.env.SEARCH_CONSOLE_SITE ?? ''

// Hvilke datasets snapshottet skrives til. Valgfrit, sættes per projekt i
// Vercel-env som kommasepareret liste, fx "production,development", så
// dashboardet viser de samme tal lokalt som live. Uden den skrives kun til
// sitets eget dataset.
const DATASETS = (
	process.env.SEO_SNAPSHOT_DATASETS ||
	process.env.NEXT_PUBLIC_SANITY_DATASET ||
	'production'
)
	.split(',')
	.map((d) => d.trim())
	.filter(Boolean)

export async function GET(request: Request) {
	const cronSecret = process.env.CRON_SECRET
	if (cronSecret) {
		const auth = request.headers.get('authorization')
		if (auth !== `Bearer ${cronSecret}`) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}
	}

	if (!SC_SITE) {
		return NextResponse.json(
			{
				error: 'SEARCH_CONSOLE_SITE env-var mangler (fx "sc-domain:kunde.dk").',
			},
			{ status: 500 },
		)
	}

	const month = new URL(request.url).searchParams.get('month') || prevMonth()

	try {
		// Total + top-søgeord hentes parallelt (ét access token-kald hver).
		const [metrics, topQueries] = await Promise.all([
			fetchSearchConsoleMonth(SC_SITE, month),
			fetchSearchConsoleQueries(SC_SITE, month, 25),
		])

		const snapshot = {
			_id: `seoSnapshot-${month}`,
			_type: 'seoSnapshot',
			month,
			source: 'search-console',
			capturedAt: new Date().toISOString(),
			...metrics,
			topQueries: topQueries.map((q, i) => ({ _key: `q-${i}`, ...q })),
		}

		// Måledata er fakta fra Search Console, ikke indhold, så samme tal kan
		// trygt skrives til flere datasets. Hvert dataset forsøges for sig.
		const written: string[] = []
		for (const dataset of DATASETS) {
			const sanity = createClient({
				projectId,
				dataset,
				apiVersion: '2024-01-01',
				token: process.env.SANITY_API_WRITE_TOKEN,
				useCdn: false,
			})
			try {
				await sanity.createOrReplace(snapshot)
				written.push(dataset)
			} catch (err) {
				// Et fejlende dataset må ikke vælte kørslen: live-tallene er det vigtige.
				console.error(
					`[cron/seo-snapshot] kunne ikke skrive til ${dataset}`,
					err,
				)
			}
		}

		if (!written.length)
			throw new Error('Kunne ikke skrive snapshot til noget dataset.')

		return NextResponse.json({
			ok: true,
			month,
			metrics,
			topQueries: topQueries.length,
			written,
		})
	} catch (err) {
		console.error('[cron/seo-snapshot]', err)
		return NextResponse.json(
			{ error: err instanceof Error ? err.message : 'Ukendt fejl', month },
			{ status: 500 },
		)
	}
}
