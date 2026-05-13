"use client";

import { useState } from "react";
import {
  CheckCircle2Icon,
  CircleDashedIcon,
  ClockIcon,
  GitCommitIcon,
  MinusIcon,
  TargetIcon,
} from "lucide-react";
import type { PageDetail, SeoStatus } from "./data";

function formatDateDk(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString("da-DK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function StatusDot({ status }: { status: SeoStatus }) {
  const color = {
    done: "bg-emerald-500",
    in_progress: "bg-amber-500",
    pending: "bg-foreground/30",
    not_applicable: "bg-foreground/15",
  }[status];
  return <span className={`size-2 shrink-0 rounded-full ${color}`} />;
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

function PageDetailView({ page }: { page: PageDetail }) {
  const hasKeywords = page.keywords.primary !== null;
  const hasPositions =
    page.positions.current !== null || page.positions.impressions28d !== null;
  const hasActivity = page.activity.length > 0;
  const hasCompletedTasks = page.completedTasks.length > 0;
  const hasPendingTasks = page.pendingTasks.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-baseline justify-between gap-3 pb-4 border-b border-foreground/[0.08]">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">{page.name}</h3>
          <p className="mt-1 text-sm text-foreground/50 font-mono">{page.url}</p>
        </div>
        <div className="flex items-center gap-2">
          {page.lastSeoUpdate && (
            <span className="text-xs text-foreground/50">
              Opdateret {formatDateDk(page.lastSeoUpdate)}
            </span>
          )}
          <SeoStatusBadge status={page.seoStatus} />
        </div>
      </div>

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

      {/* Two-column layout for positions + keywords on md+ */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Page average position */}
        {page.pageAvgPosition !== null && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/50 mb-1">
              Sidens snit-position
            </h4>
            <p className="text-xs text-foreground/50 mb-3">
              Gennemsnit på tværs af alle queries der leder hertil
            </p>
            <div className="rounded-xl border border-foreground/[0.08] bg-background p-3 w-fit">
              <p className="text-2xl font-bold tabular-nums">
                {page.pageAvgPosition}
              </p>
            </div>
          </div>
        )}

        {/* Keywords */}
        {hasKeywords ? (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/50 mb-3">
              Keywords
            </h4>
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-xs text-foreground/50 w-20 shrink-0">
                  Primary
                </span>
                <span className="text-sm font-medium">
                  {page.keywords.primary}
                </span>
              </div>
              {page.keywords.secondary.length > 0 && (
                <div className="flex items-baseline gap-3">
                  <span className="text-xs text-foreground/50 w-20 shrink-0">
                    Secondary
                  </span>
                  <span className="text-sm">
                    {page.keywords.secondary.join(", ")}
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-foreground/[0.12] p-4 text-center flex items-center justify-center">
            <p className="text-sm text-foreground/50">
              Keywords ikke valgt endnu
            </p>
          </div>
        )}
      </div>

      {/* Position for primary keyword */}
      {hasPositions && (
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/50 mb-1">
            Position for primary keyword
          </h4>
          {page.keywords.primary && (
            <p className="text-xs text-foreground/50 mb-3 italic">
              {`"${page.keywords.primary}"`}
            </p>
          )}
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

      {/* Two-column for completed + pending tasks */}
      {(hasCompletedTasks || hasPendingTasks) && (
        <div className="grid gap-6 md:grid-cols-2">
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
  );
}

export default function PagesTabs({ pages }: { pages: PageDetail[] }) {
  const [activeUrl, setActiveUrl] = useState(pages[0]?.url);
  const active = pages.find((p) => p.url === activeUrl) ?? pages[0];

  if (!active) return null;

  return (
    <div>
      {/* Tab bar, horizontalt scrollbar på små skærme */}
      <div className="overflow-x-auto -mx-6 sm:-mx-0">
        <div className="flex gap-2 px-6 sm:px-0 pb-2 min-w-max sm:min-w-0 sm:flex-wrap">
          {pages.map((p) => {
            const isActive = activeUrl === p.url;
            return (
              <button
                key={p.url}
                onClick={() => setActiveUrl(p.url)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-foreground text-background"
                    : "bg-background border border-foreground/[0.08] text-foreground/70 hover:text-foreground hover:border-foreground/[0.15]"
                }`}
              >
                <StatusDot status={p.seoStatus} />
                {p.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      <div className="mt-6 rounded-2xl border border-foreground/[0.08] bg-background p-6 md:p-8">
        <PageDetailView page={active} />
      </div>
    </div>
  );
}
