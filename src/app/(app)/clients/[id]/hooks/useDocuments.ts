import { useState, useEffect } from 'react';
import { Document } from '../types/client-profile.types';
import { fetchDocuments, uploadDocument, deleteDocument as apiDeleteDocument } from '../services/api';

/**
 * Hook for managing document uploads and operations
 * @param initialDocuments - Initial list of documents
 * @param clientId - The client's unique identifier
 */
export function useDocuments(initialDocuments: Document[], clientId: string) {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Fetch documents when clientId changes
  useEffect(() => {
    const getDocuments = async () => {
      if (!clientId) return;
      
      try {
        setLoading(true);
        const data = await fetchDocuments(clientId);
        setDocuments(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch documents'));
      } finally {
        setLoading(false);
      }
    };

    // Use initialDocuments if provided, otherwise fetch from API
    if (initialDocuments.length === 0) {
      getDocuments();
    }
  }, [clientId, initialDocuments.length]);

  // Add a new document
  const addDocument = async (doc: Omit<Document, 'id'> | { name: string, file: File }) => {
    if (!clientId) return null;
    
    try {
      setUploading(true);
      setError(null);
      
      let newDocument: Document;
      
      if ('file' in doc) {
        // Handle file upload
        newDocument = await uploadDocument(clientId, doc.file);
      } else {
        // Handle direct document creation (for testing/mock purposes)
        newDocument = {
          id: Date.now(),
          ...doc,
          status: doc.status || 'pending',
          url: doc.url || '#'
        };
        
        // In a real app, we would call the API here
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      setDocuments(current => [...current, newDocument]);
      return newDocument;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to upload document'));
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Delete a document
  const deleteDocument = async (id: number) => {
    if (!clientId) return false;
    
    try {
      setError(null);
      // Call API to delete the document
      await apiDeleteDocument(clientId, id);
      
      // Update local state
      setDocuments(current => current.filter(doc => doc.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete document'));
      return false;
    }
  };

  // Update document status
  const updateDocumentStatus = async (id: number, status: 'approved' | 'pending' | 'rejected') => {
    if (!clientId) return false;
    
    try {
      setError(null);
      // In a real app, this would call an API to update the status
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Update local state
      setDocuments(current => 
        current.map(doc => doc.id === id ? { ...doc, status } : doc)
      );
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update document status'));
      return false;
    }
  };

  return { 
    documents, 
    uploading, 
    loading,
    error,
    addDocument, 
    deleteDocument, 
    updateDocumentStatus 
  };
}
