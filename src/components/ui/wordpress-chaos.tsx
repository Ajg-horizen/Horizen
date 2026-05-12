"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangleIcon,
  ShieldAlertIcon,
  DatabaseIcon,
  RefreshCwIcon,
  ClockIcon,
  ZapOffIcon,
  TerminalIcon,
  MailXIcon,
  SparklesIcon,
  LucideIcon,
} from "lucide-react";

type Severity = "high" | "medium" | "low";

type Notice = {
  icon: LucideIcon;
  title: string;
  meta: string;
  cleanMeta: string;
  severity: Severity;
};

const NOTICES: Notice[] = [
  {
    icon: RefreshCwIcon,
    title: "42 plugins skal opdateres",
    meta: "11 sikkerhedsrelaterede",
    cleanMeta: "Løst · 30 plugins fjernet, 12 opdateret",
    severity: "high",
  },
  {
    icon: ShieldAlertIcon,
    title: "3 kritiske sikkerhedsadvarsler",
    meta: "Aktive trusler",
    cleanMeta: "Løst · Sikkerhedshuller lukket",
    severity: "high",
  },
  {
    icon: MailXIcon,
    title: "SMTP fejlet",
    meta: "Mail ikke modtaget",
    cleanMeta: "Løst · SMTP konfigureret og testet",
    severity: "high",
  },
  {
    icon: DatabaseIcon,
    title: "Sidste backup: 47 dage siden",
    meta: "Ikke testet",
    cleanMeta: "Løst · Daglig backup aktiveret",
    severity: "high",
  },
  {
    icon: ClockIcon,
    title: "PHP udløber om 12 dage",
    meta: "Skift til 8.3 anbefales",
    cleanMeta: "Løst · Opgraderet til PHP 8.3",
    severity: "medium",
  },
  {
    icon: ZapOffIcon,
    title: "Sidens hastighed er forværret",
    meta: "LCP: 4.2s",
    cleanMeta: "Løst · LCP nede på 1.1s",
    severity: "medium",
  },
  {
    icon: TerminalIcon,
    title: "12 mislykkede login-forsøg",
    meta: "Sidste time",
    cleanMeta: "Løst · 2FA aktiveret",
    severity: "medium",
  },
  {
    icon: AlertTriangleIcon,
    title: "Database 87% fyldt",
    meta: "4.2 GB / 5 GB",
    cleanMeta: "Løst · Database optimeret til 1.8 GB",
    severity: "low",
  },
];

const SEVERITY_DOT: Record<Severity, string> = {
  high: "#e74c3c",
  medium: "#c9a227",
  low: "#9aa0a6",
};

const SCORES_CHAOS = [
  { label: "Performance", value: 38 },
  { label: "Tilgængelighed", value: 52 },
  { label: "Best Practices", value: 33 },
  { label: "SEO", value: 41 },
];

const SCORES_CLEAN = [
  { label: "Performance", value: 98 },
  { label: "Tilgængelighed", value: 100 },
  { label: "Best Practices", value: 96 },
  { label: "SEO", value: 100 },
];

export function WordPressChaos() {
  const [cleaned, setCleaned] = useState(false);
  const scores = cleaned ? SCORES_CLEAN : SCORES_CHAOS;

  return (
    <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0f0f0f] text-[#f5f5f0] shadow-xl">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          Dashboard · Advarsler
        </span>
        <motion.span
          key={cleaned ? "clean" : "chaos"}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-medium text-white ${
            cleaned ? "bg-[#00b67a]" : "bg-[#e74c3c]"
          }`}
        >
          {cleaned ? "Alt sundt" : "19 nye"}
        </motion.span>
      </div>

      <div className="divide-y divide-white/[0.04]">
        {NOTICES.map((n, i) => {
          const Icon = n.icon;
          const dot = cleaned ? "#00b67a" : SEVERITY_DOT[n.severity];
          return (
            <motion.div
              key={n.title}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex items-center gap-3 px-4 py-2.5"
            >
              <span
                className="size-2 shrink-0 rounded-full transition-colors duration-500"
                style={{ backgroundColor: dot }}
              />
              <Icon className="size-3.5 shrink-0 text-white/50" />
              <div className="min-w-0 flex-1">
                <p
                  className={`truncate text-xs font-medium transition-all duration-500 ${
                    cleaned ? "text-white/40 line-through" : "text-white/90"
                  }`}
                >
                  {n.title}
                </p>
                <p
                  className={`truncate text-[10px] transition-colors duration-500 ${
                    cleaned ? "text-[#00b67a]" : "text-white/50"
                  }`}
                >
                  {cleaned ? n.cleanMeta : n.meta}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="border-t border-white/[0.06] px-4 py-3">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
            Sidens scores
          </span>
          <span className="font-mono text-[10px] text-white/40">
            {cleaned ? "Alt grønt" : "+ 11 flere skjult"}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {scores.map((s) => (
            <ScoreDonut key={s.label} label={s.label} value={s.value} />
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setCleaned((v) => !v)}
        className="flex w-full items-center justify-center gap-2 border-t border-white/[0.06] bg-white/[0.02] px-4 py-3 text-xs font-semibold text-white/90 transition-colors hover:bg-white/[0.06]"
        aria-label={cleaned ? "Ryddet op" : "Klik for at rydde op"}
      >
        <SparklesIcon
          className={`size-3.5 ${!cleaned && "animate-pulse"}`}
        />
        {cleaned ? "Ryddet op" : "Klik for at rydde op"}
      </button>
    </div>
  );
}

function ScoreDonut({ label, value }: { label: string; value: number }) {
  const color =
    value >= 90 ? "#00b67a" : value >= 50 ? "#c9a227" : "#e74c3c";
  const r = 14;
  const c = 2 * Math.PI * r;
  const dash = (value / 100) * c;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="38" height="38" viewBox="0 0 38 38" className="-rotate-90">
        <circle
          cx="19"
          cy="19"
          r={r}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="3"
          fill="none"
        />
        <motion.circle
          cx="19"
          cy="19"
          r={r}
          stroke={color}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          animate={{ strokeDashoffset: c - dash, stroke: color }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <text
          x="19"
          y="20"
          textAnchor="middle"
          dominantBaseline="middle"
          fill={color}
          fontSize="11"
          fontWeight="600"
          fontFamily="monospace"
          transform="rotate(90 19 19)"
        >
          {value}
        </text>
      </svg>
      <span className="text-[9px] leading-tight text-white/50 text-center">
        {label}
      </span>
    </div>
  );
}
