import type { Metadata } from "next";
import Container from "@/components/Container";
import {
  AlertTriangleIcon,
  ArrowUpRightIcon,
  CalendarIcon,
  ClockIcon,
  FlagIcon,
  TrendingUpIcon,
} from "lucide-react";
import DashboardTabs from "./DashboardTabs";
import PagesTabs from "./PagesTabs";
import ActivityByMonth from "./ActivityByMonth";
import TechniquesTab from "./TechniquesTab";
import ToolsTab from "./ToolsTab";
import {
  actionItems,
  baseline,
  dataAsOf,
  lastUpdated,
  pages,
  recentActivity,
  relaunchData,
  seoTechniques,
  seoTools,
  upcomingPages,
  upcomingReviews,
  type SeoStatus,
} from "./data";

export const metadata: Metadata = {
  title: "Dashboard, Horizen (privat)",
  description: "Intern SEO + Analytics-oversigt for Horizen.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

/* ─── Utility ──────────────────────────────────────────────── */

function daysBetween(date: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const diff = Math.round((target.getTime() - today.getTime()) / 86_400_000);
  return diff;
}

function formatDaysAway(date: string): string {
  const days = daysBetween(date);
  if (days === 0) return "I dag";
  if (days === 1) return "I morgen";
  if (days < 0) return `${Math.abs(days)} dage siden`;
  return `Om ${days} dage`;
}

function formatDateDk(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString("da-DK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* ─── Komponenter ──────────────────────────────────────────── */

function MetricCard({
  label,
  value,
  unit,
  status,
  hint,
  delta,
}: {
  label: string;
  value: string | number;
  unit?: string;
  status: "good" | "neutral" | "warning";
  hint?: string;
  delta?: {
    text: string;
    direction: "up" | "down";
    tone: "good" | "bad" | "warn";
  };
}) {
  const statusColor = {
    good: "text-emerald-600",
    neutral: "text-foreground/60",
    warning: "text-amber-600",
  }[status];

  const dotColor = {
    good: "bg-emerald-500",
    neutral: "bg-foreground/30",
    warning: "bg-amber-500",
  }[status];

  const deltaTone = {
    good: "text-emerald-600 bg-emerald-500/10",
    bad: "text-red-600 bg-red-500/10",
    warn: "text-amber-600 bg-amber-500/10",
  }[delta?.tone ?? "warn"];

  return (
    <div className="rounded-2xl border border-foreground/[0.08] bg-background p-6">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-[0.15em] text-foreground/50">
          {label}
        </span>
        <div className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-4xl font-bold tracking-tight">{value}</span>
        {unit && <span className="text-sm text-foreground/50">{unit}</span>}
        {delta && (
          <span
            className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium tabular-nums ${deltaTone}`}
          >
            {delta.direction === "up" ? "↑" : "↓"}
            {delta.text}
          </span>
        )}
      </div>
      {hint && <p className={`mt-2 text-xs ${statusColor}`}>{hint}</p>}
    </div>
  );
}

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      {description && (
        <p className="mt-1 text-sm text-foreground/60">{description}</p>
      )}
    </div>
  );
}

function PriorityBadge({ priority }: { priority: 1 | 2 | 3 | 4 }) {
  const labels = {
    1: { text: "Prioritet 1", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    2: { text: "Prioritet 2", color: "bg-sky-50 text-sky-700 border-sky-200" },
    3: { text: "Prioritet 3", color: "bg-amber-50 text-amber-700 border-amber-200" },
    4: { text: "Prioritet 4", color: "bg-foreground/[0.04] text-foreground/60 border-foreground/[0.08]" },
  };
  const { text, color } = labels[priority];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${color}`}
    >
      {text}
    </span>
  );
}

function PriorityFlag({ priority }: { priority: "high" | "medium" | "low" }) {
  const cfg = {
    high: { color: "text-red-600", label: "Høj" },
    medium: { color: "text-amber-600", label: "Mellem" },
    low: { color: "text-foreground/50", label: "Lav" },
  }[priority];
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${cfg.color}`}>
      <FlagIcon className="size-3" />
      {cfg.label}
    </span>
  );
}


/* ─── Side ─────────────────────────────────────────────────── */

export default function SeoDashboardPage() {
  // Sortér sider: færdige først, så in_progress, så pending, så not_applicable
  const sortOrder: Record<SeoStatus, number> = {
    done: 0,
    in_progress: 1,
    pending: 2,
    not_applicable: 3,
  };
  const sortedPages = [...pages].sort(
    (a, b) => sortOrder[a.seoStatus] - sortOrder[b.seoStatus]
  );

  const seoStatusTab = (
    <>
      {/* Key metrics */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-2xl font-bold tracking-tight">
            Performance, hele sitet
          </h2>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/[0.08] bg-foreground/[0.04] px-2.5 py-1 text-xs font-medium text-foreground/70">
            <CalendarIcon className="size-3" />
            Sidste 3 måneder
          </span>
        </div>
        <p className="mt-1 text-sm text-foreground/60">
          {baseline.source} · {dataAsOf} · Tal er aggregeret på tværs af alle sider og queries
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Klik"
          value={baseline.metrics.clicks}
          status="warning"
          hint="3 mdr. Domineret af brandsøgning"
          delta={baseline.trend.clicks}
        />
        <MetricCard
          label="Visninger"
          value={baseline.metrics.impressions}
          status="warning"
          hint="Oppustet af gammelt indhold + www-dublet"
          delta={baseline.trend.impressions}
        />
        <MetricCard
          label="CTR"
          value={`${baseline.metrics.ctr}%`}
          status="warning"
          hint="Trukket ned af dublet-visninger uden klik"
          delta={baseline.trend.ctr}
        />
        <MetricCard
          label="Site snit-position"
          value={baseline.metrics.avgPosition}
          status="warning"
          hint="Bloat-forurenet, rene sider ligger side 1"
          delta={baseline.trend.position}
        />
      </div>

      <p className="mt-3 text-xs text-foreground/50">{baseline.trend.label}</p>

      <div className="mt-4 rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] p-5">
        <div className="flex items-start gap-3">
          <TrendingUpIcon className="mt-0.5 size-4 shrink-0 text-emerald-600" />
          <p className="text-sm leading-relaxed text-foreground/80">
            {baseline.insight}
          </p>
        </div>
      </div>

      {/* Upcoming reviews */}
      <div className="mt-16">
        <SectionHeader
          title="Kommende"
          description="Næste datoer hvor vi tjekker op"
        />
        <div className="grid gap-3 md:grid-cols-2">
          {upcomingReviews.map((r) => {
            const days = daysBetween(r.date);
            const isPast = days < 0;
            const isSoon = days >= 0 && days <= 7;
            return (
              <div
                key={r.date}
                className={`flex items-start gap-4 rounded-2xl border p-5 ${
                  isPast
                    ? "border-foreground/[0.05] bg-foreground/[0.02] opacity-60"
                    : isSoon
                    ? "border-emerald-200 bg-emerald-50/30"
                    : "border-foreground/[0.08] bg-background"
                }`}
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-foreground text-background">
                  <CalendarIcon className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h3 className="text-base font-semibold">{r.title}</h3>
                    <span className="text-xs font-medium text-foreground/50">
                      {formatDateDk(r.date)} · {formatDaysAway(r.date)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-foreground/60">
                    {r.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Per-side tabs */}
      <div className="mt-16">
        <SectionHeader
          title="Sider"
          description="Klik en fane for at se detaljer, keywords, opgaver og aktivitet"
        />
        <PagesTabs pages={sortedPages} />
      </div>

      {/* Action items */}
      <div className="mt-16">
        <SectionHeader
          title="Action items"
          description="Ting Andreas selv skal gøre når der er tid (ikke side-specifikt)"
        />
        <div className="grid gap-3 md:grid-cols-2">
          {actionItems.map((item) => (
            <div
              key={item.title}
              className={`rounded-xl border p-4 ${
                item.priority === "high"
                  ? "border-amber-200 bg-amber-50/40"
                  : "border-foreground/[0.08] bg-background"
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                {item.priority === "high" ? (
                  <AlertTriangleIcon className="mt-0.5 size-5 shrink-0 text-amber-600" />
                ) : (
                  <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border-2 border-foreground/20" />
                )}
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold leading-snug">
                    {item.title}
                  </h4>
                  <p className="mt-1 text-xs text-foreground/60 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="mt-2 flex items-center gap-3">
                    <PriorityFlag priority={item.priority} />
                    <span className="inline-flex items-center gap-1 text-xs text-foreground/50">
                      <ClockIcon className="size-3" />
                      {item.estimatedTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming pages */}
      <div className="mt-16">
        <SectionHeader
          title="Sider du skal bygge"
          description="13 sider planlagt. Prioriteret efter SEO-impact (AI-sporet først)"
        />
        <div className="grid gap-3 md:grid-cols-2">
          {upcomingPages.map((p) => (
            <div
              key={p.name}
              className="flex items-center justify-between rounded-xl border border-foreground/[0.08] bg-background px-4 py-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <PriorityBadge priority={p.priority} />
                <span className="text-sm font-medium truncate">{p.name}</span>
              </div>
              <div className="flex shrink-0 items-center gap-3 text-xs text-foreground/50">
                <span>
                  Impact:{" "}
                  {p.impact === "high"
                    ? "🟢"
                    : p.impact === "medium"
                    ? "🟡"
                    : "⚪"}
                </span>
                <span>
                  Konk.:{" "}
                  {p.competition === "low"
                    ? "🟢"
                    : p.competition === "medium"
                    ? "🟡"
                    : "🔴"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent activity, global */}
      <div className="mt-16">
        <SectionHeader
          title="Seneste aktivitet, samlet"
          description="Tidslinje på tværs af alle sider"
        />
        <ActivityByMonth items={recentActivity} />
      </div>
    </>
  );

  const analyticsTab = (
    <>
      <SectionHeader
        title="Relancering, før vs. efter"
        description={`Relancering ${formatDateDk(relaunchData.relaunchDate)}. Før = 90 dage, efter = 70 dage — sammenlign tendenser, ikke rå-tal 1:1.`}
      />
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Før-kolonne */}
        <div className="rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] p-6">
          <div className="mb-4 flex items-baseline justify-between gap-3">
            <h3 className="text-lg font-semibold">{relaunchData.before.label}</h3>
            <span className="text-xs uppercase tracking-wide text-foreground/50">
              {relaunchData.before.period}
            </span>
          </div>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-wide text-foreground/50">Active users</dt>
              <dd className="mt-1 text-2xl font-bold tabular-nums">{relaunchData.before.metrics.activeUsers}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-foreground/50">Avg engagement</dt>
              <dd className="mt-1 text-2xl font-bold tabular-nums">
                {Math.floor(relaunchData.before.metrics.avgEngagementSec / 60)}m {Math.round(relaunchData.before.metrics.avgEngagementSec % 60)}s
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-foreground/50">Organic sessions</dt>
              <dd className="mt-1 text-2xl font-bold tabular-nums">{relaunchData.before.metrics.organicSessions}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-foreground/50">Direct sessions</dt>
              <dd className="mt-1 text-2xl font-bold tabular-nums">{relaunchData.before.metrics.directSessions}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-xs uppercase tracking-wide text-foreground/50">Key events (konverteringer)</dt>
              <dd className="mt-1 text-2xl font-bold tabular-nums">{relaunchData.before.metrics.keyEvents}</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-foreground/50">
            Kilde: {relaunchData.before.source}
          </p>
        </div>

        {/* Efter-kolonne */}
        <div className="rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] p-6">
          <div className="mb-4 flex items-baseline justify-between gap-3">
            <h3 className="text-lg font-semibold">{relaunchData.after.label}</h3>
            <span className="text-xs uppercase tracking-wide text-foreground/50">
              {relaunchData.after.period}
            </span>
          </div>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-wide text-foreground/50">Active users</dt>
              <dd className="mt-1 text-2xl font-bold tabular-nums">{relaunchData.after.metrics.activeUsers}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-foreground/50">Avg engagement</dt>
              <dd className="mt-1 text-2xl font-bold tabular-nums">
                {Math.floor(relaunchData.after.metrics.avgEngagementSec / 60)}m {Math.round(relaunchData.after.metrics.avgEngagementSec % 60)}s
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-foreground/50">Organic sessions</dt>
              <dd className="mt-1 text-2xl font-bold tabular-nums">{relaunchData.after.metrics.organicSessions}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-foreground/50">Direct sessions</dt>
              <dd className="mt-1 text-2xl font-bold tabular-nums">{relaunchData.after.metrics.directSessions}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-xs uppercase tracking-wide text-foreground/50">Key events (konverteringer)</dt>
              <dd className="mt-1 text-2xl font-bold tabular-nums">{relaunchData.after.metrics.keyEvents}</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs leading-relaxed text-foreground/50">
            Kilde: {relaunchData.after.source}. {relaunchData.after.note}
          </p>
        </div>
      </div>

      {/* Top sider før relancering */}
      <div className="mt-5 rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] p-6">
        <h3 className="mb-1 text-base font-semibold">Top sider før relancering</h3>
        <p className="mb-4 text-xs text-foreground/60">
          De sider der bar mest trafik på det gamle site (GA4, 90 dage før 8. maj).
        </p>
        <div className="overflow-hidden rounded-xl border border-foreground/[0.06]">
          <table className="w-full text-sm">
            <thead className="bg-foreground/[0.03] text-xs uppercase tracking-wide text-foreground/60">
              <tr>
                <th className="px-4 py-2.5 text-left font-medium">Side</th>
                <th className="px-4 py-2.5 text-right font-medium">Views</th>
                <th className="px-4 py-2.5 text-right font-medium">Bounce rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/[0.06]">
              {relaunchData.before.topPages.map((page) => (
                <tr key={page.title}>
                  <td className="px-4 py-2.5">{page.title}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">{page.views.toLocaleString("da-DK")}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">
                    <span className={page.bounceRate < 10 ? "text-emerald-600" : page.bounceRate < 40 ? "text-foreground/70" : "text-amber-600"}>
                      {page.bounceRate.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top sider efter relancering */}
      <div className="mt-5 rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] p-6">
        <h3 className="mb-1 text-base font-semibold">Top sider efter relancering</h3>
        <p className="mb-4 text-xs text-foreground/60">
          De mest besøgte sider på det nye site (GA4, 13. maj – 22. juli). Forsiden er lagt sammen på tværs af gammel/ny title.
        </p>
        <div className="overflow-hidden rounded-xl border border-foreground/[0.06]">
          <table className="w-full text-sm">
            <thead className="bg-foreground/[0.03] text-xs uppercase tracking-wide text-foreground/60">
              <tr>
                <th className="px-4 py-2.5 text-left font-medium">Side</th>
                <th className="px-4 py-2.5 text-right font-medium">Views</th>
                <th className="px-4 py-2.5 text-right font-medium">Bounce rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/[0.06]">
              {relaunchData.after.topPages.map((page) => (
                <tr key={page.title}>
                  <td className="px-4 py-2.5">{page.title}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">{page.views.toLocaleString("da-DK")}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">
                    <span className={page.bounceRate < 10 ? "text-emerald-600" : page.bounceRate < 40 ? "text-foreground/70" : "text-amber-600"}>
                      {page.bounceRate.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Observationer */}
      <div className="mt-5 rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] p-6">
        <h3 className="mb-3 text-base font-semibold">Observationer fra baseline</h3>
        <ul className="space-y-2 text-sm text-foreground/80">
          {relaunchData.observations.map((obs, i) => (
            <li key={i} className="flex gap-2.5 leading-relaxed">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-foreground/40" />
              <span>{obs}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );

  return (
    <main className="min-h-screen bg-background py-12 md:py-16">
      <Container size="site">
        {/* Header */}
        <div className="mb-12 max-w-4xl">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-foreground/50">
            <span>Horizen, intern</span>
            <span>·</span>
            <span>Privat</span>
          </div>
          <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
            Dashboard
          </h1>
          <p className="mt-3 text-base text-foreground/60">
            Sidst opdateret {formatDateDk(lastUpdated)} · Data fra {dataAsOf}
          </p>
        </div>

        <DashboardTabs
          tabs={[
            { id: "seo", label: "SEO Status", content: seoStatusTab },
            { id: "analytics", label: "Analytics", content: analyticsTab },
            {
              id: "teknikker",
              label: "Teknikker",
              content: <TechniquesTab items={seoTechniques} />,
            },
            {
              id: "vaerktoejer",
              label: "Værktøjer",
              content: <ToolsTab items={seoTools} />,
            },
          ]}
          defaultTab="seo"
        />

        {/* Footer */}
        <div className="mt-20 rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] p-6">
          <p className="text-sm text-foreground/60">
            <strong className="text-foreground">Bemærk:</strong> Denne side er
            privat. Den er ikke indekseret af Google og ikke linket fra resten
            af sitet. Data opdateres manuelt af Claude ved hver SEO-ændring.
          </p>
          <a
            href="https://search.google.com/search-console"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
          >
            Åbn Google Search Console
            <ArrowUpRightIcon className="size-3.5" />
          </a>
        </div>
      </Container>
    </main>
  );
}
