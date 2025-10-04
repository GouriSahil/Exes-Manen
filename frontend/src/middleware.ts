import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get tokens from cookies or headers
  const accessToken = request.cookies.get("access_token")?.value;

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/signup", "/"];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Auth routes
  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/signup");

  // Protected routes
  const isProtectedRoute =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/expenses") ||
    pathname.startsWith("/approvals");

  // If no token and trying to access protected route, redirect to login
  if (!accessToken && isProtectedRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If has token and on auth pages, check role and redirect appropriately
  if (accessToken && isAuthRoute) {
    try {
      // Decode JWT to get user info (basic decode, not verification)
      const payload = JSON.parse(
        Buffer.from(accessToken.split(".")[1], "base64").toString()
      );

      // Get user role from localStorage or cookie
      // Note: In production, you should fetch this from the server
      const userRole = request.cookies.get("user_role")?.value;

      // Redirect authenticated users based on role
      if (userRole === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      } else {
        return NextResponse.redirect(new URL("/expenses", request.url));
      }
    } catch (error) {
      // If token is invalid, let them through to login
      console.error("Error decoding token:", error);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
};
