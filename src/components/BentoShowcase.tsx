"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { cn } from "@/lib/utils";
import { ScrambleEyebrow } from "@/components/ui/scramble-eyebrow";
import Container from "@/components/Container";
import {
  SearchIcon,
  BarChart3Icon,
  CheckCircle2Icon,
  UsersIcon,
  LayersIcon,
  MousePointerClickIcon,
  PenToolIcon,
  EyeIcon,
  CodeIcon,
  GaugeIcon,
  ZapIcon,
  DatabaseIcon,
  TrendingUpIcon,
  TargetIcon,
  FileTextIcon,
  ArrowUpRightIcon,
} from "lucide-react";

/* ─── Shared mini-tab system ─── */

interface MiniTab {
  id: string;
  label: string;
  icon: React.ElementType;
  content: React.ReactNode;
}

function MiniCard({
  eyebrow,
  title,
  tabs,
  accentColor,
  wide = false,
}: {
  eyebrow: string;
  title: string;
  tabs: MiniTab[];
  accentColor: string;
  wide?: boolean;
}) {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isHovering) return;
    const rotate = () => {
      setActiveTab((prev) => {
        const idx = tabs.findIndex((t) => t.id === prev.id);
        return tabs[(idx + 1) % tabs.length];
      });
    };
    const firstTimeout = setTimeout(() => {
      rotate();
      intervalRef.current = setInterval(rotate, 3000);
    }, 1000);
    return () => {
      clearTimeout(firstTimeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovering, tabs]);

  const handleTabClick = (tab: MiniTab) => {
    setActiveTab(tab);
  };

  if (wide) {
    return (
      <div
        className="group relative w-full overflow-hidden rounded-3xl border border-white/[0.10] bg-gradient-to-b from-[#1e1e1e] via-[#141414] to-[#111111] shadow-xl shadow-black/20 transition-all duration-500 hover:shadow-black/30 hover:-translate-y-0.5"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="flex flex-col md:flex-row">
          {/* Left — text + tabs */}
          <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-1 mb-6">
              <ScrambleEyebrow className="text-[10px] text-white/40 uppercase tracking-[0.2em]">
                {eyebrow}
              </ScrambleEyebrow>
              <p className="text-base sm:text-lg text-[#f5f5f0] font-medium leading-snug">
                {title}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {tabs.map((tab) => {
                const isActive = activeTab.id === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all cursor-pointer text-left",
                      isActive
                        ? "bg-white/[0.06] border border-white/[0.08] text-[#f5f5f0]"
                        : "text-white/40 hover:text-white/70"
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right — dashboard */}
          <div className="flex-1 relative h-[300px] md:h-auto overflow-hidden rounded-2xl md:rounded-l-none">
            <div className="absolute top-8 left-8 w-full h-full bg-[#1e1e1e] rounded-2xl border border-white/[0.04] opacity-60" />
            <div className="absolute top-4 left-12 w-full h-full bg-[#1a1a1a] rounded-tl-2xl shadow-lg flex flex-col overflow-hidden ring-4 ring-white/[0.06]">
              <div className="px-4 py-3 border-b border-white/[0.06] flex items-center">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                </div>
              </div>
              <div className="flex-1 p-5 overflow-hidden relative">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={activeTab.id}
                    initial={{ opacity: 0, y: 6, filter: "blur(3px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -6, filter: "blur(3px)" }}
                    transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                    className="flex-1"
                  >
                    {activeTab.content}
                  </motion.div>
                </AnimatePresence>
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#1a1a1a] to-transparent pointer-events-none z-20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group relative w-full h-full overflow-hidden rounded-3xl border border-white/[0.10] bg-gradient-to-b from-[#1e1e1e] via-[#141414] to-[#111111] shadow-xl shadow-black/20 transition-all duration-500 hover:shadow-black/30 hover:-translate-y-0.5"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="p-5 sm:p-6 space-y-1 z-10 relative">
        <ScrambleEyebrow className="text-[10px] text-white/40 uppercase tracking-[0.2em]">
          {eyebrow}
        </ScrambleEyebrow>
        <p className="text-sm sm:text-base text-[#f5f5f0] font-medium leading-snug">
          {title}
        </p>
      </div>

      <div className="relative w-full h-[220px] sm:h-[250px] overflow-hidden rounded-2xl">
        <div className="absolute top-12 left-12 w-full h-full bg-[#1e1e1e] rounded-2xl border border-white/[0.04] opacity-60" />

        <div className="absolute top-6 left-16 w-full h-full bg-[#1a1a1a] rounded-tl-2xl shadow-lg flex flex-col overflow-hidden ring-4 ring-white/[0.06]">
          {/* Window chrome */}
          <div className="px-4 py-3 border-b border-white/[0.06] flex items-center relative">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <div className="w-28 border-r border-white/[0.06] p-1.5 flex flex-col gap-0.5 pt-4 bg-white/[0.02]">
              <LayoutGroup>
                {tabs.map((tab) => {
                  const isActive = activeTab.id === tab.id;
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab)}
                      className={cn(
                        "relative flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[10px] transition-colors cursor-pointer",
                        isActive
                          ? "text-[#f5f5f0]"
                          : "text-white/40 hover:text-white/70"
                      )}
                    >
                      <Icon className="size-3 shrink-0 relative z-20" />
                      <span className="truncate relative z-20 font-medium">
                        {tab.label}
                      </span>
                      {isActive && (
                        <motion.div
                          layoutId={`pill-${eyebrow}`}
                          className="absolute left-0 w-[2px] h-3 rounded-full z-30"
                          style={{ backgroundColor: accentColor }}
                          transition={{
                            type: "spring",
                            bounce: 0.2,
                            duration: 0.6,
                          }}
                        />
                      )}
                      {isActive && (
                        <motion.div
                          layoutId={`bg-${eyebrow}`}
                          className="absolute inset-0 rounded-md bg-white/[0.06] border border-white/[0.08]"
                          transition={{
                            type: "spring",
                            bounce: 0.2,
                            duration: 0.6,
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </LayoutGroup>
            </div>

            {/* Content */}
            <div className="flex-1 bg-[#1a1a1a] p-4 flex flex-col gap-3 overflow-hidden relative">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={activeTab.id}
                  initial={{ opacity: 0, y: 6, filter: "blur(3px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -6, filter: "blur(3px)" }}
                  transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                  className="flex-1"
                >
                  {activeTab.content}
                </motion.div>
              </AnimatePresence>
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#1a1a1a] to-transparent pointer-events-none z-20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Stat pill ─── */
function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="p-2.5 rounded-lg border border-white/[0.08] bg-white/[0.04] flex items-center justify-between">
      <div className="flex flex-col">
        <span className="text-[10px] font-semibold text-emerald-400">
          {value}
        </span>
        <span className="text-[8px] text-white/50 uppercase font-medium">
          {label}
        </span>
      </div>
      {color && (
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: color }}
        />
      )}
    </div>
  );
}

/* ─── Progress row ─── */
function ProgressRow({
  label,
  value,
  pct,
  color,
}: {
  label: string;
  value: string;
  pct: number;
  color: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <span className="text-[9px] text-white/50">{label}</span>
        <span className="text-[9px] font-medium text-[#f5f5f0]">{value}</span>
      </div>
      <div className="h-1 w-full bg-white/[0.06] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}

/* ─── Check item ─── */
function CheckItem({ text, done = true }: { text: string; done?: boolean }) {
  return (
    <div className="flex items-center gap-2 py-1.5">
      <CheckCircle2Icon
        className={cn(
          "size-3 shrink-0",
          done ? "text-emerald-500" : "text-white/50/30"
        )}
      />
      <span
        className={cn(
          "text-[9px]",
          done ? "text-[#f5f5f0]" : "text-white/50 line-through"
        )}
      >
        {text}
      </span>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   CARD 1 — Analyse & Strategi
   ════════════════════════════════════════════════════ */

const analyseAuditContent = (
  <div className="flex flex-col gap-2">
    <div className="p-2.5 rounded-lg border border-white/[0.08] bg-white/[0.04]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[9px] font-medium text-white/50">Site Score</span>
        <ArrowUpRightIcon className="size-2.5 text-emerald-500" />
      </div>
      <span className="text-lg font-semibold text-emerald-400">87/100</span>
      <div className="h-1 w-full bg-white/[0.06] rounded-full mt-1.5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "87%" }}
          className="h-full bg-emerald-500 rounded-full"
        />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-1.5">
      <Stat label="Hastighed" value="2.1s" color="#f59e0b" />
      <Stat label="SEO" value="72%" color="#6b8aed" />
    </div>
  </div>
);

const analyseSmertepunkterContent = (
  <div className="flex flex-col gap-1">
    <span className="text-[9px] font-medium text-white/50 uppercase mb-1">
      Identificerede problemer
    </span>
    <CheckItem text="Langsom loadtid (4.2s → mål: &lt;2s)" />
    <CheckItem text="Ikke mobilvenlig navigation" />
    <CheckItem text="Manglende CTA på forsiden" />
    <CheckItem text="Ingen konverteringssporing" />
    <CheckItem text="Forældet CMS system" done={false} />
  </div>
);

const analyseKonkurrentContent = (
  <div className="flex flex-col gap-2">
    <span className="text-[9px] font-medium text-white/50 uppercase mb-1">
      Benchmark vs. branche
    </span>
    <ProgressRow label="Performance" value="87%" pct={87} color="#00b67a" />
    <ProgressRow label="Branche gns." value="62%" pct={62} color="#888" />
    <ProgressRow label="SEO synlighed" value="Top 5" pct={92} color="#6b8aed" />
  </div>
);

/* ════════════════════════════════════════════════════
   CARD 2 — Design & UX
   ════════════════════════════════════════════════════ */

const designWireframeContent = (
  <div className="flex flex-col gap-2">
    <div className="rounded-lg border border-sky-300/25 p-3 bg-sky-200/[0.08] space-y-2">
      <div className="h-2 w-16 bg-sky-300/25 rounded" />
      <div className="h-6 w-full bg-sky-200/[0.10] rounded border border-dashed border-sky-300/20" />
      <div className="grid grid-cols-3 gap-1.5">
        <div className="h-8 bg-sky-200/[0.10] rounded border border-dashed border-sky-300/20" />
        <div className="h-8 bg-sky-200/[0.10] rounded border border-dashed border-sky-300/20" />
        <div className="h-8 bg-sky-200/[0.10] rounded border border-dashed border-sky-300/20" />
      </div>
      <div className="h-3 w-20 bg-sky-300/25 rounded-full mx-auto" />
    </div>
    <span className="text-[8px] text-white/50 text-center">
      Wireframe — forside v2
    </span>
  </div>
);

const designKonverteringContent = (
  <div className="flex flex-col gap-2">
    <span className="text-[9px] font-medium text-white/50 uppercase mb-1">
      Konverteringstragt
    </span>
    <ProgressRow label="Besøg → Interesse" value="68%" pct={68} color="#e8915a" />
    <ProgressRow label="Interesse → Kontakt" value="24%" pct={24} color="#e8915a" />
    <ProgressRow label="Kontakt → Kunde" value="52%" pct={52} color="#00b67a" />
    <div className="mt-1 p-2 rounded-md bg-white/[0.06] border border-white/[0.08]">
      <span className="text-[8px] text-white/50">
        Mål: +40% konvertering via ny CTA-struktur
      </span>
    </div>
  </div>
);

const designBrugertestContent = (
  <div className="flex flex-col gap-1">
    <span className="text-[9px] font-medium text-white/50 uppercase mb-1">
      Usability resultater
    </span>
    <CheckItem text="Navigation: 4.8/5 tilfredshed" />
    <CheckItem text="CTA synlighed: +120% forbedret" />
    <CheckItem text="Mobil flow: 3 klik til kontakt" />
    <CheckItem text="Tilgængelighed: WCAG AA godkendt" />
  </div>
);

/* ════════════════════════════════════════════════════
   CARD 3 — Udvikling & CMS
   ════════════════════════════════════════════════════ */

const devTechContent = (
  <div className="flex flex-col gap-2">
    <span className="text-[9px] font-medium text-white/50 uppercase mb-1">
      Tech stack
    </span>
    <div className="flex flex-wrap gap-1">
      {["Next.js", "React", "TypeScript", "Tailwind", "Vercel", "Supabase"].map(
        (tech) => (
          <span
            key={tech}
            className="px-2 py-0.5 text-[8px] font-medium rounded-md border border-white/[0.08] bg-white/[0.06]"
          >
            {tech}
          </span>
        )
      )}
    </div>
    <div className="grid grid-cols-2 gap-1.5 mt-1">
      <Stat label="Lighthouse" value="98/100" color="#00b67a" />
      <Stat label="Load time" value="0.8s" color="#6b8aed" />
    </div>
  </div>
);

const devCmsContent = (
  <div className="flex flex-col gap-2">
    <div className="p-2.5 rounded-lg border border-white/[0.08] bg-white/[0.04]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[9px] font-medium text-white/50">
          Tid sparet / uge
        </span>
        <ZapIcon className="size-2.5 text-amber-500" />
      </div>
      <span className="text-lg font-semibold text-emerald-400">6 timer</span>
      <span className="text-[8px] text-white/50 block mt-0.5">
        vs. manuelt WordPress workflow
      </span>
    </div>
    <CheckItem text="Drag-and-drop indholdsstyring" />
    <CheckItem text="Automatisk billede-optimering" />
    <CheckItem text="SEO-felter på alle sider" />
  </div>
);

const devPerformanceContent = (
  <div className="flex flex-col gap-2">
    <span className="text-[9px] font-medium text-white/50 uppercase mb-1">
      Performance metrics
    </span>
    <ProgressRow label="First Paint" value="0.4s" pct={95} color="#00b67a" />
    <ProgressRow label="Interaktiv" value="0.8s" pct={90} color="#00b67a" />
    <ProgressRow label="CLS" value="0.01" pct={98} color="#6b8aed" />
    <ProgressRow label="Accessibility" value="100" pct={100} color="#a855f7" />
  </div>
);

/* ════════════════════════════════════════════════════
   CARD 4 — Vækst & Fremtidssikring
   ════════════════════════════════════════════════════ */

const vaekstAnalyticsContent = (
  <div className="flex flex-col gap-2">
    <div className="p-2.5 rounded-lg border border-white/[0.08] bg-white/[0.04]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[9px] font-medium text-white/50">
          Organisk vækst
        </span>
        <TrendingUpIcon className="size-2.5 text-emerald-500" />
      </div>
      <span className="text-lg font-semibold text-emerald-400">+214%</span>
      <span className="text-[8px] text-white/50 block mt-0.5">
        Trafik efter 6 måneder
      </span>
    </div>
    <div className="grid grid-cols-2 gap-1.5">
      <Stat label="Keywords" value="1,070" color="#6b8aed" />
      <Stat label="Henvendelser" value="+180%" color="#00b67a" />
    </div>
  </div>
);

const vaekstSeoContent = (
  <div className="flex flex-col gap-2">
    <span className="text-[9px] font-medium text-white/50 uppercase mb-1">
      SEO ranking
    </span>
    <ProgressRow label="Primære søgeord" value="Top 3" pct={94} color="#00b67a" />
    <ProgressRow label="Lokal synlighed" value="Top 5" pct={88} color="#e8915a" />
    <ProgressRow label="Domæne autoritet" value="42/100" pct={42} color="#6b8aed" />
    <div className="mt-1 p-2 rounded-md bg-white/[0.06] border border-white/[0.08]">
      <span className="text-[8px] text-white/50">
        Optimeret til 12+ primære søgeord
      </span>
    </div>
  </div>
);

const vaekstRapportContent = (
  <div className="flex flex-col gap-1">
    <span className="text-[9px] font-medium text-white/50 uppercase mb-1">
      Månedlige rapporter
    </span>
    <CheckItem text="Performance & hastigheds-rapport" />
    <CheckItem text="SEO & synligheds-tracking" />
    <CheckItem text="Konverterings-analyse" />
    <CheckItem text="Anbefalinger til næste måned" />
  </div>
);

/* ════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════ */

const cards = [
  {
    eyebrow: "Analyse & Strategi",
    title: "Inden vi rører en pixel laver vi en grundig analyse af jeres digitale tilstedeværelse og marked.",
    accentColor: "#00b67a",
    tabs: [
      { id: "audit", label: "Audit", icon: SearchIcon, content: analyseAuditContent },
      { id: "pain", label: "Problemer", icon: TargetIcon, content: analyseSmertepunkterContent },
      { id: "bench", label: "Benchmark", icon: BarChart3Icon, content: analyseKonkurrentContent },
    ],
  },
  {
    eyebrow: "Design & UX",
    title: "Vi designer ud fra brugeradfærd og struktureret data — ikke subjektive holdninger og intuition.",
    accentColor: "#e8915a",
    tabs: [
      { id: "wire", label: "Wireframes", icon: PenToolIcon, content: designWireframeContent },
      { id: "conv", label: "Konvertering", icon: MousePointerClickIcon, content: designKonverteringContent },
      { id: "test", label: "Brugertests", icon: EyeIcon, content: designBrugertestContent },
    ],
  },
  {
    eyebrow: "Udvikling & CMS",
    title: "UI/UX forankret i data og brugeradfærd — fordi gode interfaces gør hverdagen lettere for alle.",
    accentColor: "#6b8aed",
    tabs: [
      { id: "tech", label: "Tech stack", icon: CodeIcon, content: devTechContent },
      { id: "cms", label: "CMS", icon: DatabaseIcon, content: devCmsContent },
      { id: "perf", label: "Performance", icon: GaugeIcon, content: devPerformanceContent },
    ],
  },
  {
    eyebrow: "Vækst & Fremtidssikring",
    title: "Lancering er kun begyndelsen. Vi er med dig hele vejen — fra onboarding og dataindsigt til løbende optimering.",
    accentColor: "#00b67a",
    tabs: [
      { id: "analytics", label: "Analytics", icon: TrendingUpIcon, content: vaekstAnalyticsContent },
      { id: "seo", label: "SEO", icon: TargetIcon, content: vaekstSeoContent },
      { id: "rapport", label: "Rapporter", icon: FileTextIcon, content: vaekstRapportContent },
    ],
  },
];

export default function BentoShowcase() {
  return (
    <Container as="section" size="site" className="py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="mb-16"
      >
        <ScrambleEyebrow>Vores tilgang</ScrambleEyebrow>
        <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
          Struktur er fundamentet
        </h2>
        <p className="mt-4 max-w-2xl text-base text-muted leading-relaxed">
          I en digital branche hvor tingene går hurtigt, er det altafgørende
          at fundamentet er baseret på struktur og forståelse. Data er guld
          — og den rigtige struktur er grundstenen til vækst på sigt.
        </p>
      </motion.div>

      {/* Top row — 3 cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {cards.slice(0, 3).map((card, i) => (
          <motion.div
            key={card.eyebrow}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="h-full"
          >
            <MiniCard
              eyebrow={card.eyebrow}
              title={card.title}
              tabs={card.tabs}
              accentColor={card.accentColor}
            />
          </motion.div>
        ))}
      </div>

      {/* Bottom row — 1 wide card */}
      <motion.div
        className="mt-4"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <MiniCard
          eyebrow={cards[3].eyebrow}
          title={cards[3].title}
          tabs={cards[3].tabs}
          accentColor={cards[3].accentColor}
          wide
        />
      </motion.div>
    </Container>
  );
}
