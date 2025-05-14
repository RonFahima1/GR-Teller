import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  search, 
  getRecentSearches, 
  saveSearchQuery, 
  commands 
} from '@/services/searchService';
import { SearchResult, SearchState } from '@/types/search.types';

export function useSearch() {
  const [state, setState] = useState<SearchState>({
    query: '',
    results: [],
    filters: {},
    isLoading: false,
    error: null,
    recentSearches: [],
    selectedResultIndex: -1,
    isOpen: false
  });
  
  const router = useRouter();
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Load recent searches on mount
  useEffect(() => {
    setState(prev => ({
      ...prev,
      recentSearches: getRecentSearches()
    }));
  }, []);
  
  // Handle search query changes with debounce
  const handleQueryChange = useCallback((query: string) => {
    setState(prev => ({ ...prev, query, isLoading: query.trim().length > 0 }));
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set new timeout for debounce
    searchTimeoutRef.current = setTimeout(async () => {
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
    
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
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
    // Save the query to recent searches
    if (state.query.trim()) {
      saveSearchQuery(state.query);
      setState(prev => ({
        ...prev,
        recentSearches: getRecentSearches(),
        isOpen: false
      }));
    }
    
    // Handle command actions
    if (result.type === 'command' && result.metadata?.action) {
      result.metadata.action();
      return;
    }
    
    // Navigate to the result URL
    router.push(result.url);
  }, [state.query, router]);
  
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
    setState(prev => ({ ...prev, query }));
    handleQueryChange(query);
  }, [handleQueryChange]);
  
  // Clear recent searches
  const clearRecentSearches = useCallback(() => {
    localStorage.removeItem('recentSearches');
    setState(prev => ({ ...prev, recentSearches: [] }));
  }, []);
  
  // Set up keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K to open search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setState(prev => ({ ...prev, isOpen: true }));
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  return {
    ...state,
    handleQueryChange,
    handleFilterChange,
    handleResultSelect,
    handleKeyDown,
    toggleSearchPanel,
    clearSearch,
    useRecentSearch,
    clearRecentSearches
  };
}
