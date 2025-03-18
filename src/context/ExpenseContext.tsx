
import React, { createContext, useState, useContext, useEffect } from 'react';

// Define the transaction category types
export type Category = 
  | 'food' 
  | 'transportation' 
  | 'housing' 
  | 'entertainment' 
  | 'health' 
  | 'shopping'
  | 'education'
  | 'other';

// Define the transaction structure
export interface Transaction {
  id: string;
  amount: number;
  category: Category;
  description: string;
  date: string;
}

// Define an example budget by category
export interface Budget {
  [key: string]: number;
}

// Define the context state structure
interface ExpenseContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  budget: Budget;
  updateBudget: (category: string, amount: number) => void;
  totalSpent: number;
  totalBudget: number;
}

// Create the context with a default empty value
const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

// Sample data to start with
const sampleTransactions: Transaction[] = [
  {
    id: '1',
    amount: 45.99,
    category: 'food',
    description: 'Grocery shopping',
    date: new Date(2023, 6, 15).toISOString(),
  },
  {
    id: '2',
    amount: 32.50,
    category: 'transportation',
    description: 'Gas',
    date: new Date(2023, 6, 14).toISOString(),
  },
  {
    id: '3',
    amount: 1200,
    category: 'housing',
    description: 'Rent',
    date: new Date(2023, 6, 1).toISOString(),
  },
  {
    id: '4',
    amount: 15.99,
    category: 'entertainment',
    description: 'Movie ticket',
    date: new Date(2023, 6, 10).toISOString(),
  },
  {
    id: '5',
    amount: 89.99,
    category: 'health',
    description: 'Pharmacy',
    date: new Date(2023, 6, 8).toISOString(),
  },
  {
    id: '6',
    amount: 120.50,
    category: 'shopping',
    description: 'New clothes',
    date: new Date(2023, 6, 5).toISOString(),
  },
  {
    id: '7',
    amount: 350,
    category: 'education',
    description: 'Online course',
    date: new Date(2023, 6, 2).toISOString(),
  },
  {
    id: '8',
    amount: 25.99,
    category: 'other',
    description: 'Miscellaneous',
    date: new Date(2023, 6, 4).toISOString(),
  }
];

// Sample budget data
const sampleBudget: Budget = {
  food: 500,
  transportation: 200,
  housing: 1500,
  entertainment: 100,
  health: 150,
  shopping: 200,
  education: 400,
  other: 100
};

// Provider component that wraps the app
export const ExpenseProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // State for transactions
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);
  
  // State for budget
  const [budget, setBudget] = useState<Budget>(sampleBudget);

  // Calculate the total amount spent
  const totalSpent = transactions.reduce((total, transaction) => total + transaction.amount, 0);
  
  // Calculate the total budget
  const totalBudget = Object.values(budget).reduce((total, amount) => total + amount, 0);
  
  // Add a new transaction
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTransactions([newTransaction, ...transactions]);
  };
  
  // Delete a transaction
  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(transaction => transaction.id !== id));
  };
  
  // Update budget for a category
  const updateBudget = (category: string, amount: number) => {
    setBudget({
      ...budget,
      [category]: amount,
    });
  };
  
  // Provide the context value to children
  return (
    <ExpenseContext.Provider
      value={{
        transactions,
        addTransaction,
        deleteTransaction,
        budget,
        updateBudget,
        totalSpent,
        totalBudget,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

// Custom hook to use the context
export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};
