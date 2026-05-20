"use client";

import { createContext, useContext } from "react";
import type { PrincipleSlug } from "@/lib/design-principles";

/**
 * Flade geometriske illustrationer for designprincipper.
 *
 * Stil: matsort forms på pastel baggrund (sat via div omkring SVG'en,
 * mappet pr. kategori i CATEGORY_BG). Fremhævning via størrelse og
 * komposition, aldrig farve.
 *
 * "Cut-outs" (fx trekanten i Æstetik-Usability, mellem-ringen i Fitts)
 * læser den aktuelle bg-farve via BgContext, så pastel-laget matcher kortet.
 *
 * Slug skal matche src/lib/design-principles.ts.
 */

type IllProps = { className?: string };

// Bg-context holder den aktuelle pastelfarve for "cut-outs"
// (trekanten i Æstetik-Usability, mellem-ringen i Fitts, osv.).
const BgContext = createContext<string>("#f5f5f0");
const useBg = () => useContext(BgContext);

const C = {
  fg: "#0f0f0f",
} as const;

function Frame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 400 240"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

// ----- Perception -----

/** Æstetik-Usability, sort cirkel med trekant skåret ud */
function AestetikUsability({ className }: IllProps) {
  const bg = useBg();
  return (
    <Frame className={className}>
      <circle cx="200" cy="120" r="92" fill={C.fg} />
      <polygon points="200,68 252,168 148,168" fill={bg} />
    </Frame>
  );
}

/** Fælles område, region indrammer en gruppe, én skiller sig ud */
function FaellesOmraade({ className }: IllProps) {
  const bg = useBg();
  return (
    <Frame className={className}>
      <rect x="120" y="50" width="160" height="140" fill={C.fg} />
      {[0, 1, 2].map((r) =>
        [0, 1, 2].map((c) => {
          const cx = 150 + c * 50;
          const cy = 80 + r * 40;
          const isCenter = r === 1 && c === 1;
          return (
            <circle
              key={`${r}-${c}`}
              cx={cx}
              cy={cy}
              r="10"
              fill={bg}
              opacity={isCenter ? 1 : 0.25}
            />
          );
        }),
      )}
    </Frame>
  );
}

/** Nærhedsloven, to klynger af prikker */
function Naerhedsloven({ className }: IllProps) {
  return (
    <Frame className={className}>
      {[110, 130, 150, 170, 190].map((cx, i) => (
        <circle key={`a${i}`} cx={cx} cy={120} r="8" fill={C.fg} />
      ))}
      {[230, 250, 270, 290, 310].map((cx, i) => (
        <circle key={`b${i}`} cx={cx} cy={120} r="8" fill={C.fg} />
      ))}
    </Frame>
  );
}

/** Prägnanz, kompleks form reduceres til enkel hexagon */
function Praegnanz({ className }: IllProps) {
  return (
    <Frame className={className}>
      {/* Kompleks form */}
      <polygon
        points="80,60 130,70 110,110 140,140 100,170 60,150 70,100"
        fill="none"
        stroke={C.fg}
        strokeWidth="3"
      />
      <line x1="80" y1="60" x2="140" y2="140" stroke={C.fg} strokeWidth="2" />
      <line x1="60" y1="150" x2="130" y2="70" stroke={C.fg} strokeWidth="2" />
      <line x1="100" y1="170" x2="70" y2="100" stroke={C.fg} strokeWidth="2" />
      {/* Pil */}
      <line x1="180" y1="120" x2="230" y2="120" stroke={C.fg} strokeWidth="3" strokeLinecap="round" />
      <path d="M224 113 L236 120 L224 127 Z" fill={C.fg} />
      {/* Enkel hexagon */}
      <polygon
        points="320,60 360,90 360,150 320,180 280,150 280,90"
        fill={C.fg}
      />
    </Frame>
  );
}

/** Lighedsloven, fremhævede prikker danner et "S"-mønster blandt dæmpede */
function Lighedsloven({ className }: IllProps) {
  // S-formet pattern indenfor 5x7 grid
  const highlights = new Set([
    "0-1","0-2","0-3","0-4",
    "1-1",
    "2-2","2-3","2-4",
    "3-5",
    "4-1","4-2","4-3","4-4",
  ]);
  return (
    <Frame className={className}>
      {Array.from({ length: 5 }).map((_, r) =>
        Array.from({ length: 7 }).map((_, c) => {
          const cx = 90 + c * 36;
          const cy = 50 + r * 35;
          const isHi = highlights.has(`${r}-${c}`);
          return (
            <circle
              key={`${r}-${c}`}
              cx={cx}
              cy={cy}
              r="9"
              fill={C.fg}
              opacity={isHi ? 1 : 0.2}
            />
          );
        }),
      )}
    </Frame>
  );
}

