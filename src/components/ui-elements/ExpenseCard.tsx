
import React from 'react';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { Transaction, useExpense } from '@/context/ExpenseContext';
import { formatCurrency } from '@/utils/formatters';
import CategoryBadge from './CategoryBadge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ExpenseCardProps {
  transaction: Transaction;
  className?: string;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({ transaction, className }) => {
  const { deleteTransaction } = useExpense();
  const date = new Date(transaction.date);

  return (
    <div 
      className={cn(
        "glass-card p-4 transition-all duration-200 hover:shadow-lg animate-fade-in",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <CategoryBadge category={transaction.category} />
            <span className="text-xs text-muted-foreground">
              {format(date, 'MMM d, yyyy')}
            </span>
          </div>
          <h3 className="font-medium text-base line-clamp-1">{transaction.description}</h3>
        </div>
        <span className="text-lg font-semibold">{formatCurrency(transaction.amount)}</span>
      </div>
      
      <div className="mt-4 flex justify-end">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => deleteTransaction(transaction.id)}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <Trash2 size={16} className="mr-1" />
          <span className="text-xs">Remove</span>
        </Button>
      </div>
    </div>
  );
};

export default ExpenseCard;
