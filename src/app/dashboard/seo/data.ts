/**
 * SEO Dashboard Data — Horizen
 *
 * Denne fil opdateres ved hver SEO-ændring så dashboardet altid afspejler
 * status. Når Claude laver SEO-arbejde skal denne fil OPDATERES sammen
 * med MD-filerne i ~/Desktop/Claude Workflows/01-Kunder/Horizen/SEO/.
 */

export const lastUpdated = "2026-07-22";
export const dataAsOf = "2026-04-21 til 2026-07-20 (3 måneder)"; // GSC-udtræk 22. juli

export const upcomingReviews = [
  {
    date: "2026-08-05",
    title: "Tjek indeksering efter domæneskift",
    description: "Inspicér horizen.dk i Search Console: er www-dubletten på vej ud af Pages-rapporten, og har Google valgt horizen.dk som canonical? 5 min.",
    type: "check" as const,
  },
  {
    date: "2026-08-20",
    title: "Næste måling (28 dage efter kanonisering)",
    description: "Eksportér frisk GSC-data. Renses gennemsnittet efter www-dublet-fix + oprydning i gamle URL'er? Sammenlign med 3-måneders-tallet (pos 20,2).",
    type: "review" as const,
  },
  {
    date: "2026-09-22",
    title: "Strategisk check-in",
    description: "2 måneder efter kanonisering. Vurder om de rene sider løftes, og om bloatet er væk. Beslut næste træk.",
    type: "milestone" as const,
  },
];

export const relaunchData = {
  relaunchDate: "2026-05-08",
  before: {
    label: "Før relancering",
    period: "8. feb - 7. maj 2026 (90 dage)",
    source: "Google Analytics 4 (G-HC4NR97H1P)",
    metrics: {
      activeUsers: 847,
      newUsers: 829,
      avgEngagementSec: 145.5,
      eventCount: 16248,
      organicSessions: 364,
      directSessions: 835,
      keyEvents: 1039,
    },
    topPages: [
      { title: "Digitalt bureau – Aarhus (forsiden)", views: 1102, bounceRate: 25.6 },
      { title: "Digitalt marketingbureau → Horizen", views: 946, bounceRate: 62.5 },
      { title: "Digitalt bureau → Horizen", views: 528, bounceRate: 56.9 },
      { title: "Kontakt", views: 506, bounceRate: 2.1 },
      { title: "Hjemmeside (gammel webudvikling)", views: 248, bounceRate: 2.3 },
      { title: "Digital Design (gammel UI/UX)", views: 232, bounceRate: 7.5 },
      { title: "Branding (gammel)", views: 152, bounceRate: 2.1 },
    ],
    topGeo: [
      { city: "Aarhus", users: 322 },
      { city: "Copenhagen", users: 161 },
      { city: "Amsterdam", users: 33 },
    ],
  },
  after: {
    label: "Efter relancering",
    period: "13. maj - 22. juli 2026 (70 dage)",
    source: "Google Analytics 4",
    metrics: {
      activeUsers: 517,
      newUsers: 506,
      avgEngagementSec: 40.2,
      eventCount: 3594,
      organicSessions: 244,
      directSessions: 219,
      keyEvents: 117,
    },
    topPages: [
      { title: "Forsiden (digital(t) design bureau)", views: 961, bounceRate: 44.6 },
      { title: "Kontakt", views: 111, bounceRate: 2.8 },
      { title: "Webudvikling (Ny hjemmeside)", views: 69, bounceRate: 3.4 },
      { title: "BettrPlans (case)", views: 46, bounceRate: 4.7 },
      { title: "OD Pro (case)", views: 34, bounceRate: 9.7 },
      { title: "WordPress", views: 33, bounceRate: 0 },
      { title: "Tandsundhed (case)", views: 30, bounceRate: 7.4 },
    ],
    topGeo: [
      { city: "Copenhagen", users: 144 },
      { city: "Aarhus", users: 70 },
      { city: "Odense", users: 13 },
    ],
    note: "Bemærk: efter-perioden er 70 dage mod førs 90 — og trafik-mikset er skiftet markant mod Facebook-referral (285+ brugere), som løfter volumen men sænker gennemsnits-engagement.",
  },
  observations: [
    "EFTER (70 dage): Facebook-referral er blevet den største trafikkilde — 285+ førstegangsbrugere fra facebook.com-varianter mod 178 direkte. Ny kanal siden relanceringen, men lav-intent (høj bounce).",
    "EFTER: Google organic holder niveau — 244 sessioner (~3,5/dag), på linje med før-perioden. Det er den sociale trafik der er vokset, ikke den organiske.",
    "EFTER: København har overhalet Aarhus — 144 vs 70 aktive brugere (før var Aarhus størst med 322). Trafik-tyngdepunktet er flyttet østpå.",
    "EFTER: Gennemsnits-engagement 40 sek mod 2:25 før — trækkes ned af Facebook-trafik med lav intent. De rene sider holder stadig: kontakt 2,8% bounce, webudvikling 3,4%.",
    "FØR: Direct + organic dominerer trafikken (835 + 86 førstebesøgende). Brand-genkendelse er hovedkilden.",
    "Forsidens forgænger 'Digitalt bureau – Aarhus' var sitets stærkeste asset: 1.102 views med kun 25,6% bounce.",
    "Kontaktsider havde 2% bounce — folk var allerede klar til at konvertere.",
    "Engagement time gennemsnit: 2 min 25 sek — solid kvalitet på trafikken før relancering.",
    "Aarhus 322 + Copenhagen 161 = 57% af danske brugere fra de to byer.",
  ],
};

