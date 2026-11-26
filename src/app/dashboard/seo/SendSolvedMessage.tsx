'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { HoldToConfirm } from './BuyHours'
import { defaultFields } from './messageText'

/**
 * "Opgaverne er løst" direkte fra Aktivitet (Andreas 19/11-2026): kun
 * Horizen. Sender Beskeder-skabelonen "loest" til en af kundens faste
 * modtagere (clientRecipients i data.ts) uden en tur forbi Beskeder. Knappen
 * skal holdes nede i 3 sekunder, så den ikke sendes ved et uheld. Mailen
 * gemmes som alle andre beskeder og står derfor også under Beskeder.
 */
export default function SendSolvedMessage({ recipients }: { recipients: { email: string; name: string }[] }) {
	const router = useRouter()
	const [to, setTo] = useState(recipients[0]?.email ?? '')
	const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
	const [error, setError] = useState('')
	const recipient = recipients.find((r) => r.email === to)
	const who = recipient?.name || recipient?.email || ''

	if (!recipients.length) return null

	async function send() {
		setState('sending')
		setError('')
		try {
			const res = await fetch('/api/seo-message', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ template: 'loest', to, fields: defaultFields('loest', { name: recipient?.name ?? '' }) }),
			})
			const data = await res.json().catch(() => ({}))
			if (!res.ok) throw new Error(data?.error || 'Beskeden kunne ikke sendes')
			setState('sent')
			router.refresh()
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Beskeden kunne ikke sendes')
			setState('error')
		}
	}

	if (state === 'sent') {
		return (
			<p
				className="rounded-full px-4 py-2.5 text-sm font-medium"
				style={{ backgroundColor: 'var(--st-done-bg)', color: 'var(--st-done-text)' }}
				role="status"
			>
				✓ &quot;Opgaverne er løst&quot; er sendt til {who}
			</p>
		)
	}

	return (
		<div className="flex flex-col items-stretch gap-2 md:items-end">
			<HoldToConfirm
				label={state === 'sending' ? 'Sender …' : 'Send "Opgaverne er løst"'}
				disabled={state === 'sending'}
				onConfirm={send}
				verb="sende"
				hint={recipients.length === 1 ? `til ${who}` : undefined}
			/>
			{recipients.length > 1 && (
				<label className="flex items-center justify-end gap-2 text-xs text-foreground/55">
					Til
					<select
						value={to}
						onChange={(e) => setTo(e.target.value)}
						className="rounded-full border border-foreground/[0.12] bg-transparent px-2.5 py-1 text-xs text-foreground"
					>
						{recipients.map((r) => (
							<option key={r.email} value={r.email}>
								{r.name ? `${r.name} (${r.email})` : r.email}
							</option>
						))}
					</select>
				</label>
			)}
			{state === 'error' && (
				<p className="text-xs" style={{ color: 'var(--st-missing-text)' }}>
					{error}
				</p>
			)}
		</div>
	)
}
