'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useClientData } from './hooks/useClientData';
import { ClientHeader } from './components/ClientHeader';
import { TabNavigation } from './components/TabNavigation';
import { TransactionsTab } from './components/TransactionsTab';
import { DocumentsTab } from './components/DocumentsTab';
import { LimitsTab } from './components/LimitsTab';
import { NotesTab } from './components/NotesTab';
import { KycTab } from './components/KycTab';
import { 
  fetchTransactions,
  fetchDocuments,
  fetchNotes,
  fetchKycDocuments,
  fetchComplianceFlags,
  fetchKycAuditTrail
} from './services/api';
import { Transaction, Document, Note, KycDocument, ComplianceFlag, AuditTrailEntry } from './types/client-profile.types';
import TransactionTable from '@/components/transactions/TransactionTable';
import { useCurrentUser } from '@/context/CurrentUserContext';
import { canApproveKYC, canEditComplianceFlags } from '@/utils/permissions';

const mockClient = {
  id: 'CL1001',
  name: 'Jane Smith',
  email: 'jane.smith@email.com',
  phone: '+1 555-1234',
  status: 'active',
  kycStatus: 'approved',
  complianceFlags: [],
  limits: { daily: 5000, monthly: 20000, usedToday: 1200, usedThisMonth: 8000 },
  notes: ['VIP client', 'Prefers email contact'],
};

const mockTransactions = [
  { id: 'TXN1001', date: '2024-03-15T10:30:00', type: 'remittance', amount: 500, currency: 'USD', status: 'completed', client: 'Jane Smith', description: 'Send to Alex Morgan' },
  { id: 'TXN1002', date: '2024-03-14T15:45:00', type: 'remittance', amount: 200, currency: 'EUR', status: 'pending', client: 'Jane Smith', description: 'Receive from Sarah Chen' },
];

const mockDocuments = [
  { id: 1, name: 'passport.pdf', status: 'approved', url: '#' },
  { id: 2, name: 'utility_bill.jpg', status: 'pending', url: '#' },
];

const mockKycDocs = [
  { id: 1, name: 'passport.pdf', status: 'pending', url: '#' },
  { id: 2, name: 'utility_bill.jpg', status: 'approved', url: '#' },
];

const mockKycAuditTrail = [
  { id: 1, date: '2024-03-15 11:00', user: 'compliance1', action: 'Approved passport.pdf', comment: 'All details match.' },
  { id: 2, date: '2024-03-15 10:50', user: 'compliance1', action: 'Rejected utility_bill.jpg', comment: 'Address does not match client.' },
];

const flagColors = [
  { label: 'Red', value: 'red-600' },
  { label: 'Yellow', value: 'yellow-500' },
  { label: 'Blue', value: 'blue-600' },
  { label: 'Gray', value: 'gray-500' },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <div className="bg-white rounded-lg border p-4">{children}</div>
    </div>
  );
}

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

export default function ClientProfilePage() {
  const { id } = useParams();
  const clientId = Array.isArray(id) ? id[0] : id || '';
  const { client, loading: clientLoading } = useClientData(clientId);
  const [activeTab, setActiveTab] = useState('transactions');
  
  // State for tab data
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [kycDocs, setKycDocs] = useState<KycDocument[]>([]);
  const [flags, setFlags] = useState<ComplianceFlag[]>([]);
  const [auditTrail, setAuditTrail] = useState<AuditTrailEntry[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Fetch data based on active tab
  useEffect(() => {
    if (!clientId) return;
    
    const fetchTabData = async () => {
      setLoading(true);
      try {
        switch (activeTab) {
          case 'transactions':
            const txnData = await fetchTransactions(clientId);
            setTransactions(txnData);
            break;
          case 'documents':
            const docData = await fetchDocuments(clientId);
            setDocuments(docData);
            break;
          case 'notes':
            const noteData = await fetchNotes(clientId);
            setNotes(noteData);
            break;
          case 'kyc':
            const [kycData, flagData, auditData] = await Promise.all([
              fetchKycDocuments(clientId),
              fetchComplianceFlags(clientId),
              fetchKycAuditTrail(clientId)
            ]);
            setKycDocs(kycData);
            setFlags(flagData);
            setAuditTrail(auditData);
            break;
        }
      } catch (error) {
        console.error(`Error fetching ${activeTab} data:`, error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTabData();
  }, [clientId, activeTab]);

  // All state management and handlers are now moved to custom hooks
  return (
    <div className="container mx-auto px-4 py-8">
      {client && <ClientHeader client={client} />}
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      {loading ? (
        <div className="p-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading {activeTab}...</p>
        </div>
      ) : (
        <>
          {activeTab === 'transactions' && (
            <TransactionsTab initialTransactions={transactions} clientId={clientId} />
          )}
          {activeTab === 'documents' && (
            <DocumentsTab initialDocuments={documents} clientId={clientId} />
          )}
          {activeTab === 'limits' && (
            <LimitsTab clientLimits={client?.limits} clientId={clientId} />
          )}
          {activeTab === 'notes' && (
            <NotesTab initialNotes={notes} clientId={clientId} />
          )}
          {activeTab === 'kyc' && (
            <KycTab 
              initialKycDocs={kycDocs} 
              initialFlags={flags} 
              initialAuditTrail={auditTrail}
              clientId={clientId}
            />
          )}
        </>
      )}
    </div>
  );
} 