'use client';

import React from 'react';

interface CurrencyCardProps {
  currency: string;
  amount: number | string;
  isPreferred?: boolean;
  convertedValue?: string;
}

/**
 * CurrencyCard - Component for displaying currency balances
 * Matches the reference design with clean styling
 */
export const CurrencyCard: React.FC<CurrencyCardProps> = ({
  currency,
  amount,
  isPreferred = false,
  convertedValue
}) => {
  const formattedAmount = typeof amount === 'number' 
    ? new Intl.NumberFormat('en-US', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2
      }).format(amount)
    : amount;

  return (
    <div className={`
      flex flex-col p-3 rounded-md border
      ${isPreferred 
        ? 'bg-[#007AFF]/5 dark:bg-[#0A84FF]/10 border-[#007AFF]/20 dark:border-[#0A84FF]/20' 
        : 'bg-white dark:bg-[#1C1C1E] border-[#E5E5EA] dark:border-[#3A3A3C]'}
    `}>
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-[#1C1C1E] dark:text-white">
          {currency}
        </span>
        {isPreferred && (
          <div className="px-2 py-0.5 bg-[#007AFF] rounded-sm text-[10px] font-semibold text-white">
            Preferred
          </div>
        )}
      </div>
      
      <div className="mt-1.5 text-[21px] font-bold text-[#007AFF] dark:text-[#0A84FF]">
        {formattedAmount}
      </div>
      
      {convertedValue && (
        <div className="mt-1 text-[11px] text-[#6C6C70] dark:text-[#98989D]">
          ≈ {convertedValue}
        </div>
      )}
    </div>
  );
};
