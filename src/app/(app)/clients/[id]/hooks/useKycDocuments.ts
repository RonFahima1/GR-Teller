import { useState } from 'react';
import { KycDocument } from '../types/client-profile.types';

/**
 * Hook for managing KYC documents and approval workflow
 * @param initialDocuments - Initial list of KYC documents
 */
export function useKycDocuments(initialDocuments: KycDocument[]) {
  const [documents, setDocuments] = useState<KycDocument[]>(initialDocuments);
  const [reviewComment, setReviewComment] = useState('');

  // Approve a single document
  const approveDocument = (id: number) => {
    setDocuments(current => 
      current.map(doc => 
        doc.id === id ? { ...doc, status: 'approved' } : doc
      )
    );
    
    // In a real app, this would also call an API to update the document status
    // and record the action in an audit trail
  };

  // Reject a single document
  const rejectDocument = (id: number) => {
    setDocuments(current => 
      current.map(doc => 
        doc.id === id ? { ...doc, status: 'rejected' } : doc
      )
    );
    
    // In a real app, this would also call an API to update the document status
    // and record the action in an audit trail
  };

  // Approve all pending documents
  const approveAllDocuments = () => {
    if (!reviewComment.trim()) {
      alert('Please add a review comment before approving all documents');
      return;
    }
    
    setDocuments(current => 
      current.map(doc => 
        doc.status === 'pending' ? { ...doc, status: 'approved' } : doc
      )
    );
    
    // In a real app, this would also call an API to update all document statuses
    // and record the action in an audit trail
  };

  // Reject all pending documents
  const rejectAllDocuments = () => {
    if (!reviewComment.trim()) {
      alert('Please add a review comment before rejecting all documents');
      return;
    }
    
    setDocuments(current => 
      current.map(doc => 
        doc.status === 'pending' ? { ...doc, status: 'rejected' } : doc
      )
    );
    
    // In a real app, this would also call an API to update all document statuses
    // and record the action in an audit trail
  };

  return {
    documents,
    reviewComment,
    setReviewComment,
    approveDocument,
    rejectDocument,
    approveAllDocuments,
    rejectAllDocuments,
  };
}
