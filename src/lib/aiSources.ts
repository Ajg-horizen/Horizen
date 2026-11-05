/**
 * AI-tjenester, vi tæller besøg fra (se /api/ai-visit og dashboardets
 * "Besøg fra AI-tjenester"). Genkendes på den side, besøgeren kom fra
 * (document.referrer), eller på utm_source, som fx ChatGPT sætter på sine links.
 */
export const AI_SOURCES = [
	{
		key: 'chatgpt',
		label: 'ChatGPT',
		hosts: ['chatgpt.com', 'chat.openai.com'],
	},
	{ key: 'perplexity', label: 'Perplexity', hosts: ['perplexity.ai'] },
	{ key: 'claude', label: 'Claude', hosts: ['claude.ai'] },
	{
		key: 'gemini',
		label: 'Gemini',
		hosts: ['gemini.google.com', 'bard.google.com'],
	},
	{ key: 'copilot', label: 'Copilot', hosts: ['copilot.microsoft.com'] },
] as const

export type AiSource = (typeof AI_SOURCES)[number]['key']

export function isAiSource(v: unknown): v is AiSource {
	return AI_SOURCES.some((s) => s.key === v)
}

const matches = (host: string, hosts: readonly string[]) =>
	hosts.some((h) => host === h || host.endsWith(`.${h}`))

/** Finder AI-kilden ud fra referrer og utm_source. Ingen match = null. */
export function detectAiSource(
	referrer: string,
	utmSource: string | null,
): AiSource | null {
	let host = ''
	try {
		host = referrer ? new URL(referrer).hostname.toLowerCase() : ''
	} catch {}
	const utm = (utmSource ?? '').toLowerCase()
	for (const s of AI_SOURCES) {
		if (host && matches(host, s.hosts)) return s.key
		if (utm && (utm === s.key || matches(utm, s.hosts))) return s.key
	}
	return null
}
