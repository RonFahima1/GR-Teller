import { remittanceApi } from '@/services/api/remittance';
import { TransactionPayload } from '@/types/api/remittance';

// Basic API error handler
const handleApiError = (error: any) => {
  // TODO: Implement more sophisticated error handling
  // - Log errors to a reporting service
  // - Show user-friendly error messages
  // - Handle specific error codes (e.g., 401 for unauthorized)
  console.error("API Error:", error);
  if (error.response && error.response.data && error.response.data.message) {
    throw new Error(error.response.data.message);
  } else if (error.message) {
    throw new Error(error.message);
  }
  throw new Error('An unexpected error occurred.');
};

export const useRemittance = () => {
  const createTransaction = async (data: TransactionPayload) => {
    try {
      const response = await remittanceApi.createTransaction(data);
      return response.data; // Assuming the API returns data in response.data
    } catch (error) {
      handleApiError(error);
    }
  };

  const validateTransaction = async (
    transactionId: string,
    agentId: string,
    operatorId: string,
    organizationId: string,
    fields: any[]
  ) => {
    try {
      const response = await remittanceApi.validateTransaction(
        transactionId,
        agentId,
        operatorId,
        organizationId,
        fields
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  };

  const confirmTransaction = async (data: any) => {
    try {
      const response = await remittanceApi.confirmTransaction(data);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  };
  
  // TODO: Add other API methods for sender, recipient, exchange, etc.

  return {
    createTransaction,
    validateTransaction,
    confirmTransaction,
    // ... other methods when added
  };
}; 