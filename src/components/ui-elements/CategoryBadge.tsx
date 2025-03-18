
import React from 'react';
import { cn } from '@/lib/utils';
import { Category } from '@/context/ExpenseContext';

interface CategoryBadgeProps {
  category: Category;
  className?: string;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, className }) => {
  const getCategoryLabel = (cat: Category): string => {
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  };

  const getCategoryColor = (cat: Category): string => {
    const colorMap: Record<Category, string> = {
      food: 'bg-expense-food/10 text-expense-food border-expense-food/20',
      transportation: 'bg-expense-transportation/10 text-expense-transportation border-expense-transportation/20',
      housing: 'bg-expense-housing/10 text-expense-housing border-expense-housing/20',
      entertainment: 'bg-expense-entertainment/10 text-expense-entertainment border-expense-entertainment/20',
      health: 'bg-expense-health/10 text-expense-health border-expense-health/20',
      shopping: 'bg-expense-shopping/10 text-expense-shopping border-expense-shopping/20',
      education: 'bg-expense-education/10 text-expense-education border-expense-education/20',
      other: 'bg-expense-other/10 text-expense-other border-expense-other/20',
    };
    
    return colorMap[cat] || colorMap.other;
  };

  return (
    <span 
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        getCategoryColor(category),
        className
      )}
    >
      {getCategoryLabel(category)}
    </span>
  );
};

export default CategoryBadge;
