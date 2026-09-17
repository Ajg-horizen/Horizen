/**
 * Google Search Console: henter tal for én måned via OAuth refresh token
 * (bruger-login, IKKE service-account-nøgle). Credentials kommer fra env-vars,
 * så det kører i skyen (Vercel Cron) uden nogen lokal maskine:
 *
 *   GOOGLE_OAUTH_CLIENT_ID      OAuth-klientens id
 *   GOOGLE_OAUTH_CLIENT_SECRET  OAuth-klientens hemmelighed
 *   GOOGLE_OAUTH_REFRESH_TOKEN  den fornybare billet (scripts/get-refresh-token.mjs)
 *
 * Refresh token'et byttes til et kortlivet access token ved hvert kald.
 * Samme motor som på kundesiterne (SanityPress-templaten).
 */

export type SearchConsoleMetrics = {
  clicks: number;
  impressions: number;
  /** Procent, 1 decimal. */
  ctr: number;
  avgPosition: number;
};

/** Ét søgeord fra Search Console med dets tal for måneden. */
export type SearchConsoleQuery = {
  query: string;
  clicks: number;
  impressions: number;
  /** Procent, 1 decimal. */
  ctr: number;
  /** 1 decimal. */
  position: number;
};

/** Forrige hele måned som "ÅÅÅÅ-MM". */
export function prevMonth(now = new Date()): string {
  const d = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/** Første + sidste dag i måneden som "ÅÅÅÅ-MM-DD". */
function monthRange(month: string): { startDate: string; endDate: string } {
  const [y, m] = month.split("-").map(Number);
  const lastDay = new Date(y, m, 0).getDate();
  return { startDate: `${month}-01`, endDate: `${month}-${String(lastDay).padStart(2, "0")}` };
}

/** Bytter refresh token til et kortlivet access token. */
async function getAccessToken(): Promise<string> {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Mangler GOOGLE_OAUTH_CLIENT_ID / _CLIENT_SECRET / _REFRESH_TOKEN i env.");
  }
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`OAuth token ${res.status}: ${await res.text()}`);
  return (await res.json()).access_token as string;
}

async function query(site: string, month: string, body: Record<string, unknown>) {
  const token = await getAccessToken();
  const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`;
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ ...monthRange(month), ...body }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Search Console ${res.status}: ${await res.text()}`);
  return (await res.json()).rows as
    | { keys?: string[]; clicks?: number; impressions?: number; ctr?: number; position?: number }[]
    | undefined;
}

const round1 = (n: number) => Math.round(n * 10) / 10;

/**
 * Site-totaler (klik, visninger, CTR %, snit-position) for én måned.
 * `site` er en domæne-property på formen "sc-domain:horizen.dk".
 */
export async function fetchSearchConsoleMonth(site: string, month: string): Promise<SearchConsoleMetrics> {
  const row = (await query(site, month, { dimensions: [] }))?.[0];
  if (!row) return { clicks: 0, impressions: 0, ctr: 0, avgPosition: 0 };
  return {
    clicks: Math.round(row.clicks ?? 0),
    impressions: Math.round(row.impressions ?? 0),
    ctr: round1((row.ctr ?? 0) * 100),
    avgPosition: round1(row.position ?? 0),
  };
}

/**
 * De mest klikkede søgninger for én måned. Google skjuler sjældne/anonymiserede
 * søgninger, så summen af rækkerne er mindre end site-totalen. Det er forventet.
 */
export async function fetchSearchConsoleQueries(
  site: string,
  month: string,
  limit = 25,
): Promise<SearchConsoleQuery[]> {
  const rows = (await query(site, month, { dimensions: ["query"], rowLimit: limit })) ?? [];
  return rows.map((r) => ({
    query: r.keys?.[0] ?? "",
    clicks: Math.round(r.clicks ?? 0),
    impressions: Math.round(r.impressions ?? 0),
    ctr: round1((r.ctr ?? 0) * 100),
    position: round1(r.position ?? 0),
  }));
}
