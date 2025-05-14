import React from 'react';
import { Transaction } from '../../types/client-profile.types';

interface TransactionDetailsModalProps {
  txn: Transaction | null;
  onClose: () => void;
}

/**
 * Modal to display detailed transaction information
 */
export function TransactionDetailsModal({ txn, onClose }: TransactionDetailsModalProps) {
  if (!txn) return null;
  
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 min-w-[320px] max-w-[90vw]">
        <h2 className="text-xl font-bold mb-2">Transaction Details</h2>
        <pre className="text-xs bg-gray-100 rounded p-2 mb-4 overflow-x-auto">
          {JSON.stringify(txn, null, 2)}
        </pre>
        <button 
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded" 
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
