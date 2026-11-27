import { Fragment, cloneElement, isValidElement, type ReactNode } from 'react'
import type { Metadata } from 'next'
import { groq } from 'next-sanity'
import { client } from '@/sanity/lib/client'
import { headers } from 'next/headers'
import { after } from 'next/server'
import {
	DASHBOARD_EMAIL_HEADER,
	DASHBOARD_NAME_HEADER,
	DASHBOARD_USER_HEADER,
} from '@/lib/dashboard-user'
import DashboardTabs from './DashboardTabs'
import PagesTabs from './PagesTabs'
import NewTaskButton from './NewTaskButton'
import LoginActivity from './LoginActivity'
import {
	exampleLogins,
	getDashboardLogins,
	recordDashboardVisit,
	summarizeLogins,
} from '@/lib/dashboardLogins'
import OpgaverPanel from './OpgaverPanel'
import UsageMeter from './UsageMeter'
import BuyHours from './BuyHours'
import SendSolvedMessage from './SendSolvedMessage'
import DashboardShell, { type ShellItem } from './DashboardShell'
import ActivityByMonth, { ActivityKindTag } from './ActivityByMonth'
import TabLink from './TabLink'
import QuestionAnswer, { type SavedAnswer } from './QuestionAnswer'
import WorkspaceNotice from './WorkspaceNotice'
import TodoCard, { type TodoDone, type TodoSeen } from './TodoCard'
import FindingsTab from './FindingsTab'
import MessagesTab, { type SentMessage } from './MessagesTab'
import { senderProfile, type MessageDraft } from './messageText'
import ScoutReport, { type ScoutReportData, type ScoutStep } from './ScoutReport'
import SeoCheckStatus, { type SeoCheckRun } from './SeoCheckStatus'
import TechniquesTab from './TechniquesTab'
import SeoMapTab from './SeoMapTab'
import FocusNow from './FocusNow'
import MonthlyChecklist, { ChecklistCard, type ChecklistDone, type ChecklistHistory } from './MonthlyChecklist'
import DirectoryChecklist, { type DirectoryMark } from './DirectoryChecklist'
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
	SeasonSection,
	SiteEventsUnreadable,
	type AiVisit,
	type LeadEvent,
	uniqueLeads,
	isInquiry,
} from './SiteEventsSections'
import VisitsTab from './VisitsTab'
import { SEASON_HAS_DATA, seasonDataNote, seasonUpdateDue } from './season'
import { LockedTab, SeoInterestButton } from './SeoLocked'
import { getVisits } from '@/lib/visits'
import CompaniesTab from './CompaniesTab'
import { getCompanies } from '@/lib/companies'
import { LATER_META, STATUS_META } from './statusMeta'
import SetupTab, { setupProgress } from './SetupTab'
import { getClientQuestions, getClientTodos } from './clientItems'
import HealthCheck from './HealthCheck'
import KlippekortOrders, { exampleOrders, orderStatusOf } from './KlippekortOrders'
import { OPTIMIZE_SUBJECT, type HealthEntry } from './helbred/types'
import { exampleHistory } from './helbred/example'
import type { SetupAutoKey } from './setup'
import {
	actionItems,
	findings,
	todoIntro,
	clientMessageDefaults,
	clientRecipients,
	clientMessageDrafts,
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
	checklistFor,
	checklistHours,
	retainerHours,
	retainerFor,
	seoIntroFor,
	retainerEndsAfter,
	hourModel,
	seoAgreement,
	seoPackageId,
	specialDeal,
	showSeoOffer,
	klippekortStatus,
	brand,
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

/** Kundens navn og domæne i toppen og i hilsenen. Udfyldes pr. kunde i data.ts (brand). */
const BRAND = brand

/* ─── Ad hoc-opgaver fra Sanity ─────────────────────────────── */

type InboxRow = InboxItem & { updatedAt?: string }

const INBOX_QUERY = groq`*[_type == "seoInboxItem"] | order(receivedAt desc){
	_id, subject, message, fromName, fromEmail, receivedAt, status, priority, handling, estimateHours,
	orderHours, orderPrice, orderStatus, seoInterest,
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
			// Ingen cache: en ny opgave eller bestilling skal stå her med det samme,
			// også hvis mailen om den ikke kommer frem.
			.fetch<InboxRow[]>(INBOX_QUERY, {}, { cache: 'no-store' })
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

/** Opgaver fra "Din to-do", som kunden har markeret som gjort (seoTodoDone), pr. id; fejler blødt til {}. */
async function getTodosDone(): Promise<Record<string, TodoDone>> {
	try {
		const rows = await client
			.withConfig({
				token: process.env.SANITY_API_READ_TOKEN,
				useCdn: false,
				perspective: 'published',
				stega: false,
			})
			.fetch<
				{ id: string; note?: string; by?: string; at: string; consent?: boolean; linkNotes?: { label: string; text: string }[] }[]
			>(
				groq`*[_type == "seoTodoDone" && defined(doneAt)]{ "id": todoId, note, "by": doneBy, "at": doneAt, consent, "linkNotes": linkNotes[]{ label, text } }`,
				{},
				// aldrig fra cachen: en ny markering skal ses ved næste besøg
				{ cache: 'no-store' },
			)
		return Object.fromEntries(
			(rows ?? []).map((r) => [
				r.id,
				{ note: r.note ?? '', by: r.by ?? '', at: r.at, consent: r.consent === true, linkNotes: r.linkNotes ?? [] },
			]),
		)
	} catch (err) {
		console.error('[dashboard] Kunne ikke hente to-do:', err)
		return {}
	}
}

/** Nye opgaver, som kunden har set og lagt på sin to-do-liste (seoTodoSeen), pr. id; fejler blødt til {}. */
async function getTodosSeen(): Promise<Record<string, TodoSeen>> {
	try {
		const rows = await client
			.withConfig({
				token: process.env.SANITY_API_READ_TOKEN,
				useCdn: false,
				perspective: 'published',
				stega: false,
			})
			.fetch<{ id: string; by?: string; at: string }[]>(
				groq`*[_type == "seoTodoSeen" && defined(seenAt)]{ "id": todoId, "by": seenBy, "at": seenAt }`,
				{},
				{ cache: 'no-store' },
			)
		return Object.fromEntries((rows ?? []).map((r) => [r.id, { by: r.by ?? '', at: r.at }]))
	} catch (err) {
		console.error('[dashboard] Kunne ikke hente sete opgaver:', err)
		return {}
	}
}

/**
 * Alt sendt til kunden: beskeder (fanen Beskeder) og beskeder om spørgsmål; fejler blødt.
 * Status (leveret, åbnet, kom ikke frem) gemmes af Resend via
 * /api/resend-webhook, så dashboardet aldrig selv spørger Resend. Det gav 401
 * i Resend-loggen, fordi nøglen kun må sende (Andreas 10/11-2026).
 */
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
					sentAt, sentTo, sentToName, sentBy, subject, html, count, resendId,
					"status": mailStatus
				}`,
				{},
				{ cache: 'no-store' },
			)
		return rows ?? []
	} catch (err) {
		console.error('[dashboard] Kunne ikke hente sendte beskeder:', err)
		return []
	}
}

/**
 * Den måned, tjeklisten gælder for, i dansk tid ('ÅÅÅÅ-MM'). Listen starter
 * forfra den 3., når månedens tal fra Search Console er hentet (cron den 3.);
 * den 1. og 2. hører stadig til forrige måneds gennemgang.
 */
