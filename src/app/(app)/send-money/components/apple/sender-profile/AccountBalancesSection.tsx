'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Copy, ArrowUpRight, Wallet, DollarSign, CreditCard, Gauge, FileCheck, Smartphone, Eye, FileText, CreditCard as CreditCardIcon } from 'lucide-react';
import { Tooltip } from '../shared/Tooltip';

interface AccountBalance {
  currency: string;
  amount: string | number;
  convertedValue?: string | number;
}

interface AccountBalancesSectionProps {
  balances: AccountBalance[];
  preferredCurrency?: string;
}

// Component to handle copyable text with visual feedback
interface CopyableFieldProps {
  text: string;
  label: string;
  formatText?: boolean;
}

const CopyableField: React.FC<CopyableFieldProps> = ({ text, label, formatText }) => {
  const [copied, setCopied] = useState(false);
  
  const displayText = formatText ? 
    // Format IBAN with spaces for readability
    text.replace(/(.{4})/g, '$1 ').trim() : 
    text;
  
  const handleCopy = () => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(err => console.error('Failed to copy text: ', err));
  };
  
  return (
    <div className="flex items-center group">
      <div className="text-[15px] text-[#1C1C1E] dark:text-white truncate">
        {displayText}
      </div>
      <motion.button
        whileTap={{ scale: 0.95 }}
        className="ml-2 text-[#007AFF] dark:text-[#0A84FF] opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label={`Copy ${label}`}
        onClick={handleCopy}
      >
        {copied ? (
          <Check size={16} className="text-green-500" />
        ) : (
          <Copy size={16} />
        )}
      </motion.button>
    </div>
  );
};

