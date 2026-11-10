import { NextResponse, type NextRequest } from 'next/server'
import { Resend } from 'resend'
import { writeClient } from '@/sanity/lib/writeClient'

/**
 * Resend → status på beskederne i fanen "Beskeder" (Andreas 10/11-2026).
 *
 * Før spurgte dashboardet Resend om status på de seneste 20 mails, hver gang
 * fanen blev vist. Nøglen "SEO-dashboards" må kun sende, så hvert opslag gav
 * 401 i Resend-loggen (20 ad gangen). Nu sender Resend selv besked hertil, når
 * en mail er leveret, åbnet osv., og status gemmes på seoClientMessage. Så skal
 * sitet aldrig læse fra Resend, og nøglen kan blive ved med kun at kunne sende.
 *
 * Opsætning: Resend → Webhooks → endpoint https://<domæne>/api/resend-webhook
 * med email.*-hændelserne. Signing secret (whsec_…) sættes som
 * RESEND_WEBHOOK_SECRET i Vercel. Uden gyldig signatur afvises kaldet.
 *
 * Mails, der ikke er en besked fra dette site (kontaktformular, andre sites på
 * samme Resend-konto), ignoreres med 200, så Resend ikke prøver igen.
 */
export const runtime = 'nodejs'

/**
 * Hændelsernes rækkefølge. Resend kan levere dem i vilkårlig orden, så en
 * senere "delivered" må ikke overskrive "opened". Problemer (bounced,
 * complained …) vinder altid, fordi de er det vigtigste at se.
 */
const RANK: Record<string, number> = {
	scheduled: 0,
	queued: 0,
	sent: 1,
	delivery_delayed: 2,
	delivered: 3,
	opened: 4,
	clicked: 5,
	failed: 6,
	bounced: 6,
	suppressed: 6,
	complained: 7,
}

/** Højere eller lige så høj rang erstatter den gemte status. */
function shouldReplace(current: string | undefined, next: string) {
	if (!(next in RANK)) return false
	if (!current || !(current in RANK)) return true
	return RANK[next] >= RANK[current]
}

export async function POST(req: NextRequest) {
	const secret = process.env.RESEND_WEBHOOK_SECRET?.trim()
	if (!secret) {
		console.error('[resend-webhook] RESEND_WEBHOOK_SECRET mangler')
		return NextResponse.json({ error: 'Ikke sat op' }, { status: 500 })
	}

	// Signaturen er beregnet på den rå tekst, så den må ikke parses først
	const payload = await req.text()
	let event: { type?: string; data?: { email_id?: string; created_at?: string } }
	try {
		// verify() regner kun lokalt; nøglen bruges ikke, men Resend kræver én.
		// Resend sender svix-*-headers; standarden hedder webhook-* (samme signatur).
		const h = (name: string) =>
			req.headers.get(`svix-${name}`) ?? req.headers.get(`webhook-${name}`) ?? ''
		event = new Resend('re_webhook_verify_only').webhooks.verify({
			payload,
			headers: {
				id: h('id'),
				timestamp: h('timestamp'),
				signature: h('signature'),
			},
			webhookSecret: secret,
		}) as typeof event
	} catch {
		return NextResponse.json({ error: 'Ugyldig signatur' }, { status: 401 })
	}

	const type = event.type ?? ''
	const emailId = event.data?.email_id
	if (!type.startsWith('email.') || !emailId) {
		return NextResponse.json({ ok: true, ignored: 'ikke en mail-hændelse' })
	}
	const status = type.slice('email.'.length)

	try {
		const doc = await writeClient.fetch<{
			_id: string
			_rev: string
			mailStatus?: string
		} | null>(
			`*[_type == "seoClientMessage" && resendId == $id][0]{ _id, _rev, mailStatus }`,
			{ id: emailId },
		)
		if (!doc) return NextResponse.json({ ok: true, ignored: 'ukendt mail' })
		if (!shouldReplace(doc.mailStatus, status)) {
			return NextResponse.json({ ok: true, kept: doc.mailStatus })
		}
		await writeClient
			.patch(doc._id)
			.ifRevisionId(doc._rev)
			.set({
				mailStatus: status,
				mailStatusAt: event.data?.created_at || new Date().toISOString(),
			})
			.commit()
		return NextResponse.json({ ok: true, status })
	} catch (err) {
		// 500 → Resend prøver igen senere (fx ved samtidige hændelser)
		console.error('[resend-webhook] Kunne ikke gemme status:', err)
		return NextResponse.json({ error: 'Kunne ikke gemme' }, { status: 500 })
	}
}
