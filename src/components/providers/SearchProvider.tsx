"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { 
  search, 
  getRecentSearches, 
  clearRecentSearches as clearRecentSearchesService
} from '@/services/searchService';
import { getPageNameFromUrl } from '@/utils/pageNames';
import { saveSearchQuery } from '@/services/search/utils';
import { 
  trackSearch, 
  trackResultClick, 
  getPopularSearches 
} from '@/services/searchAnalyticsService';
import { SearchResult, SearchState } from '@/types/search.types';

interface SearchContextType extends SearchState {
  handleQueryChange: (query: string) => void;
  handleFilterChange: (filters: Record<string, any>) => void;
  handleResultSelect: (result: SearchResult) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  toggleSearchPanel: () => void;
  clearSearch: () => void;
  useRecentSearch: (query: string) => void;
  usePopularSearch: (query: string) => void;
  useSuggestion: (suggestion: string) => void;
  clearRecentSearches: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SearchState>({
    query: '',
    results: [],
    filters: {},
    isLoading: false,
    error: null,
    recentSearches: [],
    popularSearches: [],
    selectedResultIndex: -1,
    isOpen: false
  });
  
  const router = useRouter();
  
  // Load recent and popular searches on mount
  useEffect(() => {
    setState(prev => ({
      ...prev,
      recentSearches: getRecentSearches(),
      popularSearches: getPopularSearches(5)
    }));
  }, []);
  
  // Handle search query changes with debounce
  const handleQueryChange = useCallback((query: string) => {
    setState(prev => ({ ...prev, query, isLoading: query.trim().length > 0 }));
    
    // Use debounce for search
    const timeoutId = setTimeout(async () => {
      if (!query.trim()) {
        setState(prev => ({ 
          ...prev, 
          results: [], 
          isLoading: false,
          selectedResultIndex: -1
        }));
        return;
      }
      
      try {
        const results = await search(query, state.filters);
        
        // Track the search for analytics
        trackSearch(query, results.length);
        
        setState(prev => ({ 
          ...prev, 
          results, 
          isLoading: false,
          error: null,
          selectedResultIndex: results.length > 0 ? 0 : -1
        }));
      } catch (error) {
        setState(prev => ({ 
          ...prev, 
          results: [], 
          isLoading: false,
          error: 'Failed to fetch search results',
          selectedResultIndex: -1
        }));
      }
    }, 300); // 300ms debounce
    
    return () => clearTimeout(timeoutId);
  }, [state.filters]);
  
  // Handle filter changes
  const handleFilterChange = useCallback((filters: Record<string, any>) => {
    setState(prev => ({ ...prev, filters }));
    
    // Re-run search with new filters if there's a query
    if (state.query.trim()) {
      handleQueryChange(state.query);
    }
  }, [state.query, handleQueryChange]);
  
  // Handle result selection
  const handleResultSelect = useCallback((result: SearchResult) => {
    // Always close the search panel when selecting a result
    setState(prev => ({
      ...prev,
      isOpen: false
    }));
    
    // Save the page name to recent searches
    if (result.url) {
      const pageName = getPageNameFromUrl(result.url);
      saveSearchQuery(pageName);
      
      // Track the result click for analytics
      trackResultClick(pageName, result);
      
      setState(prev => ({
        ...prev,
        recentSearches: getRecentSearches(),
        popularSearches: getPopularSearches(5)
      }));
    }
    
    // Handle suggestion type (spelling correction)
    if (result.type === 'suggestion' && result.metadata) {
      // Check if this is a corrected query suggestion
      const correctedQuery = result.metadata['correctedQuery'] as string | undefined;
      if (correctedQuery) {
        // Use the corrected query
        setState(prev => ({ 
          ...prev, 
          query: correctedQuery,
          isOpen: true // Keep open for corrected query
        }));
        handleQueryChange(correctedQuery);
        return;
      }
    }
    
    // Handle command actions
    if (result.type === 'command' && result.metadata?.action) {
      result.metadata.action();
      return;
    }
    
    // Safety check for URL
    if (!result.url) {
      console.error('Result has no URL:', result);
      return;
    }
    
    // Navigate to the result URL with a slight delay to allow the search panel to close first
    setTimeout(() => {
      router.push(result.url);
    }, 50);
  }, [state.query, router, handleQueryChange]);
  
  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const { results, selectedResultIndex, isOpen } = state;
    
