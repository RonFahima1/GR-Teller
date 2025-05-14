import React from 'react';
import { AuditTrailEntry } from '../../types/client-profile.types';

interface AuditTrailProps {
  entries: AuditTrailEntry[];
}

/**
 * Component to display the KYC/Compliance audit trail
 */
export function AuditTrail({ entries }: AuditTrailProps) {
  return (
    <>
      <div className="mb-2 font-semibold">KYC/Compliance Audit Trail</div>
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Date</th>
            <th className="p-2">User</th>
            <th className="p-2">Action</th>
            <th className="p-2">Comment</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(entry => (
            <tr key={entry.id} className="border-t">
              <td className="p-2">{entry.date}</td>
              <td className="p-2">{entry.user}</td>
              <td className="p-2">{entry.action}</td>
              <td className="p-2">{entry.comment}</td>
            </tr>
          ))}
          {entries.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center text-gray-400 py-4">
                No audit trail entries.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}
