import { Fragment } from 'react'
import { parseBlocks, parseInline } from './richtext'

/** Sikker inline-rendering: React escaper al tekst automatisk. */
function Inline({ text }: { text: string }) {
	return (
		<>
			{parseInline(text).map((t, i) =>
				t.type === 'bold' ? (
					<strong key={i}>{t.value}</strong>
				) : (
					<Fragment key={i}>{t.value}</Fragment>
				),
			)}
		</>
	)
}

/**
 * Viser en "markdown-lite"-besked som pæn struktur (lister + afsnit + fed).
 * Ingen HTML fra brugeren renderes — alt bygges fra genkendte mønstre.
 */
export function StructuredText({ text }: { text: string }) {
	const blocks = parseBlocks(text)
	return (
		<div>
			{blocks.map((b, i) => {
				if (b.type === 'ul')
					return (
						<ul key={i} className="mt-1 mb-1 list-disc space-y-0.5 pl-5">
							{b.items.map((it, j) => (
								<li key={j}>
									<Inline text={it} />
								</li>
							))}
						</ul>
					)
				if (b.type === 'ol')
					return (
						<ol key={i} className="mt-1 mb-1 list-decimal space-y-0.5 pl-5">
							{b.items.map((it, j) => (
								<li key={j}>
									<Inline text={it} />
								</li>
							))}
						</ol>
					)
				return (
					<p key={i} className="mt-1 mb-1 whitespace-pre-line first:mt-0 last:mb-0">
						<Inline text={b.text} />
					</p>
				)
			})}
		</div>
	)
}
