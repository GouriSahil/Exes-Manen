"use client";

import { Employee } from "@/types/employee";

interface PasswordResetNotificationProps {
  isVisible: boolean;
  employee: Employee | null;
  generatedPassword: string;
  onDismiss: () => void;
}

export default function PasswordResetNotification({
  isVisible,
  employee,
  generatedPassword,
  onDismiss,
}: PasswordResetNotificationProps) {
  if (!isVisible || !employee) return null;

  return (
    <div className="mb-6">
      <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
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
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-200 mb-2">
              Password Reset Successfully!
            </h3>
            <p className="text-orange-700 dark:text-orange-300 mb-3">
              A password reset email has been sent to{" "}
              <span className="font-medium">{employee.email}</span>
            </p>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 mb-3">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                New Login Credentials:
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Email:
                  </span>
                  <span className="ml-2 font-mono text-gray-900 dark:text-gray-100">
                    {employee.email}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    New Temporary Password:
                  </span>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="font-mono text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded border">
                      {generatedPassword}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedPassword);
                        // You could add a toast notification here
                      }}
                      className="text-orange-600 hover:text-orange-700 transition-colors"
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

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-3">
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
                    The employee should change their password immediately after
                    logging in with the new temporary password.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={onDismiss}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
