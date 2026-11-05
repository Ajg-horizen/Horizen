/**
 * Let, sikker "markdown-lite" til opgavebeskeder.
 *
 * Kunden skriver ren tekst (evt. med formaterings-knapperne i Ad hoc-formularen),
 * og vi gemmer den som PLAIN TEXT — aldrig HTML. Ingen kode-injektion mulig,
 * fordi vi selv bygger visningen ud fra genkendte mønstre:
 *   - "- " eller "* " i starten af en linje  → punktliste
 *   - "1. " / "2) " osv.                       → nummereret liste
 *   - **fed**                                  → fed skrift
 *   - tom linje                                → nyt afsnit
 *
 * Samme parser bruges af React-visningen (StructuredText.tsx) og af
 * notifikations-mailen (structuredTextToHtml herunder), så det ser ens ud.
 */

type InlineToken =
	| { type: 'text'; value: string }
	| { type: 'bold'; value: string }

type Block =
	| { type: 'ul'; items: string[] }
	| { type: 'ol'; items: string[] }
	| { type: 'p'; text: string }

/** Del en linje op i tekst/fed-tokens (til sikker inline-rendering). */
export function parseInline(text: string): InlineToken[] {
	const tokens: InlineToken[] = []
	const re = /\*\*([^*]+)\*\*/g
	let last = 0
	let m: RegExpExecArray | null
	while ((m = re.exec(text)) !== null) {
		if (m.index > last) tokens.push({ type: 'text', value: text.slice(last, m.index) })
		tokens.push({ type: 'bold', value: m[1] })
		last = m.index + m[0].length
	}
	if (last < text.length) tokens.push({ type: 'text', value: text.slice(last) })
	return tokens
}

/** Del hele beskeden op i blokke (lister + afsnit). */
export function parseBlocks(text: string): Block[] {
	const lines = (text ?? '').replace(/\r\n/g, '\n').split('\n')
	const blocks: Block[] = []
	let para: string[] = []
	const flush = () => {
		if (para.length) {
			blocks.push({ type: 'p', text: para.join('\n') })
			para = []
		}
	}
	let i = 0
	while (i < lines.length) {
		const line = lines[i]
		if (/^\s*[-*]\s+/.test(line)) {
			flush()
			const items: string[] = []
			while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
				items.push(lines[i].replace(/^\s*[-*]\s+/, ''))
				i++
			}
			blocks.push({ type: 'ul', items })
			continue
		}
		if (/^\s*\d+[.)]\s+/.test(line)) {
			flush()
			const items: string[] = []
			while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) {
				items.push(lines[i].replace(/^\s*\d+[.)]\s+/, ''))
				i++
			}
			blocks.push({ type: 'ol', items })
			continue
		}
		if (line.trim() === '') {
			flush()
			i++
			continue
		}
		para.push(line)
		i++
	}
	flush()
	return blocks
}

export function escapeHtml(s: string): string {
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;')
}

/** Escape FØRST, sæt derefter **fed** → <strong> (tekst er allerede sikker). */
function inlineHtml(text: string): string {
	return escapeHtml(text).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
}

/**
 * Struktureret besked → sikker HTML (til notifikations-mailen).
 * Al tekst escapes; kun ul/ol/li/strong/p/br genereres af os selv.
 */
export function structuredTextToHtml(text: string): string {
	return parseBlocks(text)
		.map((b) => {
			if (b.type === 'ul')
				return `<ul>${b.items.map((it) => `<li>${inlineHtml(it)}</li>`).join('')}</ul>`
			if (b.type === 'ol')
				return `<ol>${b.items.map((it) => `<li>${inlineHtml(it)}</li>`).join('')}</ol>`
			return `<p>${inlineHtml(b.text).replace(/\n/g, '<br>')}</p>`
		})
		.join('')
}
