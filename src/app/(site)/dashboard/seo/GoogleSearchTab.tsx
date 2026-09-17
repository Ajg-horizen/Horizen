import type { SeoSnapshot } from "@/sanity/seo-snapshots";
import type { PageDetail } from "./data";
import { MetricCard, SectionHeader } from "./ui";

/**
 * Fanen "Google-søgning": rigtige Search Console-tal måned for måned.
 * Tallene hentes automatisk den 3. i hver måned af /api/cron/seo-snapshot.
 */

const MONTHS = ["januar", "februar", "marts", "april", "maj", "juni", "juli", "august", "september", "oktober", "november", "december"];

function formatMonth(month: string): string {
  const [y, m] = month.split("-").map(Number);
  return `${MONTHS[m - 1] ?? month} ${y}`;
}

const dk = (n: number, decimals = 0) =>
  n.toLocaleString("da-DK", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

type Delta = { text: string; direction: "up" | "down"; tone: "good" | "bad" | "warn" };

/** Ændring i forhold til forrige måned. `higherBetter=false` for position. */
function delta(
  current: number | undefined,
  previous: number | undefined,
  kind: "percent" | "points" | "absolute",
  higherBetter: boolean,
): Delta | undefined {
  if (current == null || previous == null) return undefined;
  const diff = current - previous;
  if (diff === 0) return undefined;
  if (kind === "percent" && previous === 0) return undefined;

  const text =
    kind === "percent"
      ? `${dk(Math.abs((diff / previous) * 100))} %`
      : kind === "points"
        ? `${dk(Math.abs(diff), 1)} pp`
        : dk(Math.abs(diff), 1);
  const improved = higherBetter ? diff > 0 : diff < 0;
  return { text, direction: diff > 0 ? "up" : "down", tone: improved ? "good" : "bad" };
}

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

  const vs = previous ? `vs. ${formatMonth(previous.month)}` : "Første måling";
  const targets = pages.filter((p) => p.keywords.primary);

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
          status="neutral"
          hint={vs}
          delta={delta(latest.clicks, previous?.clicks, "percent", true)}
        />
        <MetricCard
          label="Visninger"
          value={dk(latest.impressions ?? 0)}
          status="neutral"
          hint={vs}
          delta={delta(latest.impressions, previous?.impressions, "percent", true)}
        />
        <MetricCard
          label="CTR"
          value={`${dk(latest.ctr ?? 0, 1)} %`}
          status="neutral"
          hint={vs}
          delta={delta(latest.ctr, previous?.ctr, "points", true)}
        />
        <MetricCard
          label="Snit-position"
          value={dk(latest.avgPosition ?? 0, 1)}
          status="neutral"
          hint={`${vs} · lavere er bedre`}
          delta={delta(latest.avgPosition, previous?.avgPosition, "absolute", false)}
        />
      </div>

      {latest.capturedAt && (
        <p className="mt-3 text-xs text-foreground/50">
          Data opdateret{" "}
          {new Date(latest.capturedAt).toLocaleDateString("da-DK", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      )}

      {/* Udvikling måned for måned */}
      <div className="mt-8 rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] p-6">
        <h3 className="mb-4 text-base font-semibold">Udvikling måned for måned</h3>
        <div className="overflow-x-auto rounded-xl border border-foreground/[0.06]">
          <table className="w-full min-w-[520px] text-sm">
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
              {snapshots.map((s) => (
                <tr key={s.month}>
                  <td className="px-4 py-2.5 font-medium">{formatMonth(s.month)}</td>
                  <td className={`${td} text-right`}>{s.clicks != null ? dk(s.clicks) : "·"}</td>
                  <td className={`${td} text-right`}>{s.impressions != null ? dk(s.impressions) : "·"}</td>
                  <td className={`${td} text-right`}>{s.ctr != null ? `${dk(s.ctr, 1)} %` : "·"}</td>
                  <td className={`${td} text-right`}>{s.avgPosition != null ? dk(s.avgPosition, 1) : "·"}</td>
                </tr>
              ))}
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
            5-15, tæt på toppen).
          </p>
          <div className="overflow-x-auto rounded-xl border border-foreground/[0.06]">
            <table className="w-full min-w-[560px] text-sm">
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
                      <td className="px-4 py-2.5 font-medium">{q.query}</td>
                      <td className={`${td} text-right`}>{dk(q.clicks)}</td>
                      <td className={`${td} text-right`}>{dk(q.impressions)}</td>
                      <td className={`${td} text-right`}>{dk(q.ctr, 1)} %</td>
                      <td className={`${td} text-right font-medium ${quickWin ? "text-emerald-600" : ""}`}>
                        {dk(q.position, 1)}
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
            søgeord og plan pr. side står under SEO Status.
          </p>
          <div className="overflow-x-auto rounded-xl border border-foreground/[0.06]">
            <table className="w-full min-w-[560px] text-sm">
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
                          <td className={`${td} text-right font-medium`}>{dk(hit.position, 1)}</td>
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
