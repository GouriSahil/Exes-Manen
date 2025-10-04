"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import EmployeeManagement from "@/components/admin/EmployeeManagement";

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRoles={["admin"]}>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-secondary-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-900 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Organization Admin
            </h1>
            <p className="text-muted-foreground">
              Manage your organization's employees and settings.
            </p>
          </div>

          {/* Employee Management */}
          <EmployeeManagement />
        </div>
      </div>
    </ProtectedRoute>
  );
}
