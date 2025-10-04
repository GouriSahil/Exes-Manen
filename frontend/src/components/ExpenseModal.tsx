"use client";

import { useState, useEffect } from "react";
import CustomSelect, { SelectOption } from "./ui/CustomSelect";
import { getCurrentDateString } from "@/utils/date";

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

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (expense: ExpenseData) => void;
  isSubmitting?: boolean;
}

const categories: SelectOption[] = [
  { value: "Travel", label: "Travel" },
  { value: "Meals & Entertainment", label: "Meals & Entertainment" },
  { value: "Office Supplies", label: "Office Supplies" },
  { value: "Software & Subscriptions", label: "Software & Subscriptions" },
  { value: "Training & Development", label: "Training & Development" },
  { value: "Transportation", label: "Transportation" },
  { value: "Accommodation", label: "Accommodation" },
  { value: "Communication", label: "Communication" },
  { value: "Other", label: "Other" },
];

const paidByOptions: SelectOption[] = [
  { value: "Company Card", label: "Company Card" },
  { value: "Personal Card", label: "Personal Card" },
  { value: "Cash", label: "Cash" },
  { value: "Bank Transfer", label: "Bank Transfer" },
  { value: "Other", label: "Other" },
];

const statusOptions: SelectOption[] = [
  { value: "Draft", label: "Draft" },
  { value: "Pending", label: "Pending" },
  { value: "Approved", label: "Approved" },
  { value: "Rejected", label: "Rejected" },
];

export default function ExpenseModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}: ExpenseModalProps) {
  const [formData, setFormData] = useState<ExpenseData>({
    employeeName: "",
    description: "",
    date: "", // Initialize empty to avoid hydration mismatch
    category: "",
    paidBy: "",
    remarks: "",
    amount: "",
    status: "Draft",
  });

  // Set the current date after component mounts to avoid hydration mismatch
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      date: getCurrentDateString(),
    }));
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleClose = () => {
    setFormData({
      employeeName: "",
      description: "",
      date: getCurrentDateString(),
      category: "",
      paidBy: "",
      remarks: "",
      amount: "",
      status: "Draft",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">
              Add New Expense
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5"
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
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Employee Name */}
            <div>
              <label
                htmlFor="employeeName"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Employee Name *
              </label>
              <input
                type="text"
                id="employeeName"
                name="employeeName"
                value={formData.employeeName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background text-foreground"
                placeholder="Enter employee name"
              />
            </div>

            {/* Amount */}
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Amount *
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                required
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background text-foreground"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Date */}
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background text-foreground"
              />
            </div>

            {/* Category */}
            <div>
              <CustomSelect
                label="Category"
                options={categories}
                value={formData.category}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
                placeholder="Select a category"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Paid By */}
            <div>
              <CustomSelect
                label="Paid By"
                options={paidByOptions}
                value={formData.paidBy}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, paidBy: value }))
                }
                placeholder="Select payment method"
                required
              />
            </div>

            {/* Status */}
            <div>
              <CustomSelect
                label="Status"
                options={statusOptions}
                value={formData.status}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: value as
                      | "Draft"
                      | "Pending"
                      | "Approved"
                      | "Rejected",
                  }))
                }
                placeholder="Select status"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background text-foreground resize-none"
              placeholder="Describe the expense..."
            />
          </div>

          {/* Remarks */}
          <div>
            <label
              htmlFor="remarks"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Remarks
            </label>
            <textarea
              id="remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background text-foreground resize-none"
              placeholder="Additional remarks (optional)"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-border">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Adding...
                </div>
              ) : (
                "Add Expense"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
