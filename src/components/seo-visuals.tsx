"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2Icon, SearchIcon, SparklesIcon } from "lucide-react";
import CodeTyper, { type CodeLine } from "@/components/CodeTyper";

/**
 * Indhold til de små programvinduer på SEO-kortene. Samme udtryk som
 * forsidens "Struktur er fundamentet" (BentoShowcase): små dashboards,
 * fremdriftslinjer, grønne nøgletal og tjeklister, blandet med kode.
 * Alle afspiller forfra, når `run` skifter.
 */

export type SeoVisual =
  | { kind: "code"; file: string; lines: CodeLine[] }
  | {
      kind: "cwv";
      rows: { label: string; value: string; pct: number }[];
      stats: { label: string; value: string }[];
    }
  | {
      kind: "serp";
      query: string;
      url: string;
      title: string;
      description: string;
      badge: string;
    }
  | {
      kind: "links";
      /** Overskrift over listen. Standard: "Henvisende kilder". */
      label?: string;
      items: string[];
      stat: { label: string; value: string };
    }
  | {
      kind: "dashboard";
      nav: string[];
      chartLabel: string;
      stats: { label: string; value: string }[];
    }
  | {
      kind: "ai";
      question: string;
      answer: string;
      source: string;
      footer: string;
    };

const GREEN = "#00b67a";
const EASE = [0.23, 1, 0.32, 1] as const;

function useEnter(reduce: boolean | null) {
  return (delay = 0) =>
    reduce
      ? { initial: false as const }
      : {
          initial: { opacity: 0, y: 6, filter: "blur(3px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { duration: 0.4, delay, ease: EASE },
        };
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1 block text-[9px] font-medium tracking-wide text-white/50 uppercase">
      {children}
    </span>
  );
}

function Bar({
  pct,
  delay,
  reduce,
}: {
  pct: number;
  delay: number;
  reduce: boolean | null;
}) {
  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
      <motion.div
        initial={reduce ? false : { width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1, delay, ease: "easeOut" }}
        className="h-full rounded-full"
        style={{ backgroundColor: GREEN }}
      />
    </div>
  );
}

