/**
 * Delte byggeklodser til dashboardets faner. Flyttet uændret ud af page.tsx,
 * så flere faner kan bruge præcis de samme kort.
 */

export function MetricCard({
  label,
  value,
  unit,
  status,
  hint,
  delta,
}: {
  label: string;
  value: string | number;
  unit?: string;
  status: "good" | "neutral" | "warning";
  hint?: string;
  delta?: {
    text: string;
    direction: "up" | "down";
    tone: "good" | "bad" | "warn";
  };
}) {
  const statusColor = {
    good: "text-emerald-600",
    neutral: "text-foreground/60",
    warning: "text-amber-600",
  }[status];

  const dotColor = {
    good: "bg-emerald-500",
    neutral: "bg-foreground/30",
    warning: "bg-amber-500",
  }[status];

  const deltaTone = {
    good: "text-emerald-600 bg-emerald-500/10",
    bad: "text-red-600 bg-red-500/10",
    warn: "text-amber-600 bg-amber-500/10",
  }[delta?.tone ?? "warn"];

  return (
    <div className="rounded-2xl border border-foreground/[0.08] bg-background p-6">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-[0.15em] text-foreground/50">
          {label}
        </span>
        <div className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-4xl font-bold tracking-tight">{value}</span>
        {unit && <span className="text-sm text-foreground/50">{unit}</span>}
        {delta && (
          <span
            className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium tabular-nums ${deltaTone}`}
          >
            {delta.direction === "up" ? "↑" : "↓"}
            {delta.text}
          </span>
        )}
      </div>
      {hint && <p className={`mt-2 text-xs ${statusColor}`}>{hint}</p>}
    </div>
  );
}

export function SectionHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      {description && (
        <p className="mt-1 text-sm text-foreground/60">{description}</p>
      )}
    </div>
  );
}
