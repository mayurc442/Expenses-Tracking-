
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import { useExpense } from '@/context/ExpenseContext';
import { formatDate, getTransactionPeriod } from '@/utils/formatters';
import ExpenseCard from '@/components/ui-elements/ExpenseCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';

const Transactions: React.FC = () => {
  const { transactions } = useExpense();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Filter transactions based on search query and category filter
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || transaction.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  // Sort transactions by date (newest first)
  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Group transactions by period
  const groupedTransactions = sortedTransactions.reduce((groups, transaction) => {
    const period = getTransactionPeriod(transaction.date);
    if (!groups[period]) {
      groups[period] = [];
    }
    groups[period].push(transaction);
    return groups;
  }, {} as Record<string, typeof transactions>);
  
  // Get unique categories from all transactions
  const categories = Array.from(
    new Set(transactions.map(transaction => transaction.category))
  );
  
  return (
    <div className="min-h-screen pb-20 sm:pb-0 sm:pt-20 bg-gradient-to-br from-background to-accent/20">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6 animate-fade-in">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
            <p className="text-muted-foreground">View and filter your transaction history.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="relative w-full sm:w-[200px]">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="pl-10">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {Object.keys(groupedTransactions).length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No transactions found</p>
            </div>
          ) : (
            Object.entries(groupedTransactions).map(([period, transactions]) => (
              <div key={period} className="space-y-4">
                <h2 className="text-lg font-semibold sticky top-0 py-2 backdrop-blur-sm bg-background/80 z-10">
                  {period}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {transactions.map((transaction) => (
                    <ExpenseCard
                      key={transaction.id}
                      transaction={transaction}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Transactions;
