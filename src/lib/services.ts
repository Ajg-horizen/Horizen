/**
 * Single source of truth for service-sider.
 *
 * Hver service-side er en ServicePage med en liste af blocks.
 * Template'n (`src/app/services/[slug]/page.tsx`) læser data og rendrer
 * blocks i rækkefølge.
 *
 * Tilføj ny service: opret en fil i `src/data/services/{slug}.ts` der
 * eksporterer en `ServicePage`, og tilføj den til `services` arrayet
 * nederst i denne fil.
 *
 * Struktur er CMS-klar: en import kan senere udskiftes med fetch fra
 * fx Sanity, Payload eller Directus uden ændringer i konsumerende
 * komponenter.
 */

import type { LucideIcon } from "lucide-react";

/* ─── Block types ─────────────────────────────────────────── */

export type HeroBlock = {
  type: "hero";
  eyebrow: { label: string; icon: LucideIcon };
  /** Heading med valgfri muted-del. Brug `mutedTail` til den grå anden-del. */
  heading: { lead: string; mutedTail?: string };
  body: string;
  cta: { label: string; href: string };
  /** Full-width parallax billede under hero-tekst. */
  image: { src: string; alt: string };
};

export type SectionTOCBlock = {
  type: "sectionTOC";
  items: { label: string; href: string }[];
};

export type CenteredCtaBlock = {
  type: "centeredCta";
  eyebrow: string;
  heading: string;
  body: string;
  cta: { label: string; href: string };
  /** Hvis sat, bruges som baggrund i sticky-stack. Default: "background". */
  background?: "background" | "dark";
};

export type ProcessStep = {
  step: string;
  title: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  link?: { href: string; label: string };
};

export type ProcessBlock = {
  type: "process";
  eyebrow: string;
  heading: string;
  body?: string;
  steps: ProcessStep[];
};

export type DeliverableItem = {
  icon: LucideIcon;
  text: string;
  bg: string;
  fg: string;
};

export type DeliverablesBlock = {
  type: "deliverables";
  eyebrow: string;
  /** Heading med valgfri linjebrud — brug array for multi-line. */
  heading: string | string[];
  body: string;
  items: DeliverableItem[];
};

export type PositioningStat = { value: string; label: string };

export type PositioningBlock = {
  type: "positioning";
  eyebrow: string;
  heading: { lead: string; mutedTail?: string };
  paragraphs: string[];
  stats?: PositioningStat[];
};

export type CaseItem = {
  title: string;
  href: string;
  image: string;
  category: string;
  result: string;
};

export type CasesBlock = {
  type: "cases";
  eyebrow: string;
  heading: string;
  /** Link til "alle cases"-knap. Default: "/#cases". */
  allCasesHref?: string;
  cases: CaseItem[];
};

export type FaqItem = { q: string; a: string };

export type FaqBlock = {
  type: "faq";
  eyebrow: string;
  /** Heading med valgfri linjebrud. */
  heading: string | string[];
  /** Intro-tekst under heading. Kan indeholde mailto-link via `email`. */
  intro: string;
  email?: string;
  faqs: FaqItem[];
};

