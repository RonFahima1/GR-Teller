'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Filter, Search, ArrowUpRight, ArrowDownLeft, Loader2, CheckCircle, XCircle, Clock, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import { transactionTypes } from '@/lib/constants';
import { useRouter } from 'next/navigation';

// Mock data for transactions
const mockTransactions = [
  {
    id: 'TXN1001',
    date: '2024-03-15T10:30:00',
    type: 'send',
    amount: 500.00,
    currency: 'USD',
    status: 'completed',
    client: 'Alex Morgan',
    description: 'Send to Jane Smith',
  },
  {
    id: 'TXN1002',
    date: '2024-03-14T15:45:00',
    type: 'receive',
    amount: 200.00,
    currency: 'EUR',
    status: 'pending',
    client: 'Sarah Chen',
    description: 'Receive from John Doe',
  },
  {
    id: 'TXN1003',
    date: '2024-03-13T09:15:00',
    type: 'send',
    amount: 1000.00,
    currency: 'GBP',
    status: 'failed',
    client: 'James Wilson',
    description: 'Send to Carlos Diaz',
  },
];

export default function TransactionsPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8">
      <p className="text-lg text-gray-600 mb-6">
        Choose a transaction type to view or manage transactions.
      </p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {transactionTypes.map(({ label, href }) => (
          <button
            key={href}
            onClick={() => router.push(href)}
            className="rounded-lg border p-6 text-left transition-all hover:border-blue-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <h2 className="font-semibold text-lg mb-1">{label}</h2>
            <p className="text-sm text-gray-500">
              View and manage {label.toLowerCase()} transactions
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
