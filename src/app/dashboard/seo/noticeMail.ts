import { groq } from 'next-sanity'
import { clientQuestions, questionKey, type ClientQuestion } from './data'

/**
 * Samlet besked til kunden om nye spørgsmål (Andreas 1/11-2026). Bruges både
 * af dashboardet (forhåndsvisning) og af POST /api/seo-question-notify
 * (afsendelse), så de altid er enige om, hvad der er nyt.
 *
 * Nyt = et spørgsmål uden svar (hverken i data.ts eller gemt af kunden), som
 * ikke var med i en tidligere sendt besked (seoQuestionNotice.questionKeys).
 */

export const NOTICE_STATE_QUERY = groq`{
	"answered": *[_type == "seoQuestionAnswer" && defined(answer)].key,
	"notified": *[_type == "seoQuestionNotice"].questionKeys[],
	"last": *[_type == "seoQuestionNotice"] | order(sentAt desc)[0]{ sentAt, sentTo, sentToName, count },
}`

export type NoticeState = {
	answered?: string[] | null
	notified?: string[] | null
	last?: {
		sentAt: string
		sentTo: string
		sentToName?: string
		count: number
	} | null
}

/** Spørgsmål, der skal med i næste besked */
export function pendingQuestions(state: NoticeState): ClientQuestion[] {
	const answered = new Set(state.answered ?? [])
	const notified = new Set(state.notified ?? [])
	return clientQuestions.filter((q) => {
		const key = questionKey(q)
		return !q.answer && !answered.has(key) && !notified.has(key)
	})
}

export { noticeMail } from './noticeText'
