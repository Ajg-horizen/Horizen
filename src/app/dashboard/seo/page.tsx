import { Fragment, cloneElement, isValidElement, type ReactNode } from 'react'
import type { Metadata } from 'next'
import { groq } from 'next-sanity'
import { client } from '@/sanity/lib/client'
import { headers } from 'next/headers'
import {
	DASHBOARD_EMAIL_HEADER,
	DASHBOARD_NAME_HEADER,
	DASHBOARD_USER_HEADER,
} from '@/lib/dashboard-user'
import DashboardTabs from './DashboardTabs'
import PagesTabs from './PagesTabs'
import NewTaskButton from './NewTaskButton'
import OpgaverPanel from './OpgaverPanel'
import UsageMeter from './UsageMeter'
import DashboardShell, { type ShellItem } from './DashboardShell'
import ActivityByMonth, { ActivityKindTag } from './ActivityByMonth'
import TabLink from './TabLink'
import QuestionAnswer, { type SavedAnswer } from './QuestionAnswer'
import QuestionNotice from './QuestionNotice'
import { Resend } from 'resend'
import MessagesTab, { type SentMessage } from './MessagesTab'
import { senderProfile } from './messageText'
import { NOTICE_STATE_QUERY, pendingQuestions, type NoticeState } from './noticeMail'
import SeoCheckStatus, { type SeoCheckRun } from './SeoCheckStatus'
import TechniquesTab from './TechniquesTab'
import SeoMapTab from './SeoMapTab'
import FocusNow from './FocusNow'
import GoalsByMonth from './GoalsByMonth'
import ServiceCatalog from './ServiceCatalog'
import { ActionList, TechnicalList } from './WorkLists'
import ToolsTab from './ToolsTab'
import FoldSection from './FoldSection'
import SearchTrendChart from './SearchTrendChart'
import { getSearchTrend, type SearchTrend } from './searchTrend'
import {
	AiVisitsSection,
	LeadsSection,
	NoLeadsYet,
	SiteEventsUnreadable,
	type AiVisit,
	type LeadEvent,
} from './SiteEventsSections'
import VisitsTab from './VisitsTab'
import { getVisits } from '@/lib/visits'
import { LATER_META, STATUS_META } from './statusMeta'
import SetupTab, { setupProgress } from './SetupTab'
import HealthCheck from './HealthCheck'
import { OPTIMIZE_SUBJECT, type HealthEntry } from './helbred/types'
import { exampleHistory } from './helbred/example'
import type { SetupAutoKey } from './setup'
import {
	actionItems,
	clientQuestions,
	clientMessageDefaults,
	questionKey,
	focusItems,
	goalMonths,
	healthCheckCustomerCanRun,
	healthOptimizeHours,
	addonIntro,
	addonServices,
	analyticsNote,
	buildPages,
	buildTiers,
	driftIntro,
	keywordNotes,
	lastUpdated,
	launchIntro,
	launchPlan,
	monthlyDevelopment,
	monthlyExtra,
	monthlyUsage,
	pages,
	pastAdhocActivity,
	recentActivity,
	recurringTasks,
	retainerHours,
	setupChecked,
	roadmap,
	searchConsoleTips,
	seoMap,
	seoMapIntro,
	seoTechniques,
	seoTools,
	siteMetrics,
	technicalItems,
	upcomingPagesNote,
	type ActivityEntry,
	type AddonDiscipline,
	type AddonScope,
	type AddonService,
	type BuildPage,
	type BuildPriority,
	type DriftCadence,
	type DriftDiscipline,
	type ImpactLevel,
	type InboxItem,
	type LaunchPhase,
	type LaunchStep,
	type PageDetail,
	type RecurringTask,
	type SearchQuery,
	type SeoSnapshot,
	type SeoStatus,
} from './data'

// Internt værktøj — hold det ude af søgning (robots.ts disallow'er også /dashboard).
export const metadata: Metadata = {
	title: 'SEO-overblik · Horizen',
	robots: { index: false, follow: false },
}

// Renderes per request: månedsforbruget nulstiller ved månedsskift, og friske
// Ad hoc-opgaver fra Sanity vises uden at siden skal genbygges.
export const dynamic = 'force-dynamic'

/** Kundens navn og domæne i toppen og i hilsenen. Udfyld pr. kunde. */
const BRAND = { client: 'Horizen', domain: 'horizen.dk' }

/* ─── Ad hoc-opgaver fra Sanity ─────────────────────────────── */

type InboxRow = InboxItem & { updatedAt?: string }

const INBOX_QUERY = groq`*[_type == "seoInboxItem"] | order(receivedAt desc){
	_id, subject, message, fromName, fromEmail, receivedAt, status, priority, handling, estimateHours,
	"updatedAt": _updatedAt
}`

/** Henter alle SEO-opgaver (published) med read-token; fejler blødt til []. */
async function getInboxItems(): Promise<InboxRow[]> {
	try {
		const rows = await client
			.withConfig({
				token: process.env.SANITY_API_READ_TOKEN,
				useCdn: false,
				perspective: 'published',
				stega: false,
			})
			.fetch<InboxRow[]>(INBOX_QUERY)
		return rows ?? []
	} catch (err) {
		console.error('[dashboard] Kunne ikke hente SEO-opgaver:', err)
		return []
	}
}

/** Kundens svar fra fanen "Spørgsmål" (seoQuestionAnswer), pr. nøgle; fejler blødt til {}. */
async function getAnswers(): Promise<Record<string, SavedAnswer>> {
	try {
		const rows = await client
			.withConfig({
				token: process.env.SANITY_API_READ_TOKEN,
				useCdn: false,
				perspective: 'published',
				stega: false,
			})
			.fetch<{ key: string; answer: string; by?: string; at: string }[]>(
				groq`*[_type == "seoQuestionAnswer" && defined(answer)]{ key, answer, "by": answeredBy, "at": answeredAt }`,
				{},
				// aldrig fra cachen: et nyt svar skal ses ved næste besøg
				{ cache: 'no-store' },
			)
		return Object.fromEntries((rows ?? []).map((r) => [r.key, { text: r.answer, by: r.by ?? '', at: r.at }]))
	} catch (err) {
		console.error('[dashboard] Kunne ikke hente svar:', err)
		return {}
	}
}

/**
 * Status fra Resend (leveret, åbnet, kom ikke frem) for de nyeste beskeder.
 * "Åbnet" kræver, at åbningssporing er slået til for horizen.dk i Resend.
 * Fejler blødt: uden nøgle eller svar står der bare ingen status.
 */
async function withMailStatus(rows: SentMessage[]): Promise<SentMessage[]> {
	// Horizens nøgle; ellers sitets egen (på horizen.dk er det den samme konto).
	// Nøgler med kun "Sending access" kan ikke læse status: så står der ingen.
	const key =
		process.env.HORIZEN_RESEND_API_KEY?.trim() ||
		process.env.RESEND_API_KEY?.trim()
	if (!key) return rows
	const resend = new Resend(key)
	return Promise.all(
		rows.map(async (row, i) => {
			if (!row.resendId || i >= 20) return row
			try {
				const { data } = await resend.emails.get(row.resendId)
				return { ...row, status: data?.last_event }
			} catch {
				return row
			}
		}),
	)
}

/** Alt sendt til kunden: beskeder (fanen Beskeder) og beskeder om spørgsmål; fejler blødt. */
async function getSentMessages(): Promise<SentMessage[]> {
	try {
		const rows = await client
			.withConfig({
				token: process.env.SANITY_API_READ_TOKEN,
				useCdn: false,
				perspective: 'published',
				stega: false,
			})
			.fetch<SentMessage[]>(
				`*[_type in ["seoClientMessage", "seoQuestionNotice"] && defined(sentAt)] | order(sentAt desc)[0...100]{
					"kind": select(_type == "seoClientMessage" => "besked", "spoergsmaal"),
					sentAt, sentTo, sentToName, sentBy, subject, html, count, resendId
				}`,
				{},
				{ cache: 'no-store' },
			)
		return await withMailStatus(rows ?? [])
	} catch (err) {
		console.error('[dashboard] Kunne ikke hente sendte beskeder:', err)
		return []
	}
}

/** Hvad der er sendt af beskeder om spørgsmål, og hvad der er besvaret; fejler blødt. */
async function getNoticeState(): Promise<NoticeState> {
	try {
		return await client
			.withConfig({
				token: process.env.SANITY_API_READ_TOKEN,
				useCdn: false,
				perspective: 'published',
				stega: false,
			})
			.fetch<NoticeState>(NOTICE_STATE_QUERY, {}, { cache: 'no-store' })
	} catch (err) {
		console.error('[dashboard] Kunne ikke hente beskeder om spørgsmål:', err)
		return {}
	}
}

/**
 * Anonyme tællinger (src/lib/siteEvents.ts). Private id'er, så læse-tokenet er
 * påkrævet: uden det svarer Sanity bare med en tom liste. Derfor null (= kan
 * ikke læses), når tokenet mangler eller kaldet fejler, så fanerne kan sige det
 * i stedet for at vise et stille 0.
 */
async function getSiteEvents<T>(type: 'leadEvent' | 'aiVisit', fields: string): Promise<T[] | null> {
	if (!process.env.SANITY_API_READ_TOKEN?.trim()) {
		console.error(`[dashboard] SANITY_API_READ_TOKEN mangler, så ${type} kan ikke læses`)
		return null
	}
	try {
		const rows = await client
			.withConfig({
				token: process.env.SANITY_API_READ_TOKEN,
				useCdn: false,
				perspective: 'published',
				stega: false,
			})
			.fetch<T[]>(`*[_type == $type]{ ${fields} }`, { type })
		return rows ?? []
	} catch (err) {
		console.error(`[dashboard] Kunne ikke hente ${type}:`, err)
		return null
	}
}

/**
 * Automatiske tjek til fanen "Opsætning". Kun om en værdi FINDES (aldrig selve
 * værdien), og kun for det miljø, dashboardet kører i (lokalt eller live).
 */
