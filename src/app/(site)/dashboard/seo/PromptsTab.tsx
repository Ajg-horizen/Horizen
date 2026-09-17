"use client";

import { useState } from "react";
import type { SeoPrompt } from "./data";

const categoryStyle: Record<SeoPrompt["category"], string> = {
  "Search Console": "bg-blue-500/10 text-blue-600",
  Søgeord: "bg-purple-500/10 text-purple-600",
  Indhold: "bg-emerald-500/10 text-emerald-600",
  Teknisk: "bg-amber-500/10 text-amber-600",
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-full border border-foreground/[0.12] bg-background px-3 py-1 text-xs font-medium transition-colors hover:bg-foreground/[0.04]"
    >
      {copied ? "Kopieret" : "Kopiér prompt"}
    </button>
  );
}

export default function PromptsTab({ items }: { items: SeoPrompt[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Prompts</h2>
        <p className="mt-1 text-sm text-foreground/60">
          Gennemprøvede prompts til SEO-arbejdet. Fold ud for at se hvad de gør, og kopiér dem direkte. Udvides løbende.
        </p>
      </div>

      <div className="space-y-3">
        {items.map((p, i) => {
          const isOpen = open === i;
          return (
            <div
              key={p.title}
              className="overflow-hidden rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02]"
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-foreground/[0.02]"
              >
                <span className="flex flex-wrap items-center gap-3">
                  <span className="text-base font-semibold">{p.title}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${categoryStyle[p.category]}`}
                  >
                    {p.category}
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
                <p className="px-5 pb-4 -mt-1 text-sm text-foreground/60">{p.summary}</p>
              )}

              {isOpen && (
                <div className="px-5 pb-5">
                  <p className="text-sm font-medium">{p.summary}</p>
                  <div className="mt-3 space-y-2.5">
                    {p.body.map((para, j) => (
                      <p key={j} className="text-sm leading-relaxed text-foreground/70">
                        {para}
                      </p>
                    ))}
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-foreground/[0.08] bg-background p-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-foreground/50">
                        Hvornår bruger vi den
                      </p>
                      <p className="mt-1 text-sm text-foreground/80">{p.whenToUse}</p>
                    </div>
                    <div className="rounded-xl border border-foreground/[0.08] bg-background p-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-foreground/50">
                        Det skal du have klar
                      </p>
                      <p className="mt-1 text-sm text-foreground/80">{p.input}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="mb-1.5 flex items-center justify-between gap-3">
                      <p className="text-xs font-medium text-foreground/50">Prompten</p>
                      <CopyButton text={p.prompt} />
                    </div>
                    <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-xl border border-foreground/[0.08] bg-[#0f0f0f] p-4 text-xs leading-relaxed text-[#e6e6e6]">
                      <code className="font-mono">{p.prompt}</code>
                    </pre>
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
