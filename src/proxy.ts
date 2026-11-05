import { NextResponse, type NextRequest } from "next/server";
import {
  DASHBOARD_EMAIL_HEADER,
  DASHBOARD_NAME_HEADER,
  DASHBOARD_USER_HEADER,
} from "./lib/dashboard-user";
import {
  SESSION_COOKIE,
  sessionSecret,
  verifySession,
  type DashboardRole,
} from "./lib/dashboard-session";

const WP_PATTERNS = [
  /^\/wp-admin/i,
  /^\/wp-login(\.php)?/i,
  /^\/wp-content\//i,
  /^\/wp-includes\//i,
  /^\/wp-json/i,
  /^\/xmlrpc\.php/i,
  /^\/wordpress/i,
  /^\/wp\/?$/i,
];

/**
 * Adgang til det interne SEO-dashboard (/dashboard), som i SanityPress-templaten:
 * kun Log ind med Sanity (signeret cookie fra /dashboard/login, se
 * src/lib/dashboard-session.ts). Kræver DASHBOARD_SESSION_SECRET. Uden den er
 * dashboardet åbent lokalt som Horizen, men LÅST i produktion (fail-closed).
 */
async function dashboardGate(
  request: NextRequest,
): Promise<{ deny: NextResponse } | { user: DashboardRole; name?: string; email?: string }> {
  const secret = sessionSecret();
  if (!secret && process.env.NODE_ENV !== "production") return { user: "horizen" };

  if (secret) {
    const session = await verifySession(request.cookies.get(SESSION_COOKIE)?.value, secret);
    if (session) return { user: session.role, name: session.name, email: session.email };
  }

  // Ikke logget ind
  if (request.method !== "GET") return { deny: NextResponse.json({ error: "login" }, { status: 401 }) };
  const { pathname, search } = request.nextUrl;
  const url = new URL("/dashboard/login", request.url);
  url.searchParams.set("next", pathname + search);
  return { deny: NextResponse.redirect(url) };
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard")) {
    // Hvem der er logget ind, sendes videre til siden (Horizen ser mere end
    // kunden). Headerne overskrives altid, så de ikke kan sættes udefra.
    const headers = new Headers(request.headers);
    headers.delete(DASHBOARD_USER_HEADER);
    headers.delete(DASHBOARD_NAME_HEADER);
    headers.delete(DASHBOARD_EMAIL_HEADER);
    if (pathname !== "/dashboard/login") {
      const gate = await dashboardGate(request);
      if ("deny" in gate) return gate.deny;
      headers.set(DASHBOARD_USER_HEADER, gate.user);
      if (gate.name) headers.set(DASHBOARD_NAME_HEADER, encodeURIComponent(gate.name));
      if (gate.email) headers.set(DASHBOARD_EMAIL_HEADER, gate.email);
    }
    return NextResponse.next({ request: { headers } });
  }

  // Gamle WordPress-adresser (bots og gamle links) får en venlig side
  if (WP_PATTERNS.some((re) => re.test(pathname))) {
    const url = request.nextUrl.clone();
    url.pathname = "/ikke-wordpress";
    url.search = "";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/wp-admin/:path*",
    "/wp-login.php",
    "/wp-login",
    "/wp-content/:path*",
    "/wp-includes/:path*",
    "/wp-json/:path*",
    "/xmlrpc.php",
    "/wordpress/:path*",
    "/wp",
    "/wp/:path*",
  ],
};
