// Search analytics service to track search patterns and popular queries

import { SearchResult } from '@/types/search.types';

// Storage key for search analytics
const SEARCH_ANALYTICS_KEY = 'global-remit-search-analytics';

// Interface for search analytics data
interface SearchAnalytics {
  popularSearches: {
    query: string;
    count: number;
    lastUsed: string;
  }[];
  searchHistory: {
    query: string;
    timestamp: string;
    resultCount: number;
    selectedResult?: {
      id: string;
      type: string;
      title: string;
    };
  }[];
  clickThroughRate: {
    [key: string]: {
      searches: number;
      clicks: number;
    };
  };
}

// Initialize analytics
function getAnalytics(): SearchAnalytics {
  if (typeof window === 'undefined') {
    return {
      popularSearches: [],
      searchHistory: [],
      clickThroughRate: {}
    };
  }
  
  const storedAnalytics = localStorage.getItem(SEARCH_ANALYTICS_KEY);
  
  if (!storedAnalytics) {
    return {
      popularSearches: [],
      searchHistory: [],
      clickThroughRate: {}
    };
  }
  
  try {
    return JSON.parse(storedAnalytics);
  } catch (error) {
    console.error('Error parsing search analytics:', error);
    return {
      popularSearches: [],
      searchHistory: [],
      clickThroughRate: {}
    };
  }
}

// Save analytics
function saveAnalytics(analytics: SearchAnalytics): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(SEARCH_ANALYTICS_KEY, JSON.stringify(analytics));
  } catch (error) {
    console.error('Error saving search analytics:', error);
  }
}

// Track a search query
export function trackSearch(query: string, resultCount: number): void {
  if (!query.trim()) return;
  
  const analytics = getAnalytics();
  const normalizedQuery = query.toLowerCase().trim();
  
  // Update search history
  analytics.searchHistory.unshift({
    query: normalizedQuery,
    timestamp: new Date().toISOString(),
    resultCount
  });
  
  // Limit history to last 100 searches
  if (analytics.searchHistory.length > 100) {
    analytics.searchHistory = analytics.searchHistory.slice(0, 100);
  }
  
  // Update popular searches
  const existingPopular = analytics.popularSearches.find(
    item => item.query === normalizedQuery
  );
  
  if (existingPopular) {
    existingPopular.count += 1;
    existingPopular.lastUsed = new Date().toISOString();
  } else {
    analytics.popularSearches.push({
      query: normalizedQuery,
      count: 1,
      lastUsed: new Date().toISOString()
    });
  }
  
  // Sort popular searches by count
  analytics.popularSearches.sort((a, b) => b.count - a.count);
  
  // Limit to top 20 popular searches
  if (analytics.popularSearches.length > 20) {
    analytics.popularSearches = analytics.popularSearches.slice(0, 20);
  }
  
  // Update click-through rate data
  if (!analytics.clickThroughRate[normalizedQuery]) {
    analytics.clickThroughRate[normalizedQuery] = {
      searches: 0,
      clicks: 0
    };
  }
  
  analytics.clickThroughRate[normalizedQuery].searches += 1;
  
  saveAnalytics(analytics);
}

// Track when a user clicks on a search result
export function trackResultClick(query: string, result: SearchResult): void {
  if (!query.trim()) return;
  
  const analytics = getAnalytics();
  const normalizedQuery = query.toLowerCase().trim();
  
  // Update the last search history item with the selected result
  if (analytics.searchHistory.length > 0) {
    const lastSearch = analytics.searchHistory[0];
    
    if (lastSearch.query === normalizedQuery) {
      lastSearch.selectedResult = {
        id: result.id,
        type: result.type,
        title: result.title
      };
    }
  }
  
  // Update click-through rate
  if (!analytics.clickThroughRate[normalizedQuery]) {
    analytics.clickThroughRate[normalizedQuery] = {
      searches: 1,
      clicks: 0
    };
  }
  
  analytics.clickThroughRate[normalizedQuery].clicks += 1;
  
  saveAnalytics(analytics);
}

// Get popular searches
export function getPopularSearches(limit = 5): string[] {
  const analytics = getAnalytics();
  return analytics.popularSearches
    .slice(0, limit)
    .map(item => item.query);
}

// Get search click-through rate
export function getSearchClickThroughRate(): Record<string, number> {
  const analytics = getAnalytics();
  const ctr: Record<string, number> = {};
  
  Object.entries(analytics.clickThroughRate).forEach(([query, data]) => {
    if (data.searches > 0) {
      ctr[query] = data.clicks / data.searches;
    } else {
      ctr[query] = 0;
    }
  });
  
  return ctr;
}

// Clear all analytics data
export function clearSearchAnalytics(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(SEARCH_ANALYTICS_KEY);
}
