export interface TransactionPayload {
  amount: string;
  amountDest?: string;
  amountSenderToPay: string;
  senderId: string;
  recipientId: string;
  reverse: boolean;
  sendCurrency: string;
  receiveCurrency: string;
  msisdn?: string;
  email?: string;
  fundingSource: string;
  payoutType: string;
  pickupCode?: string;
  pickupCorrespondentCode?: string;
  cashPickupName?: string;
  organizationId: string;
  operatorToUseId: string;
  depositingAgentId: string;
  sourceOfFunds: string;
  purposeOfTransfer: string;
  relationship?: string;
  // ... other fields from the existing API
} 