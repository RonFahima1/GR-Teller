'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Info, Building2, CreditCard, Building, Banknote } from 'lucide-react';
import { cn } from '@/lib/utils';
import { copyToClipboard } from './utils';

interface BankAccountDetailsProps {
  bankAccount: {
    bankCode: string;
    branchCode: string;
    accountNumber: string;
    iban: string;
  };
}

// Format IBAN with spaces for better readability
const formatIBAN = (iban: string): string => {
  if (!iban) return '';
  
  // Format in groups of 4 characters
  return iban.replace(/(.{4})(?=.)/g, '$1 ');
};

export const BankAccountDetailsSection: React.FC<BankAccountDetailsProps> = ({ bankAccount }) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showIBANInfo, setShowIBANInfo] = useState(false);

  const handleCopy = async (text: string, field: string) => {
    const success = await copyToClipboard(text);
    
    if (success) {
      setCopied(field);
      setToastMessage(`${field === 'accountNumber' ? 'Account Number' : 'IBAN'} copied to clipboard`);
      setShowToast(true);
      
      // Hide the check icon after 1.5s
      setTimeout(() => setCopied(null), 1500);
      
      // Hide the toast after 2s
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  const DetailRow = ({ 
    label, 
    value, 
    icon,
    canCopy = false, 
    id, 
    hasInfo = false, 
    onInfoClick
  }: { 
    label: string; 
    value: string; 
    icon: React.ReactNode;
    canCopy?: boolean; 
    id?: string;
    hasInfo?: boolean;
    onInfoClick?: () => void;
  }) => {
    return (
      <div className="flex items-center py-4 border-b border-[#E5E5EA] dark:border-[#38383A] last:border-b-0">
        <div className="w-10 h-10 rounded-full bg-[#F2F2F7] dark:bg-[#2C2C2E] flex items-center justify-center mr-4 flex-shrink-0">
          {icon}
        </div>
        <div className="flex-grow">
          <div className="flex items-center mb-0.5">
            <span className="text-sm font-medium text-[#6C6C70] dark:text-[#98989D]">{label}</span>
            {hasInfo && (
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onInfoClick}
                className="ml-2 text-[#8E8E93] hover:text-[#007AFF] transition-colors"
              >
                <Info size={14} />
              </motion.button>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-base font-medium text-[#1C1C1E] dark:text-white tracking-wide">
              {value}
            </span>
            {canCopy && (
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={() => handleCopy(value, id || label)}
                className="ml-3 text-[#007AFF] dark:text-[#0A84FF] hover:text-[#0071E3] dark:hover:text-[#0071E3] transition-colors p-1.5 rounded-full hover:bg-[#F2F2F7] dark:hover:bg-[#2C2C2E]"
                aria-label={`Copy ${label}`}
              >
                {copied === (id || label) ? (
                  <Check size={18} className="text-[#34C759] dark:text-[#30D158]" />
                ) : (
                  <Copy size={18} />
                )}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative bg-white dark:bg-[#1C1C1E] rounded-xl shadow-sm border border-[#E5E5EA] dark:border-[#38383A] overflow-hidden h-full">
      <div className="px-6 py-4 border-b border-[#E5E5EA] dark:border-[#38383A] flex justify-between items-center bg-[#F9F9FB] dark:bg-[#2C2C2E]">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-[#E5E5EA]/50 dark:bg-[#3A3A3C] flex items-center justify-center mr-3">
            <Building2 size={18} className="text-[#007AFF] dark:text-[#0A84FF]" />
          </div>
          <h3 className="text-lg font-semibold text-[#1C1C1E] dark:text-white">
            Bank Account Details
          </h3>
        </div>
        <div className="flex items-center px-3 py-1.5 bg-[#E4F8ED] dark:bg-[#071D12] rounded-full">
          <span 
            className={cn(
              "w-2.5 h-2.5 rounded-full mr-2 bg-[#34C759] dark:bg-[#30D158]"
            )}
          />
          <span className="text-sm font-medium text-[#34C759] dark:text-[#30D158]">
            Verified
          </span>
        </div>
      </div>
      <div className="p-6">
        <DetailRow 
          label="Bank Code" 
          value={bankAccount.bankCode} 
          icon={<Building size={20} className="text-[#007AFF] dark:text-[#0A84FF]" />}
        />
        <DetailRow 
          label="Branch Code" 
          value={bankAccount.branchCode} 
          icon={<Building2 size={20} className="text-[#007AFF] dark:text-[#0A84FF]" />}
        />
        <DetailRow 
          label="Account Number" 
          value={bankAccount.accountNumber} 
          canCopy={true}
          id="accountNumber"
          icon={<CreditCard size={20} className="text-[#007AFF] dark:text-[#0A84FF]" />}
        />
        <DetailRow 
          label="IBAN" 
          value={formatIBAN(bankAccount.iban)}
          canCopy={true}
          id="iban"
          hasInfo={true}
          onInfoClick={() => setShowIBANInfo(!showIBANInfo)}
          icon={<Banknote size={20} className="text-[#007AFF] dark:text-[#0A84FF]" />}
        />
        
        {/* IBAN info panel */}
        <AnimatePresence>
          {showIBANInfo && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
              className="bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-lg mt-4 mb-2 overflow-hidden ml-14"
            >
              <div className="p-4 text-sm text-[#6C6C70] dark:text-[#98989D]">
                <div className="flex items-start">
                  <Info size={16} className="text-[#007AFF] dark:text-[#0A84FF] mr-2 mt-0.5" />
                  <p>International Bank Account Number (IBAN) is used for international transfers and ensures your money reaches the correct account abroad.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Apple-style toast notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-[#1C1C1E]/90 dark:bg-[#2C2C2E]/90 backdrop-blur-sm text-white px-5 py-3 rounded-full shadow-lg text-base font-medium z-10"
          >
            <div className="flex items-center">
              <Check size={16} className="mr-2 text-[#34C759] dark:text-[#30D158]" />
              {toastMessage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
