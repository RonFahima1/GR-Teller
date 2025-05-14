import apiClient from '@/lib/api/client';
import { API_CONFIG } from '@/lib/api/config';
import { TransactionPayload } from '@/types/api/remittance'; // Assuming types are in @/types

export const remittanceApi = {
  createTransaction: (data: TransactionPayload) => 
    apiClient.post(API_CONFIG.ENDPOINTS.transaction.create, data),
  
  validateTransaction: (
    transactionId: string,
    agentId: string,
    operatorId: string,
    organizationId: string,
    fields: any[] // Keep as any[] as per the user's definition
  ) => apiClient.post(API_CONFIG.ENDPOINTS.transaction.validate, {
    transactionId,
    agentId,
    operatorId,
    organizationId,
    fields
  }),

  confirmTransaction: (data: any) => // Keep as any as per the user's definition
    apiClient.post(API_CONFIG.ENDPOINTS.transaction.confirm, data)
}; 