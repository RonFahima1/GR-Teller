import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSearchSuggestions } from '@/services/search/searchService';
import { searchPageCommands } from '@/services/search/pageCommands';
import { SuggestionItem } from '../types';

/**
 * Custom hook to fetch and manage search suggestions
 */
export function useSearchSuggestions(query: string) {
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const router = useRouter();
  
  // Get autocomplete suggestions when query changes
  useEffect(() => {
    if (query.trim().length < 1) {
      setSuggestions([]);
      return;
    }
    
    // Get suggestions with a lower threshold for better responsiveness
    const autocompleteSuggestions = getSearchSuggestions(query, 5);
    
    // Include suggestions even if they match the query exactly
    const textSuggestions = autocompleteSuggestions
      .filter(suggestion => 
        suggestion.toLowerCase() !== query.toLowerCase() || 
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
    const combinedSuggestions = [...pageResults, ...textSuggestions].slice(0, 5);
    
    setSuggestions(combinedSuggestions);
  }, [query]);
  
  // Handle direct navigation to a page
  const handleSuggestionClick = (suggestion: SuggestionItem) => {
    if (suggestion.type === 'page' && suggestion.url) {
      // Navigate directly to the page
      router.push(suggestion.url);
      return true;
    }
    return false;
  };

  return {
    suggestions,
    handleSuggestionClick
  };
}