function getSetupAuto({
	snapshots,
	leadEvents,
	seoCheckRun,
}: {
	snapshots: SeoSnapshot[]
	leadEvents: LeadEvent[]
	seoCheckRun: SeoCheckRun | null
}): Partial<Record<SetupAutoKey, boolean>> {
	const has = (...names: string[]) => names.every((n) => Boolean(process.env[n]?.trim()))
	const base = process.env.NEXT_PUBLIC_BASE_URL ?? ''
	return {
		baseUrl: /^https:\/\/(?!localhost)[^/]+\.[a-z]{2,}/i.test(base) && !/vercel\.app/i.test(base),
		sanity: has('NEXT_PUBLIC_SANITY_PROJECT_ID', 'NEXT_PUBLIC_SANITY_DATASET'),
		readToken: has('SANITY_API_READ_TOKEN'),
		writeToken: has('SANITY_API_WRITE_TOKEN'),
		dashboardLogin: has('DASHBOARD_SESSION_SECRET'),
		gaId: has('NEXT_PUBLIC_GA_ID'),
		googleOauth: has('GOOGLE_OAUTH_CLIENT_ID', 'GOOGLE_OAUTH_CLIENT_SECRET', 'GOOGLE_OAUTH_REFRESH_TOKEN'),
		searchConsoleSite: has('SEARCH_CONSOLE_SITE'),
		pagespeedKey: has('PAGESPEED_API_KEY'),
		cronSecret: has('CRON_SECRET'),
		ga4Data: has('GA4_PROPERTY_ID'),
		horizenMail: has('HORIZEN_RESEND_API_KEY'),
		snapshotDatasets: has('SEO_SNAPSHOT_DATASETS'),
		snapshots: snapshots.length > 0,
		leadEvents: leadEvents.length > 0,
		seoCheck: seoCheckRun ? seoCheckRun.errors === 0 : false,
		pages: pages.some((p) => Boolean(p.keywords?.primary)),
		retainer: retainerHours > 0 && recentActivity.length > 0,
	}
}

const SNAPSHOT_QUERY = groq`*[_type == "seoSnapshot"] | order(month desc){
	month, clicks, impressions, ctr, avgPosition, capturedAt,
	topQueries[]{ query, clicks, impressions, ctr, position }
}`

/** Henter månedlige SEO-snapshots (nyeste først); fejler blødt til []. */
async function getSnapshots(): Promise<SeoSnapshot[]> {
	try {
		const rows = await client
			.withConfig({
				token: process.env.SANITY_API_READ_TOKEN,
				useCdn: false,
				perspective: 'published',
				stega: false,
			})
			.fetch<SeoSnapshot[]>(SNAPSHOT_QUERY)
		return rows ?? []
	} catch (err) {
		console.error('[dashboard] Kunne ikke hente SEO-snapshots:', err)
		return []
	}
}

const PAGE_HEALTH_QUERY = groq`*[_type == "pageHealth"] | order(measuredAt desc)[0...13]{
	"id": _id, month, measuredAt, trigger, measuredBy, details
}`

/**
 * Målinger af forsiden (Sidens helbred), nyeste først. Lokalt uden målinger
 * vises eksempeldata, så siden kan ses; fejler blødt til [].
 */
async function getPageHealth(): Promise<{ history: HealthEntry[]; example: boolean }> {
	let rows: (Omit<HealthEntry, 'mobile' | 'desktop'> & { details?: string })[] = []
	try {
		rows =
			(await client
				.withConfig({
					token: process.env.SANITY_API_READ_TOKEN,
					useCdn: false,
					perspective: 'published',
					stega: false,
				})
				.fetch(PAGE_HEALTH_QUERY)) ?? []
	} catch (err) {
		console.error('[dashboard] Kunne ikke hente Sidens helbred:', err)
	}
	const history = rows.flatMap(({ details, ...row }) => {
		try {
			const d = JSON.parse(details ?? '{}')
			return [{ ...row, mobile: d.mobile ?? null, desktop: d.desktop ?? null }]
		} catch {
			return []
		}
	})
	if (!history.length && process.env.NODE_ENV !== 'production')
		return { history: exampleHistory(), example: true }
	return { history, example: false }
}

/** Seneste automatiske SEO-tjek (skrevet af .github/workflows/seo-check.yml); null hvis ingen. */
async function getSeoCheckRun(): Promise<SeoCheckRun | null> {
	try {
		return await client
			.withConfig({
				token: process.env.SANITY_API_READ_TOKEN,
				useCdn: false,
				perspective: 'published',
				stega: false,
			})
			.fetch<SeoCheckRun | null>(groq`*[_id == "seo-check-latest"][0]{ ranAt, trigger, url, pages, errors, warnings, runUrl, findings }`)
	} catch (err) {
		console.error('[dashboard] Kunne ikke hente SEO-tjek:', err)
		return null
	}
}

/* ─── Status- og prioritets-opslag ──────────────────────────── */

const PRIORITY_BADGE: Record<BuildPriority, { label: string; bg: string; text: string; border: string }> = {
	1: { label: 'Spor 1', bg: 'var(--st-done-bg)', text: 'var(--st-done-text)', border: 'var(--st-done-border)' },
	2: { label: 'Spor 2', bg: 'var(--st-info-bg)', text: 'var(--st-info-text)', border: 'var(--st-info-border)' },
	3: { label: 'Spor 3', bg: 'var(--st-partial-bg)', text: 'var(--st-partial-text)', border: 'var(--st-partial-border)' },
	4: { label: 'Spor 4', bg: 'color-mix(in srgb, var(--color-foreground) 4%, transparent)', text: 'var(--color-foreground)', border: 'color-mix(in srgb, var(--color-foreground) 10%, transparent)' },
}

// Impact = SEO-potentiale (grøn=høj). Konkurrence = hvor svært (grøn=let).
const IMPACT_DOT: Record<ImpactLevel, string> = {
	high: 'var(--st-done-dot)',
	medium: 'var(--st-partial-dot)',
	low: 'rgba(0,0,0,0.3)',
}
const COMPETITION_DOT: Record<ImpactLevel, string> = {
	low: 'var(--st-done-dot)',
	medium: 'var(--st-partial-dot)',
	high: 'var(--st-missing-dot)',
}
const LEVEL_LABEL: Record<ImpactLevel, string> = { high: 'Høj', medium: 'Mellem', low: 'Lav' }

const SCOPE_META: Record<AddonScope, string> = {
	engang: 'Engangsopgave',
	'pr-styk': 'Pr. styk',
	lobende: 'Løbende',
}

const ADDON_GROUPS: { discipline: AddonDiscipline; title: string; description: string }[] = [
	{
		discipline: 'indhold',
		title: 'Indhold',
		description: 'Tekst og søgeord på sitet: blogindlæg og on-page-optimering pr. side.',
	},
	{
		discipline: 'sider',
		title: 'Nye sider',
		description: 'Sider der ikke findes endnu, og som både uddyber fortællingen og fanger søgninger.',
	},
	{
		discipline: 'drift',
		title: 'Løbende arbejde',
		description: 'Det tilbagevendende der bygger synlighed over tid: links, omtale og månedlig måling.',
	},
]

/* ─── Småkomponenter ────────────────────────────────────────── */

/** Små stregikoner til nøglekortene */
function CardIcon({ d }: { d: string }) {
	return (
		<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
			<path d={d} />
		</svg>
	)
}

/**
 * Indeværende måned i dansk tid. Serveren kører i UTC, så uden tidszone ville
 * måneden skifte en til to timer for sent.
 */
function copenhagenMonth(now = new Date()) {
	const tz = 'Europe/Copenhagen'
	const monthKey = new Intl.DateTimeFormat('sv-SE', { timeZone: tz, year: 'numeric', month: '2-digit' }).format(now)
	const day = Number(new Intl.DateTimeFormat('en-US', { timeZone: tz, day: 'numeric' }).format(now))
	const [y, m] = monthKey.split('-').map(Number)
	const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate()
	return {
		monthKey,
		monthName: now.toLocaleDateString('da-DK', { month: 'long', timeZone: tz }),
		daysLeft: daysInMonth - day + 1,
	}
}

/** Rund måler for månedens timer (bento-kort ved siden af Fokus nu) */
function UsageGauge() {
	const { monthKey, monthName, daysLeft } = copenhagenMonth()
	const used = monthlyUsage[monthKey] ?? 0
	const extra = monthlyExtra[monthKey] ?? 0
	const over = used > retainerHours
	return (
		<div className="flex h-full flex-col rounded-3xl border border-foreground/[0.08] bg-white p-6">
			<span className="text-[11px] font-medium tracking-[0.14em] text-foreground/55 uppercase">
				Timer i {monthName}
			</span>
			<UsageMeter used={used} total={retainerHours} />
			<div className="mt-auto space-y-1 text-center text-xs text-foreground/55">
				<p>
					{over ? (
						<span style={{ color: 'var(--st-missing-text)' }}>Rammen er overskredet med {(used - retainerHours).toLocaleString('da-DK')} t</span>
					) : (
						`${used.toLocaleString('da-DK')} af ${retainerHours.toLocaleString('da-DK')} timer brugt`
					)}
					{extra > 0 && <span style={{ color: 'var(--st-done-text)' }}> · +{extra.toLocaleString('da-DK')} t ekstra uden beregning</span>}
				</p>
				<p>Nulstiller om {daysLeft} {daysLeft === 1 ? 'dag' : 'dage'}</p>
			</div>
		</div>
	)
}

/**
 * Sidernes indhold sendes til DashboardShell inde i en liste; React kræver en
 * nøgle på hvert element, når listen serialiseres fra server til klient.
 */
function withKeys(nav: ShellItem[]): ShellItem[] {
	const keyed = (el: ReactNode, key: string) =>
		isValidElement(el) ? cloneElement(el, { key }) : <Fragment key={key}>{el}</Fragment>
	return nav.map((n) => ({
		...n,
		content: n.content == null ? undefined : keyed(n.content, n.id),
		children: n.children?.map((c) => ({ ...c, content: keyed(c.content, `${n.id}-${c.id}`) })),
	}))
}

/**
 * Nøgletalskort (Overblik og Teknisk SEO): tal, ikon og en lille linje under
 * med enten ændringen i procent (`delta`) eller en statusprik (`dot`).
 */
