"use client";

import { 
  User, 
  File, 
  Repeat, 
  HelpCircle, 
  Settings, 
  MessageSquare,
  Terminal,
  RefreshCw,
  DollarSign
} from 'lucide-react';
import { SearchResult } from '@/types/search.types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface SearchResultItemProps {
  result: SearchResult;
  isSelected: boolean;
  onClick: () => void;
}

export function SearchResultItem({ result, isSelected, onClick }: SearchResultItemProps) {
  // Map result type to icon
  const getIcon = () => {
    switch (result.type) {
      case 'client':
        return <User className="h-4 w-4" />;
      case 'document':
        return <File className="h-4 w-4" />;
      case 'transaction':
        return <Repeat className="h-4 w-4" />;
      case 'help':
        return <HelpCircle className="h-4 w-4" />;
      case 'setting':
        return <Settings className="h-4 w-4" />;
      case 'note':
        return <MessageSquare className="h-4 w-4" />;
      case 'command':
        return <Terminal className="h-4 w-4" />;
      case 'exchange':
        return <RefreshCw className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };
  
  return (
    <motion.div 
      className={cn(
        "px-3 py-2 cursor-pointer hover:bg-blue-50/80 dark:hover:bg-blue-900/30 flex items-start rounded-xl transition-colors duration-200",
        isSelected ? "bg-blue-100/70 dark:bg-blue-900/40" : ""
      )}
      onClick={onClick}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
    >
      <div className={cn(
        "flex-shrink-0 mr-3 p-2 rounded-full",
        isSelected ? "bg-blue-100 text-blue-600 dark:bg-blue-900/60 dark:text-blue-400" : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
      )}>
        {getIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate">{result.title}</div>
        {result.description && (
          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{result.description}</div>
        )}
      </div>
      
      {result.type === 'command' && (
        <div className="ml-2 text-xs text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700 rounded-full px-2 py-0.5">
          Run
        </div>
      )}
    </motion.div>
  );
}
