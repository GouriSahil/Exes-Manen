"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores";
import {
  authService,
  Employee,
  CreateEmployeeRequest,
} from "@/services/authService";

interface EmployeeManagementProps {
  className?: string;
}

export default function EmployeeManagement({
  className = "",
}: EmployeeManagementProps) {
  const { user } = useAuthStore();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Form state for creating new employee
  const [createForm, setCreateForm] = useState<CreateEmployeeRequest>({
    email: "",
    name: "",
    password: "",
  });

  // Load employees on component mount
  useEffect(() => {
    if (user?.role === "admin") {
      loadEmployees();
    }
  }, [user]);

  const loadEmployees = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authService.getEmployees();
      setEmployees(response.employees);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load employees");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!createForm.email || !createForm.name || !createForm.password) {
      setError("All fields are required");
      return;
    }

    try {
      setIsCreating(true);
      setError(null);

      await authService.createEmployee(createForm);

      // Reset form and reload employees
      setCreateForm({ email: "", name: "", password: "" });
      setShowCreateForm(false);
      await loadEmployees();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create employee"
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleStatus = async (employeeId: string) => {
    try {
      await authService.toggleEmployeeStatus(employeeId);
      await loadEmployees(); // Reload to get updated status
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update employee status"
      );
    }
  };

  const handleResetPassword = async (employeeId: string) => {
    const newPassword = prompt("Enter new password for employee:");
    if (!newPassword) return;

    try {
      await authService.resetEmployeePassword(employeeId, newPassword);
      alert("Password reset successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
    }
  };

  if (user?.role !== "admin") {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">
          Access denied. Admin privileges required.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Employee Management
          </h2>
          <p className="text-muted-foreground">
            Manage your organization's employees
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          {showCreateForm ? "Cancel" : "Add Employee"}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Create Employee Form */}
      {showCreateForm && (
        <div className="p-6 bg-white dark:bg-neutral-800 rounded-lg border border-border">
          <h3 className="text-lg font-semibold mb-4">Create New Employee</h3>
          <form onSubmit={handleCreateEmployee} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Name
              </label>
              <input
                type="text"
                value={createForm.name}
                onChange={(e) =>
                  setCreateForm({ ...createForm, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Employee name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Email
              </label>
              <input
                type="email"
                value={createForm.email}
                onChange={(e) =>
                  setCreateForm({ ...createForm, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Employee email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Password
              </label>
              <input
                type="password"
                value={createForm.password}
                onChange={(e) =>
                  setCreateForm({ ...createForm, password: e.target.value })
                }
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Temporary password"
                required
              />
              <p className="text-sm text-muted-foreground mt-1">
                Employee will use this password to login initially
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={isCreating}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
              >
                {isCreating ? "Creating..." : "Create Employee"}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Employees List */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg border border-border">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold">
            Employees ({employees.length})
          </h3>
        </div>

        {isLoading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading employees...</p>
          </div>
        ) : employees.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            No employees found. Create your first employee to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-neutral-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {employees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="hover:bg-gray-50 dark:hover:bg-neutral-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {employee.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {employee.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          employee.role === "admin"
                            ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        }`}
                      >
                        {employee.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          employee.is_active
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {employee.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {employee.last_login
                        ? new Date(employee.last_login).toLocaleDateString()
                        : "Never"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {employee.id !== user?.id && (
                        <>
                          <button
                            onClick={() => handleToggleStatus(employee.id)}
                            className={`px-3 py-1 rounded text-xs ${
                              employee.is_active
                                ? "bg-red-100 text-red-700 hover:bg-red-200"
                                : "bg-green-100 text-green-700 hover:bg-green-200"
                            }`}
                          >
                            {employee.is_active ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            onClick={() => handleResetPassword(employee.id)}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
                          >
                            Reset Password
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
