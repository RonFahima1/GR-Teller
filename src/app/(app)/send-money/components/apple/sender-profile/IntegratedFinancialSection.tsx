'use client';

import React, { useState } from 'react';
import { Building, CreditCard, Banknote, Info, Building2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// Import our shared components
import { InfoSection } from '../shared/InfoSection';
import { InfoItem } from '../shared/InfoItem';
import { CurrencyCard } from '../shared/CurrencyCard';
import { CopyableText } from '../shared/CopyableText';

// Define our interfaces
interface Balance {
  currency: string;
  amount: number | string;
  convertedValue?: string;
}

interface BankAccount {
  bankCode: string;
  branchCode: string;
  accountNumber: string;
  iban: string;
}

interface IntegratedFinancialSectionProps {
  balances: Balance[];
  preferredCurrency: string;
  bankAccount: BankAccount;
}

/**
 * IntegratedFinancialSection - Component for displaying financial information
 * Following Apple HIG guidelines with clean interface and proper information hierarchy
 */
export const IntegratedFinancialSection: React.FC<IntegratedFinancialSectionProps> = ({
  balances = [],
  preferredCurrency = 'USD',
  bankAccount = { bankCode: 'N/A', branchCode: 'N/A', accountNumber: 'N/A', iban: 'N/A' }
}) => {
  const [showIBANInfo, setShowIBANInfo] = useState(false);
  
  // Format IBAN with spaces for readability
  const formatIBAN = (iban: string): string => {
    return iban.replace(/(.{4})/g, '$1 ').trim();
  };
  
  // Calculate total balance
  const calculateTotalBalance = () => {
    if (balances.length === 0) return '0.00';
    
    // Find preferred currency or first available
    const preferredBalance = balances.find(b => b.currency === preferredCurrency);
    if (preferredBalance) {
      return typeof preferredBalance.amount === 'number' 
        ? preferredBalance.amount.toFixed(2)
        : preferredBalance.amount;
    }
    
    // If no preferred currency found, use the first one
    return typeof balances[0].amount === 'number'
      ? balances[0].amount.toFixed(2)
      : balances[0].amount;
  };
  
  const totalBalance = calculateTotalBalance();
  
  // IBAN information content
  const ibanInfoContent = (
    <div className="flex items-start">
      <Info size={12} className="text-[#007AFF] dark:text-[#0A84FF] mr-2 mt-0.5 flex-shrink-0" />
      <p className="leading-relaxed">
        The International Bank Account Number (IBAN) is used for international money transfers 
        to ensure your payment reaches the correct account quickly and securely.
      </p>
    </div>
  );

  return (
    <div className="bg-white dark:bg-[#1C1C1E] rounded-xl shadow-sm border border-[#E5E5EA] dark:border-[#3A3A3C] p-4 h-full">
      <div className="pb-3 mb-3 border-b border-[#E5E5EA] dark:border-[#3A3A3C]">
        <h3 className="text-[15px] font-semibold text-[#1C1C1E] dark:text-white">
          Financial Information
        </h3>
      </div>
      
      <div className="overflow-y-auto space-y-4 pr-1 max-h-[calc(100vh-200px)] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {/* Account Balances Section */}
        <InfoSection title="Account Balances">
          {balances.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {balances.map((balance, index) => (
                  <CurrencyCard
                    key={`${balance.currency}-${index}`}
                    currency={balance.currency}
                    amount={balance.amount}
                    isPreferred={balance.currency === preferredCurrency}
                    convertedValue={balance.convertedValue}
                  />
                ))}
              </div>
              
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#E5E5EA] dark:border-[#38383A]">
                <div className="text-[13px] font-medium text-[#6C6C70] dark:text-[#AEAEB2]">
                  Total Balance
                </div>
                <div className="text-[15px] font-bold text-[#1C1C1E] dark:text-white">
                  {totalBalance} {preferredCurrency}
                </div>
              </div>
            </>
          ) : (
            <div className="py-4 flex flex-col items-center justify-center text-center">
              <div className="w-8 h-8 rounded-full bg-[#F2F2F7] dark:bg-[#2C2C2E] flex items-center justify-center mb-3">
                <CreditCard size={18} className="text-[#AEAEB2] dark:text-[#8E8E93]" />
              </div>
              <p className="text-[13px] text-[#6C6C70] dark:text-[#AEAEB2]">
                No balances available
              </p>
              <p className="text-[11px] text-[#8E8E93] dark:text-[#6C6C70] mt-0.5">
                Balances will appear here once available
              </p>
            </div>
          )}
        </InfoSection>

        {/* Bank Account Details Section */}
        <InfoSection title="Bank Account Details">
          <InfoItem 
            label="Bank Code"
            value={bankAccount.bankCode}
            icon={<Building size={16} className="text-[#007AFF] dark:text-[#0A84FF]" />}
          />
          
          <InfoItem 
            label="Branch Code"
            value={bankAccount.branchCode}
            icon={<Building2 size={16} className="text-[#007AFF] dark:text-[#0A84FF]" />}
          />
          
          <InfoItem 
            label="Account Number"
            value={<CopyableText text={bankAccount.accountNumber} />}
            icon={<CreditCard size={16} className="text-[#007AFF] dark:text-[#0A84FF]" />}
            copyable={false} // CopyableText component handles copying
          />
          
          <InfoItem 
            label="IBAN"
            value={<CopyableText text={bankAccount.iban} formatText={true} />}
            icon={<Banknote size={16} className="text-[#007AFF] dark:text-[#0A84FF]" />}
            hasInfo={true}
            infoContent={ibanInfoContent}
          />
        </InfoSection>
      </div>
    </div>
  );
};