function StatCard({
	label,
	value,
	hint,
	icon,
	tone,
	delta,
	dot,
}: {
	label: string
	value: string | number
	hint: string
	icon: ReactNode
	/** Ikonets farve i lys tilstand (dashboard.css → --tone-*); neutral i mørk */
	tone?: 'blue' | 'green' | 'orange' | 'violet' | 'pink'
	delta?: number | null
	dot?: string
}) {
	const toneColor = tone ? `var(--tone-${tone})` : undefined
	const toneBg = tone
		? `color-mix(in srgb, var(--tone-${tone}) var(--tone-bg-alpha), transparent)`
		: undefined
	return (
		<div className="flex flex-col rounded-3xl border border-foreground/[0.08] bg-white p-5 md:p-6">
			<div className="flex items-start justify-between gap-3">
				<span className="text-[11px] font-medium tracking-[0.14em] text-foreground/55 uppercase">{label}</span>
				<span
					className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-foreground/[0.08] bg-foreground/[0.04] text-foreground/70"
					style={toneBg ? { backgroundImage: `linear-gradient(${toneBg}, ${toneBg})` } : undefined}
					aria-hidden
				>
					<span className="flex" style={{ color: toneColor }}>
						{icon}
					</span>
				</span>
			</div>
			<div className="mt-2 text-3xl font-semibold tracking-tight tabular-nums text-foreground md:text-[2.5rem]">{value}</div>
			<div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-foreground/55">
				{dot && <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: dot }} aria-hidden />}
				{delta != null && (
					<span
						className="rounded-full px-2 py-0.5 font-medium"
						style={{
							backgroundColor: delta >= 0 ? 'var(--st-done-bg)' : 'var(--st-missing-bg)',
							color: delta >= 0 ? 'var(--st-done-text)' : 'var(--st-missing-text)',
						}}
					>
						{delta >= 0 ? '+' : ''}
						{Math.round(delta)} %
					</span>
				)}
				{hint}
			</div>
		</div>
	)
}

/** De nyeste aktiviteter som et kort på Overblik */
function LatestActivity({ entries }: { entries: ActivityEntry[] }) {
	return (
		<div className="rounded-3xl border border-foreground/[0.08] bg-white p-6">
			<div className="flex items-center justify-between gap-3">
				<span className="text-[11px] font-medium tracking-[0.14em] text-foreground/55 uppercase">Seneste aktivitet</span>
				<a href="#v=aktivitet" className="rounded-full border border-foreground/[0.1] px-3 py-1 text-xs font-medium text-foreground hover:bg-foreground/[0.06]">
					Se alt
				</a>
			</div>
			{entries.length === 0 ? (
				<p className="mt-4 text-sm text-foreground/55">Der er ikke registreret aktivitet endnu.</p>
			) : (
				<ul className="mt-4 divide-y divide-foreground/[0.06]">
					{entries.map((e, i) => (
						<li key={`${e.date}-${i}`} className="flex items-start gap-4 py-3">
							<span className="w-16 shrink-0 pt-0.5 text-xs tabular-nums text-foreground/45">
								{new Date(`${e.date}T00:00:00`).toLocaleDateString('da-DK', { day: 'numeric', month: 'short' })}
							</span>
							<span className="min-w-0 text-sm font-medium text-foreground">{e.title}</span>
							{e.kind && <ActivityKindTag kind={e.kind} className="ml-auto mt-0.5" />}
						</li>
					))}
				</ul>
			)}
		</div>
	)
}

/** "God morgen/eftermiddag/aften" efter dansk tid */
function greeting() {
	const h = Number(
		new Intl.DateTimeFormat('da-DK', { hour: 'numeric', hourCycle: 'h23', timeZone: 'Europe/Copenhagen' }).format(new Date()),
	)
	return h < 10 ? 'God morgen' : h < 17 ? 'God eftermiddag' : 'God aften'
}

function SectionHeading({
	eyebrow,
	title,
	description,
}: {
	eyebrow: string
	title: string
	description?: string
}) {
	return (
		<div className="mb-8">
			<span className="text-[11px] font-medium tracking-[0.14em] text-foreground/55 uppercase">
				{eyebrow}
			</span>
			<h2
				className="mt-2 text-2xl font-semibold tracking-tight text-foreground md:text-[1.75rem]"
				style={{ lineHeight: 1.1 }}
			>
				{title}
			</h2>
			{description && (
				<p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">{description}</p>
			)}
		</div>
	)
}

function LevelMeter({ label, value, dot }: { label: string; value: ImpactLevel; dot: string }) {
	return (
		<span className="inline-flex items-center gap-1.5 text-xs text-foreground/60">
			{label}
			<span className="h-2 w-2 rounded-full" style={{ backgroundColor: dot }} />
			<span className="font-medium text-foreground">{LEVEL_LABEL[value]}</span>
		</span>
	)
}

function BuildPageRow({ page }: { page: BuildPage }) {
	const b = PRIORITY_BADGE[page.priority]
	return (
		<div className="rounded-2xl border border-foreground/[0.08] bg-white p-5">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div className="flex min-w-0 items-center gap-3">
					<span
						className="inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-medium"
						style={{ backgroundColor: b.bg, color: b.text, border: `1px solid ${b.border}` }}
					>
						{b.label}
					</span>
					<h4 className="truncate text-base font-medium tracking-[-0.01em] text-foreground">
						{page.name}
					</h4>
				</div>
				<div className="flex shrink-0 items-center gap-4">
					<LevelMeter label="Impact:" value={page.impact} dot={IMPACT_DOT[page.impact]} />
					<LevelMeter label="Konk.:" value={page.competition} dot={COMPETITION_DOT[page.competition]} />
				</div>
			</div>
			<p className="mt-2 text-xs leading-relaxed text-muted">{page.note}</p>
		</div>
	)
}

function AddonRow({ service }: { service: AddonService }) {
	return (
		<div className="rounded-2xl border border-foreground/[0.08] bg-white p-5">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<span className="text-xs font-medium tracking-[0.15em] text-foreground/50 uppercase">
					{service.category}
				</span>
				<span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-foreground/[0.04] px-2.5 py-1 text-xs font-medium text-foreground">
					{SCOPE_META[service.scope]}
				</span>
			</div>
			<h3 className="mt-3 text-base font-medium tracking-[-0.01em] text-foreground">{service.title}</h3>
			<p className="mt-2 text-sm leading-relaxed text-muted">{service.description}</p>
		</div>
	)
}

function LaunchStepRow({ step, index }: { step: LaunchStep; index: number }) {
	return (
		<li className="flex gap-3">
			{step.done ? (
				<span
					className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-medium text-background"
					style={{ backgroundColor: 'var(--st-done-dot)' }}
				>
					✓
				</span>
			) : (
				<span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-foreground/20 text-[11px] font-medium text-foreground/50">
					{index}
				</span>
			)}
			<div className="min-w-0">
				<div className="flex flex-wrap items-center gap-2">
					<span
						className={`text-sm font-medium ${step.done ? 'text-foreground/50 line-through' : 'text-foreground'}`}
					>
						{step.title}
					</span>
				</div>
				<p className="mt-1 text-xs leading-relaxed text-muted">{step.detail}</p>
			</div>
		</li>
	)
}

function LaunchPhaseCard({ phase, number }: { phase: LaunchPhase; number: number }) {
	return (
		<div className="rounded-2xl border border-foreground/[0.08] bg-white p-6 md:p-7">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div className="flex items-center gap-3">
					<span className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-xs font-medium text-background">
						{number}
					</span>
					<h3 className="text-lg font-medium tracking-[-0.01em] text-foreground">{phase.title}</h3>
				</div>
				<span className="rounded-full border border-foreground/10 bg-foreground/[0.04] px-2.5 py-1 text-xs font-medium text-foreground/60">
					{phase.when}
				</span>
			</div>
			<p className="mt-3 text-sm leading-relaxed text-muted">{phase.intro}</p>
			<ol className="mt-5 space-y-4">
				{phase.steps.map((step, i) => (
					<LaunchStepRow key={step.title} step={step} index={i + 1} />
				))}
			</ol>
		</div>
	)
}

/** 12,5 → "12,5"; 12,0 → "12" (dansk komma). */
function formatHourValue(hours: number): string {
	const rounded = Math.round(hours * 10) / 10
	return Number.isInteger(rounded)
		? String(rounded)
		: rounded.toFixed(1).replace('.', ',')
}

/** Timeforbrug pr. måned + total, vist under "Samlet oversigt". */
function HoursOverview({
	months,
	total,
	extraTotal,
	retainer,
}: {
	months: { key: string; label: string; hours: number; extra: number }[]
	total: number
	extraTotal: number
	retainer: number
}) {
	return (
		<div className="mt-14 rounded-2xl border border-foreground/[0.08] bg-white p-6 md:p-8">
			<span className="text-xs font-medium tracking-[0.15em] text-foreground/50 uppercase">
				Timeforbrug i alt
			</span>
			<ul className="mt-4">
				{months.map((m) => (
					<li
						key={m.key}
						className="flex items-center justify-between gap-3 border-b border-foreground/[0.08] py-2.5 text-sm"
					>
						<span className="text-muted">{m.label}</span>
						<span className="flex items-baseline gap-2">
							<span className="font-medium text-foreground">{formatHourValue(m.hours)} t</span>
							{m.extra > 0 && (
								<span className="text-xs text-muted">
									+{formatHourValue(m.extra)} t ud over
								</span>
							)}
						</span>
					</li>
				))}
				<li className="flex items-center justify-between pt-3.5">
					<span className="text-base font-medium text-foreground">I alt</span>
					<span className="text-base font-medium text-foreground">
						{formatHourValue(total)} t
					</span>
				</li>
				{extraTotal > 0 && (
					<li className="flex items-center justify-between pt-1.5">
						<span className="text-xs text-muted">
							Ud over de {formatHourValue(retainer)} t · uden beregning
						</span>
						<span className="text-xs text-muted">+{formatHourValue(extraTotal)} t</span>
					</li>
				)}
			</ul>
		</div>
	)
}

