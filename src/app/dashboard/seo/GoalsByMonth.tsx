import type { GoalMonth, GoalStatus } from './data'
import DashboardTabs from './DashboardTabs'
import { LATER_META, STATUS_META } from './statusMeta'
import { ink, muted, withAlpha } from './_tokens'

/**
 * "Mål og resultater": pr. måned de mål, vi arbejdede hen imod, og hvad målingen
 * viste. Én måned ad gangen (faner). Statusfarverne er de samme som resten af dashboardet.
 * Gode resultater står med grønt, "før"-tallene i dæmpet grå, så forskellen springer i øjnene.
 */

/** Samme grønne som "Færdig" og ++markeringen++ i aktivitetsloggen. */
const GROEN = 'var(--st-done-text)'
/** "Før"-tal: dæmpet grå og overstreget. */
const FOER = {
	color: muted,
	textDecoration: 'line-through',
	textDecorationColor: withAlpha(ink, 0.25),
}

/** Tekst, hvor ++dobbelte plusser++ markerer et godt tal (vises grønt), som i aktivitetsloggen. */
function medGroent(text: string) {
	return text.split(/(\+\+.+?\+\+)/g).map((part, i) =>
		part.startsWith('++') && part.endsWith('++') ? (
			<strong key={i} className="font-medium" style={{ color: GROEN }}>
				{part.slice(2, -2)}
			</strong>
		) : (
			part
		),
	)
}

const GOAL_META: Record<
	GoalStatus,
	{ label: string; dot: string; bg: string; text: string; border: string }
> = {
	naaet: { ...STATUS_META.done, label: 'Nået' },
	'paa-vej': { ...STATUS_META.partial, label: 'På vej' },
	'ikke-naaet': { ...STATUS_META.missing, label: 'Ikke nået' },
	maales: { ...LATER_META, label: 'Måles' },
}

const MAANEDER = [
	'januar',
	'februar',
	'marts',
	'april',
	'maj',
	'juni',
	'juli',
	'august',
	'september',
	'oktober',
	'november',
	'december',
]

function maanedNavn(month: string) {
	const [aar, md] = month.split('-').map(Number)
	const navn = MAANEDER[md - 1]
	return `${navn[0].toUpperCase()}${navn.slice(1)} ${aar}`
}

function dato(iso: string) {
	const [, md, dag] = iso.split('-').map(Number)
	return `${dag}. ${MAANEDER[md - 1]}`
}

