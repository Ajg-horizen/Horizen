'use client'

import { useCallback, useEffect, useState } from 'react'
import { DASHBOARD_RETURN_KEY } from '@/lib/dashboard-user'

/**
 * Log ind med Sanity. Studio gemmer sit login i browseren
 * (auth.loginMethod = 'token' i sanity.config.ts), og samme domæne kan derfor
 * læse det her. Tokenet sendes til /api/dashboard-auth, som spørger Sanity,
 * hvem brugeren er, og sætter dashboardets egen cookie.
 *
 * Er man ikke logget ind i Studio, går man til Studios login i samme fane.
 * Efter login sender Studio én direkte tilbage hertil (DASHBOARD_RETURN_KEY,
 * se useDashboardReturn), så man lander i dashboardet uden et ekstra klik.
 */

type State = 'checking' | 'idle' | 'error'

const ERRORS: Record<string, string> = {
	denied: 'Din Sanity-bruger har ikke adgang til dette projekt.',
	'not-configured': 'Login med Sanity er ikke sat op endnu.',
	'rate-limited': 'For mange forsøg. Vent et par minutter.',
	failed: 'Login mislykkedes. Prøv igen.',
}

export default function LoginPanel({
	projectId,
	next,
	loggedOut,
}: {
	projectId: string
	next: string
	/** Lige logget ud: fortsæt ikke automatisk med Studio-login */
	loggedOut: boolean
}) {
	const storageKey = `__studio_auth_token_${projectId}`
	const [state, setState] = useState<State>(loggedOut ? 'idle' : 'checking')
	const [error, setError] = useState<string | null>(null)

	const readToken = useCallback((): string | null => {
		try {
			return (
				JSON.parse(localStorage.getItem(storageKey) ?? 'null')?.token ?? null
			)
		} catch {
			return null
		}
	}, [storageKey])

	const signIn = useCallback(
		async (token: string) => {
			setState('checking')
			setError(null)
			try {
				const res = await fetch('/api/dashboard-auth', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ token }),
				})
				const d = await res.json().catch(() => ({}))
				if (res.ok) return window.location.replace(next)
				setError(ERRORS[d.error] ?? ERRORS.failed)
			} catch {
				setError(ERRORS.failed)
			}
			setState('error')
		},
		[next],
	)

	// Allerede logget ind i Studio: fortsæt med det samme
	useEffect(() => {
		if (loggedOut) return
		const token = readToken()
		if (token) signIn(token)
		else setState('idle')
	}, [loggedOut, readToken, signIn])

	// Login i Studio-fanen: fortsæt her, så snart tokenet dukker op
	useEffect(() => {
		const onStorage = (e: StorageEvent) => {
			if (e.key !== storageKey || !e.newValue) return
			const token = readToken()
			if (token) signIn(token)
		}
		window.addEventListener('storage', onStorage)
		return () => window.removeEventListener('storage', onStorage)
	}, [storageKey, readToken, signIn])

	function start() {
		const token = readToken()
		if (token) return signIn(token)
		setState('checking')
		try {
			sessionStorage.setItem(DASHBOARD_RETURN_KEY, next)
		} catch {}
		window.location.assign('/admin')
	}

	return (
		<div className="mt-3">
			<p className="text-foreground/60 text-sm leading-relaxed">
				Brug den samme bruger som i Sanity Studio.
			</p>

			{error && (
				<p
					className="mt-5 rounded-2xl px-4 py-3 text-sm"
					style={{
						backgroundColor: 'var(--st-missing-bg)',
						color: 'var(--st-missing-text)',
					}}
					role="alert"
				>
					{error}
				</p>
			)}

			<button
				type="button"
				onClick={start}
				disabled={state === 'checking'}
				className="bg-foreground text-background mt-6 w-full rounded-full px-5 py-3 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-60"
			>
				{state === 'checking' ? 'Logger ind…' : 'Log ind med Sanity'}
			</button>


		</div>
	)
}