export const baseline = {
  period: "Sidste 3 måneder (2026-04-21 til 2026-07-20)",
  source: "Google Search Console",
  metrics: {
    clicks: 68,
    impressions: 3129,
    ctr: 2.17,
    avgPosition: 20.2,
    frontpagePosition: 16.72,
  },
  insight:
    "Snit-positionen ser ud til at falde (8 i april → 25 i juli) og CTR at kollapse (4,4% → 0,7%), men det er ikke fordi sitet er blevet dårligere. Gennemsnittet trækkes ned af to ting: (1) www.horizen.dk indekseres stadig som dublet af forsiden — 1.586 visninger på pos 26 næsten uden klik — og (2) gammelt WordPress-indhold + fem spøgelses-subdomæner (webinsight, estimator, hjemmeside, seo, mysite) høster visninger på lave positioner. De rigtige sider er sunde: kontakt pos 1,9, webudvikling 6,6, ui-ux-design 7,1, blog/ai-webdesign 6,7, brand 'horizen' pos 1,7. Dagens canonical + domæneskift (22. juli) retter www-dubletten; næste skridt er at afindeksere/redirecte de gamle URL'er og subdomæner, så gennemsnittet renses.",
};

export const actionItems = [
  {
    title: "Afindeksér 5 gamle spøgelses-subdomæner",
    description: "webinsight., estimator., hjemmeside., seo. og mysite.horizen.dk hænger stadig i Googles indeks fra det gamle WordPress-site. FUND 22. juli: der er INGEN DNS-records at slette — en wildcard (* ALIAS → Vercel, låst/auto) fanger alle subdomæner og 404'er dem (bekræftet: selv tilfældige subdomæner 404'er). 216.150.x.x = Vercel, ikke gammel host. Rør IKKE wildcarden. HANDLING: kun Search Console → Removals → indsend de 5 subdomæner (præfiks-fjern) for hurtig af-indeksering; 404 rydder resten over tid.",
    priority: "high" as const,
    estimatedTime: "10 min",
  },
  {
    title: "Gamle WordPress-URL'er — verificeret, minimal handling",
    description: "FUND 22. juli: de gamle service-URL'er redirecter korrekt (/digital-design→ui-ux-design, /branding, /hjemmeside→webudvikling, /paid-ads→forsiden). Junk-URL'erne /wereme/, /hyundai/, /arena-randers/, /cookie-policy/ 404'er allerede — Google af-indekserer dem selv, ingen handling nødvendig. Kun /digital-design/ (399 visn) bar reel trafik, og den er redirectet.",
    priority: "low" as const,
    estimatedTime: "0 (verificeret)",
  },
  {
    title: "Bekræft www-dublet forsvinder efter kanonisering",
    description: "www.horizen.dk/ havde 1.586 visninger på pos 26 uden klik (dublet af forsiden). Efter dagens 308-redirect + canonical skal den gradvist forsvinde fra Pages-rapporten. Tjek ved næste måling (20. aug).",
    priority: "medium" as const,
    estimatedTime: "5 min",
  },
  {
    title: "Opret Google Business Profile",
    description: "Kritisk for lokal pack-visning på Aarhus-søgninger.",
    priority: "medium" as const,
    estimatedTime: "30 min",
  },
  {
    title: "Outreach til nicolaisoerensen.dk",
    description: "Komme på 12-bedste-webbureauer-listen. Ranker pos 2 for relaterede keywords.",
    priority: "medium" as const,
    estimatedTime: "1 time",
  },
  {
    title: "Liste Horizen på webbureauer.dk",
    description: "Directory der ranker pos 1 for 'webbureau' i Danmark.",
    priority: "low" as const,
    estimatedTime: "15 min",
  },
];

