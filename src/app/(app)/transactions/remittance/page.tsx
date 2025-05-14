'use client';

import { useState } from 'react';
import TransactionTable from '@/components/transactions/TransactionTable';

const mockTransactions = [
  {
    id: 'TXN1001',
    date: '2024-03-15T10:30:00',
    type: 'remittance',
    amount: 500.0,
    currency: 'USD',
    status: 'completed',
    client: 'Alex Morgan',
    description: 'Send to Jane Smith',
  },
  {
    id: 'TXN1002',
    date: '2024-03-14T15:45:00',
    type: 'remittance',
    amount: 200.0,
    currency: 'EUR',
    status: 'pending',
    client: 'Sarah Chen',
    description: 'Receive from John Doe',
  },
];

function TransactionDetailsModal({ txn, onClose }: { txn: any; onClose: () => void }) {
  if (!txn) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 min-w-[320px] max-w-[90vw]">
        <h2 className="text-xl font-bold mb-2">Transaction Details</h2>
        <pre className="text-xs bg-gray-100 rounded p-2 mb-4 overflow-x-auto">{JSON.stringify(txn, null, 2)}</pre>
        <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default function RemittancePage() {
  const [selectedTxn, setSelectedTxn] = useState<any | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [client, setClient] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filtered = mockTransactions.filter(txn => {
    if (search && !(
      txn.client.toLowerCase().includes(search.toLowerCase()) ||
      txn.description.toLowerCase().includes(search.toLowerCase())
    )) return false;
    if (status !== 'all' && txn.status !== status) return false;
    if (client && !txn.client.toLowerCase().includes(client.toLowerCase())) return false;
    if (dateFrom && new Date(txn.date) < new Date(dateFrom)) return false;
    if (dateTo && new Date(txn.date) > new Date(dateTo)) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Remittance Transactions</h1>
      <div className="flex flex-wrap gap-4 items-end mb-2">
        <div>
          <label className="block text-xs font-medium mb-1">Search</label>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Client or description"
            className="border rounded px-2 py-1 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Status</label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Client</label>
          <input
            type="text"
            value={client}
            onChange={e => setClient(e.target.value)}
            placeholder="Client name"
            className="border rounded px-2 py-1 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Date From</label>
          <input
            type="date"
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Date To</label>
          <input
            type="date"
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          />
        </div>
      </div>
      <TransactionTable
        transactions={filtered}
        onRowClick={setSelectedTxn}
      />
      {selectedTxn && (
        <TransactionDetailsModal txn={selectedTxn} onClose={() => setSelectedTxn(null)} />
      )}
    </div>
  );
} 