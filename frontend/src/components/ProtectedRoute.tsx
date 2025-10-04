"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: ("admin" | "employee")[];
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  requiredRoles = ["admin", "employee"],
  fallback = null,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Wait for auth state to be loaded
    if (isLoading) {
      return;
    }

    setIsChecking(false);

    // If not authenticated, redirect to login
    if (!isAuthenticated || !user) {
      const loginUrl = new URL(redirectTo, window.location.origin);
      loginUrl.searchParams.set("redirect", pathname);
      router.push(loginUrl.toString());
      return;
    }

    // Check if user has required role
    if (!requiredRoles.includes(user.role)) {
      // Redirect to home with error message
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

  // Show loading state while checking authentication
  if (isLoading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated or doesn't have required role, show fallback
  if (!isAuthenticated || !user || !requiredRoles.includes(user.role)) {
    return fallback;
  }

  // User is authenticated and has required role
  return <>{children}</>;
}

// Convenience components for common use cases
export function AdminOnly({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRoles={["admin"]} fallback={fallback}>
      {children}
    </ProtectedRoute>
  );
}

export function UserOnly({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRoles={["employee", "admin"]} fallback={fallback}>
      {children}
    </ProtectedRoute>
  );
}
