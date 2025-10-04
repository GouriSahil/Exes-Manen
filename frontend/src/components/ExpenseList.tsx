"use client";

import { useState } from "react";
import { formatDate } from "@/utils/date";

interface Expense {
  id: string;
  employeeName: string;
  description: string;
  date: string;
  category: string;
  paidBy: string;
  remarks: string;
  amount: number;
  status: "Draft" | "Pending" | "Approved" | "Rejected";
}

// Mock data - replace with actual API call
const mockExpenses: Expense[] = [
  {
    id: "1",
    employeeName: "John Doe",
    description: "Client dinner at restaurant",
    date: "2024-01-14",
    category: "Meals & Entertainment",
    paidBy: "Company Card",
    remarks: "Meeting with potential client",
    amount: 89.99,
    status: "Approved",
  },
  {
    id: "2",
    employeeName: "Jane Smith",
    description: "Office supplies and stationery",
    date: "2024-01-13",
    category: "Office Supplies",
    paidBy: "Personal Card",
    remarks: "Urgent supplies needed for project",
    amount: 45.0,
    status: "Pending",
  },
  {
    id: "3",
    employeeName: "Mike Johnson",
    description: "Uber ride to client meeting",
    date: "2024-01-15",
    category: "Travel",
    paidBy: "Personal Card",
    remarks: "Transportation to downtown office",
    amount: 25.5,
    status: "Draft",
  },
  {
    id: "4",
    employeeName: "Sarah Wilson",
    description: "Software subscription renewal",
    date: "2024-01-12",
    category: "Software & Subscriptions",
    paidBy: "Company Card",
    remarks: "Annual subscription for design tools",
    amount: 299.0,
    status: "Rejected",
  },
];

export default function ExpenseList() {
  const [expenses] = useState<Expense[]>(mockExpenses);
  const [filter, setFilter] = useState<
    "All" | "Draft" | "Pending" | "Approved" | "Rejected"
  >("All");

  const filteredExpenses = expenses.filter(
    (expense) => filter === "All" || expense.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "Rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "Draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return (
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
              d="M5 13l4 4L19 7"
            />
          </svg>
        );
      case "Rejected":
        return (
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        );
      case "Pending":
        return (
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
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "Draft":
        return (
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
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="card p-4 sm:p-8">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Expense List
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base">
          View and manage all expenses in the system.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        {/* Mobile: Horizontal scroll */}
        <div className="flex space-x-1 overflow-x-auto pb-2 sm:hidden">
          {(["All", "Draft", "Pending", "Approved", "Rejected"] as const).map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`flex-shrink-0 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  filter === status
                    ? "bg-primary-600 text-white shadow-sm"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {status}
                {status !== "All" && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-white/20 text-white">
                    {
                      expenses.filter((expense) => expense.status === status)
                        .length
                    }
                  </span>
                )}
              </button>
            )
          )}
        </div>

        {/* Desktop: Normal tabs */}
        <div className="hidden sm:flex space-x-1 bg-muted p-1 rounded-lg">
          {(["All", "Draft", "Pending", "Approved", "Rejected"] as const).map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === status
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {status}
                {status !== "All" && (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400">
                    {
                      expenses.filter((expense) => expense.status === status)
                        .length
                    }
                  </span>
                )}
              </button>
            )
          )}
        </div>
      </div>

      {/* Expenses Display */}
      {filteredExpenses.length === 0 ? (
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-lg font-medium text-foreground mb-2">
            No expenses found
          </h3>
          <p className="text-muted-foreground">
            {filter === "All"
              ? "No expenses have been added yet."
              : `No expenses with status "${filter}".`}
          </p>
        </div>
      ) : (
        <>
          {/* Mobile: Card View */}
          <div className="block lg:hidden space-y-4">
            {filteredExpenses.map((expense) => (
              <div
                key={expense.id}
                className="border border-border rounded-lg p-4 bg-card"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-foreground text-sm">
                        {expense.employeeName}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          expense.status
                        )}`}
                      >
                        {getStatusIcon(expense.status)}
                        <span className="ml-1">{expense.status}</span>
                      </span>
                    </div>
                    <p className="text-foreground text-sm mb-2">
                      {expense.description}
                    </p>
                    {expense.remarks && (
                      <p className="text-muted-foreground text-xs mb-2">
                        {expense.remarks}
                      </p>
                    )}
                  </div>
                  <div className="text-right ml-3">
                    <div className="text-lg font-bold text-foreground">
                      ${expense.amount.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-3">
                  <div>
                    <span className="font-medium">Category:</span>{" "}
                    {expense.category}
                  </div>
                  <div>
                    <span className="font-medium">Date:</span>{" "}
                    {formatDate(expense.date)}
                  </div>
                  <div>
                    <span className="font-medium">Paid By:</span>{" "}
                    {expense.paidBy}
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    className="p-2 text-muted-foreground hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                    title="View Details"
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
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>
                  <button
                    className="p-2 text-muted-foreground hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                    title="Edit"
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Delete"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 font-semibold text-foreground">
                    Employee
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-foreground">
                    Description
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-foreground">
                    Category
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-foreground">
                    Date
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-foreground">
                    Paid By
                  </th>
                  <th className="text-right py-4 px-4 font-semibold text-foreground">
                    Amount
                  </th>
                  <th className="text-center py-4 px-4 font-semibold text-foreground">
                    Status
                  </th>
                  <th className="text-center py-4 px-4 font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className="border-b border-border hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="font-medium text-foreground">
                        {expense.employeeName}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-foreground max-w-xs">
                        <div className="truncate" title={expense.description}>
                          {expense.description}
                        </div>
                        {expense.remarks && (
                          <div
                            className="text-sm text-muted-foreground mt-1 truncate"
                            title={expense.remarks}
                          >
                            {expense.remarks}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400">
                        {expense.category}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-foreground">
                        {formatDate(expense.date)}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-foreground">{expense.paidBy}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-right font-semibold text-foreground">
                        ${expense.amount.toFixed(2)}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            expense.status
                          )}`}
                        >
                          {getStatusIcon(expense.status)}
                          <span className="ml-1">{expense.status}</span>
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-center space-x-2">
                        <button
                          className="p-2 text-muted-foreground hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                          title="View Details"
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
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>
                        <button
                          className="p-2 text-muted-foreground hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                          title="Edit"
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
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete"
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
