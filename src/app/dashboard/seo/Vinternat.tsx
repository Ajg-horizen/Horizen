'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Vinternat: sæsonlag på dashboardet i juletiden (1. november til
 * helligtrekonger). To <canvas>-lag:
 *
 *   Bagved (samme lag som horisonten i body::before, men ovenpå den):
 *   - Stjernehimmel, der blinker svagt, tættest øverst og tonet ud mod
 *     horisonten (kun mørk tilstand).
 *   - Et juletræ af lyspunkter med blødt skær, plantet på horisontens bue.
 *     Bag glaskortene bliver punkterne til slørede lys, som et træ set gennem
 *     en dugget rude.
 *
 *   Foran (over kortene, kan ikke klikkes på):
 *   - Let sne i tre dybder: langt væk (små, langsomme) til tæt på (større,
 *     bløde). Få fnug, så teksten altid kan læses.
 *
 *   Langs horisonten (bagved): julemandens slæde som silhuet med fem rensdyr
 *   i galop og Rudolf forrest. Den følger buen hen over planeten, kort efter
 *   start og derefter kun i pauser (mindst 3 minutter imellem, og først når
 *   ingen har rørt mus eller tastatur i 20 sekunder).
 *
 * Lys tilstand bruger samme scene uden stjerner og uden synlig horisont:
 * træet får mørkere grønne og gyldne lys, og slæden er en blød, blågrå
 * silhuet langt i baggrunden (samme bue, bare usynlig).
 *
 * Kan slås fra med snefnug-knappen i topbjælken (JulToggle i DashboardShell);
 * valget huskes i browseren.
 *
 * Tvang til test: ?jul=1 viser laget uden for juletiden, ?jul=0 skjuler det.
 * Ved "mindre bevægelse" tegnes ét stillbillede uden sne.
 */

/* 1. november til og med helligtrekonger (6. januar) */
function isJuletid(d: Date) {
	const m = d.getMonth()
	return m === 10 || m === 11 || (m === 0 && d.getDate() <= 6)
}

/* Horisontens bue (samme tal som :root[data-theme='dark'] body::before) */
function horizonY(x: number, w: number, h: number) {
	const r = 1.5 * Math.max(w, h)
	const cy = h + r - 0.18 * h
	const dx = x - w / 2
	return cy - Math.sqrt(Math.max(r * r - dx * dx, 0))
}

type Pt = { x: number; y: number }
type Star = { x: number; y: number; r: number; a: number; tw: number; ph: number }
type Light = Pt & { warm: boolean; ph: number; big: boolean }
type Flake = {
	x: number
	y: number
	r: number
	vy: number
	sway: number
	ph: number
	a: number
}

/*
 * Træets omrids i enheder af træets højde (0 = fod, 1 = top), x om midten:
 * fire etager, der hver stikker lidt ud og trækker sig ind igen.
 */
function treeOutline(): Pt[] {
	const tiers = [
		{ y: 0.12, w: 0.34 },
		{ y: 0.34, w: 0.28 },
		{ y: 0.54, w: 0.21 },
		{ y: 0.72, w: 0.13 },
	]
	const left = tiers.flatMap((t, i) => {
		const next = tiers[i + 1]?.y ?? 0.9
		return [
			{ x: -t.w, y: t.y },
			{ x: -t.w * 0.4, y: t.y + (next - t.y) * 0.18 },
		]
	})
	const right = [...left].reverse().map((p) => ({ x: -p.x, y: p.y }))
	return [{ x: -0.34 * 0.4, y: 0.12 }, ...left, { x: 0, y: 0.94 }, ...right, { x: 0.34 * 0.4, y: 0.12 }]
}

