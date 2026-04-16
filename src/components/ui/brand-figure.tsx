"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRive, useStateMachineInput, Layout, Fit, Alignment } from "@rive-app/react-canvas";

/* ── Emotion mapping ─────────────────────────────────────────────── */

// Each artboard has 4 state machines: Emo-Happy, Emo-Ok, Emo-Meh, Emo-Sad
// We use the artboard that matches the desired emotion so its default SM plays
const EMOTIONS = [
  { artboard: "Emotions-02", stateMachine: "Emotions", label: "Perfekt balance" },
  { artboard: "Content",     stateMachine: "Emo-Ok",    label: "God balance" },
  { artboard: "Ok",          stateMachine: "Emo-Ok",    label: "Acceptabel" },
  { artboard: "Meh",         stateMachine: "Emo-Meh",   label: "Ude af balance" },
  { artboard: "Sad",         stateMachine: "Emo-Sad",   label: "Dårlig balance" },
] as const;

type Emotion = (typeof EMOTIONS)[number];

/* ── Ideal split ─────────────────────────────────────────────────── */

const IDEAL = { visual: 25, strategy: 35, culture: 40 };

const SLIDERS = [
  { key: "visual"   as const, label: "Visuelt udtryk",          color: "#A259FF", ideal: IDEAL.visual },
  { key: "strategy" as const, label: "Strategi & positionering", color: "#4ECDC4", ideal: IDEAL.strategy },
  { key: "culture"  as const, label: "Kultur & værdier",         color: "#FF8C42", ideal: IDEAL.culture },
];

/* ── Helpers ──────────────────────────────────────────────────────── */

function getEmotion(values: { visual: number; strategy: number; culture: number }): Emotion {
  // Calculate deviation from ideal — higher = worse
  const deviation =
    Math.abs(values.visual - IDEAL.visual) +
    Math.abs(values.strategy - IDEAL.strategy) +
    Math.abs(values.culture - IDEAL.culture);

  // Map deviation to emotion index (max possible deviation ≈ 130)
  if (deviation <= 5)  return EMOTIONS[0]; // Happy
  if (deviation <= 15) return EMOTIONS[1]; // Content
  if (deviation <= 30) return EMOTIONS[2]; // Ok
  if (deviation <= 50) return EMOTIONS[3]; // Meh
  return EMOTIONS[4];                      // Sad
}

/* ── Single Rive artboard renderer ───────────────────────────────── */

function RiveEmotion({
  artboard,
  stateMachine,
  visible,
  crop,
}: {
  artboard: string;
  stateMachine: string | string[];
  visible: boolean;
  crop?: boolean;
}) {
  const { rive, RiveComponent } = useRive({
    src: "/graphics/26338-50852-how-are-you-feeling.riv",
    artboard,
    stateMachines: stateMachine,
    autoplay: true,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
  });

  // Strip text from "Emotions-02" artboard at runtime
  useEffect(() => {
    if (!crop || !rive) return;
    try {
      const ab = rive.artboard;
      for (let i = 0; i < ab.textValueRunCount(); i++) {
        ab.textValueRunByIndex(i).text = " ";
      }
    } catch {}
  }, [rive, crop]);

  return (
    <div
      className={`absolute inset-0 ${crop ? "overflow-hidden rounded-full" : "transition-opacity duration-300"}`}
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: "none",
        ...(crop ? {
          background: "linear-gradient(170deg, #8ec5ea 0%, #b490e8 50%, #c47cf0 100%)",
          boxShadow: "inset 0 0 25px 15px rgba(140,175,230,0.7), inset 0 0 50px 30px rgba(175,130,235,0.4)",
        } : {}),
      }}
    >
      <div
        className={crop ? "absolute" : "absolute inset-0"}
        style={crop ? { left: "-235%", top: "-190%", width: "570%", height: "570%", mixBlendMode: "multiply" } : undefined}
      >
        <RiveComponent />
      </div>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────── */

