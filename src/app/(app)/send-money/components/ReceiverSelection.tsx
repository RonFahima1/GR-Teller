import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, UserPlus, CheckCircle, Globe, UserCheck, Eye, History } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Client } from '../hooks/useSendMoneyForm';
import { cn } from '@/lib/utils';

interface ReceiverSelectionProps {
  initialLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredClients: Client[];
  selectedReceiver: Client | null;
  setSelectedReceiver: (client: Client | null) => void;
  setShowNewReceiverForm: (show: boolean) => void;
  selectedSender: Client | null;
  onSetReceiverSameAsSender: () => void;
  onUseGlobalRemitProduct?: () => void;
  onShowReceiverDetails?: (client: Client) => void;
  onShowReceiverHistory?: (clientId: string) => void;
}

export const ReceiverSelection: React.FC<ReceiverSelectionProps> = ({
  initialLoading,
  searchQuery,
  setSearchQuery,
  filteredClients,
  selectedReceiver,
  setSelectedReceiver,
  setShowNewReceiverForm,
  selectedSender,
  onSetReceiverSameAsSender,
  onUseGlobalRemitProduct,
  onShowReceiverDetails,
  onShowReceiverHistory,
}) => {
  const [hoveredReceiverId, setHoveredReceiverId] = useState<string | null>(null);

  if (initialLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-[90px] bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row gap-2 items-center">
        <div className="relative flex-grow w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="search"
            placeholder="Search Receivers by Name, Phone, Country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          {/* {onUseGlobalRemitProduct && (
            <Button 
              variant="outline" 
              size="icon"
              onClick={onUseGlobalRemitProduct}
              title="Use Global Remit Product"
              className="flex-shrink-0"
            >
              <Globe className="h-5 w-5" />
            </Button>
          )} */}
          <Button 
            variant="outline" 
            size="icon"
            onClick={onSetReceiverSameAsSender} 
            disabled={!selectedSender}
            title="Set Receiver as Sender"
            className="flex-shrink-0"
          >
            <UserCheck className="h-5 w-5" />
          </Button>
          <Button 
            onClick={() => setShowNewReceiverForm(true)} 
            className="w-full sm:w-auto flex-grow sm:flex-grow-0"
          >
            <UserPlus className="mr-2 h-4 w-4" /> New Receiver
          </Button>
        </div>
      </div>

      {filteredClients.length === 0 && searchQuery !== '' && (
        <p className="text-center text-gray-500 dark:text-gray-400 py-4">No receivers found matching your search.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredClients.map((client) => {
          const isSelected = selectedReceiver?.id === client.id;
          const showButtons = isSelected || hoveredReceiverId === client.id;
          return (
            <motion.div
              key={client.id}
              className={cn(
                "rounded-lg transition-all duration-200 ease-in-out flex flex-col cursor-pointer text-sm",
                "bg-white dark:bg-gray-800 hover:shadow-xl dark:hover:bg-gray-700/80",
                "min-h-[90px]",
                isSelected
                  ? "ring-2 ring-blue-500 shadow-xl border-transparent"
                  : "border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              )}
              onClick={() => setSelectedReceiver(client)}
              onMouseEnter={() => setHoveredReceiverId(client.id)}
              onMouseLeave={() => setHoveredReceiverId(null)}
            >
              <div className="p-3 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-base text-gray-800 dark:text-white truncate mr-2 flex-shrink min-w-0">
                      {client.firstName} {client.lastName}
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
                            variant="ghost_icon_sm"
                            size="icon_xs"
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                              e.stopPropagation(); 
                              onShowReceiverHistory(client.id); 
                            }}
                            title="View Receiver History"
                            className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                          >
                            <History className="h-4 w-4" />
                          </Button>
                        )}
                        {onShowReceiverDetails && (
                          <Button
                            variant="ghost_icon_sm"
                            size="icon_xs"
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                e.stopPropagation(); 
                                onShowReceiverDetails(client);
                            }}
                            title="View Receiver Details"
                            className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                      </motion.div>
                    )}
                    </AnimatePresence>
                    {isSelected && !showButtons && (
                       <CheckCircle className="h-4 w-4 text-blue-500 dark:text-blue-400 flex-shrink-0 ml-auto" />
                    )}
                  </div>
                  <div className="space-y-0.5 text-xs text-gray-500 dark:text-gray-400">
                    <p className="overflow-hidden text-ellipsis whitespace-nowrap">ID: {client.id || 'N/A'}</p>
                    <p className="overflow-hidden text-ellipsis whitespace-nowrap">Phone: {client.phone || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
