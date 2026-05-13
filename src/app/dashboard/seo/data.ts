/**
 * SEO Dashboard Data — Horizen
 *
 * Denne fil opdateres ved hver SEO-ændring så dashboardet altid afspejler
 * status. Når Claude laver SEO-arbejde skal denne fil OPDATERES sammen
 * med MD-filerne i ~/Desktop/Claude Workflows/01-Kunder/Horizen/SEO/.
 */

export const lastUpdated = "2026-05-13";
export const dataAsOf = "2026-04-13 til 2026-05-13"; // 28-dages periode i baseline

export const upcomingReviews = [
  {
    date: "2026-05-20",
    title: "Sundhedstjek",
    description: "Tjek Search Console for indekseringsfejl. 5 min arbejde.",
    type: "check" as const,
  },
  {
    date: "2026-06-12",
    title: "Første rigtige måling",
    description: "Eksportér 28-dages Search Console-data. Vi sammenligner med maj-baseline.",
    type: "review" as const,
  },
  {
    date: "2026-07-12",
    title: "Anden måling",
    description: "Eksportér data igen. Trend bliver synlig.",
    type: "review" as const,
  },
  {
    date: "2026-08-12",
    title: "Strategisk check-in",
    description: "3 måneders data. Beslutter om strategien virker.",
    type: "milestone" as const,
  },
];

export const baseline = {
  period: "Sidste 28 dage (2026-04-13 til 2026-05-13)",
  source: "Google Search Console",
  metrics: {
    clicks: 25,
    impressions: 428,
    ctr: 5.84,
    avgPosition: 7.57,
    frontpagePosition: 11.71,
  },
  insight:
    "Sitet ligger på snit-position 7,57 (side 1 i gennemsnit). Forsiden alene er rykket fra 23,46 → 11,71 på 28 dage. Relanceringen virker. Næste måling 12. juni viser om SEO-arbejdet accelererer udviklingen.",
};

export const actionItems = [
  {
    title: "Test alle redirects live",
    description: "/digital-design/, /hjemmeside/, /branding/, /services/branding-logo/",
    priority: "high" as const,
    estimatedTime: "5 min",
  },
  {
    title: "Indsend sitemap.xml i Search Console",
    description: "Søgekonsol → Sitemaps → indtast `sitemap.xml` → Indsend",
    priority: "high" as const,
    estimatedTime: "1 min",
  },
  {
    title: "Anmod om re-indeksering for nye URL'er",
    description: "5 URL'er: forsiden + 4 service-sider. Bruger Search Console URL-inspektion.",
    priority: "high" as const,
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
    pageAvgPosition: 11.71,
    nextStep: "Vent på juni-data (12. juni) for at se effekt af SEO-arbejdet.",
    keywords: {
      primary: "digital design bureau",
      secondary: ["digitalt design bureau", "digitalt bureau ux"],
    },
    positions: {
      current: 6.89,
      target: 3,
      impressions28d: 158,
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
    ],
    pendingTasks: [
      "Page speed / Core Web Vitals audit",
      "Trustpilot review-schema (rich snippets)",
      "Yderligere internal linking fra service-sider tilbage til forsiden",
    ],
    activity: [
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
      "Forsiden er strategisk vigtigst. Den rangerer allerede pos 6,89 for primary keyword. Et lille skub kan løfte os til top 3-5.",
  },
  {
    name: "Webudvikling",
    url: "/services/webudvikling",
    built: true,
    seoStatus: "in_progress",
    lastSeoUpdate: "2026-05-13",
    nextUpdate: "2026-06-12",
    pageAvgPosition: null,
    nextStep: "Strategi besluttet. Copy-implementation (title, meta, schema, 1 body-ændring) afventer Andreas-godkendelse.",
    keywords: {
      primary: "ny hjemmeside",
      secondary: ["professionel hjemmeside", "webudvikling"],
    },
    positions: {
      current: null,
      target: 30,
      impressions28d: null,
    },
    completedTasks: [
      "Search Console-research kørt",
      "Ubersuggest keyword-research (15+ kandidater testet)",
      "SERP-analyse på top 3 kandidater",
      "Anti-kannibaliserings-tjek mod forsiden — ingen overlap",
      "Strategi-dokument skrevet",
    ],
    pendingTasks: [
      "Implementér title-tag med primary keyword",
      "Implementér meta description",
      "Tilføj Schema.org Service struktureret data",
      "Lille body-ændring i techFoundation (én sætning)",
      "Deploy til main",
      "Anmod om re-indeksering i Search Console",
    ],
    activity: [
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
    notes: "SERP'en for primary keywords er domineret af billig-WordPress-bureauer. Horizen positionerer sig som premium alternativ uden at lyve om pris — eksisterende copy filtrerer publikum naturligt. H1 bevares 1:1. SEO-håndtag ligger i title/meta/schema.",
  },
  {
    name: "UI/UX Design",
    url: "/services/ui-ux-design",
    built: true,
    seoStatus: "pending",
    lastSeoUpdate: null,
    nextUpdate: null,
    pageAvgPosition: null,
    nextStep: "Modtager redirect-trafik fra /digital-design/ (pos 6,64). SEO-cyklus skal køres snarest.",
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
    pageAvgPosition: null,
    nextStep: "Modtager redirect-trafik fra /branding/ (pos 9,85) + /services/branding-logo/. SEO-cyklus klar til at starte.",
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
    pageAvgPosition: null,
    nextStep: "Ny side. Ingen SEO-arv. Skal bygges fra bunden.",
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
    pageAvgPosition: null,
    nextStep: "Ny side. Ingen SEO-arv. Skal bygges fra bunden.",
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
    pageAvgPosition: null,
    nextStep: "Blog-oversigtsside. Lavere prioritet end service-sider.",
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
    pageAvgPosition: null,
    nextStep: "Kontaktsider rankes normalt kun for brand-søgninger ('horizen kontakt'). Lav prioritet.",
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
    date: "2026-05-13",
    title: "Webudvikling: keyword-strategi besluttet",
    description: "Primary 'ny hjemmeside' (590 vol) + 'professionel hjemmeside' (480) + 'webudvikling' (210). Total ~1.300 vol/md. Copy-implementation afventer godkendelse.",
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
