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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
