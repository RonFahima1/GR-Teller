import React from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, AlertTriangle, ChevronRight } from 'lucide-react';
import { Transaction } from '../../hooks/useCurrencyExchange';

interface TransactionHistoryViewProps {
  transactions: Transaction[];
  onTransactionClick?: (transaction: Transaction) => void;
}

export const TransactionHistoryView: React.FC<TransactionHistoryViewProps> = ({
  transactions,
  onTransactionClick,
}) => {
  if (transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-8 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
            <Clock className="h-8 w-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">
            No Transactions Yet
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
            Once you make your first currency exchange, your transaction history will appear here.
          </p>
        </div>
      </div>
    );
  }

  // Format date to a readable format
  const formatDate = (date: Date) => {
    // If today, show time
    const today = new Date();
    const isToday = 
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
    
    if (isToday) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // If yesterday, show "Yesterday"
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = 
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();
    
    if (isYesterday) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Otherwise, show full date
    return date.toLocaleDateString([], { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Group transactions by date (today, yesterday, earlier this week, etc.)
  const groupTransactions = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const groups: { title: string; transactions: Transaction[] }[] = [
      { title: 'Today', transactions: [] },
      { title: 'Yesterday', transactions: [] },
      { title: 'This Week', transactions: [] },
      { title: 'This Month', transactions: [] },
      { title: 'Earlier', transactions: [] },
    ];
    
    transactions.forEach(transaction => {
      const date = transaction.date;
      
      // Today
      if (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      ) {
        groups[0].transactions.push(transaction);
        return;
      }
      
      // Yesterday
      if (
        date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear()
      ) {
        groups[1].transactions.push(transaction);
        return;
      }
      
      // This Week
      if (date >= oneWeekAgo) {
        groups[2].transactions.push(transaction);
        return;
      }
      
      // This Month
      if (date >= oneMonthAgo) {
        groups[3].transactions.push(transaction);
        return;
      }
      
      // Earlier
      groups[4].transactions.push(transaction);
    });
    
    // Filter out empty groups
    return groups.filter(group => group.transactions.length > 0);
  };
  
  const transactionGroups = groupTransactions();

  return (
    <div className="space-y-6">
      {transactionGroups.map((group, groupIndex) => (
        <div key={group.title} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/80 border-b border-gray-100 dark:border-gray-800">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {group.title}
            </h3>
          </div>
          
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {group.transactions.map((transaction, index) => (
              <TransactionItem 
                key={transaction.id} 
                transaction={transaction}
                onClick={() => onTransactionClick?.(transaction)}
                isLast={index === group.transactions.length - 1}
                delay={groupIndex * 0.1 + index * 0.05}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

interface TransactionItemProps {
  transaction: Transaction;
  onClick: () => void;
  isLast: boolean;
  delay: number;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onClick,
  isLast,
  delay,
}) => {
  // Status icon based on transaction status
  const StatusIcon = () => {
    switch (transaction.status) {
      case 'completed':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };
  
  // Status text color based on transaction status
  const statusTextColor = () => {
    switch (transaction.status) {
      case 'completed':
        return 'text-green-500';
      case 'pending':
        return 'text-yellow-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <span className="text-lg">
              {transaction.fromCurrency.charAt(0)}→{transaction.toCurrency.charAt(0)}
            </span>
          </div>
          
          <div>
            <div className="font-medium text-sm text-gray-900 dark:text-white">
              {transaction.fromCurrency} → {transaction.toCurrency}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              <StatusIcon />
              <span className={statusTextColor()}>
                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
              </span>
              <span>•</span>
              <span>{transaction.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="text-right mr-3">
            <div className="font-medium text-sm text-gray-900 dark:text-white">
              {transaction.fromAmount} {transaction.fromCurrency}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {transaction.toAmount} {transaction.toCurrency}
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </motion.div>
  );
};
