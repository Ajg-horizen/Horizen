"use client";

import { useState } from "react";
import type { SeoTool } from "./data";

export default function ToolsTab({ items }: { items: SeoTool[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Værktøjer</h2>
        <p className="mt-1 text-sm text-foreground/60">
          Redskaberne vi bruger i SEO-arbejdet, hvad de gør, og hvornår. Klik for at folde ud. Udvides løbende.
        </p>
      </div>

      <div className="space-y-3">
        {items.map((tool, i) => {
          const isOpen = open === i;
          return (
            <div
              key={tool.name}
              className="overflow-hidden rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02]"
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-foreground/[0.02]"
              >
                <span className="flex flex-wrap items-center gap-3">
                  <span className="text-base font-semibold">{tool.name}</span>
                  <span className="rounded-full bg-foreground/[0.06] px-2 py-0.5 text-xs font-medium text-foreground/60">
                    {tool.role}
                  </span>
                </span>
                <svg
                  viewBox="0 0 24 24"
                  className="size-4 shrink-0 text-foreground/50 transition-transform"
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

              {!isOpen && (
                <p className="px-5 pb-4 -mt-1 text-sm text-foreground/60">{tool.summary}</p>
              )}

              {isOpen && (
                <div className="px-5 pb-5">
                  <p className="text-sm font-medium">{tool.summary}</p>
                  <div className="mt-3 space-y-2.5">
                    {tool.body.map((para, j) => (
                      <p key={j} className="text-sm leading-relaxed text-foreground/70">
                        {para}
                      </p>
                    ))}
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-foreground/[0.08] bg-background p-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-foreground/50">
                        Hvornår bruger vi det
                      </p>
                      <p className="mt-1 text-sm text-foreground/80">{tool.whenToUse}</p>
                    </div>
                    <div className="rounded-xl border border-foreground/[0.08] bg-background p-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-foreground/50">
                        Pris
                      </p>
                      <p className="mt-1 text-sm text-foreground/80">{tool.pricing}</p>
                    </div>
                  </div>

                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-foreground/70 underline-offset-4 hover:text-foreground hover:underline"
                  >
                    Besøg {tool.name}
                    <span aria-hidden="true">↗</span>
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
