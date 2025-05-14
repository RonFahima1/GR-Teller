import { Client, Transaction, Document, HelpArticle, ExchangeRate } from './types';

// Mock data for demonstration
export const clients: Client[] = [
  { id: 'client1', name: 'John Doe', email: 'john@example.com', phone: '+1 (555) 123-4567', lastTransaction: '2025-05-01', lastActivity: '2025-05-01' },
  { id: 'client2', name: 'Jane Smith', email: 'jane@example.com', phone: '+1 (555) 987-6543', lastTransaction: '2025-05-02', lastActivity: '2025-05-02' },
  { id: 'client3', name: 'Robert Johnson', email: 'robert@example.com', phone: '+1 (555) 456-7890', lastTransaction: '2025-05-03', lastActivity: '2025-05-03' },
  { id: 'client4', name: 'Sarah Williams', email: 'sarah@example.com', phone: '+1 (555) 234-5678', lastTransaction: '2025-05-04', lastActivity: '2025-05-04' },
  { id: 'client5', name: 'Michael Brown', email: 'michael@example.com', phone: '+1 (555) 876-5432', lastTransaction: '2025-05-05', lastActivity: '2025-05-05' },
];

export const transactions: Transaction[] = [
  { id: 'tx1', amount: 1000, sender: 'John Doe', recipient: 'Jane Smith', date: '2025-05-01', status: 'completed' },
  { id: 'tx2', amount: 500, sender: 'Jane Smith', recipient: 'Robert Johnson', date: '2025-05-02', status: 'pending' },
  { id: 'tx3', amount: 750, sender: 'Robert Johnson', recipient: 'Sarah Williams', date: '2025-05-03', status: 'completed' },
  { id: 'tx4', amount: 1200, sender: 'Sarah Williams', recipient: 'Michael Brown', date: '2025-05-04', status: 'failed' },
  { id: 'tx5', amount: 300, sender: 'Michael Brown', recipient: 'John Doe', date: '2025-05-05', status: 'completed' },
];

export const documents: Document[] = [
  { id: 'doc1', name: 'Passport.pdf', clientId: 'client1', uploadDate: '2025-04-15', type: 'identification' },
  { id: 'doc2', name: 'ID Card.jpg', clientId: 'client2', uploadDate: '2025-04-20', type: 'identification' },
  { id: 'doc3', name: 'Proof of Address.pdf', clientId: 'client3', uploadDate: '2025-04-25', type: 'address' },
  { id: 'doc4', name: 'Bank Statement.pdf', clientId: 'client4', uploadDate: '2025-04-30', type: 'financial' },
  { id: 'doc5', name: 'Employment Verification.pdf', clientId: 'client5', uploadDate: '2025-05-05', type: 'employment' },
];

export const helpArticles: HelpArticle[] = [
  { id: 'help1', title: 'How to send money', content: 'Step-by-step guide to sending money through the Global Remit Teller system...' },
  { id: 'help2', title: 'Reset your password', content: 'Instructions for resetting your password if you have forgotten it...' },
  { id: 'help3', title: 'Understanding KYC requirements', content: 'Explanation of Know Your Customer (KYC) requirements and how to comply...' },
  { id: 'help4', title: 'Transaction limits', content: 'Information about transaction limits for different types of transfers...' },
  { id: 'help5', title: 'Exchange rates explained', content: 'How exchange rates work and how they affect international transfers...' },
];

export const exchangeRates: ExchangeRate[] = [
  { id: 'rate1', fromCurrency: 'USD', toCurrency: 'EUR', rate: 0.85, date: '2025-05-09' },
  { id: 'rate2', fromCurrency: 'USD', toCurrency: 'GBP', rate: 0.75, date: '2025-05-09' },
  { id: 'rate3', fromCurrency: 'USD', toCurrency: 'JPY', rate: 110.25, date: '2025-05-09' },
  { id: 'rate4', fromCurrency: 'USD', toCurrency: 'CAD', rate: 1.25, date: '2025-05-09' },
  { id: 'rate5', fromCurrency: 'USD', toCurrency: 'AUD', rate: 1.35, date: '2025-05-09' },
];