/* Lyspunkter langs omridset, ca. hver `step` i træets enheder */
function treeLights(outline: Pt[], step: number): Light[] {
	const out: Light[] = []
	let n = 0
	for (let i = 0; i < outline.length - 1; i++) {
		const a = outline[i]
		const b = outline[i + 1]
		const len = Math.hypot(b.x - a.x, b.y - a.y)
		const k = Math.max(1, Math.round(len / step))
		for (let j = 0; j < k; j++) {
			const t = j / k
			out.push({
				x: a.x + (b.x - a.x) * t,
				y: a.y + (b.y - a.y) * t,
				big: j === 0,
				warm: n % 4 === 1,
				ph: n * 1.37,
			})
			n++
		}
	}
	return out
}

/*
 * Julemandens slæde som silhuet, vendt mod højre. Tegnes i egne enheder
 * (ca. 250 bred) med slædens bagende i 0,0; kalderen flytter og skalerer.
 * `p` er galoppens fase, så benene og hovederne bevæger sig.
 */
const DEER = [62, 102, 142, 182, 222]

function drawReindeer(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	p: number,
) {
	ctx.save()
	ctx.translate(x, y + Math.sin(p * 2) * 1.2)
	// Krop og hals
	ctx.beginPath()
	ctx.ellipse(0, 0, 13, 5.5, -0.06, 0, Math.PI * 2)
	ctx.moveTo(8, -3)
	ctx.lineTo(15, -12)
	ctx.lineTo(19, -10)
	ctx.lineTo(13, 1)
	ctx.closePath()
	// Hoved og hale
	ctx.ellipse(20, -12, 5, 2.8, 0.25, 0, Math.PI * 2)
	ctx.moveTo(-12, -3)
	ctx.lineTo(-17, -6)
	ctx.lineTo(-13, -0.5)
	ctx.fill()

	// Ben: to led hver, i galop (forben og bagben i modfase)
	ctx.beginPath()
	for (const [lx, off] of [
		[9, 0],
		[6, 0.6],
		[-8, Math.PI],
		[-11, Math.PI + 0.6],
	]) {
		const a = Math.sin(p + off) * 0.7
		const kx = lx + Math.sin(a) * 6
		const ky = 3 + Math.cos(a) * 6
		const b = a + (lx > 0 ? -0.8 : 0.8) * (0.5 + 0.5 * Math.sin(p + off))
		ctx.moveTo(lx, 3)
		ctx.lineTo(kx, ky)
		ctx.lineTo(kx + Math.sin(b) * 6, ky + Math.cos(b) * 6)
	}
	// Gevir
	ctx.moveTo(17, -14)
	ctx.lineTo(14, -23)
	ctx.moveTo(15.2, -19.5)
	ctx.lineTo(10, -22)
	ctx.moveTo(14.4, -21.5)
	ctx.lineTo(17.5, -26)
	ctx.moveTo(19, -14)
	ctx.lineTo(20, -22)
	ctx.moveTo(19.6, -19)
	ctx.lineTo(24, -21)
	ctx.stroke()
	ctx.restore()
}

function drawSleigh(ctx: CanvasRenderingContext2D) {
	// Mederen, der krøller op foran
	ctx.beginPath()
	ctx.moveTo(-26, 13)
	ctx.lineTo(22, 13)
	ctx.quadraticCurveTo(32, 13, 31, 5)
	ctx.quadraticCurveTo(30, 1, 27, 3)
	ctx.moveTo(-14, 7)
	ctx.lineTo(-14, 13)
	ctx.moveTo(10, 7)
	ctx.lineTo(10, 13)
	ctx.stroke()

	ctx.beginPath()
	// Kassen med høj, buet ryg
	ctx.moveTo(-30, -16)
	ctx.quadraticCurveTo(-24, -14, -24, -6)
	ctx.lineTo(-22, 8)
	ctx.lineTo(16, 8)
	ctx.quadraticCurveTo(24, 6, 24, -4)
	ctx.lineTo(10, -4)
	ctx.lineTo(4, 0)
	ctx.lineTo(-20, 0)
	ctx.lineTo(-20, -8)
	ctx.quadraticCurveTo(-24, -18, -30, -16)
	// Sækken
	ctx.moveTo(-14, -6)
	ctx.arc(-20, -10, 8, 0, Math.PI * 2)
	// Julemanden: krop, hoved, hue med kvast
	ctx.moveTo(4, -9)
	ctx.arc(-4, -9, 8, 0, Math.PI * 2)
	ctx.moveTo(4, -20)
	ctx.arc(-0.5, -20, 4.6, 0, Math.PI * 2)
	ctx.moveTo(-5, -23)
	ctx.quadraticCurveTo(-2, -32, -9, -30)
	ctx.lineTo(4, -23)
	ctx.closePath()
	ctx.moveTo(-8, -30)
	ctx.arc(-10, -30, 2, 0, Math.PI * 2)
	ctx.fill()
}

