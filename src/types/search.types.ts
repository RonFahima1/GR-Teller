export type SearchEntityType = 
  | 'client' 
  | 'transaction' 
  | 'document' 
  | 'note'
  | 'command'
  | 'help'
  | 'setting'
  | 'exchange'
  | 'suggestion';

export interface SearchResult {
  id: string;
  title: string;
  description?: string;
  type: SearchEntityType;
  icon?: string;
  url: string;
  metadata?: Record<string, any>;
  score?: number; // For relevance sorting
  timestamp?: string; // For recency sorting
}

export interface SearchCommand {
  id: string;
  title: string;
  description: string;
  keywords: string[];
  action: () => void;
  icon?: string;
}

export interface SearchFilter {
  id: string;
  label: string;
  type: 'checkbox' | 'radio' | 'date' | 'select';
  options?: Array<{ value: string; label: string }>;
  value?: any;
}

export interface SearchState {
  query: string;
  results: SearchResult[];
  filters: Record<string, any>;
  isLoading: boolean;
  error: string | null;
  recentSearches: string[];
  popularSearches: string[];
  selectedResultIndex: number;
  isOpen: boolean;
}
