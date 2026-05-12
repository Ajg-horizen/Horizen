"use client";

import { useMemo, useRef, useState } from "react";
import { PencilIcon } from "lucide-react";

const hexToRgb = (hex: string) => {
  const m = hex.replace("#", "").match(/.{2}/g);
  if (!m) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(m[0], 16),
    g: parseInt(m[1], 16),
    b: parseInt(m[2], 16),
  };
};

const rgbToHex = (r: number, g: number, b: number) =>
  "#" +
  [r, g, b]
    .map((v) =>
      Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0"),
    )
    .join("");

type Matrix = readonly [
  readonly [number, number, number],
  readonly [number, number, number],
  readonly [number, number, number],
];

const DEUTERANOPIA: Matrix = [
  [0.625, 0.375, 0],
  [0.7, 0.3, 0],
  [0, 0.3, 0.7],
];
const TRITANOPIA: Matrix = [
  [0.95, 0.05, 0],
  [0, 0.433, 0.567],
  [0, 0.475, 0.525],
];

const simulate = (hex: string, matrix: Matrix) => {
  const { r, g, b } = hexToRgb(hex);
  const nr = matrix[0][0] * r + matrix[0][1] * g + matrix[0][2] * b;
  const ng = matrix[1][0] * r + matrix[1][1] * g + matrix[1][2] * b;
  const nb = matrix[2][0] * r + matrix[2][1] * g + matrix[2][2] * b;
  return rgbToHex(nr, ng, nb);
};

const luminance = (hex: string) => {
  const { r, g, b } = hexToRgb(hex);
  const lin = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
};

const contrastRatio = (a: string, b: string) => {
  const la = luminance(a);
  const lb = luminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
};

function ColorSwatch({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <button
      type="button"
      onClick={() => ref.current?.click()}
      className="group flex items-center gap-2 text-xs"
      aria-label={`Skift ${label.toLowerCase()}`}
    >
      <span
        className="relative size-7 rounded-full border border-foreground/[0.12] shadow-sm transition-transform group-hover:scale-105"
        style={{ backgroundColor: value }}
      >
        <span className="absolute -bottom-0.5 -right-0.5 flex size-3.5 items-center justify-center rounded-full border border-foreground/[0.08] bg-background shadow-sm">
          <PencilIcon className="size-2 text-foreground/70" />
        </span>
      </span>
      <span className="text-muted">{label}</span>
      <input
        ref={ref}
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="sr-only"
      />
    </button>
  );
}

export function ColorBlindTest() {
  const [bg, setBg] = useState("#e8f0e4");
  const [fg, setFg] = useState("#2d4a28");

  const ratio = useMemo(() => contrastRatio(fg, bg), [fg, bg]);

  const status = (() => {
    if (ratio < 1.5) return { text: "Håbløs", dot: "#e74c3c" };
    if (ratio < 3) return { text: "Kritisk", dot: "#e74c3c" };
    if (ratio < 4.5) return { text: "Ikke godt", dot: "#c9a227" };
    if (ratio < 7) return { text: "Godt", dot: "#00b67a" };
    return { text: "God læsbarhed", dot: "#00b67a" };
  })();

  const simulations = [
    { label: "Normalt syn", bg, fg },
    {
      label: "Rød-grøn blind",
      bg: simulate(bg, DEUTERANOPIA),
      fg: simulate(fg, DEUTERANOPIA),
    },
    {
      label: "Blå-gul blind",
      bg: simulate(bg, TRITANOPIA),
      fg: simulate(fg, TRITANOPIA),
    },
  ];

  return (
    <div className="w-full max-w-md xl:max-w-lg 2xl:max-w-xl rounded-2xl border border-foreground/[0.06] bg-foreground/[0.02] p-5 xl:p-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted">
          Kontrast-test
        </span>
        <div className="flex items-center gap-3">
          <ColorSwatch label="Baggrund" value={bg} onChange={setBg} />
          <ColorSwatch label="Tekst" value={fg} onChange={setFg} />
        </div>
      </div>

      <div
        className="flex h-28 xl:h-36 2xl:h-44 w-full items-center justify-center rounded-xl border border-foreground/[0.06] text-4xl xl:text-5xl 2xl:text-6xl font-bold tracking-widest transition-colors duration-200"
        style={{ backgroundColor: bg, color: fg }}
      >
        AAAA
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {simulations.map((s) => (
          <div key={s.label} className="flex flex-col items-center gap-1.5">
            <div
              className="flex h-12 xl:h-14 2xl:h-16 w-full items-center justify-center rounded-lg border border-foreground/[0.06] text-sm xl:text-base 2xl:text-lg font-bold tracking-wider transition-colors duration-200"
              style={{ backgroundColor: s.bg, color: s.fg }}
            >
              AAAA
            </div>
            <span className="text-center text-[10px] leading-tight text-muted">
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-foreground/[0.06] pt-3 text-xs">
        <span className="font-mono text-muted">
          Kontrast {ratio.toFixed(2)}:1
        </span>
        <span className="flex items-center gap-1.5 font-medium">
          <span
            className="size-1.5 rounded-full"
            style={{ backgroundColor: status.dot }}
          />
          {status.text}
        </span>
      </div>
    </div>
  );
}
