import { createClient } from '@sanity/client'
import { randomUUID } from 'node:crypto'
import type { AiSource } from './aiSources'
import type { TrafficSource } from './trafficSource'

/**
 * Anonyme tællere til SEO-dashboardet (Google-søgning-fanen):
 *   - henvendelser: klik på telefon/mail (og formularer, hvis projektets
 *     formular-API kalder recordLead('form'))
 *   - besøg fra AI-tjenester (ChatGPT, Perplexity, Claude, Gemini, Copilot)
 *
 * Hver hændelse gemmes som ét lille dokument i Sanity med type/kilde, side og
 * tidspunkt. Henvendelser får også besøgets kilde (Google Ads, organisk osv., se
 * src/lib/trafficSource.ts). Ingen navne, numre, IP-adresser eller cookies, så alle besøgende
 * tælles, også dem der har afvist cookies.
 *
 * Id'erne starter med "lead." / "ai." (punktum i id'et), så dokumenterne IKKE kan
 * læses offentligt via Sanitys API. Kun kald med token (dashboardet) kan se dem.
 *
 * Kræver SANITY_API_WRITE_TOKEN (sæt den kun i Vercel Production). Uden den
 * springes der stille over, så lokalt arbejde og previews ikke tæller med.
 */

export const LEAD_TYPES = ['form', 'phone', 'email'] as const
export type LeadType = (typeof LEAD_TYPES)[number]

export function isLeadType(v: unknown): v is LeadType {
	return LEAD_TYPES.includes(v as LeadType)
}

/** Renser stien fra klienten: kun sti (ingen query/hash), højst 200 tegn. */
export function cleanPath(raw: unknown): string {
	if (typeof raw !== 'string' || !raw.startsWith('/')) return '/'
	return raw.split(/[?#]/)[0].slice(0, 200) || '/'
}

/** Siden, en formular blev sendt fra (fra Referer-headeren); '/' hvis ukendt. */
export function pathFromReferer(request: Request): string {
	try {
		return cleanPath(new URL(request.headers.get('referer') ?? '').pathname)
	} catch {
		return '/'
	}
}

export async function recordLead(
	type: LeadType,
	path: string,
	source?: TrafficSource,
): Promise<void> {
	await saveEvent({
		_id: `lead.${randomUUID()}`,
		_type: 'leadEvent',
		type,
		path,
		...(source && { source }),
		createdAt: new Date().toISOString(),
	})
}

export async function recordAiVisit(
	source: AiSource,
	path: string,
): Promise<void> {
	await saveEvent({
		_id: `ai.${randomUUID()}`,
		_type: 'aiVisit',
		source,
		path,
		createdAt: new Date().toISOString(),
	})
}

async function saveEvent(
	doc: { _id: string; _type: string } & Record<string, string>,
) {
	// Læses ved kørsel, ikke ved build: "Sensitive" Vercel-variabler findes kun ved runtime.
	const token = process.env.SANITY_API_WRITE_TOKEN
	const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
	// Kun live (Vercel Production) tæller. Lokalt og i previews kan skrive-tokenet
	// godt findes, og så ville testklik stå i kundens tal.
	if (!token || process.env.VERCEL_ENV !== 'production') return

	// Live (production) skrives også til et evt. development-dataset, så
	// dashboardet viser det samme lokalt som live. Findes det ikke, fejler den
	// skrivning blødt.
	const datasets =
		dataset === 'production' ? ['production', 'development'] : [dataset]

	for (const ds of datasets) {
		try {
			await createClient({
				projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
				dataset: ds,
				apiVersion: '2024-01-01',
				token,
				useCdn: false,
			}).create(doc)
		} catch (err) {
			// Tælleren må aldrig vælte noget for den besøgende.
			console.error(`[siteEvents] kunne ikke gemme ${doc._type} i ${ds}`, err)
		}
	}
}
