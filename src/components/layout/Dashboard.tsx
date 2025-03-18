
import React from 'react';
import { useExpense } from '@/context/ExpenseContext';
import { formatCurrency, calculatePercentage, getBudgetStatus } from '@/utils/formatters';
import ExpenseChart from '../charts/ExpenseChart';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CategoryBadge from '../ui-elements/CategoryBadge';
import ExpenseCard from '../ui-elements/ExpenseCard';

const Dashboard: React.FC = () => {
  const { transactions, budget, totalSpent, totalBudget } = useExpense();
  
  // Get recent transactions (last 5)
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  // Calculate budget progress
  const budgetPercentage = calculatePercentage(totalSpent, totalBudget);
  const budgetStatus = getBudgetStatus(budgetPercentage);
  
  // Calculate spending by category
  const expensesByCategory = transactions.reduce((acc, transaction) => {
    const { category, amount } = transaction;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += amount;
    return acc;
  }, {} as Record<string, number>);
  
  // Get status color for budget progress
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-expense-food text-expense-food/10';
      case 'warning':
        return 'bg-expense-entertainment text-expense-entertainment/10';
      case 'danger':
        return 'bg-expense-health text-expense-health/10';
      default:
        return 'bg-primary text-primary/10';
    }
  };
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Track and manage your expenses in one place.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Spending</CardTitle>
            <CardDescription>Your current month expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalSpent)}</div>
            <Progress 
              value={budgetPercentage} 
              className={`h-2 mt-2 ${getStatusColor(budgetStatus)}`} 
            />
            <p className="text-xs text-muted-foreground mt-2">
              {budgetPercentage.toFixed(0)}% of your {formatCurrency(totalBudget)} budget
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-card md:col-span-2 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Expense Breakdown</CardTitle>
            <CardDescription>Spending by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ExpenseChart transactions={transactions} />
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">Recent Transactions</TabsTrigger>
          <TabsTrigger value="categories">Top Categories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recent" className="space-y-4">
          {recentTransactions.length === 0 ? (
            <Card className="glass-card">
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No recent transactions</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentTransactions.map((transaction) => (
                <ExpenseCard 
                  key={transaction.id} 
                  transaction={transaction}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="categories">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Top Spending Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(expensesByCategory)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([category, amount]) => {
                    const categoryBudget = budget[category] || 0;
                    const percentage = calculatePercentage(amount, categoryBudget);
                    const status = getBudgetStatus(percentage);
                    
                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <CategoryBadge category={category as any} />
                            <span>{formatCurrency(amount)}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {categoryBudget > 0 
                              ? `${percentage.toFixed(0)}% of ${formatCurrency(categoryBudget)}` 
                              : 'No budget set'
                            }
                          </span>
                        </div>
                        {categoryBudget > 0 && (
                          <Progress 
                            value={percentage} 
                            className={`h-1.5 ${getStatusColor(status)}`} 
                          />
                        )}
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
