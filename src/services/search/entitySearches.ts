import { SearchResult, SearchEntityType } from '@/types/search.types';
import { clients, transactions, documents, helpArticles, exchangeRates } from './mockData';
import { SearchFilters } from './types';
import { filterByDateRange, calculateRelevanceScore } from './utils';

/**
 * Search for clients matching the query
 * @param normalizedQuery Normalized search query
 * @param filters Search filters
 * @param expandedTerms Array of expanded terms (synonyms, corrections)
 * @returns Array of search results
 */
export function searchClients(
  normalizedQuery: string,
  filters: SearchFilters,
  expandedTerms: string[] = []
): SearchResult[] {
  if (filters.type && filters.type !== 'client') {
    return [];
  }

  // Filter clients based on query and filters
  const matchingClients = clients.filter(client => {
    // Basic text search
    const basicMatch = 
      client.name.toLowerCase().includes(normalizedQuery) ||
      client.email.toLowerCase().includes(normalizedQuery) ||
      client.phone.toLowerCase().includes(normalizedQuery);
      
    // Check expanded terms if no basic match
    const expandedMatch = !basicMatch && expandedTerms.some(term => 
      client.name.toLowerCase().includes(term) ||
      client.email.toLowerCase().includes(term) ||
      client.phone.toLowerCase().includes(term)
    );
    
    // Date range filter
    const dateMatch = filterByDateRange(client.lastActivity, filters.dateRange);
    
    return (basicMatch || expandedMatch) && dateMatch;
  });

  // Map to search results
  return matchingClients.map(client => {
    const result: SearchResult = {
      id: client.id,
      title: client.name,
      description: `${client.email} • ${client.phone}`,
      type: 'client',
      url: `/clients/${client.id}`,
      icon: 'user',
      timestamp: client.lastActivity,
      metadata: { ...client }
    };
    
    // Calculate relevance score
    const isExpandedTerm = !client.name.toLowerCase().includes(normalizedQuery);
    result.score = calculateRelevanceScore(result, normalizedQuery, isExpandedTerm);
    
    return result;
  });
}

/**
 * Search for transactions matching the query
 * @param normalizedQuery Normalized search query
 * @param filters Search filters
 * @param expandedTerms Array of expanded terms (synonyms, corrections)
 * @returns Array of search results
 */
export function searchTransactions(
  normalizedQuery: string,
  filters: SearchFilters,
  expandedTerms: string[] = []
): SearchResult[] {
  if (filters.type && filters.type !== 'transaction') {
    return [];
  }

  // Filter transactions based on query and filters
  const matchingTransactions = transactions.filter(tx => {
    // Basic text search
    const basicMatch = 
      tx.sender.toLowerCase().includes(normalizedQuery) ||
      tx.recipient.toLowerCase().includes(normalizedQuery) ||
      tx.id.toLowerCase().includes(normalizedQuery) ||
      tx.amount.toString().includes(normalizedQuery);
      
    // Check expanded terms if no basic match
    const expandedMatch = !basicMatch && expandedTerms.some(term => 
      tx.sender.toLowerCase().includes(term) ||
      tx.recipient.toLowerCase().includes(term)
    );
    
    // Date range filter
    const dateMatch = filterByDateRange(tx.date, filters.dateRange);
    
    // Status filter
    const statusMatch = !filters.status || tx.status === filters.status;
    
    return (basicMatch || expandedMatch) && dateMatch && statusMatch;
  });

  // Map to search results
  return matchingTransactions.map(tx => {
    const result: SearchResult = {
      id: tx.id,
      title: `${tx.amount} - ${tx.sender} to ${tx.recipient}`,
      description: `Status: ${tx.status} • Date: ${tx.date}`,
      type: 'transaction',
      url: `/transactions/${tx.id}`,
      icon: 'repeat',
      timestamp: tx.date,
      metadata: { ...tx }
    };
    
    // Calculate relevance score
    const isExpandedTerm = !(
      tx.sender.toLowerCase().includes(normalizedQuery) ||
      tx.recipient.toLowerCase().includes(normalizedQuery)
    );
    result.score = calculateRelevanceScore(result, normalizedQuery, isExpandedTerm);
    
    return result;
  });
}

/**
 * Search for documents matching the query
 * @param normalizedQuery Normalized search query
 * @param filters Search filters
 * @param expandedTerms Array of expanded terms (synonyms, corrections)
 * @returns Array of search results
 */
