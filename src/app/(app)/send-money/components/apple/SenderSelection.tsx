import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import SenderCard from './SenderCard';
import SearchAndFilterBar from './SearchAndFilterBar';
import { mockClients } from './mockClients';
import { Client, Document } from '../../hooks/useSendMoneyForm';
import { ClientDetailsView } from '../ClientDetailsView';
import { ClientSearchFilter, SearchFilters } from '../ClientSearchFilter';
import EmptyStateView from './EmptyStateView';
import { RecentSendersSidebar } from './RecentSendersSidebar';
import { cn } from '@/lib/utils';
import AppleSendMoneyLayout from './AppleSendMoneyLayout';

interface SenderSelectionProps {
  // Flag to show detailed sender profile page
  showDetailedProfile: boolean;
  // Function to set the visibility of detailed profile page
  setShowDetailedProfile: (show: boolean) => void;
  initialLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredClients: Client[];
  selectedSender: Client | null;
  setSelectedSender: (client: Client | null) => void;
  setShowNewSenderForm: (show: boolean) => void;
  onViewHistory?: (senderId: string) => void;
  onShowClientDocuments?: (documents: Document[]) => void;
  onShowClientLimits?: () => void;
  onAddClientPrepaidCard?: () => void;
  onShowClientSimCardDetails?: (simId: string) => void;
}

/**
 * Redesigned SenderSelection component using Apple design principles
 */
