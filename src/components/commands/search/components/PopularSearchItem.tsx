import React from 'react';
import { TrendingUp } from 'lucide-react';
import { PopularSearchItemProps } from '../types';

/**
 * Component for rendering a single popular search item
 */
export function PopularSearchItem({ query, onClick }: PopularSearchItemProps) {
  return (
    <div 
      className="px-4 py-2 flex items-center hover:bg-blue-50/80 dark:hover:bg-blue-900/20 cursor-pointer"
      onClick={() => onClick(query)}
    >
      <TrendingUp className="h-4 w-4 text-blue-500 dark:text-blue-400 mr-3 flex-shrink-0" />
      <span className="text-sm truncate">{query}</span>
    </div>
  );
}
