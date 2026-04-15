"use client";

/**
 * Signatur-block for UI/UX-design-siden.
 * To mockups side om side: venstre = wireframe (UX), højre = polished (UI).
 * Illustrerer pædagogisk forskellen og at UI sidder oven på UX.
 */

import { motion } from "framer-motion";
import Container from "@/components/Container";
import { ScrambleEyebrow } from "@/components/ui/scramble-eyebrow";
import { fadeInUp } from "@/lib/animations";
import type { UxVsUiBlock as UxVsUiBlockData } from "@/lib/services";

/* ─── Wireframe (UX) mockup ──────────────────────────────── */
/* Layout 1:1 matcher "We are experts elevating lives" UI-eksemplet:
   nav overlayer hero → hero edge-to-edge → cream-section m/ 3 stats →
   divider → "01 About us" + body text på højre → stor heading nederst */

function WireframeMockup() {
  return (
    <svg
      viewBox="0 0 400 300"
      className="h-auto w-full"
      role="img"
      aria-label="Wireframe af samme layout som UI-eksemplet: nav over hero edge-to-edge, 3 stats, 01-section med body tekst, stor heading"
    >
      <defs>
        <radialGradient id="wire-bg" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#e8e8e4" />
          <stop offset="100%" stopColor="#d4d4d0" />
        </radialGradient>
        <clipPath id="ux-card-clip">
          <rect x="60" y="16" width="280" height="270" rx="14" />
        </clipPath>
      </defs>

      {/* Baggrund */}
      <rect width="400" height="300" fill="url(#wire-bg)" rx="8" />

      {/* Card base (cream bottom-section farve) */}
      <rect x="60" y="16" width="280" height="270" fill="#f0f0ec" rx="14" stroke="#c8c8c4" strokeWidth="0.6" />

      {/* Alt indhold clippes af card's rounded corners */}
      <g clipPath="url(#ux-card-clip)">
        {/* ── Hero image: edge-to-edge, trukket længere ned så den også dækker stats-rækken ── */}
        <rect x="60" y="16" width="280" height="210" fill="#b8b8b4" />
        {/* Diagonale stiplede linjer = "billede placeholder" */}
        <line x1="60" y1="16" x2="340" y2="226" stroke="#a0a0a0" strokeWidth="0.7" strokeDasharray="2 2" />
        <line x1="340" y1="16" x2="60" y2="226" stroke="#a0a0a0" strokeWidth="0.7" strokeDasharray="2 2" />

        {/* ── Nav bar overlayer hero ── */}
        {/* Logo */}
        <circle cx="82" cy="34" r="4" fill="#fafaf6" opacity="0.95" />
        {/* Nav links centreret */}
        <rect x="160" y="32" width="18" height="3" fill="#fafaf6" opacity="0.85" />
        <rect x="186" y="32" width="18" height="3" fill="#fafaf6" opacity="0.85" />
        <rect x="212" y="32" width="22" height="3" fill="#fafaf6" opacity="0.85" />
        <rect x="242" y="32" width="22" height="3" fill="#fafaf6" opacity="0.85" />
        {/* Hvid "buy template" pille højre */}
        <rect x="282" y="26" width="46" height="16" fill="#fafaf6" rx="8" />
        <rect x="294" y="32" width="22" height="3" fill="#8a8a86" />

        {/* ── Overlay: centreret heading (2 linjer, hvidt) ── */}
        <rect x="136" y="72" width="128" height="8" fill="#fafaf6" rx="1" opacity="0.95" />
        <rect x="150" y="84" width="100" height="8" fill="#fafaf6" rx="1" opacity="0.95" />

        {/* Overlay: body tekst (2 små linjer) */}
        <rect x="152" y="100" width="96" height="3" fill="#fafaf6" opacity="0.7" />
        <rect x="146" y="107" width="108" height="3" fill="#fafaf6" opacity="0.7" />

        {/* Overlay: CTA pille centreret */}
        <rect x="170" y="118" width="60" height="14" fill="#fafaf6" rx="7" opacity="0.95" />
        <rect x="184" y="124" width="32" height="3" fill="#8a8a86" />

        {/* ── Cream-sektion nedenfor hero ── */}
        {/* (allerede dækket af card base, hero block slutter y=171) */}

        {/* ── Stats row: 3 kolonner overlayer hero-billedet ── */}
        {[0, 1, 2].map((i) => {
          const centerX = 140 + i * 60;
          return (
            <g key={i}>
              {/* Stort tal — hvidt siden det nu er på grå hero */}
              <rect x={centerX - 14} y="188" width="28" height="10" fill="#fafaf6" opacity="0.95" rx="1" />
              {/* Lille label under */}
              <rect x={centerX - 18} y="202" width="36" height="3" fill="#fafaf6" opacity="0.7" />
              <rect x={centerX - 14} y="208" width="28" height="3" fill="#fafaf6" opacity="0.7" />
            </g>
          );
        })}

        {/* ── Divider-linje ── */}
        <line x1="76" y1="224" x2="324" y2="224" stroke="#c8c8c4" strokeWidth="0.6" />

        {/* ── Content row: "01" + label venstre, body-tekst højre ── */}
        {/* Stort "01" tal */}
        <rect x="76" y="238" width="18" height="12" fill="#6a6a66" rx="1" />
        {/* Lille "About us" label */}
        <rect x="100" y="242" width="24" height="3" fill="#b0b0ac" />

        {/* Højre: body tekst (3 linjer) */}
        <rect x="194" y="238" width="130" height="3" fill="#9a9a96" />
        <rect x="194" y="246" width="118" height="3" fill="#9a9a96" />
        <rect x="194" y="254" width="86" height="3" fill="#9a9a96" />

        {/* ── Stor heading nederst venstre ── */}
        <rect x="76" y="262" width="90" height="8" fill="#7a7a76" rx="1" />
        <rect x="76" y="272" width="74" height="8" fill="#7a7a76" rx="1" />
      </g>
    </svg>
  );
}

