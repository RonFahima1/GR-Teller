'use client';

import { useState } from 'react';

const mockAuditLog = [
  { id: 1, date: '2024-03-15 10:30', user: 'admin', action: 'Login', details: 'Successful login from 127.0.0.1' },
  { id: 2, date: '2024-03-15 10:35', user: 'admin', action: 'Create Client', details: 'Created client Jane Smith' },
  { id: 3, date: '2024-03-15 10:40', user: 'teller1', action: 'Send Money', details: 'Sent $500 to Alex Morgan' },
  // ...add more mock rows for demo
  ...Array.from({ length: 30 }, (_, i) => ({
    id: 4 + i,
    date: `2024-03-14 09:${(i+10).toString().padStart(2, '0')}`,
    user: i % 2 === 0 ? 'admin' : 'teller1',
    action: i % 3 === 0 ? 'Login' : 'Edit Client',
    details: `Action #${i+4}`
  }))
];

const PAGE_SIZE = 10;

export default function AuditLogPage() {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [user, setUser] = useState('');
  const [action, setAction] = useState('');
  const [page, setPage] = useState(1);

  const filtered = mockAuditLog.filter(log => {
    if (dateFrom && log.date < dateFrom) return false;
    if (dateTo && log.date > dateTo) return false;
    if (user && !log.user.toLowerCase().includes(user.toLowerCase())) return false;
    if (action && !log.action.toLowerCase().includes(action.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset to first page if filters change
  function handleFilterChange(fn: () => void) {
    fn();
    setPage(1);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Audit Log</h1>
      <div className="flex flex-wrap gap-4 items-end mb-6">
        <div>
          <label className="block text-xs font-medium mb-1">Date From</label>
          <input type="date" value={dateFrom} onChange={e => handleFilterChange(() => setDateFrom(e.target.value))} className="border rounded px-2 py-1 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Date To</label>
          <input type="date" value={dateTo} onChange={e => handleFilterChange(() => setDateTo(e.target.value))} className="border rounded px-2 py-1 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">User</label>
          <input type="text" value={user} onChange={e => handleFilterChange(() => setUser(e.target.value))} placeholder="User" className="border rounded px-2 py-1 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Action</label>
          <input type="text" value={action} onChange={e => handleFilterChange(() => setAction(e.target.value))} placeholder="Action" className="border rounded px-2 py-1 text-sm" />
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Export CSV</button>
        <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded">Export PDF</button>
      </div>
      <div className="bg-white rounded-lg border p-4">
        <div className="font-semibold mb-2">Audit Log Table</div>
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Date</th>
              <th className="p-2">User</th>
              <th className="p-2">Action</th>
              <th className="p-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(log => (
              <tr key={log.id} className="border-t">
                <td className="p-2">{log.date}</td>
                <td className="p-2">{log.user}</td>
                <td className="p-2">{log.action}</td>
                <td className="p-2">{log.details}</td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr><td colSpan={4} className="text-center text-gray-400 py-4">No data found.</td></tr>
            )}
          </tbody>
        </table>
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages || 1}
          </span>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 rounded border bg-gray-100 disabled:opacity-50"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <button
              className="px-3 py-1 rounded border bg-gray-100 disabled:opacity-50"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 