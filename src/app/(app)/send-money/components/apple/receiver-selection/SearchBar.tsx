import React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  className?: string;
  placeholder?: string;
}

export function SearchBar({ 
  searchQuery, 
  setSearchQuery, 
  className,
  placeholder = "Search receivers by name, phone, or country..." 
}: SearchBarProps) {
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className={cn("relative w-full", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
      
      <input
        type="search"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={cn(
          "w-full h-12 pl-10 pr-10 rounded-lg border",
          "bg-white dark:bg-[#2C2C2E]",
          "border-gray-200 dark:border-[#3A3A3C]",
          "text-gray-900 dark:text-white",
          "placeholder:text-gray-400 dark:placeholder:text-gray-500",
          "focus:outline-none focus:ring-2 focus:ring-[#007AFF] dark:focus:ring-[#0A84FF] focus:border-transparent",
          "transition-all duration-200"
        )}
      />
      
      {searchQuery && (
        <button
          onClick={handleClearSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center rounded-full 
                   bg-gray-200 dark:bg-[#3A3A3C] text-gray-500 dark:text-gray-400 hover:bg-gray-300 
                   dark:hover:bg-[#48484A] transition-colors"
          aria-label="Clear search"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
