import React, { useState, useEffect } from 'react';
import { SearchSection } from './SearchSection';
import { SuggestionItem } from './SuggestionItem';
import { FIXED_SUGGESTIONS, SearchSuggestion } from '../types/suggestions';
import { cn } from '@/lib/utils';

// Map category codes to display names
const CATEGORY_TITLES: Record<string, string> = {
  'money': 'Money Operations',
  'clients': 'Client Management',
  'reports': 'Reports',
  'settings': 'Settings',
  'help': 'Help'
};

/**
 * Component for rendering search suggestions
 */
export function SearchSuggestions({ query, onSuggestionClick }: { query: string; onSuggestionClick: (suggestion: SearchSuggestion) => void }) {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Filter suggestions based on query
  const filteredSuggestions = FIXED_SUGGESTIONS.filter((suggestion: SearchSuggestion) => {
    const searchTerm = query.toLowerCase();
    return suggestion.title.toLowerCase().includes(searchTerm) ||
           (suggestion.description?.toLowerCase().includes(searchTerm) ?? false);
  }) as SearchSuggestion[];

  // Reset selected index when suggestions change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (filteredSuggestions.length === 0) return;
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev < filteredSuggestions.length - 1 ? prev + 1 : 0));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : filteredSuggestions.length - 1));
          break;
        case 'Enter':
          if (selectedIndex >= 0 && selectedIndex < filteredSuggestions.length) {
            e.preventDefault();
            onSuggestionClick(filteredSuggestions[selectedIndex]);
          }
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [filteredSuggestions, selectedIndex, onSuggestionClick]);

  if (filteredSuggestions.length === 0) return null;
  
  return (
    <div className="border-b border-gray-100 dark:border-gray-700">
      <SearchSection title="Suggestions">
        {/* Organize suggestions by category */}
        {['money', 'clients', 'reports', 'settings', 'help'].map(category => {
          const categorySuggestions = filteredSuggestions.filter(s => s.category === category);
          if (categorySuggestions.length === 0) return null;

          return (
            <div key={category}>
              <SearchSection title={CATEGORY_TITLES[category]}>
                <div>
                  {categorySuggestions.map((suggestion, index) => (
                    <SuggestionItem 
                      key={suggestion.title}
                      suggestion={suggestion}
                      query={query}
                      onClick={onSuggestionClick}
                      isSelected={selectedIndex === index}
                    />
                  ))}
                </div>
              </SearchSection>
            </div>
          );
        })}
      </SearchSection>
    </div>
  );
}