export const AppleSenderSelection: React.FC<SenderSelectionProps> = ({
  initialLoading,
  searchQuery,
  setSearchQuery,
  filteredClients: propFilteredClients,
  selectedSender,
  setSelectedSender,
  setShowNewSenderForm,
  onViewHistory,
  onShowClientDocuments,
  onShowClientLimits,
  onAddClientPrepaidCard,
  onShowClientSimCardDetails,
  showDetailedProfile,
  setShowDetailedProfile,
}) => {
  // Use mock clients for demonstration when no clients are passed
  const useMockClients = propFilteredClients.length === 0 || process.env.NODE_ENV === 'development';
  // State for hover, filter and modals
  const [hoveredClientId, setHoveredClientId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedClientForDetails, setSelectedClientForDetails] = useState<Client | null>(null);

  // Search filters state
  const [activeSearchFilters, setActiveSearchFilters] = useState<Partial<SearchFilters>>({  
    searchTerm: searchQuery,
    filterByName: true,
    filterByPhone: true,
    filterByIdNumber: true,
    filterByBankAccount: true,
    filterByQrCode: false,
    filterByCustomerCard: false,
  });

  // Recent senders - using the 5 most recently used senders
  // In a real application, this would come from an API or local storage
  const recentSenders = useMemo(() => {
    // For demonstration, just take the first 5 clients
    // In a real app, this would be based on actual usage history
    return (useMockClients ? mockClients : propFilteredClients).slice(0, 5);
  }, [propFilteredClients, useMockClients]);

  // Update search term when searchQuery changes
  useEffect(() => {
    setActiveSearchFilters(prev => ({
      ...prev,
      searchTerm: searchQuery,
    }));
  }, [searchQuery]);

  // Filter clients based on active filters
  const locallyFilteredClients = useMemo(() => {
    // Determine which clients to use (either props or mock)
    let clientsToFilter = useMockClients ? mockClients : propFilteredClients;
    
    if (activeSearchFilters.searchTerm) {
      const term = activeSearchFilters.searchTerm.toLowerCase();
      clientsToFilter = clientsToFilter.filter(client => 
        (activeSearchFilters.filterByName && 
          (`${client.firstName} ${client.lastName}`).toLowerCase().includes(term)) ||
        (activeSearchFilters.filterByPhone && 
          client.phone && client.phone.toLowerCase().includes(term)) ||
        (activeSearchFilters.filterByIdNumber && 
          client.idNumber && client.idNumber.toLowerCase().includes(term)) ||
        (activeSearchFilters.filterByBankAccount && 
          client.bankAccount && client.bankAccount.toLowerCase().includes(term))
      );
    }
    
    return clientsToFilter;
  }, [propFilteredClients, activeSearchFilters, useMockClients]);

  // Handlers
  const handleSelectClient = (client: Client) => {
    setSelectedSender(client);
    // Close the client details view if it's open
    if (selectedClientForDetails) {
      setSelectedClientForDetails(null);
    }
  };

  const handleViewClientDetails = (client: Client) => {
    setSelectedClientForDetails(client);
  };

  const handleCloseClientDetails = () => {
    setSelectedClientForDetails(null);
  };
  
  // Show detailed sender profile on double-click
  const handleShowDetailedProfile = (senderId: string) => {
    // First make sure the sender with this ID is selected
    const sender = (useMockClients ? mockClients : propFilteredClients).find(client => client.id === senderId);
    if (sender) {
      setSelectedSender(sender);
      
      // Add subtle delay for better UX - lets the selection visual feedback complete first
      setTimeout(() => {
        // Then show the detailed profile
        setShowDetailedProfile(true);
        
        // Provide haptic feedback
        if (navigator && 'vibrate' in navigator && navigator.vibrate) {
          navigator.vibrate(50);
        }
      }, 150);
    }
  };

  const handleSearchFilterChange = (filters: Partial<SearchFilters>) => {
    setActiveSearchFilters(prev => ({
      ...prev,
      ...filters,
    }));
  };

  // Content for the main area
  const renderMainContent = () => {
    if (initialLoading) {
      // Loading skeleton
      return (
        <div className="flex-grow flex items-start justify-center pt-12">
          <div className="w-full max-w-4xl mx-auto space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-28 bg-[#E5E5EA] dark:bg-[#2C2C2E] rounded-xl animate-pulse opacity-70"></div>
            ))}
          </div>
        </div>
      );
    }

    // Show empty state
    if (locallyFilteredClients.length === 0) {
      return (
        <div className="p-8">
          <EmptyStateView 
            title={searchQuery ? "No matching clients found" : "No clients available"}
            message={searchQuery ? 
              "Try a different search term or adjust your filters" : 
              "Add a new sender to begin"}
            actionLabel="Add New Sender"
            onAction={() => setShowNewSenderForm(true)}
          />
        </div>
      );
    }

    // Contains grid of SenderCard components with improved layout
    return (
      <div className="p-3 md:p-6 bg-[#F2F2F7] dark:bg-[#1C1C1E] rounded-xl mx-3 md:mx-6">
        {/* Grid limited to 3 columns max, as requested */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-fr">
          {locallyFilteredClients.map((client, index) => (
            <motion.div 
              key={client.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.3,
                delay: index * 0.05
              }}
              className="h-[140px] min-w-[250px]" // Minimum width to fit 20 characters
            >
              <SenderCard 
                client={client}
                isSelected={selectedSender?.id === client.id}
                isHovered={hoveredClientId === client.id}
                onSelect={() => handleSelectClient(client)}
                onViewHistory={onViewHistory ? (id) => onViewHistory(id) : undefined}
                onViewDetails={handleViewClientDetails}
                onMouseEnter={() => setHoveredClientId(client.id)}
                onMouseLeave={() => setHoveredClientId(null)}
                onNavigateToProfile={handleShowDetailedProfile}
              />
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  // Mobile-friendly render of recent senders - will be used by AppleSendMoneyLayout
  const renderMobileRecentSenders = () => {
    if (recentSenders.length === 0) return null;
    
    return (
      <div className="pb-4">
        <h3 className="text-sm font-medium text-[#3A3A3C] dark:text-[#E5E5EA] mb-2 px-1">Recent Senders</h3>
        <div className="overflow-x-auto pb-1">
          <div className="flex space-x-3 px-1">
            {recentSenders.map(sender => (
              <div
                key={sender.id}
                onClick={() => handleSelectClient(sender)}
                className={cn(
                  "flex flex-col items-center space-y-1.5 cursor-pointer pb-1 px-1",
                  "min-w-[64px] max-w-[80px]",
                  selectedSender?.id === sender.id && "bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-lg"
                )}
              >
                <div className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center text-sm",
                  selectedSender?.id === sender.id ? 
                    "bg-[#007AFF] dark:bg-[#0A84FF] text-white shadow-sm" : 
                    "bg-[#E5E5EA] dark:bg-[#48484A] text-[#8E8E93] dark:text-[#98989D]"
                )}>
                  {sender.firstName.charAt(0)}{sender.lastName.charAt(0)}
                </div>
                <span className="text-xs font-medium text-center truncate w-full">
                  {sender.firstName}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Create mobile view of recent senders for small screens
  const mobileRecentSendersView = renderMobileRecentSenders();

  return (
    <AppleSendMoneyLayout
      title="Select Sender"
      subtitle="Choose who is sending the money"
      pageHeader={(
        <div className="w-full px-4 py-4 md:px-6 lg:px-8 pb-0">
          <SearchAndFilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onClickFilter={() => setIsFilterOpen(true)}
            onClickNewSender={() => setShowNewSenderForm(true)}
          />
        </div>
      )}
      sideContent={
        <RecentSendersSidebar
          recentSenders={recentSenders}
          onSelectSender={handleSelectClient}
          selectedSenderId={selectedSender?.id}
        />
      }
      className="px-0"
    >
      {/* Main content - sender cards */}
      {renderMainContent()}
      
      {/* Search Filter Modal */}
      <ClientSearchFilter
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        currentFilters={activeSearchFilters}
        onApplyFilters={handleSearchFilterChange}
        onResetFilters={() => setActiveSearchFilters({
          searchTerm: searchQuery,
          filterByName: true,
          filterByPhone: true,
          filterByIdNumber: true,
          filterByBankAccount: true,
          filterByQrCode: false,
          filterByCustomerCard: false,
        })}
      />

      {/* Client Details Modal */}
      {selectedClientForDetails && (
        <ClientDetailsView
          isOpen={!!selectedClientForDetails}
          onClose={handleCloseClientDetails}
          client={selectedClientForDetails}
          onShowDocuments={onShowClientDocuments}
          onShowLimits={onShowClientLimits}
          onAddPrepaidCard={onAddClientPrepaidCard}
          onShowSimCardDetails={onShowClientSimCardDetails}
        />
      )}
    </AppleSendMoneyLayout>
  );
};

export default AppleSenderSelection;
