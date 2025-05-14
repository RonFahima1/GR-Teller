'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error, 
  resetErrorBoundary 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-lg border border-red-100 dark:border-red-900"
    >
      <div className="flex flex-col items-center text-center">
        <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-3 mb-4">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 text-red-500 dark:text-red-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Something went wrong</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <button
          onClick={resetErrorBoundary}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Try again
        </button>
      </div>
    </motion.div>
  );
};
