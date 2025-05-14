import { z } from 'zod';

// Currency formatting
export const formatCurrency = (amount: number, currency: string, locale: string = 'en-US'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Number formatting
export const formatNumber = (number: number, locale: string = 'en-US'): string => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(number);
};

// Date formatting
export const formatDate = (date: Date | string, locale: string = 'en-US'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
};

// Time formatting
export const formatTime = (date: Date | string, locale: string = 'en-US'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(dateObj);
};

// Form validation schemas
export const customerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  idType: z.enum(['passport', 'national_id', 'drivers_license']),
  idNumber: z.string().min(5, 'ID number must be at least 5 characters'),
});

export const transactionSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().length(3, 'Currency must be a 3-letter code'),
  recipientId: z.string().uuid('Invalid recipient ID'),
  notes: z.string().optional(),
  type: z.enum(['Remittance', 'Exchange', 'Deposit', 'Withdrawal']),
});

export const exchangeSchema = z.object({
  fromAmount: z.number().positive('Amount must be positive'),
  fromCurrency: z.string().length(3, 'Currency must be a 3-letter code'),
  toCurrency: z.string().length(3, 'Currency must be a 3-letter code'),
  rate: z.number().positive('Rate must be positive'),
});

// Error handling
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Security headers
export const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
}; 