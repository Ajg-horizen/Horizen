import BuyHours from './BuyHours'
import { hourDiscount, hourPackages, type InboxItem, type OrderStatus } from './data'

/**
 * Kun Horizen → Klippekort (Andreas 19/11-2026): saldoen og alle bestillinger af
 * timer. Bestillingen gemmes i Sanity, før mailene sendes, så den står her
 * med det samme, også hvis en mail ikke skulle komme frem. Horizen flytter
 * status i Studio: Bestilt → Faktura sendt → Betalt (= timerne er på kortet).
 */

const STEPS: { key: Exclude<OrderStatus, 'annulleret'>; label: string }[] = [
	{ key: 'bestilt', label: 'Bestilt' },
	{ key: 'faktureret', label: 'Faktura sendt' },
	{ key: 'betalt', label: 'På klippekortet' },
]

const STATUS_STYLE: Record<OrderStatus, { label: string; bg: string; text: string }> = {
	bestilt: { label: 'Bestilt', bg: 'color-mix(in srgb, var(--color-foreground) 6%, transparent)', text: 'var(--color-foreground)' },
	faktureret: { label: 'Faktura sendt', bg: 'var(--st-partial-bg)', text: 'var(--st-partial-text)' },
	betalt: { label: 'På klippekortet', bg: 'var(--st-done-bg)', text: 'var(--st-done-text)' },
	annulleret: { label: 'Annulleret', bg: 'var(--st-missing-bg)', text: 'var(--st-missing-text)' },
}

const kr = (n: number) => `${n.toLocaleString('da-DK', { maximumFractionDigits: 0 })} kr.`
const fmt = (n: number) => n.toLocaleString('da-DK', { maximumFractionDigits: 1 })
const when = (iso?: string) =>
	iso
		? new Date(iso).toLocaleString('da-DK', {
				timeZone: 'Europe/Copenhagen',
				day: 'numeric',
				month: 'long',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
			})
		: ''

export function orderStatusOf(o: InboxItem): OrderStatus {
	return o.orderStatus ?? 'bestilt'
}

/** Eksempler til lokal udvikling (dashboardet læser production, hvor der endnu ingen bestillinger er) */
export function exampleOrders(): InboxItem[] {
	const day = 864e5
	const price = (h: number) => Math.round(h * hourPackages.pricePerHour * (1 - hourDiscount(h)))
	const base = {
		status: 'sendt' as const,
		priority: 'hoej' as const,
		subject: 'Bestilling af timer til klippekortet',
		message: '',
		fromName: 'Eksempel',
	}
	return [
		{ ...base, _id: 'eksempel-1', orderHours: 10, orderPrice: price(10), orderStatus: 'bestilt', receivedAt: new Date(Date.now() - day * 0.1).toISOString() },
		{ ...base, _id: 'eksempel-2', orderHours: 20, orderPrice: price(20), orderStatus: 'faktureret', receivedAt: new Date(Date.now() - day * 6).toISOString() },
		{ ...base, _id: 'eksempel-3', orderHours: 5, orderPrice: price(5), orderStatus: 'betalt', receivedAt: new Date(Date.now() - day * 30).toISOString() },
	]
}

export default function KlippekortOrders({
	orders,
	balance,
	signedInAs,
	example = false,
}: {
	orders: InboxItem[]
	balance: { total: number; used: number; left: number }
	signedInAs?: string
	/** Viser eksempler (kun lokalt), tydeligt markeret */
	example?: boolean
}) {
	const waiting = orders.filter((o) => ['bestilt', 'faktureret'].includes(orderStatusOf(o)))
	const waitingHours = waiting.reduce((a, o) => a + (o.orderHours ?? 0), 0)
	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-6 rounded-3xl border border-foreground/[0.08] bg-white p-6 md:flex-row md:items-center md:justify-between">
				<div>
					<span className="text-[11px] font-medium tracking-[0.14em] text-foreground/55 uppercase">Klippekort</span>
					<p className="mt-2 text-3xl font-semibold tracking-tight text-foreground tabular-nums md:text-[2.5rem]">
						{fmt(balance.left)} <span className="text-lg font-normal text-foreground/60">{balance.left === 1 ? 'time' : 'timer'} tilbage</span>
					</p>
					<p className="mt-2 text-sm text-foreground/60">
						{balance.total > 0 ? `${fmt(balance.used)} af ${fmt(balance.total)} købte timer brugt.` : 'Der er ingen timer på klippekortet endnu.'}
						{waitingHours > 0 &&
							` ${fmt(waitingHours)} ${waitingHours === 1 ? 'time' : 'timer'} kommer på, når fakturaen er betalt.`}
					</p>
				</div>
				<div className="md:text-right">
					<BuyHours signedInAs={signedInAs} emphasis />
				</div>
			</div>

			<div className="rounded-3xl border border-foreground/[0.08] bg-white p-6">
				<span className="text-[11px] font-medium tracking-[0.14em] text-foreground/55 uppercase">Bestillinger</span>
				{example && (
					<p className="mt-2 text-xs text-foreground/55">
						Eksempel: vises kun lokalt, så du kan se, hvordan det ser ud. Rigtige bestillinger kommer fra production.
					</p>
				)}
				{orders.length === 0 ? (
					<p className="mt-3 text-sm text-foreground/60">
						Ingen bestillinger endnu. Når I køber timer, står bestillingen her med det samme, og I kan følge den, til timerne er på klippekortet.
					</p>
				) : (
					<ul className="mt-4 divide-y divide-foreground/[0.08]">
						{orders.map((o) => {
							const status = orderStatusOf(o)
							const style = STATUS_STYLE[status]
							const stepIndex = STEPS.findIndex((s) => s.key === status)
							const hours = o.orderHours ?? 0
							return (
								<li key={o._id} className="py-5 first:pt-2 last:pb-0">
									<div className="flex flex-wrap items-start justify-between gap-3">
										<div>
											<p className="text-base font-semibold text-foreground">
												{hours} {hours === 1 ? 'time' : 'timer'} til klippekortet
											</p>
											<p className="mt-0.5 text-sm text-foreground/60">
												{o.orderPrice != null && `${kr(o.orderPrice)} ekskl. moms · `}
												{when(o.receivedAt)}
												{o.fromName && ` · bestilt af ${o.fromName}`}
											</p>
										</div>
										<span
											className="inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold"
											style={{ backgroundColor: style.bg, color: style.text }}
										>
											{style.label}
										</span>
									</div>
									{status !== 'annulleret' && (
										<ol className="mt-4 grid grid-cols-3 gap-2" aria-label="Bestillingens forløb">
											{STEPS.map((s, i) => {
												const done = i <= stepIndex
												return (
													<li key={s.key} className="min-w-0">
														<span
															className="block h-1.5 rounded-full"
															style={{
																backgroundColor: done
																	? 'var(--st-done-text)'
																	: 'color-mix(in srgb, var(--color-foreground) 10%, transparent)',
															}}
														/>
														<span className={`mt-1.5 block truncate text-xs ${done ? 'font-medium text-foreground' : 'text-foreground/50'}`}>
															{s.label}
														</span>
													</li>
												)
											})}
										</ol>
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
