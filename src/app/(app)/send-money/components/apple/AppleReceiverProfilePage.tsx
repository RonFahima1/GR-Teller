import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit2, Plus, CheckCircle, Phone, Mail, MapPin, Calendar, Users, DollarSign, Clock, CreditCard } from 'lucide-react';
import { Client } from '../../hooks/useSendMoneyForm';
import { InfoItem } from './shared/InfoItem';
import { InfoSection } from './shared/InfoSection';
import { cn } from '@/lib/utils';

// Mock recent transactions data (in a real app, this would come from props)
const mockRecentTransactions = [
  { id: '1', date: '2025-06-02', amount: 500, currency: 'USD', status: 'completed' },
  { id: '2', date: '2025-05-15', amount: 350, currency: 'USD', status: 'completed' },
];

interface AppleReceiverProfilePageProps {
  receiver: Client;
  selectedSender: Client | null;
  onBack: () => void;
  onEdit?: () => void;
  onAddNewReceiver: () => void;
  onContinue: () => void;
}

export function AppleReceiverProfilePage({
  receiver,
  selectedSender,
  onBack,
  onEdit,
  onAddNewReceiver,
  onContinue
}: AppleReceiverProfilePageProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Format relationship if available
  const getRelationship = () => {
    // Using optional chaining to safely access the relationship property
    if (!receiver || !selectedSender) return 'Not specified';
    // Use type assertion for potentially missing property
    const relationship = (receiver as any).relationship;
    return relationship ? `${relationship} of ${selectedSender.firstName} ${selectedSender.lastName}` : 'Not specified';
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-black">
      {/* iOS-style header */}
      <header className="bg-white dark:bg-[#1C1C1E] border-b border-gray-100 dark:border-gray-800 p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-2 rounded-full text-[#007AFF] dark:text-[#0A84FF] hover:bg-gray-100 dark:hover:bg-[#2C2C2E] transition-colors group relative"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Back
            </span>
          </button>

          <h1 className="text-base font-medium text-gray-900 dark:text-white absolute left-1/2 transform -translate-x-1/2">
            Receiver Details
          </h1>
          
          <div className="flex items-center space-x-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-2 rounded-full text-[#007AFF] dark:text-[#0A84FF] hover:bg-gray-100 dark:hover:bg-[#2C2C2E] transition-colors group relative"
                aria-label="Edit receiver"
              >
                <Edit2 className="h-5 w-5" />
                <span className="absolute -bottom-8 right-0 px-2 py-1 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Edit Receiver
                </span>
              </button>
            )}
            <button
              onClick={onAddNewReceiver}
              className="p-2 rounded-full text-[#007AFF] dark:text-[#0A84FF] hover:bg-gray-100 dark:hover:bg-[#2C2C2E] transition-colors group relative"
              aria-label="Add new receiver"
            >
              <Plus className="h-5 w-5" />
              <span className="absolute -bottom-8 right-0 px-2 py-1 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                New Receiver
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Profile header with avatar */}
      <div className="px-4 py-4 bg-white dark:bg-[#1C1C1E] border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center">
          <div className="w-14 h-14 bg-blue-100 dark:bg-[#0A84FF]/20 rounded-full flex items-center justify-center mr-3">
            <span className="text-lg font-semibold text-blue-800 dark:text-blue-300">
              {receiver.firstName.charAt(0)}{receiver.lastName.charAt(0)}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {receiver.firstName} {receiver.lastName}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {receiver.phone || receiver.email || ''}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content - Two-column layout for larger screens */}
      <div className="flex-1 overflow-auto p-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">  {/* Left column - Receiver info */}
        {/* Personal Information - iOS style card */}
        <div className="bg-white dark:bg-[#1C1C1E] rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2 text-[#007AFF] dark:text-[#0A84FF]" />
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Personal Information</h3>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            <div className="px-4 py-3 flex justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Full Name</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {receiver.firstName} {receiver.middleName ? `${receiver.middleName} ` : ''}{receiver.lastName}
              </span>
            </div>
            
            {receiver.dateOfBirth && (
              <div className="px-4 py-3 flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{receiver.dateOfBirth}</span>
              </div>
            )}
            
            {receiver.gender && (
              <div className="px-4 py-3 flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Gender</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{receiver.gender}</span>
              </div>
            )}
            
            <div className="px-4 py-3 flex justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Relationship</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{getRelationship()}</span>
            </div>
          </div>
        </div>
        
        {/* Contact Information - iOS style card */}
        <div className="bg-white dark:bg-[#1C1C1E] rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-2 text-[#007AFF] dark:text-[#0A84FF]" />
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Contact Information</h3>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {receiver.phone && (
              <div className="px-4 py-3 flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">Phone Number</span>
                <span className="text-sm font-medium text-[#007AFF] dark:text-[#0A84FF]">{receiver.phone}</span>
              </div>
            )}
            
            {receiver.email && (
              <div className="px-4 py-3 flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Email</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{receiver.email}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Address Information - iOS style card */}
        <div className="bg-white dark:bg-[#1C1C1E] rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-[#007AFF] dark:text-[#0A84FF]" />
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Address</h3>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {/* Using optional chaining to safely access possibly missing properties */}
            {(receiver as any).address && (
              <div className="px-4 py-2.5 flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Street</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{(receiver as any).address}</span>
              </div>
            )}
            
            {(receiver as any).city && (
              <div className="px-4 py-2.5 flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">City</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{(receiver as any).city}</span>
              </div>
            )}
            
            {(receiver as any).postalCode && (
              <div className="px-4 py-2.5 flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Postal Code</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{(receiver as any).postalCode}</span>
              </div>
            )}
            
            {receiver.country && (
              <div className="px-4 py-2.5 flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Country</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{receiver.country}</span>
              </div>
            )}
          </div>
        </div>
          </div>
          
          {/* Right column - Sender info and transactions */}
          <div className="space-y-4">
            {/* Sender Information Card */}
            {selectedSender && (
              <div className="bg-white dark:bg-[#1C1C1E] rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-[#007AFF] dark:text-[#0A84FF]" />
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Sender Information</h3>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  <div className="px-4 py-3 flex items-center">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-semibold text-green-800 dark:text-green-300">
                        {selectedSender.firstName.charAt(0)}{selectedSender.lastName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {selectedSender.firstName} {selectedSender.lastName}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {selectedSender.phone || selectedSender.email || ''}
                      </div>
                    </div>
                  </div>
                  
                  {selectedSender.country && (
                    <div className="px-4 py-2.5 flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Country</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedSender.country}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Recent Transactions */}
            <div className="bg-white dark:bg-[#1C1C1E] rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-[#007AFF] dark:text-[#0A84FF]" />
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Recent Transactions</h3>
                </div>
              </div>
              
              {mockRecentTransactions.length > 0 ? (
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {mockRecentTransactions.map(transaction => (
                    <div key={transaction.id} className="px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-50 dark:bg-[#0A84FF]/10 rounded-full flex items-center justify-center mr-3">
                          <CreditCard className="w-4 h-4 text-[#007AFF] dark:text-[#0A84FF]" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            Transfer
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(transaction.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {transaction.currency} {transaction.amount.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-6 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">No recent transactions with this receiver</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* iOS-style fixed bottom action button - made more prominent with shadow */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-[#1C1C1E]/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 p-4 flex justify-between items-center shadow-lg">
        <button
          onClick={onBack}
          className="px-4 py-2.5 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-[#2C2C2E] transition-colors flex items-center"
          aria-label="Cancel"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back</span>
        </button>
        
        <button
          onClick={onContinue}
          disabled={isLoading}
          className="px-5 py-2.5 rounded-full bg-[#007AFF] hover:bg-[#0062CC] dark:bg-[#0A84FF] dark:hover:bg-[#409CFF] text-white font-medium transition-colors flex items-center shadow-md"
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              <span>Confirm</span>
            </>
          )}
        </button>
      </footer>
    </div>
  );
}
