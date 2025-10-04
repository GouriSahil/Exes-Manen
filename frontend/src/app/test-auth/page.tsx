"use client";

import { useAuthStore } from "@/stores";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TestAuthPage() {
  const { user, isAuthenticated, logout, login } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginAsUser = async () => {
    setIsLoading(true);
    try {
      await login("user@example.com", "password123");
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginAsAdmin = async () => {
    setIsLoading(true);
    try {
      // Mock admin login by directly setting the user
      const adminUser = {
        id: "2",
        email: "admin@example.com",
        name: "Admin User",
        role: "admin" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Simulate the login process
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Directly update the store (for testing purposes)
      useAuthStore.setState({
        user: adminUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Admin login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const testProtectedRoute = (route: string) => {
    router.push(route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-secondary-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-900 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card p-8">
          <h1 className="text-3xl font-bold text-foreground mb-6">
            Authentication & Route Protection Test
          </h1>

          {/* Current Auth Status */}
          <div className="mb-8 p-6 bg-muted/50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">
              Current Authentication Status
            </h2>
            <div className="space-y-2">
              <p>
                <strong>Authenticated:</strong>{" "}
                {isAuthenticated ? "✅ Yes" : "❌ No"}
              </p>
              {user && (
                <>
                  <p>
                    <strong>User:</strong> {user.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Role:</strong> {user.role}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Login Buttons */}
          {!isAuthenticated && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                Login as Different Users
              </h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleLoginAsUser}
                  disabled={isLoading}
                  className="btn-primary flex items-center justify-center"
                >
                  {isLoading ? "Logging in..." : "Login as Regular User"}
                </button>
                <button
                  onClick={handleLoginAsAdmin}
                  disabled={isLoading}
                  className="btn-secondary flex items-center justify-center"
                >
                  {isLoading ? "Logging in..." : "Login as Admin"}
                </button>
              </div>
            </div>
          )}

          {/* Logout Button */}
          {isAuthenticated && (
            <div className="mb-8">
              <button onClick={handleLogout} className="btn-danger">
                Logout
              </button>
            </div>
          )}

          {/* Route Testing */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              Test Protected Routes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                onClick={() => testProtectedRoute("/expenses")}
                className="p-4 border border-border rounded-lg hover:bg-muted transition-colors text-left"
              >
                <h3 className="font-semibold">Expenses</h3>
                <p className="text-sm text-muted-foreground">
                  Requires: User or Admin
                </p>
              </button>

              <button
                onClick={() => testProtectedRoute("/approvals")}
                className="p-4 border border-border rounded-lg hover:bg-muted transition-colors text-left"
              >
                <h3 className="font-semibold">Approvals</h3>
                <p className="text-sm text-muted-foreground">
                  Requires: User or Admin
                </p>
              </button>

              <button
                onClick={() => testProtectedRoute("/admin")}
                className="p-4 border border-border rounded-lg hover:bg-muted transition-colors text-left"
              >
                <h3 className="font-semibold">Admin Panel</h3>
                <p className="text-sm text-muted-foreground">
                  Requires: Admin only
                </p>
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="p-6 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <h3 className="font-semibold mb-2">How to Test:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>
                Try accessing protected routes without logging in (should
                redirect to login)
              </li>
              <li>
                Login as a regular user and try accessing admin routes (should
                show permission error)
              </li>
              <li>Login as admin and verify you can access all routes</li>
              <li>
                Check the browser&apos;s network tab to see middleware redirects
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
