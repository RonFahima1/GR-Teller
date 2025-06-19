import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { roleMiddleware } from "./middleware/roleMiddleware";

export async function middleware(request: NextRequest) {
  // Skip middleware for static files and API routes
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api/auth') ||
    request.nextUrl.pathname.startsWith('/static')
  ) {
    return null;
  }

  const token = await getToken({ req: request });
  const isAuthPage = request.nextUrl.pathname === "/login" || 
                    request.nextUrl.pathname === "/register";

  // Redirect authenticated users away from auth pages
  if (isAuthPage) {
    if (token) {
      // Redirect to appropriate dashboard based on role
      const userRole = token.role as string;
      let dashboardUrl = '/dashboard';
      
      switch (userRole) {
        case 'ORG_ADMIN':
          dashboardUrl = '/admin';
          break;
        case 'AGENT_ADMIN':
          dashboardUrl = '/manager';
          break;
        case 'AGENT_USER':
          dashboardUrl = '/teller';
          break;
        case 'COMPLIANCE_USER':
          dashboardUrl = '/compliance';
          break;
        case 'ORG_USER':
        default:
          dashboardUrl = '/dashboard';
      }
      
      return NextResponse.redirect(new URL(dashboardUrl, request.url));
    }
    return null;
  }

  // Use role-based middleware for protected routes
  return roleMiddleware(request);
}

// Protect all routes that require authentication and role-based access
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/manager/:path*",
    "/teller/:path*",
    "/compliance/:path*",
    "/onboarding/:path*",
    "/clients/:path*",
    "/exchange/:path*",
    "/payout/:path*",
    "/settings/:path*",
    "/login",
    "/register",
  ],
}; 