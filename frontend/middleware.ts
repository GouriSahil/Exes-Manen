import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected routes and their required roles
// Note: Routes are now in (authed) route group, so the actual paths remain the same
const protectedRoutes = {
  "/expenses": ["user", "admin"],
  "/approvals": ["user", "admin"],
  "/admin": ["admin"],
  "/profile": ["user", "admin"],
  "/reports": ["user", "admin"],
};

// Public routes that don't require authentication
const publicRoutes = [
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
];

// Helper function to get user from cookies
function getUserFromCookies(request: NextRequest) {
  try {
    // Check for auth-storage cookie (from Zustand persist)
    const authStorage = request.cookies.get("auth-storage");

    if (!authStorage) {
      return null;
    }

    const authData = JSON.parse(authStorage.value);

    // Check if user is authenticated and has valid data
    if (authData.state?.isAuthenticated && authData.state?.user) {
      return authData.state.user;
    }

    return null;
  } catch (error) {
    console.error("Error parsing auth cookie:", error);
    return null;
  }
}

// Helper function to check if route requires authentication
function isProtectedRoute(pathname: string): boolean {
  return Object.keys(protectedRoutes).some((route) =>
    pathname.startsWith(route)
  );
}

// Helper function to check if route is public
function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
}

// Helper function to check if user has required role for route
function hasRequiredRole(user: any, pathname: string): boolean {
  for (const [route, requiredRoles] of Object.entries(protectedRoutes)) {
    if (pathname.startsWith(route)) {
      return requiredRoles.includes(user.role);
    }
  }
  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files, API routes, and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes(".") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  // Get user from cookies
  const user = getUserFromCookies(request);

  // Handle public routes
  if (isPublicRoute(pathname)) {
    // If user is already authenticated and trying to access login/signup, redirect to home
    if (user && (pathname === "/login" || pathname === "/signup")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Handle protected routes
  if (isProtectedRoute(pathname)) {
    // If no user, redirect to login
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check if user has required role
    if (!hasRequiredRole(user, pathname)) {
      // Redirect to home page with error message
      const homeUrl = new URL("/", request.url);
      homeUrl.searchParams.set("error", "insufficient_permissions");
      return NextResponse.redirect(homeUrl);
    }
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
