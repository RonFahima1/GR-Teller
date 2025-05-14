import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, UserPlus, History, Eye, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Receiver } from '@/types/receiver';
import { cn } from '@/lib/utils';

interface RecentReceiversModalProps {
  isOpen: boolean;
  onClose: () => void;
  receivers: Receiver[];
  selectedSenderName?: string; // Optional: For display in modal title
  onSelectReceiver: (receiver: Receiver) => void;
  onShowReceiverDetails: (receiver: Receiver) => void;
  onShowReceiverHistory: (receiverId: string) => void;
  onSearchOrAddNew: () => void; // Callback to close this modal and activate main search/new receiver form
  isLoading?: boolean;
}

export const RecentReceiversModal: React.FC<RecentReceiversModalProps> = ({
  isOpen,
  onClose,
  receivers,
  selectedSenderName,
  onSelectReceiver,
  onShowReceiverDetails,
  onShowReceiverHistory,
  onSearchOrAddNew,
  isLoading,
}) => {
  const [hoveredReceiverId, setHoveredReceiverId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectAndClose = (receiver: Receiver) => {
    onSelectReceiver(receiver);
    onClose(); // Close this modal after selection
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            transition={{ type: 'spring', stiffness: 280, damping: 25 }}
            className="bg-gray-100 dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Receivers {selectedSenderName ? `for ${selectedSenderName}` : ''}
              </h3>
              <Button variant="ghost_icon" size="sm" onClick={onClose} className="rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Content & Receiver List */}
            <div className="p-4 sm:p-5 overflow-y-auto flex-grow custom-scrollbar">
              {isLoading && <p className="text-center text-gray-500 dark:text-gray-400 py-6">Loading recent receivers...</p>}
              {!isLoading && receivers.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-10">
                  No recent receivers found {selectedSenderName ? `for ${selectedSenderName}` : ''}. <br/> You can search or add a new one.
                </p>
              )}
              {!isLoading && receivers.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {receivers.map((receiver) => {
                    // No explicit selection state within this modal, primary action is click-to-select-and-close
                    const showButtons = hoveredReceiverId === receiver.id;
                    return (
                      <div 
                        key={receiver.id} 
                        className={cn(
                          "rounded-lg transition-all duration-200 ease-in-out flex flex-col cursor-pointer text-sm",
                          "bg-white dark:bg-gray-700 hover:shadow-xl dark:hover:bg-gray-600/80",
                          "min-h-[90px] border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                        )}
                        onClick={() => handleSelectAndClose(receiver)} // Main action: select receiver
                        onMouseEnter={() => setHoveredReceiverId(receiver.id)}
                        onMouseLeave={() => setHoveredReceiverId(null)}
                      >
                        <div className="p-3 flex-grow flex flex-col justify-between">
                          <div> 
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-base text-gray-800 dark:text-white truncate mr-2 flex-shrink min-w-0">
                                {receiver.firstName} {receiver.lastName}
                              </h3>
                              <AnimatePresence>
                                {showButtons && (
                                  <motion.div 
                                    initial={{ opacity: 0, x: 5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 5 }}
                                    transition={{ duration: 0.15 }}
                                    className="flex items-center space-x-1 flex-shrink-0"
                                  >
                                    {onShowReceiverHistory && (
                                      <Button 
                                        variant="ghost_icon_sm" size="icon_xs"
                                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); onShowReceiverHistory(receiver.id); }}
                                        title="View Receiver History"
                                        className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                                      ><History className="h-4 w-4" /></Button>
                                    )}
                                    {onShowReceiverDetails && (
                                      <Button
                                        variant="ghost_icon_sm" size="icon_xs"
                                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); onShowReceiverDetails(receiver); }}
                                        title="View Receiver Details"
                                        className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                                      ><Eye className="h-4 w-4" /></Button>
                                    )}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                            <div className="space-y-0.5 text-xs text-gray-500 dark:text-gray-400">
                              <p className="truncate">Phone: {receiver.phone || 'N/A'}</p>
                              <p className="truncate">Country: {receiver.country || 'N/A'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-4 sm:p-5 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-3 justify-end">
              <Button 
                variant="outline_primary" 
                onClick={onClose} 
                className="sm:w-auto"
              >
                Cancel / Close
              </Button>
              <Button 
                onClick={onSearchOrAddNew} 
                className="sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Search className="mr-2 h-4 w-4" /> Search or Add New Receiver
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 