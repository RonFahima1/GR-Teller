import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, Repeat, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Client, FormData } from '../hooks/useSendMoneyForm'; // Adjust path as needed
import { cn } from '@/lib/utils';

// Define a simple Transaction interface for demo purposes
export interface Transaction {
  id: string;
  date: string;
  receiverName: string;
  amountSent: string;
  currencySent: string;
  amountReceived: string;
  currencyReceived: string;
  status: 'Completed' | 'Pending' | 'Failed';
  country?: string;
  operator?: string;
  transferType?: string; // e.g., "Cash Pickup", "Bank Deposit"
  transferDetails?: string; // e.g., "Any Branch", specific bank account details if concise
}

interface SenderTransactionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  sender: Client | null;
  transactions: Transaction[];
  onUseTransaction: (transaction: Transaction) => void; // Callback to prefill form
  isLoading?: boolean;
  onAddNewReceiver?: () => void; // Callback to add a new receiver
}

export const SenderTransactionHistoryModal: React.FC<SenderTransactionHistoryModalProps> = ({
  isOpen,
  onClose,
  sender,
  transactions,
  onUseTransaction,
  onAddNewReceiver,
  isLoading,
}) => {
  if (!isOpen || !sender) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Transaction History for {sender.name}
              </h3>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-1 sm:p-5 overflow-y-auto flex-grow">
              {isLoading && <p className="text-center text-gray-500 dark:text-gray-400 py-6">Loading history...</p>}
              {!isLoading && transactions.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-10">No transactions found for this sender.</p>
              )}
              {!isLoading && transactions.length > 0 && (
                <div className="flow-root">
                  <div className="-mx-1 sm:-mx-5">
                    <div className="inline-block min-w-full py-2 align-middle">
                      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead className="bg-gray-50 dark:bg-gray-700/50 sticky top-0 z-10">
                            <tr>
                              <th scope="col" className="py-3 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                              <th scope="col" className="py-3 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Receiver</th>
                              <th scope="col" className="py-3 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">Country</th>
                              <th scope="col" className="py-3 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">Operator</th>
                              <th scope="col" className="py-3 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">Type</th>
                              <th scope="col" className="py-3 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>                               
                              <th scope="col" className="py-3 px-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                              <th scope="col" className="py-3 px-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {transactions.map((tx) => (
                              <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                                <td className="px-3 py-3.5 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{tx.date}</td>
                                <td className="px-3 py-3.5 text-sm font-medium text-gray-800 dark:text-gray-100 whitespace-nowrap">
                                  {tx.receiverName}
                                  {tx.transferDetails && <p className="text-xs text-gray-400 dark:text-gray-500 hidden md:block">{tx.transferDetails}</p>}
                                </td>
                                <td className="px-3 py-3.5 text-xs text-gray-500 dark:text-gray-400 hidden md:table-cell whitespace-nowrap">{tx.country || 'N/A'}</td>
                                <td className="px-3 py-3.5 text-xs text-gray-500 dark:text-gray-400 hidden lg:table-cell whitespace-nowrap">{tx.operator || 'N/A'}</td>
                                <td className="px-3 py-3.5 text-xs text-gray-500 dark:text-gray-400 hidden lg:table-cell whitespace-nowrap">{tx.transferType || 'N/A'}</td>
                                <td className="px-3 py-3.5 text-xs text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                  <div>Sent: {tx.amountSent} {tx.currencySent}</div>
                                  <div>Recv: {tx.amountReceived} {tx.currencyReceived}</div>
                                </td>
                                <td className="px-3 py-3.5 text-center whitespace-nowrap">
                                  <span className={cn(
                                    "text-xs font-semibold px-2 py-0.5 rounded-full",
                                    tx.status === 'Completed' && 'bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300',
                                    tx.status === 'Pending' && 'bg-amber-100 text-amber-700 dark:bg-amber-700/30 dark:text-amber-300',
                                    tx.status === 'Failed' && 'bg-red-100 text-red-700 dark:bg-red-700/30 dark:text-red-300',
                                  )}>
                                    {tx.status}
                                  </span>
                                </td>
                                <td className="px-3 py-3.5 text-right whitespace-nowrap">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => onUseTransaction(tx)}
                                    className="text-xs h-7 px-2 py-1 leading-tight border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  >
                                    <Repeat className="mr-1 h-3 w-3" /> Use
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
              {/* New receiver button */}
              {onAddNewReceiver && (
                <Button 
                  variant="default" 
                  onClick={() => {
                    // Ensure the onAddNewReceiver callback is called consistently
                    if (onAddNewReceiver) {
                      onAddNewReceiver();
                    }
                  }}
                  className="bg-[#007AFF] hover:bg-[#0062CC] text-white"
                >
                  <UserPlus className="mr-1.5 h-4 w-4" /> New Receiver
                </Button>
              )}
              <Button variant="outline" onClick={onClose}>Close</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 