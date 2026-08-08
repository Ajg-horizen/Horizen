import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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
 * Adgangskode-port for det interne dashboard (/dashboard).
 * Beskyttelsen er kun aktiv når DASHBOARD_PASSWORD er sat (fx i Vercel).
 * Uden env-var (lokal dev) er dashboardet åbent, så vi kan arbejde.
 * Brugernavn er fast "horizen"; adgangskoden ligger i env-var.
 * noindex/robots holder det ude af Google — dette holder folk ude af selve siden.
 */
function denyDashboardAccess(request: NextRequest): NextResponse | null {
  const password = process.env.DASHBOARD_PASSWORD;
  if (!password) return null;

  const auth = request.headers.get("authorization");
  const expected = "Basic " + btoa(`horizen:${password}`);
  if (auth === expected) return null;

  return new NextResponse("Adgang kræver login.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Horizen Dashboard", charset="UTF-8"',
    },
  });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard")) {
    const denied = denyDashboardAccess(request);
    if (denied) return denied;
    return NextResponse.next();
  }

  if (WP_PATTERNS.some((pattern) => pattern.test(pathname))) {
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
