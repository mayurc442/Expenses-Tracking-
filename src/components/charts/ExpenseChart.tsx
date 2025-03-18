
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Category, Transaction } from '@/context/ExpenseContext';
import { formatCurrency } from '@/utils/formatters';

interface ExpenseChartProps {
  transactions: Transaction[];
  className?: string;
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

// Custom tooltip component for the pie chart
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="glass p-2 rounded-lg shadow-sm">
        <p className="font-medium">{data.name}</p>
        <p className="text-sm">{formatCurrency(data.value)}</p>
      </div>
    );
  }

  return null;
};

const ExpenseChart: React.FC<ExpenseChartProps> = ({ transactions, className }) => {
  // Map of category colors
  const categoryColors: Record<Category, string> = {
    food: '#34C759',
    transportation: '#5AC8FA',
    housing: '#AF52DE',
    entertainment: '#FF9500',
    health: '#FF2D55',
    shopping: '#007AFF',
    education: '#5856D6',
    other: '#8E8E93'
  };

  // Group transactions by category
  const expensesByCategory = transactions.reduce((acc, transaction) => {
    const { category, amount } = transaction;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += amount;
    return acc;
  }, {} as Record<Category, number>);

  // Format data for the pie chart
  const chartData: ChartData[] = Object.entries(expensesByCategory).map(([category, amount]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: amount,
    color: categoryColors[category as Category]
  })).sort((a, b) => b.value - a.value);

  // If no data, display a message
  if (chartData.length === 0) {
    return (
      <div className={`flex justify-center items-center h-64 ${className}`}>
        <p className="text-muted-foreground">No expense data available</p>
      </div>
    );
  }

  return (
    <div className={`w-full h-64 ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={1} stroke="#fff" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseChart;
