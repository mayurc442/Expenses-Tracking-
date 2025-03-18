
import React, { useState } from 'react';
import { useExpense, Category } from '@/context/ExpenseContext';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const categories: Category[] = [
  'food',
  'transportation',
  'housing',
  'entertainment',
  'health',
  'shopping',
  'education',
  'other'
];

const TransactionForm: React.FC = () => {
  const { addTransaction } = useExpense();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    amount: '',
    category: '' as Category,
    description: '',
    date: new Date(),
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleCategoryChange = (value: string) => {
    setFormData({
      ...formData,
      category: value as Category,
    });
  };
  
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData({
        ...formData,
        date,
      });
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.amount || !formData.category || !formData.description) {
      toast({
        title: "Missing fields",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }
    
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid positive number",
        variant: "destructive",
      });
      return;
    }
    
    // Add the transaction
    addTransaction({
      amount,
      category: formData.category,
      description: formData.description,
      date: formData.date.toISOString(),
    });
    
    // Reset form
    setFormData({
      amount: '',
      category: '' as Category,
      description: '',
      date: new Date(),
    });
    
    // Show success toast
    toast({
      title: "Transaction added",
      description: "Your transaction has been successfully recorded",
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-2">
      <div className="space-y-1.5">
        <Label htmlFor="amount">Amount</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
          <Input 
            id="amount" 
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            className="pl-8 text-lg"
            type="number"
            step="0.01"
          />
        </div>
      </div>
      
      <div className="space-y-1.5">
        <Label htmlFor="category">Category</Label>
        <Select onValueChange={handleCategoryChange} value={formData.category}>
          <SelectTrigger id="category">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Input 
          id="description" 
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="What was this expense for?"
        />
      </div>
      
      <div className="space-y-1.5">
        <Label htmlFor="date">Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !formData.date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 pointer-events-auto">
            <Calendar
              mode="single"
              selected={formData.date}
              onSelect={handleDateChange}
              initialFocus
              className="p-3"
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <Button type="submit" className="w-full">Add Transaction</Button>
    </form>
  );
};

export default TransactionForm;
