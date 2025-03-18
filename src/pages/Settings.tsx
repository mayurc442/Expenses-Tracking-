
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import { useExpense, Budget, Category } from '@/context/ExpenseContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/utils/formatters';
import { useToast } from '@/hooks/use-toast';

const Settings: React.FC = () => {
  const { budget, updateBudget } = useExpense();
  const { toast } = useToast();
  
  // Create state for each budget category
  const [budgetInputs, setBudgetInputs] = useState<Record<string, string>>({
    food: budget.food?.toString() || '',
    transportation: budget.transportation?.toString() || '',
    housing: budget.housing?.toString() || '',
    entertainment: budget.entertainment?.toString() || '',
    health: budget.health?.toString() || '',
    shopping: budget.shopping?.toString() || '',
    education: budget.education?.toString() || '',
    other: budget.other?.toString() || '',
  });
  
  // Handle input changes
  const handleInputChange = (category: string, value: string) => {
    setBudgetInputs({
      ...budgetInputs,
      [category]: value,
    });
  };
  
  // Handle save budget
  const handleSaveBudget = (category: string) => {
    const value = parseFloat(budgetInputs[category]);
    
    if (isNaN(value) || value < 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid positive number",
        variant: "destructive",
      });
      return;
    }
    
    updateBudget(category, value);
    
    toast({
      title: "Budget updated",
      description: `Your ${category} budget has been updated to ${formatCurrency(value)}`,
    });
  };
  
  // Categories to display
  const categories: Category[] = [
    'food',
    'transportation',
    'housing',
    'entertainment',
    'health',
    'shopping',
    'education',
    'other',
  ];
  
  // Get a nicer label for a category
  const getCategoryLabel = (category: string): string => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };
  
  return (
    <div className="min-h-screen pb-20 sm:pb-0 sm:pt-20 bg-gradient-to-br from-background to-accent/20">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6 animate-fade-in">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Manage your budget and preferences.</p>
          </div>
          
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Budget Settings</CardTitle>
              <CardDescription>Set monthly budget limits for each category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2">
                {categories.map((category) => (
                  <div key={category} className="space-y-2">
                    <Label htmlFor={`budget-${category}`}>{getCategoryLabel(category)}</Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          id={`budget-${category}`}
                          value={budgetInputs[category]}
                          onChange={(e) => handleInputChange(category, e.target.value)}
                          className="pl-8"
                          type="number"
                          step="1"
                          min="0"
                        />
                      </div>
                      <Button 
                        onClick={() => handleSaveBudget(category)}
                        size="sm"
                      >
                        Save
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Current budget: {formatCurrency(budget[category] || 0)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>App Preferences</CardTitle>
              <CardDescription>Customize your experience</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                More settings will be available in future updates.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Settings;
