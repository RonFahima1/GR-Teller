import React from 'react';

/**
 * Highlights the matching part of a suggestion with the query
 * @param suggestion The suggestion text
 * @param query The search query
 * @returns React node with highlighted matching text
 */
export function highlightMatch(suggestion: string, query: string): React.ReactNode {
  if (!query.trim()) return suggestion;
  
  const lowerSuggestion = suggestion.toLowerCase();
  const lowerQuery = query.toLowerCase().trim();
  
  // Find the index of the query in the suggestion
  const index = lowerSuggestion.indexOf(lowerQuery);
  
  if (index === -1) return suggestion;
  
  return (
    <>
      {suggestion.substring(0, index)}
      <span className="font-medium text-blue-600 dark:text-blue-400">
        {suggestion.substring(index, index + lowerQuery.length)}
      </span>
      {suggestion.substring(index + lowerQuery.length)}
    </>
  );
}
