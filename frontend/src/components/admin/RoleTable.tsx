"use client";

import { Role } from "@/types/employee";

interface RoleTableProps {
  roles: Role[];
  isProcessing: boolean;
  onEditRole: (role: Role) => void;
  onDeleteRole: (role: Role) => void;
}

export default function RoleTable({
  roles,
  isProcessing,
  onEditRole,
  onDeleteRole,
}: RoleTableProps) {
  return (
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
                <div className="font-medium text-foreground">{role.name}</div>
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
                    onClick={() => onEditRole(role)}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs font-medium"
                  >
                    Edit
                  </button>
                  {role.isCustom && (
                    <button
                      onClick={() => onDeleteRole(role)}
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
  );
}
