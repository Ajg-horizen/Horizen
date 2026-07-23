"use client";

import { useState } from "react";
import type { SeoTechnique } from "./data";

const categoryStyle: Record<SeoTechnique["category"], string> = {
  Søgeord: "bg-blue-500/10 text-blue-600",
  Indhold: "bg-emerald-500/10 text-emerald-600",
  Teknisk: "bg-amber-500/10 text-amber-600",
  Lokal: "bg-purple-500/10 text-purple-600",
};

export default function TechniquesTab({ items }: { items: SeoTechnique[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Teknikker & modeller</h2>
        <p className="mt-1 text-sm text-foreground/60">
          En opslagsbog over de metoder vi bruger, og hvorfor. Klik for at folde ud. Udvides løbende.
        </p>
      </div>

      <div className="space-y-3">
        {items.map((t, i) => {
          const isOpen = open === i;
          return (
            <div
              key={t.title}
              className="overflow-hidden rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02]"
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-foreground/[0.02]"
              >
                <span className="flex flex-wrap items-center gap-3">
                  <span className="text-base font-semibold">{t.title}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${categoryStyle[t.category]}`}
                  >
                    {t.category}
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
                <p className="px-5 pb-4 -mt-1 text-sm text-foreground/60">{t.summary}</p>
              )}

              {isOpen && (
                <div className="px-5 pb-5">
                  <p className="text-sm font-medium">{t.summary}</p>
                  <div className="mt-3 space-y-2.5">
                    {t.body.map((para, j) => (
                      <p key={j} className="text-sm leading-relaxed text-foreground/70">
                        {para}
                      </p>
                    ))}
                  </div>
                  {t.codeExample && (
                    <div className="mt-4">
                      <p className="mb-1.5 text-xs font-medium text-foreground/50">
                        {t.codeExample.label}
                      </p>
                      <pre className="overflow-x-auto rounded-xl border border-foreground/[0.08] bg-[#0f0f0f] p-4 text-xs leading-relaxed text-[#e6e6e6]">
                        <code className="font-mono">{t.codeExample.code}</code>
                      </pre>
                    </div>
                  )}

                  <div className="mt-4 rounded-xl border border-foreground/[0.08] bg-background p-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-foreground/50">
                      Hvornår bruger vi det
                    </p>
                    <p className="mt-1 text-sm text-foreground/80">{t.whenToUse}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