export type SeoStatus = "done" | "in_progress" | "pending" | "not_applicable";

export type PageActivity = {
  date: string;
  title: string;
  description: string;
  commit?: string;
};

export type PageDetail = {
  name: string;
  url: string;
  built: boolean;
  seoStatus: SeoStatus;
  lastSeoUpdate: string | null;
  /** Dato for hvornår denne side næste gang skal opdateres/reviewes (ISO YYYY-MM-DD). Null = ikke planlagt. */
  nextUpdate: string | null;
  nextStep: string;
  /** Sidens samlede snit-position på tværs af alle queries den ranker på */
  pageAvgPosition: number | null;
  /** Dato for hvornår positions-data sidst blev trukket fra Search Console (ISO YYYY-MM-DD). */
  positionsUpdated: string | null;
  keywords: {
    primary: string | null;
    secondary: string[];
  };
  positions: {
    current: number | null;
    target: number | null;
    impressions28d: number | null;
  };
  completedTasks: string[];
  pendingTasks: string[];
  activity: PageActivity[];
  notes: string | null;
};

export const pages: PageDetail[] = [
  {
    name: "Forsiden",
    url: "/",
    built: true,
    seoStatus: "done",
    lastSeoUpdate: "2026-05-13",
    nextUpdate: "2026-06-12",
    pageAvgPosition: 16.72,
    positionsUpdated: "2026-07-22",
    nextStep: "Domæne skiftet til horizen.dk + canonical live (22. juli). Afventer at Google flytter indeksering til non-www + næste måling (20. aug). Primary keyword ligger pos 9,14 — skub mod top 5.",
    keywords: {
      primary: "digital design bureau",
      secondary: ["digitalt design bureau", "digitalt bureau ux"],
    },
    positions: {
      current: 9.14,
      target: 3,
      impressions28d: 135,
    },
    completedTasks: [
      "Title-tag opdateret med primary keyword",
      "Meta description med 8+ års erfaring + service-paletten",
      "Semantisk h1 (eyebrow) med 'digital design bureau'",
      "Visuelt brand bevaret (SOLUTIONS CRAFTED som <p>)",
      "Schema.org udvidet til ProfessionalService + PostalAddress (Aarhus)",
      "hasOfferCatalog med alle 5 service-sider",
      "Alt-tekster på hero staff-billeder + cases",
      "Aria-labels på service-links",
      "ServicesSection subtitle med primary keyword",
      "Footer-beskrivelse opdateret",
      "Layout default metadata opdateret",
      "PageSpeed / Core Web Vitals audit kørt (desktop 🟡, mobile 🔴)",
      "Google Tag Manager + GA4 lazy-loaded (245 kb flyttet væk fra critical path)",
      "Trustpilot review-schema: AggregateRating + 7 Review-objekter på ProfessionalService",
    ],
    pendingTasks: [
      "Re-kør PageSpeed audit efter de 2 fix er deployed",
      "Yderligere internal linking fra service-sider tilbage til forsiden",
    ],
    activity: [
      {
        date: "2026-05-13",
        title: "PageSpeed audit + lazy-load af Google-scripts",
        description: "Mobile LCP målt til 15,2 sek (rødt). Lazy-load deployed for at flytte 245 kb GTM/GA/Ads-JS væk fra critical path. Forventet ny mobile LCP: 5-7 sek.",
        commit: "fe06d28",
      },
      {
        date: "2026-05-13",
        title: "Forside SEO komplet færdig",
        description: "Schema.org, alt-tekster, subtekster, aria-labels, footer-tekst",
        commit: "cfeb661",
      },
      {
        date: "2026-05-13",
        title: "Semantisk h1 + title/meta deployed",
        description: "'Digital design bureau' som lille eyebrow + brand-tekst bevaret",
        commit: "fbce0c0",
      },
      {
        date: "2026-05-13",
        title: "Reviderede keywords efter 28-dages data",
        description: "'digitalt bureau aarhus' droppet → 'digital design bureau' nu primary",
      },
    ],
    notes:
      "Forsiden er strategisk vigtigst. Den rangerer allerede pos 6,89 for primary keyword. Et lille skub kan løfte os til top 3-5. PageSpeed-tal pr. 2026-05-13: desktop LCP 3,4s (🟡), mobile LCP 15,2s (🔴). Lazy-load deployet — venter på Vercel domain-fix for at lukke loopet.",
  },
  {
    name: "Webudvikling",
    url: "/services/webudvikling",
    built: true,
    seoStatus: "done",
    lastSeoUpdate: "2026-05-13",
    nextUpdate: "2026-06-12",
    pageAvgPosition: 6.57,
    positionsUpdated: "2026-07-22",
    nextStep: "Re-indeksering anmodet (22. juli). Ligger allerede pos 6,57 på sidens queries (65 visn/3 mdr). Vent på næste måling (20. aug).",
    keywords: {
      primary: "ny hjemmeside",
      secondary: ["professionel hjemmeside", "webudvikling"],
    },
    positions: {
      current: 6.57,
      target: 30,
      impressions28d: 65,
    },
    completedTasks: [
      "Search Console-research kørt",
      "Ubersuggest keyword-research (15+ kandidater testet)",
      "SERP-analyse på top 3 kandidater",
      "Anti-kannibaliserings-tjek mod forsiden — ingen overlap",
      "Strategi-dokument skrevet",
      "Title-tag opdateret med primary keyword",
      "Meta description opdateret med Next.js + React + teknisk fundament",
      "Schema.org Service auto-opdateret via metadata",
      "Hero-body: 'enhver hjemmeside' → 'enhver ny hjemmeside'",
      "H1 og visuel copy bevaret 1:1",
      "Deployed til main",
      "Anmodet om re-indeksering i Search Console",
    ],
    pendingTasks: [],
    activity: [
      {
        date: "2026-05-13",
        title: "SEO deployed: title, meta, schema, body-tekst",
        description: "Title: 'Ny hjemmeside, bygget til at holde'. Meta med Next.js + React + 100-300 timers fundament. Schema.org auto-opdateret. Hero-body fik 'ny' tilføjet. H1 urørt.",
        commit: "ec942ca",
      },
      {
        date: "2026-05-13",
        title: "Keyword-strategi besluttet",
        description: "Primary: 'ny hjemmeside' (590 vol, SD 31). Secondary: 'professionel hjemmeside' (480 vol) + 'webudvikling' (210 vol). Total fangst ~1.300 vol/md. Volumen + premium-positionering.",
      },
      {
        date: "2026-05-12",
        title: "301-redirect fra /hjemmeside/ → /services/webudvikling",
        description: "Bevarer SEO-værdien fra den gamle URL (pos 1,88!)",
        commit: "e84ce54",
      },
    ],
    notes: "SERP'en for primary keywords er domineret af billig-WordPress-bureauer. Horizen positionerer sig som premium alternativ uden at lyve om pris — eksisterende copy filtrerer publikum naturligt. H1 bevaret 1:1. SEO-håndtag ligger i title/meta/schema.",
  },
  {
    name: "UI/UX Design",
    url: "/services/ui-ux-design",
    built: true,
    seoStatus: "pending",
    lastSeoUpdate: null,
    nextUpdate: null,
    pageAvgPosition: 7.12,
    positionsUpdated: "2026-07-22",
    nextStep: "Ligger pos 7,12 (34 visn/3 mdr) — arver redirect-trafik fra /digital-design/. SEO-cyklus skal køres snarest for at fange volumen-keywords.",
    keywords: {
      primary: null,
      secondary: [],
    },
    positions: {
      current: null,
      target: null,
      impressions28d: null,
    },
    completedTasks: [],
    pendingTasks: [
      "Search Console-research: hvad rangerer siden allerede på?",
      "Ubersuggest-research: find primary + secondaries",
      "Anti-kannibaliserings-tjek (forsiden targeter 'digital design bureau' og 'digitalt bureau ux' — vi må ikke kannibalisere)",
      "Skriv strategi-dokument",
      "Optimér copy",
      "Deploy + test",
    ],
    activity: [
      {
        date: "2026-05-12",
        title: "301-redirect fra /digital-design/ → /services/ui-ux-design",
        description: "Bevarer SEO-værdien fra den gamle URL (1.329 visninger/md)",
        commit: "3adfa40",
      },
    ],
    notes:
      "Konflikt-risiko med forsiden: forsidens secondary er 'digitalt bureau ux'. UI/UX-siden skal target noget andet for ikke at kannibalisere.",
  },
  {
    name: "Branding",
    url: "/services/branding",
    built: true,
    seoStatus: "pending",
    lastSeoUpdate: null,
    nextUpdate: null,
    pageAvgPosition: 1.54,
    positionsUpdated: "2026-07-22",
    nextStep: "Pos 1,54 men kun 35 visn/3 mdr — det er brand-søgninger ('horizen branding'), ikke volumen-keywords. SEO-cyklus klar til at starte.",
    keywords: {
      primary: null,
      secondary: [],
    },
    positions: {
      current: null,
      target: null,
      impressions28d: null,
    },
    completedTasks: ["Slug omdøbt fra 'branding-logo' til 'branding'"],
    pendingTasks: [
      "Search Console-research",
      "Ubersuggest-research",
      "Anti-kannibaliserings-tjek",
      "Skriv strategi",
      "Optimér copy",
      "Deploy + test",
    ],
    activity: [
      {
        date: "2026-05-12",
        title: "Slug omdøbt + redirects deployed",
        description: "branding-logo → branding. Gamle /branding/-URL redirecter også.",
        commit: "e84ce54",
      },
    ],
    notes: null,
  },
  {
    name: "Grafisk Design",
    url: "/services/grafisk-design",
    built: true,
    seoStatus: "pending",
    lastSeoUpdate: null,
    nextUpdate: null,
    pageAvgPosition: 3.1,
    positionsUpdated: "2026-07-22",
    nextStep: "Pos 3,1 men kun 29 visn/3 mdr (niche/brand). Skal bygges fra bunden.",
    keywords: {
      primary: null,
      secondary: [],
    },
    positions: {
      current: null,
      target: null,
      impressions28d: null,
    },
    completedTasks: [],
    pendingTasks: [
      "Search Console-research (begrænset data, ny side)",
      "Ubersuggest-research",
      "Skriv strategi",
      "Optimér copy",
      "Deploy + test",
    ],
    activity: [],
    notes: "Lavere prioritet. Ingen arv at beskytte.",
  },
  {
    name: "WordPress",
    url: "/services/wordpress",
    built: true,
    seoStatus: "pending",
    lastSeoUpdate: null,
    nextUpdate: null,
    pageAvgPosition: 17.67,
    positionsUpdated: "2026-07-22",
    nextStep: "Pos 17,67 (6 visn/3 mdr). Skal bygges fra bunden.",
    keywords: {
      primary: null,
      secondary: [],
    },
    positions: {
      current: null,
      target: null,
      impressions28d: null,
    },
    completedTasks: [],
    pendingTasks: [
      "Search Console-research (begrænset data, ny side)",
      "Ubersuggest-research",
      "Skriv strategi",
      "Optimér copy",
      "Deploy + test",
    ],
    activity: [],
    notes: null,
  },
  {
    name: "Blog (oversigt)",
    url: "/blog",
    built: true,
    seoStatus: "pending",
    lastSeoUpdate: null,
    nextUpdate: null,
    pageAvgPosition: 1.37,
    positionsUpdated: "2026-07-22",
    nextStep: "Pos 1,37 (35 visn/3 mdr, mest brand). Blog-oversigt, lavere prioritet end service-sider.",
    keywords: {
      primary: null,
      secondary: [],
    },
    positions: {
      current: null,
      target: null,
      impressions28d: null,
    },
    completedTasks: [],
    pendingTasks: [
      "Vurder om der er volume nok til at SEO'e blog-oversigten",
      "Eventuelt optimér meta + h1",
    ],
    activity: [],
    notes: "Individuelle blog-artikler ranker bedre end oversigten. Strategien her er begrænset.",
  },
  {
    name: "Kontakt",
    url: "/kontakt",
    built: true,
    seoStatus: "not_applicable",
    lastSeoUpdate: null,
    nextUpdate: null,
    pageAvgPosition: 1.86,
    positionsUpdated: "2026-07-22",
    nextStep: "Pos 1,86 (88 visn/3 mdr) — stærk på brand-søgninger som forventet. Lav prioritet.",
    keywords: { primary: null, secondary: [] },
    positions: { current: null, target: null, impressions28d: null },
    completedTasks: [],
    pendingTasks: [],
    activity: [],
    notes: "Allerede pos 2,56 på 'horizen kontakt'-relaterede søgninger. Fint som det er.",
  },
];

