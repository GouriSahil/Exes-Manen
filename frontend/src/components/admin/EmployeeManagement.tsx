"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores";
import {
  authService,
  Employee,
  CreateEmployeeRequest,
} from "@/services/authService";
import CustomSelect, { SelectOption } from "@/components/ui/CustomSelect";
import MultiSelect from "@/components/ui/MultiSelect";

interface EmployeeManagementProps {
  className?: string;
  onEditEmployee?: (employee: Employee) => void;
}

export default function EmployeeManagement({
  className = "",
  onEditEmployee,
}: EmployeeManagementProps) {
  const { user } = useAuthStore();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Filter and sort options
  const roleOptions: SelectOption[] = [
    { value: "all", label: "All Roles" },
    { value: "admin", label: "Admin" },
    { value: "employee", label: "Employee" },
  ];

  const statusOptions: SelectOption[] = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  const sortOptions: SelectOption[] = [
    { value: "name-asc", label: "Name A-Z" },
    { value: "name-desc", label: "Name Z-A" },
    { value: "email-asc", label: "Email A-Z" },
    { value: "email-desc", label: "Email Z-A" },
    { value: "role-asc", label: "Role A-Z" },
    { value: "role-desc", label: "Role Z-A" },
    { value: "last_login-desc", label: "Recent Login" },
    { value: "last_login-asc", label: "Oldest Login" },
  ];

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

  const handleSortChange = (value: string) => {
    const [field, order] = value.split("-");
    setSortBy(field);
    setSortOrder(order);
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
    try {
      const result = await authService.resetEmployeePassword(employeeId);
      alert(result.message);
      // Reload employees to get updated data
      await loadEmployees();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
    }
  };

  const handleBulkAction = async (
    action: "activate" | "deactivate" | "delete"
  ) => {
    if (selectedEmployees.length === 0) return;

    const confirmed = confirm(
      `Are you sure you want to ${action} ${selectedEmployees.length} employee(s)?`
    );
    if (!confirmed) return;

    try {
      for (const employeeId of selectedEmployees) {
        if (action === "activate" || action === "deactivate") {
          await authService.toggleEmployeeStatus(employeeId);
        }
        // Add delete functionality when backend supports it
      }
      setSelectedEmployees([]);
      setShowBulkActions(false);
      await loadEmployees();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : `Failed to ${action} employees`
      );
    }
  };

  const handleSelectEmployee = (employeeId: string) => {
    setSelectedEmployees((prev) =>
      prev.includes(employeeId)
        ? prev.filter((id) => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleSelectAll = () => {
    if (selectedEmployees.length === filteredEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(filteredEmployees.map((emp) => emp.id));
    }
  };

  // Filter and sort employees
  const filteredEmployees = employees
    .filter((employee) => {
      const matchesSearch =
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === "all" || employee.role === filterRole;
      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "active" && employee.is_active) ||
        (filterStatus === "inactive" && !employee.is_active);

      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "email":
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case "role":
          aValue = a.role;
          bValue = b.role;
          break;
        case "last_login":
          aValue = a.last_login ? new Date(a.last_login).getTime() : 0;
          bValue = b.last_login ? new Date(b.last_login).getTime() : 0;
          break;
        default:
          return 0;
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

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
      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
          <div className="flex items-center gap-2">
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
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {error}
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="card p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Results Info */}
          {searchTerm && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2 lg:mb-0">
              <svg
                className="h-4 w-4"
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
              <span>
                {filteredEmployees.length} of {employees.length} employees
                {searchTerm && ` matching "${searchTerm}"`}
              </span>
            </div>
          )}
          {/* Search */}
          <div className="flex-1">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-muted-foreground group-focus-within:text-primary-500 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search employees by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:border-primary-300 dark:hover:border-primary-600"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="min-w-[140px]">
              <CustomSelect
                options={roleOptions}
                value={filterRole}
                onChange={setFilterRole}
                placeholder="Filter by role"
                size="sm"
                variant="outline"
              />
            </div>

            <div className="min-w-[140px]">
              <CustomSelect
                options={statusOptions}
                value={filterStatus}
                onChange={setFilterStatus}
                placeholder="Filter by status"
                size="sm"
                variant="outline"
              />
            </div>

            <div className="min-w-[160px]">
              <CustomSelect
                options={sortOptions}
                value={`${sortBy}-${sortOrder}`}
                onChange={handleSortChange}
                placeholder="Sort by"
                size="sm"
                variant="outline"
              />
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {(searchTerm || filterRole !== "all" || filterStatus !== "all") && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Active filters:
              </span>
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 rounded-full text-xs">
                  Search: "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm("")}
                    className="ml-1 hover:text-primary-600 dark:hover:text-primary-300"
                  >
                    <svg
                      className="h-3 w-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </span>
              )}
              {filterRole !== "all" && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs">
                  Role: {filterRole}
                  <button
                    onClick={() => setFilterRole("all")}
                    className="ml-1 hover:text-blue-600 dark:hover:text-blue-300"
                  >
                    <svg
                      className="h-3 w-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </span>
              )}
              {filterStatus !== "all" && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs">
                  Status: {filterStatus}
                  <button
                    onClick={() => setFilterStatus("all")}
                    className="ml-1 hover:text-green-600 dark:hover:text-green-300"
                  >
                    <svg
                      className="h-3 w-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </span>
              )}
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterRole("all");
                  setFilterStatus("all");
                }}
                className="text-xs text-muted-foreground hover:text-foreground underline"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Selection */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <MultiSelect
              options={employees.map((emp) => ({
                value: emp.id,
                label: `${emp.name} (${emp.email})`,
              }))}
              value={selectedEmployees}
              onChange={setSelectedEmployees}
              placeholder="Select employees for bulk actions"
              searchable={true}
              maxDisplayed={2}
            />
          </div>
          {selectedEmployees.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction("activate")}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Activate ({selectedEmployees.length})
              </button>
              <button
                onClick={() => handleBulkAction("deactivate")}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Deactivate ({selectedEmployees.length})
              </button>
              <button
                onClick={() => setSelectedEmployees([])}
                className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Employees Table */}
      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading employees...</p>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <svg
              className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50"
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
            <p>No employees found matching your criteria.</p>
            {searchTerm || filterRole !== "all" || filterStatus !== "all" ? (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterRole("all");
                  setFilterStatus("all");
                }}
                className="mt-2 text-primary-600 hover:text-primary-700 text-sm"
              >
                Clear filters
              </button>
            ) : (
              <p className="text-sm">
                Create your first employee to get started.
              </p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectedEmployees.length === filteredEmployees.length &&
                        filteredEmployees.length > 0
                      }
                      onChange={handleSelectAll}
                      className="rounded border-border text-primary-600 focus:ring-primary-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredEmployees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedEmployees.includes(employee.id)}
                        onChange={() => handleSelectEmployee(employee.id)}
                        className="rounded border-border text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold text-sm">
                          {employee.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-foreground">
                            {employee.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {employee.email}
                          </div>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        {onEditEmployee && (
                          <button
                            onClick={() => onEditEmployee(employee)}
                            className="px-3 py-1 bg-purple-100 text-purple-700 rounded text-xs hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-200 dark:hover:bg-purple-800 transition-colors"
                          >
                            Edit
                          </button>
                        )}
                        {employee.id !== user?.id && (
                          <>
                            <button
                              onClick={() => handleToggleStatus(employee.id)}
                              className={`px-3 py-1 rounded text-xs transition-colors ${
                                employee.is_active
                                  ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
                                  : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800"
                              }`}
                            >
                              {employee.is_active ? "Deactivate" : "Activate"}
                            </button>
                            <button
                              onClick={() => handleResetPassword(employee.id)}
                              className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 transition-colors"
                            >
                              Reset Password
                            </button>
                          </>
                        )}
                      </div>
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