import { SearchEntityType, SearchResult, SearchCommand } from '@/types/search.types';

// Define the search filters interface
export interface SearchFilters {
  type?: SearchEntityType;
  dateRange?: {
    from?: string;
    to?: string;
  };
  status?: string;
  documentType?: string;
}

// Mock data interfaces for type safety
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastTransaction: string;
  lastActivity: string;
}

export interface Transaction {
  id: string;
  amount: number;
  sender: string;
  recipient: string;
  date: string;
  status: string;
}

export interface Document {
  id: string;
  name: string;
  clientId: string;
  uploadDate: string;
  type: string;
}

export interface HelpArticle {
  id: string;
  title: string;
  content: string;
}

export interface ExchangeRate {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  date: string;
}
