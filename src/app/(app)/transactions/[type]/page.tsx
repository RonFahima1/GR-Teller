import { transactionTypes } from '@/lib/constants';
import { notFound } from 'next/navigation';

interface TransactionPageProps {
  params: {
    type: string;
  };
}

export default function TransactionPage({ params }: TransactionPageProps) {
  const transactionType = transactionTypes.find(
    (t) => t.href === `/transactions/${params.type}`
  );

  if (!transactionType) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{transactionType.label}</h1>
      <div className="rounded-lg border p-4">
        <p className="text-gray-500 dark:text-gray-400">
          No transactions found. This page will display {transactionType.label.toLowerCase()} transactions when available.
        </p>
      </div>
    </div>
  );
} 