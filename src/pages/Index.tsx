
import React from 'react';
import Header from '@/components/layout/Header';
import Dashboard from '@/components/layout/Dashboard';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen pb-20 sm:pb-0 sm:pt-20 bg-gradient-to-br from-background to-accent/20">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <Dashboard />
      </main>
    </div>
  );
};

export default Index;
