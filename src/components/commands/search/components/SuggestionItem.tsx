import React from 'react';
import { Search, Navigation, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SuggestionItemProps } from '../types';
import { highlightMatch } from '../utils/highlightMatch';

/**
 * Component for rendering a single suggestion item
 */
export function SuggestionItem({ suggestion, query, onClick, isSelected = false }: SuggestionItemProps) {
  return (
    <div 
      className={cn(
        "px-4 py-2 flex items-center justify-between cursor-pointer group",
        isSelected 
          ? "bg-blue-50 dark:bg-blue-900/30" 
          : "hover:bg-blue-50/80 dark:hover:bg-blue-900/20"
      )}
      onClick={() => onClick(suggestion)}
    >
      <div className="flex items-center">
        {suggestion.type === 'page' ? (
          <Navigation className="h-4 w-4 text-blue-500 dark:text-blue-400 mr-3 flex-shrink-0" />
        ) : (
          <Search className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-3 flex-shrink-0" />
        )}
        <span className={cn(
          "text-sm truncate",
          suggestion.type === 'page' ? "font-medium text-blue-600 dark:text-blue-400" : ""
        )}>
          {highlightMatch(suggestion.text, query)}
        </span>
      </div>
      <ArrowUpRight className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
