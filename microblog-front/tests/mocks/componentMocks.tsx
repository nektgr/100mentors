// This file handles component mocking for tests
import React from 'react';
import { cn } from '../../lib/utils';

// Button mock that works with both import cases and matches the actual Button implementation
export const Button = ({ 
  children, 
  onClick, 
  variant = "primary", 
  size = "md", 
  isLoading, 
  disabled,
  className,
  ...props
}: any) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    
  // Monochrome variants
  const variants = {
    primary: "bg-mono-900 text-mono-50 hover:bg-mono-800",
    secondary: "bg-mono-200 text-mono-900 hover:bg-mono-300",
    danger: "bg-mono-700 text-mono-50 hover:bg-mono-600",
    ghost: "bg-transparent text-mono-700 hover:bg-mono-100 hover:text-mono-900"
  };
  
  const sizes = {
    sm: "h-8 px-3 text-xs rounded-md",
    md: "h-10 px-4 py-2 text-sm rounded-md",
    lg: "h-12 px-6 py-3 text-base rounded-lg"
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        isLoading && "opacity-70 cursor-not-allowed",
        className
      )}
      disabled={isLoading || disabled}
      onClick={onClick}
      data-testid="mocked-button"
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </>
      ) : children}
    </button>
  );
};
