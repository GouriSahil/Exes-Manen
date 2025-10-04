"use client";

import { useState, useEffect } from "react";
import { Team, Employee } from "@/types/employee";
import Modal from "@/components/ui/Modal";
import ModalFooter from "@/components/ui/ModalFooter";
import { departments } from "@/constants/admin";

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team | null;
  employees: Employee[];
  onSave: (teamData: Partial<Team>) => void;
  isProcessing: boolean;
}

export default function TeamModal({
  isOpen,
  onClose,
  team,
  employees,
  onSave,
  isProcessing,
}: TeamModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    teamLeader: "",
    department: "",
    members: [] as string[],
  });

  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name,
        description: team.description,
        teamLeader: team.teamLeader,
        department: team.department,
        members: team.members,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        teamLeader: "",
        department: "",
        members: [],
      });
    }
  }, [team]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleMemberChange = (employeeId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      members: checked
        ? [...prev.members, employeeId]
        : prev.members.filter((id) => id !== employeeId),
    }));
  };

  const activeEmployees = employees.filter((emp) => emp.status === "active");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={team ? "Edit Team" : "Create New Team"}
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Team Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background text-foreground"
              placeholder="Enter team name"
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
              placeholder="Enter team description"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Department *
            </label>
            <select
              value={formData.department}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, department: e.target.value }))
              }
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background text-foreground"
              required
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
              Team Leader *
            </label>
            <select
              value={formData.teamLeader}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, teamLeader: e.target.value }))
              }
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background text-foreground"
              required
            >
              <option value="">Select a team leader</option>
              {activeEmployees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.firstName} {employee.lastName} - {employee.role}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Team Members
            </label>
            <div className="max-h-48 overflow-y-auto border border-border rounded-lg p-3">
              {activeEmployees.map((employee) => (
                <label
                  key={employee.id}
                  className="flex items-center space-x-2 py-1"
                >
                  <input
                    type="checkbox"
                    checked={formData.members.includes(employee.id)}
                    onChange={(e) =>
                      handleMemberChange(employee.id, e.target.checked)
                    }
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-foreground">
                    {employee.firstName} {employee.lastName} - {employee.role}
                  </span>
                </label>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Selected: {formData.members.length} members
            </p>
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
            {isProcessing ? "Saving..." : team ? "Update Team" : "Create Team"}
          </button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
