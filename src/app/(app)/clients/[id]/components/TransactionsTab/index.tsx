import React, { useState } from 'react';
import { Transaction } from '../../types/client-profile.types';
import { Section } from '../Section';
import { TransactionDetailsModal } from './TransactionDetailsModal';
import TransactionTable from '@/components/transactions/TransactionTable';

interface TransactionsTabProps {
  transactions: Transaction[];
}

/**
 * Displays client transaction history with detailed view
 */
export function TransactionsTab({ transactions }: TransactionsTabProps) {
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

  return (
    <Section title="Transaction History">
      <TransactionTable 
        transactions={transactions} 
        onRowClick={setSelectedTxn} 
      />
      
      {selectedTxn && (
        <TransactionDetailsModal 
          txn={selectedTxn} 
          onClose={() => setSelectedTxn(null)} 
        />
      )}
    </Section>
  );
}