export type GradientCtaBlock = {
  type: "gradientCta";
  heading: string;
  body: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

export type FeaturedTestimonialBlock = {
  type: "featuredTestimonial";
  /** Hvis sat, bruges denne testimonial-id. Ellers bruges den featured. */
  testimonialId?: string;
};

/* ─── Signatur-blocks ──────────────────────────────────────── */

export type LighthouseMetric = {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
};

export type TechFoundationBlock = {
  type: "techFoundation";
  eyebrow: string;
  heading: string;
  body: string;
  lighthouseMetrics: LighthouseMetric[];
};

export type TechChecklistBlock = {
  type: "techChecklist";
  eyebrow: string;
  heading: { lead: string; mutedTail?: string };
  body: string;
  /** Tekst over chart, fx "Synlighed over tid" eller "Engagement over tid". Default: "Synlighed over tid". */
  chartLabel?: string;
  chartLegend: { weak: string; strong: string };
  checklist: string[];
};

/* ─── Signatur-blocks for UI/UX ────────────────────────────── */

export type DesignMaturityScore = {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
};

export type DesignTokensBlock = {
  type: "designTokens";
  eyebrow: string;
  /** Heading med valgfri muted-del. */
  heading: string | { lead: string; mutedTail?: string };
  /** Brødtekst — string for ét afsnit, array for flere. */
  body: string | string[];
  /** Animerede scores der vises ved siden af tokens-vinduet. */
  maturityScores: DesignMaturityScore[];
};

export type UxVsUiBlock = {
  type: "uxVsUi";
  eyebrow: string;
  heading: string | { lead: string; mutedTail?: string };
  body: string | string[];
  /** Labels til de to mockups. Default: "UX" og "UI". */
  uxLabel?: string;
  uiLabel?: string;
  /** Korte forklaringer under hver mockup. */
  uxCaption: string;
  uiCaption: string;
  /** Valgfrie "Læs mere"-links i bunden af hvert card. */
  uxReadMoreLink?: { href: string; label: string };
  uiReadMoreLink?: { href: string; label: string };
};

export type UxLaw = {
  /** Kort identifikator vist som badge, fx "01" eller "Hick". */
  abbr: string;
  /** Fulde navn, fx "Hick's Law". */
  name: string;
  /** Kort definition (1 sætning). */
  definition: string;
  /** Hvordan I anvender loven i praksis. */
  application: string;
  /** Accent-farve til badge/underlinje. */
  accent: string;
};

export type UxLawsBlock = {
  type: "uxLaws";
  eyebrow: string;
  heading: { lead: string; mutedTail?: string };
  body: string;
  laws: UxLaw[];
  /** Valgfri linje nederst der krediterer kilder. */
  sourceNote?: string;
};

/* ─── Block union ─────────────────────────────────────────── */

export type ServiceBlock =
  | HeroBlock
  | SectionTOCBlock
  | CenteredCtaBlock
  | ProcessBlock
  | DeliverablesBlock
  | PositioningBlock
  | CasesBlock
  | FaqBlock
  | GradientCtaBlock
  | FeaturedTestimonialBlock
  | TechFoundationBlock
  | TechChecklistBlock
  | DesignTokensBlock
  | UxVsUiBlock
  | UxLawsBlock;

/* ─── Service page ────────────────────────────────────────── */

export type ServicePage = {
  slug: string;
  metadata: {
    title: string;
    description: string;
  };
  /**
   * Liste af blocks der rendres i rækkefølge.
   * - `id`: hvis sat, rendres som DOM id på sektionen (til ankerlinks)
   * - `stickyGroup`: bind blocks sammen i sticky-stack-effekten —
   *   alle blocks med samme stickyGroup-værdi stables.
   */
  blocks: (ServiceBlock & { id?: string; stickyGroup?: string })[];
};

/* ─── Sticky stack helper ─────────────────────────────────── */

/**
 * Statiske klasser så Tailwind JIT kan finde dem.
 * Index 0 → første sticky lag, index 4 → øverste lag.
 */
const STICKY_Z_CLASSES = [
  "lg:z-10",
  "lg:z-20",
  "lg:z-30",
  "lg:z-40",
  "lg:z-50",
];

export function stickyClasses(index?: number): string {
  if (index === undefined) return "";
  const z = STICKY_Z_CLASSES[index] ?? "lg:z-50";
  return `lg:sticky lg:top-0 ${z}`;
}

/* ─── Registry ────────────────────────────────────────────── */

import { webudvikling } from "@/data/services/webudvikling";
import { uiUxDesign } from "@/data/services/ui-ux-design";

export const services: ServicePage[] = [webudvikling, uiUxDesign];

export const servicesBySlug: Record<string, ServicePage> = Object.fromEntries(
  services.map((s) => [s.slug, s])
);

export function getService(slug: string): ServicePage | undefined {
  return servicesBySlug[slug];
}

export function getAllServiceSlugs(): string[] {
  return services.map((s) => s.slug);
}
