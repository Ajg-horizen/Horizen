"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Container from "@/components/Container";
import { ScrambleEyebrow } from "@/components/ui/scramble-eyebrow";
import { fadeIn } from "@/lib/animations";
import SeoVisualContent, { type SeoVisual } from "@/components/seo-visuals";

/**
 * Valgfrie sektioner til case-sider: udgangspunktet, synlighed i Google og
 * de løbende indsatser. Bruges af CaseStudyPage, når casen har data til dem.
 * Alle tal skal være målte tal med kilde. Ingen skøn.
 */

const inView = {
  initial: "hidden" as const,
  whileInView: "visible" as const,
  viewport: { once: true, margin: "-100px" },
  variants: fadeIn,
};

/* ─── Synlighed i Google ───────────────────────────────────── */

/**
 * Kun procenter. Rå tal (visninger, klik) gemmes ikke her, så de heller ikke
 * ligger i sidens kode. `growth` er vækst i procent i forhold til første måned.
 */
export type Visibility = {
  eyebrow: string;
  heading: string;
  intro?: string;
  chips: { label: string; value: string }[];
  /**
   * Måneder i rækkefølge. `growth` = vækst i procent i forhold til den gamle
   * løsnings normale niveau. `estimated` = anslået (ingen måling), tegnes svagt.
   * `note` vises ved hover (fx "Holdeside under flytning").
   */
  months: {
    label: string;
    growth: number;
    estimated?: boolean;
    note?: string;
  }[];
  /** Index i `months`, hvor det nye site gik live (markeres med en streg). */
  launchAfter?: number;
  /**
   * Valgfri: den gamle sides niveau måned for måned frem til lanceringen, som
   * faktor af snittet (1 = snit). Tegner en let bevægende gul linje og løfter
   * det gamle niveau lidt op fra bunden, så man kan se, at der var trafik før.
   * Sidste værdi bør være 1, så den grønne linje starter samme sted.
   */
  oldTrend?: number[];
  launchLabel?: string;
  note: string;
};

// Farver valideret mod mørk baggrund (dataviz-validator: alle tjek bestået).
const NEW = "#10a37f";
const OLD = "#b58a12";

