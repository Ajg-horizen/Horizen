'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
	MESSAGE_TEMPLATES,
	clientMessage,
	defaultFields,
	type MessageFields,
	type MessageTemplate,
} from './messageText'

/**
 * Fanen "Beskeder" (kun Horizen, Andreas 5/11-2026): servicebeskeder og
 * opgaver til kunden i Horizens mail-design, adskilt fra spørgsmålene.
 * Vælg skabelon, ret teksten, se mailen præcis som kunden får den, og send
 * (POST /api/seo-message). Nederst står alt, der er sendt til kunden, også de
 * samlede beskeder om spørgsmål.
 */

export type SentMessage = {
	kind: 'besked' | 'spoergsmaal'
	sentAt: string
	sentTo: string
	sentToName?: string
	sentBy?: string
	subject: string
	/** Hele mailen; kun beskeder (ikke spørgsmål) gemmes med HTML */
	html?: string
	/** Spørgsmål: antal i beskeden */
	count?: number
	resendId?: string
	/** Seneste hændelse fra Resend (sent, delivered, opened, clicked, bounced …) */
	status?: string
}

const STATUS: Record<string, { label: string; tone: string }> = {
	opened: { label: 'Åbnet', tone: 'bg-emerald-500/15 text-emerald-700' },
	clicked: {
		label: 'Åbnet og klikket',
		tone: 'bg-emerald-500/15 text-emerald-700',
	},
	delivered: {
		label: 'Leveret',
		tone: 'bg-foreground/[0.06] text-foreground/70',
	},
	sent: { label: 'Sendt', tone: 'bg-foreground/[0.06] text-foreground/70' },
	queued: { label: 'Sendes', tone: 'bg-foreground/[0.06] text-foreground/70' },
	delivery_delayed: {
		label: 'Forsinket',
		tone: 'bg-amber-500/15 text-amber-700',
	},
	bounced: { label: 'Kom ikke frem', tone: 'bg-red-500/15 text-red-700' },
	failed: { label: 'Fejlede', tone: 'bg-red-500/15 text-red-700' },
	complained: {
		label: 'Markeret som spam',
		tone: 'bg-red-500/15 text-red-700',
	},
	suppressed: { label: 'Blokeret', tone: 'bg-red-500/15 text-red-700' },
}

const input =
	'border-foreground/[0.12] bg-background text-foreground focus:border-foreground/40 mt-1.5 w-full rounded-2xl border px-4 py-2.5 text-sm outline-none'
const labelCls =
	'text-foreground/50 text-xs font-medium tracking-[0.14em] uppercase'
const card =
	'border-foreground/[0.08] bg-foreground/[0.02] rounded-3xl border p-6'

const date = (iso: string) =>
	new Date(iso).toLocaleString('da-DK', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	})

