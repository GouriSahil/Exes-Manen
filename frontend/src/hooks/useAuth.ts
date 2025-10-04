"use client";

import { useAuthStore } from "@/stores";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

interface UseAuthOptions {
  redirectTo?: string;
  requiredRoles?: ("admin" | "employee")[];
}

/**
 * Hook for authentication checks and redirects
 */
export function useAuth(options: UseAuthOptions = {}) {
  const { redirectTo = "/login", requiredRoles = ["admin", "employee"] } =
    options;
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't redirect while loading
    if (isLoading) return;

    // If not authenticated, redirect to login
    if (!isAuthenticated || !user) {
      const loginUrl = new URL(redirectTo, window.location.origin);
      loginUrl.searchParams.set("redirect", pathname);
      router.push(loginUrl.toString());
      return;
    }

    // Check if user has required role
    if (!requiredRoles.includes(user.role)) {
      const homeUrl = new URL("/", window.location.origin);
      homeUrl.searchParams.set("error", "insufficient_permissions");
      router.push(homeUrl.toString());
      return;
    }
  }, [
    isAuthenticated,
    user,
    isLoading,
    requiredRoles,
    redirectTo,
    pathname,
    router,
  ]);

  return {
    user,
    isAuthenticated,
    isLoading,
    hasRole: (role: "admin" | "employee") => user?.role === role,
    isAdmin: user?.role === "admin",
    isEmployee: user?.role === "employee",
  };
}

/**
 * Hook for admin-only access
 */
export function useAdminAuth() {
  return useAuth({ requiredRoles: ["admin"] });
}

/**
 * Hook for user access (includes admin)
 */
export function useUserAuth() {
  return useAuth({ requiredRoles: ["employee", "admin"] });
}

/**
 * Hook to check if user can access a specific route
 */
export function useRouteAccess(pathname: string) {
  const { user, isAuthenticated } = useAuthStore();

  const canAccess = () => {
    if (!isAuthenticated || !user) return false;

    // Define route access rules
    const routeRules: Record<string, ("employee" | "admin")[]> = {
      "/expenses": ["employee", "admin"],
      "/approvals": ["employee", "admin"],
      "/admin": ["admin"],
      "/profile": ["employee", "admin"],
      "/reports": ["employee", "admin"],
    };

    for (const [route, allowedRoles] of Object.entries(routeRules)) {
      if (pathname.startsWith(route)) {
        return allowedRoles.includes(user.role);
      }
    }

    return true; // Allow access to other routes
  };

  return {
    canAccess: canAccess(),
    user,
    isAuthenticated,
  };
}
