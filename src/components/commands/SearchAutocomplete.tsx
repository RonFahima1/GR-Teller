"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowUpRight, Navigation } from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import { getSearchSuggestions } from '@/services/search/searchService';
import { searchPageCommands } from '@/services/search/pageCommands';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface SearchAutocompleteProps {
  query: string;
  onSelectSuggestion: (suggestion: string) => void;
  className?: string;
}

interface SuggestionItem {
  text: string;
  type: 'suggestion' | 'page';
  url?: string;
  icon?: string;
}

export function SearchAutocomplete({
  query,
  onSelectSuggestion,
  className
}: SearchAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  
  // Get autocomplete suggestions when query changes
  useEffect(() => {
    // Show suggestions even with a single character for better UX
    if (query.trim().length < 1) {
      setSuggestions([]);
      setIsVisible(false);
      return;
    }
    
    // Get suggestions with a lower threshold for better responsiveness
    const autocompleteSuggestions = getSearchSuggestions(query, 8);
    
    // Include suggestions even if they match the query exactly
    // This allows for immediate navigation when typing exact matches
    const textSuggestions = autocompleteSuggestions
      .filter(suggestion => 
        // Keep exact matches but prioritize partial matches
        suggestion.toLowerCase() !== query.toLowerCase() || 
        // Keep common actions like "send money" even if they match exactly
        suggestion.toLowerCase().includes(" ")
      )
      .map(text => ({ text, type: 'suggestion' as const }));
    
    // Get page commands that match the query for direct navigation
    const pageResults = searchPageCommands(query)
      .slice(0, 3) // Limit to top 3 page results
      .map(result => ({
        text: result.title,
        type: 'page' as const,
        url: result.url,
        icon: result.metadata?.icon
      }));
    
    // Combine text suggestions with page commands
    const combinedSuggestions = [...pageResults, ...textSuggestions].slice(0, 8);
    
    setSuggestions(combinedSuggestions);
    setIsVisible(combinedSuggestions.length > 0);
  }, [query]);
  
  // Hide suggestions if there's no query
  if (!query.trim() || !isVisible) {
    return null;
  }
  
  // Handle direct navigation to a page
  const handleSuggestionClick = (suggestion: SuggestionItem) => {
    if (suggestion.type === 'page' && suggestion.url) {
      // Navigate directly to the page
      router.push(suggestion.url);
    } else {
      // Use the text for search
      onSelectSuggestion(suggestion.text);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={cn(
            "absolute left-0 right-0 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 mt-1 z-50 overflow-hidden",
            className
          )}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.15 }}
        >
          <div className="p-1">
            {suggestions.some(s => s.type === 'page') && (
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 py-1.5">
                Quick Navigation
              </div>
            )}
            <div className="space-y-0.5">
              {suggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion.text}-${index}`}
                  className="w-full text-left px-2 py-1.5 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between group"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="flex items-center">
                    {suggestion.type === 'page' ? (
                      <Navigation className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400 mr-2" />
                    ) : (
                      <Search className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400 mr-2" />
                    )}
                    <span className={suggestion.type === 'page' ? 'font-medium text-blue-600 dark:text-blue-400' : ''}>
                      {highlightMatch(suggestion.text, query)}
                    </span>
                  </div>
                  <ArrowUpRight className="h-3 w-3 text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Helper function to highlight the matching part of the suggestion
function highlightMatch(suggestion: string, query: string): React.ReactNode {
  if (!query.trim()) return suggestion;
  
  const lowerSuggestion = suggestion.toLowerCase();
  const lowerQuery = query.toLowerCase().trim();
  
  // Find the index of the query in the suggestion
  const index = lowerSuggestion.indexOf(lowerQuery);
  
  if (index === -1) return suggestion;
  
  // Split the suggestion into parts
  const before = suggestion.substring(0, index);
  const match = suggestion.substring(index, index + query.length);
  const after = suggestion.substring(index + query.length);
  
  return (
    <>
      {before}
      <span className="font-medium text-blue-600 dark:text-blue-400">{match}</span>
      {after}
    </>
  );
}
