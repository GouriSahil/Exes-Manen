"use client";

import { useState } from "react";

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department: string;
  status: "active" | "inactive";
  createdAt: string;
  temporaryPassword?: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isCustom: boolean;
  employeeCount: number;
}

interface Team {
  id: string;
  name: string;
  description: string;
  teamLeader: string;
  teamLeaderName: string;
  members: string[];
  memberCount: number;
  department: string;
  createdAt: string;
}

// Mock data - replace with actual API calls
const mockEmployees: Employee[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@company.com",
    role: "Manager",
    department: "Engineering",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@company.com",
    role: "Team Leader",
    department: "Marketing",
    status: "active",
    createdAt: "2024-01-10",
  },
  {
    id: "3",
    firstName: "Mike",
    lastName: "Johnson",
    email: "mike.johnson@company.com",
    role: "Member",
    department: "Sales",
    status: "active",
    createdAt: "2024-01-20",
  },
];

const mockRoles: Role[] = [
  {
    id: "1",
    name: "Member",
    description: "Basic employee with standard permissions",
    permissions: ["view_expenses", "create_expenses", "edit_own_expenses"],
    isCustom: false,
    employeeCount: 15,
  },
  {
    id: "2",
    name: "Team Leader",
    description: "Can manage team expenses and approve submissions",
    permissions: [
      "view_expenses",
      "create_expenses",
      "edit_own_expenses",
      "approve_expenses",
      "view_team_expenses",
    ],
    isCustom: false,
    employeeCount: 5,
  },
  {
    id: "3",
    name: "Manager",
    description: "Full management access with approval rights",
    permissions: [
      "view_expenses",
      "create_expenses",
      "edit_own_expenses",
      "approve_expenses",
      "view_team_expenses",
      "manage_employees",
      "view_reports",
    ],
    isCustom: false,
    employeeCount: 3,
  },
  {
    id: "4",
    name: "Finance Specialist",
    description: "Specialized role for financial operations",
    permissions: [
      "view_expenses",
      "approve_expenses",
      "view_all_expenses",
      "generate_reports",
      "manage_budgets",
    ],
    isCustom: true,
    employeeCount: 2,
  },
];

const mockTeams: Team[] = [
  {
    id: "1",
    name: "Frontend Development",
    description: "Responsible for user interface and user experience development",
    teamLeader: "1",
    teamLeaderName: "John Doe",
    members: ["1", "2"],
    memberCount: 2,
    department: "Engineering",
    createdAt: "2024-01-10",
  },
  {
    id: "2",
    name: "Digital Marketing",
    description: "Handles all digital marketing campaigns and social media",
    teamLeader: "2",
    teamLeaderName: "Jane Smith",
    members: ["2", "3"],
    memberCount: 2,
    department: "Marketing",
    createdAt: "2024-01-12",
  },
  {
    id: "3",
    name: "Sales Operations",
    description: "Manages sales processes and customer relationships",
    teamLeader: "3",
    teamLeaderName: "Mike Johnson",
    members: ["3"],
    memberCount: 1,
    department: "Sales",
    createdAt: "2024-01-15",
  },
];

const departments = [
  "Engineering",
  "Marketing",
  "Sales",
  "HR",
  "Finance",
  "Operations",
];
const availablePermissions = [
  "view_expenses",
  "create_expenses",
  "edit_own_expenses",
  "edit_all_expenses",
  "approve_expenses",
  "view_team_expenses",
  "view_all_expenses",
  "manage_employees",
  "view_reports",
  "generate_reports",
  "manage_budgets",
  "admin_access",
];

