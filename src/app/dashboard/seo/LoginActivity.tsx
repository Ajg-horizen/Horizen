'use client'

import { useEffect, useRef, useState } from 'react'
import type { LoginSummary } from '@/lib/dashboardLogins'

/** Fast orange (dashboard.css' --tone-orange er currentColor i mørk tilstand) */
const ORANGE = '#ea580c'

/**
 * KUN HORIZEN: om kundens folk bruger dashboardet. Et ikon øverst til højre;
 * hold musen over (eller tryk) for at se pr. person: seneste besøg og antal
 * besøg denne og sidste måned. Orange prik, når ingen fra kunden har været
 * inde i 30 dage. Siden sender den kun med, når Horizen er logget ind (se
 * page.tsx og src/lib/dashboardLogins.ts).
 */
export default function LoginActivity({
	summary,
	example = false,
}: {
	summary: LoginSummary
	/** Lokalt uden rigtige besøg vises eksempler */
	example?: boolean
}) {
	const [open, setOpen] = useState(false)
	const box = useRef<HTMLDivElement>(null)

	// Tryk udenfor eller Escape lukker (til touch, hvor der ikke er hover)
	useEffect(() => {
		if (!open) return
		const onDown = (e: PointerEvent) => {
			if (!box.current?.contains(e.target as Node)) setOpen(false)
		}
		const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
		document.addEventListener('pointerdown', onDown)
		document.addEventListener('keydown', onKey)
		return () => {
			document.removeEventListener('pointerdown', onDown)
			document.removeEventListener('keydown', onKey)
		}
	}, [open])

	const { people, daysSinceAny, inactive } = summary
	const latest = people[0]
	const label = latest
		? `Kunden sidst inde: ${latest.name}, ${latest.ago}`
		: 'Ingen fra kunden har været inde endnu'

	return (
		<div
			ref={box}
			className="relative"
			onMouseEnter={() => setOpen(true)}
			onMouseLeave={() => setOpen(false)}
		>
			<button
				type="button"
				onClick={() => setOpen((o) => !o)}
				aria-expanded={open}
				aria-label={label}
				className="border-foreground/[0.08] text-foreground/80 hover:text-foreground relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-white backdrop-blur-xl transition-colors"
			>
				<svg
					viewBox="0 0 24 24"
					width="18"
					height="18"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.8"
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-hidden
				>
					<circle cx="12" cy="8" r="4" />
					<path d="M4 21a8 8 0 0 1 16 0" />
				</svg>
				{inactive && (
					<span
						aria-hidden
						className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full ring-2 ring-white"
						style={{ background: ORANGE }}
					/>
				)}
			</button>

			{open && (
				// pt-2 i stedet for mt-2, så musen kan glide fra ikonet ned i panelet
				<div className="absolute right-0 z-40 w-[min(20rem,calc(100vw-1.5rem))] pt-2">
					<div className="border-foreground/[0.08] overflow-hidden rounded-2xl border bg-white text-left shadow-xl">
						<div className="border-foreground/[0.08] border-b px-4 py-3">
							<p className="text-foreground text-sm font-medium">
								Kundens besøg i dashboardet
							</p>
							<p className="text-foreground/50 mt-0.5 text-xs">
								{example && (
									<span className="text-foreground font-medium">
										Eksempeldata (kun lokalt).{' '}
									</span>
								)}
								Kun Horizen kan se dette.
							</p>
						</div>

						{inactive && daysSinceAny !== null && (
							<p
								className="border-foreground/[0.08] border-b px-4 py-2.5 text-sm font-medium"
								style={{ color: ORANGE }}
							>
								Ingen fra kunden har været inde i {daysSinceAny} dage.
							</p>
						)}

						{people.length === 0 ? (
							<p className="text-foreground/60 px-4 py-4 text-sm">
								Ingen fra kunden har været inde endnu, siden målingen blev slået
								til.
							</p>
						) : (
							<ul className="divide-foreground/[0.06] divide-y">
								{people.slice(0, 8).map((p) => (
									<li key={p.email} className="px-4 py-2.5">
										<p className="flex items-baseline justify-between gap-3 text-sm">
											<span
												className="text-foreground min-w-0 truncate font-medium"
												title={p.email}
											>
												{p.name}
											</span>
											<span
												className="text-foreground/55 shrink-0 text-xs"
												style={p.days >= 30 ? { color: ORANGE } : undefined}
											>
												{p.ago}
											</span>
										</p>
										<p className="text-foreground/50 mt-0.5 text-xs">
											Senest {p.last} · {p.thisMonth} besøg i{' '}
											{summary.thisMonthLabel}, {p.lastMonth} i{' '}
											{summary.lastMonthLabel}
										</p>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>
			)}
		</div>
	)
}
