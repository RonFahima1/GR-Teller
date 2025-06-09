'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Edit, History, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SenderHeaderProps {
  name: string;
  status: string;
}

export const SenderHeader: React.FC<SenderHeaderProps> = ({ name, status }) => {
  const [showHistory, setShowHistory] = useState(false);
  const [showEditOptions, setShowEditOptions] = useState(false);
  
  const handleEditClick = () => {
    setShowEditOptions(prev => !prev);
    // Provide haptic feedback
    if (navigator && 'vibrate' in navigator && navigator.vibrate) {
      navigator.vibrate(50);
    }
  };
  
  const handleHistoryClick = () => {
    setShowHistory(prev => !prev);
    // Provide haptic feedback
    if (navigator && 'vibrate' in navigator && navigator.vibrate) {
      navigator.vibrate(50);
    }
  };
  
  return (
    <div className="mb-8 px-1">
      <div className="flex items-center justify-between flex-wrap">
        <div className="flex items-center mb-4 md:mb-0">
          <h1 className="text-3xl font-semibold text-[#1C1C1E] dark:text-white mr-4 tracking-tight">
            {name}
          </h1>
          <div 
            className={cn(
              "py-1.5 px-4 rounded-full text-sm font-medium flex items-center shadow-sm",
              status === 'Active' ? "bg-[#E4F8ED] dark:bg-[#071D12] text-[#34C759] dark:text-[#30D158]" :
              status === 'Inactive' ? "bg-[#F8E4E4] dark:bg-[#1D0707] text-[#FF3B30] dark:text-[#FF453A]" :
              "bg-[#F2F2F7] dark:bg-[#2C2C2E] text-[#8E8E93] dark:text-[#98989D]"
            )}
          >
            <span 
              className={cn(
                "w-2.5 h-2.5 rounded-full mr-2",
                status === 'Active' ? "bg-[#34C759] dark:bg-[#30D158]" :
                status === 'Inactive' ? "bg-[#FF3B30] dark:bg-[#FF453A]" :
                "bg-[#8E8E93] dark:bg-[#98989D]"
              )} 
            />
            {status}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="flex items-center px-4 py-2.5 bg-[#F2F2F7] dark:bg-[#2C2C2E] text-[#007AFF] rounded-lg hover:bg-[#E5E5EA] dark:hover:bg-[#3A3A3C] transition-colors shadow-sm"
            aria-label="View transaction history"
            onClick={handleHistoryClick}
          >
            <History size={18} className="mr-2" />
            <span className="text-base font-medium">History</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="flex items-center px-4 py-2.5 bg-[#F2F2F7] dark:bg-[#2C2C2E] text-[#007AFF] rounded-lg hover:bg-[#E5E5EA] dark:hover:bg-[#3A3A3C] transition-colors shadow-sm"
            aria-label="Edit sender details"
            onClick={handleEditClick}
          >
            <Edit size={18} className="mr-2" />
            <span className="text-base font-medium">Edit</span>
          </motion.button>
        </div>
      </div>
      
      {/* Edit options panel - slides in when Edit button is clicked */}
      <AnimatePresence>
        {showEditOptions && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="mt-6 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-xl overflow-hidden border border-[#E5E5EA] dark:border-[#38383A] shadow-sm"
          >
            <div className="p-4 space-y-2">
              <motion.button 
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-between py-3 px-4 hover:bg-white dark:hover:bg-[#1C1C1E] rounded-lg transition-colors"
              >
                <span className="text-base font-medium text-[#1C1C1E] dark:text-white">Edit Personal Information</span>
                <ChevronRight size={18} className="text-[#8E8E93] dark:text-[#98989D]" />
              </motion.button>
              <motion.button
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-between py-3 px-4 hover:bg-white dark:hover:bg-[#1C1C1E] rounded-lg transition-colors"
              >
                <span className="text-base font-medium text-[#1C1C1E] dark:text-white">Edit Contact Details</span>
                <ChevronRight size={18} className="text-[#8E8E93] dark:text-[#98989D]" />
              </motion.button>
              <motion.button
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-between py-3 px-4 hover:bg-white dark:hover:bg-[#1C1C1E] rounded-lg transition-colors"
              >
                <span className="text-base font-medium text-[#1C1C1E] dark:text-white">Edit Bank Details</span>
                <ChevronRight size={18} className="text-[#8E8E93] dark:text-[#98989D]" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Transaction history preview - slides in when History button is clicked */}
      <AnimatePresence>
        {showHistory && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="mt-6 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-xl overflow-hidden border border-[#E5E5EA] dark:border-[#38383A] shadow-sm"
          >
            <div className="p-5">
              <h4 className="text-base font-semibold text-[#1C1C1E] dark:text-white mb-3">Recent Transactions</h4>
              <div className="space-y-3">
                {/* Transaction items */}
                <div className="flex items-center justify-between py-3 px-4 bg-white dark:bg-[#1C1C1E] rounded-lg shadow-sm">
                  <div>
                    <p className="text-base font-medium text-[#1C1C1E] dark:text-white">Transfer to John Doe</p>
                    <p className="text-sm text-[#8E8E93] dark:text-[#98989D] mt-0.5">24 Apr 2023, 14:30</p>
                  </div>
                  <p className="text-base font-semibold text-[#FF3B30] dark:text-[#FF453A]">-$500.00</p>
                </div>
                <div className="flex items-center justify-between py-3 px-4 bg-white dark:bg-[#1C1C1E] rounded-lg shadow-sm">
                  <div>
                    <p className="text-base font-medium text-[#1C1C1E] dark:text-white">Deposit from Bank</p>
                    <p className="text-sm text-[#8E8E93] dark:text-[#98989D] mt-0.5">20 Apr 2023, 10:15</p>
                  </div>
                  <p className="text-base font-semibold text-[#34C759] dark:text-[#30D158]">+$1,200.00</p>
                </div>
                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center py-3 text-[#007AFF] text-base font-medium mt-2 bg-white dark:bg-[#1C1C1E] hover:bg-[#F9F9F9] dark:hover:bg-[#2C2C2E] rounded-lg transition-colors shadow-sm"
                >
                  View All Transactions
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
