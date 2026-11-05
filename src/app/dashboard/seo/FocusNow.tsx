import type { FocusItem } from './data'
import { accent, ink, muted, white, withAlpha } from './_tokens'

/**
 * "Fokus nu": de få næste skridt, der skal gøres snarest, højt oppe i Arbejdsrum.
 * Punkter, der haster, står først og er fremhævet. Klarede punkter (done) skjules,
 * og er der ingen åbne, vises sektionen ikke.
 */
export default function FocusNow({ items }: { items: FocusItem[] }) {
	const open = items.filter((i) => !i.done)
	if (open.length === 0) return null
	const sorted = [
		...open.filter((i) => i.urgent),
		...open.filter((i) => !i.urgent),
	]
	const urgentCount = open.filter((i) => i.urgent).length
	const line = withAlpha(ink, 0.08)

	return (
		<section className="h-full rounded-3xl border border-foreground/[0.08] bg-white p-5 md:p-8">
			<div className="flex flex-wrap items-end justify-between gap-3">
				<div>
					<span className="text-foreground/50 text-xs font-medium tracking-[0.2em] uppercase">
						Fokus nu
					</span>
					<h2
						className="text-foreground mt-2 text-2xl font-normal tracking-[-0.03em] md:text-[1.75rem]"
						style={{ lineHeight: 1.15 }}
					>
						Det skal vi have gjort snarest
					</h2>
				</div>
				<p className="text-sm" style={{ color: muted }}>
					{urgentCount > 0 && `${urgentCount} haster · `}
					{open.length} i alt
				</p>
			</div>

			<ol className="mt-6 divide-y" style={{ borderColor: line }}>
				{sorted.map((item, i) => (
					<li
						key={item.title}
						className="flex gap-4 py-4 first:pt-0 last:pb-0"
						style={{ borderColor: line }}
					>
						<span
							className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium tabular-nums"
							style={
								item.urgent
									? { backgroundColor: accent, color: white }
									: { backgroundColor: withAlpha(ink, 0.06), color: muted }
							}
						>
							{i + 1}
						</span>
						<div className="min-w-0 flex-1">
							<div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between md:gap-6">
								<p className="text-foreground text-base font-medium">
									{item.title}
								</p>
								<p className="shrink-0 text-xs md:pt-1 md:text-right">
									<span
										className="rounded-full px-2.5 py-1 font-medium"
										style={
											item.urgent
												? { backgroundColor: withAlpha(accent, 0.12), color: accent }
												: {
														backgroundColor: withAlpha(ink, 0.05),
														color: muted,
													}
										}
									>
										{item.when}
									</span>
									<span className="ml-2" style={{ color: muted }}>
										{item.who}
									</span>
								</p>
							</div>
							<p
								className="mt-1 max-w-3xl text-sm leading-relaxed"
								style={{ color: muted }}
							>
								{item.why}
							</p>
						</div>
					</li>
				))}
			</ol>
		</section>
	)
}
