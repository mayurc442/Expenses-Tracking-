
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart3, Settings, PlusCircle, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import TransactionForm from './TransactionForm';
import { cn } from '@/lib/utils';

const Header: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed bottom-0 inset-x-0 sm:top-0 sm:bottom-auto z-10 glass-card sm:bg-transparent sm:backdrop-blur-none sm:border-0 rounded-none pt-2 sm:py-4 sm:px-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-medium hidden sm:block">Expense Tracker</h1>
          
          <nav className="flex justify-center items-center w-full sm:w-auto gap-1 sm:gap-2">
            <Link to="/">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "flex flex-col sm:flex-row items-center gap-1 px-6 py-3 h-auto transition-all",
                  isActive('/') ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Home size={20} />
                <span className="text-xs sm:text-sm sm:ml-2">Home</span>
              </Button>
            </Link>
            
            <Link to="/transactions">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "flex flex-col sm:flex-row items-center gap-1 px-6 py-3 h-auto transition-all",
                  isActive('/transactions') ? "text-primary" : "text-muted-foreground"
                )}
              >
                <List size={20} />
                <span className="text-xs sm:text-sm sm:ml-2">Transactions</span>
              </Button>
            </Link>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="default"
                  size="sm"
                  className="flex flex-col sm:flex-row items-center gap-1 px-6 py-3 h-auto sm:rounded-full"
                >
                  <PlusCircle size={20} />
                  <span className="text-xs sm:text-sm sm:ml-2">Add</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card sm:max-w-md">
                <TransactionForm />
              </DialogContent>
            </Dialog>
            
            <Link to="/analytics">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "flex flex-col sm:flex-row items-center gap-1 px-6 py-3 h-auto transition-all",
                  isActive('/analytics') ? "text-primary" : "text-muted-foreground"
                )}
              >
                <BarChart3 size={20} />
                <span className="text-xs sm:text-sm sm:ml-2">Analytics</span>
              </Button>
            </Link>
            
            <Link to="/settings">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "flex flex-col sm:flex-row items-center gap-1 px-6 py-3 h-auto transition-all",
                  isActive('/settings') ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Settings size={20} />
                <span className="text-xs sm:text-sm sm:ml-2">Settings</span>
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
