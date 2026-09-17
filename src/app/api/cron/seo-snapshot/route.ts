import { NextResponse } from "next/server";
import { createClient } from "@sanity/client";
import { fetchSearchConsoleMonth, fetchSearchConsoleQueries, prevMonth } from "@/lib/search-console";
import { apiVersion, projectId, snapshotDataset } from "@/sanity/env";
import { snapshotId } from "@/sanity/seo-snapshots";

/**
 * Cron: gemmer forrige måneds Search Console-tal som et seoSnapshot i Sanity.
 * Kører i skyen (Vercel Cron, se vercel.json) den 3. i hver måned, uafhængigt af
 * nogen lokal computer. Den 3., fordi Googles data er 2-3 dage forsinket.
 *
 * Vercel Cron sender selv "Authorization: Bearer <CRON_SECRET>". Manuel kørsel
 * (fx backfill) bruger samme header:
 *   curl -H "Authorization: Bearer $CRON_SECRET" "https://horizen.dk/api/cron/seo-snapshot?month=2026-08"
 *
 * Env i Vercel: GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET,
 * GOOGLE_OAUTH_REFRESH_TOKEN, CRON_SECRET, SEARCH_CONSOLE_SITE, SANITY_API_WRITE_TOKEN.
 */
export const dynamic = "force-dynamic";

const fail = (status: number, error: string, extra: Record<string, unknown> = {}) =>
  NextResponse.json({ error, ...extra }, { status });

export async function GET(request: Request) {
  // Læses ved hvert kald (ikke som modul-konstant), så en rettet env-var slår igennem.
  const cronSecret = process.env.CRON_SECRET;
  const site = process.env.SEARCH_CONSOLE_SITE;
  const writeToken = process.env.SANITY_API_WRITE_TOKEN;

  // Uden hemmelighed er endpointet åbent for alle. Det accepteres kun lokalt.
  if (!cronSecret && process.env.NODE_ENV === "production") {
    return fail(500, "CRON_SECRET mangler i env.");
  }
  if (cronSecret && request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return fail(401, "Unauthorized");
  }
  if (!site) return fail(500, 'SEARCH_CONSOLE_SITE mangler i env (fx "sc-domain:horizen.dk").');
  if (!writeToken) return fail(500, "SANITY_API_WRITE_TOKEN mangler i env.");

  const month = new URL(request.url).searchParams.get("month") || prevMonth();
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) return fail(400, "month skal have formen ÅÅÅÅ-MM.");

  try {
    const [metrics, topQueries] = await Promise.all([
      fetchSearchConsoleMonth(site, month),
      fetchSearchConsoleQueries(site, month, 25),
    ]);

    const sanity = createClient({ projectId, dataset: snapshotDataset, apiVersion, token: writeToken, useCdn: false });

    // Fast id pr. måned: en ny kørsel opdaterer måneden i stedet for at lave en dublet.
    await sanity.createOrReplace({
      _id: snapshotId(month),
      _type: "seoSnapshot",
      month,
      source: "search-console",
      capturedAt: new Date().toISOString(),
      ...metrics,
      topQueries: topQueries.map((q, i) => ({ _key: `q-${i}`, ...q })),
    });

    return NextResponse.json({ ok: true, month, dataset: snapshotDataset, metrics, topQueries: topQueries.length });
  } catch (err) {
    console.error("[cron/seo-snapshot]", err);
    return fail(500, err instanceof Error ? err.message : "Ukendt fejl", { month });
  }
}