    if (!isOpen) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setState(prev => ({
          ...prev,
          selectedResultIndex: Math.min(
            prev.selectedResultIndex + 1, 
            prev.results.length - 1
          )
        }));
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        setState(prev => ({
          ...prev,
          selectedResultIndex: Math.max(prev.selectedResultIndex - 1, 0)
        }));
        break;
        
      case 'Enter':
        if (selectedResultIndex >= 0 && results[selectedResultIndex]) {
          e.preventDefault();
          handleResultSelect(results[selectedResultIndex]);
        }
        break;
        
      case 'Escape':
        e.preventDefault();
        setState(prev => ({
          ...prev,
          isOpen: false
        }));
        break;
    }
  }, [state, handleResultSelect]);
  
  // Toggle search panel
  const toggleSearchPanel = useCallback(() => {
    setState(prev => ({
      ...prev,
      isOpen: !prev.isOpen
    }));
  }, []);
  
  // Clear the search
  const clearSearch = useCallback(() => {
    setState(prev => ({
      ...prev,
      query: '',
      results: [],
      selectedResultIndex: -1
    }));
  }, []);
  
  // Use a recent search
  const useRecentSearch = useCallback((query: string) => {
    setState(prev => ({ ...prev, query, isOpen: true }));
    handleQueryChange(query);
  }, [handleQueryChange]);
  
  // Use a popular search
  const usePopularSearch = useCallback((query: string) => {
    setState(prev => ({ ...prev, query, isOpen: true }));
    handleQueryChange(query);
  }, [handleQueryChange]);
  
  // Use an autocomplete suggestion
  const useSuggestion = useCallback((suggestion: string) => {
    // Close search panel first, then navigate if it's a direct page suggestion
    setState(prev => ({ ...prev, isOpen: false }));
    
    // Check if this is a direct navigation suggestion (like "send money")
    const directNavigationPages = [
      { term: 'send money', url: '/send-money' },
      { term: 'exchange rates', url: '/exchange' },
      { term: 'transactions', url: '/transactions' },
      { term: 'clients', url: '/clients' },
      { term: 'settings', url: '/settings' },
      { term: 'help center', url: '/help' },
      { term: 'new client', url: '/clients/new' },
      { term: 'cash register', url: '/cash-register' }
    ];
    
    const directPage = directNavigationPages.find(page => 
      page.term.toLowerCase() === suggestion.toLowerCase()
    );
    
    if (directPage) {
      // Navigate directly to the page
      setTimeout(() => {
        router.push(directPage.url);
      }, 50);
    } else {
      // Otherwise, use it as a search term
      setState(prev => ({ ...prev, query: suggestion, isOpen: true }));
      handleQueryChange(suggestion);
    }
  }, [handleQueryChange, router]);
  
  // Clear recent searches
  const clearRecentSearches = useCallback(() => {
    clearRecentSearchesService();
    setState(prev => ({ ...prev, recentSearches: [] }));
  }, []);
  
  // Set up keyboard shortcut for search and navigation tracking
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K to open search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setState(prev => ({ ...prev, isOpen: true }));
      }
      
      // Escape to close search
      if (e.key === 'Escape' && state.isOpen) {
        e.preventDefault();
        setState(prev => ({ ...prev, isOpen: false }));
      }
    };
    
    // Listen for route changes to close search panel
    const handleRouteChange = () => {
      setState(prev => ({ ...prev, isOpen: false }));
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [state.isOpen]);
  
  const value = {
    ...state,
    handleQueryChange,
    handleFilterChange,
    handleResultSelect,
    handleKeyDown,
    toggleSearchPanel,
    clearSearch,
    useRecentSearch,
    usePopularSearch,
    useSuggestion,
    clearRecentSearches
  };
  
  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  
  return context;
}

// Export search analytics helper functions for direct use in components
export { getPopularSearches } from '@/services/searchAnalyticsService';