export default function BrandFigure() {
  const [values, setValues] = useState({
    visual: 75,
    strategy: 10,
    culture: 15,
  });

  const emotion = useMemo(() => getEmotion(values), [values]);
  const isPerfect = emotion.artboard === "Emotions-02";
  const prevPerfectRef = useRef(isPerfect);
  const [bounce, setBounce] = useState(false);
  const [delayedPerfect, setDelayedPerfect] = useState(isPerfect);

  useEffect(() => {
    if (isPerfect && !prevPerfectRef.current) {
      // Wait for old figure to fade out, then pop the new one in
      const fadeOut = setTimeout(() => {
        setDelayedPerfect(true);
        setBounce(true);
      }, 350);
      const bounceEnd = setTimeout(() => setBounce(false), 950);
      prevPerfectRef.current = isPerfect;
      return () => { clearTimeout(fadeOut); clearTimeout(bounceEnd); };
    }
    if (!isPerfect) {
      setDelayedPerfect(false);
    }
    prevPerfectRef.current = isPerfect;
  }, [isPerfect]);

  const handleChange = useCallback((key: keyof typeof values, raw: number) => {
    setValues((prev) => {
      const others = Object.entries(prev).filter(([k]) => k !== key);
      const remaining = 100 - raw;
      const othersTotal = others.reduce((s, [, v]) => s + v, 0);

      if (othersTotal === 0) {
        // Edge case: both others at 0 — split remaining evenly
        const half = Math.round(remaining / 2);
        return {
          ...prev,
          [key]: raw,
          [others[0][0]]: half,
          [others[1][0]]: remaining - half,
        } as typeof prev;
      }

      // Redistribute remaining proportionally among the other two
      const next = { ...prev, [key]: raw };
      const ratio = remaining / othersTotal;
      let assigned = 0;
      for (let i = 0; i < others.length; i++) {
        const [k] = others[i];
        if (i === others.length - 1) {
          (next as Record<string, number>)[k] = remaining - assigned;
        } else {
          const v = Math.round(others[i][1] * ratio);
          (next as Record<string, number>)[k] = v;
          assigned += v;
        }
      }
      return next;
    });
  }, []);

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-sm mx-auto">
      {/* Rive figure */}
      <div className={`relative w-48 h-48 md:w-56 md:h-56 ${bounce ? "brand-figure-bounce" : ""}`}>
        {EMOTIONS.map((emo) => {
          const isBallance = emo.artboard === "Emotions-02";
          const visible = isBallance
            ? delayedPerfect
            : emotion.artboard === emo.artboard && !isPerfect;
          return (
            <RiveEmotion
              key={emo.artboard}
              artboard={emo.artboard}
              stateMachine={emo.stateMachine}
              visible={visible}
              crop={isBallance}
            />
          );
        })}
        {/* Mask ring — hides the black outline baked into the .riv artboards */}
        <div
          className="pointer-events-none absolute rounded-full"
          style={{
            inset: "-4px",
            boxShadow: "0 0 0 10px var(--background), inset 0 0 0 5px var(--background)",
          }}
        />
      </div>

      {/* Emotion label */}
      <p className="text-xs text-muted text-center h-4 transition-all duration-300">
        {emotion.label}
      </p>

      {/* Sliders */}
      <div className="flex flex-col gap-5 w-full">
        {SLIDERS.map((s) => (
          <div key={s.key} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">{s.label}</span>
              <span className="text-xs font-medium tabular-nums w-8 text-right">
                {values[s.key]}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={80}
              value={values[s.key]}
              onChange={(e) => handleChange(s.key, Number(e.target.value))}
              className="brand-slider w-full"
              style={{ "--slider-color": s.color } as React.CSSProperties}
            />
          </div>
        ))}

        {/* Reset button — only visible when not in perfect balance */}
        <button
          type="button"
          onClick={() => setValues({ visual: IDEAL.visual, strategy: IDEAL.strategy, culture: IDEAL.culture })}
          className="mt-1 self-center inline-flex items-center rounded-full border border-foreground/15 px-4 py-2 text-xs font-medium text-foreground/70 transition-all duration-300 hover:border-foreground/40 hover:text-foreground cursor-pointer"
          style={{
            opacity: emotion.artboard === "Emotions-02" ? 0 : 1,
            pointerEvents: emotion.artboard === "Emotions-02" ? "none" : "auto",
          }}
        >
          Balancér
        </button>
      </div>
    </div>
  );
}
