"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuthStore } from "@/stores";
import { authService, Employee } from "@/services/authService";
import EmployeeManagement from "@/components/admin/EmployeeManagement";
import EmployeeModal from "@/components/admin/EmployeeModal";

export default function AdminPage() {
  const { user, organization } = useAuthStore();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    pendingApprovals: 0,
    totalExpenses: 0,
  });
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      // Load employees
      const employeesResponse = await authService.getEmployees();
      setEmployees(employeesResponse.employees);

      // Calculate stats
      const totalEmployees = employeesResponse.employees.length;
      const activeEmployees = employeesResponse.employees.filter(
        (emp) => emp.is_active
      ).length;

      setStats({
        totalEmployees,
        activeEmployees,
        pendingApprovals: 0, // TODO: Connect to expenses API
        totalExpenses: 0, // TODO: Connect to expenses API
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setIsModalOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  const testAuth = async () => {
    try {
      console.log("=== AUTHENTICATION DEBUG TEST ===");
      console.log("1. Current user from store:", user);
      console.log("2. Auth token:", authService.getToken());
      console.log("3. Is authenticated:", authService.isAuthenticated());

      // Test basic endpoint
      console.log("4. Testing basic endpoint...");
      const basicResponse = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://192.168.29.141:8000"
        }/api/auth/test`
      );
      const basicData = await basicResponse.json();
      console.log("Basic endpoint response:", basicData);

      // Test auth endpoint
      console.log("5. Testing auth endpoint...");
      const authResponse = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://192.168.29.141:8000"
        }/api/auth/test-auth`,
        {
          headers: {
            Authorization: `Bearer ${authService.getToken()}`,
            "Content-Type": "application/json",
          },
        }
      );
      const authData = await authResponse.json();
      console.log("Auth endpoint response:", authData);

      // Test token debug endpoint
      console.log("6. Testing token debug endpoint...");
      const tokenResponse = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://192.168.29.141:8000"
        }/api/auth/debug-token`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authService.getToken()}`,
            "Content-Type": "application/json",
          },
        }
      );
      const tokenData = await tokenResponse.json();
      console.log("Token debug response:", tokenData);

      // Test current user endpoint
      console.log("7. Testing current user endpoint...");
      const currentUser = await authService.getCurrentUser();
      console.log("Current user from API:", currentUser);
    } catch (error) {
      console.error("Auth test failed:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });
    }
  };

  const testEmail = async () => {
    try {
      console.log("=== EMAIL TEST ===");
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://192.168.29.141:8000"
        }/api/auth/test-email`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authService.getToken()}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log("Email test response:", data);
      alert(`Email test: ${data.message || data.error}`);
    } catch (error) {
      console.error("Email test failed:", error);
      alert(
        `Email test failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const handleSaveEmployee = async (employeeData: any) => {
    try {
      setIsProcessing(true);

      // Debug: Check authentication status
      console.log("Current user:", user);
      console.log("User role:", user?.role);
      console.log("Auth token:", authService.getToken());
      console.log("Is authenticated:", authService.isAuthenticated());

      if (selectedEmployee) {
        console.log("Update employee:", employeeData);
      } else {
        // Create new employee (password will be generated automatically by backend)
        console.log("Creating employee with data:", {
          name: employeeData.name,
          email: employeeData.email,
        });

        await authService.createEmployee({
          name: employeeData.name,
          email: employeeData.email,
        });
      }

      // Reload employees
      await loadDashboardData();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving employee:", error);
      // Show user-friendly error message
      alert(
        `Failed to save employee: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Mock roles data - replace with actual roles from your system
  const roles = [
    { id: "1", name: "admin" },
    { id: "2", name: "employee" },
  ];

  return (
    <ProtectedRoute requiredRoles={["admin"]}>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-secondary-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-900 pt-20">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-8 animate-fadeInUp">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  Organization Dashboard
                </h1>
                <p className="text-muted-foreground text-lg">
                  Welcome back, {user?.name}! Here's what's happening at{" "}
                  {organization?.name}.
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleAddEmployee}
                  className="btn-primary flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add Employee
                </button>
                <button
                  onClick={testAuth}
                  className="btn-secondary flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Test Auth
                </button>
                <button
                  onClick={testEmail}
                  className="btn-secondary flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Test Email
                </button>
                <button className="btn-secondary flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  View Reports
                </button>
                <button className="btn-secondary flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Settings
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fadeInUp"
            style={{ animationDelay: "0.1s" }}
          >
            {/* Total Employees */}
            <div className="card p-6 hover:shadow-2xl transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">
                    {stats.totalEmployees}
                  </p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
              </div>
              <h3 className="text-sm font-medium text-foreground mb-1">
                Team Members
              </h3>
              <p className="text-xs text-muted-foreground">
                Active organization members
              </p>
            </div>

            {/* Active Employees */}
            <div className="card p-6 hover:shadow-2xl transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">
                    {stats.activeEmployees}
                  </p>
                  <p className="text-sm text-muted-foreground">Active</p>
                </div>
              </div>
              <h3 className="text-sm font-medium text-foreground mb-1">
                Active Users
              </h3>
              <p className="text-xs text-muted-foreground">
                Currently active accounts
              </p>
            </div>

            {/* Pending Approvals */}
            <div className="card p-6 hover:shadow-2xl transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">
                    {stats.pendingApprovals}
                  </p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
              <h3 className="text-sm font-medium text-foreground mb-1">
                Pending Approvals
              </h3>
              <p className="text-xs text-muted-foreground">
                Awaiting your review
              </p>
            </div>

            {/* Total Expenses */}
            <div className="card p-6 hover:shadow-2xl transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">
                    ${stats.totalExpenses.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {organization?.currency_code || "USD"}
                  </p>
                </div>
              </div>
              <h3 className="text-sm font-medium text-foreground mb-1">
                Total Expenses
              </h3>
              <p className="text-xs text-muted-foreground">All time expenses</p>
            </div>
          </div>

          {/* Main Content Grid */}
          <EmployeeManagement onEditEmployee={handleEditEmployee} />

          {/* Employee Modal */}
          <EmployeeModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            employee={selectedEmployee}
            roles={roles}
            onSave={handleSaveEmployee}
            isProcessing={isProcessing}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}