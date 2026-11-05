'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

export type SavedAnswer = { text: string; by: string; at: string }

/**
 * Svarfelt under et spørgsmål på fanen "Spørgsmål" (Andreas 1/11-2026): kunden
 * skriver og trykker Gem. Svaret gemmes i Sanity (POST /api/seo-answer) og
 * vises her og i Studio. Ingen mail. Et gemt svar står låst med grå tekst,
 * indtil "Rediger svar" låser det op igen. Et tomt felt + Gem sletter svaret.
 * Farverne følger dashboardets lyse og mørke tema (foreground/background).
 */
export default function QuestionAnswer({
	questionKey,
	saved: initial,
}: {
	questionKey: string
	saved?: SavedAnswer
}) {
	const [saved, setSaved] = useState(initial)
	const [text, setText] = useState(initial?.text ?? '')
	const [editing, setEditing] = useState(!initial)
	const [state, setState] = useState<'idle' | 'saving' | 'error'>('idle')
	const changed = text.trim() !== (saved?.text ?? '')
	const locked = !editing

	async function save() {
		setState('saving')
		try {
			const res = await fetch('/api/seo-answer', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ key: questionKey, answer: text }),
			})
			const data = (await res.json()) as { answer?: SavedAnswer | null }
			if (!res.ok) throw new Error()
			setSaved(data.answer ?? undefined)
			setText(data.answer?.text ?? '')
			// gemt svar låses; et slettet svar efterlader et tomt, åbent felt
			setEditing(!data.answer)
			setState('idle')
		} catch {
			setState('error')
		}
	}

	function cancel() {
		setText(saved?.text ?? '')
		setEditing(false)
		setState('idle')
	}

	return (
		<div className="mt-4">
			<label
				htmlFor={`svar-${questionKey}`}
				className="text-foreground/50 text-xs font-medium tracking-[0.14em] uppercase"
			>
				Svar
			</label>
			<textarea
				id={`svar-${questionKey}`}
				value={text}
				onChange={(e) => setText(e.target.value)}
				readOnly={locked}
				rows={3}
				maxLength={4000}
				placeholder="Svaret skrives her"
				className={cn(
					'border-foreground/[0.12] mt-1.5 w-full rounded-2xl border px-4 py-3 text-sm leading-relaxed outline-none',
					locked
						? 'bg-foreground/[0.04] text-foreground/55 cursor-default'
						: 'bg-background text-foreground focus:border-foreground/40',
				)}
			/>
			<div className="mt-2 flex flex-wrap items-center gap-3">
				{locked ? (
					<button
						type="button"
						onClick={() => setEditing(true)}
						className="border-foreground/[0.15] text-foreground hover:bg-foreground/[0.04] rounded-full border px-5 py-2 text-sm font-medium transition-colors"
					>
						Rediger svar
					</button>
				) : (
					<>
						<button
							type="button"
							onClick={save}
							disabled={!changed || state === 'saving'}
							className="bg-foreground text-background rounded-full px-5 py-2 text-sm font-medium transition-opacity disabled:opacity-40"
						>
							{state === 'saving' ? 'Gemmer…' : 'Gem'}
						</button>
						{saved && (
							<button
								type="button"
								onClick={cancel}
								className="text-foreground/60 hover:text-foreground text-sm font-medium"
							>
								Annullér
							</button>
						)}
					</>
				)}
				{state === 'error' && (
					<span className="text-sm text-red-600">
						Svaret blev ikke gemt (fejl ved forbindelsen).
					</span>
				)}
				{state !== 'error' && saved && locked && (
					<span className="text-foreground/50 text-sm">
						Gemt{' '}
						{new Date(saved.at).toLocaleString('da-DK', {
							day: 'numeric',
							month: 'long',
							hour: '2-digit',
							minute: '2-digit',
						})}
						{saved.by && ` af ${saved.by}`}
					</span>
				)}
			</div>
		</div>
	)
}
