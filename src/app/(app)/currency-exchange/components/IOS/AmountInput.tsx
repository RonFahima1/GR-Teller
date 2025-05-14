import React from 'react';
import { cn } from '@/lib/utils';
import { Currency } from '../../hooks/useCurrencyExchange';

interface AmountInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  currency: Currency;
  error?: string;
  readOnly?: boolean;
}

export const AmountInput: React.FC<AmountInputProps> = ({
  label,
  value,
  onChange,
  currency,
  error,
  readOnly = false,
}) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {label}
      </label>
      <div className={cn(
        "relative rounded-xl overflow-hidden border transition-all duration-200",
        error 
          ? "border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/10" 
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      )}>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full text-xl font-semibold py-3 px-4 border-0 focus:ring-0 focus:outline-none",
            error 
              ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10" 
              : "text-gray-900 dark:text-white bg-transparent",
            readOnly && "opacity-70"
          )}
          placeholder="0.00"
          inputMode="decimal"
          readOnly={readOnly}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-100 dark:bg-gray-700 py-1 px-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300">
          {currency.code}
        </div>
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};
