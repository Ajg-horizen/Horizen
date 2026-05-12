import type { MetadataRoute } from "next";
import { getAllServiceSlugs } from "@/lib/services";

const BASE = "https://horizen.dk";

const staticRoutes = [
  "",
  "/kontakt",
  "/blog",
  "/cases/bettrplans",
  "/cases/od-biler-pro",
  "/cases/tandsundhed-uden-graenser",
  "/cases/never-another",
  "/blog/ai-webdesign",
  "/blog/figma-til-kode",
  "/blog/seo-fejl-2026",
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

  return [...staticEntries, ...serviceEntries];
}