export default function AdminPage() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [teams, setTeams] = useState<Team[]>(mockTeams);
  const [activeTab, setActiveTab] = useState<"employees" | "roles" | "teams">(
    "employees"
  );
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState<string>("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newEmployeeData, setNewEmployeeData] = useState<Employee | null>(null);

  // Password generation function
  const generateRandomPassword = (): string => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*";

    let password = "";

    // Ensure at least one character from each category
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    // Fill the rest randomly
    const allChars = uppercase + lowercase + numbers + symbols;
    for (let i = 4; i < 12; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password
    return password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
  };

  // Employee form state
  const [employeeForm, setEmployeeForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    department: "",
    status: "active" as "active" | "inactive",
  });

  // Role form state
  const [roleForm, setRoleForm] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
  });

  // Team form state
  const [teamForm, setTeamForm] = useState({
    name: "",
    description: "",
    teamLeader: "",
    department: "",
    members: [] as string[],
  });

  const handleCreateEmployee = async () => {
    if (
      !employeeForm.firstName ||
      !employeeForm.lastName ||
      !employeeForm.email ||
      !employeeForm.role ||
      !employeeForm.department
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsProcessing(true);
    try {
      // Generate random password
      const tempPassword = generateRandomPassword();
      setGeneratedPassword(tempPassword);

      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newEmployee: Employee = {
        id: Date.now().toString(),
        ...employeeForm,
        createdAt: new Date().toISOString().split("T")[0],
        temporaryPassword: tempPassword,
      };

      // TODO: Send email notification with login credentials
      await sendEmployeeWelcomeEmail(newEmployee, tempPassword);

      setEmployees((prev) => [...prev, newEmployee]);
      setNewEmployeeData(newEmployee);
      setShowEmployeeModal(false);
      setShowPasswordModal(true);
      setEmployeeForm({
        firstName: "",
        lastName: "",
        email: "",
        role: "",
        department: "",
        status: "active",
      });
    } catch (error) {
      console.error("Error creating employee:", error);
      alert("Failed to create employee. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const sendEmployeeWelcomeEmail = async (
    employee: Employee,
    password: string
  ) => {
    try {
      // TODO: Replace with actual email service API call
      console.log("Sending welcome email to:", employee.email);
      console.log("Email content:", {
        to: employee.email,
        subject: "Welcome to Exes Manen - Your Account Details",
        body: `
Dear ${employee.firstName} ${employee.lastName},

Welcome to Exes Manen! Your account has been created successfully.

Your login credentials:
Email: ${employee.email}
Temporary Password: ${password}

Please log in and change your password immediately for security reasons.

Your role: ${employee.role}
Department: ${employee.department}

Best regards,
The Exes Manen Team
        `,
      });

      // Simulate email sending
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error("Error sending welcome email:", error);
      // Don't throw error here as employee creation should still succeed
    }
  };

  const handleCreateRole = async () => {
    if (
      !roleForm.name ||
      !roleForm.description ||
      roleForm.permissions.length === 0
    ) {
      alert(
        "Please fill in all required fields and select at least one permission."
      );
      return;
    }

    setIsProcessing(true);
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newRole: Role = {
        id: Date.now().toString(),
        ...roleForm,
        isCustom: true,
        employeeCount: 0,
      };

      setRoles((prev) => [...prev, newRole]);
      setShowRoleModal(false);
      setRoleForm({
        name: "",
        description: "",
        permissions: [],
      });
    } catch (error) {
      console.error("Error creating role:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    setIsProcessing(true);
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setEmployees((prev) => prev.filter((emp) => emp.id !== employeeId));
    } catch (error) {
      console.error("Error deleting employee:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    const role = roles.find((r) => r.id === roleId);
    if (role && role.employeeCount > 0) {
      alert("Cannot delete role that is assigned to employees.");
      return;
    }

    if (!confirm("Are you sure you want to delete this role?")) return;

    setIsProcessing(true);
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setRoles((prev) => prev.filter((role) => role.id !== roleId));
    } catch (error) {
      console.error("Error deleting role:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateTeam = async () => {
    if (
      !teamForm.name ||
      !teamForm.description ||
      !teamForm.teamLeader ||
      !teamForm.department
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsProcessing(true);
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const teamLeader = employees.find((emp) => emp.id === teamForm.teamLeader);
      const newTeam: Team = {
        id: Date.now().toString(),
        name: teamForm.name,
        description: teamForm.description,
        teamLeader: teamForm.teamLeader,
        teamLeaderName: teamLeader ? `${teamLeader.firstName} ${teamLeader.lastName}` : "",
        members: teamForm.members,
        memberCount: teamForm.members.length,
        department: teamForm.department,
        createdAt: new Date().toISOString().split("T")[0],
      };

      setTeams((prev) => [...prev, newTeam]);
      setShowTeamModal(false);
      setTeamForm({
        name: "",
        description: "",
        teamLeader: "",
        department: "",
        members: [],
      });
    } catch (error) {
      console.error("Error creating team:", error);
      alert("Failed to create team. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    if (!confirm("Are you sure you want to delete this team?")) return;

    setIsProcessing(true);
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setTeams((prev) => prev.filter((team) => team.id !== teamId));
    } catch (error) {
      console.error("Error deleting team:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const openEmployeeModal = (employee?: Employee) => {
    if (employee) {
      setEditingEmployee(employee);
      setEmployeeForm({
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        role: employee.role,
        department: employee.department,
        status: employee.status,
      });
    } else {
      setEditingEmployee(null);
      setEmployeeForm({
        firstName: "",
        lastName: "",
        email: "",
        role: "",
        department: "",
        status: "active",
      });
    }
    setShowEmployeeModal(true);
  };

  const openRoleModal = (role?: Role) => {
    if (role) {
      setEditingRole(role);
      setRoleForm({
        name: role.name,
        description: role.description,
        permissions: role.permissions,
      });
    } else {
      setEditingRole(null);
      setRoleForm({
        name: "",
        description: "",
        permissions: [],
      });
    }
    setShowRoleModal(true);
  };

  const openTeamModal = (team?: Team) => {
    if (team) {
      setEditingTeam(team);
      setTeamForm({
        name: team.name,
        description: team.description,
        teamLeader: team.teamLeader,
        department: team.department,
        members: team.members,
      });
    } else {
      setEditingTeam(null);
      setTeamForm({
        name: "",
        description: "",
        teamLeader: "",
        department: "",
        members: [],
      });
    }
    setShowTeamModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-secondary-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Organization Admin
          </h1>
          <p className="text-muted-foreground">
            Manage employees, roles, and organizational settings.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-foreground">
                  {employees.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Employees
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600"
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
              <div className="ml-4">
                <div className="text-2xl font-bold text-foreground">
                  {employees.filter((emp) => emp.status === "active").length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Active Employees
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-foreground">
                  {roles.length}
                </div>
                <div className="text-sm text-muted-foreground">Total Roles</div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-foreground">
                  {new Set(employees.map((emp) => emp.department)).size}
                </div>
                <div className="text-sm text-muted-foreground">Departments</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="card p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex space-x-1 bg-muted p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("employees")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "employees"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Employees
              </button>
              <button
                onClick={() => setActiveTab("roles")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "roles"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Roles
              </button>
            </div>

            <button
              onClick={() =>
                activeTab === "employees"
                  ? openEmployeeModal()
                  : openRoleModal()
              }
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              {activeTab === "employees" ? "Add Employee" : "Create Role"}
            </button>
          </div>

          {/* Employees Tab */}
          {activeTab === "employees" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Role
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Department
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-foreground">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Created
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr
                      key={employee.id}
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="font-medium text-foreground">
                          {employee.firstName} {employee.lastName}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-muted-foreground">
                          {employee.email}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-foreground">{employee.role}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-muted-foreground">
                          {employee.department}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            employee.status === "active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                              : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                          }`}
                        >
                          {employee.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-muted-foreground">
                          {new Date(employee.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => openEmployeeModal(employee)}
                            className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteEmployee(employee.id)}
                            disabled={isProcessing}
                            className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Roles Tab */}
          {activeTab === "roles" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Role Name
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Description
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-foreground">
                      Type
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-foreground">
                      Employees
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-foreground">
                      Permissions
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map((role) => (
                    <tr
                      key={role.id}
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="font-medium text-foreground">
                          {role.name}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-muted-foreground max-w-xs truncate">
                          {role.description}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            role.isCustom
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                          }`}
                        >
                          {role.isCustom ? "Custom" : "Default"}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="text-foreground font-medium">
                          {role.employeeCount}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="text-muted-foreground">
                          {role.permissions.length}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => openRoleModal(role)}
                            className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs font-medium"
                          >
                            Edit
                          </button>
                          {role.isCustom && (
                            <button
                              onClick={() => handleDeleteRole(role.id)}
                              disabled={isProcessing || role.employeeCount > 0}
                              className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium"
                            >
                              Delete
                            </button>
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

        {/* Employee Modal */}
        {showEmployeeModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-background rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                {editingEmployee ? "Edit Employee" : "Add New Employee"}
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={employeeForm.firstName}
                      onChange={(e) =>
                        setEmployeeForm((prev) => ({
                          ...prev,
                          firstName: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background text-foreground"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={employeeForm.lastName}
                      onChange={(e) =>
                        setEmployeeForm((prev) => ({
                          ...prev,
                          lastName: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background text-foreground"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={employeeForm.email}
                    onChange={(e) =>
                      setEmployeeForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background text-foreground"
                    placeholder="Enter email address"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    A random password will be generated and sent to this email
                    address
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Role *
                  </label>
                  <select
                    value={employeeForm.role}
                    onChange={(e) =>
                      setEmployeeForm((prev) => ({
                        ...prev,
                        role: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background text-foreground"
                  >
                    <option value="">Select a role</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.name}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Department *
                  </label>
                  <select
                    value={employeeForm.department}
                    onChange={(e) =>
                      setEmployeeForm((prev) => ({
                        ...prev,
                        department: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background text-foreground"
                  >
                    <option value="">Select a department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Status
                  </label>
                  <select
                    value={employeeForm.status}
                    onChange={(e) =>
                      setEmployeeForm((prev) => ({
                        ...prev,
                        status: e.target.value as "active" | "inactive",
                      }))
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background text-foreground"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowEmployeeModal(false)}
                  className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateEmployee}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing
                    ? "Saving..."
                    : editingEmployee
                    ? "Update Employee"
                    : "Create Employee"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Role Modal */}
        {showRoleModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-background rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                {editingRole ? "Edit Role" : "Create New Role"}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Role Name *
                  </label>
                  <input
                    type="text"
                    value={roleForm.name}
                    onChange={(e) =>
                      setRoleForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background text-foreground"
                    placeholder="Enter role name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description *
                  </label>
                  <textarea
                    value={roleForm.description}
                    onChange={(e) =>
                      setRoleForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background text-foreground resize-none"
                    placeholder="Enter role description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Permissions *
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-border rounded-lg p-3">
                    {availablePermissions.map((permission) => (
                      <label
                        key={permission}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          checked={roleForm.permissions.includes(permission)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setRoleForm((prev) => ({
                                ...prev,
                                permissions: [...prev.permissions, permission],
                              }));
                            } else {
                              setRoleForm((prev) => ({
                                ...prev,
                                permissions: prev.permissions.filter(
                                  (p) => p !== permission
                                ),
                              }));
                            }
                          }}
                          className="rounded border-border text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-foreground">
                          {permission.replace(/_/g, " ")}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowRoleModal(false)}
                  className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateRole}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing
                    ? "Saving..."
                    : editingRole
                    ? "Update Role"
                    : "Create Role"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Password Display Modal */}
        {showPasswordModal && newEmployeeData && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-background rounded-lg p-6 w-full max-w-md">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
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
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Employee Created Successfully!
                </h3>
                <p className="text-muted-foreground mb-4">
                  A welcome email with login credentials has been sent to{" "}
                  <span className="font-medium text-foreground">
                    {newEmployeeData.email}
                  </span>
                </p>
              </div>

              <div className="bg-muted rounded-lg p-4 mb-4">
                <h4 className="font-medium text-foreground mb-2">
                  Login Credentials:
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Email:</span>
                    <span className="ml-2 font-mono text-foreground">
                      {newEmployeeData.email}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      Temporary Password:
                    </span>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="font-mono text-foreground bg-background px-2 py-1 rounded border">
                        {generatedPassword}
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(generatedPassword);
                          // You could add a toast notification here
                        }}
                        className="text-primary hover:text-primary/80 transition-colors"
                        title="Copy password"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4">
                <div className="flex items-start space-x-2">
                  <svg
                    className="w-5 h-5 text-yellow-600 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  <div className="text-sm">
                    <p className="font-medium text-yellow-800 dark:text-yellow-200">
                      Important Security Note
                    </p>
                    <p className="text-yellow-700 dark:text-yellow-300 mt-1">
                      The employee should change their password immediately
                      after first login.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setNewEmployeeData(null);
                    setGeneratedPassword("");
                  }}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