export type BuildPriority = 1 | 2 | 3 | 4;

export const upcomingPages = [
  // Prioritet 1: AI-sporet
  { name: "AI automatisering", priority: 1 as BuildPriority, status: "not_built", impact: "high", competition: "low" },
  { name: "AI integration", priority: 1 as BuildPriority, status: "not_built", impact: "high", competition: "low" },
  { name: "AI assistenter", priority: 1 as BuildPriority, status: "not_built", impact: "high", competition: "medium" },
  { name: "AI Search (GEO)", priority: 1 as BuildPriority, status: "not_built", impact: "high", competition: "low" },

  // Prioritet 2: Marketing-services
  { name: "Email marketing", priority: 2 as BuildPriority, status: "not_built", impact: "medium", competition: "medium" },
  { name: "Analytics tracking", priority: 2 as BuildPriority, status: "not_built", impact: "medium", competition: "low" },
  { name: "Kursus og workshops", priority: 2 as BuildPriority, status: "not_built", impact: "medium", competition: "medium" },
  { name: "Webshop", priority: 2 as BuildPriority, status: "not_built", impact: "medium", competition: "high" },

  // Prioritet 3: Konkurrence-tunge
  { name: "Google Ads", priority: 3 as BuildPriority, status: "not_built", impact: "low", competition: "high" },
  { name: "SEO", priority: 3 as BuildPriority, status: "not_built", impact: "low", competition: "high" },
  { name: "Social media", priority: 3 as BuildPriority, status: "not_built", impact: "low", competition: "high" },

  // Prioritet 4: Content
  { name: "Tips og tricks", priority: 4 as BuildPriority, status: "not_built", impact: "low", competition: "low" },
  { name: "Videos and tutorials", priority: 4 as BuildPriority, status: "not_built", impact: "low", competition: "low" },
];

