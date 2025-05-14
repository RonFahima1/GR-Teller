"use client";

import { Loader2, AlertCircle, Clock, X, Filter } from 'lucide-react';
import { SearchResult } from '@/types/search.types';
import { SearchResultItem } from './SearchResultItem';
import { NoResultsFound } from './NoResultsFound';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
  selectedIndex: number;
  recentSearches: string[];
  onResultSelect: (result: SearchResult) => void;
  onRecentSearchSelect: (query: string) => void;
  onClearRecentSearches: () => void;
  query: string;
}

export function SearchResults({ 
  results, 
  isLoading, 
  error, 
  selectedIndex,
  recentSearches,
  onResultSelect,
  onRecentSearchSelect,
  onClearRecentSearches,
  query
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-500" />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Searching...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="h-6 w-6 mx-auto text-red-500" />
        <p className="text-sm text-red-500 mt-2">{error}</p>
      </div>
    );
  }
  
  // If there's no query, show recent searches
  if (!query.trim()) {
    return (
      <div className="py-2">
        <div className="px-3 py-1 flex justify-between items-center">
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
            Recent Searches
          </div>
          
          {recentSearches.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2 text-xs text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              onClick={onClearRecentSearches}
            >
              Clear all
            </Button>
          )}
        </div>
        
        {recentSearches.length > 0 ? (
          <div className="mt-1">
            {recentSearches.map((query, index) => (
              <div 
                key={index}
                className="px-3 py-2 flex items-center hover:bg-blue-50/80 dark:hover:bg-blue-900/30 cursor-pointer rounded-xl"
                onClick={() => onRecentSearchSelect(query)}
              >
                <Clock className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
                <span className="text-sm">{query}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-3 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
            No recent searches
          </div>
        )}
      </div>
    );
  }
  
  if (results.length === 0) {
    return (
      <div className="p-4">
        <NoResultsFound 
          query={query} 
          onSuggestionClick={onRecentSearchSelect} 
        />
      </div>
    );
  }
  
  // Group results by type
  const groupedResults: Record<string, SearchResult[]> = {};
  
  results.forEach(result => {
    if (!groupedResults[result.type]) {
      groupedResults[result.type] = [];
    }
    groupedResults[result.type].push(result);
  });
  
  // Define display names for each type
  const typeDisplayNames: Record<string, string> = {
    client: 'Clients',
    transaction: 'Transactions',
    document: 'Documents',
    note: 'Notes',
    command: 'Commands',
    help: 'Help Articles',
    setting: 'Settings',
    exchange: 'Exchange Rates'
  };
  
  // Calculate the overall index for each result
  let currentIndex = 0;
  const indexedResults: Array<{ result: SearchResult, index: number }> = [];
  
  Object.entries(groupedResults).forEach(([type, results]) => {
    results.forEach(result => {
      indexedResults.push({ result, index: currentIndex });
      currentIndex++;
    });
  });
  
  return (
    <motion.div 
      className="max-h-[60vh] overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {Object.entries(groupedResults).map(([type, results]) => (
        <div key={type} className="py-2">
          <div className="px-3 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
            {typeDisplayNames[type] || type}
          </div>
          
          <div>
            <AnimatePresence>
              {results.map(result => {
                const resultWithIndex = indexedResults.find(item => item.result.id === result.id);
                const isSelected = resultWithIndex?.index === selectedIndex;
                
                return (
                  <SearchResultItem 
                    key={result.id}
                    result={result}
                    isSelected={isSelected}
                    onClick={() => onResultSelect(result)}
                  />
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      ))}
    </motion.div>
  );
}
