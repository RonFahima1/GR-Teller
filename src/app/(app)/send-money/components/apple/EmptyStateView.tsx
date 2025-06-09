import React from 'react';
import { SearchX } from 'lucide-react';
import { motion } from 'framer-motion';
import { AppleButton } from '@/components/ui/apple-button';

interface EmptyStateViewProps {
  title?: string;
  message: string;
  showAddButton?: boolean;
  actionLabel?: string;
  onAction?: () => void;
  onClickAdd?: () => void; // For backwards compatibility
}

/**
 * Apple-styled empty state component
 */
export const EmptyStateView: React.FC<EmptyStateViewProps> = ({
  title = "No matches found",
  message,
  showAddButton = false,
  actionLabel = "Add New Sender",
  onAction,
  onClickAdd // For backward compatibility
}) => {
  // Use onAction if provided, otherwise fall back to onClickAdd
  const handleAction = onAction || onClickAdd;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex flex-col items-center justify-center py-12 px-4 space-y-4 text-center"
    >
      <div className="w-16 h-16 rounded-full bg-[#F2F2F7] dark:bg-[#2C2C2E] flex items-center justify-center">
        <SearchX className="h-8 w-8 text-[#8E8E93] dark:text-[#98989D]" />
      </div>
      
      <div className="max-w-sm">
        <h3 className="text-lg font-medium text-[#1C1C1E] dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-sm text-[#8E8E93] dark:text-[#98989D]">
          {message}
        </p>
      </div>

      {/* Support both new and legacy prop patterns */}
      {((showAddButton && handleAction) || onAction) && (
        <AppleButton 
          variant="primary" 
          onClick={handleAction}
          className="mt-4"
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {actionLabel}
        </AppleButton>
      )}
    </motion.div>
  );
};

export default EmptyStateView;
