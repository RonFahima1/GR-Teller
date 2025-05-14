import React, { useEffect } from 'react';
import { SearchSection } from './SearchSection';
import { SearchResultItem } from './SearchResultItem';
import { SearchResultsProps } from '../types';

/**
 * Component for rendering search results
 */
export function SearchResults({ results, selectedIndex, onResultSelect }: SearchResultsProps) {
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (results.length === 0) return;
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          // This is handled in the parent component, but we prevent default here
          break;
        case 'ArrowUp':
          e.preventDefault();
          // This is handled in the parent component, but we prevent default here
          break;
        case 'Enter':
          if (selectedIndex >= 0 && selectedIndex < results.length) {
            e.preventDefault();
            onResultSelect(results[selectedIndex]);
          }
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [results, selectedIndex, onResultSelect]);
  
  if (results.length === 0) return null;
  
  return (
    <div>
      <SearchSection title="Results">
        {/* Provide children prop to fix TypeScript error */}
        <div className="max-h-[60vh] overflow-y-auto">
          {results.map((result, index) => (
            <SearchResultItem 
              key={`result-${index}`} // This is a React key, not a prop
              result={result}
              isSelected={selectedIndex === index}
              onClick={() => onResultSelect(result)}
            />
          ))}
        </div>
      </SearchSection>
    </div>
  );
}