export function searchDocuments(
  normalizedQuery: string,
  filters: SearchFilters,
  expandedTerms: string[] = []
): SearchResult[] {
  if (filters.type && filters.type !== 'document') {
    return [];
  }

  // Filter documents based on query and filters
  const matchingDocuments = documents.filter(doc => {
    // Basic text search
    const basicMatch = 
      doc.name.toLowerCase().includes(normalizedQuery) ||
      doc.id.toLowerCase().includes(normalizedQuery);
      
    // Check expanded terms if no basic match
    const expandedMatch = !basicMatch && expandedTerms.some(term => 
      doc.name.toLowerCase().includes(term)
    );
    
    // Date range filter
    const dateMatch = filterByDateRange(doc.uploadDate, filters.dateRange);
    
    // Document type filter
    const typeMatch = !filters.documentType || doc.type === filters.documentType;
    
    return (basicMatch || expandedMatch) && dateMatch && typeMatch;
  });

  // Map to search results
  return matchingDocuments.map(doc => {
    const result: SearchResult = {
      id: doc.id,
      title: doc.name,
      description: `Type: ${doc.type} • Uploaded: ${doc.uploadDate}`,
      type: 'document',
      url: `/clients/${doc.clientId}/documents/${doc.id}`,
      icon: 'file-text',
      timestamp: doc.uploadDate,
      metadata: { ...doc }
    };
    
    // Calculate relevance score
    const isExpandedTerm = !doc.name.toLowerCase().includes(normalizedQuery);
    result.score = calculateRelevanceScore(result, normalizedQuery, isExpandedTerm);
    
    return result;
  });
}

/**
 * Search for help articles matching the query
 * @param normalizedQuery Normalized search query
 * @param filters Search filters
 * @param expandedTerms Array of expanded terms (synonyms, corrections)
 * @returns Array of search results
 */
export function searchHelpArticles(
  normalizedQuery: string,
  filters: SearchFilters,
  expandedTerms: string[] = []
): SearchResult[] {
  if (filters.type && filters.type !== 'help') {
    return [];
  }

  // Filter help articles based on query and filters
  const matchingArticles = helpArticles.filter(article => {
    // Basic text search
    const basicMatch = 
      article.title.toLowerCase().includes(normalizedQuery) ||
      article.content.toLowerCase().includes(normalizedQuery);
      
    // Check expanded terms if no basic match
    const expandedMatch = !basicMatch && expandedTerms.some(term => 
      article.title.toLowerCase().includes(term) ||
      article.content.toLowerCase().includes(term)
    );
    
    return basicMatch || expandedMatch;
  });

  // Map to search results
  return matchingArticles.map(article => {
    const result: SearchResult = {
      id: article.id,
      title: article.title,
      description: article.content.substring(0, 100) + '...',
      type: 'help',
      url: `/help/articles/${article.id}`,
      icon: 'help-circle',
      metadata: { ...article }
    };
    
    // Calculate relevance score
    const isExpandedTerm = !article.title.toLowerCase().includes(normalizedQuery);
    result.score = calculateRelevanceScore(result, normalizedQuery, isExpandedTerm);
    
    return result;
  });
}

/**
 * Search for exchange rates matching the query
 * @param normalizedQuery Normalized search query
 * @param filters Search filters
 * @param expandedTerms Array of expanded terms (synonyms, corrections)
 * @returns Array of search results
 */
export function searchExchangeRates(
  normalizedQuery: string,
  filters: SearchFilters,
  expandedTerms: string[] = []
): SearchResult[] {
  if (filters.type && filters.type !== 'exchange') {
    return [];
  }

  // Filter exchange rates based on query and filters
  const matchingRates = exchangeRates.filter(rate => {
    // Basic text search
    const basicMatch = 
      rate.fromCurrency.toLowerCase().includes(normalizedQuery) ||
      rate.toCurrency.toLowerCase().includes(normalizedQuery) ||
      `${rate.fromCurrency}/${rate.toCurrency}`.toLowerCase().includes(normalizedQuery);
      
    // Check expanded terms if no basic match
    const expandedMatch = !basicMatch && expandedTerms.some(term => 
      rate.fromCurrency.toLowerCase().includes(term) ||
      rate.toCurrency.toLowerCase().includes(term)
    );
    
    // Date range filter
    const dateMatch = filterByDateRange(rate.date, filters.dateRange);
    
    return (basicMatch || expandedMatch) && dateMatch;
  });

  // Map to search results
  return matchingRates.map(rate => {
    const result: SearchResult = {
      id: rate.id,
      title: `${rate.fromCurrency}/${rate.toCurrency}`,
      description: `Rate: ${rate.rate} • Updated: ${rate.date}`,
      type: 'exchange',
      url: `/exchange-rates?from=${rate.fromCurrency}&to=${rate.toCurrency}`,
      icon: 'refresh-cw',
      timestamp: rate.date,
      metadata: { ...rate }
    };
    
    // Calculate relevance score
    const isExpandedTerm = !(
      rate.fromCurrency.toLowerCase().includes(normalizedQuery) ||
      rate.toCurrency.toLowerCase().includes(normalizedQuery)
    );
    result.score = calculateRelevanceScore(result, normalizedQuery, isExpandedTerm);
    
    return result;
  });
}
