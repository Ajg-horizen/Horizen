"use client";

/**
 * Signatur-block for UI/UX-design-siden.
 * Indeholder design-tokens-vindue (tokens.ts) + animerede design-system scores.
 * Spejler TechFoundationBlock visuelt — samme kode-vindue-æstetik.
 */

import { useEffect, useRef, useState } from "react";
import { motion, animate, useMotionValue, useInView } from "framer-motion";
import Container from "@/components/Container";
import { ScrambleEyebrow } from "@/components/ui/scramble-eyebrow";
import { fadeInUp } from "@/lib/animations";
import type {
  DesignTokensBlock as DesignTokensBlockData,
  DesignMaturityScore,
} from "@/lib/services";

const typingTokens = [
  { key: "lineHeight.tight", value: "1.15" },
  { key: "tracking.heading", value: '"-0.02em"' },
  { key: "elevation.card", value: '"0 8px 24px -12px"' },
  { key: "duration.fast", value: "180" },
  { key: "ease.standard", value: '"cubic-bezier(0.2, 0, 0, 1)"' },
  { key: "focus.ring", value: '"2px solid foreground"' },
  { key: "touchTarget.min", value: "44" },
];

function TypingTokenLine() {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const current = typingTokens[lineIndex];
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
      setLineIndex((i) => (i + 1) % typingTokens.length);
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
  metric: DesignMaturityScore;
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

export default function DesignTokensBlock({
  data,
  id,
}: {
  data: DesignTokensBlockData;
  id?: string;
}) {
  const headingNode =
    typeof data.heading === "string" ? (
      data.heading
    ) : (
      <>
        {data.heading.lead}
        {data.heading.mutedTail && (
          <>
            {" "}
            <span className="text-muted">{data.heading.mutedTail}</span>
          </>
        )}
      </>
    );

  const bodyParagraphs = Array.isArray(data.body) ? data.body : [data.body];

  return (
    <Container as="section" id={id} size="site" className="py-20 scroll-mt-24">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        custom={0}
        variants={fadeInUp}
        className="mb-14 max-w-3xl"
      >
        <ScrambleEyebrow>{data.eyebrow}</ScrambleEyebrow>
        <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
          {headingNode}
        </h2>
        <div className="mt-4 space-y-4">
          {bodyParagraphs.map((p, i) => (
            <p key={i} className="text-base leading-relaxed text-muted">
              {p}
            </p>
          ))}
        </div>
      </motion.div>

      <div className="grid gap-10 md:grid-cols-2 items-center max-w-5xl mx-auto">
        {/* Tokens window */}
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
              tokens.ts
            </span>
          </div>
          <div className="p-5 font-mono text-[13px] leading-relaxed overflow-x-auto">
            <div className="text-white/20 select-none inline-block w-8 text-right mr-4">1</div>
            <span className="text-[#5c6370]">{"// Design tokens — én sandhed"}</span>
            <br />
            <div className="text-white/20 select-none inline-block w-8 text-right mr-4">2</div>
            <span className="text-[#c678dd]">export const</span>
            <span className="text-[#61afef]"> tokens</span>
            <span className="text-white/70">{" = {"}</span>
            <br />
            <div className="text-white/20 select-none inline-block w-8 text-right mr-4">3</div>
            <span className="text-white/70">{"  "}</span>
            <span className="text-[#e06c75]">color.foreground</span>
            <span className="text-white/70">: </span>
            <span className="text-[#98c379]">{'"#0f0f0f"'}</span>
            <span className="text-white/40">,</span>
            <br />
            <div className="text-white/20 select-none inline-block w-8 text-right mr-4">4</div>
            <span className="text-white/70">{"  "}</span>
            <span className="text-[#e06c75]">color.background</span>
            <span className="text-white/70">: </span>
            <span className="text-[#98c379]">{'"#f5f5f0"'}</span>
            <span className="text-white/40">,</span>
            <br />
            <div className="text-white/20 select-none inline-block w-8 text-right mr-4">5</div>
            <span className="text-white/70">{"  "}</span>
            <span className="text-[#e06c75]">color.muted</span>
            <span className="text-white/70">: </span>
            <span className="text-[#98c379]">{'"#6b6b6b"'}</span>
            <span className="text-white/40">,</span>
            <br />
            <div className="text-white/20 select-none inline-block w-8 text-right mr-4">6</div>
            <span className="text-white/70">{"  "}</span>
            <span className="text-[#e06c75]">space.unit</span>
            <span className="text-white/70">: </span>
            <span className="text-[#d19a66]">4</span>
            <span className="text-white/40">,</span>
            <span className="text-[#5c6370]">{"          // 4px base grid"}</span>
            <br />
            <div className="text-white/20 select-none inline-block w-8 text-right mr-4">7</div>
            <span className="text-white/70">{"  "}</span>
            <span className="text-[#e06c75]">radius.card</span>
            <span className="text-white/70">: </span>
            <span className="text-[#d19a66]">16</span>
            <span className="text-white/40">,</span>
            <br />
            <div className="text-white/20 select-none inline-block w-8 text-right mr-4">8</div>
            <span className="text-white/70">{"  "}</span>
            <span className="text-[#e06c75]">type.scale</span>
            <span className="text-white/70">: </span>
            <span className="text-[#d19a66]">1.25</span>
            <span className="text-white/40">,</span>
            <span className="text-[#5c6370]">{"      // major third"}</span>
            <br />
            <div className="text-white/20 select-none inline-block w-8 text-right mr-4">9</div>
            <span className="text-white/70">{"  "}</span>
            <span className="text-[#e06c75]">contrast.minAA</span>
            <span className="text-white/70">: </span>
            <span className="text-[#d19a66]">4.5</span>
            <span className="text-white/40">,</span>
            <br />
            <div className="text-white/20 select-none inline-block w-8 text-right mr-4">10</div>
            <span className="text-white/70">{"  "}</span>
            <span className="text-[#e06c75]">leading.body</span>
            <span className="text-white/70">: </span>
            <span className="text-[#d19a66]">1.5</span>
            <span className="text-white/40">,</span>
            <br />
            <div className="text-white/20 select-none inline-block w-8 text-right mr-4">11</div>
            <TypingTokenLine />
            <br />
            <div className="text-white/20 select-none inline-block w-8 text-right mr-4">12</div>
            <span className="text-white/70">{`} as const`}</span>
          </div>
        </motion.div>

        {/* Maturity scores */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          custom={0.2}
          variants={fadeInUp}
        >
          <div className="grid grid-cols-2 gap-8 max-w-sm mx-auto">
            {data.maturityScores.map((metric, i) => (
              <AnimatedScore key={metric.label} metric={metric} index={i} />
            ))}
          </div>
        </motion.div>
      </div>
    </Container>
  );
}
