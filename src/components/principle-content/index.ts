/**
 * Registry for designprincip-indhold.
 *
 * Hver fil eksporterer default som PrincipleContent (se types nedenfor).
 * Tilføj nye principper ved at importere og mappe slug → modulets default.
 */

import type { ReactNode } from "react";
import type { PrincipleSlug } from "@/lib/design-principles";
import aestetikUsability from "./aestetik-usability-effekten";
import fittsLov from "./fitts-lov";
import hicksLov from "./hicks-lov";
import millersLov from "./millers-lov";
import naerhedsloven from "./naerhedsloven";
import selektivOpmaerksomhed from "./selektiv-opmaerksomhed";

export interface PrincipleSource {
  /** Udgiver eller forfatter, fx "Laws of UX" eller "Kurosu & Kashimura, 1995" */
  source: string;
  /** Artiklens/værkets titel */
  title: string;
  /** Link til ressourcen (udelades for akademiske artikler uden online version) */
  href?: string;
}

export interface PrincipleContent {
  /** Lead-paragraf vist mellem titel og illustration */
  intro: ReactNode;
  /** Selve artikel-kroppen (sektioner, citat, osv.) */
  body: ReactNode;
  /** Eksterne kilder til "Gå i dybden"-boksen */
  sources: PrincipleSource[];
}

// Partial: ikke alle principper har færdigt content endnu. Når en slug
// tilføjes her, tvinger PrincipleSlug-typen den til at matche listen
// i design-principles.ts, ingen tavse drift mellem registries.
const registry: Partial<Record<PrincipleSlug, PrincipleContent>> = {
  "aestetik-usability-effekten": aestetikUsability,
  "fitts-lov": fittsLov,
  "hicks-lov": hicksLov,
  "millers-lov": millersLov,
  naerhedsloven: naerhedsloven,
  "selektiv-opmaerksomhed": selektivOpmaerksomhed,
};

export function getPrincipleContent(slug: string): PrincipleContent | null {
  return registry[slug as PrincipleSlug] ?? null;
}

/**
 * Sandt hvis et princip er "udgivet", dvs. har en content-fil registreret.
 * Alle public surfaces (overview, sitemap, related, generateStaticParams)
 * skal filtrere på det her. Et princip uden content er skjult fra brugere
 * og Google, men findes stadig i koden indtil det er klar.
 */
export function isPublished(slug: string): boolean {
  return slug in registry;
}

export function getPublishedSlugs(): PrincipleSlug[] {
  return Object.keys(registry) as PrincipleSlug[];
}
