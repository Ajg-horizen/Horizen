"use client";

import { useState } from "react";
import DashboardTabs from "./DashboardTabs";
import { toolCategories, type SeoTool } from "./data";

export default function ToolsTab({ items }: { items: SeoTool[] }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight">Værktøjer</h2>
        <p className="text-foreground/60 mt-1 text-sm">
          Redskaberne vi bruger i SEO-arbejdet, grupperet efter formål: hvad de
          gør, og hvornår. Vælg en gruppe, og klik et værktøj for at folde det
          ud. Udvides løbende.
        </p>
      </div>

      <DashboardTabs
        variant="pill"
        syncKey="vt"
        tabs={toolCategories.flatMap((cat) => {
          const tools = items.filter((t) => t.category === cat.id);
          if (!tools.length) return [];
          return {
            id: cat.id,
            label: `${cat.tab} (${tools.length})`,
            content: (
              <section>
                <h3 className="text-lg font-semibold tracking-tight">
                  {cat.title}
                </h3>
                <p className="text-foreground/60 mt-1 mb-4 text-sm">
                  {cat.intro}
                </p>
                <div className="space-y-3">
                  {tools.map((tool) => {
                    const isOpen = open === tool.name;
                    return (
                      <div
                        key={tool.name}
                        className="border-foreground/[0.08] overflow-hidden rounded-2xl border bg-white"
                      >
                        <button
                          type="button"
                          onClick={() => setOpen(isOpen ? null : tool.name)}
                          aria-expanded={isOpen}
                          className="hover:bg-foreground/[0.02] flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors"
                        >
                          <span className="flex flex-wrap items-center gap-3">
                            <span className="text-base font-semibold">
                              {tool.name}
                            </span>
                            <span className="bg-foreground/[0.06] text-foreground/60 rounded-full px-2 py-0.5 text-xs font-medium">
                              {tool.role}
                            </span>
                          </span>
                          <svg
                            viewBox="0 0 24 24"
                            className="text-foreground/50 size-4 shrink-0 transition-transform"
                            style={{
                              transform: isOpen
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                            }}
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
                          <p className="text-foreground/60 -mt-1 px-5 pb-4 text-sm">
                            {tool.summary}
                          </p>
                        )}

                        {isOpen && (
                          <div className="px-5 pb-5">
                            <p className="text-sm font-medium">
                              {tool.summary}
                            </p>
                            <div className="mt-3 space-y-2.5">
                              {tool.body.map((para, j) => (
                                <p
                                  key={j}
                                  className="text-foreground/70 text-sm leading-relaxed"
                                >
                                  {para}
                                </p>
                              ))}
                            </div>

                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                              <div className="border-foreground/[0.08] bg-background rounded-xl border p-3">
                                <p className="text-foreground/50 text-xs font-semibold tracking-wider uppercase">
                                  Hvornår bruger vi det
                                </p>
                                <p className="text-foreground/80 mt-1 text-sm">
                                  {tool.whenToUse}
                                </p>
                              </div>
                              <div className="border-foreground/[0.08] bg-background rounded-xl border p-3">
                                <p className="text-foreground/50 text-xs font-semibold tracking-wider uppercase">
                                  Pris
                                </p>
                                <p className="text-foreground/80 mt-1 text-sm">
                                  {tool.pricing}
                                </p>
                              </div>
                            </div>

                            <a
                              href={tool.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-foreground/70 hover:text-foreground mt-4 inline-flex items-center gap-1 text-sm font-medium underline-offset-4 hover:underline"
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
              </section>
            ),
          };
        })}
      />
    </div>
  );
}
