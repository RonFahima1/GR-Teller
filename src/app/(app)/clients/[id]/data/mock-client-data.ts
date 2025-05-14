import { 
  Client, 
  Transaction, 
  Document, 
  KycDocument, 
  AuditTrailEntry, 
  Note, 
  ComplianceFlag, 
  ColorOption 
} from '../types/client-profile.types';

// Mock client data
export const mockClient: Client = {
  id: 'CL1001',
  name: 'Jane Smith',
  email: 'jane.smith@email.com',
  phone: '+1 555-1234',
  status: 'active',
  kycStatus: 'approved',
  complianceFlags: [],
  limits: { 
    daily: 5000, 
    monthly: 20000, 
    usedToday: 1200, 
    usedThisMonth: 8000 
  },
  notes: ['VIP client', 'Prefers email contact'],
};

// Mock transactions
export const mockTransactions: Transaction[] = [
  { 
    id: 'TXN1001', 
    date: '2024-03-15T10:30:00', 
    type: 'remittance', 
    amount: 500, 
    currency: 'USD', 
    status: 'completed', 
    client: 'Jane Smith', 
    description: 'Send to Alex Morgan' 
  },
  { 
    id: 'TXN1002', 
    date: '2024-03-14T15:45:00', 
    type: 'remittance', 
    amount: 200, 
    currency: 'EUR', 
    status: 'pending', 
    client: 'Jane Smith', 
    description: 'Receive from Sarah Chen' 
  },
];

// Mock documents
export const mockDocuments: Document[] = [
  { id: 1, name: 'passport.pdf', status: 'approved', url: '#' },
  { id: 2, name: 'utility_bill.jpg', status: 'pending', url: '#' },
];

// Mock KYC documents
export const mockKycDocs: KycDocument[] = [
  { id: 1, name: 'passport.pdf', status: 'pending', url: '#' },
  { id: 2, name: 'utility_bill.jpg', status: 'approved', url: '#' },
];

// Mock KYC audit trail
export const mockKycAuditTrail: AuditTrailEntry[] = [
  { 
    id: 1, 
    date: '2024-03-15 11:00', 
    user: 'compliance1', 
    action: 'Approved passport.pdf', 
    comment: 'All details match.' 
  },
  { 
    id: 2, 
    date: '2024-03-15 10:50', 
    user: 'compliance1', 
    action: 'Rejected utility_bill.jpg', 
    comment: 'Address does not match client.' 
  },
];

// Mock notes
export const mockNotes: Note[] = [
  { id: 1, text: 'VIP client', created: '2024-03-15 10:00' },
  { id: 2, text: 'Prefers email contact', created: '2024-03-15 10:05' },
];

// Mock compliance flags
export const mockFlags: ComplianceFlag[] = [
  { 
    id: 1, 
    label: 'High Risk', 
    color: 'red-600', 
    comment: 'Large volume, unusual activity' 
  },
];

// Flag color options
export const flagColors: ColorOption[] = [
  { label: 'Red', value: 'red-600' },
  { label: 'Yellow', value: 'yellow-500' },
  { label: 'Blue', value: 'blue-600' },
  { label: 'Gray', value: 'gray-500' },
];
