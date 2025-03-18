
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import { useExpense } from '@/context/ExpenseContext';
import { formatCurrency, calculatePercentage } from '@/utils/formatters';
import ExpenseChart from '@/components/charts/ExpenseChart';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const Analytics: React.FC = () => {
  const { transactions, budget } = useExpense();
  const [timeFrame, setTimeFrame] = useState<'week' | 'month' | 'year'>('month');
  
  // Function to filter transactions based on timeframe
  const filterTransactionsByTimeFrame = () => {
    const now = new Date();
    let cutoffDate = new Date();
    
    if (timeFrame === 'week') {
      cutoffDate.setDate(now.getDate() - 7);
    } else if (timeFrame === 'month') {
      cutoffDate.setMonth(now.getMonth() - 1);
    } else if (timeFrame === 'year') {
      cutoffDate.setFullYear(now.getFullYear() - 1);
    }
    
    return transactions.filter(t => new Date(t.date) >= cutoffDate);
  };
  
  const filteredTransactions = filterTransactionsByTimeFrame();
  
  // Calculate spending by category
  const expensesByCategory = filteredTransactions.reduce((acc, transaction) => {
    const { category, amount } = transaction;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += amount;
    return acc;
  }, {} as Record<string, number>);
  
  // Format data for charts
  const categoryChartData = Object.entries(expensesByCategory)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
  
  // Calculate total spending
  const totalSpent = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  
  // Calculate budget progress for each category
  const budgetProgress = Object.entries(expensesByCategory).map(([category, spent]) => {
    const categoryBudget = budget[category] || 0;
    const percentage = calculatePercentage(spent, categoryBudget);
    return {
      category,
      spent,
      budget: categoryBudget,
      percentage
    };
  }).sort((a, b) => b.percentage - a.percentage);
  
  // Get highest spending category
  const highestCategory = categoryChartData.length > 0 ? categoryChartData[0].name : 'None';
  
  // Calculate spending trend (fake data for demonstration)
  const getTrendData = () => {
    if (timeFrame === 'week') {
      return [
        { name: 'Mon', value: 45 },
        { name: 'Tue', value: 72 },
        { name: 'Wed', value: 38 },
        { name: 'Thu', value: 50 },
        { name: 'Fri', value: 92 },
        { name: 'Sat', value: 108 },
        { name: 'Sun', value: 65 },
      ];
    } else if (timeFrame === 'month') {
      return [
        { name: 'Week 1', value: 350 },
        { name: 'Week 2', value: 420 },
        { name: 'Week 3', value: 380 },
        { name: 'Week 4', value: 450 },
      ];
    } else {
      return [
        { name: 'Jan', value: 1200 },
        { name: 'Feb', value: 1100 },
        { name: 'Mar', value: 1300 },
        { name: 'Apr', value: 1150 },
        { name: 'May', value: 1400 },
        { name: 'Jun', value: 1300 },
        { name: 'Jul', value: 1500 },
        { name: 'Aug', value: 1600 },
        { name: 'Sep', value: 1400 },
        { name: 'Oct', value: 1350 },
        { name: 'Nov', value: 1450 },
        { name: 'Dec', value: 1700 },
      ];
    }
  };
  
  const trendData = getTrendData();
  
  // Calculate the trend percentage (fake for demonstration)
  const trendPercentage = 12.4;
  
  // Custom tooltip for bar chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass p-2 rounded-lg shadow-sm">
          <p className="font-medium">{payload[0].payload.name}</p>
          <p className="text-sm">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="min-h-screen pb-20 sm:pb-0 sm:pt-20 bg-gradient-to-br from-background to-accent/20">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6 animate-fade-in">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground">Visualize and understand your spending patterns.</p>
          </div>
          
          <div className="flex justify-end">
            <TabsList>
              <TabsTrigger 
                value="week" 
                onClick={() => setTimeFrame('week')} 
                className={timeFrame === 'week' ? 'bg-primary text-primary-foreground' : ''}
              >
                Week
              </TabsTrigger>
              <TabsTrigger 
                value="month" 
                onClick={() => setTimeFrame('month')} 
                className={timeFrame === 'month' ? 'bg-primary text-primary-foreground' : ''}
              >
                Month
              </TabsTrigger>
              <TabsTrigger 
                value="year" 
                onClick={() => setTimeFrame('year')} 
                className={timeFrame === 'year' ? 'bg-primary text-primary-foreground' : ''}
              >
                Year
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="glass-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                <CardDescription>
                  {timeFrame === 'week' ? 'This week' : timeFrame === 'month' ? 'This month' : 'This year'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalSpent)}</div>
                <div className="flex items-center mt-1 text-xs">
                  {trendPercentage > 0 ? (
                    <>
                      <ArrowUpRight className="h-3 w-3 text-expense-health mr-1" />
                      <span className="text-expense-health">{trendPercentage}% from previous {timeFrame}</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="h-3 w-3 text-expense-food mr-1" />
                      <span className="text-expense-food">{Math.abs(trendPercentage)}% from previous {timeFrame}</span>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Top Category</CardTitle>
                <CardDescription>Highest spending area</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">{highestCategory}</div>
                <div className="text-sm mt-1">
                  {categoryChartData.length > 0 && formatCurrency(categoryChartData[0].value)}
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Spending Trend</CardTitle>
                <CardDescription>
                  {timeFrame === 'week' ? 'Daily spending' : timeFrame === 'month' ? 'Weekly spending' : 'Monthly spending'}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[100px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" fill="#007AFF" radius={[4, 4, 0, 0]}>
                      {trendData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#007AFF' : '#5AC8FA'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="distribution" className="space-y-4">
            <TabsList>
              <TabsTrigger value="distribution">Expense Distribution</TabsTrigger>
              <TabsTrigger value="budget">Budget Status</TabsTrigger>
            </TabsList>
            
            <TabsContent value="distribution">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Expense Distribution</CardTitle>
                  <CardDescription>
                    How your expenses are distributed across categories
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ExpenseChart transactions={filteredTransactions} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="budget">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Budget Status</CardTitle>
                  <CardDescription>
                    Track how close you are to your category budgets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {budgetProgress.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">No budget data available</p>
                    ) : (
                      budgetProgress.map(({ category, spent, budget, percentage }) => (
                        <div key={category} className="space-y-2">
                          <div className="flex justify-between items-baseline">
                            <h3 className="font-medium capitalize">{category}</h3>
                            <div className="text-sm text-right">
                              <span className="font-medium">{formatCurrency(spent)}</span>
                              <span className="text-muted-foreground"> / {formatCurrency(budget)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={percentage} 
                              className="h-2" 
                              indicatorClassName={
                                percentage > 90 ? "bg-expense-health" : 
                                percentage > 75 ? "bg-expense-entertainment" : 
                                "bg-expense-food"
                              }
                            />
                            <span className="text-xs font-medium w-12 text-right">
                              {percentage.toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
