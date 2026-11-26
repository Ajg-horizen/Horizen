/**
 * Én fælles liste over Horizens cases.
 *
 * Bruges af forsidens case-sektion (CasesSectionBento) og af oversigten på
 * /cases. Ny case: tilføj et objekt her (rækkefølgen er visningsrækkefølgen),
 * og husk siden under src/app/(site)/cases/<slug>/ samt sitemap.ts.
 */

export type CaseTeamMember = { name: string; avatar: string };

export type CaseStudy = {
  slug: string;
  title: string;
  /** Ydelser, vist som "Webdesign · Udvikling". */
  subtitle: string;
  /** Kort beskrivelse til oversigten. Faktuel, i Horizens tone. */
  summary: string;
  image: string;
  /** Mindre varianter af billedet, så mobilen ikke henter originalen. */
  srcSet?: string;
  /** Beskrivende alt-tekst til billedet. Uden den bruges "<titel>, <ydelser> af Horizen". */
  imageAlt?: string;
  /** CSS object-position, når motivet ikke sidder i midten (fx "50% 35%"). */
  imagePosition?: string;
  /** Valgfri baggrundsvideo. Billedet bruges som poster/fallback. */
  video?: string;
  /** Video der afspiller, når man holder musen over billedet i oversigten. */
  hoverVideo?: string;
  /** Sløret still fra hover-videoen, der udfylder felterne over og under videoen. */
  hoverVideoBackdrop?: string;
  /** Hvidt bomærke, vises på mørk baggrund. Uden logo vises initialerne. */
  logo?: string;
  /** Kort tekst i bomærke-feltet, når der ikke er et logo (fx "ACP"). */
  initials?: string;
  /** Hvem fra Horizen der var med. Udelades, hvis vi ikke ved det. */
  team?: CaseTeamMember[];
  /** Et målbart resultat fra casen, hvis der er et. */
  result?: { value: string; label: string };
  /**
   * Kunden, der har anmeldt Horizen på Trustpilot. Oversigten /cases viser
   * kun navn og foto (selve anmeldelsen står på case-siden). Enten et id i
   * src/lib/testimonials.ts eller forfatteren skrevet direkte her.
   */
  testimonial?: {
    id?: string;
    author?: { name: string; role?: string; company?: string; photo?: string };
  };
  /** Kundens live site. Bruges som link, så længe casen ikke har sin egen side. */
  liveUrl?: string;
  /** Casen har endnu ingen side under /cases/<slug>. */
  noCasePage?: boolean;
  /** Skjult overalt, indtil den er klar til at blive vist. */
  comingSoon?: boolean;
};

const JOSE = { name: "José", avatar: "/staff/staff-jose-digital-design.jpg" };
const JOHANNE = {
  name: "Johanne",
  avatar: "/staff/staff-Web-udvikler-designer-Johanne-horizen.avif",
};
const ANNE_SOFIE = {
  name: "Anne-Sofie",
  avatar: "/staff/staff-Marketing-ansvarlig-Anne-Sofie.webp",
};
const LUDVIG = {
  name: "Ludvig",
  avatar: "/staff/staff-kommunikation-og-salg-Ludvig.webp",
};
const SEBASTIAN = {
  name: "Sebastian",
  avatar: "/staff/staff-.Sebastian-Meta-facebook.jpg",
};

