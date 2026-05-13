import type { Metadata } from "next";
import Container from "@/components/Container";
import {
  ArrowUpRightIcon,
  CalendarIcon,
  ClockIcon,
  FlagIcon,
  TrendingUpIcon,
} from "lucide-react";
import PagesTabs from "./PagesTabs";
import {
  actionItems,
  baseline,
  dataAsOf,
  lastUpdated,
  pages,
  recentActivity,
  upcomingPages,
  upcomingReviews,
  type SeoStatus,
} from "./data";

export const metadata: Metadata = {
  title: "SEO Status, Horizen (privat)",
  description: "Intern SEO-oversigt for Horizen.",
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
}: {
  label: string;
  value: string | number;
  unit?: string;
  status: "good" | "neutral" | "warning";
  hint?: string;
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

  return (
    <div className="rounded-2xl border border-foreground/[0.08] bg-background p-6">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-[0.15em] text-foreground/50">
          {label}
        </span>
        <div className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
      </div>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-4xl font-bold tracking-tight">{value}</span>
        {unit && <span className="text-sm text-foreground/50">{unit}</span>}
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
            SEO Status
          </h1>
          <p className="mt-3 text-base text-foreground/60">
            Sidst opdateret {formatDateDk(lastUpdated)} · Data fra {dataAsOf}
          </p>
        </div>

        {/* Key metrics */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight">
              Performance, hele sitet
            </h2>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/[0.08] bg-foreground/[0.04] px-2.5 py-1 text-xs font-medium text-foreground/70">
              <CalendarIcon className="size-3" />
              Sidste 28 dage
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
            hint="Lavt, men forventet for nyt site"
          />
          <MetricCard
            label="Visninger"
            value={baseline.metrics.impressions}
            status="warning"
            hint="Vokser, mål 700+ til juni"
          />
          <MetricCard
            label="CTR"
            value={`${baseline.metrics.ctr}%`}
            status="good"
            hint="Over branchegennemsnit (~3%)"
          />
          <MetricCard
            label="Site snit-position"
            value={baseline.metrics.avgPosition}
            status="good"
            hint="Hele horizen.dk, alle queries"
          />
        </div>

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
                className="rounded-xl border border-foreground/[0.08] bg-background p-4"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border-2 border-foreground/20" />
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
          <div className="space-y-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="size-2 rounded-full bg-foreground" />
                  {i < recentActivity.length - 1 && (
                    <div className="w-px flex-1 bg-foreground/[0.08]" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h4 className="text-sm font-semibold">{a.title}</h4>
                    <span className="text-xs text-foreground/50">
                      {formatDateDk(a.date)}
                    </span>
                    {a.commit && (
                      <span className="font-mono text-xs text-foreground/40">
                        #{a.commit}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-foreground/60">
                    {a.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

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