export const AccountBalancesSection: React.FC<AccountBalancesSectionProps> = ({ 
  balances = [], 
  preferredCurrency = 'ILS' 
}) => {
  // Find ILS balance only
  const ilsBalance = balances.find(b => b.currency === 'ILS');
  
  // Format the ILS amount for display
  const formattedIlsAmount = ilsBalance ? 
    typeof ilsBalance.amount === 'string' ? 
      ilsBalance.amount : 
      `${ilsBalance.amount.toFixed(2)}` : 
    '0.00';

  return (
    <div className="flex flex-col space-y-3 max-h-[600px] overflow-auto">
      <div className="bg-white dark:bg-[#1C1C1E] rounded-xl overflow-hidden">
      <h3 className="text-[16px] font-semibold px-4 py-3 border-b border-[#E5E5EA] dark:border-[#38383A] text-[#1C1C1E] dark:text-white font-['SF Pro Display','Helvetica','Arial',sans-serif] tracking-tight">
        ACCOUNT BALANCES
      </h3>
      
      {/* Only ILS balance as requested - more compact styling */}
      <div className="px-4 py-3">
        <div className="flex items-start">
          <div className="mr-2 mt-0.5">
            <div className="w-7 h-7 bg-[#E5E5EA]/50 dark:bg-[#3A3A3C] rounded-full flex items-center justify-center">
              <DollarSign size={14} className="text-[#007AFF] dark:text-[#0A84FF]" />
            </div>
          </div>
          <div className="flex-1">
            <div className="text-[13px] text-[#8E8E93] dark:text-[#98989D] mb-1">ILS Balance</div>
            <div className="text-[17px] text-[#007AFF] dark:text-[#0A84FF] font-medium">
              ₪{formattedIlsAmount}
            </div>
          </div>
        </div>
      </div>
      
      {/* Bank account details header */}
      <h3 className="text-[16px] font-semibold px-4 py-3 border-t border-b border-[#E5E5EA] dark:border-[#38383A] text-[#1C1C1E] dark:text-white font-['SF Pro Display','Helvetica','Arial',sans-serif] tracking-tight">
        BANK ACCOUNT DETAILS
      </h3>
      
      {/* Bank account details content - more compact */}
      <div className="px-4 py-3 grid grid-cols-2 gap-3">
        <div className="flex items-start">
          <div className="mr-2 mt-0.5">
            <div className="w-7 h-7 bg-[#E5E5EA]/50 dark:bg-[#3A3A3C] rounded-full flex items-center justify-center">
              <DollarSign size={14} className="text-[#007AFF] dark:text-[#0A84FF]" />
            </div>
          </div>
          <div>
            <div className="text-[13px] text-[#8E8E93] dark:text-[#98989D] mb-0.5">Bank Code</div>
            <div className="text-[15px] text-[#1C1C1E] dark:text-white">47</div>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="mr-2 mt-0.5">
            <div className="w-7 h-7 bg-[#E5E5EA]/50 dark:bg-[#3A3A3C] rounded-full flex items-center justify-center">
              <Wallet size={14} className="text-[#007AFF] dark:text-[#0A84FF]" />
            </div>
          </div>
          <div>
            <div className="text-[13px] text-[#8E8E93] dark:text-[#98989D] mb-0.5">Branch Code</div>
            <div className="text-[15px] text-[#1C1C1E] dark:text-white">800</div>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="mr-2 mt-0.5">
            <div className="w-7 h-7 bg-[#E5E5EA]/50 dark:bg-[#3A3A3C] rounded-full flex items-center justify-center">
              <CreditCard size={14} className="text-[#007AFF] dark:text-[#0A84FF]" />
            </div>
          </div>
          <div className="flex-1">
            <div className="text-[13px] text-[#8E8E93] dark:text-[#98989D] mb-0.5">Account Number</div>
            <CopyableField text="000952807" label="account number" />
          </div>
        </div>
        
        <div className="flex items-start col-span-2 mt-3">
          <div className="mr-2 mt-0.5">
            <div className="w-7 h-7 bg-[#E5E5EA]/50 dark:bg-[#3A3A3C] rounded-full flex items-center justify-center">
              <ArrowUpRight size={14} className="text-[#007AFF] dark:text-[#0A84FF]" />
            </div>
          </div>
          <div className="flex-1">
            <div className="text-[13px] text-[#8E8E93] dark:text-[#98989D] mb-0.5">IBAN</div>
            <CopyableField text="IL0504780000000000952807" label="IBAN" formatText={true} />
          </div>
        </div>
      </div>
      
      {/* Action buttons - positioned below account balances */}
      <div className="p-4 flex justify-center space-x-4">
        {/* Show Limits Button with popup functionality */}
        <div className="relative group">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="w-9 h-9 flex items-center justify-center bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-full group-hover:bg-[#007AFF]/10 transition-colors"
            aria-label="Show limits"
            onClick={() => alert('Show Limits popup would appear here')}
          >
            <Eye size={16} className="text-[#8E8E93] dark:text-[#98989D] group-hover:text-[#007AFF] dark:group-hover:text-[#0A84FF] transition-colors" />
          </motion.button>
          <div className="absolute opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-200 -top-8 right-0 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none z-50">
            Show Limits
          </div>
        </div>
        
        {/* Show Documents Button */}
        <div className="relative group">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="w-9 h-9 flex items-center justify-center bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-full group-hover:bg-[#007AFF]/10 transition-colors"
            aria-label="Show documents"
            onClick={() => alert('Documents popup would appear here')}
          >
            <FileText size={16} className="text-[#8E8E93] dark:text-[#98989D] group-hover:text-[#007AFF] dark:group-hover:text-[#0A84FF] transition-colors" />
          </motion.button>
          <div className="absolute opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-200 -top-8 right-0 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none z-50">
            Show Documents
          </div>
        </div>
        
        {/* Add Prepaid Card Button */}
        <div className="relative group">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="w-9 h-9 flex items-center justify-center bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-full group-hover:bg-[#007AFF]/10 transition-colors"
            aria-label="Add prepaid card"
            onClick={() => alert('Add Prepaid Card form would appear here')}
          >
            <CreditCardIcon size={16} className="text-[#8E8E93] dark:text-[#98989D] group-hover:text-[#007AFF] dark:group-hover:text-[#0A84FF] transition-colors" />
          </motion.button>
          <div className="absolute opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-200 -top-8 right-0 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none z-50">
            Add Prepaid Card
          </div>
        </div>
        
        {/* Add SIM Card Button */}
        <div className="relative group">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="w-9 h-9 flex items-center justify-center bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-full group-hover:bg-[#007AFF]/10 transition-colors"
            aria-label="Add SIM card"
            onClick={() => alert('Add SIM Card form would appear here')}
          >
            <Smartphone size={16} className="text-[#8E8E93] dark:text-[#98989D] group-hover:text-[#007AFF] dark:group-hover:text-[#0A84FF] transition-colors" />
          </motion.button>
          <div className="absolute opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-200 -top-8 right-0 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none z-50">
            Add SIM Card
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};
