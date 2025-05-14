import { 
  Client, 
  Transaction, 
  Document, 
  Note, 
  KycDocument, 
  ComplianceFlag, 
  AuditTrailEntry 
} from '../types/client-profile.types';
import { 
  mockTransactions, 
  mockDocuments, 
  mockNotes, 
  mockKycDocs, 
  mockFlags, 
  mockKycAuditTrail 
} from '../data/mock-client-data';

/**
 * Client API service
 * In a real application, these functions would make actual API calls
 * For now, they return mock data with simulated delays
 */

// Helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch client by ID
 */
export async function fetchClient(clientId: string): Promise<Client> {
  await delay(500);
  return {
    id: clientId || 'CL1001',
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    phone: '+1 555-1234',
    status: 'active',
    kycStatus: 'approved',
    complianceFlags: [],
    limits: { daily: 5000, monthly: 20000, usedToday: 1200, usedThisMonth: 8000 },
    notes: ['VIP client', 'Prefers email contact'],
  };
}

/**
 * Fetch client transactions
 */
export async function fetchTransactions(clientId: string): Promise<Transaction[]> {
  await delay(300);
  return mockTransactions;
}

/**
 * Fetch client documents
 */
export async function fetchDocuments(clientId: string): Promise<Document[]> {
  await delay(300);
  return mockDocuments;
}

/**
 * Upload a new document
 */
export async function uploadDocument(clientId: string, file: File): Promise<Document> {
  await delay(1000);
  return {
    id: Date.now(),
    name: file.name,
    status: 'pending',
    url: '#'
  };
}

/**
 * Delete a document
 */
export async function deleteDocument(clientId: string, documentId: number): Promise<boolean> {
  await delay(300);
  return true;
}

/**
 * Fetch client notes
 */
export async function fetchNotes(clientId: string): Promise<Note[]> {
  await delay(300);
  return mockNotes;
}

/**
 * Add a new note
 */
export async function addNote(clientId: string, text: string): Promise<Note> {
  await delay(300);
  return {
    id: Date.now(),
    text,
    created: new Date().toLocaleString()
  };
}

/**
 * Update a note
 */
export async function updateNote(clientId: string, noteId: number, text: string): Promise<Note> {
  await delay(300);
  return {
    id: noteId,
    text,
    created: new Date().toLocaleString()
  };
}

/**
 * Delete a note
 */
export async function deleteNote(clientId: string, noteId: number): Promise<boolean> {
  await delay(300);
  return true;
}

/**
 * Fetch KYC documents
 */
export async function fetchKycDocuments(clientId: string): Promise<KycDocument[]> {
  await delay(300);
  return mockKycDocs;
}

/**
 * Approve a KYC document
 */
export async function approveKycDocument(clientId: string, documentId: number): Promise<KycDocument> {
  await delay(500);
  const doc = mockKycDocs.find(d => d.id === documentId);
  if (!doc) throw new Error('Document not found');
  return { ...doc, status: 'approved' };
}

/**
 * Reject a KYC document
 */
export async function rejectKycDocument(clientId: string, documentId: number): Promise<KycDocument> {
  await delay(500);
  const doc = mockKycDocs.find(d => d.id === documentId);
  if (!doc) throw new Error('Document not found');
  return { ...doc, status: 'rejected' };
}

/**
 * Fetch compliance flags
 */
export async function fetchComplianceFlags(clientId: string): Promise<ComplianceFlag[]> {
  await delay(300);
  return mockFlags;
}

/**
 * Add a compliance flag
 */
export async function addComplianceFlag(clientId: string, flag: Omit<ComplianceFlag, 'id'>): Promise<ComplianceFlag> {
  await delay(300);
  return {
    id: Date.now(),
    ...flag
  };
}

/**
 * Update a compliance flag
 */
export async function updateComplianceFlag(clientId: string, flag: ComplianceFlag): Promise<ComplianceFlag> {
  await delay(300);
  return flag;
}

/**
 * Delete a compliance flag
 */
export async function deleteComplianceFlag(clientId: string, flagId: number): Promise<boolean> {
  await delay(300);
  return true;
}

/**
 * Fetch KYC audit trail
 */
export async function fetchKycAuditTrail(clientId: string): Promise<AuditTrailEntry[]> {
  await delay(300);
  return mockKycAuditTrail;
}

/**
 * Add KYC review comment
 */
export async function addKycReviewComment(clientId: string, comment: string): Promise<boolean> {
  await delay(300);
  return true;
}

/**
 * Bulk approve all pending KYC documents
 */
export async function bulkApproveKycDocuments(clientId: string, comment: string): Promise<boolean> {
  await delay(1000);
  return true;
}

/**
 * Bulk reject all pending KYC documents
 */
export async function bulkRejectKycDocuments(clientId: string, comment: string): Promise<boolean> {
  await delay(1000);
  return true;
}
