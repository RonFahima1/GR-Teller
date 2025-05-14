"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { SearchX, Lightbulb, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface NoResultsFoundProps {
  query: string;
  onSuggestionClick: (suggestion: string) => void;
  className?: string;
}

/**
 * Component displayed when no search results are found
 * Provides helpful suggestions and quick actions
 */
export function NoResultsFound({
  query,
  onSuggestionClick,
  className
}: NoResultsFoundProps) {
  // Common search alternatives that might help users
  const searchSuggestions = [
    'transactions',
    'clients',
    'exchange rates',
    'send money',
    'help center'
  ];
  
  // Quick actions that users might want to take
  const quickActions = [
    { label: 'Create New Transaction', action: () => onSuggestionClick('new transaction') },
    { label: 'Add New Client', action: () => onSuggestionClick('new client') },
    { label: 'View Exchange Rates', action: () => onSuggestionClick('exchange rates') },
    { label: 'Go to Help Center', action: () => onSuggestionClick('help center') }
  ];
  
  return (
    <motion.div
      className={cn(
        "bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4",
        className
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex flex-col items-center text-center mb-4">
        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full mb-3">
          <SearchX className="h-6 w-6 text-gray-500 dark:text-gray-400" />
        </div>
        <h3 className="text-lg font-medium mb-1">No results found</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
          We couldn't find any matches for "{query}". Try checking for typos or using different keywords.
        </p>
      </div>
      
      {/* Search suggestions */}
      <div className="mb-5">
        <div className="flex items-center mb-2">
          <Lightbulb className="h-4 w-4 text-amber-500 mr-2" />
          <span className="text-sm font-medium">Try searching for:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {searchSuggestions.map((suggestion) => (
            <Button
              key={suggestion}
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => onSuggestionClick(suggestion)}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Quick actions */}
      <div>
        <div className="flex items-center mb-2">
          <ExternalLink className="h-4 w-4 text-blue-500 mr-2" />
          <span className="text-sm font-medium">Quick actions:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className="justify-start text-sm"
              onClick={action.action}
            >
              {action.label}
            </Button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
