'use client'

import { useEffect } from 'react'
import { DASHBOARD_RETURN_KEY } from '@/lib/dashboard-user'

/**
 * Efter login i Studio: kom man fra SEO-dashboardets "Log ind med Sanity",
 * sendes man direkte tilbage til dashboardet i stedet for at blive i Studio.
 * Studio-layoutet vises først, når man er logget ind, så tokenet findes nu.
 */
export function useDashboardReturn() {
	useEffect(() => {
		let next: string | null = null
		try {
			next = sessionStorage.getItem(DASHBOARD_RETURN_KEY)
			sessionStorage.removeItem(DASHBOARD_RETURN_KEY)
		} catch {}
		if (next?.startsWith('/dashboard'))
			window.location.replace(
				`/dashboard/login?next=${encodeURIComponent(next)}`,
			)
	}, [])
}