export const cases: CaseStudy[] = [
  {
    slug: "bettrplans",
    title: "BettrPlans",
    subtitle: "Webdesign · Branding · Visuel identitet",
    summary:
      "Et nyt brand og en platform, der gør indretning af hjemmet mere overskueligt. Fra første idé til konkret beslutning.",
    image: "/cases/BettrPlans-Case-Image-01.webp",
    srcSet:
      "/cases/BettrPlans-Case-Image-01-800w.webp 800w, /cases/BettrPlans-Case-Image-01.webp 1159w",
    logo: "/Bomærker/BettrPlans-Bomærke-hvid.svg",
    team: [JOSE, LUDVIG, ANNE_SOFIE],
    testimonial: {
      id: "saxo-bettrplans",
    },
  },
  {
    slug: "od-biler-pro",
    title: "OD Pro",
    subtitle: "Webdesign · Udvikling",
    summary:
      "En professionel hjemmeside for OD Pro, et bilværksted i Glostrup der tilbyder service, reparation og salg af kvalitetsbiler.",
    image: "/cases/OD-Cases-image-car.webp",
    srcSet:
      "/cases/OD-Cases-image-car-800w.webp 800w, /cases/OD-Cases-image-car-1600w.webp 1600w, /cases/OD-Cases-image-car.webp 6144w",
    logo: "/Bomærker/Bomærke-OD-biler.svg",
    team: [JOSE, JOHANNE, SEBASTIAN],
    result: { value: "+312%", label: "organisk trafik" },
    liveUrl: "https://www.od-biler.dk",
  },
  {
    slug: "ensemble-hermes",
    title: "Ensemble Hermes",
    subtitle: "Webdesign · UI/UX · Redesign",
    summary:
      "En Wix-side der var svær at navigere og tung at vedligeholde. Vi byggede et nyt fundament med et system til koncertoversigten, en enklere brugerflade og et CMS, de selv styrer.",
    image: "/cases/Case-Hermes.webp",
    srcSet: "/cases/Case-Hermes-800w.webp 800w, /cases/Case-Hermes.webp 1280w",
    logo: "/Bomærker/Ensemble-hermes-bookmark-white.svg",
    team: [JOSE, ANNE_SOFIE],
    testimonial: {
      id: "rebecca-hermes",
    },
    liveUrl: "https://ensemblehermes.dk",
  },
  {
    slug: "tandsundhed-uden-graenser",
    title: "Tandsundhed Uden Grænser",
    subtitle: "Webdesign · CMS · Udvikling",
    summary:
      "Redesign og ny visuel identitet for en NGO, der arbejder for bedre tandsundhed globalt. Fra et forældet WPBakery-site til et specialbygget CMS, der sparer timer hver dag.",
    image: "/cases/Tand-sundhed-hero-image-1600w.webp",
    srcSet:
      "/cases/Tand-sundhed-hero-image-800w.webp 800w, /cases/Tand-sundhed-hero-image-1600w.webp 1600w",
    video: "/video/Tandsundhed-UI.mp4",
    logo: "/Bomærker/TUG-Bomærke-hvid.svg",
    team: [JOSE, JOHANNE, ANNE_SOFIE, LUDVIG],
    result: { value: "−83%", label: "redigeringstid" },
    testimonial: {
      id: "tatiana-tandsundhed",
    },
    liveUrl: "https://dhwb.dk",
  },
  {
    slug: "cocraft",
    title: "CoCraft",
    subtitle: "UI/UX · Webudvikling · CMS",
    summary:
      "En platform hvor kunder beskriver deres idé og får den lavet af en kunsthåndværker. Bygget fra idé til live platform med bestillingsflow og indhold, stifteren selv redigerer.",
    image: "/cases/CoCraft-Case-Image-1600w.webp",
    srcSet:
      "/cases/CoCraft-Case-Image-800w.webp 800w, /cases/CoCraft-Case-Image-1600w.webp 1381w",
    imagePosition: "50% 30%",
    logo: "/Bomærker/Co-Craft-bomærke.svg",
    result: { value: "1 måned", label: "fra idé til live platform" },
    testimonial: {
      author: {
        name: "Iben Tvilsted",
        role: "Stifter",
        company: "CoCraft",
        photo: "/Clients/iben-cocraft.webp",
      },
    },
    liveUrl: "https://cocraft.dk",
  },
  {
    slug: "malerfirma-seitz",
    title: "Malerfirma Seitz",
    subtitle: "Webdesign · Google Ads",
    summary:
      "Malerfirma Seitz havde ingen hjemmeside. Vi byggede en enkel landing page, der skaffer opgaver, og satte Google Ads op med konverteringssporing, så annoncekronerne arbejder.",
    image: "/cases/Seitz-Michael-1280w.webp",
    srcSet:
      "/cases/Seitz-Michael-800w.webp 800w, /cases/Seitz-Michael-1280w.webp 1280w",
    imageAlt:
      "Malermester Michael Seitz foran sin firmabil med Malerfirma Seitz' logo",
    imagePosition: "30% 30%",
    logo: "/Bomærker/Seitz-Bomærke-hvid.svg",
    testimonial: {
      id: "michael-seitz-malerfirma",
    },
    liveUrl: "https://malerfirma-seitz.dk",
  },
  {
    slug: "miljoekontoret",
    title: "Miljøkontoret",
    subtitle: "Webudvikling · Design · UI/UX · SEO",
    summary:
      "Rådgivning i miljø og arbejdsmiljø på byggepladsen for bygherrer i pharma, biotek og offentligt byggeri. Et nyt site med eget designsystem, bygget til at matche kundernes faglige niveau.",
    image: "/cases/Miljoekontoret-iPad-1600w.webp",
    srcSet:
      "/cases/Miljoekontoret-iPad-800w.webp 800w, /cases/Miljoekontoret-iPad-1600w.webp 1600w, /cases/Miljoekontoret-iPad-2400w.webp 2400w",
    logo: "/Bomærker/Miljøkontoret-Bomærke-white.svg",
    liveUrl: "https://miljoekontoret.dk",
  },
  {
    slug: "hos-dam",
    title: "Hos Dam",
    subtitle: "Webudvikling · Design · UI/UX · SEO",
    summary:
      "Kropsterapi i Brabrand. Et roligt, varmt site med eget designsystem, online booking og indhold, Hos Dam selv redigerer. Gik live i oktober 2026.",
    image: "/cases/HosDam-MacBook-1600w.webp",
    srcSet:
      "/cases/HosDam-MacBook-800w.webp 800w, /cases/HosDam-MacBook-1600w.webp 1600w, /cases/HosDam-MacBook-2400w.webp 2400w",
    imageAlt:
      "Hos Dams nye hjemmeside om kropsterapi i Brabrand vist på en bærbar computer, designet og udviklet af Horizen",
    logo: "/Bomærker/HosDam-Bomærke-hvid.svg",
    hoverVideo: "/video/HosDam-UI.mp4",
    hoverVideoBackdrop: "/video/HosDam-UI-backdrop.webp",
    testimonial: { id: "ann-sofie-hos-dam" },
    liveUrl: "https://www.hosdam.dk",
  },
  {
    slug: "acp",
    title: "ACP",
    subtitle: "Webudvikling · Design · UI/UX · SEO",
    summary:
      "Rengøringsfirma i Horsens. En hurtig ny hjemmeside og fast SEO-aftale, bygget til at blive fundet af virksomheder i lokalområdet, med alle gamle adresser sendt videre.",
    image: "/cases/ACP-MacBook-1600w.webp",
    srcSet:
      "/cases/ACP-MacBook-800w.webp 800w, /cases/ACP-MacBook-1600w.webp 1600w, /cases/ACP-MacBook-2400w.webp 2400w",
    imageAlt:
      "ACP's nye hjemmeside om erhvervsrengøring i Horsens vist på en bærbar computer, designet og udviklet af Horizen",
    initials: "ACP",
    hoverVideo: "/video/ACP-UI.mp4",
    hoverVideoBackdrop: "/video/ACP-UI-backdrop.webp",
    result: {
      value: "1,3 sek.",
      label: "indlæsning af forsiden på mobil (før 12,8 sek.)",
    },
    testimonial: { id: "ramin-acp" },
    liveUrl: "https://www.ac-p.dk",
  },
];