/** Én måned: mål, tal og andre fremskridt. */
function MonthCard({ m }: { m: GoalMonth }) {
	const line = withAlpha(ink, 0.08)
	const naaet = m.goals.filter((g) => g.status === 'naaet').length
	return (
		<section className="border-foreground/[0.08] rounded-3xl border bg-white p-5 md:p-8">
			<div className="flex flex-wrap items-end justify-between gap-3">
				<h3 className="text-foreground text-xl font-medium tracking-[-0.02em]">
					{maanedNavn(m.month)}
				</h3>
				<p className="text-sm" style={{ color: muted }}>
					{m.measuredAt
						? `${naaet} af ${m.goals.length} mål nået · målt ${dato(m.measuredAt)}`
						: `${m.goals.length} mål`}
				</p>
			</div>

			{m.keyNumbers && (
				<div className="mt-5 grid gap-3 sm:grid-cols-2">
					{m.keyNumbers.map((k) => (
						<div
							key={k.label}
							className="rounded-2xl px-4 py-3"
							style={{ backgroundColor: withAlpha(ink, 0.03) }}
						>
							<p
								className="text-xs tracking-[0.12em] uppercase"
								style={{ color: muted }}
							>
								{k.label} · 28 dage
							</p>
							<p
								className="mt-1 text-2xl font-medium tabular-nums"
								style={{ color: GROEN }}
							>
								{k.now}
								<span
									className="ml-2 text-sm font-normal"
									style={{ color: muted }}
								>
									før <span style={FOER}>{k.before}</span>
								</span>
							</p>
						</div>
					))}
				</div>
			)}

			<ul className="mt-5 divide-y" style={{ borderColor: line }}>
				{m.goals.map((g) => {
					const s = GOAL_META[g.status]
					return (
						<li
							key={g.title}
							className="py-4 first:pt-0 last:pb-0"
							style={{ borderColor: line }}
						>
							<div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between md:gap-6">
								<div className="min-w-0">
									<p className="text-foreground text-base font-medium">
										{g.title}
									</p>
									<p className="mt-0.5 text-sm" style={{ color: muted }}>
										{g.metric}
										{g.page && ` · ${g.page}`}
									</p>
								</div>
								<span
									className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full px-2.5 py-1 text-xs font-medium"
									style={{
										backgroundColor: s.bg,
										color: s.text,
										border: `1px solid ${s.border}`,
									}}
								>
									<span
										className="h-1.5 w-1.5 rounded-full"
										style={{ backgroundColor: s.dot }}
									/>
									{s.label}
								</span>
							</div>
							<dl className="mt-3 grid grid-cols-3 gap-3 text-sm">
								{(
									[
										['Før', g.before, { color: muted }],
										['Mål', g.goal, undefined],
										[
											'Resultat',
											g.result ?? '–',
											g.status === 'naaet'
												? { color: GROEN, fontWeight: 500 }
												: undefined,
										],
									] as const
								).map(([label, value, stil]) => (
									<div key={label}>
										<dt
											className="text-xs tracking-[0.12em] uppercase"
											style={{ color: muted }}
										>
											{label}
										</dt>
										<dd
											className="text-foreground mt-0.5 tabular-nums"
											style={stil}
										>
											{value}
										</dd>
									</div>
								))}
							</dl>
							{g.note && (
								<p
									className="mt-2 max-w-3xl text-sm leading-relaxed"
									style={{ color: muted }}
								>
									{medGroent(g.note)}
								</p>
							)}
						</li>
					)
				})}
			</ul>

			{m.progress && m.progress.length > 0 && (
				<div className="mt-8 border-t pt-6" style={{ borderColor: line }}>
					<p
						className="text-xs font-medium tracking-[0.14em] uppercase"
						style={{ color: muted }}
					>
						Andre fremskridt i {maanedNavn(m.month).split(' ')[0].toLowerCase()}
					</p>
					<p className="mt-1 text-sm" style={{ color: muted }}>
						Ikke sat som mål på forhånd, men målt før og efter.
					</p>
					<div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
						{m.progress.map((p) => (
							<div
								key={p.title}
								className="flex flex-col rounded-2xl p-4"
								style={{ backgroundColor: withAlpha(ink, 0.03) }}
							>
								<div className="flex items-start justify-between gap-3">
									<p className="text-foreground text-sm font-medium">
										{p.title}
									</p>
									{p.badge && (
										<span
											className="shrink-0 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap"
											style={{
												backgroundColor: GOAL_META.naaet.bg,
												color: GOAL_META.naaet.text,
												border: `1px solid ${GOAL_META.naaet.border}`,
											}}
										>
											{p.badge}
										</span>
									)}
								</div>
								<p
									className="mt-3 text-2xl font-medium tabular-nums"
									style={{ color: GROEN }}
								>
									{p.now}
									<span
										className="ml-2 text-sm font-normal"
										style={{ color: muted }}
									>
										før <span style={FOER}>{p.before}</span>
									</span>
								</p>
								{p.detail && (
									<p
										className="mt-2 text-sm leading-relaxed"
										style={{ color: muted }}
									>
										{medGroent(p.detail)}
									</p>
								)}
							</div>
						))}
					</div>
				</div>
			)}
		</section>
	)
}

/**
 * Én måned ad gangen: hver måned er en fane, nyeste åben. Uden mål vises en kort
 * forklaring (fanen vises kun for Horizen, indtil der er mål, se page.tsx).
 */
export default function GoalsByMonth({ months }: { months: GoalMonth[] }) {
	const nyesteFoerst = [...months].sort((a, b) =>
		b.month.localeCompare(a.month),
	)
	if (nyesteFoerst.length === 0)
		return (
			<p className="max-w-3xl text-sm leading-relaxed" style={{ color: muted }}>
				Ingen mål endnu. Når månedens mål er aftalt med kunden, skrives de ind i
				goalMonths i data.ts, og så vises fanen også for kunden.
			</p>
		)
	if (nyesteFoerst.length === 1) return <MonthCard m={nyesteFoerst[0]} />
	return (
		<DashboardTabs
			variant="pill"
			syncKey="maaned"
			defaultTab={nyesteFoerst[0].month}
			tabs={nyesteFoerst.map((m) => ({
				id: m.month,
				label: maanedNavn(m.month),
				content: <MonthCard m={m} />,
			}))}
		/>
	)
}
