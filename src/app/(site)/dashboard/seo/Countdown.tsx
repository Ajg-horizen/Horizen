"use client";

import { useEffect, useState } from "react";
import { ClockIcon } from "lucide-react";

interface CountdownProps {
  /** ISO-dato i format "YYYY-MM-DD". Tæller ned til 00:00 på den dato. */
  targetDate: string;
}

function formatTimeLeft(diffMs: number): string {
  const days = Math.floor(diffMs / 86_400_000);
  const hours = Math.floor((diffMs % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diffMs % 3_600_000) / 60_000);

  if (days > 7) return `Om ${days} dage`;
  if (days >= 1) return `Om ${days}d ${hours}t`;
  if (hours >= 1) return `Om ${hours}t ${minutes}m`;
  return `Om ${minutes}m`;
}

export default function Countdown({ targetDate }: CountdownProps) {
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    setMounted(true);
    // Opdater hvert minut (vi viser ikke sekunder så det er rigeligt)
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  if (!mounted) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-foreground/[0.08] bg-foreground/[0.04] px-2.5 py-0.5 text-xs font-medium text-foreground/60">
        <ClockIcon className="size-3" />
        Næste opdatering
      </span>
    );
  }

  const target = new Date(targetDate + "T00:00:00").getTime();
  const diff = target - now;

  // Forløbet
  if (diff <= 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
        <ClockIcon className="size-3" />
        Klar til opdatering
      </span>
    );
  }

  const days = Math.floor(diff / 86_400_000);
  const isUrgent = days < 3;
  const isSoon = days < 14;

  const color = isUrgent
    ? "border-red-200 bg-red-50 text-red-700"
    : isSoon
    ? "border-amber-200 bg-amber-50 text-amber-700"
    : "border-foreground/[0.08] bg-foreground/[0.04] text-foreground/70";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${color}`}
      title={`Næste opdatering: ${formatTargetDate(targetDate)}`}
    >
      <ClockIcon className="size-3" />
      {formatTimeLeft(diff)}
    </span>
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
