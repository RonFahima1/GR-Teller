"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { UnifiedSearchUIProps } from './types';
import { useSearchSuggestions, useQuickActions } from './hooks';
import {
  LoadingState,
  ErrorState,
  EmptyState,
  SearchSuggestions,
  SearchResults,
  NoResults
} from './components';

/**
 * Unified Search UI component that follows iOS design guidelines
 * Combines autocomplete, search results, recent searches, and no results found
 * into a single, cohesive interface
 */
export function UnifiedSearchUI({
  query,
  results,
  isLoading,
  error,
  selectedIndex,
  recentSearches,
  popularSearches = ['send money', 'exchange rates', 'transactions', 'clients'],
  onSelectSuggestion,
  onResultSelect,
  onRecentSearchSelect,
  onClearRecentSearches,
  className
}: UnifiedSearchUIProps) {
  // Local state for keyboard navigation
  const [localSelectedIndex, setLocalSelectedIndex] = useState(selectedIndex);
  
  // Get search suggestions and handle suggestion clicks
  const { suggestions, handleSuggestionClick } = useSearchSuggestions(query);
  
  // Get quick actions for no results state
  const quickActions = useQuickActions(onSelectSuggestion);
  
  // Update local index when prop changes
  useEffect(() => {
    setLocalSelectedIndex(selectedIndex);
  }, [selectedIndex]);
  
  // Handle keyboard navigation across all search UI elements
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle navigation keys
      if (!['ArrowDown', 'ArrowUp'].includes(e.key)) return;
      
      e.preventDefault();
      
      // Determine which collection we're navigating
      let itemsToNavigate: any[] = [];
      
      if (results && results.length > 0) {
        itemsToNavigate = results;
      } else if (suggestions.length > 0) {
        itemsToNavigate = suggestions;
      } else if (query.trim() === '' && recentSearches.length > 0) {
        itemsToNavigate = recentSearches;
      }
      
      if (itemsToNavigate.length === 0) return;
      
      if (e.key === 'ArrowDown') {
        setLocalSelectedIndex(prev => 
          prev < itemsToNavigate.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        setLocalSelectedIndex(prev => 
          prev > 0 ? prev - 1 : itemsToNavigate.length - 1
        );
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [results, suggestions, recentSearches, query]);
  
  // Handle suggestion click with callback
  const handleSuggestionItemClick = (suggestion: any) => {
    // If direct navigation wasn't performed, use the suggestion for search
    if (!handleSuggestionClick(suggestion)) {
      onSelectSuggestion(suggestion.text);
    }
  };

  return (
    <motion.div
      className={cn(
        "bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden w-full", // Full width of parent (which is already constrained)
        className
      )}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      transition={{ duration: 0.2 }}
    >
      {/* Loading state */}
      {isLoading && <LoadingState />}
      
      {/* Error state */}
      {!isLoading && error && <ErrorState message={error} />}
      
      {/* Empty state - show recent and popular searches */}
      {!isLoading && !error && !query.trim() && (
        <EmptyState
          recentSearches={recentSearches}
          popularSearches={popularSearches}
          onRecentSearchSelect={onRecentSearchSelect}
          onClearRecentSearches={onClearRecentSearches}
        />
      )}
      
      {/* Search results with integrated autocomplete - prioritize showing actual results */}
      {!isLoading && !error && query.trim() && (
        <div>
          {/* Show search results if available */}
          {results && results.length > 0 ? (
            <SearchResults
              results={results}
              selectedIndex={localSelectedIndex}
              onResultSelect={onResultSelect}
            />
          ) : (
            /* If no results, show suggestions if available, otherwise show no results message */
            suggestions.length > 0 ? (
              <SearchSuggestions
                suggestions={suggestions}
                query={query}
                onSuggestionClick={handleSuggestionItemClick}
              />
            ) : (
              <NoResults
                query={query}
                quickActions={quickActions}
                popularSearches={popularSearches}
                onPopularSearchSelect={onRecentSearchSelect}
              />
            )
          )}
        </div>
      )}
    </motion.div>
  );
}
