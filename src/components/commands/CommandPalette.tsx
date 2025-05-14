"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { Search, X, Command } from "lucide-react";
import type { LucideProps } from "lucide-react";
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from 'next/navigation';
import { UnifiedSearchUI } from "./UnifiedSearchUI";
import { useSearch } from "@/components/providers/SearchProvider";
import { SearchSuggestion } from "@/components/commands/search/types";
import { SearchFilters } from "./SearchFilters";

// Quick action commands
interface QuickAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  shortcut?: string;
  url: string;
}

export function CommandPalette() {
  const { 
    query, 
    results, 
    isLoading,
    error,
    selectedResultIndex,
    isOpen, 
    recentSearches,
    popularSearches,
    filters,
    handleQueryChange, 
    handleFilterChange,
    handleResultSelect, 
    handleKeyDown, 
    toggleSearchPanel, 
    clearSearch,
    useRecentSearch,
    usePopularSearch,
    useSuggestion,
    clearRecentSearches
  } = useSearch();
  
  const router = useRouter();
  const pathname = usePathname();
  
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // Quick actions are now handled by the UnifiedSearchUI component
  
  // Handle click outside to close the search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        toggleSearchPanel();
      }
    };
    
    // Handle Escape key to close search panel
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        toggleSearchPanel();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, toggleSearchPanel]);
  
  // Focus input when search panel is opened and handle keyboard navigation
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);
  
  // Close search panel when navigating between pages
  const [lastPathname, setLastPathname] = useState(pathname);
  
  useEffect(() => {
    if (pathname !== lastPathname) {
      // Path has changed, close the search panel
      if (isOpen) {
        toggleSearchPanel();
      }
      setLastPathname(pathname);
    }
  }, [pathname, lastPathname, isOpen, toggleSearchPanel]);
  
  // Close search panel after successful navigation
  const handleResultSelectWithClose = useCallback((result: any) => {
    handleResultSelect(result);
    // Give a slight delay to allow navigation to complete before closing
    setTimeout(() => toggleSearchPanel(), 100);
  }, [handleResultSelect, toggleSearchPanel]);
  
  // Close search panel after selecting a suggestion
  const handleSuggestionWithClose = useCallback((suggestion: SearchSuggestion) => {
    useSuggestion(suggestion.text);
    // Give a slight delay to allow navigation to complete before closing
    setTimeout(() => toggleSearchPanel(), 100);
  }, [useSuggestion, toggleSearchPanel]);
  
  return (
    <div className="relative flex justify-center w-full" ref={containerRef}>
      <div 
        className={cn(
          "relative w-full max-w-md md:max-w-lg lg:max-w-xl transition-all duration-200", // Responsive width
          isOpen && "scale-102"
        )}
      >
        <div 
          className={cn(
            "flex items-center bg-muted/50 dark:bg-gray-800/50 rounded-xl px-3 h-10 backdrop-blur-lg transition-all duration-200",
            isOpen ? "ring-2 ring-blue-500/20 bg-white dark:bg-gray-800" : "hover:bg-muted dark:hover:bg-gray-800"
          )}
          onClick={() => !isOpen && toggleSearchPanel()}
        >
          <Search 
            className="h-4 w-4 text-muted-foreground flex-shrink-0" 
          />
          
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              className="w-full bg-transparent outline-none text-base text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              placeholder="Search for anything..."
              value={query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleQueryChange(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>
          
          {query && isOpen && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
              onClick={clearSearch}
            >
              <X size={14} />
            </Button>
          )}
          
          {!query && (
            <div className="hidden md:flex items-center text-xs text-muted-foreground bg-muted dark:bg-gray-700 rounded-md px-1.5 py-0.5 ml-2">
              <Command className="h-3 w-3 mr-1" />
              <span>K</span>
            </div>
          )}
          
          {isOpen && (
            <SearchFilters 
              activeFilters={filters} 
              onFilterChange={handleFilterChange} 
            />
          )}
        </div>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="absolute top-full left-0 right-0 mt-2 z-50 w-full" // Full width of parent (which is already constrained)
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
          >
            <UnifiedSearchUI
              query={query}
              results={results}
              isLoading={isLoading}
              error={error}
              selectedIndex={selectedResultIndex}
              recentSearches={recentSearches}
              popularSearches={popularSearches}
              onSelectSuggestion={handleSuggestionWithClose}
              onResultSelect={handleResultSelectWithClose}
              onRecentSearchSelect={useRecentSearch}
              onClearRecentSearches={clearRecentSearches}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}