import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Search, Users, ChevronRight, History as HistoryIcon } from 'lucide-react';

interface Client {
  id?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  country?: string;
  city?: string;
  streetAddress?: string;
}

interface AppleReceiverSelectionPageProps {
  // Navigation
  onBack: () => void;
  onBackToSenderSearch: () => void;
  onContinue: (receiver?: Client | null) => void;
  onAddNewReceiver: () => void;
  
  // Data
  selectedSender: Client;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredReceivers: Client[];
  selectedReceiver: Client | null;
  setSelectedReceiver: (client: Client | null) => void;
  isLoading?: boolean;
  
  // Actions
  onShowReceiverHistory?: (clientId: string) => void;
  onShowReceiverDetails?: (client: Client) => void;
}

export default function AppleReceiverSelectionPage({
  // Navigation
  onBack,
  onBackToSenderSearch,
  onContinue,
  onAddNewReceiver,
  
  // Data
  selectedSender,
  searchQuery,
  setSearchQuery,
  filteredReceivers,
  selectedReceiver,
  setSelectedReceiver,
  isLoading = false,
  
  // Actions
  onShowReceiverHistory,
  onShowReceiverDetails,
}: AppleReceiverSelectionPageProps) {
  const router = useRouter();

  // For double-click detection on receiver cards
  const [doubleClickId, setDoubleClickId] = useState<string | null>(null);
  
  // Handle receiver click with double-click detection
  const handleReceiverClick = (receiver: Client) => {
    if (receiver.id && receiver.id === doubleClickId) {
      // Double click detected - go to receiver details
      if (onShowReceiverDetails) {
        onShowReceiverDetails(receiver);
      }
    } else {
      // First click - select the receiver and start double click detection
      setSelectedReceiver(receiver);
      if (receiver.id) {
        setDoubleClickId(receiver.id);
        setTimeout(() => setDoubleClickId(null), 300);
      }
    }
  };
  
  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#000000] overflow-hidden">
      {/* Header with Selected Sender - iOS style */}
      <div className="sticky top-0 z-10 bg-white dark:bg-[#1C1C1E] shadow-sm">
        {/* Navigation bar with back buttons - iOS style */}
        <div className="flex items-center p-4 border-b border-gray-100 dark:border-gray-800">
          <button 
            onClick={onBack}
            className="mr-3 text-[#007AFF] dark:text-[#0A84FF] hover:opacity-80 focus:outline-none"
            aria-label="Back to sender profile"
          >
            <div className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Back</span>
            </div>
          </button>
          
          <div className="flex-1 text-center">
            <h2 className="text-base font-medium text-gray-900 dark:text-white">Select Receiver</h2>
          </div>
          
          <button 
            onClick={onAddNewReceiver}
            className="text-[#007AFF] dark:text-[#0A84FF] hover:opacity-80 focus:outline-none"
          >
            <div className="flex items-center">
              <Plus className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">New</span>
            </div>
          </button>
        </div>
        
        {/* Selected sender display - iOS card style */}
        <div className="p-4 bg-gray-50 dark:bg-[#2C2C2E] border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">Sending From</h3>
          <div className="flex items-center p-3 bg-white dark:bg-[#1C1C1E] rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="bg-blue-100 dark:bg-[#0A84FF]/20 rounded-full h-10 w-10 flex items-center justify-center mr-3">
              <span className="font-medium text-blue-800 dark:text-blue-300">
                {selectedSender.firstName.charAt(0)}{selectedSender.lastName.charAt(0)}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {selectedSender.firstName} {selectedSender.lastName}
              </p>
              {selectedSender.phone && (
                <p className="text-sm text-gray-500 dark:text-gray-400">{selectedSender.phone}</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Search bar - iOS style */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1C1C1E]">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-[#3A3A3C] rounded-lg bg-white/80 dark:bg-[#2C2C2E] text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007AFF] dark:focus:ring-[#0A84FF]"
            placeholder="Search receivers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Receiver list with animations */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-black">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full py-8">
            <div className="w-8 h-8 border-2 border-t-transparent border-[#007AFF] dark:border-[#0A84FF] rounded-full animate-spin mb-2"></div>
            <p className="text-gray-500 dark:text-gray-400">Finding receivers...</p>
          </div>
        ) : filteredReceivers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-8 text-center">
            <div className="bg-gray-200 dark:bg-[#2C2C2E] p-4 rounded-full mb-3">
              <Users className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-3">
              No receivers found matching your search.
            </p>
            <button
              onClick={onAddNewReceiver}
              className="px-4 py-2 rounded-lg bg-[#007AFF] hover:bg-[#0062CC] dark:bg-[#0A84FF] dark:hover:bg-[#409CFF] text-white text-sm font-medium flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Receiver
            </button>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {filteredReceivers.map((receiver, index) => (
              <motion.div
                key={receiver.id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                onClick={() => handleReceiverClick(receiver)}
                className={`mb-3 p-3 rounded-xl border ${selectedReceiver?.id === receiver.id ? 'border-[#007AFF] dark:border-[#0A84FF] bg-blue-50 dark:bg-[#0A84FF]/10' : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1C1C1E]'} hover:shadow-sm transition-colors cursor-pointer`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${selectedReceiver?.id === receiver.id ? 'bg-[#007AFF] dark:bg-[#0A84FF] text-white' : 'bg-gray-100 dark:bg-[#3A3A3C] text-gray-700 dark:text-gray-300'}`}>
                      <span>{receiver.firstName.charAt(0)}{receiver.lastName.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {receiver.firstName} {receiver.lastName}
                      </p>
                      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-3">
                        {receiver.phone && <span>{receiver.phone}</span>}
                        {receiver.country && <span>{receiver.country}</span>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {onShowReceiverHistory && receiver.id && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onShowReceiverHistory(receiver.id || ''); }}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2C2C2E] text-gray-500 dark:text-gray-400"
                      >
                        <HistoryIcon size={16} />
                      </button>
                    )}
                    <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-600" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Footer with Continue button */}
      <footer className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 shadow-md">
        <div className="flex justify-between items-center max-w-5xl mx-auto">
          <div>
            {selectedReceiver && (
              <div className="flex items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Selected:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {selectedReceiver.firstName} {selectedReceiver.lastName}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => onContinue(selectedReceiver)}
            disabled={!selectedReceiver}
            className={`px-6 py-2 rounded-lg text-white font-medium flex items-center ${!selectedReceiver ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed' : 'bg-[#007AFF] hover:bg-[#0062CC] dark:bg-[#0A84FF] dark:hover:bg-[#409CFF]'}`}
          >
            <span>Continue</span>
            <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </footer>
    </div>
  );
}