/** Fordelingen af timerne mellem SEO og udvikling, i alt og pr. måned. */
function WorkSplit({ months }: { months: { key: string; label: string; seo: number; dev: number }[] }) {
	const used = months.filter((m) => m.seo + m.dev > 0)
	const seo = used.reduce((a, m) => a + m.seo, 0)
	const dev = used.reduce((a, m) => a + m.dev, 0)
	const total = seo + dev
	if (!total) return null
	const pct = (v: number, of: number) => Math.round((v / of) * 100)
	const Bar = ({ s, d, h }: { s: number; d: number; h: string }) => (
		<div className={`flex ${h} w-full overflow-hidden rounded-full bg-foreground/[0.06]`}>
			{s > 0 && <div style={{ width: `${(s / (s + d)) * 100}%`, backgroundColor: 'var(--st-done-dot)' }} />}
			{d > 0 && <div style={{ width: `${(d / (s + d)) * 100}%`, backgroundColor: 'var(--st-info-dot)' }} />}
		</div>
	)
	return (
		<div className="mb-8 rounded-2xl border border-foreground/[0.08] bg-white p-6 md:p-8">
			<span className="text-xs font-medium tracking-[0.15em] text-foreground/50 uppercase">
				Hvad timerne er gået til
			</span>
			<div className="mt-5 grid grid-cols-2 gap-4">
				<div>
					<div className="flex items-center gap-2 text-sm text-muted">
						<span className="h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--st-done-dot)' }} />
						SEO
					</div>
					<div className="mt-1 text-3xl font-medium tracking-[-0.02em] text-foreground tabular-nums">
						{pct(seo, total)} %
					</div>
					<div className="text-xs text-muted">{formatHourValue(seo)} t</div>
				</div>
				<div>
					<div className="flex items-center gap-2 text-sm text-muted">
						<span className="h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--st-info-dot)' }} />
						Udvikling
					</div>
					<div className="mt-1 text-3xl font-medium tracking-[-0.02em] text-foreground tabular-nums">
						{pct(dev, total)} %
					</div>
					<div className="text-xs text-muted">{formatHourValue(dev)} t</div>
				</div>
			</div>
			<div className="mt-5">
				<Bar s={seo} d={dev} h="h-3" />
			</div>
			<details className="group mt-6 border-t border-foreground/[0.08] pt-4">
				{/* Samme pil som månederne i loggen. */}
				<summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-1 text-sm font-medium text-foreground [&::-webkit-details-marker]:hidden">
					Se fordelingen pr. måned
					<svg
						viewBox="0 0 24 24"
						className="h-4 w-4 text-muted transition-transform group-open:rotate-180"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<path d="m6 9 6 6 6-6" />
					</svg>
				</summary>
				<ul className="mt-2">
					{[...used].reverse().map((m) => (
						<li
							key={m.key}
							className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-b border-foreground/[0.08] py-3 text-sm last:border-b-0"
						>
							<span className="shrink-0 text-muted" style={{ width: '8.5rem' }}>{m.label}</span>
							<div className="flex-1" style={{ minWidth: '10rem' }}>
								<Bar s={m.seo} d={m.dev} h="h-1.5" />
							</div>
							<span className="shrink-0 text-xs text-muted tabular-nums">
								SEO {pct(m.seo, m.seo + m.dev)} % · Udvikling {pct(m.dev, m.seo + m.dev)} %
							</span>
						</li>
					))}
				</ul>
			</details>
		</div>
	)
}

/* ─── Analytics ("SEO") ──────────────────────────── */

// Metric-opsætning: format + om højere er bedre (position: lavere = bedre).
const SNAPSHOT_METRICS: {
	key: 'clicks' | 'impressions' | 'ctr' | 'avgPosition'
	label: string
	hint: string
	higherBetter: boolean
	format: (v: number) => string
}[] = [
	{ key: 'clicks', label: 'Klik', hint: 'Samlede klik fra Google-søgning', higherBetter: true, format: (v) => v.toLocaleString('da-DK') },
	{ key: 'impressions', label: 'Visninger', hint: 'Hvor ofte sitet blev vist i søgeresultaterne', higherBetter: true, format: (v) => v.toLocaleString('da-DK') },
	{ key: 'ctr', label: 'CTR', hint: 'Klikrate: klik delt med visninger', higherBetter: true, format: (v) => `${v.toFixed(1).replace('.', ',')} %` },
	{ key: 'avgPosition', label: 'Snit-position', hint: 'Gennemsnitlig placering på tværs af søgninger', higherBetter: false, format: (v) => v.toFixed(1).replace('.', ',') },
]

/** "2026-08" → "August 2026". */
function formatMonth(month: string): string {
	const d = new Date(`${month}-01T00:00:00`)
	if (Number.isNaN(d.getTime())) return month
	return d
		.toLocaleDateString('da-DK', { month: 'long', year: 'numeric' })
		.replace(/^./, (c) => c.toUpperCase())
}

/** Ændring vs. forrige måned + om det er en forbedring. */
function computeDelta(
	current: number | undefined,
	previous: number | undefined,
	higherBetter: boolean,
): { text: string; good: boolean } | null {
	if (current == null || previous == null || previous === 0) return null
	const diff = current - previous
	if (diff === 0) return { text: '±0', good: true }
	const pct = Math.round((diff / previous) * 100)
	const up = diff > 0
	return { text: `${up ? '↑' : '↓'} ${Math.abs(pct)} %`, good: higherBetter ? up : !up }
}

function MetricCard({ label, hint }: { label: string; hint: string }) {
	return (
		<div className="rounded-2xl border border-foreground/[0.08] bg-white p-6">
			<div className="flex items-center justify-between">
				<span className="text-xs font-medium tracking-[0.15em] text-muted uppercase">{label}</span>
				<span className="h-2 w-2 rounded-full bg-foreground/25" />
			</div>
			<div className="mt-3 text-lg font-medium text-foreground/40">Afventer data</div>
			<p className="mt-2 text-xs leading-relaxed text-muted">{hint}</p>
		</div>
	)
}

/** Metric-kort med rigtig værdi + ændring vs. forrige måned. */
function MetricValueCard({
	label,
	hint,
	value,
	delta,
	comparison,
}: {
	label: string
	hint: string
	value: string
	delta: { text: string; good: boolean } | null
	comparison?: string
}) {
	return (
		<div className="rounded-2xl border border-foreground/[0.08] bg-white p-6">
			<span className="text-xs font-medium tracking-[0.15em] text-muted uppercase">{label}</span>
			<div className="mt-3 text-3xl font-semibold tracking-tight tabular-nums text-foreground md:text-[2.5rem]">{value}</div>
			{delta ? (
				<p
					className="mt-2 text-xs font-medium"
					style={{ color: delta.good ? 'var(--st-done-dot)' : 'var(--st-missing-dot)' }}
				>
					{delta.text} {comparison ? `vs. ${comparison}` : 'vs. forrige måned'}
				</p>
			) : (
				<p className="mt-2 text-xs text-muted">Ingen forrige måned at sammenligne med endnu</p>
			)}
			<p className="mt-2 text-xs leading-relaxed text-muted">{hint}</p>
		</div>
	)
}

/** Finder et målsøgeord i månedens top-søgninger (case-insensitivt: eksakt, ellers indeholdt). */
function matchQuery(target: string, queries?: SearchQuery[]): SearchQuery | null {
	if (!queries?.length) return null
	const t = target.toLowerCase().trim()
	return (
		queries.find((q) => q.query.toLowerCase().trim() === t) ??
		queries.find((q) => q.query.toLowerCase().includes(t)) ??
		null
	)
}

