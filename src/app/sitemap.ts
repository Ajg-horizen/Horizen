import type { MetadataRoute } from "next";
import { getAllServiceSlugs } from "@/lib/services";
import { designPrinciples } from "@/lib/design-principles";
import { isPublished } from "@/components/principle-content";
import { visibleCases, caseHref } from "@/lib/cases";

const BASE = "https://horizen.dk";

const staticRoutes = [
  "",
  "/kontakt",
  "/blog",
  "/ressourcer/designprincipper",
  "/cases",
  // Alle cases fra den fælles liste (også Ensemble Hermes, der manglede før)
  ...visibleCases.filter((c) => !c.noCasePage).map(caseHref),
  "/cases/never-another",
  "/blog/ai-webdesign",
  "/blog/figma-til-kode",
  "/blog/seo-fejl-2026",
  "/blog/hvad-er-seo",
  "/godt-formaal",
  "/handelsbetingelser",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries = staticRoutes.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1.0 : 0.7,
  }));

  const serviceEntries = getAllServiceSlugs().map((slug) => ({
    url: `${BASE}/services/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Kun udgivne principper i sitemap — resten må Google ikke crawle endnu
  const principleEntries = designPrinciples
    .filter((p) => isPublished(p.slug))
    .map((p) => ({
      url: `${BASE}${p.href}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  return [...staticEntries, ...serviceEntries, ...principleEntries];
}
