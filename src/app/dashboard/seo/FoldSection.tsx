'use client'

import { useState, type ReactNode } from 'react'

/**
 * Foldbar sektion (accordion) til dashboardets store afsnit, fx henvendelser,
 * AI-besøg og top-søgninger. Sammenfoldet ses kun titel og ét nøgletal, så
 * fanen kan skimmes; indholdet vises først, når man klikker.
 *
 * Indholdet ligger under bjælken (ikke inde i den), så tabeller og kort i
 * sektionen beholder deres egne hvide kort.
 */
export default function FoldSection({
	eyebrow,
	title,
	summary,
	defaultOpen = false,
	children,
}: {
	eyebrow?: string
	title: string
	/** Kort nøgletal, der også ses, når sektionen er foldet sammen */
	summary?: ReactNode
	defaultOpen?: boolean
	children: ReactNode
}) {
	const [open, setOpen] = useState(defaultOpen)

	return (
		<section>
			<button
				type="button"
				onClick={() => setOpen(!open)}
				aria-expanded={open}
				className="border-foreground/[0.08] hover:bg-foreground/[0.015] flex w-full items-center justify-between gap-4 rounded-2xl border bg-white p-5 text-left transition-colors md:p-6"
			>
				<span className="min-w-0">
					{eyebrow && (
						<span className="text-muted mb-1 block text-xs font-medium tracking-[0.2em] uppercase">
							{eyebrow}
						</span>
					)}
					<span className="text-foreground block text-lg font-medium tracking-[-0.02em] md:text-xl">
						{title}
					</span>
					{summary && (
						<span className="text-muted mt-1 block text-sm">{summary}</span>
					)}
				</span>
				<svg
					viewBox="0 0 24 24"
					className="text-muted size-5 shrink-0 transition-transform"
					style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-hidden="true"
				>
					<path d="m6 9 6 6 6-6" />
				</svg>
			</button>

			{open && <div className="mt-5">{children}</div>}
		</section>
	)
}
