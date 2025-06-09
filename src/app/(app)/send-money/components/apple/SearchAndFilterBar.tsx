import React from 'react';
import { Search, Filter, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SearchAndFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onClickFilter: () => void;
  onClickNewSender: () => void;
  className?: string;
}

const SearchAndFilterBar: React.FC<SearchAndFilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  onClickFilter,
  onClickNewSender,
  className,
}) => {
  return (
    <div className={cn("flex items-center gap-3 w-full", className)}>
      {/* Search input with icon */}
      <div className="flex-1 relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E93] dark:text-[#98989D] pointer-events-none">
          <Search className="h-4 w-4" />
        </div>
        <input
          type="text"
          placeholder="Search by name, phone, or ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full py-2 px-10 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-full border-none shadow-sm focus:ring-2 focus:ring-[#007AFF] dark:focus:ring-[#0A84FF] placeholder-[#8E8E93] dark:placeholder-[#98989D] text-[#1C1C1E] dark:text-white text-sm transition-shadow"
        />
        {searchQuery && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#C7C7CC] dark:bg-[#636366] rounded-full w-4 h-4 flex items-center justify-center text-white"
            onClick={() => setSearchQuery('')}
          >
            <span className="text-xs font-bold">×</span>
          </motion.button>
        )}
      </div>

      {/* Filter button - neutral color that turns blue on hover */}
      <motion.button
        onClick={onClickFilter}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="p-2 rounded-full bg-[#F2F2F7] dark:bg-[#2C2C2E] text-[#8E8E93] dark:text-[#98989D] hover:bg-[#007AFF] hover:text-white dark:hover:bg-[#0A84FF] dark:hover:text-white transition-all flex items-center justify-center shadow-sm"
      >
        <Filter className="h-5 w-5" />
      </motion.button>
      
      {/* New sender button - also neutral color that turns blue on hover */}
      <motion.button
        onClick={onClickNewSender}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="p-2 rounded-full bg-[#F2F2F7] dark:bg-[#2C2C2E] text-[#8E8E93] dark:text-[#98989D] hover:bg-[#007AFF] hover:text-white dark:hover:bg-[#0A84FF] dark:hover:text-white transition-all flex items-center justify-center shadow-sm"
      >
        <PlusCircle className="h-5 w-5" />
      </motion.button>
    </div>
  );
};

export default SearchAndFilterBar;
