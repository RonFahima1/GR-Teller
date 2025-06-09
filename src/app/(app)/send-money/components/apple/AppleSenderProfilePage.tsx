'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, Clock, Edit, Eye, UserPlus } from 'lucide-react';

// Import our redesigned components
import { UnifiedSenderProfileSection } from './sender-profile/UnifiedSenderProfileSection';
import { AccountBalancesSection } from './sender-profile/AccountBalancesSection';
import { ProfileHeader } from './sender-profile/ProfileHeader';
import { Badge } from './shared/Badge';
import { IconButton } from './shared/IconButton';
import { AppleTransactionHistoryModal, Transaction } from './sender-profile/AppleTransactionHistoryModal';

// Define types to match our interfaces
type ProductType = 'prepaidCard' | 'simCard' | 'bankAccount';
type ProductStatus = 'active' | 'inactive' | 'pending';

interface ProductDetails {
  [key: string]: string;
}

interface AppleSenderProfilePageProps {
  senderId?: string;
  onBack?: () => void;
  onContinue?: () => void;
}

// Mock transaction history data
const mockTransactions: Transaction[] = [
  {
    id: 'tx-001',
    date: '2025-05-14',
    receiver: 'CHHH CCff',
    country: 'China',
    operator: 'Contact',
    transferType: 'Cash to Credit',
    transferDetails: '214083425',
    paymentCurrency: 'USD',
    paymentAmount: 750.00,
    receivedCurrency: 'CNY',
    receivedAmount: 5432.25
  },
  {
    id: 'tx-002',
    date: '2025-05-12',
    receiver: 'CHHH CCff',
    country: 'China',
    operator: 'Thunes',
    transferType: 'Bank Deposit',
    transferDetails: '1231',
    paymentCurrency: 'ILS',
    paymentAmount: 1200.00,
    receivedCurrency: 'CNY',
    receivedAmount: 2451.60
  },
  {
    id: 'tx-003',
    date: '2025-05-05',
    receiver: 'Lee Wong',
    country: 'Singapore',
    operator: 'SingPay',
    transferType: 'Mobile Money',
    transferDetails: '8741209',
    paymentCurrency: 'USD',
    paymentAmount: 350.00,
    receivedCurrency: 'SGD',
    receivedAmount: 472.15
  },
  {
    id: 'tx-004',
    date: '2025-04-28',
    receiver: 'Maria Garcia',
    country: 'Mexico',
    operator: 'MoneyTrans',
    transferType: 'Cash Pickup',
    transferDetails: '4520917',
    paymentCurrency: 'USD',
    paymentAmount: 500.00,
    receivedCurrency: 'MXN',
    receivedAmount: 8675.25
  },
  {
    id: 'tx-005',
    date: '2025-04-15',
    receiver: 'Hans Mueller',
    country: 'Germany',
    operator: 'EuroSend',
    transferType: 'Bank Transfer',
    transferDetails: 'DE8901234',
    paymentCurrency: 'USD',
    paymentAmount: 1000.00,
    receivedCurrency: 'EUR',
    receivedAmount: 920.50
  }
];

// Mock data for the sender that matches the expected Sender interface
const mockSenderData = {
  id: 'sender-123',
  firstName: 'Tom',
  middleName: '',
  lastName: 'Tester',
  dateOfBirth: '1985-06-12',
  gender: 'Male',
  nationality: 'United States',
  status: 'active',
  contact: {
    phoneNumber: "+1 555-123-4567",
    email: "tom.tester@example.com",
    country: "US",
    address: "123 Main Street",
    city: "New York",
    state: "NY",
    postalCode: "10001"
  },
  identification: {
    type: "Passport",
    number: "US123456789",
    issuanceCountry: "USA",
    issueDate: "2018-03-10",
    expiryDate: "2028-03-09"
  },
  products: [
    {
      type: "prepaidCard",
      number: "**** **** **** 5678",
      expiryDate: "04/25",
      isActive: true
    },
    {
      type: "simCard",
      number: "+1 555-987-6543",
      activationDate: "2021-07-15",
      isActive: true
    }
  ],
  balances: [
    {
      currency: 'ILS',
      amount: '4,257.50',
      lastTransaction: '2023-08-20',
      convertedValue: '$1,150.67 USD'
    },
    {
      currency: 'USD',
      amount: '1,250.00',
      lastTransaction: '2023-08-15',
      convertedValue: '$1,250.00 USD'
    },
    {
      currency: 'EUR',
      amount: '850.75',
      lastTransaction: '2023-08-10',
      convertedValue: '$935.27 USD'
    },
  ],
  preferredCurrency: 'USD',
  bankAccount: {
    accountNumber: '000952807',
    bankCode: '47',
    branchCode: '800',
    iban: 'IL05 047 8 00 00 0 000 0952 807',
  },
};

