type Phase = {
  n: number;
  title: string;
  tier: string;
  desc: string;
  accent: string;
};

const phases: Phase[] = [
  {
    n: 1,
    title: "Teknisk fundament",
    tier: "Fundamentet",
    desc: "Kan Google finde, læse og indeksere siderne: sitemap, canonical, ingen utilsigtet blokering, hastighed, mobil. Uden det virker resten ikke.",
    accent: "bg-amber-500/10 text-amber-600",
  },
  {
    n: 2,
    title: "On-page på siderne",
    tier: "Mest kontrol",
    desc: "Hver side rammer ét klart søgeord i titel, overskrifter og tekst, og siderne linker internt til hinanden. Her får du mest for indsatsen, fordi du styrer det 100% selv.",
    accent: "bg-blue-500/10 text-blue-600",
  },
  {
    n: 3,
    title: "Indhold der svarer på spørgsmål",
    tier: "Størst løft",
    desc: "Guides og artikler der besvarer det, folk faktisk søger på. Åbner søgninger, som ydelsessider aldrig rammer, og er oftest den største kilde til ny trafik.",
    accent: "bg-emerald-500/10 text-emerald-600",
  },
  {
    n: 4,
    title: "Autoritet udefra",
    tier: "Forstærker",
    desc: "Når andre troværdige sites linker til jer, rangerer alt lettere. Langsommere og delvist uden for din kontrol, så det kommer efter der er stærkt indhold at pege på.",
    accent: "bg-purple-500/10 text-purple-600",
  },
];

export default function ApproachLadder() {
  return (
    <div className="mb-10 rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] p-6">
      <h3 className="text-lg font-bold tracking-tight">Sådan prioriterer vi SEO</h3>
      <p className="mt-1 text-sm text-foreground/60">
        Byg indefra og ud: fra det du styrer selv (dine egne sider) til det du ikke styrer (at andre
        linker til dig). Trinene bygger på hinanden, så tag dem i rækkefølge.
      </p>

      <ol className="mt-6 space-y-3">
        {phases.map((p) => (
          <li
            key={p.n}
            className="flex items-start gap-4 rounded-xl border border-foreground/[0.08] bg-background p-4"
          >
            <span
              className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${p.accent}`}
            >
              {p.n}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-base font-semibold">{p.title}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${p.accent}`}>
                  {p.tier}
                </span>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-foreground/60">{p.desc}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-3 rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-foreground/50">
          Hele vejen igennem
        </p>
        <p className="mt-1 text-sm text-foreground/70">
          Billeder, hastighed og alt-tekst løbende. Claim jeres profiler på Google Business og Bing.
        </p>
      </div>
    </div>
  );
}
