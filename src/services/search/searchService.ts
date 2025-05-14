import { SearchResult } from '@/types/search.types';
import { SearchFilters } from './types';
import { commands } from './commands';
import { 
  searchClients, 
  searchTransactions, 
  searchDocuments, 
  searchHelpArticles,
  searchExchangeRates 
} from './entitySearches';
import { 
  getRecentSearches, 
  saveSearchQuery, 
  clearRecentSearches 
} from './utils';
import { 
  processSearchQuery, 
  getAutocompleteSuggestions, 
  getSynonyms, 
  checkForMisspelling, 
  getSpellingSuggestions 
} from '../searchEnhancementService';
import { searchPageCommands } from './pageCommands';

/**
 * Get autocomplete suggestions for a query
 * @param query Search query
 * @param limit Maximum number of suggestions to return
 * @returns Array of search suggestions
 */
export function getSearchSuggestions(query: string, limit: number = 5): string[] {
  if (!query.trim()) return [];
  
  // Get autocomplete suggestions
  const autocompleteSuggestions = getAutocompleteSuggestions(query, limit);
  
  // Check for misspellings and get suggestions
  const hasMisspelling = checkForMisspelling(query);
  let spellingSuggestions: string[] = [];
  
  if (hasMisspelling) {
    spellingSuggestions = getSpellingSuggestions(query, limit);
    
    // Combine both types of suggestions and remove duplicates
    return [...new Set([...autocompleteSuggestions, ...spellingSuggestions])].slice(0, limit);
  }
  
  return autocompleteSuggestions;
}

/**
 * Search for commands matching the query
 * @param normalizedQuery Normalized search query
 * @returns Array of search results
 */
function searchCommands(normalizedQuery: string): SearchResult[] {
  if (!normalizedQuery) return [];
  
  // Filter commands based on query
  const matchingCommands = commands.filter(command => {
    return (
      command.title.toLowerCase().includes(normalizedQuery) ||
      command.description.toLowerCase().includes(normalizedQuery) ||
      command.keywords.some(keyword => keyword.includes(normalizedQuery))
    );
  });

  // Map to search results
  return matchingCommands.map(command => ({
    id: command.id,
    title: command.title,
    description: command.description,
    type: 'command',
    url: '#', // Commands use action instead of URL
    icon: command.icon || 'command',
    score: 90, // Commands are high priority
    metadata: { 
      action: command.action,
      keywords: command.keywords
    }
  }));
}

/**
 * Create spelling suggestion results
 * @param query Original query
 * @param suggestions Spelling suggestions
 * @returns Array of search results for spelling suggestions
 */
function createSpellingSuggestionResults(query: string, suggestions: string[]): SearchResult[] {
  return suggestions.map((suggestion, index) => ({
    id: `suggestion-${index}`,
    title: suggestion,
    description: `Did you mean: "${suggestion}"?`,
    type: 'suggestion',
    url: '#', // Suggestions don't have URLs
    icon: 'search',
    score: 95, // High priority to show at top
    metadata: {
      originalQuery: query,
      isSuggestion: true
    }
  }));
}

/**
 * Main search function
 * @param query Search query
 * @param filters Search filters
 * @returns Promise resolving to array of search results
 */
export async function search(
  query: string, 
  filters: SearchFilters = {}
): Promise<SearchResult[]> {
  // Save query to recent searches
  if (query.trim()) {
    saveSearchQuery(query.trim());
  }
  
  // Process and normalize the query
  const { normalizedQuery, expandedTerms } = processSearchQuery(query);
  
  if (!normalizedQuery) {
    return [];
  }
  
  // Check for misspellings
  const hasMisspelling = checkForMisspelling(normalizedQuery);
  let spellingSuggestions: string[] = [];
  let suggestionResults: SearchResult[] = [];
  
  if (hasMisspelling) {
    spellingSuggestions = getSpellingSuggestions(normalizedQuery, 2);
    suggestionResults = createSpellingSuggestionResults(query, spellingSuggestions);
  }
  
  // Search each entity type
  const results: SearchResult[] = [
    ...suggestionResults,
    ...searchCommands(normalizedQuery),
    ...searchPageCommands(normalizedQuery), // Add page commands to search results
    ...searchClients(normalizedQuery, filters, expandedTerms),
    ...searchTransactions(normalizedQuery, filters, expandedTerms),
    ...searchDocuments(normalizedQuery, filters, expandedTerms),
    ...searchHelpArticles(normalizedQuery, filters, expandedTerms),
    ...searchExchangeRates(normalizedQuery, filters, expandedTerms)
  ];
  
  // Filter results based on type if specified in filters
  const filteredResults = filters.type 
    ? results.filter(result => result.type === filters.type || result.type === 'suggestion')
    : results;
  
  // Sort results by relevance score (highest first)
  return filteredResults.sort((a, b) => (b.relevance || 0) - (a.relevance || 0));
}

// Export utility functions
export { getRecentSearches, clearRecentSearches };
