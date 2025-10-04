"use client";

import { useState } from "react";
import { Employee, Role, Team } from "@/types/employee";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { generateRandomPassword } from "@/utils/password";
import { getCurrentDateString } from "@/utils/date";
import {
  sendEmployeeWelcomeEmail,
  sendPasswordResetEmail,
} from "@/services/emailService";
import {
  mockEmployees,
  mockRoles,
  mockTeams,
  departments,
  availablePermissions,
} from "@/constants/admin";

// Components
import SummaryStats from "@/components/admin/SummaryStats";
import EmployeeTable from "@/components/admin/EmployeeTable";
import RoleTable from "@/components/admin/RoleTable";
import TeamTable from "@/components/admin/TeamTable";
import EmployeeModal from "@/components/admin/EmployeeModal";
import RoleModal from "@/components/admin/RoleModal";
import TeamModal from "@/components/admin/TeamModal";
import PasswordResetModal from "@/components/admin/PasswordResetModal";
import PasswordResetNotification from "@/components/admin/PasswordResetNotification";
import DeleteConfirmModal from "@/components/ui/DeleteConfirmModal";

export default function AdminPage() {
  // State management
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [teams, setTeams] = useState<Team[]>(mockTeams);
  const [activeTab, setActiveTab] = useState<"employees" | "roles" | "teams">(
    "employees"
  );
  const [isProcessing, setIsProcessing] = useState(false);

  // Modal state
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  // Password reset state
  const [generatedPassword, setGeneratedPassword] = useState<string>("");
  const [showResetPasswordInfo, setShowResetPasswordInfo] = useState(false);
  const [resetPasswordEmployee, setResetPasswordEmployee] =
    useState<Employee | null>(null);
  const [showResetPasswordConfirmModal, setShowResetPasswordConfirmModal] =
    useState(false);
  const [employeeToReset, setEmployeeToReset] = useState<Employee | null>(null);

  // Delete confirmation state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState<{
    type: "employee" | "role" | "team";
    id: string;
    name: string;
  } | null>(null);

  // Employee actions
  const handleResetPassword = (employee: Employee) => {
    setEmployeeToReset(employee);
    setShowResetPasswordConfirmModal(true);
  };

  const confirmResetPassword = async () => {
    if (!employeeToReset) return;

    setIsProcessing(true);
    try {
      const newPassword = generateRandomPassword();
      setGeneratedPassword(newPassword);

      // TODO: Replace with actual API call to update employee password
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update employee with new temporary password
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === employeeToReset.id
            ? { ...emp, temporaryPassword: newPassword }
            : emp
        )
      );

      // Send password reset email
      await sendPasswordResetEmail(employeeToReset, newPassword);

      setResetPasswordEmployee(employeeToReset);
      setShowResetPasswordInfo(true);
      setShowResetPasswordConfirmModal(false);
      setEmployeeToReset(null);
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("Failed to reset password. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Delete handlers - show confirmation modal
  const handleDeleteEmployee = (employee: Employee) => {
    setDeleteItem({
      type: "employee",
      id: employee.id,
      name: `${employee.firstName} ${employee.lastName}`,
    });
    setShowDeleteModal(true);
  };

  const handleDeleteRole = (role: Role) => {
    if (role.employeeCount > 0) {
      alert("Cannot delete role that is assigned to employees.");
      return;
    }
    setDeleteItem({
      type: "role",
      id: role.id,
      name: role.name,
    });
    setShowDeleteModal(true);
  };

  const handleDeleteTeam = (team: Team) => {
    setDeleteItem({
      type: "team",
      id: team.id,
      name: team.name,
    });
    setShowDeleteModal(true);
  };

  // Confirm delete action
  const confirmDelete = async () => {
    if (!deleteItem) return;

    setIsProcessing(true);
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      switch (deleteItem.type) {
        case "employee":
          setEmployees((prev) =>
            prev.filter((emp) => emp.id !== deleteItem.id)
          );
          break;
        case "role":
          setRoles((prev) => prev.filter((role) => role.id !== deleteItem.id));
          break;
        case "team":
          setTeams((prev) => prev.filter((team) => team.id !== deleteItem.id));
          break;
      }

      setShowDeleteModal(false);
      setDeleteItem(null);
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Edit handlers
  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowEmployeeModal(true);
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setShowRoleModal(true);
  };

  const handleEditTeam = (team: Team) => {
    setEditingTeam(team);
    setShowTeamModal(true);
  };

  // Add handlers
  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setShowEmployeeModal(true);
  };

  const handleAddRole = () => {
    setEditingRole(null);
    setShowRoleModal(true);
  };

  const handleAddTeam = () => {
    setEditingTeam(null);
    setShowTeamModal(true);
  };

  // Save handlers
  const handleSaveEmployee = async (employeeData: Partial<Employee>) => {
    setIsProcessing(true);
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (editingEmployee) {
        // Update existing employee
        setEmployees((prev) =>
          prev.map((emp) =>
            emp.id === editingEmployee.id ? { ...emp, ...employeeData } : emp
          )
        );
      } else {
        // Create new employee
        const newPassword = generateRandomPassword();
        const newEmployee: Employee = {
          ...(employeeData as Employee),
          id: `emp_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: getCurrentDateString(),
          temporaryPassword: newPassword,
        };

        // Send welcome email
        await sendEmployeeWelcomeEmail(newEmployee, newPassword);

        setEmployees((prev) => [...prev, newEmployee]);
      }

      setShowEmployeeModal(false);
      setEditingEmployee(null);
    } catch (error) {
      console.error("Error saving employee:", error);
      alert("Failed to save employee. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveRole = async (roleData: Partial<Role>) => {
    setIsProcessing(true);
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (editingRole) {
        // Update existing role
        setRoles((prev) =>
          prev.map((role) =>
            role.id === editingRole.id ? { ...role, ...roleData } : role
          )
        );
      } else {
        // Create new role
        const newRole: Role = {
          ...(roleData as Role),
          id: `role_${Math.random().toString(36).substr(2, 9)}`,
          isCustom: true,
          employeeCount: 0,
        };
        setRoles((prev) => [...prev, newRole]);
      }

      setShowRoleModal(false);
      setEditingRole(null);
    } catch (error) {
      console.error("Error saving role:", error);
      alert("Failed to save role. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveTeam = async (teamData: Partial<Team>) => {
    setIsProcessing(true);
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (editingTeam) {
        // Update existing team
        setTeams((prev) =>
          prev.map((team) =>
            team.id === editingTeam.id ? { ...team, ...teamData } : team
          )
        );
      } else {
        // Create new team
        const teamLeader = employees.find(
          (emp) => emp.id === teamData.teamLeader
        );
        const newTeam: Team = {
          ...(teamData as Team),
          id: `team_${Math.random().toString(36).substr(2, 9)}`,
          teamLeaderName: teamLeader
            ? `${teamLeader.firstName} ${teamLeader.lastName}`
            : "",
          memberCount: teamData.members?.length || 0,
          createdAt: getCurrentDateString(),
        };
        setTeams((prev) => [...prev, newTeam]);
      }

      setShowTeamModal(false);
      setEditingTeam(null);
    } catch (error) {
      console.error("Error saving team:", error);
      alert("Failed to save team. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

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
              Manage employees, roles, and organizational settings.
            </p>
          </div>

          {/* Summary Stats */}
          <SummaryStats employees={employees} roles={roles} teams={teams} />

          {/* Password Reset Notification */}
          <PasswordResetNotification
            isVisible={showResetPasswordInfo}
            employee={resetPasswordEmployee}
            generatedPassword={generatedPassword}
            onDismiss={() => {
              setShowResetPasswordInfo(false);
              setResetPasswordEmployee(null);
              setGeneratedPassword("");
            }}
          />

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
                <button
                  onClick={() => setActiveTab("teams")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "teams"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Teams
                </button>
              </div>

              <button
                onClick={() => {
                  if (activeTab === "employees") {
                    handleAddEmployee();
                  } else if (activeTab === "roles") {
                    handleAddRole();
                  } else {
                    handleAddTeam();
                  }
                }}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                {activeTab === "employees"
                  ? "Add Employee"
                  : activeTab === "roles"
                  ? "Create Role"
                  : "Create Team"}
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "employees" && (
              <EmployeeTable
                employees={employees}
                isProcessing={isProcessing}
                onEditEmployee={handleEditEmployee}
                onResetPassword={handleResetPassword}
                onDeleteEmployee={handleDeleteEmployee}
              />
            )}

            {activeTab === "roles" && (
              <RoleTable
                roles={roles}
                isProcessing={isProcessing}
                onEditRole={handleEditRole}
                onDeleteRole={handleDeleteRole}
              />
            )}

            {activeTab === "teams" && (
              <TeamTable
                teams={teams}
                isProcessing={isProcessing}
                onEditTeam={handleEditTeam}
                onDeleteTeam={handleDeleteTeam}
              />
            )}
          </div>

          {/* Modals */}
          <EmployeeModal
            isOpen={showEmployeeModal}
            onClose={() => {
              setShowEmployeeModal(false);
              setEditingEmployee(null);
            }}
            employee={editingEmployee}
            roles={roles}
            onSave={handleSaveEmployee}
            isProcessing={isProcessing}
          />

          <RoleModal
            isOpen={showRoleModal}
            onClose={() => {
              setShowRoleModal(false);
              setEditingRole(null);
            }}
            role={editingRole}
            onSave={handleSaveRole}
            isProcessing={isProcessing}
          />

          <TeamModal
            isOpen={showTeamModal}
            onClose={() => {
              setShowTeamModal(false);
              setEditingTeam(null);
            }}
            team={editingTeam}
            employees={employees}
            onSave={handleSaveTeam}
            isProcessing={isProcessing}
          />

          <PasswordResetModal
            isOpen={showResetPasswordConfirmModal}
            employee={employeeToReset}
            isProcessing={isProcessing}
            onConfirm={confirmResetPassword}
            onCancel={() => {
              setShowResetPasswordConfirmModal(false);
              setEmployeeToReset(null);
            }}
          />

          <DeleteConfirmModal
            isOpen={showDeleteModal}
            onClose={() => {
              setShowDeleteModal(false);
              setDeleteItem(null);
            }}
            onConfirm={confirmDelete}
            title={`Delete ${
              deleteItem?.type === "employee"
                ? "Employee"
                : deleteItem?.type === "role"
                ? "Role"
                : "Team"
            }`}
            message={`Are you sure you want to delete this ${deleteItem?.type}?`}
            itemName={deleteItem?.name}
            isProcessing={isProcessing}
            confirmButtonText="Delete"
            cancelButtonText="Cancel"
            variant="danger"
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
