'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

/**
 * Lille "Betingelser" nederst i menuen under "Powered by Horizen" (Andreas 7/11-2026): dashboardet er Horizens
 * egen software og en del af Horizens service (åbenhed om arbejdet); kundens
 * hjemmeside og data er kundens. Kald det "dashboardet", ikke "SEO-dashboardet". Et klik åbner en kort forklaring med link til
 * handelsbetingelserne (afsnittet "Horizens interne værktøjer og
 * arbejdsmetoder"). Teksten er en oplysning; det er handelsbetingelserne,
 * der er aftalen.
 */
export default function OwnershipNote() {
	const [open, setOpen] = useState(false)

	useEffect(() => {
		if (!open) return
		const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
		document.addEventListener('keydown', onKey)
		return () => document.removeEventListener('keydown', onKey)
	}, [open])

	return (
		<>
			<button
				type="button"
				onClick={() => setOpen(true)}
				className="text-foreground/25 hover:text-foreground/60 mt-1 block px-3 text-[9px] transition-colors"
			>
				Betingelser
			</button>

			{/* Portal til body: menuens glaseffekt (backdrop-blur) ville ellers
			    holde det faste vindue fanget inde i menuen */}
			{open &&
				createPortal(
					<div
						className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 p-4"
						onClick={() => setOpen(false)}
					>
						<div
							role="dialog"
							aria-modal="true"
							aria-labelledby="ownership-title"
							onClick={(e) => e.stopPropagation()}
							className="border-foreground/[0.08] w-full max-w-md rounded-2xl border bg-white p-6 text-left shadow-xl"
						>
							<h2
								id="ownership-title"
								className="text-foreground text-base font-medium tracking-[-0.01em]"
							>
								Om dashboardet
							</h2>
							<div className="text-foreground/70 mt-3 space-y-3 text-sm leading-relaxed">
								<p>
									Dashboardet er et internt værktøj, som Horizen selv har udviklet.
									Det giver jer et samlet overblik over arbejdet med jeres
									hjemmeside og gør det samtidig lettere for os at planlægge og
									prioritere indsatsen sammen med jer.
								</p>
								<p>
									Vi lægger vægt på åbenhed i samarbejdet, og derfor er dashboardet
									en fast del af den service, I får hos Horizen.
								</p>
								<p>
									Når vi videreudvikler og forbedrer dashboardet, sker det på
									Horizens egen tid. Den tid bliver aldrig trukket fra jeres timer
									eller faktureret til jer.
								</p>
								<p>
									Skulle samarbejdet ophøre, overdrager vi hjemmesiden og alt andet
									end dashboardet til jer, da det tilhører jer. Dashboardet er
									Horizens software og følger derfor ikke med. Jeres data går ikke
									tabt: de er fortsat jeres og ligger hos Google, hvor I altid kan
									finde dem.
								</p>
							</div>
							<div className="mt-5 flex flex-wrap items-center justify-between gap-3">
								<a
									href="https://horizen.dk/handelsbetingelser"
									target="_blank"
									rel="noopener noreferrer"
									className="text-foreground text-sm font-medium underline underline-offset-2"
								>
									Læs handelsbetingelserne
								</a>
								<button
									type="button"
									onClick={() => setOpen(false)}
									className="bg-foreground text-background rounded-full px-4 py-2 text-sm font-medium transition-opacity hover:opacity-85"
								>
									Luk
								</button>
							</div>
						</div>
					</div>,
					document.body,
				)}
		</>
	)
}
