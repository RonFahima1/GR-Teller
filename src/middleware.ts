import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Skip middleware for static files and API routes
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/static')
  ) {
    return null;
  }

  const isAuthPage = request.nextUrl.pathname === "/login";

  // For auth pages, we'll let the client-side handle the redirect
  if (isAuthPage) {
    return null;
  }

  // For all other pages, we'll let the client-side handle the auth check
  // This prevents the redirection loop
  return null;
}

// Protect all routes under /app and the login page
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/clients/:path*",
    "/exchange/:path*",
    "/payout/:path*",
    "/settings/:path*",
    "/login",
  ],
}; 