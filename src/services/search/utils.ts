import { SearchResult } from '@/types/search.types';
import { SearchFilters } from './types';

/**
 * Helper function to filter by date range
 * @param dateStr Date string to check
 * @param dateRange Date range to filter by
 * @returns Boolean indicating if the date is within range
 */
export function filterByDateRange(dateStr: string, dateRange?: { from?: string; to?: string }): boolean {
  if (!dateStr) return true; // Skip items without dates
  if (!dateRange || (!dateRange.from && !dateRange.to)) return true; // No date range filter
  
  const itemDate = new Date(dateStr);
  
  if (dateRange.from && itemDate < new Date(dateRange.from)) {
    return false;
  }
  
  if (dateRange.to && itemDate > new Date(dateRange.to)) {
    return false;
  }
  
  return true;
}

/**
 * Calculate relevance score for a search result based on how well it matches the query
 * @param item Search result item
 * @param query Normalized search query
 * @param isExpandedTerm Whether this match is from an expanded term (synonym)
 * @returns Relevance score (0-100)
 */
export function calculateRelevanceScore(
  item: SearchResult, 
  query: string, 
  isExpandedTerm: boolean = false
): number {
  // Base score starts at 50
  let score = 50;
  
  // Exact title match is highest priority
  if (item.title.toLowerCase() === query) {
    score += 50;
  }
  // Title starts with query is high priority
  else if (item.title.toLowerCase().startsWith(query)) {
    score += 40;
  }
  // Title contains query is medium priority
  else if (item.title.toLowerCase().includes(query)) {
    score += 30;
  }
  // Description contains query is lower priority
  else if (item.description?.toLowerCase().includes(query)) {
    score += 20;
  }
  
  // Boost recent items
  if (item.timestamp) {
    const itemDate = new Date(item.timestamp);
    const now = new Date();
    const daysDifference = Math.floor((now.getTime() - itemDate.getTime()) / (1000 * 3600 * 24));
    
    // Boost items from the last 7 days
    if (daysDifference < 7) {
      score += Math.max(0, 10 - daysDifference);
    }
  }
  
  // Reduce score for expanded terms (synonyms, spell corrections)
  if (isExpandedTerm) {
    score *= 0.8;
  }
  
  // Entity type priority adjustments
  switch (item.type) {
    case 'client':
      score += 5; // Clients are high priority
      break;
    case 'transaction':
      score += 3; // Transactions are medium-high priority
      break;
    case 'command':
      score += 7; // Commands are highest priority
      break;
    case 'suggestion':
      score -= 10; // Suggestions are lower priority
      break;
  }
  
  // Cap score at 100
  return Math.min(100, Math.max(0, score));
}

/**
 * Get recent searches from localStorage
 * @returns Array of recent search queries
 */
export function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const recentSearches = localStorage.getItem('recentSearches');
    return recentSearches ? JSON.parse(recentSearches) : [];
  } catch (error) {
    console.error('Error retrieving recent searches:', error);
    return [];
  }
}

/**
 * Save search query to recent searches
 * @param query Search query to save
 */
export function saveSearchQuery(query: string): void {
  if (typeof window === 'undefined' || !query.trim()) return;
  
  try {
    const recentSearches = getRecentSearches();
    
    // Remove the query if it already exists
    const filteredSearches = recentSearches.filter(item => item !== query);
    
    // Add the new query to the beginning
    const updatedSearches = [query, ...filteredSearches].slice(0, 10);
    
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  } catch (error) {
    console.error('Error saving search query:', error);
  }
}

/**
 * Clear recent searches
 */
export function clearRecentSearches(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem('recentSearches');
  } catch (error) {
    console.error('Error clearing recent searches:', error);
  }
}
