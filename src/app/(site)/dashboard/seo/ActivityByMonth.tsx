"use client";

import { useState } from "react";

type ActivityEntry = {
  date: string;
  title: string;
  description: string;
  commit?: string;
};

/** 'ÅÅÅÅ-MM-DD' → 'ÅÅÅÅ-MM' */
function monthKey(date: string) {
  return date.slice(0, 7);
}

/** 'ÅÅÅÅ-MM' → 'Juli 2026' (stort begyndelsesbogstav) */
function monthLabel(key: string) {
  const label = new Date(`${key}-01T00:00:00`).toLocaleDateString("da-DK", {
    month: "long",
    year: "numeric",
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function dayLabel(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("da-DK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function MonthEntries({ entries }: { entries: ActivityEntry[] }) {
  return (
    <div className="space-y-3">
      {entries.map((a, i) => (
        <div key={`${a.date}-${a.title}`} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="size-2 rounded-full bg-foreground" />
            {i < entries.length - 1 && (
              <div className="w-px flex-1 bg-foreground/[0.08]" />
            )}
          </div>
          <div className="flex-1 pb-4">
            <div className="flex flex-wrap items-baseline gap-2">
              <h4 className="text-sm font-semibold">{a.title}</h4>
              <span className="text-xs text-foreground/50">{dayLabel(a.date)}</span>
              {a.commit && (
                <span className="font-mono text-xs text-foreground/40">
                  #{a.commit}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-foreground/60">{a.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Aktivitet grupperet pr. måned som en eksklusiv accordion: hver måned er en
 * foldbar sektion, kun én åben ad gangen. Data-drevet (kun måneder med poster
 * vises; nye måneder dukker op af sig selv). Default = nyeste måned foldet ud,
 * så listen ikke bliver en lang scroll. Inspireret af Miljøkontorets dashboard.
 */
export default function ActivityByMonth({ items }: { items: ActivityEntry[] }) {
  const groups = new Map<string, ActivityEntry[]>();
  for (const item of items) {
    const k = monthKey(item.date);
    const arr = groups.get(k);
    if (arr) arr.push(item);
    else groups.set(k, [item]);
  }
  const months = [...groups.keys()].sort().reverse(); // nyeste først
  const [open, setOpen] = useState<string | null>(months[0] ?? null);

  return (
    <div className="space-y-3">
      {months.map((k) => {
        const isOpen = open === k;
        const entries = groups.get(k) ?? [];
        return (
          <div
            key={k}
            className="overflow-hidden rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02]"
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : k)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-foreground/[0.02]"
            >
              <span className="flex items-center gap-3">
                <span className="text-base font-semibold">{monthLabel(k)}</span>
                <span className="rounded-full bg-foreground/[0.06] px-2 py-0.5 text-xs font-medium text-foreground/60">
                  {entries.length}
                </span>
              </span>
              <svg
                viewBox="0 0 24 24"
                className="size-4 text-foreground/50 transition-transform"
                style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {isOpen && (
              <div className="px-5 pb-5">
                <MonthEntries entries={entries} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
