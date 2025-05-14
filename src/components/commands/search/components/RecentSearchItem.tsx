import React from 'react';
import { Clock } from 'lucide-react';
import { RecentSearchItemProps } from '../types';

/**
 * Component for rendering a single recent search item
 */
export function RecentSearchItem({ query, onClick }: RecentSearchItemProps) {
  return (
    <div 
      className="px-4 py-2 flex items-center hover:bg-blue-50/80 dark:hover:bg-blue-900/20 cursor-pointer"
      onClick={() => onClick(query)}
    >
      <Clock className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-3 flex-shrink-0" />
      <span className="text-sm truncate">{query}</span>
    </div>
  );
}
