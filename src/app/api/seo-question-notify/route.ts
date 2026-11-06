import { NextResponse, type NextRequest } from 'next/server'
import { randomBytes, randomUUID } from 'node:crypto'
import { Resend } from 'resend'
import { writeClient } from '@/sanity/lib/writeClient'
import {
	SESSION_COOKIE,
	sessionSecret,
	verifySession,
} from '@/lib/dashboard-session'
import { questionKey } from '@/app/dashboard/seo/data'
import {
	NOTICE_STATE_QUERY,
	noticeMail,
	pendingQuestions,
	type NoticeState,
} from '@/app/dashboard/seo/noticeMail'
import { messageCode, senderProfile } from '@/app/dashboard/seo/messageText'

export const runtime = 'nodejs'

/**
 * Samlet besked til kunden om nye spørgsmål i SEO-dashboardet (Andreas
 * 1/11-2026). Sendes kun, når Horizen trykker "Send besked" og bekræfter;
 * aldrig automatisk og aldrig én mail pr. spørgsmål.
 *
 * { to, name, dryRun: true } giver emne og tekst uden at sende.
 * { to, name } sender via Resend og gemmer en seoQuestionNotice med de spørgsmål,
 * beskeden omfattede, så de ikke tæller som nye igen. Som beskederne har mailen
 * en ægthedskode (gemmes på beskeden, privat id "seo-notice.…"), som kunden kan
 * slå op på /tjek-mail.
 *
 * Kun Horizen-rollen (Sanity-login med horizen.dk-mail). Uden
 * DASHBOARD_SESSION_SECRET er det kun åbent lokalt, som dashboardet selv.
 * Afsender: den Horizen-medarbejder, der er logget ind, med Horizens egen
 * Resend-nøgle (HORIZEN_RESEND_API_KEY), som beskederne i /api/seo-message.
 * Uden login (lokalt) SEO_NOTIFY_FROM.
 */

const MAX_RECIPIENTS = 3
const EMAIL = /^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/

// Mailen er i Horizens navn (ikke kundens kontaktadresse). Sæt SEO_NOTIFY_FROM
// til fx "Horizen <dashboard@horizen.dk>", når horizen.dk er verificeret i
// Resend; indtil da Resends testafsender (kan kun nå kontoens egen mail).
const NOTIFY_FROM =
	process.env.SEO_NOTIFY_FROM?.trim() || 'Horizen <onboarding@resend.dev>'

export async function POST(request: NextRequest) {
	const secret = sessionSecret()
	const session = secret
		? await verifySession(request.cookies.get(SESSION_COOKIE)?.value, secret)
		: null
	const local = !secret && process.env.NODE_ENV !== 'production'
	if (!local && session?.role !== 'horizen') {
		return NextResponse.json({ error: 'Kun for Horizen' }, { status: 403 })
	}

	let body: Record<string, unknown>
	try {
		body = (await request.json()) as Record<string, unknown>
	} catch {
		return NextResponse.json({ error: 'Ugyldig anmodning' }, { status: 400 })
	}

	const to = (typeof body.to === 'string' ? body.to : '')
		.split(/[,;\s]+/)
		.map((s) => s.trim())
		.filter(Boolean)
	if (
		!to.length ||
		to.length > MAX_RECIPIENTS ||
		!to.every((e) => EMAIL.test(e))
	) {
		return NextResponse.json(
			{
				error: `Modtager skal være 1-${MAX_RECIPIENTS} gyldige e-mailadresser`,
			},
			{ status: 400 },
		)
	}

	const state = await writeClient.fetch<NoticeState>(
		NOTICE_STATE_QUERY,
		{},
		{ cache: 'no-store' },
	)
	const questions = pendingQuestions(state)
	if (!questions.length) {
		return NextResponse.json(
			{ error: 'Der er ingen nye spørgsmål siden sidste besked' },
			{ status: 400 },
		)
	}

	// tomt navn (lokalt uden login) giver bare "Horizen" i mailen
	// navn og portræt ud fra login-mailen (Sanity-kontoens navn kan være et andet)
	const profile = senderProfile(
		session?.email,
		session?.name,
		process.env.SEO_SENDER_PHOTO,
	)
	const sender = profile.name
	const name = (typeof body.name === 'string' ? body.name : '')
		.trim()
		.slice(0, 60)
	const origin = new URL(request.url).origin
	const link = `${origin}/dashboard/seo#v=spoergsmaal`
	// Ægthedskoden laves kun ved rigtig afsendelse (forhåndsvisning: pladsholder)
	const code = body.dryRun === true ? undefined : messageCode(randomBytes(8))
	const mail = noticeMail({
		count: questions.length,
		name,
		link,
		sender,
		// portræt af afsenderen (fx /email/andreas.jpg); uden vises initialer
		senderPhoto: profile.photo,
		origin,
		code,
		verifyBase: process.env.SEO_VERIFY_URL,
	})

	if (body.dryRun === true) {
		return NextResponse.json({
			ok: true,
			dryRun: true,
			count: questions.length,
			to,
			subject: mail.subject,
			text: mail.text,
			html: mail.html,
		})
	}

	const key =
		process.env.HORIZEN_RESEND_API_KEY?.trim() || process.env.RESEND_API_KEY
	if (!key) {
		return NextResponse.json(
			{ error: 'Mail er ikke sat op (HORIZEN_RESEND_API_KEY mangler)' },
			{ status: 500 },
		)
	}
	const own = session?.email?.toLowerCase().endsWith('@horizen.dk')
		? session.email
		: ''
	const { error } = await new Resend(key).emails.send({
		from: own ? `${sender || 'Horizen'} · Horizen <${own}>` : NOTIFY_FROM,
		to,
		replyTo: own || session?.email || undefined,
		subject: mail.subject,
		html: mail.html,
		text: mail.text,
	})
	if (error) {
		console.error('[seo-question-notify] Resend fejlede:', error)
		return NextResponse.json(
			{ error: `Mailen blev ikke sendt: ${error.message}` },
			{ status: 502 },
		)
	}

	const sentAt = new Date().toISOString()
	try {
		await writeClient.create({
			_id: `seo-notice.${randomUUID()}`,
			_type: 'seoQuestionNotice',
			sentAt,
			sentTo: to.join(', '),
			sentToName: name,
			sentBy: sender || 'Lokal test',
			code,
			subject: mail.subject,
			count: questions.length,
			questionKeys: questions.map(questionKey),
		})
	} catch (err) {
		// mailen er sendt; uden log tæller spørgsmålene bare stadig som nye
		console.error('[seo-question-notify] Kunne ikke gemme beskeden:', err)
	}

	return NextResponse.json({
		ok: true,
		sentAt,
		count: questions.length,
		to,
	})
}
