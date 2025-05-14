import React from 'react';
import { KycDocument } from '../../types/client-profile.types';

interface KycDocumentsProps {
  documents: KycDocument[];
  canApprove: boolean;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}

/**
 * Component for displaying KYC documents with approval actions
 */
export function KycDocuments({ documents, canApprove, onApprove, onReject }: KycDocumentsProps) {
  return (
    <>
      <div className="mb-4 font-semibold">KYC Documents</div>
      <table className="w-full text-sm mb-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map(doc => (
            <tr key={doc.id} className="border-t">
              <td className="p-2">{doc.name}</td>
              <td className="p-2 capitalize">{doc.status}</td>
              <td className="p-2 flex gap-2">
                <a href={doc.url} download className="text-blue-600 hover:underline">Download</a>
                {doc.status === 'pending' && canApprove && (
                  <>
                    <button 
                      onClick={() => onApprove(doc.id)} 
                      className="text-green-600 hover:underline"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => onReject(doc.id)} 
                      className="text-red-600 hover:underline"
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {documents.length === 0 && (
            <tr>
              <td colSpan={3} className="text-center text-gray-400 py-4">
                No KYC documents uploaded.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}