function drawSanta(
	ctx: CanvasRenderingContext2D,
	p: number,
	rgb: string,
	a: number,
	dark: boolean,
) {
	ctx.fillStyle = `rgb(${rgb} / ${a})`
	ctx.strokeStyle = `rgb(${rgb} / ${a})`
	ctx.lineCap = 'round'
	ctx.lineJoin = 'round'

	// Tømmen: fra julemandens hænder gennem alle rensdyrene
	const deerY = (i: number) => -4 + Math.sin(p * 0.5 - i * 0.7) * 2.5
	ctx.lineWidth = 0.8
	ctx.beginPath()
	ctx.moveTo(4, -11)
	DEER.forEach((x, i) => ctx.lineTo(x + 4, deerY(i) - 3))
	ctx.stroke()

	ctx.lineWidth = 2
	DEER.forEach((x, i) => drawReindeer(ctx, x, deerY(i), p - i * 0.9))
	drawSleigh(ctx)

	// Rudolf forrest: en lille rød mule, der lyser
	const last = DEER.length - 1
	const nx = DEER[last] + 25
	const ny = deerY(last) - 11 + Math.sin((p - last * 0.9) * 2) * 1.2
	const g = ctx.createRadialGradient(nx, ny, 0, nx, ny, 9)
	g.addColorStop(0, `rgb(255 70 60 / ${dark ? 0.45 : 0.2})`)
	g.addColorStop(1, 'rgb(255 70 60 / 0)')
	ctx.fillStyle = g
	ctx.beginPath()
	ctx.arc(nx, ny, 9, 0, Math.PI * 2)
	ctx.fill()
	ctx.fillStyle = `rgb(255 90 80 / ${dark ? 1 : 0.45})`
	ctx.beginPath()
	ctx.arc(nx, ny, 1.6, 0, Math.PI * 2)
	ctx.fill()
}

/*
 * Brugerens eget valg ("Slå juleeffekter fra" i topbjælken), husket pr.
 * browser. Uden adgang til localStorage huskes valget kun, til siden lukkes.
 */
const JUL_STORE = 'dash-jul'
const JUL_EVENT = 'dash-jul-change'
let julOffMemory = false

function readJulOff() {
	try {
		return localStorage.getItem(JUL_STORE) === 'off'
	} catch {
		return julOffMemory
	}
}

/**
 * Juletid og brugerens valg. `season`: er det juletid (følger ?jul=1 / ?jul=0,
 * så laget kan testes hele året). `on`: juletid, og brugeren har ikke slået
 * effekterne fra. `set` skifter valget for alle komponenter på siden.
 */
export function useJul() {
	const [season, setSeason] = useState(false)
	const [off, setOff] = useState(false)
	useEffect(() => {
		const q = new URLSearchParams(window.location.search).get('jul')
		setSeason(q === '1' ? true : q === '0' ? false : isJuletid(new Date()))
		const read = () => setOff(readJulOff())
		read()
		window.addEventListener(JUL_EVENT, read)
		return () => window.removeEventListener(JUL_EVENT, read)
	}, [])
	function set(on: boolean) {
		julOffMemory = !on
		try {
			if (on) localStorage.removeItem(JUL_STORE)
			else localStorage.setItem(JUL_STORE, 'off')
		} catch {}
		window.dispatchEvent(new Event(JUL_EVENT))
	}
	return { season, on: season && !off, set }
}

