"use client";

import { Employee } from "@/types/employee";

interface EmployeeTableProps {
  employees: Employee[];
  isProcessing: boolean;
  onEditEmployee: (employee: Employee) => void;
  onResetPassword: (employee: Employee) => void;
  onDeleteEmployee: (employee: Employee) => void;
}

export default function EmployeeTable({
  employees,
  isProcessing,
  onEditEmployee,
  onResetPassword,
  onDeleteEmployee,
}: EmployeeTableProps) {
  return (
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
                <div className="text-muted-foreground">{employee.email}</div>
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
                  {employee.createdAt}
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => onEditEmployee(employee)}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onResetPassword(employee)}
                    disabled={isProcessing}
                    className="px-3 py-1.5 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium"
                  >
                    Reset Password
                  </button>
                  <button
                    onClick={() => onDeleteEmployee(employee)}
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
  );
}
