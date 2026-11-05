import FoldSection from './FoldSection'
import {
	setupIntro,
	setupSections,
	type SetupAutoKey,
	type SetupItem,
} from './setup'

/**
 * Fanen "Opsætning": tjeklisten fra setup.ts med status pr. punkt.
 *   - grøn: tjekket automatisk (auto = true) eller krydset af i data.ts → setupChecked
 *   - rød: et automatisk tjek, der fejler
 *   - grå: mangler at blive krydset af
 */

const GREEN = 'var(--st-done-dot)'
const RED = 'var(--st-missing-dot)'
const GREY = '#a3a3a3'

type State = 'auto' | 'checked' | 'failed' | 'open'

function stateOf(
	item: SetupItem,
	auto: Partial<Record<SetupAutoKey, boolean>>,
	checked: Record<string, string>,
): State {
	if (item.auto && auto[item.auto]) return 'auto'
	if (checked[item.id]) return 'checked'
	if (item.auto && auto[item.auto] === false) return 'failed'
	return 'open'
}

const isDone = (s: State) => s === 'auto' || s === 'checked'

function formatDate(iso: string) {
	const d = new Date(`${iso}T12:00:00`)
	return Number.isNaN(d.getTime())
		? iso
		: d.toLocaleDateString('da-DK', {
				day: 'numeric',
				month: 'short',
				year: 'numeric',
			})
}

export function setupProgress(
	auto: Partial<Record<SetupAutoKey, boolean>>,
	checked: Record<string, string>,
) {
	const items = setupSections.flatMap((s) => s.items).filter((i) => !i.optional)
	return {
		done: items.filter((i) => isDone(stateOf(i, auto, checked))).length,
		total: items.length,
	}
}

export default function SetupTab({
	auto,
	checked,
}: {
	auto: Partial<Record<SetupAutoKey, boolean>>
	checked: Record<string, string>
}) {
	const { done, total } = setupProgress(auto, checked)
	const pct = total ? Math.round((done / total) * 100) : 0

	return (
		<div className="space-y-8">
			<div>
				<span className="text-muted text-xs font-medium tracking-[0.2em] uppercase">
					Opsætning
				</span>
				<h2 className="text-foreground mt-2 text-2xl font-medium tracking-[-0.02em] md:text-[1.75rem]">
					Opsætningsgennemgang
				</h2>
				<p className="text-muted mt-3 max-w-3xl text-sm leading-relaxed">
					{setupIntro}
				</p>
			</div>

			<div className="border-foreground/[0.08] rounded-2xl border bg-white p-6">
				<div className="flex flex-wrap items-baseline justify-between gap-2">
					<span className="text-foreground text-sm font-medium">
						{done} af {total} punkter klar
					</span>
					<span className="text-muted text-xs">
						Valgfrie punkter tæller ikke med
					</span>
				</div>
				<div className="bg-foreground/[0.08] mt-3 h-2.5 w-full overflow-hidden rounded-full">
					<div
						className="h-full rounded-full"
						style={{ width: `${pct}%`, backgroundColor: GREEN }}
					/>
				</div>
				<div className="text-muted mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs">
					<Legend color={GREEN}>Klar (automatisk eller krydset af)</Legend>
					<Legend color={RED}>Automatisk tjek fejler</Legend>
					<Legend color={GREY}>Skal tjekkes og krydses af i data.ts</Legend>
				</div>
			</div>

			<div className="space-y-4">
				{setupSections.map((section) => {
					const states = section.items.map((i) => stateOf(i, auto, checked))
					const required = section.items.filter((i) => !i.optional)
					const reqDone = section.items.filter(
						(i, n) => !i.optional && isDone(states[n]),
					).length
					const failed = states.filter((s) => s === 'failed').length
					return (
						<FoldSection
							key={section.title}
							title={section.title}
							summary={
								required.length
									? `${reqDone} af ${required.length} klar${failed ? ` · ${failed} fejler` : ''}`
									: 'Kun relevant for nogle kunder'
							}
						>
							{section.intro && (
								<p className="text-muted mb-4 max-w-3xl text-sm leading-relaxed">
									{section.intro}
								</p>
							)}
							<ul className="divide-foreground/[0.06] border-foreground/[0.08] divide-y rounded-2xl border bg-white">
								{section.items.map((item, n) => (
									<SetupRow
										key={item.id}
										item={item}
										state={states[n]}
										checkedAt={checked[item.id]}
									/>
								))}
							</ul>
						</FoldSection>
					)
				})}
			</div>
		</div>
	)
}

function Legend({
	color,
	children,
}: {
	color: string
	children: React.ReactNode
}) {
	return (
		<span className="inline-flex items-center gap-1.5">
			<span
				className="h-2 w-2 rounded-full"
				style={{ backgroundColor: color }}
			/>
			{children}
		</span>
	)
}

function SetupRow({
	item,
	state,
	checkedAt,
}: {
	item: SetupItem
	state: State
	checkedAt?: string
}) {
	const color = state === 'failed' ? RED : isDone(state) ? GREEN : GREY
	const badge =
		state === 'auto'
			? 'Tjekket automatisk'
			: state === 'checked'
				? `Krydset af ${formatDate(checkedAt!)}`
				: state === 'failed'
					? 'Mangler'
					: 'Ikke krydset af'
	return (
		<li className="flex gap-4 p-5">
			<span
				className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
				style={{ backgroundColor: color }}
				aria-hidden
			/>
			<div className="min-w-0 flex-1">
				<div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
					<span className="text-foreground text-base font-medium">
						{item.title}
						{item.optional && (
							<span className="text-muted ml-2 text-xs font-normal">
								valgfri
							</span>
						)}
					</span>
					<span className="text-xs font-medium" style={{ color }}>
						{badge}
					</span>
				</div>
				<p className="text-muted mt-1.5 text-sm leading-relaxed">{item.how}</p>
				<p className="text-muted mt-1.5 text-xs leading-relaxed">
					<span className="text-foreground font-medium">Kontrol:</span>{' '}
					{item.check}
				</p>
				<p className="text-foreground/40 mt-1 text-[11px]">id: {item.id}</p>
			</div>
		</li>
	)
}