export default function Vinternat() {
	const backRef = useRef<HTMLCanvasElement>(null)
	const frontRef = useRef<HTMLCanvasElement>(null)
	const { on } = useJul()

	useEffect(() => {
		if (!on) return
		const back = backRef.current?.getContext('2d')
		const front = frontRef.current?.getContext('2d')
		if (!back || !front) return

		const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
		const outline = treeOutline()
		const lights = treeLights(outline, 0.045)
		let w = 0
		let h = 0
		let stars: Star[] = []
		let flakes: Flake[] = []
		let raf = 0
		// Slæden: første tur kort efter start. Derefter kun i pauser: når der
		// er gået mindst 3 minutter siden sidste tur, og ingen har rørt mus,
		// tastatur eller skærm i 20 sekunder.
		let sleighAt = performance.now() / 1000 + 4
		const SLEIGH_SECONDS = 15
		const SLEIGH_GAP = 180
		const SLEIGH_IDLE = 20
		let sleighEarliest = Infinity
		let lastInput = performance.now() / 1000
		const onInput = () => (lastInput = performance.now() / 1000)
		const INPUTS = ['pointermove', 'pointerdown', 'keydown', 'wheel', 'touchstart']
		let dust: { x: number; y: number; a: number; vy: number }[] = []

		const rand = (a: number, b: number) => a + Math.random() * (b - a)

		function makeFlake(top: boolean): Flake {
			// Dybde 0 (langt væk) til 1 (tæt på); de fleste ligger langt væk
			const z = Math.random() ** 2.4
			return {
				x: rand(0, w),
				y: top ? rand(-40, -4) : rand(0, h),
				r: 0.7 + z * 2.4,
				vy: 14 + z * 36,
				sway: 6 + z * 20,
				ph: rand(0, Math.PI * 2),
				a: 0.22 + z * 0.4,
			}
		}

		function resize() {
			const dpr = Math.min(window.devicePixelRatio || 1, 2)
			w = window.innerWidth
			h = window.innerHeight
			for (const ctx of [back!, front!]) {
				ctx.canvas.width = w * dpr
				ctx.canvas.height = h * dpr
				ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
			}

			stars = Array.from({ length: Math.round((w * h) / 5200) }, () => {
				const x = rand(0, w)
				return {
					x,
					// Flere stjerner højt oppe
					y: Math.random() ** 1.6 * horizonY(x, w, h),
					r: Math.random() < 0.06 ? rand(0.9, 1.4) : rand(0.25, 0.8),
					a: rand(0.25, 0.85),
					tw: rand(0.4, 1.6),
					ph: rand(0, Math.PI * 2),
				}
			})
			// Lys tilstand har ca. 40 % flere fnug end mørk (se frame)
			flakes = Array.from(
				{ length: Math.min(Math.round((w * h) / 10000), 155) },
				() => makeFlake(false),
			)
		}

		function glow(
			ctx: CanvasRenderingContext2D,
			x: number,
			y: number,
			r: number,
			rgb: string,
			a: number,
		) {
			const g = ctx.createRadialGradient(x, y, 0, x, y, r)
			g.addColorStop(0, `rgb(${rgb} / ${a})`)
			g.addColorStop(1, `rgb(${rgb} / 0)`)
			ctx.fillStyle = g
			ctx.beginPath()
			ctx.arc(x, y, r, 0, Math.PI * 2)
			ctx.fill()
		}

		function drawTree(t: number, dark: boolean) {
			const ctx = back!
			const size = Math.min(Math.max(h * 0.62, 300), 680)
			// Helt ude til højre: træets bredeste etage slutter 20 px fra kanten
			const cx = w - 0.34 * size - 20
			const foot = horizonY(cx, w, h) + 4
			const px = (p: Pt) => cx + p.x * size
			const py = (p: Pt) => foot - p.y * size
			const cool = dark ? '220 255 240' : '4 120 87'
			const warm = dark ? '255 214 160' : '194 110 12'

			// Tynde streger mellem lysene (ses kun uden for kortene)
			ctx.lineWidth = 1
			ctx.strokeStyle = `rgb(${cool} / ${dark ? 0.14 : 0.2})`
			ctx.beginPath()
			outline.forEach((p, i) =>
				i ? ctx.lineTo(px(p), py(p)) : ctx.moveTo(px(p), py(p)),
			)
			ctx.stroke()

			// Lysene: blødt skær, der overlever glassets blur, og en skarp kerne
			for (const l of lights) {
				const a = 0.55 + 0.45 * Math.sin(t * 0.8 + l.ph)
				const rgb = l.warm ? warm : cool
				// Bredt skær: bliver til et blødt lys bag glaskortene
				glow(ctx, px(l), py(l), 34, rgb, (dark ? 0.16 : 0.1) * a)
				glow(ctx, px(l), py(l), l.big ? 12 : 8, rgb, (dark ? 0.5 : 0.3) * a)
				ctx.fillStyle = `rgb(${rgb} / ${(dark ? 0.9 : 0.7) * a})`
				ctx.beginPath()
				ctx.arc(px(l), py(l), l.big ? 1.8 : 1.2, 0, Math.PI * 2)
				ctx.fill()
			}

			// Toppen: en klarere stjerne med fire stråler
			const tx = px({ x: 0, y: 0.94 })
			const ty = py({ x: 0, y: 0.94 }) - size * 0.045
			const pulse = 0.85 + 0.15 * Math.sin(t * 0.6)
			glow(ctx, tx, ty, 70, warm, (dark ? 0.4 : 0.22) * pulse)
			ctx.strokeStyle = `rgb(${dark ? '255 240 220' : warm} / ${0.55 * pulse})`
			ctx.lineWidth = 0.9
			ctx.beginPath()
			ctx.moveTo(tx - 14, ty)
			ctx.lineTo(tx + 14, ty)
			ctx.moveTo(tx, ty - 20)
			ctx.lineTo(tx, ty + 20)
			ctx.stroke()
			ctx.fillStyle = `rgb(${dark ? '255 248 235' : warm} / ${pulse})`
			ctx.beginPath()
			ctx.arc(tx, ty, 2.2, 0, Math.PI * 2)
			ctx.fill()
		}

		/*
		 * Slæden flyver fra venstre mod højre langs horisonten: lige over buens
		 * lysende kant og drejet efter kurven, så den ses i modlys. Den drysser
		 * lidt guldstøv efter sig og ligger bag kortene, så den aldrig dækker tekst.
		 */
		function drawFlight(t: number, dt: number, dark: boolean) {
			const ctx = back!
			if (t >= sleighEarliest && t - lastInput >= SLEIGH_IDLE) {
				sleighAt = t
				sleighEarliest = Infinity
			}
			const k = (t - sleighAt) / SLEIGH_SECONDS
			const scale = w < 768 ? 0.6 : 0.85
			const span = 260 * scale
			if (k >= 0 && k <= 1) {
				const x = -span + k * (w + span * 2)
				// Medernes underkant (13 i slædens enheder) svæver 16 px over kanten
				const y = horizonY(x, w, h) - 16 - 13 * scale
				// Drejet efter buens hældning midt på toget
				const mid = x + 125 * scale - w / 2
				const r = 1.5 * Math.max(w, h)
				const tilt = Math.atan(mid / Math.sqrt(Math.max(r * r - mid * mid, 1)))
				const p = t * 9
				// Mørk tilstand: sort silhuet i modlys mod horisontens glød. Lys
				// tilstand: blød, blågrå silhuet, så den ligger langt i baggrunden.
				const rgb = dark ? '3 4 5' : '70 86 104'
				const a = Math.min(1, k * 8, (1 - k) * 8) * (dark ? 0.95 : 0.3)
				ctx.save()
				ctx.translate(x, y)
				ctx.rotate(tilt)
				ctx.scale(scale, scale)
				if (!dark) ctx.filter = 'blur(0.8px)'
				drawSanta(ctx, p, rgb, a, dark)
				ctx.restore()
				if (Math.random() < 0.6)
					dust.push({ x: x - 22 * scale, y: y + 12 * scale, a: 0.8, vy: rand(4, 14) })
			} else if (k > 1 && dust.length === 0) {
				// Turen er slut: vent på næste pause
				sleighAt = Infinity
				sleighEarliest = t + SLEIGH_GAP
			}

			const gold = dark ? '255 220 160' : '217 119 6'
			dust = dust.filter((d) => (d.a -= dt * 0.55) > 0)
			for (const d of dust) {
				d.y += d.vy * dt
				ctx.fillStyle = `rgb(${gold} / ${d.a * (dark ? 0.35 : 0.25)})`
				ctx.beginPath()
				ctx.arc(d.x, d.y, 0.9, 0, Math.PI * 2)
				ctx.fill()
			}
		}

		let last = performance.now()
		function frame(now: number) {
			const dt = Math.min((now - last) / 1000, 0.05)
			last = now
			const t = now / 1000
			const dark = document.documentElement.dataset.theme !== 'light'

			back!.clearRect(0, 0, w, h)
			if (dark) {
				for (const s of stars) {
					const a = s.a * (0.65 + 0.35 * Math.sin(t * s.tw + s.ph))
					back!.fillStyle = `rgb(236 242 255 / ${a})`
					back!.beginPath()
					back!.arc(s.x, s.y, s.r, 0, Math.PI * 2)
					back!.fill()
				}
			}
			drawTree(t, dark)
			if (!still) drawFlight(t, dt, dark)

			front!.clearRect(0, 0, w, h)
			if (still) return
			const flakeRgb = dark ? '255 255 255' : '120 145 180'
			const count = dark ? Math.round(flakes.length / 1.4) : flakes.length
			for (const f of flakes.slice(0, count)) {
				f.y += f.vy * dt
				f.x += Math.sin(t * 0.5 + f.ph) * f.sway * dt
				if (f.y > h + 10) Object.assign(f, makeFlake(true))
				// Tones ud i den nederste femtedel, så sneen ikke hober sig op
				const fade = Math.max(0, Math.min(1, (h - f.y) / (h * 0.2)))
				const a = f.a * fade * (dark ? 1 : 0.8)
				if (f.r > 1.8) glow(front!, f.x, f.y, f.r * 1.7, flakeRgb, a)
				else {
					front!.fillStyle = `rgb(${flakeRgb} / ${a})`
					front!.beginPath()
					front!.arc(f.x, f.y, f.r, 0, Math.PI * 2)
					front!.fill()
				}
			}
			raf = requestAnimationFrame(frame)
		}

		resize()
		window.addEventListener('resize', resize)
		for (const e of INPUTS)
			window.addEventListener(e, onInput, { passive: true })
		raf = requestAnimationFrame(frame)
		// Stillbilledet tegnes igen ved ny størrelse og ved skift af lys/mørk
		const redraw = () => requestAnimationFrame(frame)
		const mo = still ? new MutationObserver(redraw) : null
		mo?.observe(document.documentElement, { attributeFilter: ['data-theme'] })
		if (still) window.addEventListener('resize', redraw)

		return () => {
			cancelAnimationFrame(raf)
			window.removeEventListener('resize', resize)
			window.removeEventListener('resize', redraw)
			for (const e of INPUTS) window.removeEventListener(e, onInput)
			mo?.disconnect()
		}
	}, [on])

	if (!on) return null
	return (
		<>
			<canvas
				ref={backRef}
				aria-hidden
				className="pointer-events-none fixed inset-0 h-screen w-screen"
				// Samme lag som horisonten (body::before), men tegnet ovenpå den
				style={{ zIndex: -1 }}
			/>
			<canvas
				ref={frontRef}
				aria-hidden
				// Over kortene, under menuskuffen på mobil (z-50)
				className="pointer-events-none fixed inset-0 z-40 h-screen w-screen"
			/>
		</>
	)
}
