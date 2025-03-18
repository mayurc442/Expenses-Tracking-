
/**
 * Formats a number as a currency string
 * @param amount The amount to format
 * @param currency The currency code (default: USD)
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Formats a date string to a readable format
 * @param dateString ISO date string to format
 * @returns Formatted date string (e.g., Jul 15, 2023)
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

/**
 * Gets a readable time period label for grouping transactions
 * @param date The date to get a period for
 * @returns Period label (Today, Yesterday, This Week, etc)
 */
export const getTransactionPeriod = (date: string): string => {
  const transactionDate = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Check if it's today
  if (
    transactionDate.getDate() === today.getDate() &&
    transactionDate.getMonth() === today.getMonth() &&
    transactionDate.getFullYear() === today.getFullYear()
  ) {
    return 'Today';
  }
  
  // Check if it's yesterday
  if (
    transactionDate.getDate() === yesterday.getDate() &&
    transactionDate.getMonth() === yesterday.getMonth() &&
    transactionDate.getFullYear() === yesterday.getFullYear()
  ) {
    return 'Yesterday';
  }
  
  // Get the start of this week (Sunday)
  const thisWeekStart = new Date(today);
  thisWeekStart.setDate(today.getDate() - today.getDay());
  
  // Check if it's this week
  if (transactionDate >= thisWeekStart) {
    return 'This Week';
  }
  
  // Get the start of last week
  const lastWeekStart = new Date(thisWeekStart);
  lastWeekStart.setDate(thisWeekStart.getDate() - 7);
  
  // Check if it's last week
  if (transactionDate >= lastWeekStart) {
    return 'Last Week';
  }
  
  // Get the start of this month
  const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  
  // Check if it's this month
  if (transactionDate >= thisMonthStart) {
    return 'This Month';
  }
  
  // Get the start of last month
  const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  
  // Check if it's last month
  if (transactionDate >= lastMonthStart) {
    return 'Last Month';
  }
  
  // Get the start of this year
  const thisYearStart = new Date(today.getFullYear(), 0, 1);
  
  // Check if it's this year
  if (transactionDate >= thisYearStart) {
    return 'Earlier This Year';
  }
  
  // It's before this year
  return 'Previous Years';
};

/**
 * Calculate the percentage of budget used
 * @param spent Amount spent
 * @param budget Total budget
 * @returns Percentage as a number
 */
export const calculatePercentage = (spent: number, budget: number): number => {
  if (budget <= 0) return 0;
  const percentage = (spent / budget) * 100;
  return Math.min(percentage, 100); // Cap at 100%
};

/**
 * Returns a status indicator based on percentage of budget used
 * @param percentage Percentage of budget used
 * @returns 'good', 'warning', or 'danger'
 */
export const getBudgetStatus = (percentage: number): 'good' | 'warning' | 'danger' => {
  if (percentage < 75) return 'good';
  if (percentage < 90) return 'warning';
  return 'danger';
};
