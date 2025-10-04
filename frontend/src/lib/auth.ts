import { cookies } from "next/headers";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Get the current user from cookies (server-side)
 * This function can be used in server components and API routes
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const authStorage = cookieStore.get("auth-storage");

    if (!authStorage) {
      return null;
    }

    const authData = JSON.parse(authStorage.value);

    if (authData.state?.isAuthenticated && authData.state?.user) {
      return authData.state.user;
    }

    return null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * Check if the current user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}

/**
 * Check if the current user has admin role
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === "admin";
}

/**
 * Check if the current user has a specific role
 */
export async function hasRole(role: "user" | "admin"): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === role;
}

/**
 * Get user role
 */
export async function getUserRole(): Promise<"user" | "admin" | null> {
  const user = await getCurrentUser();
  return user?.role || null;
}

/**
 * Protected route configuration
 */
export const PROTECTED_ROUTES = {
  "/expenses": ["user", "admin"],
  "/approvals": ["user", "admin"],
  "/admin": ["admin"],
  "/profile": ["user", "admin"],
  "/reports": ["user", "admin"],
} as const;

/**
 * Public routes that don't require authentication
 */
export const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
] as const;

/**
 * Check if a route is protected
 */
export function isProtectedRoute(pathname: string): boolean {
  return Object.keys(PROTECTED_ROUTES).some((route) =>
    pathname.startsWith(route)
  );
}

/**
 * Check if a route is public
 */
export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
}

/**
 * Check if user has required role for a specific route
 */
export function hasRequiredRoleForRoute(
  user: User | null,
  pathname: string
): boolean {
  if (!user) return false;

  for (const [route, requiredRoles] of Object.entries(PROTECTED_ROUTES)) {
    if (pathname.startsWith(route)) {
      return (requiredRoles as readonly string[]).includes(user.role);
    }
  }
  return false;
}

/**
 * Get required roles for a specific route
 */
export function getRequiredRolesForRoute(pathname: string): string[] {
  for (const [route, requiredRoles] of Object.entries(PROTECTED_ROUTES)) {
    if (pathname.startsWith(route)) {
      return [...requiredRoles];
    }
  }
  return [];
}
