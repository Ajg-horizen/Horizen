"use client";

/**
 * Signatur-block for webudvikling-siden.
 * Indeholder kode-vindue (web-vitals.config.ts) + animerede Lighthouse-scores.
 * Hvis denne block bliver brugt på flere services, generaliser ved at tage
 * `codeLines` og evt. titlebar-tekst som data.
 */

import { useEffect, useRef, useState } from "react";
import {
  motion,
  animate,
  useMotionValue,
  useInView,
} from "framer-motion";
import Container from "@/components/Container";
import { ScrambleEyebrow } from "@/components/ui/scramble-eyebrow";
import { fadeInUp } from "@/lib/animations";
import type {
  TechFoundationBlock as TechFoundationBlockData,
  LighthouseMetric,
} from "@/lib/services";

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
      const t = setTimeout(() => setCharIndex((c) => c + 1), 60 + Math.random() * 40);
      return () => clearTimeout(t);
    }
    if (!isDeleting && charIndex === fullText.length) {
      const t = setTimeout(() => setIsDeleting(true), 2000);
      return () => clearTimeout(t);
    }
    if (isDeleting && charIndex > 0) {
      const t = setTimeout(() => setCharIndex((c) => c - 1), 30);
      return () => clearTimeout(t);
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
      <span className="text-[#d19a66]">
        {rest.slice(2, rest.endsWith(",") ? -1 : undefined)}
      </span>
      {rest.endsWith(",") && <span className="text-white/40">,</span>}
      <span className="inline-block w-[2px] h-[14px] bg-white/60 ml-[1px] align-middle animate-pulse" />
    </>
  );
}

function AnimatedScore({
  metric,
  index,
}: {
  metric: LighthouseMetric;
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

export default function TechFoundationBlock({
  data,
  id,
}: {
  data: TechFoundationBlockData;
  id?: string;
}) {
  return (
    <Container as="section" id={id} size="site" className="py-20 scroll-mt-24">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        custom={0}
        variants={fadeInUp}
        className="text-left lg:text-center mb-14"
      >
        <ScrambleEyebrow>{data.eyebrow}</ScrambleEyebrow>
        <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
          {data.heading}
        </h2>
        <p className="mt-3 text-base text-muted max-w-lg lg:mx-auto">{data.body}</p>
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
            {data.lighthouseMetrics.map((metric, i) => (
              <AnimatedScore key={metric.label} metric={metric} index={i} />
            ))}
          </div>
        </motion.div>
      </div>
    </Container>
  );
}
