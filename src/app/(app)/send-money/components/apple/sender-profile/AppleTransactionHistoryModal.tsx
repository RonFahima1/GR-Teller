'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Calendar, ArrowDownLeft } from 'lucide-react';

// Interface for transaction data
export interface Transaction {
  id: string;
  date: string;
  receiver: string;
  country: string;
  operator: string;
  transferType: string;
  transferDetails: string;
  paymentCurrency: string;
  paymentAmount: string | number;
  receivedCurrency: string;
  receivedAmount: string | number;
}

interface AppleTransactionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  senderName: string;
  transactions: Transaction[];
  onUseTransaction: (transaction: Transaction) => void;
  isLoading?: boolean;
}

export const AppleTransactionHistoryModal: React.FC<AppleTransactionHistoryModalProps> = ({
  isOpen,
  onClose,
  senderName,
  transactions,
  onUseTransaction,
  isLoading = false,
}) => {
  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  // Format currency amounts for display
  const formatAmount = (amount: string | number): string => {
    if (typeof amount === 'number') {
      return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return amount;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 dark:bg-black/50 backdrop-blur-sm"
          onClick={() => onClose()}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="bg-white dark:bg-[#1C1C1E] rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden m-4"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E5EA] dark:border-[#38383A]">
              <div className="flex items-center space-x-2">
                <h2 className="text-[17px] font-semibold text-[#1C1C1E] dark:text-white font-['SF Pro Display','Helvetica','Arial',sans-serif]">
                  {senderName}: Sender History
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F2F2F7] dark:bg-[#2C2C2E] text-[#007AFF] dark:text-[#0A84FF]"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Instruction Banner */}
            <div className="bg-[#E5F1FF] dark:bg-[#0A3060] px-4 py-3">
              <p className="text-[15px] text-[#0074D9] dark:text-[#5AC8FA] leading-tight">
                Select one of the below transactions to use its details or click the button to create a new receiver
              </p>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[60vh]">
              {isLoading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="w-8 h-8 border-2 border-[#007AFF] dark:border-[#0A84FF] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : transactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-[#8E8E93] dark:text-[#98989D]">
                  <Calendar className="h-10 w-10 mb-2 opacity-50" />
                  <p>No transaction history available</p>
                </div>
              ) : (
                <div>
                  <table className="min-w-full">
                    <thead className="sticky top-0 bg-[#F2F2F7] dark:bg-[#2C2C2E] z-10">
                      <tr className="text-left text-[13px] text-[#8E8E93] dark:text-[#98989D] uppercase tracking-wide">
                        <th className="px-4 py-2 font-medium">Date</th>
                        <th className="px-4 py-2 font-medium">Receiver</th>
                        <th className="px-4 py-2 font-medium">Country</th>
                        <th className="px-4 py-2 font-medium hidden md:table-cell">Operator</th>
                        <th className="px-4 py-2 font-medium hidden lg:table-cell">Type</th>
                        <th className="px-4 py-2 font-medium">Details</th>
                        <th className="px-4 py-2 font-medium hidden md:table-cell">Currency</th>
                        <th className="px-4 py-2 font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E5EA] dark:divide-[#38383A]">
                      {transactions.map((transaction) => (
                        <motion.tr
                          key={transaction.id}
                          className="hover:bg-[#F2F2F7] dark:hover:bg-[#2C2C2E] cursor-pointer"
                          onClick={() => onUseTransaction(transaction)}
                          whileTap={{ backgroundColor: '#E5E5EA', scale: 0.99 }}
                        >
                          <td className="px-4 py-3 text-[15px] text-[#1C1C1E] dark:text-white">
                            {formatDate(transaction.date)}
                          </td>
                          <td className="px-4 py-3 text-[15px] font-medium text-[#1C1C1E] dark:text-white">
                            {transaction.receiver}
                          </td>
                          <td className="px-4 py-3 text-[15px] text-[#1C1C1E] dark:text-white">
                            {transaction.country}
                          </td>
                          <td className="px-4 py-3 text-[15px] text-[#1C1C1E] dark:text-white hidden md:table-cell">
                            {transaction.operator}
                          </td>
                          <td className="px-4 py-3 text-[15px] text-[#1C1C1E] dark:text-white hidden lg:table-cell">
                            {transaction.transferType}
                          </td>
                          <td className="px-4 py-3 text-[15px] text-[#1C1C1E] dark:text-white">
                            {transaction.transferDetails}
                          </td>
                          <td className="px-4 py-3 text-[15px] text-[#1C1C1E] dark:text-white hidden md:table-cell">
                            {transaction.paymentCurrency} → {transaction.receivedCurrency}
                          </td>
                          <td className="px-4 py-3 text-[15px] text-[#1C1C1E] dark:text-white">
                            <div className="flex items-center">
                              <span className="font-medium">{formatAmount(transaction.paymentAmount)}</span>
                              <ChevronRight size={16} className="ml-2 text-[#8E8E93] dark:text-[#98989D]" />
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-[#E5E5EA] dark:border-[#38383A] p-4 flex justify-between items-center">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-[#E5E5EA] dark:border-[#38383A] rounded-full text-[15px] font-medium text-[#007AFF] dark:text-[#0A84FF]"
              >
                Close
              </button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-[#007AFF] dark:bg-[#0A84FF] rounded-full text-[15px] font-medium text-white"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onClose();
                  // Handle new receiver logic 
                }}
              >
                New Receiver
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
