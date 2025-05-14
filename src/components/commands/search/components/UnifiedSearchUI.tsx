"use client";

import React from 'react';
import { SearchSuggestions } from './SearchSuggestions';
import { SearchResults } from './SearchResults';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';
import { UnifiedSearchUIProps } from '../types';
import { cn } from '@/lib/utils';

export function UnifiedSearchUI({
  query,
  results,
  isLoading,
  error,
  selectedIndex,
  onSelectSuggestion,
  onResultSelect,
  recentSearches = [],
  popularSearches = [],
  onRecentSearchSelect,
  onClearRecentSearches,
  className
}: UnifiedSearchUIProps) {
  if (isLoading) {
    return <LoadingState message="Searching..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (query.trim() === '') {
    return (
      <EmptyState
        recentSearches={recentSearches}
        popularSearches={popularSearches}
        onRecentSearchSelect={onRecentSearchSelect}
        onClearRecentSearches={onClearRecentSearches}
      />
    );
  }

  return (
    <div className={cn('max-h-[60vh] overflow-y-auto', className)}>
      <SearchSuggestions
        query={query}
        onSuggestionClick={onSelectSuggestion}
      />
      <SearchResults
        results={results}
        selectedIndex={selectedIndex}
        onResultSelect={onResultSelect}
      />
    </div>
  );
}
