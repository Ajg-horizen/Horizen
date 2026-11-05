import DashboardTabs from "./DashboardTabs";
import type { SeoMapArea } from "./data";

const num = (i: number) => String(i + 1).padStart(2, "0");

/** Hele SEO-faget: én fane pr. disciplin med dens underpunkter. */
export default function SeoMapTab({
  intro,
  areas,
}: {
  intro: string;
  areas: SeoMapArea[];
}) {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight">SEO-oversigt</h2>
        <p className="text-foreground/60 mt-1 max-w-3xl text-sm leading-relaxed">
          {intro} Vælg en disciplin for at se dens punkter.
        </p>
      </div>

      <DashboardTabs
        variant="pill"
        syncKey="so"
        tabs={areas.map((area, i) => ({
          id: String(i + 1),
          label: `${num(i)} ${area.title}`,
          content: (
            <section className="border-foreground/[0.08] rounded-2xl border bg-white p-6 md:p-8">
              <div className="flex items-baseline gap-3">
                <span className="text-foreground/30 text-sm font-medium tabular-nums">
                  {num(i)}
                </span>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight">
                    {area.title}
                  </h3>
                  {area.en !== area.title && (
                    <p className="text-foreground/40 text-xs">{area.en}</p>
                  )}
                </div>
              </div>
              <p className="text-foreground/60 mt-3 max-w-3xl text-sm leading-relaxed">
                {area.summary}
              </p>
              <ul className="mt-6 grid gap-3 md:grid-cols-2">
                {area.items.map((item) => (
                  <li
                    key={item.name}
                    className="border-foreground/[0.06] rounded-xl border p-4 text-sm leading-relaxed"
                  >
                    <p className="font-medium">{item.name}</p>
                    <p className="text-foreground/60 mt-1">{item.text}</p>
                    {item.see && (
                      <p className="text-foreground/40 mt-2 text-xs">
                        → {item.see}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ),
        }))}
      />
    </div>
  );
}
