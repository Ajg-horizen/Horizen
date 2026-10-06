"use client";

import { useState } from "react";
import type { SeoTechnique } from "./data";
import ApproachLadder from "./ApproachLadder";

const BLOG_LABEL: Record<NonNullable<SeoTechnique["blog"]>["status"], string> = {
  idé: "idé",
  planlagt: "planlagt",
  skrevet: "skrevet, ikke udgivet",
  udgivet: "udgivet",
};

/**
 * Mange afsnit starter med en etiket ("Hvad det er: …"). Den vises som en lille
 * mellemoverskrift, så teksten kan skimmes. Kun korte etiketter uden punktum.
 */
function splitLabel(para: string): { label?: string; text: string } {
  const i = para.indexOf(": ");
  if (i > 0 && i <= 60 && !para.slice(0, i).includes(".")) {
    return { label: para.slice(0, i), text: para.slice(i + 2) };
  }
  return { text: para };
}

// Dæmpede farver: let tonet baggrund og blød tekst, så mærkerne ikke råber
const categoryStyle: Record<SeoTechnique["category"], string> = {
  Søgeord: "bg-blue-500/[0.06] text-blue-700/70",
  Indhold: "bg-emerald-500/[0.06] text-emerald-700/70",
  Teknisk: "bg-amber-500/[0.07] text-amber-700/70",
  Lokal: "bg-purple-500/[0.06] text-purple-700/70",
  "Data & måling": "bg-sky-500/[0.06] text-sky-700/70",
};

function CategoryLabel({ cat }: { cat: SeoTechnique["category"] }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${categoryStyle[cat]}`}>
      {cat}
    </span>
  );
}

/** Kategorier i fast rækkefølge: oversigten og listen sorteres efter den. */
const CATEGORY_ORDER: SeoTechnique["category"][] = [
  "Søgeord",
  "Indhold",
  "Teknisk",
  "Lokal",
  "Data & måling",
];

export default function TechniquesTab({ items: raw }: { items: SeoTechnique[] }) {
  const [open, setOpen] = useState<number | null>(0);
  // Samlet pr. kategori (rækkefølgen i data.ts bevares inden for hver kategori)
  const items = CATEGORY_ORDER.flatMap((cat) => raw.filter((t) => t.category === cat));

  return (
    <div>
      <ApproachLadder />

      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Teknikker & modeller</h2>
        <p className="mt-1 text-sm text-foreground/60">
          En opslagsbog over de metoder vi bruger, og hvorfor. Klik for at folde ud. Udvides løbende.
        </p>
        <p className="mt-1 text-sm text-foreground/60">
          Blogplan: {items.filter((t) => t.blog?.status === "udgivet").length} udgivet og{" "}
          {items.filter((t) => t.blog?.status === "planlagt" || t.blog?.status === "skrevet").length}{" "}
          planlagt som blogindlæg på horizen.dk.
        </p>
      </div>

      {/* Oversigt: indholdsfortegnelse pr. kategori. Start på et opslagsbibliotek,
          der kan vokse efterhånden som vi samler flere teknikker. */}
      <nav
        aria-label="Oversigt over teknikker"
        className="mb-8 rounded-2xl border border-foreground/[0.08] bg-background p-5"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-foreground/50">
          Oversigt · {items.length} {items.length === 1 ? "teknik" : "teknikker"}
        </p>
        <div className="mt-4 space-y-4">
          {CATEGORY_ORDER.map((cat) => {
            const inCat = items
              .map((t, i) => ({ t, i }))
              .filter(({ t }) => t.category === cat);
            if (inCat.length === 0) return null;
            return (
              <div key={cat}>
                <CategoryLabel cat={cat} />
                <ol className="mt-2 space-y-1.5 pl-1">
                  {inCat.map(({ t, i }) => (
                    <li key={t.title} className="flex gap-3 text-sm">
                      <span className="w-5 shrink-0 text-right tabular-nums text-foreground/35">
                        {i + 1}.
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setOpen(i);
                          requestAnimationFrame(() =>
                            document
                              .getElementById(`teknik-${i}`)
                              ?.scrollIntoView({ behavior: "smooth", block: "start" })
                          );
                        }}
                        className="text-left text-foreground/80 underline-offset-2 hover:text-foreground hover:underline"
                      >
                        {t.title}
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </div>
      </nav>

      <div className="space-y-3">
        {items.map((t, i) => {
          const isOpen = open === i;
          return (
            <div
              key={t.title}
              id={`teknik-${i}`}
              className="scroll-mt-24 overflow-hidden rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02]"
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-foreground/[0.02]"
              >
                <span className="flex flex-wrap items-center gap-3">
                  <span className="text-base font-semibold">{t.title}</span>
                  <CategoryLabel cat={t.category} />
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
                  <p className="max-w-3xl text-base font-medium leading-relaxed">{t.summary}</p>

                  <div className="mt-4 max-w-3xl rounded-xl border border-foreground/[0.08] bg-background p-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-foreground/50">
                      Hvornår bruger vi det
                    </p>
                    <p className="mt-1 text-sm text-foreground/80">{t.whenToUse}</p>
                  </div>

                  {t.blog && (
                    <p className="mt-3 text-sm text-foreground/50">
                      Blogindlæg: {BLOG_LABEL[t.blog.status]}.
                      {t.blog.note && ` ${t.blog.note}`}
                      {t.blog.url && (
                        <a href={t.blog.url} className="ml-1 underline underline-offset-2 hover:text-foreground">
                          Læs indlægget
                        </a>
                      )}
                    </p>
                  )}

                  <div className="mt-6 max-w-3xl space-y-5">
                    {t.body.map((para, j) => {
                      const { label, text } = splitLabel(para);
                      return (
                        <div key={j}>
                          {label && <h4 className="mb-1 text-sm font-semibold">{label}</h4>}
                          <p className="text-sm leading-relaxed text-foreground/70">{text}</p>
                        </div>
                      );
                    })}
                  </div>
                  {(t.pros || t.cons) && (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {t.pros && (
                        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-3">
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-600">
                            Fordele
                          </p>
                          <ul className="space-y-1.5">
                            {t.pros.map((p, j) => (
                              <li key={j} className="flex gap-2 text-sm text-foreground/80">
                                <span className="mt-0.5 shrink-0 text-emerald-600">+</span>
                                <span>{p}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {t.cons && (
                        <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-3">
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-600">
                            Ulemper & forbehold
                          </p>
                          <ul className="space-y-1.5">
                            {t.cons.map((c, j) => (
                              <li key={j} className="flex gap-2 text-sm text-foreground/80">
                                <span className="mt-0.5 shrink-0 text-amber-600">−</span>
                                <span>{c}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {(t.dos || t.donts) && (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {t.dos && (
                        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-3">
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-600">
                            Det gør vi
                          </p>
                          <ul className="space-y-1.5">
                            {t.dos.map((d, j) => (
                              <li key={j} className="flex gap-2 text-sm text-foreground/80">
                                <span className="mt-0.5 shrink-0 text-emerald-600">✓</span>
                                <span>{d}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {t.donts && (
                        <div className="rounded-xl border border-rose-500/20 bg-rose-500/[0.04] p-3">
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-rose-600">
                            Det gør vi ikke
                          </p>
                          <ul className="space-y-1.5">
                            {t.donts.map((d, j) => (
                              <li key={j} className="flex gap-2 text-sm text-foreground/80">
                                <span className="mt-0.5 shrink-0 text-rose-600">✕</span>
                                <span>{d}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

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

                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
