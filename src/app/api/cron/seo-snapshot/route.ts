import { NextResponse } from "next/server";
import { createClient } from "@sanity/client";
import {
  availableMonths,
  fetchSearchConsoleMonth,
  fetchSearchConsoleQueries,
  prevMonth,
} from "@/lib/search-console";
import { apiVersion, projectId, snapshotDataset } from "@/sanity/env";
import { snapshotId } from "@/sanity/seo-snapshots";

/**
 * Cron: gemmer Search Console-tal som seoSnapshot i Sanity, én pr. måned.
 * Kører i skyen (Vercel Cron, se vercel.json) den 3. i hver måned, uafhængigt af
 * nogen lokal computer. Den 3., fordi Googles data er 2-3 dage forsinket.
 *
 * Selvhelende: hver kørsel opdaterer forrige måned OG henter alle måneder, der
 * mangler i Googles 16-måneders vindue. Første kørsel henter derfor hele
 * historikken, og en glippet måned bliver indhentet næste gang. Kan udløses
 * uden hemmelighed fra Vercel: Settings -> Cron Jobs -> Run.
 *
 * Manuel kørsel af én bestemt måned:
 *   curl -H "Authorization: Bearer $CRON_SECRET" "https://horizen.dk/api/cron/seo-snapshot?month=2026-08"
 *
 * Env i Vercel: GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET,
 * GOOGLE_OAUTH_REFRESH_TOKEN, CRON_SECRET, SEARCH_CONSOLE_SITE, SANITY_API_WRITE_TOKEN.
 */
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const BATCH = 3;

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

  const requested = new URL(request.url).searchParams.get("month");
  if (requested && !/^\d{4}-(0[1-9]|1[0-2])$/.test(requested)) {
    return fail(400, "month skal have formen ÅÅÅÅ-MM.");
  }

  const sanity = createClient({ projectId, dataset: snapshotDataset, apiVersion, token: writeToken, useCdn: false });

  try {
    let months: string[];
    if (requested) {
      months = [requested];
    } else {
      // En måned er komplet, når den har både totaler og top-søgninger.
      const complete = new Set(
        await sanity.fetch<string[]>(`*[_type == "seoSnapshot" && count(topQueries) > 0].month`),
      );
      const latest = prevMonth();
      months = availableMonths().filter((m) => m === latest || !complete.has(m));
    }

    const saved: { month: string; clicks: number; impressions: number }[] = [];
    const failed: { month: string; error: string }[] = [];

    for (let i = 0; i < months.length; i += BATCH) {
      await Promise.all(
        months.slice(i, i + BATCH).map(async (month) => {
          try {
            const [metrics, topQueries] = await Promise.all([
              fetchSearchConsoleMonth(site, month),
              fetchSearchConsoleQueries(site, month, 25),
            ]);
            // Fast id pr. måned: en ny kørsel opdaterer måneden i stedet for at lave en dublet.
            await sanity.createOrReplace({
              _id: snapshotId(month),
              _type: "seoSnapshot",
              month,
              source: "search-console",
              capturedAt: new Date().toISOString(),
              ...metrics,
              topQueries: topQueries.map((q, n) => ({ _key: `q-${n}`, ...q })),
            });
            saved.push({ month, clicks: metrics.clicks, impressions: metrics.impressions });
          } catch (err) {
            failed.push({ month, error: err instanceof Error ? err.message : "Ukendt fejl" });
          }
        }),
      );
    }

    saved.sort((a, b) => a.month.localeCompare(b.month));
    const body = { ok: failed.length === 0, dataset: snapshotDataset, saved, failed };
    if (failed.length) console.error("[cron/seo-snapshot] fejlede måneder:", failed);
    return NextResponse.json(body, { status: failed.length && !saved.length ? 500 : 200 });
  } catch (err) {
    console.error("[cron/seo-snapshot]", err);
    return fail(500, err instanceof Error ? err.message : "Ukendt fejl");
  }
}