/* ─── UI (polished) mockup — billede ──────────────────── */

function UiMockup() {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src="/graphics/UI-image-example-1.webp"
      alt="Eksempel på poleret UI — færdig hjemmeside med typografi, farver, billeder, komponenter og indhold"
      className="block h-auto w-full"
    />
  );
}


/* ─── Block ──────────────────────────────────────────────── */

export default function UxVsUiBlock({
  data,
  id,
}: {
  data: UxVsUiBlockData;
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

  const paragraphs = Array.isArray(data.body) ? data.body : [data.body];
  const uxLabel = data.uxLabel ?? "UX";
  const uiLabel = data.uiLabel ?? "UI";

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
          {paragraphs.map((p, i) => (
            <p key={i} className="text-base leading-relaxed text-muted">
              {p}
            </p>
          ))}
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 md:gap-8">
        {/* UX mockup card */}
        <motion.div
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInUp}
          className="group flex flex-col gap-4 rounded-2xl border border-foreground/[0.08] bg-background p-5 transition-all duration-500 hover:border-foreground/[0.18] md:p-6"
        >
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-accent/40 px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-foreground/40" />
              {uxLabel}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
              Struktur
            </span>
          </div>
          <div className="overflow-hidden rounded-lg">
            <WireframeMockup />
          </div>
          <p className="text-sm leading-relaxed text-muted">{data.uxCaption}</p>
        </motion.div>

        {/* UI mockup card */}
        <motion.div
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInUp}
          className="group flex flex-col gap-4 rounded-2xl border border-foreground/[0.08] bg-background p-5 transition-all duration-500 hover:border-foreground/[0.18] md:p-6"
        >
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-accent/40 px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00b67a]" />
              {uiLabel}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
              Udtryk
            </span>
          </div>
          <div className="overflow-hidden rounded-lg">
            <UiMockup />
          </div>
          <p className="text-sm leading-relaxed text-muted">{data.uiCaption}</p>
        </motion.div>
      </div>
    </Container>
  );
}
