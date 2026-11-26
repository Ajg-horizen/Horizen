'use client'

import { gotoTab } from './TabLink'

/**
 * "Nyt i dit arbejdsrum" (Andreas 16/11-2026). Erstatter den gamle
 * "Send besked om N spørgsmål": beskeden skal ikke tælle spørgsmål, bare
 * fortælle kunden, at der ligger nyt i arbejdsrummet, kunden skal tage stilling
 * til (spørgsmål og/eller to-do). Knappen åbner Beskeder med skabelonen
 * "Nyt i dit arbejdsrum" valgt (MessagesTab læser #b=arbejdsrum). Kun Horizen.
 */
export default function WorkspaceNotice() {
	return (
		<button
			type="button"
			onClick={() => gotoTab({ v: 'beskeder', b: 'arbejdsrum' })}
			className="group mb-6 flex w-full items-center gap-4 rounded-3xl border border-foreground/[0.08] bg-white p-5 text-left transition-colors hover:bg-foreground/[0.02]"
		>
			<span
				className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
				style={{
					backgroundColor: 'color-mix(in srgb, #22c55e 14%, transparent)',
					color: '#16a34a',
				}}
				aria-hidden
			>
				{/* Papirfly */}
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
					<path
						d="M21 3 3 10.5l7 2.5m11-10-8 18-3-8m11-10L10 13"
						stroke="currentColor"
						strokeWidth="1.7"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</span>
			<span className="min-w-0 flex-1">
				<span className="block text-sm font-medium text-foreground">
					Nyt i din indbakke
				</span>
				<span className="mt-0.5 block text-sm text-muted">
					Send kunden en besked om, at der ligger nyt i indbakken at tage stilling til.
				</span>
			</span>
			<span
				aria-hidden
				className="shrink-0 text-muted transition-transform duration-300 group-hover:translate-x-1"
			>
				→
			</span>
		</button>
	)
}