/**
 * AppleSenderProfilePage - Main page component for the sender profile
 * Features a responsive layout with personal details and financial information
 * Following Apple HIG guidelines
 */
export default function AppleSenderProfilePage({ senderId = '123', onBack, onContinue }: AppleSenderProfilePageProps) {
  // Ensure we can navigate properly through the entire flow
  const router = useRouter();
  
  // Handle back button navigation
  const handleBackNavigation = () => {
    // Use the onBack prop if provided, otherwise fallback to router navigation
    if (onBack) {
      onBack();
    } else {
      router.push('/send-money');
    }
  };
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [senderData, setSenderData] = useState(mockSenderData);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [showHeaderActions, setShowHeaderActions] = useState(true);
  const [showHistoryModal, setShowHistoryModal] = useState(true); // Start with history modal open

  // Simulate data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 600));
        setSenderData(mockSenderData);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load sender data');
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle scroll events to show/hide header actions
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setShowHeaderActions(scrollPosition < 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Button action handlers
  const handleViewHistory = () => setShowHistoryModal(true);
  const handleEditSender = () => console.log('Edit sender clicked');
  const handleNewSender = () => console.log('New sender clicked');
  const handleConfirm = () => {
    // Close the history modal if it's open
    setShowHistoryModal(false);
    
    // If onContinue prop exists, call it to trigger the RecentReceiversModal
    if (onContinue) {
      onContinue();
    } else {
      // Fallback to router navigation if no onContinue handler
      router.push('/send-money');
    }
    console.log('Confirm clicked');
  };

  // Handle using a transaction for a new transfer
  const handleUseTransaction = (transaction: Transaction) => {
    console.log('Using transaction:', transaction);
    // Close history modal and proceed to receiver selection
    setShowHistoryModal(false);
    
    // Proceed to next step when using a transaction
    if (onContinue) {
      onContinue();
    }
    alert(`Selected to send money to ${transaction.receiver} in ${transaction.country}`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white dark:bg-[#1C1C1E]">
        <div className="w-10 h-10 border-4 border-[#007AFF] dark:border-[#0A84FF] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-[15px] text-[#8E8E93] dark:text-[#AEAEB2]">Loading sender profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white dark:bg-[#1C1C1E]">
        <div className="w-12 h-12 rounded-full bg-[#FF3B30]/10 dark:bg-[#FF453A]/20 flex items-center justify-center">
          <ArrowLeft size={24} className="text-[#FF3B30] dark:text-[#FF453A]" />
        </div>
        <p className="mt-4 text-[15px] text-[#1C1C1E] dark:text-white font-medium">{error}</p>
        <button className="mt-4 px-4 py-2 bg-[#007AFF] dark:bg-[#0A84FF] text-white rounded-md text-[13px] font-medium">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-[#1C1C1E] overflow-hidden">
      {/* Header with back button, bold name, and action buttons on the same line */}
      <header className="bg-white dark:bg-[#1C1C1E] border-b border-[#E5E5EA] dark:border-[#38383A] p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative group">
              <motion.button 
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F2F2F7] dark:bg-[#2C2C2E] mr-3 group-hover:bg-[#007AFF]/10 transition-colors"
                onClick={handleBackNavigation}
                aria-label="Go back"
              >
                <ArrowLeft size={16} className="text-[#8E8E93] dark:text-[#98989D] group-hover:text-[#007AFF] dark:group-hover:text-[#0A84FF] transition-colors" />
              </motion.button>
              <div className="absolute opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-200 -bottom-8 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap left-1/2 -translate-x-1/2 pointer-events-none z-50">
                Back
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <h2 className="text-[20px] font-bold text-[#1C1C1E] dark:text-white font-['SF Pro Display','Helvetica','Arial',sans-serif]">
                {`${senderData.firstName} ${senderData.lastName}`}
              </h2>
              <Badge variant={senderData.status === 'active' ? 'success' : 'warning'} 
                label={senderData.status === 'active' ? 'Active' : 'Inactive'} />
            </div>
          </div>
          
          {/* Action buttons inline with name */}
          <div className="flex items-center space-x-2">
            <div className="relative group">
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-[#F2F2F7] dark:bg-[#2C2C2E] group-hover:bg-[#007AFF]/10 transition-colors"
                onClick={handleViewHistory}
                aria-label="View history"
              >
                <Clock size={16} className="text-[#8E8E93] dark:text-[#98989D] group-hover:text-[#007AFF] dark:group-hover:text-[#0A84FF] transition-colors" />
              </motion.button>
              <div className="absolute opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-200 -bottom-8 right-0 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none z-50">
                View History
              </div>
            </div>
            
            <div className="relative group">
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-[#F2F2F7] dark:bg-[#2C2C2E] group-hover:bg-[#007AFF]/10 transition-colors"
                onClick={handleEditSender}
                aria-label="Edit sender"
              >
                <Edit size={16} className="text-[#8E8E93] dark:text-[#98989D] group-hover:text-[#007AFF] dark:group-hover:text-[#0A84FF] transition-colors" />
              </motion.button>
              <div className="absolute opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-200 -bottom-8 right-0 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none z-50">
                Edit Sender
              </div>
            </div>
            
            <div className="relative group">
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-[#F2F2F7] dark:bg-[#2C2C2E] group-hover:bg-[#007AFF]/10 transition-colors"
                onClick={handleNewSender}
                aria-label="New sender"
              >
                <UserPlus size={16} className="text-[#8E8E93] dark:text-[#98989D] group-hover:text-[#007AFF] dark:group-hover:text-[#0A84FF] transition-colors" />
              </motion.button>
              <div className="absolute opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-200 -bottom-8 right-0 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none z-50">
                New Sender
              </div>
            </div>
            
            <div className="relative group">
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-[#F2F2F7] dark:bg-[#2C2C2E] group-hover:bg-[#007AFF]/10 transition-colors"
                onClick={handleConfirm}
                aria-label="Confirm"
              >
                <CheckCircle size={16} className="text-[#8E8E93] dark:text-[#98989D] group-hover:text-[#007AFF] dark:group-hover:text-[#0A84FF] transition-colors" />
              </motion.button>
              <div className="absolute opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-200 -bottom-8 right-0 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none z-50">
                Confirm
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content area */}
      <div className="flex-1 bg-[#F2F2F7] dark:bg-[#0d0d0e] overflow-auto pb-4">
        {isLoading ? (
          <div className="flex h-full justify-center items-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-[#007AFF] dark:border-[#0A84FF] border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-[15px] text-[#8E8E93] dark:text-[#AEAEB2]">Loading sender profile...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex h-full justify-center items-center">
            <div className="p-4 bg-[#FFECEB] dark:bg-[#3A2A2A] text-[#FF453A] dark:text-[#FF6961] rounded-xl text-[15px]">
              Error loading sender data. Please try again.
            </div>
          </div>
        ) : (
          <div className="px-4 py-3">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 max-w-6xl mx-auto mb-4">
              {/* Left column (70%) - Sender profile details with scrollable height */}
              <div className="lg:col-span-7">
                <div className="rounded-xl bg-white dark:bg-[#1C1C1E] shadow-sm">
                  <UnifiedSenderProfileSection sender={senderData} />
                </div>
              </div>
              
              {/* Right column (30%) - Financial information */}
              <div className="lg:col-span-5">
                <AccountBalancesSection 
                  balances={senderData.balances} 
                  preferredCurrency={senderData.preferredCurrency}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      
      <AppleTransactionHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        senderName={`${senderData.firstName} ${senderData.lastName}`}
        transactions={transactions}
        onUseTransaction={handleUseTransaction}
        isLoading={false}
      />
    </div>
  );
}