/** Ensartet forbindelse, prikker forbundet via koncentriske ring-baner */
function EnsartetForbindelse({ className }: IllProps) {
  return (
    <Frame className={className}>
      <circle cx="200" cy="120" r="80" fill="none" stroke={C.fg} strokeWidth="1.5" />
      <circle cx="200" cy="120" r="50" fill="none" stroke={C.fg} strokeWidth="1.5" />
      <circle cx="200" cy="120" r="22" fill="none" stroke={C.fg} strokeWidth="1.5" />
      {/* Prikker på ydre ring */}
      <circle cx="120" cy="120" r="7" fill={C.fg} />
      <circle cx="280" cy="120" r="7" fill={C.fg} />
      <circle cx="200" cy="40" r="7" fill={C.fg} />
      <circle cx="200" cy="200" r="7" fill={C.fg} />
      {/* Mellem ring */}
      <circle cx="234" cy="83" r="6" fill={C.fg} />
      <circle cx="166" cy="157" r="6" fill={C.fg} />
      {/* Inder ring */}
      <circle cx="222" cy="120" r="5" fill={C.fg} />
      <circle cx="200" cy="120" r="4" fill={C.fg} />
    </Frame>
  );
}

/** Von Restorff, grid af firkanter, én cirkel skiller sig ud */
function VonRestorff({ className }: IllProps) {
  return (
    <Frame className={className}>
      {Array.from({ length: 4 }).map((_, r) =>
        Array.from({ length: 5 }).map((_, c) => {
          const x = 110 + c * 36;
          const y = 50 + r * 36;
          const isHi = r === 2 && c === 2;
          if (isHi) {
            return <circle key={`${r}-${c}`} cx={x + 12} cy={y + 12} r="14" fill={C.fg} />;
          }
          return (
            <rect
              key={`${r}-${c}`}
              x={x}
              y={y}
              width="24"
              height="24"
              fill={C.fg}
              opacity="0.2"
            />
          );
        }),
      )}
    </Frame>
  );
}

// ----- Kognition -----

/** Kognitive bias, forskudte ringe omkring central prik (forvrænget perception) */
function KognitiveBias({ className }: IllProps) {
  return (
    <Frame className={className}>
      <ellipse cx="200" cy="120" rx="120" ry="60" fill="none" stroke={C.fg} strokeWidth="2" />
      <ellipse cx="200" cy="120" rx="100" ry="80" fill="none" stroke={C.fg} strokeWidth="2" />
      <ellipse cx="200" cy="120" rx="80" ry="55" fill="none" stroke={C.fg} strokeWidth="2" />
      <circle cx="200" cy="120" r="14" fill={C.fg} />
    </Frame>
  );
}

/** Kognitiv belastning, lodrette bjælker, halvdelen fyldt */
function KognitivBelastning({ className }: IllProps) {
  return (
    <Frame className={className}>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const x = 100 + i * 26;
        const filled = i < 3;
        return filled ? (
          <rect key={i} x={x} y="50" width="16" height="140" fill={C.fg} />
        ) : (
          <rect
            key={i}
            x={x}
            y="50"
            width="16"
            height="140"
            fill="none"
            stroke={C.fg}
            strokeWidth="2"
          />
        );
      })}
    </Frame>
  );
}

/** Hicks' lov, grid af valg-prikker med beslutningspunkt i centrum */
function HicksLov({ className }: IllProps) {
  const bg = useBg();
  const cols = 9;
  const rows = 5;
  const xStep = 32;
  const yStep = 32;
  const xStart = 200 - ((cols - 1) * xStep) / 2;
  const yStart = 120 - ((rows - 1) * yStep) / 2;
  return (
    <Frame className={className}>
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => {
          // Skjul prikker hvor det centrale beslutningspunkt sidder
          const inHub = r >= 1 && r <= 3 && c >= 3 && c <= 5;
          if (inHub) return null;
          return (
            <circle
              key={`${r}-${c}`}
              cx={xStart + c * xStep}
              cy={yStart + r * yStep}
              r="7"
              fill={C.fg}
            />
          );
        }),
      )}
      <rect x="170" y="90" width="60" height="60" fill={C.fg} />
      <rect x="186" y="106" width="28" height="28" fill={bg} />
      <rect x="196" y="116" width="8" height="8" fill={C.fg} />
    </Frame>
  );
}

