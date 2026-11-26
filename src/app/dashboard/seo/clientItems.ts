import 'server-only'
import { groq } from 'next-sanity'
import { client } from '@/sanity/lib/client'
import {
	clientQuestions as dataQuestions,
	clientTodos as dataTodos,
	type ClientQuestion,
	type ClientTodo,
} from './data'

/**
 * Opgaver og spørgsmål til kunden (Andreas 16/11-2026): de ældre står i
 * data.ts, nye oprettes i Studio (seoClientTodo / seoClientQuestion), så de
 * ikke kræver kode eller en ny udrulning. Begge kilder flettes her; data.ts
 * står først, så rækkefølgen for de eksisterende ikke ændres. Et dokument fra
 * Studio har sit dokument-id som nøgle, og markeringer (seoTodoDone,
 * seoTodoSeen, seoQuestionAnswer) gemmes under den.
 *
 * Bruges af dashboardet og af /api/seo-todo og /api/seo-answer, så kun kendte
 * opgaver og spørgsmål kan markeres. Fejler blødt til data.ts alene.
 */

const reader = () =>
	client.withConfig({
		token: process.env.SANITY_API_READ_TOKEN,
		useCdn: false,
		perspective: 'published',
		stega: false,
	})

/** GROQ giver null for tomme felter; typerne forventer at feltet mangler. */
function dropNulls<T extends Record<string, unknown>>(obj: T): T {
	return Object.fromEntries(Object.entries(obj).filter(([, v]) => v != null)) as T
}

type TodoRow = Omit<ClientTodo, 'kind'> & {
	kind?: string | null
	note?: { label?: string; placeholder?: string; help?: string; consent?: string } | null
}

export async function getClientTodos(): Promise<ClientTodo[]> {
	try {
		const rows = await reader().fetch<TodoRow[]>(
			groq`*[_type == "seoClientTodo" && hidden != true && defined(title)]
				| order(coalesce(priority, 9999) asc, askedAt desc){
				"id": _id, askedAt, area, title, why, steps, kind,
				"copyText": select(defined(copyText.text) => { "label": coalesce(copyText.label, "Kopiér beskeden"), "text": copyText.text }),
				"links": links[defined(href)]{ label, href, hint, ask },
				note,
				"closed": select(defined(closed.date) => { "date": closed.date, "text": coalesce(closed.text, "") })
			}`,
			{},
			{ cache: 'no-store' },
		)
		const fromStudio = (rows ?? []).map((r) => {
			const { note, kind, ...rest } = r
			return dropNulls({
				...rest,
				kind: kind === 'laes' || kind === 'godkend' ? kind : 'handling',
				steps: r.steps?.length ? r.steps : undefined,
				links: r.links?.length ? r.links.map((l) => dropNulls(l)) : undefined,
				noteLabel: note?.label,
				notePlaceholder: note?.placeholder,
				noteHelp: note?.help,
				noteConsent: note?.consent,
				askedAt: r.askedAt ?? '',
				why: r.why ?? '',
			}) as ClientTodo
		})
		const known = new Set(dataTodos.map((t) => t.id))
		return [...dataTodos, ...fromStudio.filter((t) => !known.has(t.id))]
	} catch (err) {
		console.error('[dashboard] Kunne ikke hente opgaver fra Studio:', err)
		return dataTodos
	}
}

export async function getClientQuestions(): Promise<ClientQuestion[]> {
	try {
		const rows = await reader().fetch<ClientQuestion[]>(
			groq`*[_type == "seoClientQuestion" && hidden != true && defined(question)]
				| order(askedAt desc){
				"id": _id, askedAt, area, question, context,
				"answer": select(defined(answer.text) => { "date": coalesce(answer.date, askedAt), "text": answer.text })
			}`,
			{},
			{ cache: 'no-store' },
		)
		const fromStudio = (rows ?? []).map((r) => dropNulls(r) as ClientQuestion)
		return [...dataQuestions, ...fromStudio]
	} catch (err) {
		console.error('[dashboard] Kunne ikke hente spørgsmål fra Studio:', err)
		return dataQuestions
	}
}
