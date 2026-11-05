import type { Metadata } from 'next'
import { projectId } from '@/sanity/lib/env'
import HorizenLogo from '../seo/HorizenLogo'
import LoginPanel from './LoginPanel'

export const metadata: Metadata = {
	title: 'Log ind · SEO-overblik',
}

/**
 * Login til SEO-dashboardet. proxy.ts sender alle uden gyldig session hertil,
 * også dem der får et delt link. Login sker kun med Sanity (LoginPanel).
 */
export default async function DashboardLoginPage({
	searchParams,
}: {
	searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
	const sp = await searchParams
	const next = typeof sp.next === 'string' ? sp.next : ''

	return (
		<main className="flex min-h-screen items-center justify-center p-4">
			<div className="w-full max-w-md">
				<div className="border-foreground/[0.08] rounded-3xl border bg-white p-8 md:p-10">
					<p className="text-foreground/50 text-[11px] font-medium tracking-[0.16em] uppercase">
						SEO-overblik
					</p>
					<h1 className="text-foreground mt-3 text-2xl font-semibold tracking-tight md:text-[1.75rem]">
						Log ind
					</h1>
					<LoginPanel
						projectId={projectId}
						next={next.startsWith('/dashboard') ? next : '/dashboard/seo'}
						loggedOut={sp.ud === '1'}
					/>
				</div>
				<a
					href="https://horizen.dk"
					target="_blank"
					rel="noopener noreferrer"
					className="text-foreground/40 hover:text-foreground/80 mt-6 flex items-center justify-center gap-2 transition-colors"
					aria-label="Powered by Horizen"
				>
					<span className="text-[11px]">Powered by</span>
					<HorizenLogo className="h-[11px] w-auto" />
				</a>
			</div>
		</main>
	)
}
