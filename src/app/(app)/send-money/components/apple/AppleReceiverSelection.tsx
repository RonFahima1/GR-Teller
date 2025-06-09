import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, UserPlus, UserCheck, History, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Client } from '../../hooks/useSendMoneyForm';
import { cn } from '@/lib/utils';
import { SelectedSenderHeader } from './receiver-selection/SelectedSenderHeader';
import { ReceiverCard } from './receiver-selection/ReceiverCard';
import { SearchBar } from './receiver-selection/SearchBar';

interface AppleReceiverSelectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredReceivers: Client[];
  selectedReceiver: Client | null;
  setSelectedReceiver: (client: Client | null) => void;
  selectedSender: Client | null;
  isLoading: boolean;
  onSetReceiverSameAsSender: () => void;
  onAddNewReceiver: () => void;
  onShowReceiverDetails?: (client: Client) => void;
  onShowReceiverHistory?: (clientId: string) => void;
}

export function AppleReceiverSelection({
  searchQuery,
  setSearchQuery,
  filteredReceivers,
  selectedReceiver,
  setSelectedReceiver,
  selectedSender,
  isLoading,
  onSetReceiverSameAsSender,
  onAddNewReceiver,
  onShowReceiverDetails,
  onShowReceiverHistory
}: AppleReceiverSelectionProps) {
  const [hoveredReceiverId, setHoveredReceiverId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-[#2C2C2E] rounded-xl p-4 shadow-sm animate-pulse h-24"></div>
        <div className="h-12 bg-gray-200 dark:bg-[#3A3A3C] rounded-lg animate-pulse mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-[#3A3A3C] rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Selected Sender Header */}
      {selectedSender && (
        <SelectedSenderHeader sender={selectedSender} />
      )}

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          className="flex-grow"
        />
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            size="icon"
            onClick={onSetReceiverSameAsSender}
            disabled={!selectedSender}
            title="Set Receiver as Sender"
            className="flex-shrink-0 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#3A3A3C] border border-gray-200 dark:border-[#3A3A3C]"
          >
            <UserCheck className="h-5 w-5" />
          </Button>
          <Button 
            onClick={onAddNewReceiver}
            className="flex-grow sm:flex-grow-0 bg-[#007AFF] hover:bg-[#0062CC] dark:bg-[#0A84FF] dark:hover:bg-[#409CFF] text-white"
          >
            <UserPlus className="mr-2 h-4 w-4" /> New Receiver
          </Button>
        </div>
      </div>

      {/* No Results Message */}
      {filteredReceivers.length === 0 && searchQuery !== '' && (
        <div className="flex flex-col items-center justify-center py-8 px-4 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-xl text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-2">No receivers found matching your search.</p>
          <Button 
            onClick={onAddNewReceiver}
            variant="outline"
            className="mt-2"
          >
            <UserPlus className="mr-2 h-4 w-4" /> Add New Receiver
          </Button>
        </div>
      )}

      {/* Results Grid */}
      {filteredReceivers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReceivers.map((receiver) => (
            <ReceiverCard
              key={receiver.id}
              receiver={receiver}
              isSelected={selectedReceiver?.id === receiver.id}
              isHovered={hoveredReceiverId === receiver.id}
              onSelect={() => setSelectedReceiver(receiver)}
              onMouseEnter={() => setHoveredReceiverId(receiver.id)}
              onMouseLeave={() => setHoveredReceiverId(null)}
              onShowDetails={onShowReceiverDetails}
              onShowHistory={onShowReceiverHistory}
            />
          ))}
        </div>
      )}
    </div>
  );
}
