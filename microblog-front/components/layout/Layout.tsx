import React, { ReactNode } from 'react';
import { Header } from './Header';

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-full sm:max-w-3xl lg:max-w-4xl">
        {children}
      </main>
      <footer className="bg-white border-t border-gray-200 py-3 sm:py-4">
        <div className="container mx-auto px-4 text-center text-gray-500 text-xs sm:text-sm">
          © {new Date().getFullYear()} MicroBlog
        </div>
      </footer>
    </div>
  );
};