/** Glat kurve gennem punkterne (Catmull-Rom → kubisk Bezier). */
function smoothPath(pts: { x: number; y: number }[]) {
  if (pts.length < 2) return "";
  let d = `M${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    // Kurven må aldrig dykke under det laveste af de to punkter (fx flad gammel linje før et spring).
    const floor = Math.max(p1.y, p2.y);
    d += ` C${c1x},${Math.min(c1y, p1.y)} ${c2x},${Math.min(c2y, floor)} ${p2.x},${p2.y}`;
  }
  return d;
}

const pct = (n: number) => {
  const r = Math.round(n);
  return `${r >= 0 ? "+" : "−"}${new Intl.NumberFormat("da-DK").format(Math.abs(r))} %`;
};

function GrowthChart({ data }: { data: Visibility }) {
  const [active, setActive] = useState<number | null>(null);
  const W = 1200;
  const H = 440;
  const L = 40;
  const R = 1160;
  const TOP = 50;
  const BOTTOM = 370;
  const n = data.months.length;
  const max = Math.max(...data.months.map((m) => m.growth + 100));
  const x = (i: number) => L + ((R - L) * i) / (n - 1);
  const hasTrend =
    !!data.oldTrend?.length && data.launchAfter !== undefined && max > 100;
  // Med oldTrend ligger det gamle niveau lidt over bunden i stedet for helt nede.
  const LIFT = BOTTOM - 35;
  const y = (index: number) =>
    hasTrend
      ? LIFT - ((index - 100) / (max - 100)) * (LIFT - TOP)
      : BOTTOM - (Math.max(index, 0) / max) * (BOTTOM - TOP);
  const pts = data.months.map((m, i) => ({ x: x(i), y: y(m.growth + 100) }));
  const base = y(100);
  const last = pts[n - 1];
  // Anslåede måneder først, målte efter. Den målte linje starter i sidste anslåede punkt.
  const firstMeasured = Math.max(
    0,
    data.months.findIndex((m) => !m.estimated),
  );
  const estPts = pts.slice(0, firstMeasured + 1);
  // Med oldTrend tegnes tiden før lanceringen af den gule linje, og den grønne starter ved lanceringen.
  const measPts = hasTrend
    ? pts.slice(data.launchAfter)
    : pts.slice(firstMeasured);
  // oldTrend fordeles jævnt fra første måned til lanceringen (flere punkter = små bølger).
  const oldPts = hasTrend
    ? data.oldTrend!.map((f, i, arr) => ({
        x: L + ((x(data.launchAfter!) - L) * i) / (arr.length - 1),
        y: base - (f - 1) * 90,
      }))
    : [];
  const oldAt = (month: number) =>
    oldPts[Math.round((month * (oldPts.length - 1)) / data.launchAfter!)];
  const oldLine = hasTrend
    ? `${smoothPath(oldPts)} L${R},${oldPts[oldPts.length - 1].y}`
    : "";
  const estLine = estPts.length > 1 ? smoothPath(estPts) : "";
  // Med oldTrend: en blød kurve, der starter fladt og bøjer opad mod sidste punkt.
  const measLine =
    hasTrend && measPts.length === 2
      ? (() => {
          const [a, b] = measPts;
          const dx = b.x - a.x;
          return `M${a.x},${a.y} C${a.x + dx * 0.55},${a.y} ${b.x - dx * 0.18},${a.y - (a.y - b.y) * 0.55} ${b.x},${b.y}`;
        })()
      : smoothPath(measPts);
  const launchX =
    data.launchAfter !== undefined
      ? (x(data.launchAfter) + x(data.launchAfter + 1)) / 2
      : null;

  return (
    <div className="relative">
      <div className="mb-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/60">
        <span className="flex items-center gap-2">
          <span
            className="h-[3px] w-5 rounded-full"
            style={{ background: NEW }}
          />{" "}
          Ny løsning
        </span>
        <span className="flex items-center gap-2">
          <span
            className="h-0 w-5 border-t-[3px] border-dashed"
            style={{ borderColor: OLD }}
          />{" "}
          Gammel løsning
        </span>
        {firstMeasured > 0 && (
          <span className="flex items-center gap-2">
            <span className="h-0 w-5 border-t-2 border-dotted border-white/40" />{" "}
            Anslået
          </span>
        )}
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="block h-auto w-full overflow-visible"
        role="img"
        aria-label={data.note}
      >
        <defs>
          <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={NEW} stopOpacity="0.28" />
            <stop offset="100%" stopColor={NEW} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[TOP, (TOP + BOTTOM) / 2, BOTTOM].map((gy) => (
          <line
            key={gy}
            x1="0"
            x2={W}
            y1={gy}
            y2={gy}
            stroke="rgba(255,255,255,0.06)"
          />
        ))}
        {launchX !== null && (
          <g>
            <line
              x1={launchX}
              x2={launchX}
              y1={TOP - 20}
              y2={BOTTOM}
              stroke="rgba(255,255,255,0.18)"
              strokeDasharray="4 6"
            />
            <text
              x={launchX - 12}
              y={(TOP + BOTTOM) / 2}
              fill="rgba(255,255,255,0.5)"
              fontSize="15"
              textAnchor="end"
            >
              {data.launchLabel}
            </text>
          </g>
        )}
        {/* Den gamle løsnings niveau: stiplet linje (let bevægende med oldTrend) */}
        {hasTrend ? (
          <path
            d={oldLine}
            fill="none"
            stroke={OLD}
            strokeWidth="3"
            strokeDasharray="10 8"
            strokeLinecap="round"
          />
        ) : (
          <line
            x1={L}
            x2={R}
            y1={base}
            y2={base}
            stroke={OLD}
            strokeWidth="3"
            strokeDasharray="10 8"
            strokeLinecap="round"
          />
        )}
        <text
          x={R}
          y={base - 14}
          fill={OLD}
          fontSize="15"
          fontWeight="700"
          textAnchor="end"
        >
          Gammel løsning
        </text>
        {estLine && (
          <path
            d={estLine}
            fill="none"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="2"
            strokeDasharray="2 7"
            strokeLinecap="round"
          />
        )}
        <motion.path
          d={`${measLine} L${last.x},${BOTTOM} L${measPts[0].x},${BOTTOM} Z`}
          fill="url(#growthFill)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6 }}
        />
        <motion.path
          d={measLine}
          fill="none"
          stroke={NEW}
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.215, 0.61, 0.355, 1] }}
        />
        <circle cx={last.x} cy={last.y} r="14" fill={NEW} opacity="0.2" />
        <text
          x={last.x - 22}
          y={last.y + 5}
          fill={NEW}
          fontSize="15"
          fontWeight="700"
          textAnchor="end"
        >
          Ny løsning {pct(data.months[n - 1].growth)}
        </text>
        {pts.map((pt, i) => {
          const m = data.months[i];
          // Før lanceringen (med oldTrend) sidder prikken på den gule linje.
          const onOld = hasTrend && i < data.launchAfter!;
          const p = onOld ? oldAt(i) : pt;
          return (
            <g key={m.label}>
              {onOld ? (
                <circle cx={p.x} cy={p.y} r={active === i ? 7 : 5} fill={OLD} />
              ) : m.estimated ? (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={active === i ? 6 : 4}
                  fill="#0f0f0f"
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="1.5"
                />
              ) : (
                <circle cx={p.x} cy={p.y} r={active === i ? 8 : 6} fill={NEW} />
              )}
              <text
                x={p.x}
                y={BOTTOM + 34}
                fill={
                  m.estimated
                    ? "rgba(255,255,255,0.3)"
                    : "rgba(255,255,255,0.6)"
                }
                fontSize="15"
                textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"}
              >
                {m.label}
              </text>
              {/* Større usynligt felt, så hover rammer let */}
              <circle
                cx={p.x}
                cy={p.y}
                r="30"
                fill="transparent"
                tabIndex={0}
                aria-label={`${m.label}: ${m.estimated ? "anslået niveau" : pct(m.growth)}${m.note ? `, ${m.note}` : ""}`}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className="cursor-default outline-none"
              />
            </g>
          );
        })}
        {active !== null &&
          (() => {
            const m = data.months[active];
            const main = m.estimated
              ? "Anslået niveau"
              : active === 0
                ? "Udgangspunkt"
                : `${pct(m.growth)} visninger`;
            const sub =
              m.note ??
              (m.estimated
                ? "Ingen måling fra perioden"
                : "ift. gammel løsning");
            const bx = Math.min(Math.max(pts[active].x - 120, 0), W - 240);
            const by = Math.max(pts[active].y - 80, 0);
            return (
              <g pointerEvents="none">
                <rect
                  x={bx}
                  y={by}
                  width="240"
                  height="58"
                  rx="8"
                  fill="#f5f5f0"
                />
                <text
                  x={bx + 120}
                  y={by + 25}
                  fill="#0f0f0f"
                  fontSize="15"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {main}
                </text>
                <text
                  x={bx + 120}
                  y={by + 45}
                  fill="#555"
                  fontSize="13"
                  textAnchor="middle"
                >
                  {sub}
                </text>
              </g>
            );
          })()}
      </svg>
    </div>
  );
}

export function VisibilitySection({ data }: { data: Visibility }) {
  return (
    <section
      className="bg-[#0f0f0f] text-[#f5f5f0]"
      style={{
        boxShadow: "0 0 0 100vmax #0f0f0f",
        clipPath: "inset(0 -100vmax)",
      }}
    >
      <Container size="site" className="py-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          {/* Venstre: tekst og nøgletal */}
          <motion.div {...inView} custom={0} className="lg:col-span-5">
            <ScrambleEyebrow className="text-xs font-medium tracking-[0.3em] text-white/40 uppercase">
              {data.eyebrow}
            </ScrambleEyebrow>
            <h2 className="mt-4 text-3xl font-bold tracking-tight whitespace-pre-line md:text-4xl">
              {data.heading}
            </h2>
            {data.intro && (
              <p className="mt-4 leading-relaxed text-white/60">{data.intro}</p>
            )}
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {data.chips.map((c) => (
                <div
                  key={c.label}
                  className="flex flex-col justify-between rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4"
                >
                  <p className="text-[10px] leading-snug font-semibold tracking-[0.18em] text-white/45 uppercase">
                    {c.label}
                  </p>
                  <p
                    className="mt-2 text-2xl font-bold tracking-tight whitespace-nowrap tabular-nums md:text-3xl"
                    style={{ color: NEW }}
                  >
                    {c.value}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-8 text-xs leading-relaxed text-white/40">
              {data.note}
            </p>
          </motion.div>

          {/* Højre: grafen */}
          <motion.div {...inView} custom={1} className="lg:col-span-7">
            <GrowthChart data={data} />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

/* ─── Discipliner (fx løbende SEO) ─────────────────────────── */

export type Disciplines = {
  eyebrow: string;
  heading: string;
  intro?: string;
  /** De månedlige indsatser. `tags` er fagtermerne, `visual` indholdet i programvinduet. */
  items: {
    title: string;
    text: string;
    tags: string[];
    visual: SeoVisual;
    link?: { href: string; label: string };
  }[];
};

/**
 * Ét kort i samme stil som forsidens "Struktur er fundamentet" (BentoShowcase):
 * mørkt kort, eyebrow og sætning, og et forskudt programvindue med indhold.
 * Indholdet afspilles, når kortet kommer ind, og igen ved hover.
 */
function DisciplineCard({
  item,
  index,
}: {
  item: Disciplines["items"][number];
  index: number;
}) {
  const [run, setRun] = useState(0);
  return (
    <motion.li
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
      onViewportEnter={() => setRun((r) => r || 1)}
      onMouseEnter={() => setRun((r) => r + 1)}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/[0.10] bg-gradient-to-b from-[#1e1e1e] via-[#141414] to-[#111111] shadow-xl shadow-black/20 transition-shadow duration-500 hover:shadow-black/30"
    >
      <div className="relative z-10 p-6 sm:p-7">
        <span className="font-mono text-[11px] text-white/35 tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="mt-2 text-xl font-semibold tracking-tight text-[#f5f5f0]">
          {item.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-white/60">
          {item.text}
        </p>
        {item.link && (
          <Link
            href={item.link.href}
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#f5f5f0] underline decoration-white/25 underline-offset-4 transition-colors hover:decoration-white"
          >
            {item.link.label} →
          </Link>
        )}
        <div className="mt-4 flex flex-wrap gap-1">
          {item.tags.map((t) => (
            <span
              key={t}
              className="rounded-md border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 font-mono text-[9px] text-white/55"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="relative mt-auto h-[150px] w-full overflow-hidden rounded-2xl sm:h-[160px]">
        <div className="absolute top-7 left-8 h-full w-full rounded-2xl border border-white/[0.04] bg-[#1e1e1e] opacity-60" />
        <div className="absolute top-3 left-10 flex h-full w-full flex-col overflow-hidden rounded-tl-2xl bg-[#1a1a1a] shadow-lg ring-4 ring-white/[0.06]">
          <div className="flex items-center border-b border-white/[0.06] px-4 py-2.5">
            <div className="flex gap-1">
              <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
              <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
              <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
            </div>
          </div>
          <div className="relative flex-1 overflow-hidden p-4 pr-16">
            <SeoVisualContent visual={item.visual} run={run} />
            <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-20 h-8 bg-gradient-to-t from-[#1a1a1a] to-transparent" />
          </div>
        </div>
      </div>
    </motion.li>
  );
}

export function DisciplinesSection({ data }: { data: Disciplines }) {
  return (
    <Container as="section" size="site" className="py-24">
      <motion.div {...inView} custom={0} className="max-w-3xl">
        <ScrambleEyebrow>{data.eyebrow}</ScrambleEyebrow>
        <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
          {data.heading}
        </h2>
        {data.intro && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
            {data.intro}
          </p>
        )}
      </motion.div>
      <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.items.map((item, i) => (
          <DisciplineCard key={item.title} item={item} index={i} />
        ))}
      </ol>
    </Container>
  );
}

/* ─── Udgangspunktet: overskrift, prosa og store tal ──────── */

export type CaseStory = {
  eyebrow: string;
  heading: string;
  /** Udfordring og løsning som almindelig prosa (to-tre korte afsnit). */
  paragraphs: string[];
  /** Store tal i en række nederst. Kun målte tal. */
  facts: { value: string; label: string }[];
};

export function StorySection({ data }: { data: CaseStory }) {
  return (
    <Container as="section" size="site" className="py-24">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <motion.div {...inView} custom={0} className="lg:col-span-6">
          <ScrambleEyebrow>{data.eyebrow}</ScrambleEyebrow>
          <h2 className="mt-4 text-4xl leading-[1.05] font-bold tracking-tight whitespace-pre-line md:text-5xl">
            {data.heading}
          </h2>
        </motion.div>
        <motion.div
          {...inView}
          custom={1}
          className="space-y-5 lg:col-span-6 lg:pt-10"
        >
          {data.paragraphs.map((p, i) => (
            <p
              key={i}
              className="text-base leading-relaxed text-muted md:text-lg"
            >
              {p}
            </p>
          ))}
        </motion.div>
      </div>

      <div className="mt-16 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-foreground/[0.08] pt-10 md:mt-20 lg:grid-cols-4">
        {data.facts.map((f, i) => (
          <motion.div key={f.label} {...inView} custom={i * 0.5 + 1}>
            <p className="text-3xl font-bold tracking-tight tabular-nums md:text-4xl">
              {f.value}
            </p>
            <p className="mt-2 max-w-[16rem] text-sm leading-snug text-muted">
              {f.label}
            </p>
          </motion.div>
        ))}
      </div>
    </Container>
  );
}
