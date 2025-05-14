import { useState } from 'react';

interface Transaction {
  id: string;
  date: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  client: string;
  description: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
  onRowClick: (txn: Transaction) => void;
  // Placeholder for future filter/search props
}

export default function TransactionTable({ transactions, onRowClick }: TransactionTableProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selected.length === transactions.length) {
      setSelected([]);
    } else {
      setSelected(transactions.map((t) => t.id));
    }
  };

  return (
    <div className="relative">
      {selected.length > 0 && (
        <div className="absolute -top-12 left-0 w-full flex items-center gap-4 bg-blue-50 border border-blue-200 rounded p-2 z-10">
          <span>{selected.length} selected</span>
          <button className="text-blue-600 font-medium hover:underline">Export</button>
          <button className="text-blue-600 font-medium hover:underline">Mark as Reviewed</button>
          <button className="text-red-600 font-medium hover:underline" onClick={() => setSelected([])}>Clear</button>
        </div>
      )}
      <table className="w-full border rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2"><input type="checkbox" checked={selected.length === transactions.length && transactions.length > 0} onChange={selectAll} /></th>
            <th className="p-2">Date</th>
            <th className="p-2">Client</th>
            <th className="p-2">Description</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn) => (
            <tr
              key={txn.id}
              className="hover:bg-blue-50 cursor-pointer transition"
              onClick={() => onRowClick(txn)}
            >
              <td className="p-2" onClick={e => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selected.includes(txn.id)}
                  onChange={() => toggleSelect(txn.id)}
                />
              </td>
              <td className="p-2">{new Date(txn.date).toLocaleDateString()}</td>
              <td className="p-2">{txn.client}</td>
              <td className="p-2">{txn.description}</td>
              <td className="p-2">{txn.amount.toLocaleString()} {txn.currency}</td>
              <td className="p-2 capitalize">{txn.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 