"use client";

import Modal from "./Modal";
import ModalFooter from "./ModalFooter";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName?: string;
  isProcessing?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  variant?: "danger" | "warning";
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  isProcessing = false,
  confirmButtonText = "Delete",
  cancelButtonText = "Cancel",
  variant = "danger",
}: DeleteConfirmModalProps) {
  const iconColor = variant === "danger" ? "text-red-600" : "text-orange-600";
  const iconBg =
    variant === "danger"
      ? "bg-red-100 dark:bg-red-900/20"
      : "bg-orange-100 dark:bg-orange-900/20";
  const buttonColor =
    variant === "danger"
      ? "bg-red-600 hover:bg-red-700"
      : "bg-orange-600 hover:bg-orange-700";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <div className="text-center">
        <div
          className={`w-16 h-16 ${iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}
        >
          <svg
            className={`w-8 h-8 ${iconColor}`}
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
          {message}
          {itemName && (
            <>
              {" "}
              <span className="font-medium text-foreground">
                &quot;{itemName}&quot;
              </span>
              ?
            </>
          )}
        </p>

        {variant === "danger" && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
            <div className="flex items-start space-x-2">
              <svg
                className="w-5 h-5 text-red-600 mt-0.5"
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
                <p className="font-medium text-red-800 dark:text-red-200">
                  This action cannot be undone
                </p>
                <p className="text-red-700 dark:text-red-300 mt-1">
                  The item will be permanently removed from the system.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <ModalFooter>
        <button
          onClick={onClose}
          className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
        >
          {cancelButtonText}
        </button>
        <button
          onClick={onConfirm}
          disabled={isProcessing}
          className={`px-4 py-2 ${buttonColor} text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isProcessing ? "Deleting..." : confirmButtonText}
        </button>
      </ModalFooter>
    </Modal>
  );
}