/**
 * Rækkefølgen på /cases (Andreas 26/11-2026). Cases, der ikke står her,
 * kommer til sidst i den rækkefølge, de står i listen ovenfor.
 */
const OVERVIEW_ORDER = [
  "miljoekontoret",
  "acp",
  "hos-dam",
  "cocraft",
  "tandsundhed-uden-graenser",
  "ensemble-hermes",
  "bettrplans",
  "malerfirma-seitz",
  "od-biler-pro",
];

const rank = (slug: string) => {
  const i = OVERVIEW_ORDER.indexOf(slug);
  return i === -1 ? OVERVIEW_ORDER.length : i;
};

/** De cases der vises offentligt, i oversigtens rækkefølge. */
export const visibleCases = cases
  .filter((c) => !c.comingSoon)
  .sort((a, b) => rank(a.slug) - rank(b.slug));

/**
 * Cases på forsiden, i visningsrækkefølge (desktop: 3 + 3 lige store kort, derefter 2 kort 7+5).
 * Skift et slug her for at bytte en case på forsiden. Højst otte.
 */
export const HOMEPAGE_CASES = [
  // Første række
  "miljoekontoret",
  "acp",
  "hos-dam",
  // Anden række
  "ensemble-hermes",
  "od-biler-pro",
  "cocraft",
  // Tredje række: to kort, venstre bredest
  "bettrplans",
  "tandsundhed-uden-graenser",
];

export const homepageCases = HOMEPAGE_CASES.map((slug) =>
  visibleCases.find((c) => c.slug === slug),
).filter((c): c is CaseStudy => !!c && !c.noCasePage);

export const caseHref = (c: CaseStudy) => `/cases/${c.slug}`;
