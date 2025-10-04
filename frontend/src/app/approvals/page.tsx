"use client";

import { useState } from "react";

interface PendingExpense {
  id: string;
  employeeName: string;
  amount: number;
  currency: string;
  category: string;
  description: string;
  expenseDate: string;
  vendor: string;
  submittedDate: string;
}

// Mock data - replace with actual API call
const mockPendingExpenses: PendingExpense[] = [
  {
    id: "1",
    employeeName: "John Doe",
    amount: 89.99,
    currency: "USD",
    category: "Meals & Entertainment",
    description: "Client dinner at restaurant",
    expenseDate: "2024-01-14",
    vendor: "The Bistro",
    submittedDate: "2024-01-14",
  },
  {
    id: "2",
    employeeName: "Jane Smith",
    amount: 45.0,
    currency: "USD",
    category: "Office Supplies",
    description: "Stationery and notebooks",
    expenseDate: "2024-01-13",
    vendor: "Office Depot",
    submittedDate: "2024-01-13",
  },
  {
    id: "3",
    employeeName: "Mike Johnson",
    amount: 125.5,
    currency: "USD",
    category: "Travel",
    description: "Uber ride to client meeting",
    expenseDate: "2024-01-15",
    vendor: "Uber",
    submittedDate: "2024-01-15",
  },
];

export default function ApprovalsPage() {
  const [pendingExpenses, setPendingExpenses] =
    useState<PendingExpense[]>(mockPendingExpenses);
  const [selectedExpense, setSelectedExpense] = useState<PendingExpense | null>(
    null
  );
  const [comments, setComments] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async (expenseId: string) => {
    setIsProcessing(true);
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setPendingExpenses((prev) =>
        prev.filter((expense) => expense.id !== expenseId)
      );
      setSelectedExpense(null);
      setComments("");
    } catch (error) {
      console.error("Error approving expense:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (expenseId: string) => {
    if (!comments.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }

    setIsProcessing(true);
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setPendingExpenses((prev) =>
        prev.filter((expense) => expense.id !== expenseId)
      );
      setSelectedExpense(null);
      setComments("");
    } catch (error) {
      console.error("Error rejecting expense:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-secondary-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Expense Approvals
          </h1>
          <p className="text-muted-foreground">
            Review and approve pending expense submissions from your team.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-foreground">
                  {pendingExpenses.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Pending Approvals
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-foreground">12</div>
                <div className="text-sm text-muted-foreground">
                  Approved This Month
                </div>
              </div>
            </div>
          </div>

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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-foreground">
                  $
                  {pendingExpenses
                    .reduce((sum, expense) => sum + expense.amount, 0)
                    .toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Pending Amount
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Expenses Table */}
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Pending Approvals
          </h2>

          {pendingExpenses.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 text-muted-foreground mx-auto mb-4"
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
              <h3 className="text-lg font-medium text-foreground mb-2">
                All caught up!
              </h3>
              <p className="text-muted-foreground">
                No pending expense approvals at the moment.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Employee
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Category
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Description
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Vendor
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Expense Date
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Submitted
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground">
                      Amount
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-foreground">
                      Status
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pendingExpenses.map((expense) => (
                    <tr
                      key={expense.id}
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="font-medium text-foreground">
                          {expense.employeeName}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-foreground">
                          {expense.category}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-muted-foreground max-w-xs truncate">
                          {expense.description}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-muted-foreground">
                          {expense.vendor || "-"}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-muted-foreground">
                          {new Date(expense.expenseDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-muted-foreground">
                          {new Date(expense.submittedDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="font-semibold text-foreground">
                          {expense.currency} {expense.amount.toFixed(2)}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Pending
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleApprove(expense.id)}
                            disabled={isProcessing}
                            className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => setSelectedExpense(expense)}
                            disabled={isProcessing}
                            className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Rejection Modal */}
        {selectedExpense && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-background rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Reject Expense
              </h3>
              <p className="text-muted-foreground mb-4">
                Please provide a reason for rejecting this expense:
              </p>
              <div className="mb-4">
                <div className="text-sm font-medium text-foreground mb-2">
                  {selectedExpense.category} - {selectedExpense.currency}{" "}
                  {selectedExpense.amount.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {selectedExpense.description}
                </div>
              </div>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Enter reason for rejection..."
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background text-foreground resize-none"
              />
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setSelectedExpense(null);
                    setComments("");
                  }}
                  className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReject(selectedExpense.id)}
                  disabled={isProcessing || !comments.trim()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? "Rejecting..." : "Reject Expense"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
