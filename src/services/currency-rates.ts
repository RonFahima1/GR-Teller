import { create } from 'zustand';

export interface CurrencyRate {
  code: string;
  name: string;
  rate: number;
  change: number;
  lastUpdated: Date;
}

interface CurrencyRatesState {
  rates: CurrencyRate[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  fetchRates: () => Promise<void>;
}

const API_KEY = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY;
const BASE_CURRENCY = 'USD';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Fallback rates in case API is unavailable
const FALLBACK_RATES = {
  EUR: 0.85,
  GBP: 0.73,
  JPY: 110.0,
  AUD: 1.35,
  CAD: 1.25,
  CHF: 0.92,
  CNY: 6.45,
  INR: 74.5,
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const validateApiResponse = (data: any) => {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid API response format');
  }
  if (data.result !== 'success') {
    throw new Error(data['error-type'] || 'API request failed');
  }
  if (!data.conversion_rates || typeof data.conversion_rates !== 'object') {
    throw new Error('Missing conversion rates in API response');
  }
  return data;
};

export const useCurrencyRates = create<CurrencyRatesState>((set) => ({
  rates: [],
  loading: false,
  error: null,
  lastUpdated: null,
  fetchRates: async () => {
    let retries = 0;
    
    const attemptFetch = async (): Promise<Response> => {
      if (!API_KEY) {
        throw new Error('API key is not configured. Please set NEXT_PUBLIC_EXCHANGE_RATE_API_KEY in your environment variables.');
      }

      const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${BASE_CURRENCY}`;
      
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          cache: 'no-cache',
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API request failed: ${response.status} ${errorText}`);
        }
        
        return response;
      } catch (error) {
        if (retries < MAX_RETRIES) {
          retries++;
          await delay(RETRY_DELAY * retries);
          return attemptFetch();
        }
        throw error;
      }
    };

    try {
      set({ loading: true, error: null });
      
      let rates: CurrencyRate[];
      const currentDate = new Date();

      try {
        const response = await attemptFetch();
        const data = await response.json();
        const validatedData = validateApiResponse(data);
        
        rates = Object.entries(validatedData.conversion_rates)
          .filter(([code]) => code.length === 3) // Only include valid currency codes
          .map(([code, rate]) => ({
            code,
            name: new Intl.DisplayNames(['en'], { type: 'currency' }).of(code) || code,
            rate: rate as number,
            change: 0,
            lastUpdated: currentDate,
          }))
          .sort((a, b) => a.code.localeCompare(b.code)); // Sort alphabetically by currency code
      } catch (error) {
        console.warn('Failed to fetch live rates, using fallback data:', error);
        // Use fallback rates if API fails
        rates = Object.entries(FALLBACK_RATES)
          .map(([code, rate]) => ({
            code,
            name: new Intl.DisplayNames(['en'], { type: 'currency' }).of(code) || code,
            rate,
            change: 0,
            lastUpdated: currentDate,
          }))
          .sort((a, b) => a.code.localeCompare(b.code));
        set({ error: 'Using fallback rates - live rates unavailable' });
      }

      set({
        rates,
        loading: false,
        lastUpdated: currentDate,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch rates',
        loading: false,
      });
    }
  },
})); 