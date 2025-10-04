"use client";

import { useState, useRef, useEffect } from "react";
import { SelectOption } from "./CustomSelect";

interface MultiSelectProps {
  options: SelectOption[];
  value?: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  label?: string;
  required?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "ghost";
  searchable?: boolean;
  maxDisplayed?: number;
}

export default function MultiSelect({
  options,
  value = [],
  onChange,
  placeholder = "Select options",
  disabled = false,
  error = false,
  errorMessage,
  label,
  required = false,
  className = "",
  size = "md",
  variant = "default",
  searchable = false,
  maxDisplayed = 3,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOptions = options.filter((option) =>
    value.includes(option.value)
  );

  const filteredOptions = searchable
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-4 py-4 text-lg",
  };

  const variantClasses = {
    default: "bg-background border-border",
    outline: "bg-transparent border-2 border-border",
    ghost: "bg-transparent border-0 hover:bg-muted/50",
  };

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
    if (!isOpen && searchable && inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSelect = (option: SelectOption) => {
    if (option.disabled) return;

    const newValue = value.includes(option.value)
      ? value.filter((v) => v !== option.value)
      : [...value, option.value];

    onChange(newValue);
    setSearchTerm("");
    setHighlightedIndex(-1);
  };

  const handleRemove = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== optionValue));
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex(0);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setHighlightedIndex(-1);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displaySelected = () => {
    if (selectedOptions.length === 0) {
      return <span className="text-muted-foreground">{placeholder}</span>;
    }

    if (selectedOptions.length <= maxDisplayed) {
      return (
        <div className="flex flex-wrap gap-1">
          {selectedOptions.map((option) => (
            <span
              key={option.value}
              className="inline-flex items-center px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-200 text-xs rounded-md"
            >
              {option.label}
              <button
                type="button"
                onClick={(e) => handleRemove(option.value, e)}
                className="ml-1 hover:bg-primary-200 dark:hover:bg-primary-800/30 rounded-full p-0.5"
              >
                <svg
                  className="w-3 h-3"
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
            </span>
          ))}
        </div>
      );
    }

    return (
      <div className="flex flex-wrap gap-1">
        {selectedOptions.slice(0, maxDisplayed).map((option) => (
          <span
            key={option.value}
            className="inline-flex items-center px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-200 text-xs rounded-md"
          >
            {option.label}
            <button
              type="button"
              onClick={(e) => handleRemove(option.value, e)}
              className="ml-1 hover:bg-primary-200 dark:hover:bg-primary-800/30 rounded-full p-0.5"
            >
              <svg
                className="w-3 h-3"
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
          </span>
        ))}
        <span className="inline-flex items-center px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
          +{selectedOptions.length - maxDisplayed} more
        </span>
      </div>
    );
  };

  return (
    <div className={`relative ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Select Container */}
      <div
        ref={selectRef}
        className={`relative ${sizeClasses[size]} ${
          variantClasses[variant]
        } border rounded-lg cursor-pointer transition-all duration-200 ${
          error
            ? "border-red-500 focus-within:ring-2 focus-within:ring-red-500/20"
            : "focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500"
        } ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:border-primary-500/50"
        }`}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={label || placeholder}
      >
        {/* Selected Values or Placeholder */}
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            {searchable && isOpen ? (
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder={placeholder}
                className="w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <div className="min-h-[1.5em]">{displaySelected()}</div>
            )}
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-2 ml-2">
            {value.length > 0 && !disabled && (
              <button
                type="button"
                onClick={handleClearAll}
                className="p-1 hover:bg-muted rounded-full transition-colors"
                aria-label="Clear all selections"
              >
                <svg
                  className="w-4 h-4 text-muted-foreground"
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
            )}
            <svg
              className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-hidden">
            <div className="overflow-y-auto max-h-60">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                  {searchable && searchTerm
                    ? "No options found"
                    : "No options available"}
                </div>
              ) : (
                filteredOptions.map((option, index) => (
                  <div
                    key={option.value}
                    className={`px-4 py-3 cursor-pointer transition-colors ${
                      index === highlightedIndex
                        ? "bg-primary-100 dark:bg-primary-900/20 text-primary-900 dark:text-primary-100"
                        : "hover:bg-muted"
                    } ${
                      option.disabled ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() => handleSelect(option)}
                    role="option"
                    aria-selected={value.includes(option.value)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div
                          className={`w-4 h-4 border-2 rounded mr-3 flex items-center justify-center ${
                            value.includes(option.value)
                              ? "bg-primary-600 border-primary-600"
                              : "border-border"
                          }`}
                        >
                          {value.includes(option.value) && (
                            <svg
                              className="w-3 h-3 text-white"
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
                          )}
                        </div>
                        <span className="block truncate text-foreground">
                          {option.label}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && errorMessage && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
