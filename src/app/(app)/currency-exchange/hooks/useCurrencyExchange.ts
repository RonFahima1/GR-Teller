import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Types
export interface Currency {
  code: string;
  name: string;
  rate: number;
  symbol: string;
  flag: string;
}

export interface ExchangeData {
  fromCurrency: string;
  toCurrency: string;
  fromAmount: string;
  toAmount: string;
  rate: number;
  fee: string;
  termsAccepted: boolean;
}

export interface Transaction {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  fromAmount: string;
  toAmount: string;
  date: Date;
  status: 'completed' | 'pending' | 'failed';
}

export const useCurrencyExchange = () => {
  const router = useRouter();
  
  // State for animation and UI
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [activeTab, setActiveTab] = useState<'exchange' | 'rates' | 'history'>('exchange');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [favorites, setFavorites] = useState<string[]>(['USD', 'EUR', 'GBP']);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isFlipping, setIsFlipping] = useState(false);
  
  // Mock currencies data with additional properties
  const [currencies, setCurrencies] = useState<Currency[]>([
    { code: 'USD', name: 'US Dollar', rate: 1.0000, symbol: '$', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', rate: 0.9200, symbol: '€', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', rate: 0.7900, symbol: '£', flag: '🇬🇧' },
    { code: 'JPY', name: 'Japanese Yen', rate: 151.5000, symbol: '¥', flag: '🇯🇵' },
    { code: 'ILS', name: 'Israeli Shekel', rate: 3.6900, symbol: '₪', flag: '🇮🇱' },
    { code: 'AUD', name: 'Australian Dollar', rate: 1.5200, symbol: 'A$', flag: '🇦🇺' },
    { code: 'CAD', name: 'Canadian Dollar', rate: 1.3500, symbol: 'C$', flag: '🇨🇦' },
    { code: 'CHF', name: 'Swiss Franc', rate: 0.9000, symbol: 'Fr', flag: '🇨🇭' },
    { code: 'CNY', name: 'Chinese Yuan', rate: 7.2500, symbol: '¥', flag: '🇨🇳' },
    { code: 'INR', name: 'Indian Rupee', rate: 83.2000, symbol: '₹', flag: '🇮🇳' },
  ]);
  
  // Mock transactions data
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([
    { 
      id: 'TX' + Math.random().toString(36).substring(2, 10).toUpperCase(), 
      fromCurrency: 'USD', 
      toCurrency: 'EUR', 
      fromAmount: '1000.00', 
      toAmount: '920.00', 
      date: new Date(Date.now() - 3600000), 
      status: 'completed' 
    },
    { 
      id: 'TX' + Math.random().toString(36).substring(2, 10).toUpperCase(), 
      fromCurrency: 'GBP', 
      toCurrency: 'USD', 
      fromAmount: '500.00', 
      toAmount: '632.91', 
      date: new Date(Date.now() - 86400000), 
      status: 'completed' 
    },
    { 
      id: 'TX' + Math.random().toString(36).substring(2, 10).toUpperCase(), 
      fromCurrency: 'EUR', 
      toCurrency: 'JPY', 
      fromAmount: '300.00', 
      toAmount: '49500.00', 
      date: new Date(Date.now() - 172800000), 
      status: 'completed' 
    }
  ]);
  
  // Exchange form data
  const initialExchangeData: ExchangeData = {
    fromCurrency: 'USD',
    toCurrency: 'EUR',
    fromAmount: '',
    toAmount: '',
    rate: 0.92,
    fee: '3.99',
    termsAccepted: false
  };
  
  const [exchangeData, setExchangeData] = useState<ExchangeData>(initialExchangeData);
  
  // Get currency details
  const getCurrency = (code: string): Currency => {
    return currencies.find(c => c.code === code) || currencies[0];
  };
  
  // Calculate conversion
  const calculateConversion = (amount: string, from: string, to: string): string => {
    if (!amount || isNaN(parseFloat(amount))) return '';
    
    const fromCurrency = getCurrency(from);
    const toCurrency = getCurrency(to);
    
    const result = (parseFloat(amount) * toCurrency.rate) / fromCurrency.rate;
    return result.toFixed(4);
  };
  
  // Calculate fee
  const calculateFee = (amount: number): number => {
    // Simple fee calculation: 0.5% with minimum of 2.99
    const calculatedFee = amount * 0.005;
    return Math.max(calculatedFee, 2.99);
  };
  
  // Calculate total amount
  const calculateTotalAmount = (amount: number): number => {
    if (!amount) return 0;
    return amount + calculateFee(amount);
  };
  
  // Handle amount changes
  const handleFromAmountChange = (value: string) => {
    // Remove non-numeric characters except decimal point
    const sanitizedValue = value.replace(/[^0-9.]/g, '');
    
    setExchangeData(prev => ({
      ...prev,
      fromAmount: sanitizedValue,
      toAmount: calculateConversion(sanitizedValue, prev.fromCurrency, prev.toCurrency),
      fee: calculateFee(parseFloat(sanitizedValue) || 0).toFixed(2)
    }));
  };
  
  const handleToAmountChange = (value: string) => {
    // Remove non-numeric characters except decimal point
    const sanitizedValue = value.replace(/[^0-9.]/g, '');
    
    setExchangeData(prev => ({
      ...prev,
      toAmount: sanitizedValue,
      fromAmount: calculateConversion(sanitizedValue, prev.toCurrency, prev.fromCurrency),
      fee: calculateFee(parseFloat(calculateConversion(sanitizedValue, prev.toCurrency, prev.fromCurrency)) || 0).toFixed(2)
    }));
  };
  
  // Handle currency changes
  const handleFromCurrencyChange = (value: string) => {
    setExchangeData(prev => {
      const newRate = calculateRate(value, prev.toCurrency);
      return {
        ...prev,
        fromCurrency: value,
        rate: newRate,
        toAmount: prev.fromAmount ? calculateConversion(prev.fromAmount, value, prev.toCurrency) : ''
      };
    });
  };
  
  const handleToCurrencyChange = (value: string) => {
    setExchangeData(prev => {
      const newRate = calculateRate(prev.fromCurrency, value);
      return {
        ...prev,
        toCurrency: value,
        rate: newRate,
        toAmount: prev.fromAmount ? calculateConversion(prev.fromAmount, prev.fromCurrency, value) : ''
      };
    });
  };
  
  // Calculate exchange rate between two currencies
  const calculateRate = (from: string, to: string): number => {
    const fromCurrency = getCurrency(from);
    const toCurrency = getCurrency(to);
    
    return toCurrency.rate / fromCurrency.rate;
  };
  
  // Swap currencies
  const swapCurrencies = () => {
    setIsFlipping(true);
    
    setTimeout(() => {
      setExchangeData(prev => {
        const newRate = calculateRate(prev.toCurrency, prev.fromCurrency);
        return {
          ...prev,
          fromCurrency: prev.toCurrency,
          toCurrency: prev.fromCurrency,
          fromAmount: prev.toAmount,
          toAmount: prev.fromAmount,
          rate: newRate
        };
      });
      
      setIsFlipping(false);
    }, 300);
  };
  
  // Toggle favorite
  const toggleFavorite = (currency: string) => {
    setFavorites(prev => 
      prev.includes(currency)
        ? prev.filter(c => c !== currency)
        : [...prev, currency]
    );
  };
  
  // Refresh rates
  const refreshRates = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update rates with small random changes to simulate real-time updates
    setCurrencies(prev => 
      prev.map(currency => ({
        ...currency,
        rate: currency.rate * (1 + (Math.random() * 0.02 - 0.01)) // +/- 1%
      }))
    );
    
    setLastUpdated(new Date());
    setIsLoading(false);
  };
  
  // Process exchange
  const processExchange = async () => {
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (!exchangeData.fromAmount) {
      newErrors.fromAmount = 'Please enter an amount';
    }
    
    if (!exchangeData.termsAccepted) {
      newErrors.terms = 'You must accept the terms and conditions';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Clear errors
    setErrors({});
    
    // Start processing
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Add transaction to history
    const newTransaction: Transaction = {
      id: 'TX' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      fromCurrency: exchangeData.fromCurrency,
      toCurrency: exchangeData.toCurrency,
      fromAmount: exchangeData.fromAmount,
      toAmount: exchangeData.toAmount,
      date: new Date(),
      status: 'completed'
    };
    
    setRecentTransactions(prev => [newTransaction, ...prev]);
    
    // Show success message
    setShowSuccessMessage(true);
    
    // Reset form
    setExchangeData(initialExchangeData);
    setIsLoading(false);
  };
  
  // Reset success message
  const resetSuccess = () => {
    setShowSuccessMessage(false);
  };
  
  // Handle checkbox change
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setExchangeData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  return {
    currencies,
    exchangeData,
    isLoading,
    showSuccessMessage,
    activeTab,
    errors,
    favorites,
    lastUpdated,
    isFlipping,
    recentTransactions,
    getCurrency,
    handleFromAmountChange,
    handleToAmountChange,
    handleFromCurrencyChange,
    handleToCurrencyChange,
    swapCurrencies,
    toggleFavorite,
    refreshRates,
    processExchange,
    resetSuccess,
    setActiveTab,
    handleCheckboxChange,
    calculateFee,
    calculateTotalAmount
  };
};
