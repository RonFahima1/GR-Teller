'use client';

// Type definitions for Currency Exchange context
// Adapted from src/app/(app)/send-money/hooks/useSendMoneyForm.ts

export interface Document {
  id: string;
  documentType: string; // In original: documentType, fileName, url
  fileName: string;
  url?: string;
  status?: string; // Added for consistency if needed elsewhere
  uploadDate?: string; // Added for consistency
}

export interface AccountBalance {
  currency: string;
  balance: number;
  type?: string; // e.g., Savings, Current
}

export interface PrepaidCard {
  id: string;
  last4: string; // In original: last4
  status: string;
  // addCardLink?: string; // Specific to original, might not be needed
  number?: string; // For consistency with CustomerDetailsModal usage
}

export interface SimCard {
  id: string;
  number: string;
  status: string;
  // showDetailsLink?: string; // Specific to original, might not be needed
}

export interface ClientProducts {
  prepaidCards?: PrepaidCard[];
  simCards?: SimCard[];
}

// This Client type is central for Customer data on the Exchange page.
// It combines fields seen in SenderSelection, ClientDetailsView, and the original useSendMoneyForm.ts Client type.
export interface Client {
  id: string;
  name: string; 
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth?: string; 
  gender?: 'male' | 'female' | 'other';
  nationality?: string;
  
  phone: string;
  email?: string; 
  customerCardNumber?: string; 

  country: string; // From useSendMoneyForm
  streetAddress?: string;
  city?: string;
  postalCode?: string;
  
  idType: string; 
  idNumber: string;
  idIssuanceCountry?: string;
  idIssueDate?: string; 
  idExpiryDate?: string; 
  
  bankCode?: string;
  branchCode?: string;
  bankAccount?: string; // Kept from SenderSelection context
  
  accountBalances?: AccountBalance[];
  employer?: string;
  division?: string;
  products?: ClientProducts;
  qrCodeData?: string; 

  status?: string; // In original: status, kycVerified, riskRating - simplified to status for now
  kycVerified?: boolean; // Kept for detail view consistency
  riskRating?: string; // Kept for detail view consistency
  currency?: string; // Currency preference or default

  documents?: Document[]; 
  // relationshipToSender?: string; // Not relevant for Customer on Exchange page
  // relationshipToBeneficiary?: string; // Not relevant for Customer on Exchange page

  // For the transaction history pop-up (matches ReusableEntitySearch internal definition)
  transactionHistory?: Array<{
    id: string;
    date: string;
    type: string; 
    details: string; 
    amount: string; 
  }>;
  [key: string]: any; // Allow other properties
}

// You can add other exchange-specific types here if needed. 