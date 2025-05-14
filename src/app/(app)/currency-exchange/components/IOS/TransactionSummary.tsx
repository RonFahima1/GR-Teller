import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { Currency, ExchangeData } from '../../hooks/useCurrencyExchange';

interface TransactionSummaryProps {
  fromCurrency: Currency;
  toCurrency: Currency;
  exchangeData: ExchangeData;
  fee: number;
  totalAmount: number;
  errors: Record<string, string>;
  isLoading: boolean;
  onCheckboxChange: (name: string, checked: boolean) => void;
  onExchangeClick: () => void;
}

export const TransactionSummary: React.FC<TransactionSummaryProps> = ({
  fromCurrency,
  toCurrency,
  exchangeData,
  fee,
  totalAmount,
  errors,
  isLoading,
  onCheckboxChange,
  onExchangeClick,
}) => {
  // Format amount with proper currency symbol
  const formatAmount = (amount: string | number, currency: Currency) => {
    if (!amount) return currency.symbol + '0';
    
    // Format with appropriate decimal places
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(num)) return currency.symbol + '0';
    
    return currency.symbol + num.toFixed(2);
  };

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/80 px-4 py-3">
        <h3 className="text-base font-medium text-gray-800 dark:text-gray-200">
          Transaction Summary
        </h3>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Transaction Details */}
          <div>
            <dl className="divide-y divide-gray-100 dark:divide-gray-800">
              <div className="flex justify-between py-2.5">
                <dt className="text-sm text-gray-500 dark:text-gray-400">Exchange Amount</dt>
                <dd className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatAmount(exchangeData.fromAmount || '0', fromCurrency)}
                </dd>
              </div>
              <div className="flex justify-between py-2.5">
                <dt className="text-sm text-gray-500 dark:text-gray-400">Exchange Rate</dt>
                <dd className="text-sm font-medium text-gray-900 dark:text-white">
                  1 {fromCurrency.code} = {exchangeData.rate.toFixed(4)} {toCurrency.code}
                </dd>
              </div>
              <div className="flex justify-between py-2.5">
                <dt className="text-sm text-gray-500 dark:text-gray-400">Recipient Gets</dt>
                <dd className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatAmount(exchangeData.toAmount || '0', toCurrency)}
                </dd>
              </div>
              <div className="flex justify-between py-2.5">
                <dt className="text-sm text-gray-500 dark:text-gray-400">Service Fee</dt>
                <dd className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatAmount(fee, fromCurrency)}
                </dd>
              </div>
              <div className="flex justify-between py-2.5">
                <dt className="text-sm font-semibold text-gray-700 dark:text-gray-200">Total</dt>
                <dd className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatAmount(totalAmount, fromCurrency)}
                </dd>
              </div>
            </dl>
          </div>
          
          {/* Terms and Action Button */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-start gap-2 mb-3">
                <Checkbox 
                  id="terms" 
                  checked={exchangeData.termsAccepted}
                  onCheckedChange={(checked) => 
                    onCheckboxChange('termsAccepted', checked as boolean)
                  }
                  className="mt-1"
                />
                <label 
                  htmlFor="terms" 
                  className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
                >
                  I agree to the terms and conditions and understand that currency exchange rates are subject to change.
                </label>
              </div>
              {errors.termsAccepted && (
                <p className="text-xs text-red-600 dark:text-red-400 mb-3">
                  {errors.termsAccepted}
                </p>
              )}
            </div>
            
            <Button
              onClick={onExchangeClick}
              disabled={
                isLoading || 
                !exchangeData.termsAccepted || 
                !exchangeData.fromAmount || 
                parseFloat(exchangeData.fromAmount) <= 0
              }
              className="w-full py-6 text-base font-medium bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Processing Exchange
                </span>
              ) : (
                'Exchange Now'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
