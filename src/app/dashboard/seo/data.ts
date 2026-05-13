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
    "Forsidens position er rykket fra 23,46 (3-måneder) til 11,71 på 28 dage. Relanceringen virker. Næste måling 12. juni viser om SEO-arbejdet accelererer udviklingen.",
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

export const existingPages = [
  {
    name: "Forsiden",
    url: "/",
    built: true,
    seoStatus: "done" as SeoStatus,
    deployedAt: "2026-05-13",
    primaryKeyword: "digital design bureau",
    currentPosition: 11.71,
    targetPosition: 5,
  },
  {
    name: "Webudvikling",
    url: "/services/webudvikling",
    built: true,
    seoStatus: "pending" as SeoStatus,
    primaryKeyword: null,
  },
  {
    name: "UI/UX Design",
    url: "/services/ui-ux-design",
    built: true,
    seoStatus: "pending" as SeoStatus,
    primaryKeyword: null,
  },
  {
    name: "Branding",
    url: "/services/branding",
    built: true,
    seoStatus: "pending" as SeoStatus,
    primaryKeyword: null,
  },
  {
    name: "Grafisk Design",
    url: "/services/grafisk-design",
    built: true,
    seoStatus: "pending" as SeoStatus,
    primaryKeyword: null,
  },
  {
    name: "WordPress",
    url: "/services/wordpress",
    built: true,
    seoStatus: "pending" as SeoStatus,
    primaryKeyword: null,
  },
  {
    name: "Blog",
    url: "/blog",
    built: true,
    seoStatus: "pending" as SeoStatus,
    primaryKeyword: null,
  },
  {
    name: "Kontakt",
    url: "/kontakt",
    built: true,
    seoStatus: "not_applicable" as SeoStatus,
    primaryKeyword: null,
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

export const keywordsTracked = [
  {
    page: "Forsiden",
    primary: "digital design bureau",
    secondary: ["digitalt design bureau", "digitalt bureau ux"],
    currentPosition: 6.89,
    impressionsLast28d: 158,
  },
];
