"use client";

import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Lille kodevindue, hvor koden bliver skrevet ud tegn for tegn.
 * Starter, når `run` bliver > 0, og skriver forfra, hver gang `run` skifter.
 * Ved "reducér bevægelse" vises hele koden med det samme.
 *
 * Farver følger Horizens egne mørke blokke: hvid tekst, grøn #00b67a
 * og guld #c9a227 som accenter (samme som TechChecklistBlock).
 */

export type CodeTokenKind =
  "plain" | "key" | "str" | "com" | "tag" | "ok" | "dim";
export type CodeLine = [string, CodeTokenKind?][];

const COLOR: Record<CodeTokenKind, string> = {
  plain: "text-white/85",
  key: "text-[#c9a227]",
  str: "text-[#00b67a]",
  com: "text-white/35",
  tag: "text-white",
  ok: "text-[#00b67a] font-semibold",
  dim: "text-white/45",
};

const SPEED_MS = 16;

export default function CodeTyper({
  file,
  lines,
  run,
  bare = false,
}: {
  file: string;
  lines: CodeLine[];
  run: number;
  /** Uden egen ramme og vinduesbjælke (når den ligger i et andet vindue). */
  bare?: boolean;
}) {
  const reduce = useReducedMotion();
  const total = useMemo(
    () =>
      lines.reduce((n, l) => n + l.reduce((m, [t]) => m + t.length, 0) + 1, 0),
    [lines],
  );
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (!run || reduce) return;
    let n = 0;
    const id = window.setInterval(() => {
      n += 2;
      setTyped(Math.min(n, total));
      if (n >= total) window.clearInterval(id);
    }, SPEED_MS);
    return () => window.clearInterval(id);
  }, [run, reduce, total]);

  const shown = reduce ? total : run ? typed : 0;
  const typing = !reduce && run > 0 && shown < total;

  // Fordel de viste tegn ud over linjerne og tokens (ren beregning, ingen mutation i callbacks).
  const rendered: {
    parts: { text: string; kind: CodeTokenKind }[];
    visible: boolean;
  }[] = [];
  let left = shown;
  for (const line of lines) {
    const parts: { text: string; kind: CodeTokenKind }[] = [];
    for (const [text, kind = "plain"] of line) {
      if (left <= 0) break;
      const take = Math.min(text.length, left);
      parts.push({ text: text.slice(0, take), kind });
      left -= take;
    }
    rendered.push({ parts, visible: left > 0 || parts.length > 0 });
    left -= 1; // linjeskift
  }
  let cursorLine = 0;
  for (let i = 0; i < rendered.length; i++)
    if (rendered[i].visible) cursorLine = i;

  return (
    <div
      className={
        bare
          ? "flex h-full flex-col"
          : "flex h-full flex-col overflow-hidden rounded-xl border border-white/[0.06] bg-[#0f0f0f]"
      }
    >
      {bare ? (
        <span className="mb-1 block font-mono text-[9px] tracking-wide text-white/40">
          {file}
        </span>
      ) : (
        <div className="flex items-center gap-1.5 border-b border-white/[0.06] px-3 py-2">
          <span className="size-2 rounded-full bg-white/15" />
          <span className="size-2 rounded-full bg-white/15" />
          <span className="size-2 rounded-full bg-white/15" />
          <span className="ml-2 font-mono text-[10px] text-white/40">
            {file}
          </span>
        </div>
      )}
      <pre
        className={`flex-1 overflow-hidden font-mono leading-[1.7] ${bare ? "text-[10px]" : "px-3 py-2.5 text-[11.5px]"}`}
        aria-label={`Kodeeksempel: ${file}`}
      >
        {lines.map((_, i) => {
          const l = rendered[i];
          return (
            <div key={i} className="flex whitespace-pre">
              <span className="w-5 shrink-0 text-right text-white/20 select-none">
                {i + 1}
              </span>
              <span className="ml-3">
                {l.parts.map((p, j) => (
                  <span key={j} className={COLOR[p.kind]}>
                    {p.text}
                  </span>
                ))}
                {typing && i === cursorLine && (
                  <span className="ml-px inline-block h-3.5 w-[6px] translate-y-[2px] animate-pulse bg-[#00b67a]" />
                )}
              </span>
            </div>
          );
        })}
      </pre>
    </div>
  );
}
