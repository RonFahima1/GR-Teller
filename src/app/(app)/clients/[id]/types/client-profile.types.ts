// Define types for client profile data

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'suspended';
  kycStatus: 'pending' | 'approved' | 'rejected';
  complianceFlags: string[];
  limits: {
    daily: number;
    monthly: number;
    usedToday: number;
    usedThisMonth: number;
  };
  notes: string[];
}

export interface Transaction {
  id: string;
  date: string;
  type: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  client: string;
  description: string;
}

export interface Document {
  id: number;
  name: string;
  status: 'approved' | 'pending' | 'rejected';
  url: string;
}

export interface Note {
  id: number;
  text: string;
  created: string;
}

export interface KycDocument extends Document {
  // Additional KYC-specific fields can be added here
}

export interface ComplianceFlag {
  id: number;
  label: string;
  color: string;
  comment: string;
}

export interface AuditTrailEntry {
  id: number;
  date: string;
  user: string;
  action: string;
  comment: string;
}

export interface ColorOption {
  label: string;
  value: string;
}
