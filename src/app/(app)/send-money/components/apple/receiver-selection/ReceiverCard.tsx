import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, History, Eye, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Client } from '../../../hooks/useSendMoneyForm';
import { cn } from '@/lib/utils';

interface ReceiverCardProps {
  receiver: Client;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onShowDetails?: (client: Client) => void;
  onShowHistory?: (clientId: string) => void;
}

export function ReceiverCard({
  receiver,
  isSelected,
  isHovered,
  onSelect,
  onMouseEnter,
  onMouseLeave,
  onShowDetails,
  onShowHistory
}: ReceiverCardProps) {
  const showButtons = isSelected || isHovered;
  
  // Generate initials for avatar
  const getInitials = () => {
    return `${receiver.firstName?.charAt(0) || ''}${receiver.lastName?.charAt(0) || ''}`;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.005 }}
      whileTap={{ scale: 0.995 }}
      className={cn(
        "rounded-xl transition-all duration-150 flex cursor-pointer",
        "bg-white dark:bg-[#1C1C1E]",
        "min-h-[90px] overflow-hidden mb-2",
        isSelected
          ? "ring-2 ring-[#007AFF] dark:ring-[#0A84FF] shadow-sm"
          : "border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#2C2C2E]"
      )}
      onClick={onSelect}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Avatar with initials - Apple style circular avatar */}
      <div className="pl-4 flex items-center justify-center">
        <div 
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center",
            isSelected 
              ? "bg-[#007AFF] dark:bg-[#0A84FF]" 
              : "bg-gray-100 dark:bg-[#3A3A3C]"
          )}
        >
          <span className={cn(
            "text-base font-medium",
            isSelected ? "text-white" : "text-gray-700 dark:text-gray-200"
          )}>
            {getInitials()}
          </span>
        </div>
      </div>
      
      {/* Content area - clean Apple-style layout */}
      <div className="p-3 pl-4 flex-grow flex flex-col justify-center">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white text-base mb-0.5">
              {receiver.firstName} {receiver.lastName}
            </h3>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-sm text-gray-500 dark:text-gray-400">
              {receiver.phone && (
                <p className="truncate">{receiver.phone}</p>
              )}
              {receiver.country && (
                <p className="truncate">{receiver.country}</p>
              )}
              {receiver.relationshipToSender && (
                <p className="truncate text-xs">Relation: {receiver.relationshipToSender}</p>
              )}
            </div>
          </div>
          
          {/* Right side buttons and indicators */}
          <div className="flex items-center">
            <AnimatePresence>
              {showButtons && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center space-x-1 pr-1"
                >
                  {onShowHistory && (
                    <button
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        onShowHistory(receiver.id); 
                      }}
                      className="p-2 rounded-full text-gray-500 hover:text-[#007AFF] hover:bg-gray-100 dark:text-gray-400 dark:hover:text-[#0A84FF] dark:hover:bg-[#2C2C2E]"
                    >
                      <History className="h-4 w-4" />
                    </button>
                  )}
                  
                  {onShowDetails && (
                    <button
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        onShowDetails(receiver); 
                      }}
                      className="p-2 rounded-full text-gray-500 hover:text-[#007AFF] hover:bg-gray-100 dark:text-gray-400 dark:hover:text-[#0A84FF] dark:hover:bg-[#2C2C2E]"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            
            {isSelected ? (
              <CheckCircle className="h-5 w-5 text-[#007AFF] dark:text-[#0A84FF] mr-3" />
            ) : (
              <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-600 mr-3" />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
