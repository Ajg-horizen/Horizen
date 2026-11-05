'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { noticeMail } from './noticeText'

/**
 * Øverst på fanen "Spørgsmål", kun for Horizen (Andreas 1/11-2026): én samlet
 * besked til kunden om nye spørgsmål, når en bunke er samlet. Viser antal nye
 * siden sidste besked; "Send besked" åbner modtager og forhåndsvisning, og
 * først "Send nu" sender (POST /api/seo-question-notify). Aldrig automatisk.
 */
export default function QuestionNotice({
	count,
	sender,
	senderPhoto,
	defaultName,
	defaultTo,
	last,
}: {
	count: number
	/** Navnet på den, der er logget ind; står som afsender i mailen */
	sender: string
	senderPhoto?: string
	defaultName: string
	defaultTo: string
	last?: {
		sentAt: string
		sentTo: string
		sentToName?: string
		count: number
	} | null
}) {
	const router = useRouter()
	const [open, setOpen] = useState(false)
	const [to, setTo] = useState(defaultTo)
	const [name, setName] = useState(defaultName)
	// forhåndsvisning med sidens egen adresse, så logo og billede kan vises
	const origin = typeof window === 'undefined' ? '' : window.location.origin
	const mail = noticeMail({
		count,
		name,
		link: `${origin}/dashboard/seo#v=spoergsmaal`,
		sender,
		senderPhoto,
		origin,
	})
	const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>(
		'idle',
	)
	const [message, setMessage] = useState('')

	async function send() {
		setState('sending')
		setMessage('')
		try {
			const res = await fetch('/api/seo-question-notify', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ to, name }),
			})
			const data = (await res.json()) as { error?: string; count?: number }
			if (!res.ok) throw new Error(data.error || 'Beskeden blev ikke sendt')
			setState('sent')
			setMessage(`Beskeden om ${data.count} spørgsmål er sendt til ${to}.`)
			setOpen(false)
			router.refresh()
		} catch (err) {
			setState('error')
			setMessage(
				err instanceof Error ? err.message : 'Beskeden blev ikke sendt',
			)
		}
	}

	const date = (iso: string) =>
		new Date(iso).toLocaleString('da-DK', {
			day: 'numeric',
			month: 'long',
			hour: '2-digit',
			minute: '2-digit',
		})

	return (
		<div className="border-foreground/[0.08] bg-foreground/[0.02] mb-6 rounded-3xl border p-6">
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div>
					<p className="text-foreground/50 text-xs font-medium tracking-[0.14em] uppercase">
						Besked til kunden · kun Horizen
					</p>
					<p className="text-foreground mt-1.5 text-base font-medium">
						{count === 0
							? 'Ingen nye spørgsmål siden sidste besked'
							: `${count} ${count === 1 ? 'nyt spørgsmål' : 'nye spørgsmål'} siden sidste besked`}
					</p>
					<p className="text-foreground/50 mt-1 text-sm">
						{last
							? `Sidste besked ${date(last.sentAt)} til ${last.sentTo} (${last.count} spørgsmål)`
							: 'Der er ikke sendt nogen besked endnu'}
					</p>
				</div>
				{!open && (
					<button
						type="button"
						onClick={() => {
							setOpen(true)
							setState('idle')
							setMessage('')
						}}
						disabled={count === 0}
						className="bg-foreground text-background rounded-full px-5 py-2.5 text-sm font-medium transition-opacity disabled:opacity-40"
					>
						Send besked om {count} spørgsmål
					</button>
				)}
			</div>

			{open && (
				<div className="border-foreground/[0.08] mt-5 border-t pt-5">
					<label
						htmlFor="besked-navn"
						className="text-foreground/50 text-xs font-medium tracking-[0.14em] uppercase"
					>
						Kundens navn
					</label>
					<input
						id="besked-navn"
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="Fx Ramin"
						maxLength={60}
						className="border-foreground/[0.12] bg-background text-foreground focus:border-foreground/40 mt-1.5 mb-4 w-full rounded-2xl border px-4 py-2.5 text-sm outline-none"
					/>
					<label
						htmlFor="besked-til"
						className="text-foreground/50 text-xs font-medium tracking-[0.14em] uppercase"
					>
						Til
					</label>
					<input
						id="besked-til"
						type="text"
						value={to}
						onChange={(e) => setTo(e.target.value)}
						placeholder="navn@firma.dk (flere adskilt med komma)"
						className="border-foreground/[0.12] bg-background text-foreground focus:border-foreground/40 mt-1.5 w-full rounded-2xl border px-4 py-2.5 text-sm outline-none"
					/>

					<div className="border-foreground/[0.08] bg-background mt-4 rounded-2xl border p-4 text-sm">
						<p className="text-foreground/50 text-xs font-medium tracking-[0.14em] uppercase">
							Forhåndsvisning
						</p>
						<p className="text-foreground/50 mt-2">
							Emne: <span className="text-foreground">{mail.subject}</span>
						</p>
						<iframe
							title="Forhåndsvisning af mailen"
							srcDoc={mail.html}
							// ingen scripts; same-origin så logo og billede kan hentes (også fra localhost)
							sandbox="allow-same-origin"
							className="mt-3 h-[820px] w-full rounded-xl border-0 bg-white"
						/>
						<p className="text-foreground/50 mt-3 text-xs">
							Sådan ser mailen ud i indbakken. Knappen åbner fanen Spørgsmål, og
							svar på mailen går til den, der sender.
						</p>
					</div>

					<div className="mt-4 flex flex-wrap items-center gap-3">
						<button
							type="button"
							onClick={send}
							disabled={!to.trim() || state === 'sending'}
							className="bg-foreground text-background rounded-full px-5 py-2.5 text-sm font-medium transition-opacity disabled:opacity-40"
						>
							{state === 'sending' ? 'Sender…' : 'Send nu'}
						</button>
						<button
							type="button"
							onClick={() => setOpen(false)}
							className="text-foreground/60 hover:text-foreground text-sm font-medium"
						>
							Annullér
						</button>
					</div>
				</div>
			)}

			{message && (
				<p
					className={
						state === 'error'
							? 'mt-4 text-sm text-red-600'
							: 'text-foreground/70 mt-4 text-sm'
					}
				>
					{message}
				</p>
			)}
		</div>
	)
}
