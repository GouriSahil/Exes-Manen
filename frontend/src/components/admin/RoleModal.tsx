"use client";

import { useState, useEffect } from "react";
import { Role } from "@/types/employee";
import Modal from "@/components/ui/Modal";
import ModalFooter from "@/components/ui/ModalFooter";
import { availablePermissions } from "@/constants/admin";

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: Role | null;
  onSave: (roleData: Partial<Role>) => void;
  isProcessing: boolean;
}

export default function RoleModal({
  isOpen,
  onClose,
  role,
  onSave,
  isProcessing,
}: RoleModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
  });

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name,
        description: role.description,
        permissions: role.permissions,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        permissions: [],
      });
    }
  }, [role]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permission]
        : prev.permissions.filter((p) => p !== permission),
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={role ? "Edit Role" : "Create New Role"}
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Role Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background text-foreground"
              placeholder="Enter role name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background text-foreground resize-none"
              placeholder="Enter role description"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Permissions *
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-border rounded-lg p-3">
              {availablePermissions.map((permission) => (
                <label key={permission} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.permissions.includes(permission)}
                    onChange={(e) =>
                      handlePermissionChange(permission, e.target.checked)
                    }
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-foreground">
                    {permission.replace(/_/g, " ")}
                  </span>
                </label>
              ))}
            </div>
            {formData.permissions.length === 0 && (
              <p className="text-xs text-red-500 mt-1">
                Please select at least one permission
              </p>
            )}
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
            disabled={isProcessing || formData.permissions.length === 0}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Saving..." : role ? "Update Role" : "Create Role"}
          </button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
