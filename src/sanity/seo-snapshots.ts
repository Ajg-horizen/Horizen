/**
 * Månedlige Search Console-snapshots til SEO-dashboardet.
 *
 * Privatliv: datasettet er offentligt, men dokument-id'er med punktum er i Sanity
 * kun læsbare med token. Derfor hedder de "seoSnapshot.ÅÅÅÅ-MM", så trafiktallene
 * ikke kan hentes af andre, selvom projekt-id'et er offentligt. Dashboardet læser
 * dem server-side med SANITY_API_READ_TOKEN.
 */

import { createClient } from "@sanity/client";
import { apiVersion, projectId, snapshotDataset } from "@/sanity/env";

export type SearchQuery = {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

/** Ét månedligt datapunkt. Matcher seoSnapshot-schemaet. */
export type SeoSnapshot = {
  /** "ÅÅÅÅ-MM" */
  month: string;
  clicks?: number;
  impressions?: number;
  ctr?: number;
  avgPosition?: number;
  capturedAt?: string;
  topQueries?: SearchQuery[];
};

export const snapshotId = (month: string) => `seoSnapshot.${month}`;

// impressions > 10: skjuler måneder fra før Google havde reelle data på domænet.
const SNAPSHOT_QUERY = `*[_type == "seoSnapshot" && impressions > 10] | order(month desc){
  month, clicks, impressions, ctr, avgPosition, capturedAt,
  topQueries[]{ query, clicks, impressions, ctr, position }
}`;

/** Nyeste måned først. Fejler blødt til [], så dashboardet altid kan vises. */
export async function getSeoSnapshots(): Promise<SeoSnapshot[]> {
  const token = process.env.SANITY_API_READ_TOKEN;
  if (!token) return [];
  try {
    const rows = await createClient({
      projectId,
      dataset: snapshotDataset,
      apiVersion,
      token,
      useCdn: false,
      perspective: "published",
    }).fetch<SeoSnapshot[]>(SNAPSHOT_QUERY, {}, { cache: "no-store" });
    return rows ?? [];
  } catch (err) {
    console.error("[dashboard] Kunne ikke hente SEO-snapshots:", err);
    return [];
  }
}