export default function MessagesTab({
	sender,
	senderPhoto,
	defaults,
	sent,
	templates = MESSAGE_TEMPLATES.map((t) => t.key),
	endpoint = '/api/seo-message',
	dashboardLink,
}: {
	/** Navnet på den, der er logget ind; står som afsender i mailen */
	sender: string
	senderPhoto?: string
	defaults: { name: string; to: string; reviewLink: string; smsSign: string }
	sent: SentMessage[]
	/** Skabeloner, der kan vælges (horizen.dk viser ikke "Anmeldelser og billeder") */
	templates?: MessageTemplate[]
	/** Hvor beskeden sendes hen (POST) */
	endpoint?: string
	/** Bundlinket "SEO-dashboard" i forhåndsvisningen; tom udelader det */
	dashboardLink?: string
}) {
	const router = useRouter()
	const base = {
		name: defaults.name,
		reviewLink: defaults.reviewLink,
		smsSign: defaults.smsSign,
	}
	const [template, setTemplate] = useState<MessageTemplate>(templates[0])
	const [to, setTo] = useState(defaults.to)
	const [fields, setFields] = useState<MessageFields>(
		defaultFields(templates[0], base),
	)
	const [confirm, setConfirm] = useState(false)
	const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>(
		'idle',
	)
	const [notice, setNotice] = useState('')
	const [shown, setShown] = useState<string | null>(null)

	// forhåndsvisning med sidens egen adresse, så logo, portræt og QR-kode vises
	const origin = typeof window === 'undefined' ? '' : window.location.origin
	const mail = clientMessage({
		template,
		fields,
		sender,
		senderPhoto,
		origin,
		dashboardLink: dashboardLink ?? `${origin}/dashboard/seo`,
	})

	const set = <K extends keyof MessageFields>(k: K, v: MessageFields[K]) =>
		setFields((f) => ({ ...f, [k]: v }))

	function pick(t: MessageTemplate) {
		setTemplate(t)
		setFields(defaultFields(t, { ...base, name: fields.name }))
		setConfirm(false)
	}

	async function send() {
		setState('sending')
		setNotice('')
		try {
			const res = await fetch(endpoint, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ template, to, fields }),
			})
			const data = (await res.json()) as {
				error?: string
				sent?: string[]
				failed?: string[]
			}
			if (!res.ok) throw new Error(data.error || 'Beskeden blev ikke sendt')
			setState(data.failed?.length ? 'error' : 'sent')
			const n = data.sent?.length ?? 0
			setNotice(
				`Sendt til ${n === 1 ? data.sent![0] : `${n} modtagere (én mail hver)`}. Du har fået en kopi.` +
					(data.failed?.length
						? ` Kunne ikke sendes til: ${data.failed.join(', ')}.`
						: ''),
			)
			setConfirm(false)
			router.refresh()
		} catch (err) {
			setState('error')
			setNotice(err instanceof Error ? err.message : 'Beskeden blev ikke sendt')
		}
	}

	return (
		<div className="space-y-6">
			<div className={card}>
				<p className={labelCls}>Ny besked · kun Horizen</p>
				<p className="text-foreground mt-1.5 text-base font-medium">
					Send en besked eller en opgave til kunden
				</p>
				<p className="text-foreground/50 mt-1 text-sm">
					Mailen kommer fra dig, og når kunden svarer, lander svaret i din
					indbakke.
				</p>

				<div className="mt-5 flex flex-wrap gap-2">
					{MESSAGE_TEMPLATES.filter((t) => templates.includes(t.key)).map(
						(t) => (
							<button
								key={t.key}
								type="button"
								onClick={() => pick(t.key)}
								className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
									template === t.key
										? 'bg-foreground text-background border-transparent'
										: 'border-foreground/[0.12] text-foreground/70 hover:text-foreground'
								}`}
							>
								{t.label}
							</button>
						),
					)}
				</div>
				<p className="text-foreground/50 mt-2 text-xs">
					{MESSAGE_TEMPLATES.find((t) => t.key === template)?.hint}
				</p>

				<div className="mt-5 grid gap-4 sm:grid-cols-2">
					<div>
						<label htmlFor="msg-to" className={labelCls}>
							Til
						</label>
						<input
							id="msg-to"
							type="text"
							value={to}
							onChange={(e) => setTo(e.target.value)}
							placeholder="navn@firma.dk (flere adskilt med komma; de får hver deres mail)"
							className={input}
						/>
					</div>
					<div>
						<label htmlFor="msg-name" className={labelCls}>
							Modtagerens navn (tom giver bare "Hej")
						</label>
						<input
							id="msg-name"
							type="text"
							value={fields.name}
							onChange={(e) => set('name', e.target.value)}
							placeholder="Fx Michael"
							maxLength={60}
							className={input}
						/>
					</div>
				</div>

				<div className="mt-4">
					<label htmlFor="msg-heading" className={labelCls}>
						Overskrift (og emne)
					</label>
					<input
						id="msg-heading"
						type="text"
						value={fields.heading}
						onChange={(e) => set('heading', e.target.value)}
						maxLength={140}
						className={input}
					/>
				</div>

				<div className="mt-4">
					<label htmlFor="msg-intro" className={labelCls}>
						Tekst
					</label>
					<textarea
						id="msg-intro"
						value={fields.intro}
						onChange={(e) => set('intro', e.target.value)}
						rows={7}
						className={`${input} leading-relaxed`}
					/>
					<p className="text-foreground/50 mt-1 text-xs">
						En tom linje giver et nyt afsnit.
					</p>
				</div>

				{template === 'anmeldelser' ? (
					<div className="mt-4 grid gap-4 sm:grid-cols-2">
						<div>
							<label htmlFor="msg-review" className={labelCls}>
								Link til anmeldelser
							</label>
							<input
								id="msg-review"
								type="url"
								value={fields.reviewLink}
								onChange={(e) => set('reviewLink', e.target.value)}
								placeholder="https://g.page/r/…/review"
								className={input}
							/>
						</div>
						<div>
							<label htmlFor="msg-sign" className={labelCls}>
								Hilsen i SMS'en
							</label>
							<input
								id="msg-sign"
								type="text"
								value={fields.smsSign}
								onChange={(e) => set('smsSign', e.target.value)}
								placeholder="Fx Michael, Malerfirma Seitz"
								className={input}
							/>
						</div>
						<label className="text-foreground/70 flex items-center gap-2 text-sm sm:col-span-2">
							<input
								type="checkbox"
								checked={fields.askPhotos}
								onChange={(e) => set('askPhotos', e.target.checked)}
							/>
							Bed også om 10 billeder af kundens opgaver
						</label>
					</div>
				) : template === 'fri' ? (
					<div className="mt-4 grid gap-4 sm:grid-cols-2">
						<div>
							<label htmlFor="msg-btn" className={labelCls}>
								Knap (valgfri)
							</label>
							<input
								id="msg-btn"
								type="text"
								value={fields.buttonText}
								onChange={(e) => set('buttonText', e.target.value)}
								placeholder="Fx Se dashboardet"
								className={input}
							/>
						</div>
						<div>
							<label htmlFor="msg-btn-link" className={labelCls}>
								Knappens link
							</label>
							<input
								id="msg-btn-link"
								type="url"
								value={fields.buttonLink}
								onChange={(e) => set('buttonLink', e.target.value)}
								placeholder="https://…"
								className={input}
							/>
						</div>
					</div>
				) : null}

				<div className="border-foreground/[0.08] bg-background mt-5 rounded-2xl border p-4 text-sm">
					<p className={labelCls}>Forhåndsvisning</p>
					<p className="text-foreground/50 mt-2">
						Emne: <span className="text-foreground">{mail.subject}</span>
					</p>
					<iframe
						title="Forhåndsvisning af beskeden"
						srcDoc={mail.html}
						// ingen scripts; same-origin så logo, portræt og QR-kode kan hentes
						sandbox="allow-same-origin"
						className="mt-3 h-[1100px] w-full rounded-xl border-0 bg-white"
					/>
				</div>

				<div className="mt-4 flex flex-wrap items-center gap-3">
					{confirm ? (
						<>
							<span className="text-foreground text-sm">
								Send til <strong>{to}</strong>?
							</span>
							<button
								type="button"
								onClick={send}
								disabled={state === 'sending'}
								className="bg-foreground text-background rounded-full px-5 py-2.5 text-sm font-medium transition-opacity disabled:opacity-40"
							>
								{state === 'sending' ? 'Sender…' : 'Ja, send nu'}
							</button>
							<button
								type="button"
								onClick={() => setConfirm(false)}
								className="text-foreground/60 hover:text-foreground text-sm font-medium"
							>
								Annullér
							</button>
						</>
					) : (
						<button
							type="button"
							onClick={() => {
								setConfirm(true)
								setState('idle')
								setNotice('')
							}}
							disabled={!to.trim() || !fields.intro.trim()}
							className="bg-foreground text-background rounded-full px-5 py-2.5 text-sm font-medium transition-opacity disabled:opacity-40"
						>
							Send besked
						</button>
					)}
				</div>
				{notice && (
					<p
						className={
							state === 'error'
								? 'mt-4 text-sm text-red-600'
								: 'text-foreground/70 mt-4 text-sm'
						}
					>
						{notice}
					</p>
				)}
			</div>

			<div className={card}>
				<p className={labelCls}>Sendt til kunden</p>
				{sent.length === 0 ? (
					<p className="text-foreground/50 mt-3 text-sm">
						Der er ikke sendt nogen beskeder endnu.
					</p>
				) : (
					<ul className="mt-3">
						{sent.map((m) => {
							const id = `${m.kind}-${m.sentAt}`
							return (
								<li
									key={id}
									className="border-foreground/[0.06] border-b py-3 last:border-0"
								>
									<div className="flex flex-wrap items-baseline justify-between gap-2">
										<div>
											<p className="text-foreground flex flex-wrap items-center gap-2 text-sm font-medium">
												{m.subject}
												{m.status && STATUS[m.status] && (
													<span
														className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS[m.status].tone}`}
													>
														{STATUS[m.status].label}
													</span>
												)}
											</p>
											<p className="text-foreground/50 mt-0.5 text-xs">
												{date(m.sentAt)} · til {m.sentTo}
												{m.sentBy ? ` · fra ${m.sentBy}` : ''}
												{m.kind === 'spoergsmaal'
													? ` · besked om ${m.count ?? 0} spørgsmål`
													: ''}
											</p>
										</div>
										{m.html && (
											<button
												type="button"
												onClick={() => setShown(shown === id ? null : id)}
												className="text-foreground/60 hover:text-foreground text-sm font-medium"
											>
												{shown === id ? 'Skjul' : 'Vis mailen'}
											</button>
										)}
									</div>
									{shown === id && m.html && (
										<iframe
											title={`Sendt: ${m.subject}`}
											srcDoc={m.html}
											sandbox="allow-same-origin"
											className="mt-3 h-[900px] w-full rounded-xl border-0 bg-white"
										/>
									)}
								</li>
							)
						})}
					</ul>
				)}
			</div>
		</div>
	)
}
