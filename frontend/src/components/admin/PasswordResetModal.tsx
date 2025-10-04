"use client";

import { Employee } from "@/types/employee";
import Modal from "@/components/ui/Modal";
import ModalFooter from "@/components/ui/ModalFooter";

interface PasswordResetModalProps {
  isOpen: boolean;
  employee: Employee | null;
  isProcessing: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function PasswordResetModal({
  isOpen,
  employee,
  isProcessing,
  onConfirm,
  onCancel,
}: PasswordResetModalProps) {
  if (!employee) return null;

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title="Reset Password" size="md">
      <div className="text-center">
        <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-orange-600"
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
        </div>
        <p className="text-muted-foreground mb-4">
          Are you sure you want to reset the password for{" "}
          <span className="font-medium text-foreground">
            {employee.firstName} {employee.lastName}
          </span>
          ?
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          A new temporary password will be generated and sent to{" "}
          <span className="font-medium text-foreground">{employee.email}</span>.
          The employee will need to change it on their next login.
        </p>
      </div>

      <ModalFooter>
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isProcessing}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? "Resetting..." : "Reset Password"}
        </button>
      </ModalFooter>
    </Modal>
  );
}
