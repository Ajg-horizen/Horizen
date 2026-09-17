import type { SeoSnapshot } from "@/sanity/seo-snapshots";
import type { PageDetail } from "./data";
import { MetricCard, SectionHeader } from "./ui";

/**
 * Fanen "Google-søgning": rigtige Search Console-tal måned for måned.
 * Tallene hentes automatisk den 3. i hver måned af /api/cron/seo-snapshot.
 *
 * Alt der går frem er grønt, alt der går tilbage er rødt. For position er
 * LAVERE bedre, så en faldende position er grøn.
 */

const MONTHS = ["januar", "februar", "marts", "april", "maj", "juni", "juli", "august", "september", "oktober", "november", "december"];

function formatMonth(month: string): string {
  const [y, m] = month.split("-").map(Number);
  return `${MONTHS[m - 1] ?? month} ${y}`;
}

const dk = (n: number, decimals = 0) =>
  n.toLocaleString("da-DK", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

type Kind = "percent" | "points" | "places";
type Delta = { text: string; direction: "up" | "down"; tone: "good" | "bad" | "warn"; improved: boolean };

/** Ændring i forhold til måneden før. `higherBetter=false` for position. */
function delta(
  current: number | undefined,
  previous: number | undefined,
  kind: Kind,
  higherBetter: boolean,
): Delta | undefined {
  if (current == null || previous == null) return undefined;
  const diff = current - previous;
  if (Math.abs(diff) < 0.05) return undefined;
  if (kind === "percent" && previous === 0) return undefined;

  const abs = Math.abs(diff);
  const text =
    kind === "percent"
      ? `${dk(Math.abs((diff / previous) * 100))} %`
      : kind === "points"
        ? `${dk(abs, 1)} pp`
        : `${dk(abs, 1)} ${abs === 1 ? "plads" : "pladser"}`;
  const improved = higherBetter ? diff > 0 : diff < 0;
  return { text, direction: diff > 0 ? "up" : "down", tone: improved ? "good" : "bad", improved };
}

/** Lille farvet markering til tabelceller: grøn = frem, rød = tilbage. */
function Change({ d }: { d?: Delta }) {
  if (!d) return null;
  return (
    <span
      className={`ml-2 inline-flex items-center rounded-full px-1.5 py-0.5 text-[11px] font-medium tabular-nums ${
        d.improved ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"
      }`}
    >
      {d.direction === "up" ? "↑" : "↓"}
      {d.text}
    </span>
  );
}

const cardStatus = (d?: Delta) => (d ? (d.improved ? "good" : "warning") : "neutral");
const cardHint = (d: Delta | undefined, vs: string, goodWord: string, badWord: string) =>
  d ? `${d.improved ? goodWord : badWord} ${vs}` : vs;

const th = "px-4 py-2.5 font-medium";
const td = "px-4 py-2.5 tabular-nums";

export default function GoogleSearchTab({ snapshots, pages }: { snapshots: SeoSnapshot[]; pages: PageDetail[] }) {
  const latest = snapshots[0];
  const previous = snapshots[1];

  if (!latest) {
    return (
      <>
        <SectionHeader
          title="Google-søgning"
          description="Google Search Console, hele sitet. Tallene hentes automatisk den 3. i hver måned."
        />
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] p-6">
          <p className="text-sm leading-relaxed text-foreground/80">
            <span className="font-medium">Afventer første snapshot.</span> Felterne står tomme med vilje, så der
            ikke vises opdigtede tal. Når cron-jobbet har kørt første gang, vises nøgletal, udvikling måned for
            måned og top-søgninger her.
          </p>
        </div>
      </>
    );
  }

  const vs = previous ? `mod ${formatMonth(previous.month)}` : "Første måling, ingen måned at sammenligne med endnu";
  const targets = pages.filter((p) => p.keywords.primary);

  const dClicks = delta(latest.clicks, previous?.clicks, "percent", true);
  const dImpr = delta(latest.impressions, previous?.impressions, "percent", true);
  const dCtr = delta(latest.ctr, previous?.ctr, "points", true);
  const dPos = delta(latest.avgPosition, previous?.avgPosition, "places", false);

  // Forrige måneds placering pr. søgning, så vi kan vise om en søgning er rykket.
  const prevPosition = new Map((previous?.topQueries ?? []).map((q) => [q.query.toLowerCase(), q.position]));

  return (
    <>
      <SectionHeader
        title="Google-søgning"
        description={`Google Search Console, hele sitet. Nyeste måned: ${formatMonth(latest.month)}. Opdateres automatisk den 3. i hver måned.`}
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Klik"
          value={dk(latest.clicks ?? 0)}
          status={cardStatus(dClicks)}
          hint={cardHint(dClicks, vs, "Flere klik", "Færre klik")}
          delta={dClicks}
        />
        <MetricCard
          label="Visninger"
          value={dk(latest.impressions ?? 0)}
          status={cardStatus(dImpr)}
          hint={cardHint(dImpr, vs, "Vist oftere", "Vist sjældnere")}
          delta={dImpr}
        />
        <MetricCard
          label="CTR"
          value={`${dk(latest.ctr ?? 0, 1)} %`}
          status={cardStatus(dCtr)}
          hint={cardHint(dCtr, vs, "Flere vælger os", "Færre vælger os")}
          delta={dCtr}
        />
        <MetricCard
          label="Snit-position"
          value={dk(latest.avgPosition ?? 0, 1)}
          status={cardStatus(dPos)}
          hint={cardHint(dPos, vs, "Rykket op", "Rykket ned")}
          delta={dPos}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-foreground/50">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-emerald-500" /> Grøn = går frem
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-red-500" /> Rød = går tilbage
        </span>
        <span>Position: lavere tal er bedre, så et fald er grønt</span>
        {latest.capturedAt && (
          <span>
            Data opdateret{" "}
            {new Date(latest.capturedAt).toLocaleDateString("da-DK", { day: "numeric", month: "long", year: "numeric" })}
          </span>
        )}
      </div>

      {/* Udvikling måned for måned */}
      <div className="mt-8 rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] p-6">
        <h3 className="mb-1 text-base font-semibold">Udvikling måned for måned</h3>
        <p className="mb-4 text-xs text-foreground/60">Markeringen viser ændringen i forhold til måneden før.</p>
        <div className="overflow-x-auto rounded-xl border border-foreground/[0.06]">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-foreground/[0.03] text-xs uppercase tracking-wide text-foreground/60">
              <tr>
                <th className={`${th} text-left`}>Måned</th>
                <th className={`${th} text-right`}>Klik</th>
                <th className={`${th} text-right`}>Visninger</th>
                <th className={`${th} text-right`}>CTR</th>
                <th className={`${th} text-right`}>Snit-position</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/[0.06]">
              {snapshots.map((s, i) => {
                const before = snapshots[i + 1];
                return (
                  <tr key={s.month}>
                    <td className="px-4 py-2.5 font-medium">{formatMonth(s.month)}</td>
                    <td className={`${td} text-right`}>
                      {s.clicks != null ? dk(s.clicks) : "·"}
                      <Change d={delta(s.clicks, before?.clicks, "percent", true)} />
                    </td>
                    <td className={`${td} text-right`}>
                      {s.impressions != null ? dk(s.impressions) : "·"}
                      <Change d={delta(s.impressions, before?.impressions, "percent", true)} />
                    </td>
                    <td className={`${td} text-right`}>
                      {s.ctr != null ? `${dk(s.ctr, 1)} %` : "·"}
                      <Change d={delta(s.ctr, before?.ctr, "points", true)} />
                    </td>
                    <td className={`${td} text-right`}>
                      {s.avgPosition != null ? dk(s.avgPosition, 1) : "·"}
                      <Change d={delta(s.avgPosition, before?.avgPosition, "places", false)} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top-søgninger */}
      {latest.topQueries && latest.topQueries.length > 0 && (
        <div className="mt-5 rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] p-6">
          <h3 className="mb-1 text-base font-semibold">Top-søgninger</h3>
          <p className="mb-4 text-xs text-foreground/60">
            De søgninger sitet fik flest klik på i {formatMonth(latest.month)}. Grøn position = quick win (plads
            5-15, tæt på toppen). Pilen viser, hvor mange pladser søgningen er rykket siden måneden før.
          </p>
          <div className="overflow-x-auto rounded-xl border border-foreground/[0.06]">
            <table className="w-full min-w-[620px] text-sm">
              <thead className="bg-foreground/[0.03] text-xs uppercase tracking-wide text-foreground/60">
                <tr>
                  <th className={`${th} text-left`}>Søgning</th>
                  <th className={`${th} text-right`}>Klik</th>
                  <th className={`${th} text-right`}>Visninger</th>
                  <th className={`${th} text-right`}>CTR</th>
                  <th className={`${th} text-right`}>Position</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-foreground/[0.06]">
                {latest.topQueries.slice(0, 15).map((q) => {
                  const quickWin = q.position >= 5 && q.position <= 15;
                  return (
                    <tr key={q.query}>
                      <td className="px-4 py-2.5 font-medium">
                        {q.query}
                        {quickWin && (
                          <span className="ml-2 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[11px] font-medium text-emerald-600">
                            quick win
                          </span>
                        )}
                      </td>
                      <td className={`${td} text-right`}>{dk(q.clicks)}</td>
                      <td className={`${td} text-right`}>{dk(q.impressions)}</td>
                      <td className={`${td} text-right`}>{dk(q.ctr, 1)} %</td>
                      <td className={`${td} text-right font-medium ${quickWin ? "text-emerald-600" : ""}`}>
                        {dk(q.position, 1)}
                        <Change d={delta(q.position, prevPosition.get(q.query.toLowerCase()), "places", false)} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Målsøgeord matchet mod månedens søgninger */}
      {targets.length > 0 && (
        <div className="mt-5 rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] p-6">
          <h3 className="mb-1 text-base font-semibold">Vores målsøgeord</h3>
          <p className="mb-4 text-xs text-foreground/60">
            Hvor sitet ligger på det primære søgeord, hver side går efter ({formatMonth(latest.month)}). Sekundære
            søgeord og plan pr. side står under Arbejdsrum.
          </p>
          <div className="overflow-x-auto rounded-xl border border-foreground/[0.06]">
            <table className="w-full min-w-[620px] text-sm">
              <thead className="bg-foreground/[0.03] text-xs uppercase tracking-wide text-foreground/60">
                <tr>
                  <th className={`${th} text-left`}>Side</th>
                  <th className={`${th} text-left`}>Primært søgeord</th>
                  <th className={`${th} text-right`}>Klik</th>
                  <th className={`${th} text-right`}>Visninger</th>
                  <th className={`${th} text-right`}>Position</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-foreground/[0.06]">
                {targets.map((p) => {
                  const keyword = p.keywords.primary as string;
                  const hit = latest.topQueries?.find((q) => q.query.toLowerCase() === keyword.toLowerCase());
                  return (
                    <tr key={p.url}>
                      <td className="px-4 py-2.5 font-medium">{p.name}</td>
                      <td className="px-4 py-2.5 text-foreground/70">{keyword}</td>
                      {hit ? (
                        <>
                          <td className={`${td} text-right`}>{dk(hit.clicks)}</td>
                          <td className={`${td} text-right`}>{dk(hit.impressions)}</td>
                          <td className={`${td} text-right font-medium`}>
                            {dk(hit.position, 1)}
                            <Change d={delta(hit.position, prevPosition.get(keyword.toLowerCase()), "places", false)} />
                          </td>
                        </>
                      ) : (
                        <td colSpan={3} className="px-4 py-2.5 text-right text-xs text-foreground/50">
                          Ikke blandt månedens 25 mest klikkede søgninger
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
