"use client";

import { useState, useEffect } from "react";
import { Employee } from "@/services/authService";
import Modal from "@/components/ui/Modal";
import ModalFooter from "@/components/ui/ModalFooter";
import CustomSelect, { SelectOption } from "@/components/ui/CustomSelect";
import { departments } from "@/constants/admin";

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  roles: any[];
  onSave: (employeeData: Partial<Employee>) => void;
  isProcessing: boolean;
}

export default function EmployeeModal({
  isOpen,
  onClose,
  employee,
  roles,
  onSave,
  isProcessing,
}: EmployeeModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "" as "admin" | "employee" | "",
    department: "",
    is_active: true,
  });

  // Select options
  const roleOptions: SelectOption[] = [
    { value: "", label: "Select a role" },
    ...roles.map((role) => ({
      value: role.name,
      label: role.name.charAt(0).toUpperCase() + role.name.slice(1),
    })),
  ];

  const departmentOptions: SelectOption[] = [
    { value: "", label: "Select a department" },
    ...departments.map((dept) => ({
      value: dept,
      label: dept,
    })),
  ];

  const statusOptions: SelectOption[] = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name,
        email: employee.email,
        role: employee.role,
        department: "", // Not available in authService Employee type
        is_active: employee.is_active,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        role: "" as "admin" | "employee" | "",
        department: "",
        is_active: true,
      });
    }
  }, [employee]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const employeeData = {
      ...formData,
      role: formData.role || undefined,
    };
    onSave(employeeData);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={employee ? "Edit Employee" : "Add New Employee"}
      size="md"
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background text-foreground"
              placeholder="Enter full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background text-foreground"
              placeholder="Enter email address"
              required
            />
            {!employee && (
              <p className="text-xs text-muted-foreground mt-1">
                A random password will be generated and sent to this email
                address
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Role *
            </label>
            <CustomSelect
              options={roleOptions}
              value={formData.role}
              onChange={(value) => handleInputChange("role", value)}
              placeholder="Select a role"
              variant="outline"
              size="md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Department *
            </label>
            <CustomSelect
              options={departmentOptions}
              value={formData.department}
              onChange={(value) => handleInputChange("department", value)}
              placeholder="Select a department"
              variant="outline"
              size="md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Status
            </label>
            <CustomSelect
              options={statusOptions}
              value={formData.is_active ? "active" : "inactive"}
              onChange={(value) =>
                handleInputChange("is_active", value === "active")
              }
              placeholder="Select status"
              variant="outline"
              size="md"
            />
          </div>
        </div>

        <ModalFooter>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isProcessing}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing
              ? "Saving..."
              : employee
              ? "Update Employee"
              : "Create Employee"}
          </button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
