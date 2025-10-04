// Utility functions for consistent date handling across server and client

/**
 * Get current date in YYYY-MM-DD format
 * This function ensures consistent date handling between server and client
 */
export const getCurrentDateString = (): string => {
  const now = new Date();
  return now.toISOString().split("T")[0];
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Check if a date string is valid
 */
export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

/**
 * Get date range for filtering (e.g., last 30 days)
 */
export const getDateRange = (days: number): { start: string; end: string } => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);

  return {
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0],
  };
};
