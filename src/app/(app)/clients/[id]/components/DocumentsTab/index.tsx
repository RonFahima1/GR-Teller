import React, { useState, ChangeEvent } from 'react';
import { useParams } from 'next/navigation';
import { useDocuments } from '../../hooks/useDocuments';
import { Section } from '../Section';
import { Document } from '../../types/client-profile.types';

// Import React types to fix TypeScript errors
import type { ReactElement } from 'react';

// This is needed for TypeScript to recognize JSX elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

interface DocumentsTabProps {
  initialDocuments: Document[];
}

/**
 * Handles document management for client profile
 */
export function DocumentsTab({ initialDocuments }: DocumentsTabProps) {
  const { id } = useParams();
  const clientId = Array.isArray(id) ? id[0] : id || '';
  const { documents, uploading: isUploading, addDocument, deleteDocument } = useDocuments(initialDocuments, clientId);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Use the addDocument function from the hook
    // which handles the uploading state internally
    await addDocument({
      name: file.name,
      file: file
    });
  };

  const handleDeleteDoc = async (id: number) => {
    await deleteDocument(id);
  };

  return (
    <Section title="Documents">
      {/* The Section component requires children */}
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">Upload Document</label>
        <div className="flex items-center">
          <input 
            type="file" 
            className="block text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none" 
            onChange={handleFileUpload} 
            disabled={isUploading} 
          />
          {isUploading && <div className="ml-2 text-sm text-gray-600">Uploading...</div>}
        </div>
      </div>
      <table className="w-full text-sm">
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
                <button 
                  onClick={() => handleDeleteDoc(doc.id)} 
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {documents.length === 0 && (
            <tr>
              <td colSpan={3} className="text-center text-gray-400 py-4">
                No documents uploaded.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Section>
  );
}
