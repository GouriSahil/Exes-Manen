"use client";

import { useState } from "react";
import ExpenseList from "../../components/ExpenseList";
import ExpenseModal from "../../components/ExpenseModal";

interface ExpenseData {
  employeeName: string;
  description: string;
  date: string;
  category: string;
  paidBy: string;
  remarks: string;
  amount: string;
  status: "Draft" | "Pending" | "Approved" | "Rejected";
}

export default function ExpensesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data for stats - replace with actual API call
  const stats = {
    draftAmount: 125.5,
    pendingAmount: 89.99,
    approvedAmount: 1250.75,
  };

  const handleAddExpense = async (expenseData: ExpenseData) => {
    setIsSubmitting(true);
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Expense added:", expenseData);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding expense:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUploadExpenses = () => {
    // TODO: Implement bulk upload functionality
    console.log("Upload expenses clicked");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-secondary-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center justify-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add New Expense
          </button>
          <button
            onClick={handleUploadExpenses}
            className="btn-secondary flex items-center justify-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            Upload Expenses
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Draft Amount */}
          <div className="card p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-900/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-foreground">
                  ${stats.draftAmount.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Draft Status
                </div>
              </div>
            </div>
          </div>

          {/* Pending Amount */}
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
                  ${stats.pendingAmount.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Waiting for Approval
                </div>
              </div>
            </div>
          </div>

          {/* Approved Amount */}
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
                <div className="text-2xl font-bold text-foreground">
                  ${stats.approvedAmount.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Approved & Will be Reimbursed
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Expense List */}
        <ExpenseList />

        {/* Add Expense Modal */}
        <ExpenseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddExpense}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
