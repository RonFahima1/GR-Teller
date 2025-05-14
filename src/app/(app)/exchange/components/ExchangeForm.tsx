'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightLeft, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SelectableCurrency {
  code: string;
  name: string;
  flag: string;
}

interface ExchangeFormProps {
  currencies: SelectableCurrency[];
  payAmount: string;
  setPayAmount: (value: string) => void;
  payCurrency: string;
  setPayCurrency: (value: string) => void;
  receiveAmount: string;
  receiveCurrency: string;
  setReceiveCurrency: (value: string) => void;
  exchangeRate: number | null;
  onRateCalculated: (rate: number | null) => void;
}

export const ExchangeForm: React.FC<ExchangeFormProps> = ({
  currencies,
  payAmount,
  setPayAmount,
  payCurrency,
  setPayCurrency,
  receiveAmount,
  receiveCurrency,
  setReceiveCurrency,
  exchangeRate,
  onRateCalculated,
}) => {
  const [internalReceiveAmount, setInternalReceiveAmount] = useState<string>('');
  const [systemRate] = useState<number | null>(3.6900); // Example from old UI, make dynamic or prop

  useEffect(() => {
    let calculatedRate: number | null = null;
    if (payCurrency && receiveCurrency) {
      if (payCurrency === receiveCurrency) {
        calculatedRate = 1;
      } else {
        // Simulate API call or lookup for exchange rate
        if (payCurrency === 'USD' && receiveCurrency === 'ILS') calculatedRate = systemRate;
        else if (payCurrency === 'ILS' && receiveCurrency === 'USD') calculatedRate = systemRate ? 1 / systemRate : null;
        else if (payCurrency === 'USD' && receiveCurrency === 'EUR') calculatedRate = 0.92;
        else if (payCurrency === 'EUR' && receiveCurrency === 'USD') calculatedRate = 1.08;
        else if (payCurrency === 'GBP' && receiveCurrency === 'USD') calculatedRate = 1.27;
        else if (payCurrency === 'USD' && receiveCurrency === 'GBP') calculatedRate = (1 / 1.27);
        else calculatedRate = Math.random() * 2 + 0.5; // Generic fallback
      }
    }
    onRateCalculated(calculatedRate);
  }, [payCurrency, receiveCurrency, systemRate, onRateCalculated]);

  useEffect(() => {
    if (payAmount && exchangeRate && exchangeRate > 0) {
      const numericPayAmount = parseFloat(payAmount);
      if (!isNaN(numericPayAmount)) {
        setInternalReceiveAmount((numericPayAmount * exchangeRate).toFixed(2));
      }
    } else {
      setInternalReceiveAmount('');
    }
  }, [payAmount, exchangeRate]);

  const handleSwapCurrencies = () => {
    const tempPayCurrency = payCurrency;
    setPayCurrency(receiveCurrency);
    setReceiveCurrency(tempPayCurrency);
    
    setPayAmount(internalReceiveAmount);
  };
  
  const getCurrencyByCode = (code: string): SelectableCurrency | undefined => currencies.find(c => c.code === code);

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div>
          <label htmlFor="payAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            You Pay
          </label>
          <div className="flex">
            <Input
              type="number"
              id="payAmount"
              value={payAmount}
              onChange={(e) => setPayAmount(e.target.value)}
              placeholder="0.00"
              className="flex-1 rounded-r-none focus:z-10 text-base py-2.5 dark:bg-gray-800 dark:border-gray-700"
              aria-label="Amount to pay"
            />
            <Select value={payCurrency} onValueChange={setPayCurrency}>
              <SelectTrigger className="w-[130px] rounded-l-none border-l-0 text-base py-2.5 dark:bg-gray-800 dark:border-gray-700">
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800">
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code} className="text-base dark:focus:bg-gray-700">
                    <span className="mr-2 text-lg">{currency.flag}</span> {currency.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-center items-center my-2">
          <Button 
            variant="outline"
            size="icon_lg" 
            onClick={handleSwapCurrencies} 
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 rounded-full border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700/50 aspect-square"
            aria-label="Swap currencies"
          >
            <ArrowRightLeft className="h-5 w-5" />
          </Button>
        </div>

        <div>
          <label htmlFor="receiveAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            You Receive (approx.)
          </label>
          <div className="flex">
            <Input
              type="number"
              id="receiveAmount"
              value={internalReceiveAmount}
              placeholder="0.00"
              className="flex-1 rounded-r-none focus:z-10 text-base py-2.5 bg-gray-100 dark:bg-gray-700/60 dark:text-gray-300 border-gray-300 dark:border-gray-600"
              readOnly
              aria-label="Amount to receive"
            />
            <Select value={receiveCurrency} onValueChange={setReceiveCurrency}>
              <SelectTrigger className="w-[130px] rounded-l-none border-l-0 text-base py-2.5 dark:bg-gray-800 dark:border-gray-700">
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800">
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code} className="text-base dark:focus:bg-gray-700">
                    <span className="mr-2 text-lg">{currency.flag}</span> {currency.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {exchangeRate !== null && payCurrency && receiveCurrency && payCurrency !== receiveCurrency && (
          <div className="text-sm text-gray-600 dark:text-gray-400 p-3.5 bg-gray-100 dark:bg-gray-700/60 rounded-lg flex items-center justify-center space-x-2 shadow-sm border border-gray-200 dark:border-gray-700/50">
            <Info className="h-4 w-4 text-blue-500 dark:text-blue-400 flex-shrink-0" />
            <span className="font-medium">
              1 {getCurrencyByCode(payCurrency)?.code}
            </span>
            <span className="text-gray-400 dark:text-gray-500">≈</span>
            <span className="font-medium">
              {exchangeRate.toFixed(4)} {getCurrencyByCode(receiveCurrency)?.code}
            </span>
            {systemRate && payCurrency === 'USD' && receiveCurrency === 'ILS' && Math.abs(exchangeRate - systemRate) > 0.00001 && (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className="ml-1 text-xs text-gray-400 dark:text-gray-500 cursor-help hover:underline">(System Ref: {systemRate.toFixed(4)})</span>
                    </TooltipTrigger>
                    <TooltipContent className="dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700">
                        <p>The current system reference rate is {systemRate.toFixed(4)}.</p>
                    </TooltipContent>
                </Tooltip>
            )}
          </div>
        )}

        <div className="border-t border-gray-200 dark:border-gray-700 pt-5 mt-1 space-y-2.5 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 dark:text-gray-400">Total to pay:</span>
            <span className="font-semibold text-gray-800 dark:text-gray-100 text-base">
              {payAmount ? `${parseFloat(payAmount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} ${getCurrencyByCode(payCurrency)?.code ?? ''}` : `0.00 ${getCurrencyByCode(payCurrency)?.code ?? ''}`}
            </span>
          </div>
        </div>

      </div>
    </TooltipProvider>
  );
}; 