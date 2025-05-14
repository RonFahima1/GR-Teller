'use client';

import TransactionNav from '@/components/transactions/TransactionNav';
import TransactionErrorBoundary from '@/components/transactions/TransactionErrorBoundary';

export default function TransactionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TransactionErrorBoundary>
      <div className="flex flex-col gap-4 p-4">
        <TransactionNav />
        <div className="mt-4">
          {children}
        </div>
      </div>
    </TransactionErrorBoundary>
  );
} 