function checklistMonthCph(now = new Date()): string {
	const [y, m, d] = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Copenhagen', year: 'numeric', month: '2-digit', day: '2-digit' })
		.format(now)
		.split('-')
		.map(Number)
	const date = new Date(Date.UTC(y, m - 1 - (d < 3 ? 1 : 0), 1))
	return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`
}

/** Datoen, hvor næste tjekliste starter: den 3. i måneden efter `month`. */
function nextChecklistStart(month: string): string {
	const [y, m] = month.split('-').map(Number)
	return new Date(Date.UTC(y, m, 3)).toLocaleDateString('da-DK', { day: 'numeric', month: 'long', timeZone: 'UTC' })
}

/** Månedens tjekliste (seoMonthlyChecklist) for de seneste måneder; fejler blødt. */
async function getChecklists(): Promise<{ month: string; done: ChecklistDone[] }[]> {
	try {
		const rows = await client
			.withConfig({ token: process.env.SANITY_API_READ_TOKEN, useCdn: false, perspective: 'raw', stega: false })
			.fetch<{ month: string; done: ChecklistDone[] | null }[]>(
				`*[_type == "seoMonthlyChecklist" && defined(month)] | order(month desc)[0...12]{ month, "done": done[]{ stepId, doneAt, doneBy } }`,
				{},
				{ cache: 'no-store' },
			)
		return (rows ?? []).map((r) => ({ month: r.month, done: r.done ?? [] }))
	} catch (err) {
		console.error('[dashboard] Kunne ikke hente tjeklisten:', err)
		return []
	}
}

/**
 * SEO-spejderens månedsrapporter (seoScoutReport, Andreas 27/11-2026); fejler
 * blødt. Godkendte logforslag bliver til poster i aktivitetsloggen, og en
 * kundebesked markeret "klar" bliver en kladde under Beskeder.
 */
async function getScoutReports(): Promise<ScoutReportData[]> {
	try {
		const rows = await client
			.withConfig({ token: process.env.SANITY_API_READ_TOKEN, useCdn: false, perspective: 'raw', stega: false })
			.fetch<ScoutReportData[]>(
				`*[_type == "seoScoutReport" && defined(month) && !(_id in path("drafts.**"))] | order(month desc)[0...12]{
					month, dataMonth, createdAt, summary, steps, actions, releaseId, releaseTitle, releaseCount, logDrafts, message
				}`,
				{},
				{ cache: 'no-store' },
			)
		return rows ?? []
	} catch (err) {
		console.error('[dashboard] Kunne ikke hente SEO-spejderens rapporter:', err)
		return []
	}
}

/** Profiler og kataloger (seoDirectoryChecklist, ét dokument); fejler blødt. */
async function getDirectoryMarks(): Promise<DirectoryMark[]> {
	try {
		const rows = await client
			.withConfig({ token: process.env.SANITY_API_READ_TOKEN, useCdn: false, perspective: 'raw', stega: false })
			.fetch<DirectoryMark[] | null>(
				`*[_id == "seo-directories.status"][0].items[]{ stepId, status, at, by }`,
				{},
				{ cache: 'no-store' },
			)
		return (rows ?? []).filter((r) => r?.stepId && r?.at)
	} catch (err) {
		console.error('[dashboard] Kunne ikke hente profiler og kataloger:', err)
		return []
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
type Balance = { total: number; used: number; left: number }

function UsageGauge({
	viewerName,
	balance,
	latestOrder,
	isHorizen = false,
}: {
	viewerName?: string
	balance: Balance
	latestOrder?: InboxItem
	isHorizen?: boolean
}) {
	if (hourModel === 'klippekort')
		return <KlippekortGauge viewerName={viewerName} balance={balance} latestOrder={latestOrder} isHorizen={isHorizen} />
	const { monthKey, monthName, daysLeft } = copenhagenMonth()
	const used = monthlyUsage[monthKey] ?? 0
	const extra = monthlyExtra[monthKey] ?? 0
	const base = retainerFor(monthKey)
	// Introtilbud (Andreas 25/11-2026): bonustimer oven i rammen, lilla på kortet
	const intro = base > 0 ? seoIntroFor(monthKey) : null
	const bonus = intro?.hours ?? 0
	const total = base + bonus
	const over = used > total
	// Køb flere timer: fremhævet knap, når rammen er brugt eller der ikke
	// længere er en fast aftale; ellers et diskret link.
	const usedUp = total === 0 || used >= total
	const lastMonth = monthKey === retainerEndsAfter
	return (
		<div className="flex h-full flex-col rounded-3xl border border-foreground/[0.08] bg-white p-6">
			<GaugeHeader title={`${seoAgreement ? 'SEO-timer' : 'Timer'} i ${monthName}`} model="Fast aftale" />
			<UsageMeter used={used} total={total} />
			{intro && <IntroHours base={base} bonus={bonus} used={used} start={intro.start} end={intro.end} />}
			<div className="mt-auto space-y-1 text-center text-xs text-foreground/55">
				<p>
					{over ? (
						<span style={{ color: 'var(--st-missing-text)' }}>Rammen er overskredet med {(used - total).toLocaleString('da-DK')} t</span>
					) : (
						`${used.toLocaleString('da-DK')} af ${total.toLocaleString('da-DK')} timer brugt`
					)}
					{extra > 0 && <span style={{ color: 'var(--st-done-text)' }}> · +{extra.toLocaleString('da-DK')} t ekstra uden beregning</span>}
				</p>
				<p>
					{total === 0
						? 'Ingen faste timer i aftalen'
						: lastMonth
							? `Aftalen slutter om ${daysLeft} ${daysLeft === 1 ? 'dag' : 'dage'}`
							: `Nulstiller om ${daysLeft} ${daysLeft === 1 ? 'dag' : 'dage'}`}
				</p>
				{/* Under hinanden med luft, så de to knapper ikke klistrer sammen */}
				<div className="flex flex-col items-center gap-3">
					<BuyHours signedInAs={viewerName} emphasis={usedUp} label="Køb flere udviklingstimer" />
					{showSeoOffer && <SeoInterestButton variant="link" from="Timer" signedInAs={viewerName} />}
				</div>
			</div>
		</div>
	)
}

const INTRO_PURPLE = '#a78bfa'
const introDate = (iso: string) =>
	new Date(`${iso}T12:00:00Z`).toLocaleDateString('da-DK', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })

/**
 * Introtilbuddet på timekortet (Andreas 25/11-2026): én klods pr. time, de
 * almindelige timer i grøn og bonustimerne i lilla. Bonustimerne står først
 * og bruges først (Andreas 25/11-2026: "vi tager altid dem, vi har givet,
 * først"); brugte timer er dæmpet. Perioden står med start- og slutdato, så
 * både kunden og Horizen kan se, hvornår bonussen stopper.
 */
function IntroHours({ base, bonus, used, start, end }: { base: number; bonus: number; used: number; start: string; end: string }) {
	const n = Math.ceil(base + bonus)
	return (
		<div className="mb-4 space-y-2 text-center">
			<div className="flex flex-wrap justify-center gap-1" aria-hidden="true">
				{Array.from({ length: n }, (_, i) => {
					const isBonus = i < bonus
					const color = isBonus ? INTRO_PURPLE : 'rgb(52 211 153)'
					const spent = i < used
					return (
						<span
							key={i}
							className="h-2.5 w-4 rounded-sm"
							style={{
								background: spent ? `color-mix(in srgb, ${color} 25%, transparent)` : color,
								outline: spent ? `1px solid color-mix(in srgb, ${color} 45%, transparent)` : undefined,
							}}
						/>
					)
				})}
			</div>
			<p className="text-xs text-foreground/70">
				<span className="font-medium" style={{ color: INTRO_PURPLE }}>
					{bonus.toLocaleString('da-DK')} t introtilbud
				</span>{' '}
				+ {base.toLocaleString('da-DK')} t
			</p>
			<p className="text-[11px] text-foreground/50">
				Introtilbud {introDate(start)} – {introDate(end)}
			</p>
		</div>
	)
}

/**
 * Øverst i timekortet: titel til venstre, og i højre hjørne hvilken model kunden
 * er på (Klippekort / Fast aftale). SEO-pakken står i mærket på Overblik.
 */
function GaugeHeader({ title, model }: { title: string; model: string }) {
	const pill = 'rounded-full border border-foreground/[0.1] px-2 py-0.5 text-[10px] font-medium text-foreground/60'
	return (
		<div className="flex flex-wrap items-start justify-between gap-2">
			<span className="text-[11px] font-medium tracking-[0.14em] text-foreground/55 uppercase">{title}</span>
			<span className="flex flex-wrap justify-end gap-1">
				<span className={pill}>{model}</span>
			</span>
		</div>
	)
}

/**
 * Klippekort (fra TUG, Andreas 19/11-2026): timer tilbage af de købte timer.
 * Ingen måned og ingen nulstilling; timerne bruges, når kunden har brug for
 * dem. Kunden ser kun antal timer på en bestilling, aldrig beløb.
 */
function KlippekortGauge({
	viewerName,
	balance,
	latestOrder,
	isHorizen,
}: {
	viewerName?: string
	balance: Balance
	latestOrder?: InboxItem
	isHorizen?: boolean
}) {
	const { total, used, left } = balance
	const fmt = (n: number) => n.toLocaleString('da-DK')
	const latestStatus = latestOrder && orderStatusOf(latestOrder)
	const statusText: Record<string, string> = { bestilt: 'bestilt', faktureret: 'faktura sendt', betalt: 'på klippekortet', annulleret: 'annulleret' }
	return (
		<div className="flex h-full flex-col rounded-3xl border border-foreground/[0.08] bg-white p-6">
			<GaugeHeader title="Timer" model="Klippekort" />
			<UsageMeter used={used} total={total} caption={total > 0 ? 'timer tilbage af klippekort' : 'timer'} />
			<div className="mt-auto space-y-1 text-center text-xs text-foreground/55">
				<p>
					{total > 0
						? `${fmt(used)} af ${fmt(total)} købte timer brugt`
						: 'Ingen timer endnu'}
				</p>
				{latestOrder && latestStatus !== 'betalt' && latestStatus !== 'annulleret' ? (
					// Bestilling på vej: kunden kan se, at den er kommet igennem (uden beløb).
					// Kun Horizen får et link til oversigten under Kun Horizen → Klippekort.
					<p>
						{isHorizen ? (
							<a href="#v=klippekort" className="underline underline-offset-2 hover:text-foreground">
								{latestOrder.orderHours} {latestOrder.orderHours === 1 ? 'time' : 'timer'} {statusText[latestStatus ?? 'bestilt']}
							</a>
						) : (
							`${latestOrder.orderHours} ${latestOrder.orderHours === 1 ? 'time' : 'timer'} ${statusText[latestStatus ?? 'bestilt']}`
						)}
					</p>
				) : (
					<p>Timerne bruges, når I har brug for dem</p>
				)}
				{/* Under hinanden med luft, så de to knapper ikke klistrer sammen */}
				<div className="flex flex-col items-center gap-3">
					<BuyHours signedInAs={viewerName} emphasis={left === 0} label={total > 0 ? 'Køb flere udviklingstimer' : 'Køb udviklingstimer'} />
					{showSeoOffer && <SeoInterestButton variant="link" from="Timer" signedInAs={viewerName} />}
				</div>
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
	action,
}: {
	eyebrow: string
	title: string
	description?: string
	/** Valgfri knap i højre side (fx "Send besked" på Aktivitet) */
	action?: ReactNode
}) {
	return (
		<div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
			<div className="min-w-0">
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
			{action && <div className="shrink-0">{action}</div>}
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

/**
 * Fanen Synlighed → Sæsoner: hvornår der søges efter kundens ydelser, til
 * planlægning af SEO og kampagner, med henvendelserne ovenpå (fra Miljøkontoret 20/11-2026).
 * Sæsondata ligger i season.ts og udfyldes pr. kunde.
 */
function SeasonTab({
	leadEvents,
	unreadable,
	isHorizen,
}: {
	leadEvents: LeadEvent[]
	unreadable: boolean
	isHorizen: boolean
}) {
	return (
		<div className="space-y-6">
			<SectionHeading
				eyebrow="Sæsoner"
				title="Hvornår søger folk efter jeres ydelser?"
				description={seasonDataNote()}
			/>
			{seasonUpdateDue() && (
				<span className="-mt-5 inline-flex rounded-full border border-amber-500/30 bg-amber-500/[0.12] px-2.5 py-1 text-xs font-medium text-foreground">
					Sæsontallene skal opdateres
				</span>
			)}
			{/* Kun Horizen: påmindelse om at lægge kundens egne sæsontal ind */}
			{!SEASON_HAS_DATA && isHorizen && (
				<p className="rounded-2xl border border-foreground/[0.08] bg-foreground/[0.03] px-5 py-3 text-xs text-foreground/60">
					Kun Horizen: fanen er tom, indtil kundens ydelser og søgetal er lagt ind i <code>src/app/dashboard/seo/season.ts</code>.
				</p>
			)}
			{unreadable ? (
				<SiteEventsUnreadable isHorizen={isHorizen} />
			) : (
				<SeasonSection events={leadEvents} now={new Date().toISOString()} />
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
	// ?som=kunde = Horizen ser som kunden; ?som=kunde-uden-seo = som en kunde uden SEO-aftale
	const som = (await searchParams).som
	const asClient = som === 'kunde' || som === 'kunde-uden-seo'
	const isHorizen = viewer === 'horizen' && !asClient
	// Uden SEO-aftale er de faner, Horizen selv måler og analyserer, låst (model B
	// "smagsprøve", Andreas 20/11-2026). Data måles stadig; kun visningen er låst.
	// Er SEO-aftalen aktiv i denne visning? (Horizen kan se "som kunde uden SEO-aftale")
	const hasSeo = seoAgreement && som !== 'kunde-uden-seo'
	// Særaftale = fuld adgang uden en SEO-pakke (se specialDeal i data.ts)
	const fullAccess = specialDeal && som !== 'kunde-uden-seo'
	const seoLocked = !isHorizen && !hasSeo && !fullAccess
	// Månedens tjekliste: ved alle SEO-aftaler og særaftaler. Et redskab, ikke et løfte
	const showChecklist = hasSeo || fullAccess
	// Kundens besøg (kun Horizen ser dem, ikonet øverst til højre): gemmes
	// efter svaret, så siden ikke venter. Horizen selv logges aldrig.
	const viewerEmail = requestHeaders.get(DASHBOARD_EMAIL_HEADER) ?? ''
	if (viewer === 'kunde' && viewerEmail)
		after(() => recordDashboardVisit(viewerName, viewerEmail))
	const loginLog = isHorizen ? await getDashboardLogins() : []
	const loginExample = isHorizen && !loginLog.length && process.env.NODE_ENV !== 'production'
	const loginSummary = summarizeLogins(loginExample ? exampleLogins() : loginLog)
	const inbox = await getInboxItems()
	const answers = await getAnswers()
	// Opgaver og spørgsmål: data.ts + dem, der er oprettet i Studio (Andreas 16/11-2026)
	const clientTodos = await getClientTodos()
	const clientQuestions = await getClientQuestions()
	const todosDone = await getTodosDone()
	const todosSeen = await getTodosSeen()
	const checklistMonth = checklistMonthCph()
	const checklists = await getChecklists()
	const scoutReports = await getScoutReports()
	const scoutReport = scoutReports.find((r) => r.month === checklistMonth)
	const scoutSteps: Record<string, ScoutStep> | undefined =
		isHorizen && scoutReport?.steps ? Object.fromEntries(scoutReport.steps.map((st) => [st.stepId, st])) : undefined
	// Godkendte forslag fra spejderen er almindelige poster i aktivitetsloggen; timerne er Horizens egne.
	const scoutLogEntries: ActivityEntry[] = scoutReports.flatMap((r) =>
		(r.logDrafts ?? [])
			.filter((l) => l.status === 'godkendt')
			.map((l) => ({ date: l.date, title: l.title, description: l.description, hours: l.hours || undefined, kind: l.kind ?? 'seo' })),
	)
	// En kundebesked, Andreas har skrevet sin indsigt i og markeret klar, bliver en kladde under Beskeder.
	const scoutDrafts: MessageDraft[] = scoutReports
		.filter((r) => r.message?.status === 'klar' && r.message.intro)
		.map((r) => ({
			id: `spejder-${r.month}`,
			label: `SEO-spejderen: ${r.message?.heading || formatMonth(r.month)}`,
			template: 'fri',
			fields: {
				heading: r.message?.heading ?? '',
				intro: [r.message?.intro, r.message?.insight].filter((t) => t?.trim()).join('\n\n'),
			},
		}))
	const directoryMarks = await getDirectoryMarks()
	const sentMessages = isHorizen ? await getSentMessages() : []
	const [snapshots, seoCheckRun, leadRows, aiRows, searchTrend, pageHealth, visits, companies] = await Promise.all([
		getSnapshots(),
		getSeoCheckRun(),
		getSiteEvents<LeadEvent>('leadEvent', 'type, path, source, createdAt'),
		getSiteEvents<AiVisit>('aiVisit', 'source, path, createdAt'),
		getSearchTrend(),
		getPageHealth(),
		// Besøg: egne tal uden cookies + GA4 for dagene før (src/lib/visits.ts)
		getVisits(),
		// Virksomheder ud fra netværket (src/lib/companies.ts)
		getCompanies(),
	])
	const leadEvents = leadRows ?? []
	const aiVisits = aiRows ?? []
	const siteEventsUnreadable = leadRows === null || aiRows === null
	const setupAuto = getSetupAuto({ snapshots, leadEvents, seoCheckRun })
	const setup = setupProgress(setupAuto, setupChecked)
	// Åbne opgaver → "Ad hoc"-fanen; løste → Aktivitet.
	// Bestillinger af klippekort-timer står under Kun Horizen → Klippekort, ikke
	// blandt opgaverne og ikke i aktivitetsloggen. SEO-interesser ("Få en
	// SEO-aftale") går som mail til Horizen og står kun blandt opgaverne for Horizen
	// (SEO-typerne er skjult i Studio-menuen), ikke for kunden.
	const hourOrders = inbox.filter((t) => t.orderHours)
	const taskInbox = inbox.filter((t) => !t.orderHours && (isHorizen || !t.seoInterest))
	const paidOrderHours = hourOrders
		.filter((o) => orderStatusOf(o) === 'betalt')
		.reduce((a, o) => a + (o.orderHours ?? 0), 0)
	const balance = klippekortStatus(paidOrderHours)
	// Lokalt (uden bestillinger i production) vises eksempler under Kun Horizen → Klippekort
	const orderExample = isHorizen && !hourOrders.length && process.env.NODE_ENV !== 'production'
	const openTasks: InboxItem[] = taskInbox.filter((t) => t.status !== 'loest')
	// Løste opgaver som egen tidslinje (dato = seneste ændring = "løst"-tidspunkt).
	// Opgaver, som en post i pastAdhocActivity allerede beskriver, vises ikke igen.
	const describedTasks = new Set(pastAdhocActivity.map((e) => e.taskId).filter(Boolean))
	const solvedTaskEntries: ActivityEntry[] = taskInbox
		.filter((t) => t.status === 'loest' && !describedTasks.has(t._id))
		.map((t) => ({
			date: (t.updatedAt ?? t.receivedAt ?? lastUpdated).slice(0, 10),
			title: t.subject || '(uden emne)',
			description: t.message,
			hours: t.estimateHours,
		}))
	// Mærket "SEO" eller "Udvikling": listen bestemmer, medmindre posten selv siger andet.
	const seoEntries: ActivityEntry[] = [
		...recentActivity.map((e) => ({ ...e, kind: e.kind ?? 'seo' })),
		...scoutLogEntries.filter((e) => e.kind === 'seo'),
	].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
	const devEntries: ActivityEntry[] = [
		...pastAdhocActivity.map((e) => ({ ...e, kind: e.kind ?? 'udvikling' })),
		...scoutLogEntries.filter((e) => e.kind === 'udvikling'),
	]
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
				// Kun Horizen: send "Opgaverne er løst" direkte herfra (fra TUG, Andreas 19/11-2026)
				action={isHorizen ? <SendSolvedMessage recipients={clientRecipients} /> : undefined}
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

	/* ── Fane: Profiler og kataloger (ved opstart og én gang om året) ── */
	const directoriesTab = (
		<div className="space-y-12">
			<SectionHeading
				eyebrow="Profiler og kataloger"
				title="Jeres profiler på Google, Krak og de andre kataloger"
				description="Den faste rute gennem jeres profiler på kort, i kataloger og på sociale medier. Gennemgås, når vi starter, og derefter én gang om året."
			/>
			<DirectoryChecklist initial={directoryMarks} editable={isHorizen} />
		</div>
	)

	/* ── Fane: Løbende drift (den månedlige SEO-motor) ── */
	const checklistPhases = checklistFor(checklistMonth)
	const checklistHistory: ChecklistHistory[] = checklists
		.filter((c) => c.month < checklistMonth)
		.map((c) => {
			const ids = new Set(checklistFor(c.month).flatMap((p) => p.steps.map((st) => st.id)))
			return {
				month: formatMonth(c.month),
				done: c.done.filter((d) => ids.has(d.stepId)).length,
				total: ids.size,
			}
		})
	// Månedens gennemgang (Andreas 27/11-2026): SEO-spejderens rapport og tjeklisten
	// med spejderens noter. Står KUN under Kun Horizen, så kunden aldrig ser, at en
	// agent har lavet forarbejdet. Kunden ser den neutrale tjekliste under Løbende drift.
	const reviewTab = (
		<div className="space-y-12">
			<SectionHeading
				eyebrow="Kun Horizen"
				title="Månedens gennemgang"
				description="SEO-spejderens forarbejde til månedens tjekliste: rapporten, forslag til aktivitetsloggen, kundebeskeden og noterne pr. trin. Kunden ser kun den neutrale tjekliste under Strategi → Løbende drift og de logposter, du godkender."
			/>
			{scoutReport ? (
				<ScoutReport
					report={scoutReport}
					monthLabel={formatMonth(checklistMonth)}
					dataMonthLabel={scoutReport.dataMonth ? formatMonth(scoutReport.dataMonth) : undefined}
				/>
			) : (
				<p className="rounded-2xl border border-foreground/[0.08] bg-foreground/[0.03] px-5 py-4 text-sm text-foreground/70">
					Der er ingen rapport fra SEO-spejderen for {formatMonth(checklistMonth).toLowerCase()} endnu. Den kommer den 4. i måneden om natten.
				</p>
			)}
			<MonthlyChecklist
				month={checklistMonth}
				monthLabel={formatMonth(checklistMonth)}
				phases={checklistPhases}
				initialDone={checklists.find((c) => c.month === checklistMonth)?.done ?? []}
				editable
				hours={checklistHours}
				history={checklistHistory}
				scoutSteps={scoutSteps}
			/>
		</div>
	)

	const driftTab = (
		<div className="space-y-12">
			<SectionHeading
				eyebrow="Løbende drift"
				title="Månedens tjekliste"
				description="Den faste rute gennem den månedlige SEO-gennemgang. Klik på et trin for at se, hvad det dækker."
			/>
			{showChecklist ? (
				<MonthlyChecklist
					month={checklistMonth}
					monthLabel={formatMonth(checklistMonth)}
					phases={checklistPhases}
					initialDone={checklists.find((c) => c.month === checklistMonth)?.done ?? []}
					editable={isHorizen}
					hours={checklistHours}
					history={checklistHistory}
				/>
			) : (
				// Uden månedlig gennemgang: tjeklisten vises roligt og kan ikke bruges (fra TUG, Andreas 19/11-2026).
				// Venlig tone (Andreas 20/11-2026): vi snakker aldrig ned til kunden.
				<div className="space-y-4">
					<p className="rounded-2xl border border-foreground/[0.08] bg-foreground/[0.03] px-5 py-4 text-sm text-foreground/70">
						Her kan I se de trin, vi går igennem, når vi laver en månedlig SEO-gennemgang. Den hører til vores
						SEO-pakker, og I er altid velkomne til at spørge, hvis I kunne tænke jer den.
					</p>
					<div inert className="pointer-events-none opacity-45 grayscale select-none">
						<MonthlyChecklist
							month={checklistMonth}
							monthLabel={formatMonth(checklistMonth)}
							phases={checklistPhases}
							initialDone={[]}
							editable={false}
							hours={checklistHours}
							history={[]}
						/>
					</div>
				</div>
			)}
			<FoldSection title="Den månedlige SEO-motor" summary={driftIntro}>
				<div className="space-y-12 pt-4">
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
			</FoldSection>
		</div>
	)

	const isAnswered = (q: (typeof clientQuestions)[number]) => Boolean(q.answer || answers[questionKey(q)])
	const openQuestionList = clientQuestions.filter((q) => !isAnswered(q))
	const answeredQuestionList = clientQuestions.filter(isAnswered)

	/* Ét spørgsmål som foldbart kort. Besvarede vises mindre og afdæmpede
	   under "Besvaret", som historik (Andreas 16/11-2026). */
	const renderQuestion = (q: (typeof clientQuestions)[number], i: number) => {
		const answered = isAnswered(q)
		const status = answered
			? { label: 'Besvaret', dot: 'color-mix(in srgb, var(--color-foreground) 30%, transparent)' }
			: { label: 'Venter på dit svar', dot: 'var(--st-partial-dot)' }
		return (
		<li key={q.question} className="rounded-3xl border border-foreground/[0.08] bg-white">
			<details name="spoergsmaal" className="group">
			<summary className={`flex cursor-pointer list-none items-start gap-3 [&::-webkit-details-marker]:hidden ${answered ? 'p-4 md:px-5' : 'p-5 md:p-6'}`}>
				<span
					className={`flex shrink-0 items-center justify-center rounded-full bg-foreground/[0.06] font-medium text-foreground ${answered ? 'h-6 w-6 text-xs text-foreground/55' : 'h-7 w-7 text-sm'}`}
				>
					{answered ? (
						<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
							<path d="M5 12.5l4.5 4.5L19 7.5" />
						</svg>
					) : (
						i + 1
					)}
				</span>
				<span className="min-w-0 flex-1">
					<span className="flex flex-wrap items-center gap-x-3 gap-y-1">
						<span className="text-xs font-medium tracking-[0.14em] text-foreground/50 uppercase">{q.area}</span>
						<span className="flex items-center gap-1.5 text-xs text-foreground/55">
							<span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: status.dot }} />
							{status.label}
						</span>
					</span>
					<span
						className={`mt-1.5 block leading-snug ${answered ? 'text-sm text-foreground/70' : 'text-base font-medium text-foreground'}`}
					>
						{q.question}
					</span>
				</span>
				<svg
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-hidden
					className="mt-1 shrink-0 text-foreground/45 transition-transform group-open:rotate-180"
				>
					<path d="m6 9 6 6 6-6" />
				</svg>
			</summary>
			<div className={answered ? 'px-4 pb-4 md:px-5' : 'px-5 pb-5 md:px-6 md:pb-6'}>
			{q.askedAt && (
				<p className="text-foreground/40 text-xs">
					Sendt{' '}
					{new Date(q.askedAt).toLocaleDateString('da-DK', { day: 'numeric', month: 'long', year: 'numeric' })}
				</p>
			)}
			{/* Forklaringen i en lyseblå boks, så den skiller sig ud */}
			<div
				className="mt-3 rounded-2xl border p-4"
				style={{ backgroundColor: 'var(--st-info-bg)', borderColor: 'var(--st-info-border)' }}
			>
				<p className="text-xs font-semibold tracking-[0.14em] uppercase" style={{ color: 'var(--st-info-text)' }}>
					Derfor spørger vi
				</p>
				<p className="mt-1.5 text-sm leading-relaxed text-foreground/90">{q.context}</p>
			</div>
			{!q.answer && (
				<QuestionAnswer questionKey={questionKey(q)} saved={answers[questionKey(q)]} />
			)}
			{/* Svaret neutralt og afdæmpet: den blå forklaring skal dominere,
			    og grøn her gav for mange farver */}
			{q.answer && (
				<div
					className="mt-4 rounded-2xl border border-foreground/[0.08] p-4"
					style={{ backgroundColor: 'color-mix(in srgb, var(--color-foreground) 3%, transparent)' }}
				>
					<p className="text-xs font-medium tracking-[0.14em] text-foreground/45 uppercase">
						Svar ·{' '}
						{new Date(q.answer.date).toLocaleDateString('da-DK', {
							day: 'numeric',
							month: 'long',
							year: 'numeric',
					})}
				</p>
				<p className="mt-1.5 text-sm leading-relaxed text-foreground/75">{q.answer.text}</p>
			</div>
			)}
			</div>
			</details>
		</li>
		)
	}

	/* ── Fane: Spørgsmål til kunden ── */
	// samlet besked til kunden om nye spørgsmål (kun Horizen ser den)
	const questionsTab = (
		<div>
			{/* Reglen for arbejdsrummet: Spørgsmål = vi skal bruge din viden, du
			    svarer med ord. Din to-do = du gør noget. */}
			<SectionHeading
				eyebrow="Spørgsmål"
				title="Her har vi brug for din viden"
				description="Fold et spørgsmål ud, og skriv svaret direkte under det. Det kan altid rettes bagefter."
			/>
			{/* Andreas 16/11: én generel besked i stedet for "Send besked om N
			    spørgsmål". Åbner Beskeder med "Nyt i dit arbejdsrum" valgt. */}
			{isHorizen && <WorkspaceNotice />}
			{openQuestionList.length === 0 && (
				<div className="rounded-3xl border border-foreground/[0.08] bg-white p-8 text-center">
					<p className="text-sm text-muted">
						Ingen åbne spørgsmål lige nu. Dukker der noget op, vi ikke kan afgøre selv, skriver vi det her.
					</p>
				</div>
			)}
			{/* Foldbare spørgsmål: kun spørgsmål og status ses sammenfoldet; ét
			    åbent ad gangen (details med fælles name). */}
			<ol className="space-y-3">
				{openQuestionList.map((q, i) => renderQuestion(q, i))}
			</ol>
			{answeredQuestionList.length > 0 && (
				<section className="mt-10">
					<p className="mb-3 px-1 text-xs font-medium tracking-[0.14em] text-foreground/45 uppercase">
						Besvaret ({answeredQuestionList.length})
					</p>
					<ol className="space-y-2">
						{answeredQuestionList.map((q, i) => renderQuestion(q, i))}
					</ol>
				</section>
			)}
		</div>
	)

	/* ── Faner: Nye opgaver (Indbakke) + Jeres opgaver (Opgaver) (Andreas 15/11 + 16/11-2026) ──
	   Indbakken viser kun det nye. "Set, læg på min liste" flytter en opgave til
	   Opgaver → Jeres opgaver, som kunden tager i sit eget tempo; klarede ligger nederst
	   under "Klaret". Rækkefølgen i data.ts er prioriteten. */
	const isTodoDone = (id: string) => Boolean(todosDone[id] || clientTodos.find((t) => t.id === id)?.closed)
	const indexedTodos = clientTodos.map((t, i) => ({ t, i }))
	const newTodoList = indexedTodos.filter(({ t }) => !isTodoDone(t.id) && !todosSeen[t.id])
	const listTodoList = indexedTodos.filter(({ t }) => !isTodoDone(t.id) && todosSeen[t.id])
	// Historik: senest klarede øverst (Andreas 16/11-2026)
	const doneAt = (id: string) => todosDone[id]?.at ?? clientTodos.find((t) => t.id === id)?.closed?.date ?? ''
	const doneTodoList = indexedTodos
		.filter(({ t }) => isTodoDone(t.id))
		.sort((a, b) => doneAt(b.t.id).localeCompare(doneAt(a.t.id)))
	const openTodos = newTodoList.length + listTodoList.length
	const newTodos = newTodoList.length
	const listTodos = listTodoList.length
	// "Vigtigst nu": de første på listen vises tydeligt, resten er foldet sammen
	const TOP_TODOS = 3
	// Ubesvarede spørgsmål: tallet ved "Spørgsmål", så kunden kan se, at der
	// ligger noget (Andreas 16/11-2026: ellers tror han, den er tom).
	const openQuestions = openQuestionList.length
	const todoCard = ({ t }: { t: (typeof clientTodos)[number] }, n: number) => (
		<TodoCard key={t.id} todo={t} index={n} done={todosDone[t.id]} seen={todosSeen[t.id]} />
	)
	const smallHeading = (text: string) => (
		<p className="mb-3 px-1 text-xs font-medium tracking-[0.14em] text-foreground/45 uppercase">{text}</p>
	)

	const newTodosTab = (
		<div>
			<SectionHeading
				eyebrow="Nye opgaver"
				title="Nyt fra os"
				description={'Fold en opgave ud for at se, hvad den handler om. Tryk "Set, læg på min liste", så flytter den over på din liste under Opgaver → Jeres opgaver, og den tager du, når du har tid.'}
			/>
			{newTodos === 0 ? (
				<div className="rounded-3xl border border-foreground/[0.08] bg-white p-8 text-center">
					<p className="text-sm text-muted">
						Ingen nye opgaver lige nu. Dem, du har set, ligger under Opgaver → Jeres opgaver.
					</p>
				</div>
			) : (
				<ol className="space-y-4">{newTodoList.map((x, n) => todoCard(x, n))}</ol>
			)}
			{listTodos > 0 && (
				<a
					href="#v=opgaver&s=jeres-opgaver"
					className="group mt-6 inline-flex items-center gap-2 px-1 text-sm font-medium text-foreground/70 hover:text-foreground"
				>
					Gå til Jeres opgaver ({listTodos})
					<span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
				</a>
			)}
		</div>
	)

	const todoTab = (
		<div>
			<SectionHeading
				eyebrow="Jeres opgaver"
				title="Det, du har lagt på din liste"
				description={'Tag opgaverne, når du har tid. Fold en opgave ud for at se, hvad vi har brug for, og tryk på knappen, når den er klaret.'}
			/>
			{listTodos > 0 ? (
				<div
					className="mb-6 rounded-3xl border p-6"
					style={{ backgroundColor: 'var(--st-partial-bg)', borderColor: 'var(--st-partial-border)' }}
				>
					<p className="text-xs font-medium tracking-[0.14em] uppercase" style={{ color: 'var(--st-partial-text)' }}>
						{listTodos === 1 ? '1 opgave på listen' : `${listTodos} opgaver på listen`}
					</p>
					<p className="mt-2 text-sm leading-relaxed text-foreground/85">{todoIntro}</p>
				</div>
			) : (
				<div className="mb-6 rounded-3xl border border-foreground/[0.08] bg-white p-8 text-center">
					<p className="text-sm text-muted">
						{newTodos > 0
							? 'Listen er tom. Når du har set en ny opgave, lægger den sig her.'
							: 'Der er ikke noget på din liste lige nu.'}
					</p>
				</div>
			)}
			{listTodos > TOP_TODOS && smallHeading('Vigtigst nu')}
			{listTodos > 0 && (
				<ol className="space-y-4">{listTodoList.slice(0, TOP_TODOS).map((x, n) => todoCard(x, n))}</ol>
			)}
			{listTodos > TOP_TODOS && (
				<details className="group/rest mt-6">
					<summary className="flex cursor-pointer list-none items-center gap-2 px-1 text-xs font-medium tracking-[0.14em] text-foreground/55 uppercase [&::-webkit-details-marker]:hidden">
						Resten af listen ({listTodos - TOP_TODOS})
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="transition-transform group-open/rest:rotate-180">
							<path d="m6 9 6 6 6-6" />
						</svg>
					</summary>
					<ol className="mt-3 space-y-4">
						{listTodoList.slice(TOP_TODOS).map((x, n) => todoCard(x, n + TOP_TODOS))}
					</ol>
				</details>
			)}
			{doneTodoList.length > 0 && (
				<section className="mt-10">
					{smallHeading(`Klaret (${doneTodoList.length})`)}
					<ol className="space-y-2">{doneTodoList.map((x, n) => todoCard(x, n))}</ol>
				</section>
			)}
		</div>
	)

	// "Nyt siden sidst"-prikker på fanerne: værdien ændrer sig, når der kommer nyt.
	// Tomme lister giver ingen prik. Arbejdsrummet dækker både spørgsmål og to-do.
	const questionsNotify =
		clientQuestions.length || clientTodos.length
			? `q${clientQuestions.length}-a${clientQuestions.filter((q) => q.answer || answers[questionKey(q)]).length}-t${clientTodos.length}-d${clientTodos.length - openTodos}`
			: undefined
	const loggedActivity = [...recentActivity, ...pastAdhocActivity, ...scoutLogEntries]
	const activityNotify = loggedActivity.length
		? `${loggedActivity.length}-${loggedActivity.reduce((m, e) => (e.date > m ? e.date : m), '')}`
		: undefined

	// Overblik: kundens forside. Tal fra Performance, det der sker nu, timer
	// og de seneste aktiviteter.
	const latestSnap = snapshots[0]
	const prevSnap = snapshots[1]
	const pctChange = (a?: number, b?: number) => (a != null && b ? ((a - b) / b) * 100 : null)
	// Klik på book tid og til kontakt tælles ikke som henvendelser (isInquiry)
	const leadsThisMonth = uniqueLeads(leadEvents).filter((e) => isInquiry(e) && e.createdAt.startsWith(currentMonthKey)).length
	const aiThisMonth = aiVisits.filter((e) => e.createdAt.startsWith(currentMonthKey)).length
	const companiesThisMonth = companies?.periods?.thisMonth?.companies?.length ?? 0
	const locked = (tab: ReactNode) => (seoLocked ? undefined : tab)
	const lockedTabs = {
		maal: (
			<LockedTab
				eyebrow="Mål og resultater"
				title="Aftalte mål, fulgt måned for måned"
				points={[
					'Konkrete mål for synlighed og henvendelser, aftalt med jer',
					'Status hver måned: er vi på vej, eller skal planen justeres?',
					'Resultaterne samlet ét sted, så I kan se, hvad indsatsen giver',
				]}
				preview="list"
				signedInAs={viewerName || undefined}
			/>
		),
		ai: (
			<LockedTab
				eyebrow="AI-søgning"
				title="Bliver I fundet via ChatGPT og andre AI-tjenester?"
				teaser={
					aiThisMonth > 0 ? (
						<>
							Der er kommet <strong>{aiThisMonth} {aiThisMonth === 1 ? 'besøg' : 'besøg'}</strong> fra AI-tjenester som ChatGPT og Perplexity i {monthLabel}.
						</>
					) : (
						<>Vi måler, hvor mange der finder jer via AI-tjenester som ChatGPT og Perplexity.</>
					)
				}
				points={[
					'Hvilke AI-tjenester der sender besøgende til jer',
					'Hvilke sider de lander på, måned for måned',
					'Hvordan I bliver nævnt i AI-svar, og hvad vi gør for at blive det oftere',
				]}
				preview="chart"
				signedInAs={viewerName || undefined}
			/>
		),
		saeson: (
			<LockedTab
				eyebrow="Sæsoner"
				title="Hvornår søger folk efter jeres ydelser?"
				teaser={<>Se, hvornår der søges mest efter hver af jeres ydelser, så kampagner og indhold kører, før søgningerne topper.</>}
				points={[
					'Årshjul med søgninger pr. måned for hver ydelse',
					'Hvornår en kampagne bør starte',
					'Jeres henvendelser lagt oven på sæsonen, så I kan se, om et fald skyldes årstiden',
				]}
				preview="grid"
				signedInAs={viewerName || undefined}
			/>
		),
		virksomheder: (
			<LockedTab
				eyebrow="Virksomheder"
				title="Hvilke virksomheder besøger jer?"
				teaser={
					companiesThisMonth > 0 ? (
						<>
							<strong>{companiesThisMonth} {companiesThisMonth === 1 ? 'virksomhed' : 'virksomheder'}</strong> har besøgt jeres hjemmeside i {monthLabel}.
						</>
					) : (
						<>Vi måler, hvilke virksomheder der besøger jeres hjemmeside.</>
					)
				}
				points={[
					'Navnene på de virksomheder, der har besøgt jer',
					'Hvilke sider de har kigget på, og hvor længe',
					'Hvem der kommer igen, så I ved, hvem der er varme emner',
				]}
				preview="list"
				signedInAs={viewerName || undefined}
			/>
		),
		plan: (
			<LockedTab
				eyebrow="Plan"
				title="Planen for jeres SEO"
				teaser={<>Hvad vi gør, i hvilken rækkefølge, og hvorfor, så I altid kan se, hvor indsatsen er på vej hen.</>}
				points={[
					'Prioriteret plan måned for måned',
					'Hvad der er gjort, og hvad der er det næste',
					'Begrundelsen bag hvert skridt',
				]}
				preview="list"
				signedInAs={viewerName || undefined}
			/>
		),
		sider: (
			<LockedTab
				eyebrow="Sider & søgeord"
				title="Hvilke søgninger skal hver side findes på?"
				teaser={<>Hver side får sine egne søgeord, valgt ud fra, hvad jeres kunder faktisk søger efter.</>}
				points={[
					'Søgeord pr. side med søgetal og konkurrence',
					'Status for hver side: hvad er gjort, og hvad mangler',
					'Sikring af, at jeres egne sider ikke konkurrerer om de samme søgninger',
				]}
				preview="list"
				signedInAs={viewerName || undefined}
			/>
		),
		teknisk: (
			<LockedTab
				eyebrow="Teknisk SEO"
				title="Er hjemmesiden teknisk i orden for Google?"
				teaser={<>Vi gennemgår det tekniske, som Google lægger vægt på: hastighed, fejl, struktur og data om jeres virksomhed.</>}
				points={[
					'Liste over tekniske punkter med status',
					'Hvad der er rettet, og hvad der står for tur',
					'Automatisk SEO-tjek af alle sider',
				]}
				preview="list"
				signedInAs={viewerName || undefined}
			/>
		),
		drift: (
			<LockedTab
				eyebrow="Løbende drift"
				title="Det faste månedlige SEO-arbejde"
				teaser={<>Hver måned gennemgår vi tallene, søgeordene og hjemmesiden efter en fast tjekliste.</>}
				points={[
					'Månedens tjekliste med status for hvert trin',
					'Det tilbagevendende arbejde, der bygger synlighed over tid',
					'Fund fra gennemgangen og det næste skridt',
				]}
				preview="list"
				signedInAs={viewerName || undefined}
			/>
		),
		kataloger: (
			<LockedTab
				eyebrow="Profiler og kataloger"
				title="Står I det samme alle steder?"
				teaser={<>Google stoler mere på jer, når navn, adresse og telefon står ens på Google, Bing, Apple, Krak og de andre kataloger.</>}
				points={[
					'En fast rute gennem jeres profiler på kort, i kataloger og på sociale medier',
					'Status for hvert punkt, så I kan se, hvad der er på plads',
					'Et tjek én gang om året, og med det samme, når I ændrer noget',
				]}
				preview="list"
				signedInAs={viewerName || undefined}
			/>
		),
		muligheder: (
			<LockedTab
				eyebrow="Muligheder"
				title="Hvad kan give jer endnu mere synlighed?"
				teaser={<>Forslag til nye sider, indhold og tiltag, vi ser muligheder i for jeres hjemmeside.</>}
				points={[
					'Konkrete forslag med vores vurdering af effekten',
					'Groft tidsoverslag på hvert forslag',
					'Det, der kan tilkøbes ud over den faste aftale',
				]}
				preview="grid"
				signedInAs={viewerName || undefined}
			/>
		),
		henvendelser: (
			<LockedTab
				eyebrow="Henvendelser"
				title="Hvornår og hvorfra kommer jeres henvendelser?"
				teaser={
					leadsThisMonth > 0 ? (
						<>
							I har fået <strong>{leadsThisMonth} {leadsThisMonth === 1 ? 'henvendelse' : 'henvendelser'}</strong> via hjemmesiden i {monthLabel}.
						</>
					) : (
						<>Vi måler opkald, mails og formularer fra jeres hjemmeside.</>
					)
				}
				points={[
					'Hver henvendelse med dag og klokkeslæt',
					'Om I ligger foran eller bagud i forhold til sidste måned',
					'Hvor de kom fra (Google, annoncer, AI) og fra hvilke sider',
				]}
				preview="chart"
				signedInAs={viewerName || undefined}
			/>
		),
	}
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
					{/* Kundens SEO-pakke med emblem; kun ved en aktiv SEO-aftale. Klik = se pakken
					    eller opgradere (Andreas 20/11-2026: på Overblik, det første kunden ser) */}
					{hasSeo && (
						<div className="mt-4">
							<SeoInterestButton variant="badge" currentId={seoPackageId} currentHours={retainerHours} from="Overblik" signedInAs={viewerName || undefined} />
						</div>
					)}
					{/* Særaftale: kun Horizen ser mærket, så vi kan se, hvad kunden kører på */}
					{!hasSeo && fullAccess && isHorizen && (
						<div className="mt-4">
							<span
								className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/[0.08] px-3 py-1.5 text-xs font-medium text-foreground"
								title="Kun Horizen ser dette mærke"
							>
								Særaftale
							</span>
						</div>
					)}
				</div>
				<a
					href="#v=analytics"
					className="rounded-full border border-foreground/[0.1] bg-white px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-foreground/[0.06]"
				>
					Se synlighed →
				</a>
			</div>

			{/* Det, der venter på kunden, øverst og tydeligt, men kompakt: ellers
			    opdager kunden ikke to-do-listen */}
			{openTodos > 0 && (
				<a
					href={newTodos > 0 ? '#v=arbejdsrum&s=nye-opgaver' : '#v=opgaver&s=jeres-opgaver'}
					className="group mb-6 flex flex-wrap items-center gap-4 rounded-3xl border p-4 transition-colors md:flex-nowrap md:p-5"
					style={{ backgroundColor: 'var(--st-partial-bg)', borderColor: 'var(--st-partial-border)' }}
				>
					<span
						className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg font-semibold tabular-nums"
						style={{ backgroundColor: 'var(--st-partial-dot)', color: '#1a1a1a' }}
					>
						{openTodos}
					</span>
					<span className="min-w-0 flex-1 basis-48">
						<span className="block text-base font-semibold text-foreground">
							{openTodos === 1 ? '1 opgave venter på dig' : `${openTodos} opgaver venter på dig`}
						</span>
						<span className="mt-0.5 block text-sm text-foreground/65">
							{clientTodos
								.filter((t) => !isTodoDone(t.id))
								.map((t) => t.area)
								.join(' · ')}
						</span>
					</span>
					<span
						className="w-full shrink-0 rounded-full px-5 py-2.5 text-center text-sm font-medium transition-transform group-hover:translate-x-0.5 md:w-auto"
						style={{ backgroundColor: 'var(--color-foreground)', color: 'var(--color-background)' }}
					>
						Se din to-do →
					</span>
				</a>
			)}

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
				{/* Horizens eget site: ingen timeaftale med sig selv, så ingen timemåler og intet timekøb */}
				{retainerHours > 0 && (
					<UsageGauge viewerName={viewerName || undefined} balance={balance} latestOrder={hourOrders[0]} isHorizen={isHorizen} />
				)}
			</div>

			{/* Ved alle SEO-aftaler og særaftaler (Andreas 20/11-2026) */}
			{showChecklist && (
				<div className="mt-4">
					<ChecklistCard
						monthLabel={formatMonth(checklistMonth)}
						phases={checklistPhases}
						done={checklists.find((c) => c.month === checklistMonth)?.done ?? []}
						hours={checklistHours}
						nextStart={nextChecklistStart(checklistMonth)}
					/>
				</div>
			)}

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
			action={
				<>
					{isHorizen && <LoginActivity summary={loginSummary} example={loginExample} />}
					<NewTaskButton items={openTasks} />
				</>
			}
			notice={
				viewer === 'horizen' &&
				(asClient ? (
					<div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-foreground/[0.08] bg-white px-5 py-3 text-sm">
						<span className="text-foreground/70">
							Du ser dashboardet, som kunden ser det
							{hasSeo ? '' : fullAccess ? ' med særaftale' : ' uden en SEO-aftale'}.
						</span>
						<span className="flex flex-wrap gap-4">
							{/* Kun når kunden har en SEO-aftale: så kan Horizen se, hvordan det ser ud uden */}
							{seoAgreement && (
								<a
									href={som === 'kunde-uden-seo' ? '?som=kunde' : '?som=kunde-uden-seo'}
									className="text-foreground/70 underline underline-offset-2"
								>
									{som === 'kunde-uden-seo' ? 'Se med SEO-aftale' : 'Se uden SEO-aftale'}
								</a>
							)}
							<a href="?" className="font-medium text-foreground underline underline-offset-2">
								Tilbage til Horizen-visning
							</a>
						</span>
					</div>
				) : null)
			}
			defaultItem="overblik"
			nav={withKeys([
				{ id: 'overblik', label: 'Overblik', icon: 'home', content: overviewContent },
				{
					id: 'analytics',
					label: 'Synlighed',
					icon: 'chart',
					children: [
						{
							id: 'seo',
							label: 'SEO',
							content: <AnalyticsTab snapshots={snapshots} searchTrend={searchTrend} />,
						},
						// Kunden ser først fanen, når der er aftalte mål; Horizen altid
						...(goalMonths.length > 0 || isHorizen || seoLocked
							? [{ id: 'maal', label: 'Mål og resultater', locked: seoLocked, content: locked(<GoalsTab />) ?? lockedTabs.maal }]
							: []),
						{ id: 'ai', label: 'AI-søgning', locked: seoLocked, content: locked(<AiSearchTab aiVisits={aiVisits} unreadable={siteEventsUnreadable} isHorizen={isHorizen} />) ?? lockedTabs.ai },
						// Uden kundens egne sæsontal er fanen tom (ingen eksempeltal, Andreas 20/11-2026)
						{
							id: 'saeson',
							label: 'Sæsoner',
							locked: seoLocked,
							content:
								locked(<SeasonTab leadEvents={leadEvents} unreadable={siteEventsUnreadable} isHorizen={isHorizen} />) ??
								lockedTabs.saeson,
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
					// Hvad besøgerne gør på siden (Synlighed = om de finder os; Andreas 6/11-2026)
					id: 'besoegende',
					label: 'Besøgende',
					icon: 'users',
					children: [
						{
							id: 'besoeg',
							label: 'Besøg',
							content: <VisitsTab visits={visits} isHorizen={isHorizen} />,
						},
						{
							id: 'virksomheder',
							label: 'Virksomheder',
							locked: seoLocked,
							content: locked(<CompaniesTab overview={companies} />) ?? lockedTabs.virksomheder,
						},
						{
							id: 'henvendelser',
							label: 'Henvendelser',
							locked: seoLocked,
							content:
								locked(<LeadsTab leadEvents={leadEvents} snapshots={snapshots} unreadable={siteEventsUnreadable} isHorizen={isHorizen} />) ??
								lockedTabs.henvendelser,
						},
					],
				},
				{
					// Ad hoc: aktive opgaver + nye opgaver, der sendes samlet
					id: 'opgaver',
					label: 'Opgaver',
					icon: 'tasks',
					meta: openTasks.length + listTodos ? String(openTasks.length + listTodos) : undefined,
					// Vores opgaver = det, kunden har bedt os om; Jeres opgaver = kundens
					// liste fra Indbakken (Andreas 16/11-2026). #v=opgaver lander på Vores.
					children: [
						{
							id: 'vores-opgaver',
							label: openTasks.length ? `Vores opgaver (${openTasks.length})` : 'Vores opgaver',
							content: (
								<OpgaverPanel
									items={openTasks}
									signedInAs={viewerName || undefined}
									hours={
										hourModel === 'klippekort'
											? { ...balance, monthName: monthLabel, kind: 'klippekort' }
											: retainerFor(currentMonthKey) > 0
											? {
													total: retainerFor(currentMonthKey) + (seoIntroFor(currentMonthKey)?.hours ?? 0),
													used: monthlyUsage[currentMonthKey] ?? 0,
													monthName: monthLabel,
												}
											: undefined
									}
								/>
							),
						},
						{
							id: 'jeres-opgaver',
							label: listTodos ? `Jeres opgaver (${listTodos})` : 'Jeres opgaver',
							content: todoTab,
						},
					],
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
					// Kundens eget rum: spørgsmål, vi har brug for svar på, og ting, vi har
					// brug for, at kunden gør. Gamle links til #v=spoergsmaal lander på
					// Spørgsmål (første underpunkt).
					id: 'arbejdsrum',
					label: 'Indbakke',
					icon: 'inbox',
					alias: ['spoergsmaal', 'indbakke'],
					// Tallet tæller kun det nye: ubesvarede spørgsmål og nye opgaver (Andreas 16/11-2026)
					meta: newTodos + openQuestions ? String(newTodos + openQuestions) : undefined,
					metaTone: 'attention',
					notifyKey: 'seo-dashboard-questions-seen',
					notifyValue: questionsNotify,
					children: [
						{
							id: 'spoergsmaal-liste',
							label: openQuestions ? `Spørgsmål (${openQuestions})` : 'Spørgsmål',
							content: questionsTab,
						},
						{
							id: 'nye-opgaver',
							label: newTodos ? `Nye opgaver (${newTodos})` : 'Nye opgaver',
							content: newTodosTab,
						},
					],
				},
				{
					// "Strategi": det, vi gør for kunden (planen, siderne, teknikken, det
					// månedlige arbejde og mulighederne). Kunden kan læse med.
					id: 'projekt',
					label: 'Strategi',
					icon: 'folder',
					alias: ['status'],
					// Hele Strategi indgår i SEO-aftalen (Andreas 20/11-2026). Selve punktet ser
					// normalt ud, så kunden klikker ind; underpunkterne er låst.
					children: [
						{ id: 'plan', label: 'Plan', locked: seoLocked, content: locked(planTab) ?? lockedTabs.plan },
						{ id: 'sider', label: 'Sider & søgeord', locked: seoLocked, content: locked(pagesTab) ?? lockedTabs.sider },
						{ id: 'teknisk', label: 'Teknisk SEO', locked: seoLocked, content: locked(technicalWithStatus) ?? lockedTabs.teknisk },
						{ id: 'drift', label: 'Løbende drift', locked: seoLocked, content: locked(driftTab) ?? lockedTabs.drift },
						{ id: 'kataloger', label: 'Profiler & kataloger', locked: seoLocked, content: locked(directoriesTab) ?? lockedTabs.kataloger },
						{ id: 'tilkoeb', label: 'Muligheder', locked: seoLocked, content: locked(addonTab) ?? lockedTabs.muligheder },
					],
				},
				// Horizens værktøjskasse: vises kun, når Horizen er logget ind.
				...(isHorizen
					? ([
							{ id: 'komigang', label: 'Kom i gang', icon: 'rocket', bottom: true, content: launchTab },
							{
								// SEO-spejderens rapport (Andreas 27/11-2026); kunden ser det ikke
								id: 'gennemgang',
								label: 'Månedens gennemgang',
								icon: 'tasks',
								meta: scoutReport
									? String((scoutReport.logDrafts ?? []).filter((l) => (l.status ?? 'afventer') === 'afventer').length || '') || undefined
									: undefined,
								metaTone: 'attention',
								bottom: true,
								content: reviewTab,
							},
							{
								// Fund og løse ender (Andreas 15/11-2026); kunden ser det ikke
								id: 'register',
								label: 'Fund-register',
								icon: 'folder',
								meta: String(findings.filter((f) => f.status === 'aaben' || f.status === 'venter').length || '') || undefined,
								bottom: true,
								content: <FindingsTab items={findings} />,
							},
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
										recipients={clientRecipients}
										drafts={[...clientMessageDrafts, ...scoutDrafts]}
										sent={sentMessages}
									/>
								),
							},
							// Klippekort: saldo + alle bestillinger af timer. Kun Horizen
							// (Andreas 19/11-2026: kunden skal ikke se, hvad de har brugt i kroner).
							// Bestillingen gemmes før mailene, så den står her, også hvis en mail fejler.
							{
								id: 'klippekort',
								label: 'Klippekort',
								icon: 'ticket',
								meta: String(hourOrders.filter((o) => ['bestilt', 'faktureret'].includes(orderStatusOf(o))).length || '') || undefined,
								bottom: true,
								content: (
									<KlippekortOrders
										orders={orderExample ? exampleOrders() : hourOrders}
										balance={balance}
										signedInAs={viewerName || undefined}
										example={orderExample}
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
					<div
						className="rounded-2xl border border-foreground/10 p-6"
						style={{ backgroundColor: 'color-mix(in srgb, var(--color-foreground) 5%, var(--color-background))' }}
					>
						<p className="text-sm leading-relaxed text-foreground/85">
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