/** Mental model, isometrisk wireframe-kube (komprimeret repræsentation) */
function MentalModel({ className }: IllProps) {
  // Isometriske hjørnepunkter
  const top = { x: 200, y: 50 };
  const bot = { x: 200, y: 190 };
  const upL = { x: 140, y: 85 };
  const upR = { x: 260, y: 85 };
  const dnL = { x: 140, y: 155 };
  const dnR = { x: 260, y: 155 };
  const mid = { x: 200, y: 120 };
  const pts = [top, upR, dnR, bot, dnL, upL, mid];
  return (
    <Frame className={className}>
      {/* Kanter */}
      {[
        [top, upL], [top, upR], [top, mid],
        [upL, dnL], [upR, dnR], [upL, mid], [upR, mid],
        [bot, dnL], [bot, dnR], [bot, mid],
        [dnL, mid], [dnR, mid],
      ].map(([a, b], i) => (
        <line
          key={i}
          x1={a.x}
          y1={a.y}
          x2={b.x}
          y2={b.y}
          stroke={C.fg}
          strokeWidth="2"
        />
      ))}
      {/* Hjørneprikker */}
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="7" fill={C.fg} />
      ))}
    </Frame>
  );
}

/** Occams ragekniv, 2x2 grid hvor 3 felter er kaotiske, ét er rent */
function OccamsRagekniv({ className }: IllProps) {
  const bg = useBg();
  const cells = [
    { x: 130, y: 50 },
    { x: 220, y: 50 },
    { x: 130, y: 130 },
  ];
  return (
    <Frame className={className}>
      {cells.map((c, i) => (
        <g key={i}>
          <rect x={c.x} y={c.y} width="60" height="60" fill="none" stroke={C.fg} strokeWidth="2" />
          <circle cx={c.x + 18} cy={c.y + 18} r="14" fill="none" stroke={C.fg} strokeWidth="1.5" opacity="0.5" />
          <circle cx={c.x + 36} cy={c.y + 30} r="14" fill="none" stroke={C.fg} strokeWidth="1.5" opacity="0.5" />
          <circle cx={c.x + 24} cy={c.y + 42} r="14" fill="none" stroke={C.fg} strokeWidth="1.5" opacity="0.5" />
        </g>
      ))}
      <rect x="220" y="130" width="60" height="60" fill={C.fg} />
      <circle cx="250" cy="160" r="18" fill={bg} />
    </Frame>
  );
}

