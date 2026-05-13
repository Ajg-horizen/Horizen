import type { Metadata } from "next";
import Container from "@/components/Container";
import {
  ArrowUpRightIcon,
  CalendarIcon,
  CheckCircle2Icon,
  ChevronDownIcon,
  CircleDashedIcon,
  ClockIcon,
  FlagIcon,
  GitCommitIcon,
  MinusIcon,
  TargetIcon,
  TrendingUpIcon,
} from "lucide-react";
import {
  actionItems,
  baseline,
  dataAsOf,
  lastUpdated,
  pages,
  recentActivity,
  upcomingPages,
  upcomingReviews,
  type PageDetail,
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

function SeoStatusBadge({ status }: { status: SeoStatus }) {
  const cfg = {
    done: {
      icon: CheckCircle2Icon,
      text: "SEO færdig",
      color: "text-emerald-700 bg-emerald-50 border-emerald-200",
    },
    in_progress: {
      icon: ClockIcon,
      text: "I gang",
      color: "text-amber-700 bg-amber-50 border-amber-200",
    },
    pending: {
      icon: CircleDashedIcon,
      text: "Venter",
      color: "text-foreground/60 bg-foreground/[0.04] border-foreground/[0.08]",
    },
    not_applicable: {
      icon: MinusIcon,
      text: "Ikke relevant",
      color: "text-foreground/40 bg-foreground/[0.02] border-foreground/[0.06]",
    },
  }[status];
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${cfg.color}`}
    >
      <Icon className="size-3" />
      {cfg.text}
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

/* ─── Per-side accordion-indhold ──────────────────────────── */

function PageAccordion({ page }: { page: PageDetail }) {
  const hasKeywords = page.keywords.primary !== null;
  const hasPositions =
    page.positions.current !== null || page.positions.impressions28d !== null;
  const hasActivity = page.activity.length > 0;
  const hasCompletedTasks = page.completedTasks.length > 0;
  const hasPendingTasks = page.pendingTasks.length > 0;

  return (
    <details className="group rounded-2xl border border-foreground/[0.08] bg-background overflow-hidden">
      <summary className="cursor-pointer list-none p-5 hover:bg-foreground/[0.02] transition-colors">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <ChevronDownIcon className="size-4 shrink-0 text-foreground/40 transition-transform group-open:rotate-180" />
            <div className="min-w-0">
              <h3 className="text-base font-semibold truncate">{page.name}</h3>
              <p className="text-xs text-foreground/50 font-mono truncate">
                {page.url}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {page.lastSeoUpdate && (
              <span className="text-xs text-foreground/50 hidden sm:inline">
                Opdateret {formatDateDk(page.lastSeoUpdate)}
              </span>
            )}
            <SeoStatusBadge status={page.seoStatus} />
          </div>
        </div>
      </summary>

      <div className="border-t border-foreground/[0.08] px-5 py-6 space-y-6 bg-foreground/[0.01]">
        {/* Next step */}
        <div className="rounded-xl border border-foreground/[0.08] bg-background p-4">
          <div className="flex items-start gap-3">
            <TargetIcon className="mt-0.5 size-4 shrink-0 text-foreground/60" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground/50 mb-1">
                Næste skridt
              </p>
              <p className="text-sm leading-relaxed">{page.nextStep}</p>
            </div>
          </div>
        </div>

        {/* Keywords */}
        {hasKeywords ? (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/50 mb-3">
              Keywords
            </h4>
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-xs text-foreground/50 w-20 shrink-0">Primary</span>
                <span className="text-sm font-medium">{page.keywords.primary}</span>
              </div>
              {page.keywords.secondary.length > 0 && (
                <div className="flex items-baseline gap-3">
                  <span className="text-xs text-foreground/50 w-20 shrink-0">Secondary</span>
                  <span className="text-sm">{page.keywords.secondary.join(", ")}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-foreground/[0.12] p-4 text-center">
            <p className="text-sm text-foreground/50">
              Keywords ikke valgt endnu
            </p>
          </div>
        )}

        {/* Positions */}
        {hasPositions && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/50 mb-3">
              Position i Google
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-foreground/[0.08] bg-background p-3">
                <p className="text-xs text-foreground/50">Aktuel</p>
                <p className="mt-1 text-2xl font-bold tabular-nums">
                  {page.positions.current ?? "—"}
                </p>
              </div>
              <div className="rounded-xl border border-foreground/[0.08] bg-background p-3">
                <p className="text-xs text-foreground/50">Mål</p>
                <p className="mt-1 text-2xl font-bold tabular-nums text-emerald-600">
                  {page.positions.target ? `<${page.positions.target}` : "—"}
                </p>
              </div>
              <div className="rounded-xl border border-foreground/[0.08] bg-background p-3">
                <p className="text-xs text-foreground/50">Visninger 28d</p>
                <p className="mt-1 text-2xl font-bold tabular-nums">
                  {page.positions.impressions28d ?? "—"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Completed tasks */}
        {hasCompletedTasks && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/50 mb-3">
              Færdige opgaver ({page.completedTasks.length})
            </h4>
            <ul className="space-y-1.5">
              {page.completedTasks.map((task, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle2Icon className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
                  <span className="text-foreground/80">{task}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Pending tasks */}
        {hasPendingTasks && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/50 mb-3">
              Manglende opgaver ({page.pendingTasks.length})
            </h4>
            <ul className="space-y-1.5">
              {page.pendingTasks.map((task, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CircleDashedIcon className="mt-0.5 size-3.5 shrink-0 text-foreground/40" />
                  <span className="text-foreground/70">{task}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Activity */}
        {hasActivity && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/50 mb-3">
              Aktivitet
            </h4>
            <div className="space-y-3">
              {page.activity.map((a, i) => (
                <div key={i} className="flex gap-3">
                  <div className="mt-0.5 size-1.5 shrink-0 rounded-full bg-foreground/40" />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <p className="text-sm font-medium">{a.title}</p>
                      <span className="text-xs text-foreground/50">
                        {formatDateDk(a.date)}
                      </span>
                      {a.commit && (
                        <span className="inline-flex items-center gap-1 font-mono text-xs text-foreground/40">
                          <GitCommitIcon className="size-3" />
                          {a.commit}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-foreground/60">
                      {a.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {page.notes && (
          <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-1">
              Note
            </p>
            <p className="text-sm text-amber-900 leading-relaxed">{page.notes}</p>
          </div>
        )}
      </div>
    </details>
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
        <SectionHeader
          title="Performance, samlet"
          description={`${baseline.source} · ${baseline.period}`}
        />
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
            label="Forsidens position"
            value={baseline.metrics.frontpagePosition}
            status="good"
            hint="Forbedret fra 23,46 (3-måneders gns.)"
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
          <div className="space-y-3">
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

        {/* Per-side accordion */}
        <div className="mt-16">
          <SectionHeader
            title="Sider"
            description="Klik på en side for at se detaljer, keywords, opgaver og aktivitet"
          />
          <div className="space-y-2">
            {sortedPages.map((page) => (
              <PageAccordion key={page.url} page={page} />
            ))}
          </div>
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
