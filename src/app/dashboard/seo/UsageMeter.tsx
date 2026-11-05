'use client'

import { useEffect, useState } from 'react'

/**
 * Rund måler for månedens timer, vist som timer TILBAGE: ringen er helt fuld
 * og grøn ved månedens start og tømmes for hver time, der bruges, ned til 0.
 * Tallet i midten er timer tilbage. Når siden vises, starter ringen fuld og
 * tæller ned til det aktuelle tal. Farven følger hvor meget der er tilbage:
 * grøn, så gul og rød, når rammen næsten er brugt. Er rammen overskredet,
 * er ringen tom og sporet rødt.
 *
 * Respekterer prefers-reduced-motion: så vises det færdige tal med det samme.
 */

/** Farver efter hvor stor en del af rammen der er brugt (0 = intet brugt, 1 = alt brugt) */
const STOPS: [number, [number, number, number]][] = [
	[0, [52, 211, 153]], // grøn
	[0.5, [163, 230, 53]], // limegrøn
	[0.75, [251, 191, 36]], // gul
	[1, [248, 113, 113]], // rød
]

function colorAt(p: number) {
	const t = Math.min(1, Math.max(0, p))
	for (let i = 1; i < STOPS.length; i++) {
		const [p1, c1] = STOPS[i]
		const [p0, c0] = STOPS[i - 1]
		if (t <= p1) {
			const k = (t - p0) / (p1 - p0 || 1)
			const c = c0.map((v, j) => Math.round(v + (c1[j] - v) * k))
			return `rgb(${c.join(' ')})`
		}
	}
	return `rgb(${STOPS.at(-1)![1].join(' ')})`
}

const fmt = (n: number) =>
	n.toLocaleString('da-DK', { maximumFractionDigits: 1 })

export default function UsageMeter({
	used,
	total,
}: {
	used: number
	total: number
}) {
	const left = Math.max(0, total - used)
	// Andel af rammen, der er tilbage (1 = fuld ring)
	const target = total > 0 ? left / total : 0
	const [value, setValue] = useState(total)
	const [progress, setProgress] = useState(1)

	useEffect(() => {
		const reduced = window.matchMedia?.(
			'(prefers-reduced-motion: reduce)',
		).matches
		if (reduced) {
			setValue(left)
			setProgress(target)
			return
		}
		// Starter fuld og tæller ned til det, der er tilbage
		const duration = 1300
		let start = 0
		let raf = 0
		const step = (now: number) => {
			if (!start) start = now
			const t = Math.min(1, (now - start) / duration)
			const e = 1 - Math.pow(1 - t, 3) // blød opbremsning
			setValue(total - (total - left) * e)
			setProgress(1 - (1 - target) * e)
			if (t < 1) raf = requestAnimationFrame(step)
		}
		raf = requestAnimationFrame(step)
		return () => cancelAnimationFrame(raf)
	}, [left, total, target])

	// Hele timer under nedtællingen, det præcise tal til sidst
	const shown = value === left ? fmt(left) : fmt(Math.ceil(value))
	const ring =
		'radial-gradient(farthest-side, transparent calc(100% - 14px), #000 calc(100% - 13px))'
	const over = used > total
	// Farve efter hvor meget der er brugt: grøn → gul → rød
	const current = colorAt(1 - progress)

	return (
		<div className="relative mx-auto my-6 h-[200px] w-[200px]">
			{/* Spor (rødt, når rammen er overskredet) */}
			<div
				aria-hidden
				className="absolute inset-0 rounded-full"
				style={{
					background: over
						? 'color-mix(in srgb, rgb(248 113 113) 35%, transparent)'
						: 'color-mix(in srgb, var(--color-foreground) 8%, transparent)',
					maskImage: ring,
					WebkitMaskImage: ring,
				}}
			/>
			{/* Fyld: timer tilbage, vist op til `progress` */}
			<div
				aria-hidden
				className="absolute inset-0 rounded-full"
				style={{
					background: current,
					maskImage: `${ring}, conic-gradient(#000 ${progress}turn, transparent 0)`,
					WebkitMaskImage: `${ring}, conic-gradient(#000 ${progress}turn, transparent 0)`,
					maskComposite: 'intersect',
					WebkitMaskComposite: 'source-in',
					filter: `drop-shadow(0 0 10px color-mix(in srgb, ${current} 45%, transparent))`,
				}}
			/>
			<div className="absolute inset-0 flex flex-col items-center justify-center">
				<span className="text-foreground text-[2.5rem] font-semibold tracking-tight tabular-nums">
					{shown}
				</span>
				<span className="text-foreground/55 mt-1 text-xs">
					timer tilbage af {fmt(total)}
				</span>
			</div>
		</div>
	)
}