function Cwv({
  v,
  reduce,
}: {
  v: Extract<SeoVisual, { kind: "cwv" }>;
  reduce: boolean | null;
}) {
  const enter = useEnter(reduce);
  return (
    <div className="flex flex-col gap-2.5">
      <Label>Core Web Vitals</Label>
      {v.rows.map((r, i) => (
        <motion.div
          key={r.label}
          {...enter(i * 0.12)}
          className="flex flex-col gap-1"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] text-white/50">
              {r.label}
            </span>
            <span className="text-[9px] font-medium text-[#f5f5f0]">
              {r.value}
            </span>
          </div>
          <Bar pct={r.pct} delay={0.1 + i * 0.12} reduce={reduce} />
        </motion.div>
      ))}
      <div className="mt-1 grid grid-cols-2 gap-1.5">
        {v.stats.map((s, i) => (
          <motion.div
            key={s.label}
            {...enter(0.5 + i * 0.1)}
            className="flex flex-col rounded-lg border border-white/[0.08] bg-white/[0.04] p-2.5"
          >
            <span className="text-sm font-semibold text-emerald-400">
              {s.value}
            </span>
            <span className="text-[8px] font-medium text-white/50 uppercase">
              {s.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Serp({
  v,
  reduce,
}: {
  v: Extract<SeoVisual, { kind: "serp" }>;
  reduce: boolean | null;
}) {
  const enter = useEnter(reduce);
  return (
    <div className="flex flex-col gap-2.5">
      <motion.div
        {...enter(0)}
        className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5"
      >
        <SearchIcon className="size-2.5 text-white/40" />
        <span className="text-[9px] text-white/70">{v.query}</span>
      </motion.div>
      <motion.div
        {...enter(0.25)}
        className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-2.5"
      >
        <div className="flex items-center justify-between">
          <span className="text-[8px] text-white/45">{v.url}</span>
          <span className="rounded-full bg-[#00b67a]/15 px-1.5 py-0.5 text-[8px] font-semibold text-[#00b67a]">
            {v.badge}
          </span>
        </div>
        <p className="mt-1 text-[11px] leading-snug font-medium text-[#8ab4f8]">
          {v.title}
        </p>
        <p className="mt-1 text-[9px] leading-relaxed text-white/55">
          {v.description}
        </p>
      </motion.div>
      {[0, 1].map((i) => (
        <motion.div
          key={i}
          {...enter(0.45 + i * 0.1)}
          className="space-y-1 px-1 opacity-40"
        >
          <div className="h-1.5 w-24 rounded bg-white/15" />
          <div className="h-1 w-full rounded bg-white/[0.08]" />
        </motion.div>
      ))}
    </div>
  );
}

function Links({
  v,
  reduce,
}: {
  v: Extract<SeoVisual, { kind: "links" }>;
  reduce: boolean | null;
}) {
  const enter = useEnter(reduce);
  return (
    <div className="flex flex-col gap-2">
      <motion.div
        {...enter(0)}
        className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-2.5"
      >
        <span className="text-[9px] font-medium text-white/50">
          {v.stat.label}
        </span>
        <span className="mt-1 block text-lg font-semibold text-emerald-400">
          {v.stat.value}
        </span>
      </motion.div>
      <Label>{v.label ?? "Henvisende kilder"}</Label>
      {v.items.map((t, i) => (
        <motion.div
          key={t}
          {...enter(0.2 + i * 0.12)}
          className="flex items-center gap-2 py-0.5"
        >
          <CheckCircle2Icon className="size-3 shrink-0 text-emerald-500" />
          <span className="text-[9px] text-[#f5f5f0]">{t}</span>
        </motion.div>
      ))}
    </div>
  );
}

function Ai({
  v,
  reduce,
}: {
  v: Extract<SeoVisual, { kind: "ai" }>;
  reduce: boolean | null;
}) {
  const enter = useEnter(reduce);
  return (
    <div className="flex flex-col gap-2">
      <motion.div
        {...enter(0)}
        className="ml-auto max-w-[85%] rounded-xl bg-white/[0.08] px-2.5 py-1.5 text-[9px] text-white/80"
      >
        {v.question}
      </motion.div>
      <motion.div
        {...enter(0.35)}
        className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-2.5"
      >
        <div className="mb-1 flex items-center gap-1.5">
          <SparklesIcon className="size-2.5 text-[#00b67a]" />
          <span className="text-[8px] tracking-[0.15em] text-white/40 uppercase">
            AI-svar
          </span>
        </div>
        <p className="text-[9px] leading-relaxed text-white/75">{v.answer}</p>
        <motion.span
          {...enter(0.8)}
          className="mt-2 inline-block rounded-md bg-[#00b67a]/15 px-1.5 py-0.5 text-[8px] font-semibold text-[#00b67a]"
        >
          Kilde: {v.source}
        </motion.span>
      </motion.div>
      <motion.span {...enter(1)} className="font-mono text-[8px] text-white/35">
        {v.footer}
      </motion.span>
    </div>
  );
}

function Dashboard({
  v,
  reduce,
}: {
  v: Extract<SeoVisual, { kind: "dashboard" }>;
  reduce: boolean | null;
}) {
  const enter = useEnter(reduce);
  return (
    <div className="flex gap-3">
      <div className="flex w-20 shrink-0 flex-col gap-0.5 border-r border-white/[0.06] pr-2">
        {v.nav.map((n, i) => (
          <span
            key={n}
            className={`truncate rounded-md px-1.5 py-1 text-[8px] ${
              i === 0
                ? "border border-white/[0.08] bg-white/[0.06] text-[#f5f5f0]"
                : "text-white/40"
            }`}
          >
            {n}
          </span>
        ))}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <motion.div
          {...enter(0)}
          className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-2"
        >
          <span className="text-[8px] font-medium text-white/50 uppercase">
            {v.chartLabel}
          </span>
          <svg
            viewBox="0 0 120 32"
            className="mt-1 h-8 w-full"
            aria-hidden="true"
          >
            <motion.path
              d="M0 30 C20 29 35 29 50 27 S80 18 95 10 S112 3 120 2"
              fill="none"
              stroke={GREEN}
              strokeWidth="2"
              strokeLinecap="round"
              initial={reduce ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.1, ease: EASE }}
            />
          </svg>
        </motion.div>
        <div className="grid grid-cols-2 gap-1.5">
          {v.stats.map((s, i) => (
            <motion.div
              key={s.label}
              {...enter(0.4 + i * 0.12)}
              className="flex flex-col rounded-lg border border-white/[0.08] bg-white/[0.04] p-2"
            >
              <span className="text-xs font-semibold text-emerald-400">
                {s.value}
              </span>
              <span className="text-[8px] leading-tight text-white/50">
                {s.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Indholdet i programvinduet. Ny `run` = afspil forfra. */
export default function SeoVisualContent({
  visual,
  run,
}: {
  visual: SeoVisual;
  run: number;
}) {
  const reduce = useReducedMotion();
  if (visual.kind === "code")
    return <CodeTyper file={visual.file} lines={visual.lines} run={run} bare />;
  if (!run && !reduce) return null;
  switch (visual.kind) {
    case "cwv":
      return <Cwv key={run} v={visual} reduce={reduce} />;
    case "serp":
      return <Serp key={run} v={visual} reduce={reduce} />;
    case "links":
      return <Links key={run} v={visual} reduce={reduce} />;
    case "dashboard":
      return <Dashboard key={run} v={visual} reduce={reduce} />;
    case "ai":
      return <Ai key={run} v={visual} reduce={reduce} />;
  }
}
