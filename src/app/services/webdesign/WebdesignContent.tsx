"use client";

import { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValue,
  useInView,
  animate,
} from "framer-motion";
import {
  ArrowRightIcon,
  SearchIcon,
  PenToolIcon,
  CodeIcon,
  RocketIcon,
  LayoutIcon,
  SmartphoneIcon,
  ZapIcon,
  ShieldCheckIcon,
  MousePointerClickIcon,
  PaletteIcon,
  LayersIcon,
  ChevronDownIcon,
  CheckIcon,
  GaugeIcon,
  EyeIcon,
  SearchCheckIcon,
  ShieldIcon,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { InfiniteGrid } from "@/components/ui/the-infinite-grid";
import { ScrambleEyebrow } from "@/components/ui/scramble-eyebrow";
import { TextScramble } from "@/components/ui/text-scramble";
import { fadeInUp, fadeUp } from "@/lib/animations";
import Container from "@/components/Container";

/* ─── Data ─── */

const processSteps = [
  {
    step: "01",
    title: "Analyse & strategi",
    description:
      "Vi starter aldrig med design. Vi starter med at forstå — din forretning, dine kunder, dine konkurrenter. Det er her fundamentet lægges.",
    icon: SearchIcon,
    accent: "#00b67a",
    link: { href: "/marketing/seo", label: "SEO & synlighed" },
  },
  {
    step: "02",
    title: "Design & prototype",
    description:
      "Wireframes, mockups, interaktive prototyper. Du ser og godkender alt i Figma før en eneste linje kode bliver skrevet.",
    icon: PenToolIcon,
    accent: "#e8915a",
    link: { href: "/services/ui-ux-design", label: "UI/UX Design" },
  },
  {
    step: "03",
    title: "Udvikling",
    description:
      "Next.js, React, Tailwind — moderne teknologi der performer. Under 2 sekunders loadtid. Responsivt fra dag ét. Kode du ejer 100%.",
    icon: CodeIcon,
    accent: "#6b8aed",
  },
  {
    step: "04",
    title: "Launch & vækst",
    description:
      "Vi launcher ikke bare — vi overvåger, optimerer og sikrer at din side konverterer. SEO, hastighed, brugeradfærd. Vi slipper ikke før det virker.",
    icon: RocketIcon,
    accent: "#00b67a",
    link: { href: "/marketing/google-ads", label: "Google Ads" },
  },
];

const deliverables = [
  { icon: SmartphoneIcon, text: "Responsivt design — mobil, tablet, desktop", bg: "bg-[#e4e8f0]", fg: "text-[#2a3550]" },
  { icon: ZapIcon, text: "Under 2s loadtid — optimeret til Core Web Vitals", bg: "bg-[#fce8db]", fg: "text-[#6b3a1f]" },
  { icon: ShieldCheckIcon, text: "SEO-fundament — metadata, sitemap, struktureret data", bg: "bg-[#e0eeec]", fg: "text-[#1f4a42]" },
  { icon: MousePointerClickIcon, text: "Konverteringsoptimeret — CTA, flow, brugerrejse", bg: "bg-[#f0ece4]", fg: "text-[#5a4a2d]" },
  { icon: PaletteIcon, text: "Unikt design — ingen templates, kun din forretning", bg: "bg-[#e8f0e4]", fg: "text-[#2d4a28]" },
  { icon: LayersIcon, text: "CMS-integration — redigér selv indhold", bg: "bg-[#ebe4f0]", fg: "text-[#3d2a50]" },
  { icon: LayoutIcon, text: "Tilgængelighed — WCAG 2.1 AA compliant", bg: "bg-[#e4e8f0]", fg: "text-[#2a3550]" },
  { icon: CodeIcon, text: "Ren kodebase — nem at vedligeholde og udvide", bg: "bg-[#2a2a2a]", fg: "text-[#f5f5f0]" },
];

const faqs = [
  {
    q: "Hvor lang tid tager det at bygge en hjemmeside?",
    a: "De fleste projekter tager 4-8 uger fra første møde til launch. Det afhænger af omfanget — en simpel brandingside er hurtigere end en platform med booking, betalingsflow og integrationer. Vi giver dig en realistisk tidsplan efter første samtale.",
  },
  {
    q: "Hvilken teknologi bygger I med?",
    a: "Vi arbejder primært med Next.js, React og Tailwind CSS — moderne teknologi der giver hurtige, skalerbare og søgemaskinevenlige hjemmesider. Til CMS bruger vi enten WordPress (headless), Sanity eller custom løsninger afhængigt af dit behov.",
  },
  {
    q: "Ejer jeg koden bagefter?",
    a: "Ja. 100%. Alt kode, alle assets, alle designs — det hele er dit. Vi hoster typisk via Vercel, men du kan flytte det hvornår du vil. Vi binder dig ikke til noget.",
  },
  {
    q: "Hvad med vedligeholdelse efter launch?",
    a: "Vi tilbyder løbende support og optimering. Men vores mål er at bygge noget der ikke kræver konstant vedligeholdelse. Ren kode, moderne teknologi og et CMS der lader dig opdatere indhold selv.",
  },
  {
    q: "Kan I hjælpe med SEO og markedsføring?",
    a: "Ja — og vi tænker det ind fra starten, ikke som en eftertanke. Semantisk HTML, struktureret data, hastighedsoptimering og konverteringsdesign er en del af hver hjemmeside vi bygger. Vi tilbyder også dedikeret SEO og Google Ads som separate services.",
  },
  {
    q: "Hvad adskiller jer fra andre bureauer?",
    a: "Vi kombinerer design, udvikling og strategi under ét tag. Du får ikke bare en flot side — du får en løsning der er bygget til at performe. Vi bruger AI til at accelerere processen, men det er erfaring og håndværk der sikrer kvaliteten. Og du ejer alt.",
  },
];

const lighthouseMetrics = [
  { label: "Performance", value: 98, icon: GaugeIcon, color: "#00b67a" },
  { label: "Accessibility", value: 100, icon: EyeIcon, color: "#6b8aed" },
  { label: "Best Practices", value: 95, icon: ShieldIcon, color: "#e8915a" },
  { label: "SEO", value: 100, icon: SearchCheckIcon, color: "#00b67a" },
];

const techTerms = [
  "Server-Side Rendering",
  "Core Web Vitals",
  "Code Splitting",
  "Structured Data",
  "Edge Caching",
  "WCAG 2.1 AA",
  "Lighthouse 95+",
  "Semantic HTML",
  "Tree Shaking",
  "Lazy Loading",
  "Schema Markup",
  "Progressive Enhancement",
  "Responsive Breakpoints",
  "Image Optimization",
  "TypeScript",
  "CI/CD Pipeline",
];

const techChecklist = [
  "Fremtidssikret arkitektur med Next.js & React",
  "Server-side rendering for hurtigere loadtid",
  "Automatisk billedoptimering & lazy loading",
  "Semantisk HTML for bedre søgemaskinesynlighed",
  "Struktureret data (Schema.org) til rich snippets",
  "Code splitting — kun det nødvendige kode loades",
  "WCAG 2.1 AA tilgængelighed som standard",
  "Edge caching via Vercel for global hastighed",
  "Responsivt design testet på 12+ enheder",
  "TypeScript for færre fejl og bedre vedligeholdelse",
];

const relatedCases = [
  {
    title: "Seitz",
    href: "/cases/malerfirma-seitz",
    image: "/cases/Case-image.webp",
    category: "Branding · Webdesign",
    result: "3x flere henvendelser",
  },
  {
    title: "OD Pro",
    href: "/cases/od-biler-pro",
    image: "/cases/OD-Cases-image-car.webp",
    category: "Webdesign · Udvikling",
    result: "Ny digital platform",
  },
  {
    title: "Tandsundhed Uden Grænser",
    href: "/cases/tandsundhed-uden-graenser",
    image: "/cases/Tand-sundhed-hero-image.webp",
    category: "Webdesign · NGO",
    result: "Lanceret på 3 uger",
  },
];

/* ─── Animated Lighthouse Score ─── */

function AnimatedScore({
  metric,
  index,
}: {
  metric: (typeof lighthouseMetrics)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const count = useMotionValue(0);
  const [displayed, setDisplayed] = useState(0);
  const Icon = metric.icon;

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(count, metric.value, {
      duration: 1.8,
      delay: index * 0.15,
      ease: [0.25, 0.46, 0.45, 0.94],
      onUpdate: (v) => setDisplayed(Math.round(v)),
    });
    return () => controls.stop();
  }, [isInView, count, metric.value, index]);

  const circumference = 2 * Math.PI * 42;
  const progress = isInView ? (displayed / 100) * circumference : 0;

  return (
    <motion.div
      ref={ref}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeInUp}
      className="flex flex-col items-center gap-3"
    >
      <div className="relative h-28 w-28">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 96 96">
          <circle
            cx="48"
            cy="48"
            r="42"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-foreground/[0.06]"
          />
          <circle
            cx="48"
            cy="48"
            r="42"
            fill="none"
            stroke={metric.color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            style={{ transition: "stroke-dashoffset 0.1s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold tabular-nums">{displayed}</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <Icon className="size-3.5 text-muted" />
        <span className="text-xs font-medium text-muted">{metric.label}</span>
      </div>
    </motion.div>
  );
}

/* ─── Typing Code Line ─── */

const typingLines = [
  { key: "wcag", value: '"AA"' },
  { key: "compression", value: '"brotli"' },
  { key: "imageFormat", value: '"avif"' },
  { key: "prefetch", value: "true" },
  { key: "minify", value: "true" },
  { key: "treeshake", value: "true" },
  { key: "lazyLoad", value: "true" },
  { key: "cacheStrategy", value: '"stale-while-revalidate"' },
];

function TypingCodeLine() {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const current = typingLines[lineIndex];
  const fullText = `${current.key}: ${current.value},`;

  useEffect(() => {
    if (!isDeleting && charIndex < fullText.length) {
      const timeout = setTimeout(() => setCharIndex((c) => c + 1), 60 + Math.random() * 40);
      return () => clearTimeout(timeout);
    }
    if (!isDeleting && charIndex === fullText.length) {
      const timeout = setTimeout(() => setIsDeleting(true), 2000);
      return () => clearTimeout(timeout);
    }
    if (isDeleting && charIndex > 0) {
      const timeout = setTimeout(() => setCharIndex((c) => c - 1), 30);
      return () => clearTimeout(timeout);
    }
    if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setLineIndex((i) => (i + 1) % typingLines.length);
    }
  }, [charIndex, isDeleting, fullText.length]);

  const displayed = fullText.slice(0, charIndex);
  const colonIdx = displayed.indexOf(":");
  const keyPart = colonIdx >= 0 ? displayed.slice(0, colonIdx) : displayed;
  const rest = colonIdx >= 0 ? displayed.slice(colonIdx) : "";

  return (
    <>
      <span className="text-white/70">{"  "}</span>
      <span className="text-[#e06c75]">{keyPart}</span>
      <span className="text-white/70">{rest.slice(0, 2)}</span>
      <span className="text-[#d19a66]">{rest.slice(2, rest.endsWith(",") ? -1 : undefined)}</span>
      {rest.endsWith(",") && <span className="text-white/40">,</span>}
      <span className="inline-block w-[2px] h-[14px] bg-white/60 ml-[1px] align-middle animate-pulse" />
    </>
  );
}

/* ─── Tech Ticker ─── */

function TechTicker() {
  const doubled = [...techTerms, ...techTerms];

  return (
    <div className="relative overflow-hidden py-6">
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />
      <motion.div
        className="flex gap-6 whitespace-nowrap"
        animate={{ x: [0, -50 * techTerms.length] }}
        transition={{
          x: { repeat: Infinity, repeatType: "loop", duration: 40, ease: "linear" },
        }}
      >
        {doubled.map((term, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 rounded-full border border-foreground/[0.08] px-4 py-1.5 text-xs font-mono tracking-wide text-muted shrink-0"
          >
            <span className="h-1 w-1 rounded-full bg-foreground/20" />
            {term}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── FAQ Item ─── */

function FaqItem({ item, index }: { item: (typeof faqs)[0]; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeInUp}
      className="border-b border-foreground/[0.06]"
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-6 text-left transition-colors duration-300 hover:text-foreground/80"
      >
        <span className="text-base font-semibold pr-8 md:text-lg">
          {item.q}
        </span>
        <ChevronDownIcon
          className={`size-5 shrink-0 text-muted transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.215, 0.61, 0.355, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-base leading-relaxed text-muted max-w-2xl">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Process Card ─── */

function ProcessCard({
  item,
  index,
}: {
  item: (typeof processSteps)[0];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const Icon = item.icon;

  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeInUp}
      className="group relative rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 transition-all duration-500 hover:border-white/[0.15] hover:bg-white/[0.06]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center justify-between mb-6">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${item.accent}20` }}
        >
          <Icon className="size-5" style={{ color: item.accent }} />
        </div>
        <span className="text-5xl font-black text-white/[0.06]">
          {item.step}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-white">
        <TextScramble
          as="span"
          speed={0.04}
          duration={0.8}
          trigger={hovered}
          onScrambleComplete={() => setHovered(false)}
        >
          {item.title}
        </TextScramble>
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-white/50">
        {item.description}
      </p>
      {item.link && (
        <Link
          href={item.link.href}
          className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium tracking-wide opacity-0 transition-all duration-500 group-hover:opacity-100"
          style={{ color: item.accent }}
        >
          {item.link.label}
          <ArrowRightIcon className="size-3 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      )}
      <div
        className="absolute bottom-0 left-8 right-8 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `linear-gradient(90deg, transparent, ${item.accent}, transparent)`,
        }}
      />
    </motion.div>
  );
}

/* ─── Page ─── */

export default function WebdesignContent() {
  const imageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1.05, 1.15]);

  return (
    <main>
      <Navbar alwaysVisible />

      {/* ═══ Hero — standalone, NO wrapper ═══ */}
      <section className="relative pt-32 pb-0">
        {/* Grid background — fixed to full viewport */}
        <div
          className="fixed inset-0 -z-10 pointer-events-none opacity-40"
          aria-hidden="true"
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url(/graphics/bg-control.svg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              maskImage:
                "linear-gradient(to bottom, transparent 0%, black 15%, black 60%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, black 15%, black 60%, transparent 100%)",
            }}
          />
        </div>

        {/* Hero text content — constrained */}
        <Container size="site">
          <div className="max-w-3xl">
            <motion.div
              custom={0.2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-foreground/[0.08] bg-accent/50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-muted">
                <LayoutIcon className="size-3" />
                Webdesign
              </span>
            </motion.div>

            <motion.h1
              custom={0.5}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-6 text-3xl font-bold leading-[1.2] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl"
            >
              Hjemmesider er blevet en commodity.{" "}
              <span className="text-muted">Vi kombinerer erfaring med AI — ikke omvendt.</span>
            </motion.h1>

            <motion.p
              custom={1.0}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-4 max-w-lg text-base leading-relaxed text-muted"
            >
              Uden forståelse for det tekniske fundament vil enhver
              hjemmeside fejle. Vi bygger på et fundament af 8+ års
              teknisk erfaring. Forstærket af AI til din fordel.
            </motion.p>

            <motion.div
              custom={1.4}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-6"
            >
              <a
                href="/kontakt"
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-80"
                style={{ color: "#f5f5f0" }}
              >
                Start et projekt
                <ArrowRightIcon className="size-3.5" />
              </a>
            </motion.div>
          </div>
        </Container>

        {/* Hero image — full width, edge to edge, OUTSIDE the max-width */}
        <motion.div
          ref={imageRef}
          custom={1.8}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="relative mt-12 w-full overflow-hidden"
        >
          <motion.img
            src="/graphics/Web-hero-image-marketing-google-ads.avif"
            alt="Webdesign af Horizen"
            style={{ y: imageY, scale: imageScale }}
            className="w-full h-auto object-cover aspect-[21/8]"
          />
        </motion.div>
      </section>

      {/* ═══ Everything after hero — wrapped with bg-background + max-width ═══ */}
      <div className="relative z-10 bg-background">

      {/* ═══ Tech ticker ═══ */}
      <TechTicker />

      {/* ═══ Lighthouse metrics + Code window ═══ */}
      <Container as="section" size="site" className="py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          custom={0}
          variants={fadeInUp}
          className="text-center mb-14"
        >
          <ScrambleEyebrow>
            Teknisk fundament
          </ScrambleEyebrow>
          <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
            Det du ikke ser — men vi ser
          </h2>
          <p className="mt-3 text-base text-muted max-w-lg mx-auto">
            Vi går ned i det tekniske fundament — og det er dér, forskellen
            mellem en god og en dårlig hjemmeside afsløres. 98% af alle
            hjemmesideejere ser det aldrig. Det er også derfor så mange
            hjemmesider ikke performer som de burde.
          </p>
        </motion.div>

        <div className="grid gap-10 md:grid-cols-2 items-center max-w-5xl mx-auto">
          {/* Code window */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            custom={0}
            variants={fadeInUp}
            className="rounded-xl border border-foreground/[0.08] bg-[#0f0f0f] overflow-hidden shadow-2xl"
          >
            {/* Title bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
              <div className="flex gap-1.5">
                <span className="size-3 rounded-full bg-[#ff5f57]" />
                <span className="size-3 rounded-full bg-[#febc2e]" />
                <span className="size-3 rounded-full bg-[#28c840]" />
              </div>
              <span className="ml-2 text-[11px] font-mono text-white/30">
                web-vitals.config.ts
              </span>
            </div>
            {/* Code content */}
            <div className="p-5 font-mono text-[13px] leading-relaxed overflow-x-auto">
              <div className="text-white/20 select-none inline-block w-8 text-right mr-4">1</div>
              <span className="text-[#5c6370]">{"// Core Web Vitals thresholds"}</span>
              <br />
              <div className="text-white/20 select-none inline-block w-8 text-right mr-4">2</div>
              <span className="text-[#c678dd]">export const</span>
              <span className="text-[#61afef]"> vitals</span>
              <span className="text-white/70">{" = {"}</span>
              <br />
              <div className="text-white/20 select-none inline-block w-8 text-right mr-4">3</div>
              <span className="text-white/70">{"  "}</span>
              <span className="text-[#e06c75]">LCP</span>
              <span className="text-white/70">: </span>
              <span className="text-[#d19a66]">1.2</span>
              <span className="text-white/40">,</span>
              <span className="text-[#5c6370]">{"    // Largest Contentful Paint (s)"}</span>
              <br />
              <div className="text-white/20 select-none inline-block w-8 text-right mr-4">4</div>
              <span className="text-white/70">{"  "}</span>
              <span className="text-[#e06c75]">FID</span>
              <span className="text-white/70">: </span>
              <span className="text-[#d19a66]">18</span>
              <span className="text-white/40">,</span>
              <span className="text-[#5c6370]">{"     // First Input Delay (ms)"}</span>
              <br />
              <div className="text-white/20 select-none inline-block w-8 text-right mr-4">5</div>
              <span className="text-white/70">{"  "}</span>
              <span className="text-[#e06c75]">CLS</span>
              <span className="text-white/70">: </span>
              <span className="text-[#d19a66]">0.02</span>
              <span className="text-white/40">,</span>
              <span className="text-[#5c6370]">{"   // Cumulative Layout Shift"}</span>
              <br />
              <div className="text-white/20 select-none inline-block w-8 text-right mr-4">6</div>
              <span className="text-white/70">{"  "}</span>
              <span className="text-[#e06c75]">TTFB</span>
              <span className="text-white/70">: </span>
              <span className="text-[#d19a66]">120</span>
              <span className="text-white/40">,</span>
              <span className="text-[#5c6370]">{"    // Time to First Byte (ms)"}</span>
              <br />
              <div className="text-white/20 select-none inline-block w-8 text-right mr-4">7</div>
              <span className="text-white/70">{`} as const`}</span>
              <br />
              <div className="text-white/20 select-none inline-block w-8 text-right mr-4">8</div>
              <br />
              <div className="text-white/20 select-none inline-block w-8 text-right mr-4">9</div>
              <span className="text-[#5c6370]">{"// Lighthouse audit scores"}</span>
              <br />
              <div className="text-white/20 select-none inline-block w-8 text-right mr-4">10</div>
              <span className="text-[#c678dd]">export const</span>
              <span className="text-[#61afef]"> audit</span>
              <span className="text-white/70">{" = {"}</span>
              <br />
              <div className="text-white/20 select-none inline-block w-8 text-right mr-4">11</div>
              <span className="text-white/70">{"  "}</span>
              <span className="text-[#e06c75]">performance</span>
              <span className="text-white/70">: </span>
              <span className="text-[#d19a66]">0.98</span>
              <span className="text-white/40">,</span>
              <br />
              <div className="text-white/20 select-none inline-block w-8 text-right mr-4">12</div>
              <span className="text-white/70">{"  "}</span>
              <span className="text-[#e06c75]">accessibility</span>
              <span className="text-white/70">: </span>
              <span className="text-[#d19a66]">1.0</span>
              <span className="text-white/40">,</span>
              <br />
              <div className="text-white/20 select-none inline-block w-8 text-right mr-4">13</div>
              <span className="text-white/70">{"  "}</span>
              <span className="text-[#e06c75]">seo</span>
              <span className="text-white/70">: </span>
              <span className="text-[#d19a66]">1.0</span>
              <span className="text-white/40">,</span>
              <br />
              <div className="text-white/20 select-none inline-block w-8 text-right mr-4">14</div>
              <span className="text-white/70">{"  "}</span>
              <span className="text-[#e06c75]">bestPractices</span>
              <span className="text-white/70">: </span>
              <span className="text-[#d19a66]">0.95</span>
              <span className="text-white/40">,</span>
              <br />
              <div className="text-white/20 select-none inline-block w-8 text-right mr-4">15</div>
              <TypingCodeLine />
              <br />
              <div className="text-white/20 select-none inline-block w-8 text-right mr-4">16</div>
              <span className="text-white/70">{"}"}</span>
            </div>
          </motion.div>

          {/* Lighthouse scores */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            custom={0.2}
            variants={fadeInUp}
          >
            <div className="grid grid-cols-2 gap-8 max-w-sm mx-auto">
              {lighthouseMetrics.map((metric, i) => (
                <AnimatedScore key={metric.label} metric={metric} index={i} />
              ))}
            </div>
          </motion.div>
        </div>
      </Container>

      {/* ═══ Sticky stack ═══ */}
      <div className="relative">

      {/* ═══ Free audit CTA ═══ */}
      <section
        className="sticky top-0 z-10 bg-background"
        style={{ boxShadow: "0 0 0 100vmax var(--background)", clipPath: "inset(0 -100vmax)" }}
      >
        <Container size="site" className="py-20 md:py-36 lg:py-44">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          custom={0}
          variants={fadeInUp}
          className="max-w-2xl mx-auto text-center"
        >
          <ScrambleEyebrow>
            Gratis audit
          </ScrambleEyebrow>
          <h2 className="mt-4 text-2xl font-bold tracking-tight md:text-3xl">
            Er din hjemmeside bygget til at holde?
          </h2>
          <p className="mt-4 text-base text-muted leading-relaxed max-w-lg mx-auto">
            Vi ser det oftere og oftere efter AI er kommet — løsninger der
            ser fine ud på overfladen, men som teknisk ikke holder. Bygget
            med alt for få timer, uden nogen reel teknisk forståelse for
            fundamentet. Vi gennemgår din nuværende hjemmeside helt gratis
            og giver dig en professionel vurdering.
          </p>
          <motion.a
            href="/kontakt"
            custom={0.3}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium transition-opacity hover:opacity-90"
            style={{ color: "#f5f5f0" }}
          >
            Book en gratis audit
            <ArrowRightIcon className="size-4" />
          </motion.a>
        </motion.div>
        </Container>
      </section>

      {/* ═══ Technical checklist ═══ */}
      <section
        className="sticky top-0 z-20 bg-[#0f0f0f] text-[#f5f5f0]"
        style={{ boxShadow: "0 0 0 100vmax #0f0f0f, 0 -8px 30px rgba(0,0,0,0.15)", clipPath: "inset(0 -100vmax)" }}
      >
        <Container size="site" className="py-20 md:py-28 lg:py-36">
        <div className="grid gap-12 md:grid-cols-[1fr_1.2fr] md:gap-16 items-start">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={0}
            variants={fadeInUp}
          >
            <ScrambleEyebrow className="text-white/40">
              Under overfladen
            </ScrambleEyebrow>
            <h2 className="mt-4 text-2xl font-bold tracking-tight md:text-3xl">
              Teknisk struktur
              <br />
              <span className="text-white/40">skaber synlighed</span>
            </h2>
            <p className="mt-4 text-sm text-white/50 leading-relaxed max-w-md">
              WCAG-compliance, ren arkitektur, en kodebase der stadig virker om
              to år. Når de rigtige tiltag er taget fra dag ét, performer din
              side bedre — det er den erfaring AI ikke har.
            </p>

            {/* Visibility growth chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 rounded-xl border border-white/[0.06] bg-white/[0.03] p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-white/30">
                  Synlighed over tid
                </span>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-[10px] text-white/40">
                    <span className="h-[2px] w-3 rounded-full bg-[#c9a227]" />
                    Svagt teknisk fundament
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] text-[#00b67a]">
                    <span className="h-[2px] w-3 rounded-full bg-[#00b67a]" />
                    Stærkt teknisk fundament
                  </span>
                </div>
              </div>
              <svg viewBox="0 0 500 160" className="w-full h-auto">
                {/* Grid lines */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <line
                    key={i}
                    x1="0"
                    y1={i * 40}
                    x2="500"
                    y2={i * 40}
                    stroke="rgba(255,255,255,0.04)"
                    strokeWidth="1"
                  />
                ))}

                {/* Month labels */}
                {["Jan", "Feb", "Mar", "Apr", "Maj", "Jun"].map((m, i) => (
                  <text
                    key={m}
                    x={i * 90 + 30}
                    y="155"
                    fill="rgba(255,255,255,0.25)"
                    fontSize="10"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {m}
                  </text>
                ))}

                <defs>
                  {/* Green gradient */}
                  <linearGradient id="visGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgb(0, 182, 122)" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="rgb(0, 182, 122)" stopOpacity="0" />
                  </linearGradient>
                  {/* Gray gradient */}
                  <linearGradient id="flatGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgb(201, 162, 39)" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="rgb(201, 162, 39)" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* "Without structure" — flat/declining area */}
                <motion.path
                  d="M30,130 C70,129 100,128 140,126 C180,124 210,123 250,124 C290,126 320,128 360,130 C400,132 430,134 480,136 L480,140 L30,140 Z"
                  fill="url(#flatGradient)"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.4 }}
                />

                {/* "Without structure" — flat/declining line */}
                <motion.path
                  d="M30,130 C70,129 100,128 140,126 C180,124 210,123 250,124 C290,126 320,128 360,130 C400,132 430,134 480,136"
                  fill="none"
                  stroke="rgba(201, 162, 39, 0.6)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
                />

                {/* "Without structure" endpoint */}
                <motion.circle
                  cx="480"
                  cy="136"
                  r="3"
                  fill="rgba(201, 162, 39, 0.6)"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 1.7 }}
                />

                {/* "With structure" — growth area */}
                <motion.path
                  d="M30,130 C70,128 100,125 140,118 C180,110 210,95 250,78 C290,60 320,45 360,32 C400,20 430,12 480,8 L480,140 L30,140 Z"
                  fill="url(#visGradient)"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.6 }}
                />

                {/* "With structure" — growth line */}
                <motion.path
                  d="M30,130 C70,128 100,125 140,118 C180,110 210,95 250,78 C290,60 320,45 360,32 C400,20 430,12 480,8"
                  fill="none"
                  stroke="rgb(0, 182, 122)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
                />

                {/* "With structure" endpoint */}
                <motion.circle
                  cx="480"
                  cy="8"
                  r="4"
                  fill="rgb(0, 182, 122)"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 1.8 }}
                />
              </svg>
            </motion.div>
          </motion.div>

          <div className="grid gap-0">
            {techChecklist.map((item, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-20px" }}
                variants={fadeInUp}
                className="flex items-center gap-3 py-3 border-b border-white/[0.06] last:border-0"
              >
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#00b67a]/20">
                  <CheckIcon className="size-3 text-[#00b67a]" />
                </div>
                <span className="text-sm text-white/70">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
        </Container>
      </section>

      {/* ═══ Positioning statement ═══ */}
      <section
        className="sticky top-0 z-30 bg-background"
        style={{ boxShadow: "0 0 0 100vmax var(--background), 0 -8px 30px rgba(0,0,0,0.1)", clipPath: "inset(0 -100vmax)" }}
      >
        <Container size="site" className="py-24 md:py-36 lg:py-44">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={0}
            variants={fadeInUp}
          >
            <ScrambleEyebrow>Vores tilgang</ScrambleEyebrow>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              Standarden er hævet.
              <br />
              <span className="text-muted">Vi har hævet vores.</span>
            </h2>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={1}
            variants={fadeInUp}
            className="space-y-5"
          >
            <p className="text-muted leading-relaxed">
              AI har ændret forudsætningerne. Vi har tilpasset vores
              proces — ikke vores ambitionsniveau. Vi investerer
              stadig 100–300 timer pr. projekt. Samme fundament som
              altid. Forskellen er hvad de timer producerer i dag.
            </p>
            <p className="text-muted leading-relaxed">
              Hvor andre reducerer til 2–5 timer, bruger vi de
              frigjorte ressourcer på at levere eksemplarisk. Det
              er ikke hastighed der afgør kvalitet på lang sigt —
              det er viljen til at udnytte potentialet til det fuldeste.
            </p>
            <div className="flex gap-12 pt-4">
              <div>
                <p className="text-2xl font-bold">150+</p>
                <p className="text-xs text-muted mt-1">Projekter leveret</p>
              </div>
              <div>
                <p className="text-2xl font-bold">98%</p>
                <p className="text-xs text-muted mt-1">Tilfredse kunder</p>
              </div>
              <div>
                <p className="text-2xl font-bold">12 år</p>
                <p className="text-xs text-muted mt-1">Erfaring i branchen</p>
              </div>
            </div>
          </motion.div>
        </div>
        </Container>
      </section>

      {/* ═══ Process — dark section ═══ */}
      <section
        id="process"
        className="sticky top-0 z-40 bg-[#0f0f0f] text-[#f5f5f0]"
        style={{ boxShadow: "0 0 0 100vmax #0f0f0f, 0 -8px 30px rgba(0,0,0,0.15)", clipPath: "inset(0 -100vmax)" }}
      >
        <Container size="site" className="py-20 md:py-28 lg:py-36">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          custom={0}
          variants={fadeInUp}
          className="mb-16"
        >
          <ScrambleEyebrow className="text-white/40">
            Processen
          </ScrambleEyebrow>
          <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
            Fra indsigt til resultat
          </h2>
          <p className="mt-4 max-w-lg text-base text-white/50">
            Ingen overraskelser. Du ved altid præcis hvad der sker, hvad der
            kommer, og hvornår vi rammer milepæle.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((item, i) => (
            <ProcessCard key={item.step} item={item} index={i} />
          ))}
        </div>
        </Container>
      </section>

      {/* end sticky stack */}
      </div>

      {/* ═══ What's included ═══ */}
      <Container as="section" size="site" className="py-24">
        <div className="grid gap-12 md:grid-cols-[1fr_1.5fr] md:gap-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={0}
            variants={fadeInUp}
          >
            <ScrambleEyebrow>Inkluderet</ScrambleEyebrow>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              Alt hvad din
              <br />
              hjemmeside har brug for
            </h2>
            <p className="mt-4 text-muted leading-relaxed">
              Vi leverer ikke halvfærdige løsninger. Hver hjemmeside fra
              Horizen er komplet — fra performance til tilgængelighed.
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2">
            {deliverables.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.text}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-30px" }}
                  variants={fadeInUp}
                  className="flex items-start gap-4 rounded-xl border border-foreground/[0.06] p-4 transition-all duration-300 hover:border-foreground/[0.12] hover:bg-foreground/[0.02]"
                >
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.bg}`}>
                    <Icon className={`size-4 ${item.fg}`} />
                  </div>
                  <p className="text-sm font-medium leading-snug pt-1.5">
                    {item.text}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Container>

      {/* ═══ Testimonial ═══ */}
      <section className="py-24 bg-accent/50 rounded-3xl mx-4 md:mx-8">
        <Container size="site">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          custom={0}
          variants={fadeInUp}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="flex justify-center gap-0.5 mb-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex h-6 w-6 items-center justify-center bg-[#00b67a]"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-white">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
            ))}
          </div>
          <blockquote className="text-2xl md:text-3xl font-light leading-relaxed tracking-tight">
            &ldquo;Vi har fået en hjemmeside der faktisk arbejder for os. Flere
            henvendelser, bedre kunder, og en platform vi selv kan opdatere.
            Det er præcis det vi havde brug for.&rdquo;
          </blockquote>
          <div className="mt-8 flex items-center justify-center gap-3">
            <img
              src="/staff/staff-jose-digital-design.jpg"
              alt=""
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="text-left">
              <p className="font-semibold text-sm">Seitz</p>
              <p className="text-xs text-muted">
                Malerfirma, København
              </p>
            </div>
          </div>
        </motion.div>
        </Container>
      </section>

      {/* ═══ Cases ═══ */}
      <Container as="section" size="site" className="py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          custom={0}
          variants={fadeInUp}
          className="mb-10"
        >
          <ScrambleEyebrow>Vores arbejde</ScrambleEyebrow>
          <div className="mt-4 flex items-end justify-between">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Se det i praksis
            </h2>
            <Link
              href="/#cases"
              className="group flex items-center gap-1.5 text-sm font-medium text-muted transition-colors duration-300 hover:text-foreground"
            >
              Alle cases
              <ArrowRightIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {relatedCases.map((item, i) => (
            <motion.div
              key={item.href}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUp}
            >
              <Link href={item.href} className="group block">
                <div className="relative overflow-hidden rounded-2xl bg-accent aspect-[4/3]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                  <div className="absolute bottom-3 left-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-medium">
                      <CheckIcon className="size-3 text-[#00b67a]" />
                      {item.result}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted">{item.category}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>

      {/* ═══ CTA ═══ */}
      <Container as="section" size="site" noPadding className="px-4 py-16 md:px-6 lg:px-8">
        <InfiniteGrid className="rounded-2xl border border-white/[0.10] bg-gradient-to-b from-[#1e1e1e] via-foreground to-[#080808] md:rounded-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="px-6 py-14 text-center md:px-10 md:py-18"
          >
            <h2 className="text-3xl font-bold tracking-tight text-background md:text-4xl lg:text-5xl">
              Klar til at skabe noget stærkt?
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-background/50 md:text-lg">
              Fortæl os om dit projekt — vi vender tilbage inden for 24 timer
              med en uforpligtende vurdering.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4">
              <a
                href="/kontakt"
                className="rounded-full border border-background bg-background px-8 py-3.5 text-sm font-medium text-foreground transition-all duration-300 hover:bg-transparent hover:text-background"
              >
                Start et projekt
              </a>
              <a
                href="mailto:hej@horizen.dk"
                className="text-sm font-medium text-background/50 transition-colors duration-300 hover:text-background"
              >
                hej@horizen.dk &rarr;
              </a>
            </div>
          </motion.div>
        </InfiniteGrid>
      </Container>

      {/* ═══ FAQ ═══ */}
      <Container as="section" size="site" className="py-24 border-t border-foreground/[0.06]">
        <div className="grid gap-12 md:grid-cols-[1fr_1.5fr] md:gap-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={0}
            variants={fadeInUp}
          >
            <ScrambleEyebrow>Spørgsmål</ScrambleEyebrow>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              Ofte stillede
              <br />
              spørgsmål
            </h2>
            <p className="mt-4 text-muted leading-relaxed">
              Har du et spørgsmål der ikke er besvaret her? Skriv til os på{" "}
              <a
                href="mailto:hej@horizen.dk"
                className="text-foreground underline underline-offset-4 decoration-foreground/20 hover:decoration-foreground transition-colors duration-300"
              >
                hej@horizen.dk
              </a>
            </p>
          </motion.div>

          <div>
            {faqs.map((faq, i) => (
              <FaqItem key={i} item={faq} index={i} />
            ))}
          </div>
        </div>
      </Container>

      <Footer />

      </div>{/* end bg-background */}
    </main>
  );
}