/** Teslers lov, hexagon med alle diagonaler (kompleksitet kan ikke fjernes) */
function TeslersLov({ className }: IllProps) {
  const pts = [
    { x: 200, y: 40 },
    { x: 290, y: 90 },
    { x: 290, y: 150 },
    { x: 200, y: 200 },
    { x: 110, y: 150 },
    { x: 110, y: 90 },
  ];
  return (
    <Frame className={className}>
      {/* Alle diagonaler */}
      {pts.map((a, i) =>
        pts.slice(i + 1).map((b, j) => (
          <line
            key={`${i}-${j}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke={C.fg}
            strokeWidth="2"
          />
        )),
      )}
      {/* Hjørner */}
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill={C.fg} />
      ))}
    </Frame>
  );
}

/** Valg-overload, checkerboard af fyldte/outline prikker (alle konkurrerer) */
function ValgOverload({ className }: IllProps) {
  return (
    <Frame className={className}>
      {Array.from({ length: 5 }).map((_, r) =>
        Array.from({ length: 9 }).map((_, c) => {
          const filled = (r + c) % 2 === 0;
          const cx = 50 + c * 40;
          const cy = 40 + r * 40;
          return filled ? (
            <circle key={`${r}-${c}`} cx={cx} cy={cy} r="11" fill={C.fg} />
          ) : (
            <circle
              key={`${r}-${c}`}
              cx={cx}
              cy={cy}
              r="11"
              fill="none"
              stroke={C.fg}
              strokeWidth="2"
            />
          );
        }),
      )}
    </Frame>
  );
}

// ----- Hukommelse -----

/** Chunking, én lang række brudt op i 3 grupper */
function Chunking({ className }: IllProps) {
  return (
    <Frame className={className}>
      {[80, 100, 120, 180, 200, 220, 280, 300, 320].map((cx, i) => (
        <circle key={i} cx={cx} cy={120} r="10" fill={C.fg} />
      ))}
    </Frame>
  );
}

/** Millers lov, 7 fremhævede prikker i en grid (7±2 arbejdshukommelse) */
function MillersLov({ className }: IllProps) {
  return (
    <Frame className={className}>
      {Array.from({ length: 5 }).map((_, r) =>
        Array.from({ length: 9 }).map((_, c) => {
          const cx = 50 + c * 40;
          const cy = 40 + r * 40;
          const isHi = r === 2 && c >= 1 && c <= 7;
          return (
            <circle
              key={`${r}-${c}`}
              cx={cx}
              cy={cy}
              r="11"
              fill={C.fg}
              opacity={isHi ? 1 : 0.2}
            />
          );
        }),
      )}
    </Frame>
  );
}

/** Peak-end-reglen, kurve med peak i midten og høj ende */
function PeakEnd({ className }: IllProps) {
  return (
    <Frame className={className}>
      <polyline
        points="50,180 100,160 150,150 200,60 250,140 300,130 350,80"
        fill="none"
        stroke={C.fg}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="200" cy="60" r="9" fill={C.fg} />
      <circle cx="350" cy="80" r="9" fill={C.fg} />
    </Frame>
  );
}

/** Serielle positions-effekt, første og sidste fremhævet */
function SerielPosition({ className }: IllProps) {
  return (
    <Frame className={className}>
      {[60, 110, 160, 200, 240, 290, 340].map((cx, i, arr) => {
        const isEdge = i === 0 || i === arr.length - 1;
        return (
          <circle key={i} cx={cx} cy={120} r={isEdge ? 22 : 11} fill={C.fg} />
        );
      })}
    </Frame>
  );
}

/** Von Restorff, defined above */

/** Arbejdshukommelse, 3x3 grid af cirkler, fader mod bunden (info forsvinder) */
function Arbejdshukommelse({ className }: IllProps) {
  return (
    <Frame className={className}>
      {Array.from({ length: 3 }).map((_, r) =>
        Array.from({ length: 3 }).map((_, c) => (
          <circle
            key={`${r}-${c}`}
            cx={140 + c * 60}
            cy={70 + r * 50}
            r="20"
            fill={C.fg}
            opacity={1 - r * 0.35}
          />
        )),
      )}
    </Frame>
  );
}

/** Zeigarnik, fremdriftsbar halvt fyldt */
function Zeigarnik({ className }: IllProps) {
  return (
    <Frame className={className}>
      <rect x="60" y="105" width="280" height="30" rx="15" fill="none" stroke={C.fg} strokeWidth="3" />
      <rect x="60" y="105" width="170" height="30" rx="15" fill={C.fg} />
    </Frame>
  );
}

// ----- Opmærksomhed -----

/** Mål-gradient-effekten, stablede bjælker, accelererer mod målet */
function MaalGradient({ className }: IllProps) {
  return (
    <Frame className={className}>
      {[
        { y: 200, filled: false },
        { y: 170, filled: false },
        { y: 140, filled: false },
        { y: 110, filled: true },
        { y: 80, filled: true },
        { y: 50, filled: true },
      ].map((b, i) =>
        b.filled ? (
          <rect key={i} x="140" y={b.y - 10} width="120" height="20" fill={C.fg} />
        ) : (
          <rect
            key={i}
            x="140"
            y={b.y - 10}
            width="120"
            height="20"
            fill="none"
            stroke={C.fg}
            strokeWidth="2"
          />
        ),
      )}
    </Frame>
  );
}

/** Selektiv opmærksomhed, én markant blandt mange svage */
function SelektivOpmaerksomhed({ className }: IllProps) {
  return (
    <Frame className={className}>
      {Array.from({ length: 5 }).map((_, r) =>
        Array.from({ length: 9 }).map((_, c) => {
          const isHi = r === 2 && c === 4;
          const cx = 50 + c * 40;
          const cy = 40 + r * 40;
          return isHi ? (
            <circle key={`${r}-${c}`} cx={cx} cy={cy} r="20" fill={C.fg} />
          ) : (
            <circle key={`${r}-${c}`} cx={cx} cy={cy} r="5" fill={C.fg} opacity="0.25" />
          );
        }),
      )}
    </Frame>
  );
}

// ----- Adfærd -----

/** Doherty-grænsen, koncentriske ringe (hurtig feedback-loop) */
function Doherty({ className }: IllProps) {
  return (
    <Frame className={className}>
      <circle cx="200" cy="120" r="92" fill="none" stroke={C.fg} strokeWidth="3" />
      <circle cx="200" cy="120" r="66" fill="none" stroke={C.fg} strokeWidth="3" />
      <circle cx="200" cy="120" r="40" fill="none" stroke={C.fg} strokeWidth="3" />
      <circle cx="200" cy="120" r="12" fill={C.fg} />
    </Frame>
  );
}

/** Fitts' lov, stort mål */
function FittsLov({ className }: IllProps) {
  const bg = useBg();
  return (
    <Frame className={className}>
      <circle cx="200" cy="120" r="92" fill={C.fg} />
      <circle cx="200" cy="120" r="60" fill={bg} />
      <circle cx="200" cy="120" r="28" fill={C.fg} />
    </Frame>
  );
}

/** Flow, koncentriske kvadrater (zoom-in, fuld fordybelse) */
function Flow({ className }: IllProps) {
  return (
    <Frame className={className}>
      {[100, 80, 60, 40, 22].map((r, i) => (
        <rect
          key={i}
          x={200 - r}
          y={120 - r}
          width={r * 2}
          height={r * 2}
          fill={i === 4 ? C.fg : "none"}
          stroke={C.fg}
          strokeWidth="2"
        />
      ))}
    </Frame>
  );
}

/** Jakobs lov, to overlappende kvadrat-outlines (genkendelighed) */
function JakobsLov({ className }: IllProps) {
  return (
    <Frame className={className}>
      <rect x="120" y="50" width="130" height="130" fill="none" stroke={C.fg} strokeWidth="4" />
      <rect x="170" y="80" width="130" height="130" fill="none" stroke={C.fg} strokeWidth="4" />
    </Frame>
  );
}

/** Aktiv brugers paradoks, menneske springer over manualen med lange ben */
function AktivBrugerParadoks({ className }: IllProps) {
  return (
    <Frame className={className}>
      {/* Manual nederst */}
      <rect x="140" y="175" width="120" height="40" fill="none" stroke={C.fg} strokeWidth="2.5" />
      <line x1="155" y1="190" x2="245" y2="190" stroke={C.fg} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="155" y1="203" x2="225" y2="203" stroke={C.fg} strokeWidth="2.5" strokeLinecap="round" />

      {/* Bevægelses-linjer bag figuren */}
      <line x1="55" y1="120" x2="80" y2="115" stroke={C.fg} strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
      <line x1="50" y1="140" x2="75" y2="135" stroke={C.fg} strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />

      {/* Hoved */}
      <circle cx="170" cy="55" r="14" fill={C.fg} />
      {/* Krop, lænet fremad */}
      <line x1="178" y1="68" x2="210" y2="125" stroke={C.fg} strokeWidth="5" strokeLinecap="round" />
      {/* Front-arm strakt frem */}
      <line x1="190" y1="85" x2="260" y2="75" stroke={C.fg} strokeWidth="5" strokeLinecap="round" />
      {/* Bag-arm trækker bagud */}
      <line x1="184" y1="80" x2="135" y2="95" stroke={C.fg} strokeWidth="5" strokeLinecap="round" />
      {/* Front-ben, langt og strakt fremad */}
      <line x1="210" y1="125" x2="305" y2="155" stroke={C.fg} strokeWidth="6" strokeLinecap="round" />
      {/* Bag-ben, langt og strakt bagud */}
      <line x1="210" y1="125" x2="110" y2="155" stroke={C.fg} strokeWidth="6" strokeLinecap="round" />
    </Frame>
  );
}

/** Pareto, 80/20 bjælker */
function ParetoPrincippet({ className }: IllProps) {
  return (
    <Frame className={className}>
      <rect x="60" y="60" width="220" height="40" fill={C.fg} />
      <rect x="60" y="120" width="60" height="40" fill={C.fg} />
      <rect x="60" y="180" width="2" height="2" fill={C.fg} />
    </Frame>
  );
}

/** Parkinsons lov, diamant med pile udad (opgaven udvider sig) */
function ParkinsonsLov({ className }: IllProps) {
  return (
    <Frame className={className}>
      <polygon
        points="200,40 320,120 200,200 80,120"
        fill="none"
        stroke={C.fg}
        strokeWidth="4"
      />
      {/* Pile i hjørnerne pegende udad */}
      <g stroke={C.fg} strokeWidth="3" strokeLinecap="round" fill="none">
        <line x1="200" y1="40" x2="200" y2="20" />
        <polyline points="190,30 200,20 210,30" />
        <line x1="320" y1="120" x2="345" y2="120" />
        <polyline points="335,110 345,120 335,130" />
        <line x1="200" y1="200" x2="200" y2="220" />
        <polyline points="190,210 200,220 210,210" />
        <line x1="80" y1="120" x2="55" y2="120" />
        <polyline points="65,110 55,120 65,130" />
      </g>
    </Frame>
  );
}

/** Postels lov, pyramide af trekanter (bred input, smal output) */
function PostelsLov({ className }: IllProps) {
  // 4 rækker, antal trekanter falder fra 4 til 1
  const rows = [
    { count: 4, y: 50, w: 60, h: 35 },
    { count: 3, y: 88, w: 60, h: 35 },
    { count: 2, y: 126, w: 60, h: 35 },
    { count: 1, y: 164, w: 60, h: 35 },
  ];
  return (
    <Frame className={className}>
      {rows.map((row, ri) => {
        const totalW = row.count * row.w;
        const startX = 200 - totalW / 2;
        return Array.from({ length: row.count }).map((_, ci) => {
          const x = startX + ci * row.w;
          return (
            <polygon
              key={`${ri}-${ci}`}
              points={`${x},${row.y + row.h} ${x + row.w / 2},${row.y} ${x + row.w},${row.y + row.h}`}
              fill={C.fg}
            />
          );
        });
      })}
    </Frame>
  );
}

// ----- map -----

// Record<PrincipleSlug...>, TypeScript håndhæver at HVER slug fra
// PRINCIPLE_SLUGS findes her. Tilføjer du en ny slug, fejler kompilering
// indtil du har tilføjet en illustration.
const map: Record<PrincipleSlug, (p: IllProps) => React.JSX.Element> = {
  // Perception
  "aestetik-usability-effekten": AestetikUsability,
  "loven-om-faelles-omraade": FaellesOmraade,
  naerhedsloven: Naerhedsloven,
  praegnanz: Praegnanz,
  lighedsloven: Lighedsloven,
  "ensartet-forbindelse": EnsartetForbindelse,
  "von-restorff": VonRestorff,
  // Kognition
  "kognitive-bias": KognitiveBias,
  "kognitiv-belastning": KognitivBelastning,
  "hicks-lov": HicksLov,
  "mental-model": MentalModel,
  "occams-ragekniv": OccamsRagekniv,
  "teslers-lov": TeslersLov,
  "valg-overload": ValgOverload,
  // Hukommelse
  chunking: Chunking,
  "millers-lov": MillersLov,
  "peak-end-reglen": PeakEnd,
  "seriel-position": SerielPosition,
  arbejdshukommelse: Arbejdshukommelse,
  "zeigarnik-effekten": Zeigarnik,
  // Opmærksomhed
  "maal-gradient-effekten": MaalGradient,
  "selektiv-opmaerksomhed": SelektivOpmaerksomhed,
  // Adfærd
  "doherty-graensen": Doherty,
  "fitts-lov": FittsLov,
  flow: Flow,
  "jakobs-lov": JakobsLov,
  "aktiv-bruger-paradoks": AktivBrugerParadoks,
  "pareto-princippet": ParetoPrincippet,
  "parkinsons-lov": ParkinsonsLov,
  "postels-lov": PostelsLov,
};

export function PrincipleIllustration({
  slug,
  className,
  bg = "#f5f5f0",
}: {
  slug: string;
  className?: string;
  bg?: string;
}) {
  const Component = map[slug as PrincipleSlug];
  if (!Component) return null;
  return (
    <BgContext.Provider value={bg}>
      <Component className={className} />
    </BgContext.Provider>
  );
}

export function hasIllustration(slug: string) {
  return slug in map;
}
