"use client";

import { useEffect, useState } from "react";
import { ClockIcon } from "lucide-react";

interface CountdownProps {
  /** ISO-dato i format "YYYY-MM-DD". Tæller ned til 00:00 på den dato. */
  targetDate: string;
  /** Hvad opdateringen drejer sig om (vises som label). */
  label?: string;
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-foreground/[0.08] bg-background px-3 py-2 min-w-[64px]">
      <span className="text-2xl font-bold tabular-nums leading-none">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-1 text-[10px] uppercase tracking-wider text-foreground/50">
        {label}
      </span>
    </div>
  );
}

export default function Countdown({ targetDate, label = "Næste opdatering" }: CountdownProps) {
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Server-side eller før hydration: vis statisk placeholder så vi undgår hydration-mismatch
  if (!mounted) {
    return (
      <div className="rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-foreground/50">
          <ClockIcon className="size-3.5" />
          {label}
        </div>
        <p className="mt-2 text-sm text-foreground/60">
          {formatTargetDate(targetDate)}
        </p>
      </div>
    );
  }

  const target = new Date(targetDate + "T00:00:00").getTime();
  const diff = target - now;

  // Forløbet: vis "tid til opdatering"-besked
  if (diff <= 0) {
    return (
      <div className="rounded-2xl border border-emerald-300 bg-emerald-50/50 p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700">
          <ClockIcon className="size-3.5" />
          Tid til opdatering
        </div>
        <p className="mt-2 text-sm text-emerald-900">
          Datoen {formatTargetDate(targetDate)} er passeret. Det er nu tid til at opdatere denne side.
        </p>
      </div>
    );
  }

  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1_000);

  // Farve-kodning baseret på hvor tæt vi er på datoen
  const isUrgent = days < 3; // <3 dage = rød
  const isSoon = days < 14; // <14 dage = gul

  const borderColor = isUrgent
    ? "border-red-300"
    : isSoon
    ? "border-amber-300"
    : "border-foreground/[0.08]";
  const bgColor = isUrgent
    ? "bg-red-50/40"
    : isSoon
    ? "bg-amber-50/40"
    : "bg-foreground/[0.02]";
  const labelColor = isUrgent
    ? "text-red-700"
    : isSoon
    ? "text-amber-700"
    : "text-foreground/50";

  return (
    <div className={`rounded-2xl border ${borderColor} ${bgColor} p-5`}>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider ${labelColor}`}>
          <ClockIcon className="size-3.5" />
          {label}
        </div>
        <span className="text-xs text-foreground/50">
          {formatTargetDate(targetDate)}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        <Unit value={days} label="dage" />
        <Unit value={hours} label="timer" />
        <Unit value={minutes} label="min" />
        <Unit value={seconds} label="sek" />
      </div>
    </div>
  );
}

function formatTargetDate(date: string): string {
  const d = new Date(date + "T00:00:00");
  return d.toLocaleDateString("da-DK", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
