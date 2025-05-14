'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FormData } from '../hooks/useSendMoneyForm';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ErrorFallback } from './ErrorFallback';
import { AlertCircle } from 'lucide-react';

interface TransferDetailsProps {
  formData: Partial<FormData>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: keyof FormData, value: string) => void;
  errors: Record<string, string>;
}

export const TransferDetails: React.FC<TransferDetailsProps> = ({
  formData,
  handleInputChange,
  handleSelectChange,
  errors
}) => {
  // Source of funds options
  const sourceOfFundsOptions = [
    { value: 'salary', label: 'Salary' },
    { value: 'savings', label: 'Savings' },
    { value: 'gift', label: 'Gift' },
    { value: 'business_income', label: 'Business Income' },
    { value: 'other', label: 'Other' },
  ];
  
  // Purpose of transfer options
  const purposeOfTransferOptions = [
    { value: 'family_support', label: 'Family Support' },
    { value: 'education', label: 'Education Expenses' },
    { value: 'medical', label: 'Medical Expenses' },
    { value: 'investment', label: 'Investment' },
    { value: 'purchase', label: 'Purchase of Goods/Services' },
    { value: 'other', label: 'Other' },
  ];
  
  // Operator options
  const operatorOptions = [
    { value: 'contact', label: 'Contact' },
    { value: 'operator_b', label: 'Operator B' },
  ];
  
  // Transfer type options
  const transferTypeOptions = [
    { value: 'contact', label: 'Contact' },
    { value: 'lightnet', label: 'Lightnet' },
    { value: 'terrapay', label: 'TerraPay' },
    { value: 'thunes', label: 'Thunes' },
    { value: 'cash_to_credit', label: 'Cash To Credit' },
  ];
  
  // Error handling
  const [hasErrorComponents, setHasErrorComponents] = useState(true);
  
  // Ensure error components are loaded
  useEffect(() => {
    // This simulates checking if error components are available
    setHasErrorComponents(true);
  }, []);
  
  // Handle errors with a custom reset function
  const handleErrorReset = () => {
    window.location.reload();
  };
  
  if (!hasErrorComponents) {
    return <div className="p-4 text-red-500">Loading error components...</div>;
  }
  
  return (
    <ErrorBoundary
      fallback={
        <div className="max-w-3xl mx-auto py-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">Something went wrong</h3>
            <p className="text-sm text-red-600 dark:text-red-300 mb-4">
              There was an error loading the transfer details. Please try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6 md:p-8 lg:p-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <div className="space-y-6 md:grid md:grid-cols-2 md:gap-8 md:space-y-0">
                {/* Source of Funds */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Source of Funds
                  </label>
                  <Select
                    value={formData.sourceOfFunds}
                    onValueChange={(value) => handleSelectChange('sourceOfFunds', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select source of funds" />
                    </SelectTrigger>
                    <SelectContent>
                      {sourceOfFundsOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.sourceOfFunds && (
                    <p className="text-sm text-red-500 mt-1">{errors.sourceOfFunds}</p>
                  )}
                </div>
                
                {/* Purpose of Transfer */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Purpose of Transfer
                  </label>
                  <Select
                    value={formData.purposeOfTransfer}
                    onValueChange={(value) => handleSelectChange('purposeOfTransfer', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select purpose of transfer" />
                    </SelectTrigger>
                    <SelectContent>
                      {purposeOfTransferOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.purposeOfTransfer && (
                    <p className="text-sm text-red-500 mt-1">{errors.purposeOfTransfer}</p>
                  )}
                </div>
                
                {/* Transfer Type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Transfer Type
                  </label>
                  <Select
                    value={formData.transferType}
                    onValueChange={(value) => handleSelectChange('transferType', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select transfer type" />
                    </SelectTrigger>
                    <SelectContent>
                      {transferTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.transferType && (
                    <p className="text-sm text-red-500 mt-1">{errors.transferType}</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            className="mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-lg p-4 flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500 dark:text-purple-400 mt-0.5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-purple-700 dark:text-purple-300">
                <p className="font-medium mb-1">Important Information</p>
                <p className="mb-2">Please ensure all information is accurate and complies with local regulations.</p>
                <p>All transfer details are securely encrypted and comply with international regulations.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </ErrorBoundary>
  );
};