function PageMetricRow({
	page,
	topQueries,
	hasData,
}: {
	page: PageDetail
	topQueries?: SearchQuery[]
	hasData: boolean
}) {
	const match = matchQuery(page.keywords.primary, topQueries)
	const cells: { label: string; value: string }[] = [
		{
			label: 'Position',
			value: match
				? match.position.toFixed(1).replace('.', ',')
				: hasData
					? 'Ses ikke i top 25'
					: 'Afventer data',
		},
		{
			label: 'Klik',
			value: match ? match.clicks.toLocaleString('da-DK') : hasData ? '0' : 'Afventer data',
		},
		{
			label: 'Visninger',
			value: match ? match.impressions.toLocaleString('da-DK') : hasData ? '0' : 'Afventer data',
		},
	]
	return (
		<div className="rounded-2xl border border-foreground/[0.08] bg-white p-5">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<h4 className="text-base font-medium tracking-[-0.01em] text-foreground">{page.name}</h4>
					<span className="text-xs text-muted">{page.slug}</span>
				</div>
				<span className="text-xs text-foreground/50">Målsøgeord: {page.keywords.primary}</span>
			</div>
			<div className="mt-4 grid grid-cols-3 gap-4">
				{cells.map((c) => (
					<div key={c.label}>
						<span className="text-xs font-medium tracking-[0.1em] text-muted uppercase">
							{c.label}
						</span>
						<div
							className={`mt-1 text-base font-medium ${match ? 'text-foreground' : 'text-foreground/40'}`}
						>
							{c.value}
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

/** Fanen Mål og resultater: månedens mål og hvad målingen viste. */
function GoalsTab() {
	return (
		<div>
			<SectionHeading
				eyebrow="Mål og resultater"
				title="Hvad vi arbejder hen imod, og hvad det flytter"
				description="Hver måned sætter vi nogle få mål for de sider, vi arbejder med, og måler bagefter i Google Search Console, hvor langt vi er nået. Aktivitetsloggen viser, hvad vi har lavet; her ser du, hvad det har flyttet."
			/>
			<GoalsByMonth months={goalMonths} />
		</div>
	)
}

/** Fanen AI-søgning: besøg fra ChatGPT, Perplexity m.fl. (GEO). */
function AiSearchTab({
	aiVisits,
	unreadable,
	isHorizen,
}: {
	aiVisits: AiVisit[]
	unreadable: boolean
	isHorizen: boolean
}) {
	return (
		<div className="space-y-6">
			<SectionHeading
				eyebrow="AI-søgning"
				title="Synlighed i AI-tjenester"
				description="Flere spørger ChatGPT, Perplexity, Gemini, Copilot eller Googles AI-svar i stedet for at google. Her følger vi, om de tjenester sender besøgende videre til sitet, og hvilke sider de lander på. Arbejdet med at blive brugt som kilde i AI-svar kaldes også GEO."
			/>
			{unreadable ? (
				<SiteEventsUnreadable isHorizen={isHorizen} />
			) : (
				<AiVisitsSection visits={aiVisits} now={new Date().toISOString()} />
			)}
		</div>
	)
}

/** Fanen Sidens helbred: Googles PageSpeed-måling af forsiden, hver måned. */
function HealthTab({
	history,
	canRun,
	example,
	optimizeRequestedAt,
}: {
	history: HealthEntry[]
	canRun: boolean
	example: boolean
	optimizeRequestedAt?: string
}) {
	return (
		<div>
			<SectionHeading
				eyebrow="Sidens helbred"
				title="Hvor hurtig og sund er forsiden?"
				description="Google måler forsiden, som en besøgende oplever den: hvor hurtigt den vises, om alle kan bruge den, og om det tekniske er i orden. Målingen tages automatisk den 3. i hver måned, så udviklingen kan følges."
			/>
			<HealthCheck
				domain={BRAND.domain}
				history={history}
				canRun={canRun}
				example={example}
				optimizeHours={healthOptimizeHours}
				optimizeRequestedAt={optimizeRequestedAt}
			/>
		</div>
	)
}

/** Fanen Henvendelser: formularer og klik på telefon og mail fra alle kanaler. */
function LeadsTab({
	leadEvents,
	snapshots,
	unreadable,
	isHorizen,
}: {
	leadEvents: LeadEvent[]
	snapshots: SeoSnapshot[]
	unreadable: boolean
	isHorizen: boolean
}) {
	return (
		<div className="space-y-6">
			<SectionHeading
				eyebrow="Henvendelser"
				title="Fra besøg til kunder"
				description="Det er her, synligheden bliver til kunder. Henvendelserne kan komme fra Google, AI-tjenester eller direkte besøg, så de står på deres egen fane."
			/>
			{unreadable ? (
				<SiteEventsUnreadable isHorizen={isHorizen} />
			) : (
				<>
					{isHorizen && leadEvents.length === 0 && <NoLeadsYet />}
					<LeadsSection events={leadEvents} snapshots={snapshots} now={new Date().toISOString()} />
				</>
			)}
		</div>
	)
}

function AnalyticsTab({
	snapshots,
	searchTrend,
}: {
	snapshots: SeoSnapshot[]
	searchTrend: SearchTrend | null
}) {
	const hasData = snapshots.length > 0
	const latest = snapshots[0]
	const previous = snapshots[1]
	const comparison = previous ? formatMonth(previous.month) : undefined

	return (
		<div className="space-y-12">
			<SectionHeading
				eyebrow="SEO"
				title="Google-søgning, hele sitet"
				description={
					hasData
						? `Google Search Console, hele sitet. Nyeste måned: ${formatMonth(latest.month)}. Opdateres automatisk den 3. i hver måned.`
						: 'Google Search Console, hele sitet. Tallene hentes automatisk den 3. i hver måned og vises her, inkl. udviklingen måned for måned.'
				}
			/>

			{!hasData && (
				<div
					className="rounded-2xl p-6"
					style={{ backgroundColor: STATUS_META.partial.bg, border: `1px solid ${STATUS_META.partial.border}` }}
				>
					<p className="text-sm leading-relaxed" style={{ color: STATUS_META.partial.text }}>
						<span className="font-medium">Afventer første snapshot: </span>
						{analyticsNote}
					</p>
				</div>
			)}

			{/* Nyeste måneds nøgletal (med ændring vs. forrige måned) */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{hasData
					? SNAPSHOT_METRICS.map((m) => {
							const v = latest[m.key]
							return v == null ? (
								<MetricCard key={m.key} label={m.label} hint={m.hint} />
							) : (
								<MetricValueCard
									key={m.key}
									label={m.label}
									hint={m.hint}
									value={m.format(v)}
									delta={computeDelta(v, previous?.[m.key], m.higherBetter)}
									comparison={comparison}
								/>
							)
						})
					: siteMetrics.map((m) => <MetricCard key={m.key} label={m.label} hint={m.hint} />)}
			</div>

			{/* Klik og visninger dag for dag / uge for uge (som i Search Console) */}
			{searchTrend && searchTrend.days.length > 0 && <SearchTrendChart trend={searchTrend} />}

			{/* Foldbare sektioner: tæt som en liste, indholdet vises ved klik */}
			<div className="space-y-4">

			{/* Udvikling måned for måned */}
			{hasData && (
				<FoldSection
					title="Udvikling måned for måned"
					summary={`Klik, visninger, CTR og position for ${snapshots.length} ${snapshots.length === 1 ? 'måned' : 'måneder'}`}
				>
					<div className="overflow-x-auto rounded-2xl border border-foreground/[0.08] bg-white">
						<table className="w-full min-w-[520px] text-sm">
							<thead>
								<tr className="border-b border-foreground/[0.08] text-left">
									<th className="px-5 py-3 text-xs font-medium tracking-[0.1em] text-muted uppercase">Måned</th>
									<th className="px-5 py-3 text-right text-xs font-medium tracking-[0.1em] text-muted uppercase">Klik</th>
									<th className="px-5 py-3 text-right text-xs font-medium tracking-[0.1em] text-muted uppercase">Visninger</th>
									<th className="px-5 py-3 text-right text-xs font-medium tracking-[0.1em] text-muted uppercase">CTR</th>
									<th className="px-5 py-3 text-right text-xs font-medium tracking-[0.1em] text-muted uppercase">Snit-position</th>
								</tr>
							</thead>
							<tbody>
								{snapshots.map((s) => (
									<tr key={s.month} className="border-b border-foreground/[0.06] last:border-0">
										<td className="px-5 py-3 font-medium text-foreground">{formatMonth(s.month)}</td>
										<td className="px-5 py-3 text-right text-foreground">{s.clicks != null ? s.clicks.toLocaleString('da-DK') : '—'}</td>
										<td className="px-5 py-3 text-right text-foreground">{s.impressions != null ? s.impressions.toLocaleString('da-DK') : '—'}</td>
										<td className="px-5 py-3 text-right text-foreground">{s.ctr != null ? `${s.ctr.toFixed(1).replace('.', ',')} %` : '—'}</td>
										<td className="px-5 py-3 text-right text-foreground">{s.avgPosition != null ? s.avgPosition.toFixed(1).replace('.', ',') : '—'}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</FoldSection>
			)}

			{/* Top-søgninger (nyeste måned) */}
			{hasData && latest.topQueries && latest.topQueries.length > 0 && (
				<FoldSection
					title="Top-søgninger"
					summary={`De søgninger, sitet fik flest klik på i ${formatMonth(latest.month).toLowerCase()}`}
				>
					<p className="mb-5 text-sm text-muted">
						De søgninger sitet fik flest klik på i {formatMonth(latest.month)}. Grøn position = quick win (plads 5-15, tæt på toppen).
					</p>
					<div className="overflow-x-auto rounded-2xl border border-foreground/[0.08] bg-white">
						<table className="w-full min-w-[560px] text-sm">
							<thead>
								<tr className="border-b border-foreground/[0.08] text-left">
									<th className="px-5 py-3 text-xs font-medium tracking-[0.1em] text-muted uppercase">Søgning</th>
									<th className="px-5 py-3 text-right text-xs font-medium tracking-[0.1em] text-muted uppercase">Klik</th>
									<th className="px-5 py-3 text-right text-xs font-medium tracking-[0.1em] text-muted uppercase">Visninger</th>
									<th className="px-5 py-3 text-right text-xs font-medium tracking-[0.1em] text-muted uppercase">CTR</th>
									<th className="px-5 py-3 text-right text-xs font-medium tracking-[0.1em] text-muted uppercase">Position</th>
								</tr>
							</thead>
							<tbody>
								{latest.topQueries.slice(0, 15).map((q) => {
									const quickWin = q.position >= 5 && q.position <= 15
									return (
										<tr key={q.query} className="border-b border-foreground/[0.06] last:border-0">
											<td className="px-5 py-3 font-medium text-foreground">{q.query}</td>
											<td className="px-5 py-3 text-right text-foreground">{q.clicks.toLocaleString('da-DK')}</td>
											<td className="px-5 py-3 text-right text-foreground">{q.impressions.toLocaleString('da-DK')}</td>
											<td className="px-5 py-3 text-right text-foreground">{q.ctr.toFixed(1).replace('.', ',')} %</td>
											<td
												className="px-5 py-3 text-right font-medium text-foreground"
												style={{ color: quickWin ? 'var(--st-done-dot)' : undefined }}
											>
												{q.position.toFixed(1).replace('.', ',')}
											</td>
										</tr>
									)
								})}
							</tbody>
						</table>
					</div>
				</FoldSection>
			)}

			{/* Jeres målsøgeord — matchet mod månedens søgninger */}
			<FoldSection title="Jeres målsøgeord" summary="Det søgeord, hver side går efter, og hvor sitet ligger">
				<p className="mb-4 text-sm text-muted">
					{hasData
						? `Hvor sitet ligger på det søgeord, hver side går efter (${formatMonth(latest.month)}).`
						: 'De søgeord, hver side går efter. Placeringer vises, når der er data.'}
				</p>
				<div className="mb-6">
					<TabLink to={{ v: 'status', w: 'sider' }} scrollTo="seo-tabs">
						Se sekundære søgeord og plan pr. side
					</TabLink>
				</div>
				{pages.length === 0 ? (
					<div className="rounded-2xl border border-foreground/[0.08] bg-white p-8 text-center">
						<p className="text-sm text-muted">
							Tilføj sidernes målsøgeord i{' '}
							<code className="rounded bg-foreground/[0.06] px-1 py-0.5 text-xs">data.ts</code> (pages), så
							følger dashboardet deres placeringer her.
						</p>
					</div>
				) : (
					<div className="space-y-3">
						{pages.map((p) => (
							<PageMetricRow key={p.slug} page={p} topQueries={latest?.topQueries} hasData={hasData} />
						))}
					</div>
				)}
			</FoldSection>
			</div>
		</div>
	)
}

/* ─── Løbende drift (den månedlige SEO-motor) ───────────────── */

const CADENCE_META: Record<DriftCadence, { label: string; color: string }> = {
	monthly: { label: 'Hver måned', color: 'var(--st-done-dot)' },
	ongoing: { label: 'Løbende', color: 'var(--color-foreground)' },
	quarterly: { label: 'Kvartalsvis', color: 'var(--st-partial-dot)' },
}

const DRIFT_GROUPS: { discipline: DriftDiscipline; title: string; description: string }[] = [
	{
		discipline: 'onpage',
		title: 'On-page SEO',
		description:
			'Arbejde på jeres egne sider: indhold, titler, meta og overskrifter, intern linking og sidernes tekniske sundhed. Det I selv har fuld kontrol over.',
	},
	{
		discipline: 'offpage',
		title: 'Off-page SEO',
		description:
			'Signaler uden for jeres eget site, der opbygger autoritet og synlighed: links, omtaler og Google Business Profile. Noget I påvirker, men ikke styrer 100%.',
	},
	{
		discipline: 'analysis',
		title: 'Måling & rapportering',
		description:
			'Der hvor effekten måles og næste træk besluttes: Search Console, placeringer, konkurrenter og månedsrapport.',
	},
]

function CadenceBadge({ cadence }: { cadence: DriftCadence }) {
	const m = CADENCE_META[cadence]
	return (
		<span className="inline-flex items-center gap-1.5 rounded-full bg-foreground/[0.05] px-2.5 py-1 text-xs font-medium text-foreground/70">
			<span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: m.color }} />
			{m.label}
		</span>
	)
}

function RecurringTaskRow({ task }: { task: RecurringTask }) {
	return (
		<div className="rounded-2xl border border-foreground/[0.08] bg-white p-5">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<span className="text-xs font-medium tracking-[0.15em] text-muted uppercase">
					{task.category}
				</span>
				<CadenceBadge cadence={task.cadence} />
			</div>
			<h3 className="mt-3 text-base font-medium tracking-[-0.01em] text-foreground">{task.title}</h3>
			<p className="mt-2 text-sm leading-relaxed text-muted">{task.description}</p>
		</div>
	)
}

/* ─── Timetæller (månedsforbrug mod retainer) ───────────────── */


/* ─── Side ──────────────────────────────────────────────────── */

export default async function SeoOverviewPage({
	searchParams,
}: {
	searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
	// Hvem ser siden? Horizen ser alt; kunden ser ikke værktøjskassen.
	// Horizen kan se kundens udgave med ?som=kunde.
	const requestHeaders = await headers()
	const viewer = requestHeaders.get(DASHBOARD_USER_HEADER) ?? 'kunde'
	const viewerName = decodeURIComponent(requestHeaders.get(DASHBOARD_NAME_HEADER) ?? '')
	// afsender i mails: navn og portræt ud fra login-mailen (se senderProfile)
	const sender = senderProfile(
		requestHeaders.get(DASHBOARD_EMAIL_HEADER) ?? '',
		viewerName,
		process.env.SEO_SENDER_PHOTO,
	)
	const asClient = (await searchParams).som === 'kunde'
	const isHorizen = viewer === 'horizen' && !asClient
	const inbox = await getInboxItems()
	const answers = await getAnswers()
	const noticeState = await getNoticeState()
	const sentMessages = isHorizen ? await getSentMessages() : []
	const [snapshots, seoCheckRun, leadRows, aiRows, searchTrend, pageHealth, visits] = await Promise.all([
		getSnapshots(),
		getSeoCheckRun(),
		getSiteEvents<LeadEvent>('leadEvent', 'type, path, source, createdAt'),
		getSiteEvents<AiVisit>('aiVisit', 'source, path, createdAt'),
		getSearchTrend(),
		getPageHealth(),
		// Besøg: egne tal uden cookies + GA4 for dagene før (src/lib/visits.ts)
		getVisits(),
	])
	const leadEvents = leadRows ?? []
	const aiVisits = aiRows ?? []
	const siteEventsUnreadable = leadRows === null || aiRows === null
	const setupAuto = getSetupAuto({ snapshots, leadEvents, seoCheckRun })
	const setup = setupProgress(setupAuto, setupChecked)
	// Åbne opgaver → "Ad hoc"-fanen; løste → Aktivitet.
	const openTasks: InboxItem[] = inbox.filter((t) => t.status !== 'loest')
	// Løste opgaver som egen tidslinje (dato = seneste ændring = "løst"-tidspunkt).
	// Opgaver, som en post i pastAdhocActivity allerede beskriver, vises ikke igen.
	const describedTasks = new Set(pastAdhocActivity.map((e) => e.taskId).filter(Boolean))
	const solvedTaskEntries: ActivityEntry[] = inbox
		.filter((t) => t.status === 'loest' && !describedTasks.has(t._id))
		.map((t) => ({
			date: (t.updatedAt ?? t.receivedAt ?? lastUpdated).slice(0, 10),
			title: t.subject || '(uden emne)',
			description: t.message,
			hours: t.estimateHours,
		}))
	// Mærket "SEO" eller "Udvikling": listen bestemmer, medmindre posten selv siger andet.
	const seoEntries: ActivityEntry[] = recentActivity.map((e) => ({ ...e, kind: e.kind ?? 'seo' }))
	const devEntries: ActivityEntry[] = pastAdhocActivity.map((e) => ({ ...e, kind: e.kind ?? 'udvikling' }))
	const solvedDevEntries: ActivityEntry[] = solvedTaskEntries.map((e) => ({ ...e, kind: 'udvikling' }))
	// Ad hoc-log = statisk historik + løste opgaver (begge aftagere re-sorterer).
	const adhocEntries: ActivityEntry[] = [
		...devEntries,
		...solvedDevEntries,
	].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
	// Samlet: SEO-milepæle + ad hoc-historik + løste opgaver i én tidslinje.
	// Løste opgaver får "Opgave løst:"-præfiks, så typerne kan skelnes.
	const mergedActivity: ActivityEntry[] = [
		...seoEntries,
		...devEntries,
		...solvedDevEntries.map((e) => ({ ...e, title: `Opgave løst: ${e.title}` })),
	].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
	// Timeforbrug pr. måned (alle måneder med timer + indeværende) + totaler.
	const { monthKey: currentMonthKey, monthName: monthLabel } = copenhagenMonth()
	const overviewKeys = Array.from(
		new Set([
			...Object.keys(monthlyUsage),
			...Object.keys(monthlyExtra),
			currentMonthKey,
		]),
	).sort()
	const hoursOverview = overviewKeys.map((key) => ({
		key,
		label: new Date(`${key}-01T00:00:00`)
			.toLocaleDateString('da-DK', { month: 'long', year: 'numeric' })
			.replace(/^./, (c) => c.toUpperCase()),
		hours: monthlyUsage[key] ?? 0,
		extra: monthlyExtra[key] ?? 0,
	}))
	const hoursTotal = Object.values(monthlyUsage).reduce((a, b) => a + b, 0)
	// Fordelingen vises kun, når den er ført (mindst én måned i monthlyDevelopment).
	const workSplit = !Object.keys(monthlyDevelopment).length ? [] : hoursOverview.map((m) => {
		const dev = Math.min(monthlyDevelopment[m.key] ?? 0, m.hours)
		return { key: m.key, label: m.label, seo: m.hours - dev, dev }
	})
	const extraTotal = Object.values(monthlyExtra).reduce((a, b) => a + b, 0)
	const counts = technicalItems.reduce(
		(acc, item) => {
			if (item.status === 'missing' && item.later) acc.later += 1
			else acc[item.status] += 1
			return acc
		},
		{ done: 0, partial: 0, missing: 0, later: 0 } as Record<SeoStatus | 'later', number>,
	)

	// Toppen viser, hvornår Search Console-dataet sidst blev hentet (capturedAt),
	// ikke hvornår dashboardet manuelt blev redigeret. Opdaterer sig selv hver måned.
	const lastCapturedAt = snapshots
		.map((s) => s.capturedAt)
		.filter((v): v is string => Boolean(v))
		.sort()
		.at(-1)
	const dataUpdatedLabel = lastCapturedAt
		? `Data opdateret: ${new Date(lastCapturedAt).toLocaleDateString('da-DK', {
				day: 'numeric',
				month: 'long',
				year: 'numeric',
			})}`
		: 'Afventer første datatræk'

	/* ── Fane: Kom i gang (skridtvis launch-plan) ── */
	const launchTab = (
		<div className="space-y-10">
			<SectionHeading
				eyebrow="Kom i gang"
				title="Launch-plan, skridt for skridt"
				description={launchIntro}
			/>
			<div className="space-y-5">
				{launchPlan.map((phase, i) => (
					<LaunchPhaseCard key={phase.title} phase={phase} number={i + 1} />
				))}
			</div>

			{/* Huskeråd til Search Console */}
			<div
				className="rounded-2xl p-6"
				style={{ backgroundColor: STATUS_META.partial.bg, border: `1px solid ${STATUS_META.partial.border}` }}
			>
				<h3 className="text-base font-medium text-foreground">Huskeråd, når du sætter Search Console op</h3>
				<ul className="mt-4 space-y-2.5">
					{searchConsoleTips.map((tip) => (
						<li key={tip} className="flex gap-2.5 text-sm leading-relaxed text-foreground">
							<span
								className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
								style={{ backgroundColor: STATUS_META.partial.dot }}
							/>
							<span>{tip}</span>
						</li>
					))}
				</ul>
			</div>
		</div>
	)

	/* ── Fane: Teknisk SEO ── */
	const technicalTab = (
		<div className="space-y-14">
			<SectionHeading
				eyebrow="Teknisk SEO"
				title="To-do pr. punkt"
				description="Åbne punkter står øverst, grupperet efter status og sorteret efter prioritet. Klik et punkt for at se fund og handling. De færdige er foldet væk nederst. Punkter, der har været åbne i tre måneder eller mere, er markeret med deres alder."
			/>
			<TechnicalList items={technicalItems} now={new Date().toISOString()} />
		</div>
	)

	/* ── Fane: Sider & søgeord ── */
	const pagesTab = (
		<div>
			<SectionHeading
				eyebrow="Sider & søgeord"
				title="Status pr. side"
				description="Søg og filtrér i siderne, og klik en side i tabellen for at se dens status, søgeord, næste skridt og to-do. Grøn = færdig, gul = i gang, rød = mangler."
			/>
			<PagesTabs pages={pages} />
			<p
				className="mt-6 rounded-2xl p-5 text-xs leading-relaxed"
				style={{
					backgroundColor: STATUS_META.partial.bg,
					color: STATUS_META.partial.text,
					border: `1px solid ${STATUS_META.partial.border}`,
				}}
			>
				<span className="font-medium">Bemærk: </span>
				{keywordNotes}
			</p>
		</div>
	)

	/* ── Fane: Plan (roadmap + action items + sider på vej) ── */
	const planTab = (
		<div className="space-y-16">
			<section>
				<SectionHeading
					eyebrow="Roadmap"
					title="Tre faser"
					description="Hvad der skal ske nu (tekniske fixes), og hvad der hører til betalt tilkøb efter lancering."
				/>
				<div className="grid gap-4 md:grid-cols-3">
					{roadmap.map((phase, i) => (
						<div
							key={phase.title}
							className="rounded-2xl border border-foreground/[0.08] bg-white p-6"
						>
							<div className="flex items-center gap-3">
								<span className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-xs font-medium text-background">
									{i + 1}
								</span>
								<h3 className="text-lg font-medium tracking-[-0.01em] text-foreground">{phase.title}</h3>
							</div>
							<p className="mt-2 text-xs leading-relaxed text-muted">{phase.subtitle}</p>
							<ul className="mt-4 space-y-3">
								{phase.items.map((point) => (
									<li key={point} className="flex gap-2.5 text-sm leading-relaxed text-foreground">
										<span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" />
										<span>{point}</span>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</section>

			<section>
				<SectionHeading
					eyebrow="Action items"
					title="Ting der skal gøres uden for koden"
					description="Manuelle opgaver: Search Console, indsend sitemap, eventuelt Google Business Profile, søgeordsverifikation og baseline-måling. Høj prioritet først; klik for detaljer. Løste opgaver er foldet væk nederst."
				/>
				<ActionList items={actionItems} now={new Date().toISOString()} />
			</section>

			<section>
				<SectionHeading
					eyebrow="Sider der skal bygges"
					title="Prioriteret efter SEO-impact"
					description={upcomingPagesNote}
				/>
				{/* Signatur for impact/konkurrence */}
				<div className="mb-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted">
					<span className="inline-flex items-center gap-1.5">
						<span className="h-2 w-2 rounded-full" style={{ backgroundColor: IMPACT_DOT.high }} />
						Impact = hvor meget synlighed siden kan give (grøn = høj)
					</span>
					<span className="inline-flex items-center gap-1.5">
						<span className="h-2 w-2 rounded-full" style={{ backgroundColor: COMPETITION_DOT.low }} />
						Konkurrence = hvor svært det er at rangere (grøn = let)
					</span>
				</div>
				<div className="space-y-12">
					{buildTiers.map((tier) => {
						const items = buildPages.filter((p) => p.priority === tier.priority)
						if (items.length === 0) return null
						return (
							<div key={tier.priority}>
								<div className="mb-2 flex items-baseline gap-3">
									<h3 className="text-xl font-medium tracking-[-0.02em] text-foreground">{tier.title}</h3>
									<span className="text-sm text-muted">({items.length})</span>
								</div>
								<p className="mb-5 text-sm text-muted">{tier.subtitle}</p>
								<div className="grid gap-4 md:grid-cols-2">
									{items.map((page) => (
										<BuildPageRow key={page.name} page={page} />
									))}
								</div>
							</div>
						)
					})}
				</div>
			</section>

			<section>
				<ServiceCatalog />
			</section>
		</div>
	)

	/* ── Fane: Efter lancering (betalt tilkøb) ── */
	const addonTab = (
		<div className="space-y-14">
			<SectionHeading
				eyebrow="Muligheder"
				title="Betalt tilkøb"
				description={addonIntro}
			/>
			{ADDON_GROUPS.map((group) => {
				const items = addonServices.filter((s) => s.discipline === group.discipline)
				if (items.length === 0) return null
				return (
					<div key={group.discipline}>
						<div className="mb-5 flex items-baseline gap-3">
							<span className="h-2.5 w-2.5 rounded-full bg-foreground/40" />
							<h3 className="text-xl font-medium tracking-[-0.02em] text-foreground">{group.title}</h3>
							<span className="text-sm text-muted">({items.length})</span>
						</div>
						<p className="-mt-3 mb-5 text-sm text-muted">{group.description}</p>
						<div className="grid gap-4 md:grid-cols-2">
							{items.map((service) => (
								<AddonRow key={service.title} service={service} />
							))}
						</div>
					</div>
				)
			})}
		</div>
	)

	/* ── Fane: Aktivitet (3 underfaner: Samlet · SEO · Ad hoc) ── */
	const samletTab = (
		<div>
			<SectionHeading
				eyebrow="Samlet oversigt"
				title="Alt der er sket, samlet"
				description="SEO-arbejde og udvikling af sitet i én tidslinje, måned for måned. Mærket ved hver post viser, hvad der er SEO, og hvad der er udvikling. Nyeste øverst."
			/>
			<WorkSplit months={workSplit} />
			<ActivityByMonth items={mergedActivity} />
			<HoursOverview
				months={[...hoursOverview].reverse()}
				total={hoursTotal}
				extraTotal={extraTotal}
				retainer={retainerHours}
			/>
		</div>
	)

	const seoLogTab = (
		<div>
			<SectionHeading
				eyebrow="SEO aktivitetslog"
				title="Vores SEO-indsats"
				description="Kun det arbejde, der direkte handler om at blive fundet i Google, måned for måned. Nyeste øverst."
			/>
			<ActivityByMonth items={seoEntries} />
		</div>
	)

	const adhocLogTab = (
		<div>
			<SectionHeading
				eyebrow="Ad hoc aktivitetslog"
				title="Udvikling af sitet"
				description="Nye funktioner, ønsker og rettelser på sitet, som ikke er SEO, samlet måned for måned."
			/>
			{adhocEntries.length === 0 ? (
				<div className="rounded-2xl border border-foreground/[0.08] bg-white p-8 text-center">
					<p className="text-sm text-muted">
						Ingen poster endnu. Når en opgave markeres som løst, dukker den op her.
					</p>
				</div>
			) : (
				<ActivityByMonth items={adhocEntries} />
			)}
		</div>
	)

	const activityTab = (
		<DashboardTabs
			tabs={[
				{ id: 'samlet', label: 'Samlet oversigt', content: samletTab },
				{ id: 'seo-log', label: 'SEO aktivitetslog', content: seoLogTab },
				{ id: 'adhoc-log', label: 'Ad hoc aktivitetslog', content: adhocLogTab },
			]}
			defaultTab="samlet"
			variant="pill"
		/>
	)

	/* ── Fane: Løbende drift (den månedlige SEO-motor) ── */
	const driftTab = (
		<div className="space-y-12">
			<SectionHeading
				eyebrow="Løbende drift"
				title="Den månedlige SEO-motor"
				description={driftIntro}
			/>
			{DRIFT_GROUPS.map((group) => {
				const items = recurringTasks.filter((t) => t.discipline === group.discipline)
				if (items.length === 0) return null
				return (
					<div key={group.discipline}>
						<div className="mb-1 flex items-baseline gap-3">
							<h3 className="text-xl font-medium tracking-[-0.02em] text-foreground">{group.title}</h3>
							<span className="text-sm text-muted">({items.length})</span>
						</div>
						<p className="mb-5 text-sm text-muted">{group.description}</p>
						<div className="grid gap-4 md:grid-cols-2">
							{items.map((task) => (
								<RecurringTaskRow key={task.title} task={task} />
							))}
						</div>
					</div>
				)
			})}
		</div>
	)

	/* ── Fane: Spørgsmål til kunden ── */
	// samlet besked til kunden om nye spørgsmål (kun Horizen ser den)
	const pending = pendingQuestions(noticeState)
	const questionsTab = (
		<div>
			{isHorizen && (
				<QuestionNotice
					count={pending.length}
					sender={sender.name}
					senderPhoto={sender.photo}
					defaultName={noticeState.last?.sentToName || process.env.SEO_CLIENT_NOTIFY_NAME?.trim() || ''}
					defaultTo={noticeState.last?.sentTo || process.env.SEO_CLIENT_NOTIFY_TO?.trim() || ''}
					last={noticeState.last}
				/>
			)}
			{clientQuestions.length === 0 && (
				<div className="rounded-3xl border border-foreground/[0.08] bg-white p-8 text-center">
					<p className="text-sm text-muted">
						Ingen åbne spørgsmål lige nu. Dukker der noget op, vi ikke kan afgøre selv, skriver vi det her.
					</p>
				</div>
			)}
			<ol className="space-y-4">
				{clientQuestions.map((q, i) => (
					<li key={q.question} className="rounded-3xl border border-foreground/[0.08] bg-white p-6">
						<div className="mb-3 flex items-center gap-3">
							<span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground/[0.06] text-sm font-medium text-foreground">
								{i + 1}
							</span>
							<span className="text-xs font-medium tracking-[0.14em] text-foreground/50 uppercase">{q.area}</span>
							{q.askedAt && (
								<span className="text-foreground/40 ms-auto text-xs">
									Spurgt{' '}
									{new Date(q.askedAt).toLocaleDateString('da-DK', { day: 'numeric', month: 'long', year: 'numeric' })}
								</span>
							)}
						</div>
						<p className="text-base leading-snug font-medium text-foreground">{q.question}</p>
						<p className="mt-2 text-sm leading-relaxed text-muted">{q.context}</p>
						{!q.answer && (
							<QuestionAnswer questionKey={questionKey(q)} saved={answers[questionKey(q)]} />
						)}
						{q.answer && (
							<div
								className="mt-4 rounded-2xl p-4"
								style={{ backgroundColor: STATUS_META.done.bg, border: `1px solid ${STATUS_META.done.border}` }}
							>
								<p
									className="text-xs font-medium tracking-[0.14em] uppercase"
									style={{ color: STATUS_META.done.text }}
								>
									Svar ·{' '}
									{new Date(q.answer.date).toLocaleDateString('da-DK', {
										day: 'numeric',
										month: 'long',
										year: 'numeric',
									})}
								</p>
								<p className="mt-1.5 text-sm leading-relaxed text-foreground">{q.answer.text}</p>
							</div>
						)}
					</li>
				))}
			</ol>
		</div>
	)

	// "Nyt siden sidst"-prikker på fanerne: værdien ændrer sig, når der kommer nyt.
	// Tomme lister giver ingen prik.
	const questionsNotify = clientQuestions.length
		? `q${clientQuestions.length}-a${clientQuestions.filter((q) => q.answer || answers[questionKey(q)]).length}`
		: undefined
	const loggedActivity = [...recentActivity, ...pastAdhocActivity]
	const activityNotify = loggedActivity.length
		? `${loggedActivity.length}-${loggedActivity.reduce((m, e) => (e.date > m ? e.date : m), '')}`
		: undefined

	// Overblik: kundens forside. Tal fra Performance, det der sker nu, timer
	// og de seneste aktiviteter.
	const latestSnap = snapshots[0]
	const prevSnap = snapshots[1]
	const pctChange = (a?: number, b?: number) => (a != null && b ? ((a - b) / b) * 100 : null)
	const leadsThisMonth = leadEvents.filter((e) => e.createdAt.startsWith(currentMonthKey)).length
	const aiThisMonth = aiVisits.filter((e) => e.createdAt.startsWith(currentMonthKey)).length
	const snapMonth = latestSnap
		? new Date(`${latestSnap.month}-01T00:00:00`).toLocaleDateString('da-DK', { month: 'long' })
		: null

	const overviewContent = (
		<>
			<div className="mb-8 flex flex-wrap items-end justify-between gap-4">
				<div>
					<h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
						{greeting()}, {BRAND.client}
					</h1>
					<p className="mt-2 text-sm text-foreground/55">
						Her er status på SEO-arbejdet for {BRAND.domain}. {dataUpdatedLabel}
					</p>
				</div>
				<a
					href="#v=analytics"
					className="rounded-full border border-foreground/[0.1] bg-white px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-foreground/[0.06]"
				>
					Se performance →
				</a>
			</div>

			<div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
				<StatCard
					label="Klik fra Google"
					tone="green"
					value={latestSnap?.clicks != null ? latestSnap.clicks.toLocaleString('da-DK') : '–'}
					hint={snapMonth ? `i ${snapMonth}` : 'Kommer efter første måned'}
					delta={pctChange(latestSnap?.clicks, prevSnap?.clicks)}
					icon={<CardIcon d="M9 9l10.5 3.5-4.5 1.5-1.5 4.5zM4 4l3 3M4 10h3M10 4v3" />}
				/>
				<StatCard
					label="Visninger"
					tone="blue"
					value={latestSnap?.impressions != null ? latestSnap.impressions.toLocaleString('da-DK') : '–'}
					hint={snapMonth ? `i Google i ${snapMonth}` : 'Kommer efter første måned'}
					delta={pctChange(latestSnap?.impressions, prevSnap?.impressions)}
					icon={<CardIcon d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />}
				/>
				<StatCard
					label="Henvendelser"
					tone="orange"
					value={siteEventsUnreadable ? '–' : String(leadsThisMonth)}
					hint={`i ${monthLabel} indtil nu`}
					icon={<CardIcon d="M4 4h16v12H7l-3 3zM8 9h8M8 12h5" />}
				/>
				<StatCard
					label="Besøg fra AI"
					tone="violet"
					value={siteEventsUnreadable ? '–' : String(aiThisMonth)}
					hint={`i ${monthLabel} indtil nu`}
					icon={<CardIcon d="M12 3l1.8 4.6L18 9l-4.2 1.4L12 15l-1.8-4.6L6 9l4.2-1.4zM18 15l.9 2.1L21 18l-2.1.9L18 21l-.9-2.1L15 18l2.1-.9z" />}
				/>
			</div>

			<div className="mt-4 grid gap-4 lg:grid-cols-3">
				<div className="lg:col-span-2">
					<FocusNow items={focusItems} />
				</div>
				{/* Horizen har ingen timeaftale med sig selv: uden timer ingen måler */}
				{retainerHours > 0 && <UsageGauge />}
			</div>

			<div className="mt-4">
				<LatestActivity entries={mergedActivity.slice(0, 4)} />
			</div>
		</>
	)

	// Strategi → Teknisk SEO: status på de tekniske punkter + seneste SEO-tjek øverst
	const technicalWithStatus = (
		<>
			<div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
				<StatCard value={counts.done} label="Færdige" tone="green" dot={STATUS_META.done.dot} hint="Tekniske punkter løst" icon={<CardIcon d="M5 12.5l4.5 4.5L19 7.5" />} />
				<StatCard value={counts.partial} label="I gang" tone="orange" dot={STATUS_META.partial.dot} hint="Arbejdes der på nu" icon={<CardIcon d="M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />} />
				<StatCard value={counts.missing} label="Mangler" tone="pink" dot={STATUS_META.missing.dot} hint="Står på listen" icon={<CardIcon d="M12 8v5M12 16.5h.01M10.3 3.9 2.4 17.6A2 2 0 0 0 4.1 20.6h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />} />
				<StatCard value={counts.later} label="Senere" tone="blue" dot={LATER_META.dot} hint="Relevant på et senere tidspunkt" icon={<CardIcon d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />} />
			</div>
			<div className="mt-4 mb-14">
				<SeoCheckStatus run={seoCheckRun} />
			</div>
			{technicalTab}
		</>
	)

	return (
		<DashboardShell
			brand={BRAND}
			signedInAs={viewerName || undefined}
			updatedLabel={dataUpdatedLabel}
			action={<NewTaskButton items={openTasks} />}
			notice={
				viewer === 'horizen' &&
				(asClient ? (
					<div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-foreground/[0.08] bg-white px-5 py-3 text-sm">
						<span className="text-foreground/70">Du ser dashboardet, som kunden ser det.</span>
						<a href="?" className="font-medium text-foreground underline underline-offset-2">
							Tilbage til Horizen-visning
						</a>
					</div>
				) : null)
			}
			defaultItem="overblik"
			nav={withKeys([
				{ id: 'overblik', label: 'Overblik', icon: 'home', content: overviewContent },
				{
					id: 'analytics',
					label: 'Performance',
					icon: 'chart',
					children: [
						{
							id: 'seo',
							label: 'SEO',
							content: <AnalyticsTab snapshots={snapshots} searchTrend={searchTrend} />,
						},
						{
							id: 'besoeg',
							label: 'Besøg',
							content: <VisitsTab visits={visits} isHorizen={isHorizen} />,
						},
						// Kunden ser først fanen, når der er aftalte mål; Horizen altid
						...(goalMonths.length > 0 || isHorizen
							? [{ id: 'maal', label: 'Mål og resultater', content: <GoalsTab /> }]
							: []),
						{ id: 'ai', label: 'AI-søgning', content: <AiSearchTab aiVisits={aiVisits} unreadable={siteEventsUnreadable} isHorizen={isHorizen} /> },
						{
							id: 'henvendelser',
							label: 'Henvendelser',
							content: <LeadsTab leadEvents={leadEvents} snapshots={snapshots} unreadable={siteEventsUnreadable} isHorizen={isHorizen} />,
						},
						{
							id: 'helbred',
							label: 'Sidens helbred',
							content: (
								<HealthTab
									history={pageHealth.history}
									// Horizen kan altid måle; kunden kun hvis det er slået til (data.ts)
									canRun={isHorizen || healthCheckCustomerCanRun}
									example={pageHealth.example}
									// Åben anmodning om optimering (så den ikke sendes to gange)
									optimizeRequestedAt={
										openTasks.find((t) => t.subject === OPTIMIZE_SUBJECT)?.receivedAt
									}
								/>
							),
						},
					],
				},
				{
					// Ad hoc: aktive opgaver + nye opgaver, der sendes samlet
					id: 'opgaver',
					label: 'Opgaver',
					icon: 'tasks',
					meta: openTasks.length ? String(openTasks.length) : undefined,
					content: <OpgaverPanel items={openTasks} signedInAs={viewerName || undefined} />,
				},
				{
					id: 'aktivitet',
					label: 'Aktivitet',
					icon: 'activity',
					content: activityTab,
					notifyKey: 'seo-dashboard-activity-seen',
					notifyValue: activityNotify,
				},
				{
					id: 'spoergsmaal',
					label: 'Spørgsmål',
					icon: 'question',
					content: questionsTab,
					notifyKey: 'seo-dashboard-questions-seen',
					notifyValue: questionsNotify,
				},
				{
					// "Strategi": det, vi gør for kunden (planen, siderne, teknikken, det
					// månedlige arbejde og mulighederne). Kunden kan læse med.
					id: 'projekt',
					label: 'Strategi',
					icon: 'folder',
					alias: ['status'],
					children: [
						{ id: 'plan', label: 'Plan', content: planTab },
						{ id: 'sider', label: 'Sider & søgeord', content: pagesTab },
						{ id: 'teknisk', label: 'Teknisk SEO', content: technicalWithStatus },
						{ id: 'drift', label: 'Løbende drift', content: driftTab },
						{ id: 'tilkoeb', label: 'Muligheder', content: addonTab },
					],
				},
				// Horizens værktøjskasse: vises kun, når Horizen er logget ind.
				...(isHorizen
					? ([
							{ id: 'komigang', label: 'Kom i gang', icon: 'rocket', bottom: true, content: launchTab },
							{
								id: 'beskeder',
								label: 'Beskeder',
								icon: 'mail',
								meta: sentMessages.length ? String(sentMessages.length) : undefined,
								bottom: true,
								content: (
									<MessagesTab
										sender={sender.name}
										senderPhoto={sender.photo}
										defaults={clientMessageDefaults}
										sent={sentMessages}
									/>
								),
							},
							{
								id: 'vaerktoejer',
								label: 'Værktøjer',
								icon: 'tools',
								bottom: true,
								// Generel drejebog for Horizen, ikke kundespecifik.
								children: [
									{
										id: 'oversigt',
										label: 'SEO-oversigt',
										content: <SeoMapTab intro={seoMapIntro} areas={seoMap} />,
									},
									{
										id: 'redskaber',
										label: 'Værktøjer',
										content: <ToolsTab items={seoTools} />,
									},
									{
										id: 'teknikker',
										label: 'Teknikker',
										content: <TechniquesTab items={seoTechniques} />,
									},
								],
							},
							{
								id: 'opsaetning',
								label: 'Opsætning',
								icon: 'settings',
								meta: `${setup.done}/${setup.total}`,
								bottom: true,
								content: <SetupTab auto={setupAuto} checked={setupChecked} />,
							},
						] satisfies ShellItem[])
					: []),
			])}
			footer={
				// Intern note: kun til Horizen, kunden ser den ikke
				isHorizen && (
					<div className="rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] p-6">
						<p className="text-sm leading-relaxed text-muted">
							<span className="font-medium text-foreground">Bemærk:</span> Denne side er intern. Den
							er ikke indekseret af søgemaskiner og ikke linket fra resten af sitet. Indholdet
							opdateres manuelt i data.ts ved hver SEO-ændring.
						</p>
					</div>
				)
			}
		/>
	)
}
