import { toast } from 'sonner';

export interface Transaction {
  id: string;
  type: 'Remittance' | 'Exchange' | 'Deposit' | 'Withdrawal';
  amount: number;
  currency: string;
  status: 'Pending' | 'Completed' | 'Failed';
  date: string;
  client: string;
  recipient?: string;
  notes?: string;
  receiptUrl?: string;
}

export interface RecentRecipient {
  id: string;
  name: string;
  phone: string;
  lastTransaction: string;
  isFavorite: boolean;
}

// Cache for exchange rates
const rateCache = new Map<string, { rate: number; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Cache for user data
const userDataCache = new Map<string, { data: any; timestamp: number }>();
const USER_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export const transactionService = {
  // Get exchange rate with caching
  async getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
    const cacheKey = `${fromCurrency}-${toCurrency}`;
    const cached = rateCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.rate;
    }

    // TODO: Replace with actual API call
    const rate = 3.69; // Mock rate
    rateCache.set(cacheKey, { rate, timestamp: Date.now() });
    return rate;
  },

  // Get user data with caching
  async getUserData(userId: string): Promise<any> {
    const cached = userDataCache.get(userId);
    
    if (cached && Date.now() - cached.timestamp < USER_CACHE_DURATION) {
      return cached.data;
    }

    // TODO: Replace with actual API call
    const userData = { /* mock user data */ };
    userDataCache.set(userId, { data: userData, timestamp: Date.now() });
    return userData;
  },

  // Get recent transactions
  async getRecentTransactions(limit: number = 10): Promise<Transaction[]> {
    // TODO: Replace with actual API call
    return [];
  },

  // Get recent recipients
  async getRecentRecipients(limit: number = 5): Promise<RecentRecipient[]> {
    // TODO: Replace with actual API call
    return [];
  },

  // Toggle favorite recipient
  async toggleFavoriteRecipient(recipientId: string): Promise<void> {
    // TODO: Replace with actual API call
    toast.success('Recipient favorite status updated');
  },

  // Send transaction notification
  async sendTransactionNotification(transaction: Transaction): Promise<void> {
    // TODO: Replace with actual API call
    if (transaction.status === 'Completed') {
      toast.success('Transaction completed successfully');
    } else if (transaction.status === 'Failed') {
      toast.error('Transaction failed');
    }
  },

  // Generate and download receipt
  async generateReceipt(transaction: Transaction): Promise<string> {
    // TODO: Replace with actual receipt generation
    return 'receipt-url';
  },

  // Track transaction status
  async trackTransactionStatus(transactionId: string): Promise<Transaction> {
    // TODO: Replace with actual API call
    return {
      id: transactionId,
      type: 'Remittance',
      amount: 0,
      currency: 'USD',
      status: 'Pending',
      date: new Date().toISOString(),
      client: '',
    };
  },
}; 