export const recentActivity = [
  {
    date: "2026-07-22",
    title: "Dashboard opdateret med friske GSC- + GA4-tal + bloat-analyse",
    description: "Performance-kort skiftet til 3-mdr GSC-data (68 klik, 3.129 visn, pos 20,2) med forklaring på at faldet er impression bloat fra www-dublet + gammelt indhold, ikke reel forringelse. GA4 efter-relancering fyldt (517 brugere, Facebook-gruppe-trafik dominerer, København > Aarhus). Kommende-datoer ryddet op.",
  },
  {
    date: "2026-07-22",
    title: "Gamle subdomæner + WordPress-URL'er kortlagt, Removals kørt",
    description: "5 spøgelses-subdomæner (webinsight/estimator/hjemmeside/seo/mysite) + 4 døde WordPress-URL'er identificeret som kilde til bloat. Fund: subdomænerne 404'er via Vercel-wildcard (intet DNS at slette), gamle service-URL'er redirecter korrekt. GSC Removals indsendt på alle 9.",
  },
  {
    date: "2026-07-22",
    title: "Domæne-kanonisering: horizen.dk (non-www) gjort primær",
    description: "Vercel production domain skiftet fra www til horizen.dk. www.horizen.dk laver nu 308 permanent redirect ind til horizen.dk. Fjerner den modstridende situation hvor koden pegede på non-www mens sitet blev serveret på www.",
  },
  {
    date: "2026-07-22",
    title: "Canonical-tags tilføjet på alle 14 sider",
    description: "Self-referencing alternates.canonical (non-www) på forside, kontakt, godt-formaal, blog + artikler, cases, designprincipper og de dynamiske service- og principper-routes. Canonical var før helt fraværende. Live i prod.",
    commit: "6135032",
  },
  {
    date: "2026-07-22",
    title: "Search Console: re-indeksering anmodet + sitemap bekræftet",
    description: "Sitemap allerede indsendt (Success, 22 sider, sidst læst 20. juli). Re-indeksering anmodet for forside + webudvikling + ui-ux-design + branding + kontakt, så Google opdager domæne-skift + canonical hurtigere.",
  },
  {
    date: "2026-05-14",
    title: "Forside: Trustpilot review-schema tilføjet (gratis rich snippets)",
    description: "AggregateRating 5.0 fra 7 reviews + alle review-objekter i ProfessionalService schema. Genereres dynamisk fra testimonials.ts. Google kan nu vise stjerner i søgeresultater.",
  },
  {
    date: "2026-05-14",
    title: "Footer: synlig 'Aarhus, Danmark' geo-signal",
    description: "Lokal SEO-forstærkning. Adressen var allerede i Schema.org, nu også synlig i footer.",
    commit: "ba25694",
  },
  {
    date: "2026-05-13",
    title: "Forside: PageSpeed audit + lazy-load af Google-scripts",
    description: "Mobile LCP 15,2s (rødt). Lazy-load deployed for 245 kb GTM/GA-JS. Venter på Vercel domain-fix (skift primary til horizen.dk) for at lukke loopet.",
    commit: "fe06d28",
  },
  {
    date: "2026-05-13",
    title: "Webudvikling: SEO deployed",
    description: "Title, meta, schema og hero-body opdateret. Targeter 'ny hjemmeside' (590 vol) + 'professionel hjemmeside' (480) + 'webudvikling' (210). H1 urørt.",
    commit: "ec942ca",
  },
  {
    date: "2026-05-13",
    title: "Webudvikling: keyword-strategi besluttet",
    description: "Primary 'ny hjemmeside' (590 vol) + 'professionel hjemmeside' (480) + 'webudvikling' (210). Total ~1.300 vol/md.",
  },
  {
    date: "2026-05-13",
    title: "Forside SEO komplet færdig",
    description: "Schema.org udvidet, alt-tekster, subtekster, aria-labels, footer-tekst",
    commit: "cfeb661",
  },
  {
    date: "2026-05-13",
    title: "Semantisk h1 + title/meta deployed",
    description: "'Digital design bureau' som lille eyebrow + brand-tekst bevaret",
    commit: "fbce0c0",
  },
  {
    date: "2026-05-13",
    title: "Reviderede forside-keywords efter 28-dages data",
    description: "'digitalt bureau aarhus' droppet → 'digital design bureau' nu primary",
  },
  {
    date: "2026-05-12",
    title: "Redirects deployed",
    description: "/digital-design/, /hjemmeside/, /branding/ + slug-ændring branding-logo → branding",
    commit: "e84ce54",
  },
  {
    date: "2026-05-12",
    title: "Baseline trukket fra Search Console",
    description: "Maj 2026: 110 klik, 1.338 visninger (3-måneders data)",
  },
];
