import React from 'react';
import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GlassmorphicCard } from '@/components/ui/GlassmorphicCard';
import { FormData } from '../hooks/useSendMoneyForm';

interface TransferDetailsProps {
  formData: FormData;
  handleSelectChange: (name: string, value: string) => void;
  errors: Record<string, string>;
}

export const TransferDetails: React.FC<TransferDetailsProps> = ({
  formData,
  handleSelectChange,
  errors
}) => {
  // Source of funds options
  const sourceOfFundsOptions = [
    { value: 'salary', label: 'Salary' },
    { value: 'savings', label: 'Savings' },
    { value: 'business', label: 'Business Income' },
    { value: 'investment', label: 'Investment Returns' },
    { value: 'gift', label: 'Gift' },
    { value: 'other', label: 'Other' }
  ];
  
  // Purpose of transfer options
  const purposeOfTransferOptions = [
    { value: 'family_support', label: 'Family Support' },
    { value: 'education', label: 'Education' },
    { value: 'medical', label: 'Medical Expenses' },
    { value: 'business', label: 'Business' },
    { value: 'travel', label: 'Travel' },
    { value: 'gift', label: 'Gift' },
    { value: 'other', label: 'Other' }
  ];
  
  // Transfer type options
  const transferTypeOptions = [
    { value: 'bank', label: 'Bank Transfer' },
    { value: 'cash', label: 'Cash Pickup' },
    { value: 'mobile', label: 'Mobile Wallet' }
  ];
  
  return (
    <div className="space-y-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <GlassmorphicCard variant="elevated" colorScheme="purple" className="p-6 md:p-8 lg:p-10">
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
                  <SelectContent className="z-[100]">
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
                  <SelectContent className="z-[100]">
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
                  <SelectContent className="z-[100]">
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
          </GlassmorphicCard>
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
  );
};
