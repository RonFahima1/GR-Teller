import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, UserPlus, History as HistoryIcon, Eye, ChevronRight, Plus, Users } from 'lucide-react';
import { Receiver } from '@/types/receiver';
import { cn } from '@/lib/utils';

interface AppleRecentReceiversModalProps {
  isOpen: boolean;
  onClose: () => void;
  receivers: Receiver[];
  selectedSenderName?: string;
  onSelectReceiver: (receiver: Receiver) => void;
  onShowReceiverDetails: (receiver: Receiver) => void;
  onShowReceiverHistory: (receiverId: string) => void;
  onAddNewReceiver: () => void;
  onSearchReceiver: () => void;
  isLoading?: boolean;
}

export function AppleRecentReceiversModal({
  isOpen,
  onClose,
  receivers,
  selectedSenderName,
  onSelectReceiver,
  onShowReceiverDetails,
  onShowReceiverHistory,
  onAddNewReceiver,
  onSearchReceiver,
  isLoading = false
}: AppleRecentReceiversModalProps) {
  const [hoveredReceiverId, setHoveredReceiverId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle selecting a receiver and closing modal
  const handleSelectAndClose = (receiver: Receiver) => {
    onSelectReceiver(receiver);
    onClose();
  };

  // Get initials for avatar
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  // iOS-style backdrop and modal animation
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.98, opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="bg-white dark:bg-[#1C1C1E] rounded-xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header - iOS style */}
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Recent Receivers
              </h3>
              <button
                onClick={onClose}
                className="p-2 rounded-full text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2C2C2E]"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content with iOS-like styling */}
            <div className="overflow-y-auto flex-grow p-4 bg-gray-50 dark:bg-black">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full py-10">
                  <div className="w-8 h-8 border-2 border-t-transparent border-[#007AFF] dark:border-[#0A84FF] rounded-full animate-spin mb-3"></div>
                  <p className="text-gray-500 dark:text-gray-400">Loading receivers...</p>
                </div>
              ) : receivers.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-10 text-center">
                  <div className="bg-gray-100 dark:bg-[#2C2C2E] p-5 rounded-full mb-4">
                    <UserPlus className="h-7 w-7 text-gray-500 dark:text-gray-400" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-2 text-lg">
                    No recent receivers
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                    {selectedSenderName ? `${selectedSenderName} has no recent transfers.` : 'No transfers found.'}
                  </p>
                  <button
                    onClick={onSearchReceiver}
                    className="px-5 py-2.5 rounded-full bg-[#007AFF] hover:bg-[#0062CC] dark:bg-[#0A84FF] dark:hover:bg-[#409CFF] text-white text-sm font-medium flex items-center justify-center"
                  >
                    <Search className="h-4 w-4 mr-2" /> Search for Receivers
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {receivers.map((receiver) => {
                    const isHovered = hoveredReceiverId === receiver.id;
                    const showButtons = isHovered;
                    
                    return (
                      <motion.div
                        key={receiver.id}
                        whileHover={{ scale: 1.005 }}
                        whileTap={{ scale: 0.995 }}
                        className="rounded-xl transition-all duration-150 flex items-center cursor-pointer
                                  bg-white dark:bg-[#1C1C1E] border border-gray-200 dark:border-gray-800 hover:shadow-sm p-3"
                        onClick={() => handleSelectAndClose(receiver)}
                        onMouseEnter={() => setHoveredReceiverId(receiver.id)}
                        onMouseLeave={() => setHoveredReceiverId(null)}
                      >
                        {/* Avatar - circular with initials */}
                        <div className="flex-shrink-0 mr-3">
                          <div className="h-12 w-12 rounded-full bg-gray-50 dark:bg-[#2C2C2E] flex items-center justify-center border border-gray-100 dark:border-gray-700">
                            <span className="text-base font-medium text-gray-700 dark:text-gray-200">
                              {getInitials(receiver.firstName, receiver.lastName)}
                            </span>
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="flex-grow">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium text-gray-900 dark:text-white text-base">
                                {receiver.firstName} {receiver.lastName}
                              </h3>
                              <div className="flex flex-wrap gap-x-4 text-sm text-gray-500 dark:text-gray-400">
                                {receiver.phone && <span>{receiver.phone}</span>}
                                {receiver.country && <span>{receiver.country}</span>}
                              </div>
                            </div>
                            
                            <div className="flex items-center">
                              <AnimatePresence>
                                {showButtons && (
                                  <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                    className="flex items-center space-x-1 mr-1"
                                  >
                                    <button 
                                      onClick={(e) => { 
                                        e.stopPropagation(); 
                                        onShowReceiverHistory(receiver.id); 
                                      }}
                                      className="p-1.5 rounded-full text-gray-500 hover:text-[#007AFF] dark:text-gray-400 dark:hover:text-[#0A84FF]
                                                 hover:bg-gray-100 dark:hover:bg-[#2C2C2E] transition-colors"
                                      aria-label="View Receiver History"
                                    >
                                      <HistoryIcon size={16} />
                                    </button>
                                    <button
                                      onClick={(e) => { 
                                        e.stopPropagation(); 
                                        onShowReceiverDetails(receiver); 
                                      }}
                                      className="p-1.5 rounded-full text-gray-500 hover:text-[#007AFF] dark:text-gray-400 dark:hover:text-[#0A84FF]
                                                 hover:bg-gray-100 dark:hover:bg-[#2C2C2E] transition-colors"
                                      aria-label="View Receiver Details"
                                    >
                                      <Eye size={16} />
                                    </button>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                              <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-600" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer with iOS-style actions */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-[#1C1C1E]">
              {/* Add new receiver button - now on the left */}
              <button 
                onClick={() => {
                  // Ensure the onAddNewReceiver callback is called consistently
                  // This will trigger our central navigation handler in the parent component
                  if (onAddNewReceiver) {
                    onAddNewReceiver();
                  }
                }} 
                className="px-5 py-2 rounded-full bg-[#007AFF] hover:bg-[#0062CC] dark:bg-[#0A84FF] dark:hover:bg-[#409CFF] text-white font-medium text-sm flex items-center"
              >
                <Plus className="mr-1.5 h-4 w-4" /> 
                New Receiver
              </button>
              
              {/* Search button with icon and tooltip - now on the right */}
              <button 
                onClick={onSearchReceiver}
                className="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-[#2C2C2E] dark:hover:bg-[#3A3A3C] text-gray-700 dark:text-gray-300 transition-colors group relative"
                aria-label="Search for receivers"
              >
                <Search className="h-5 w-5" />
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Search Receivers
                </span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
