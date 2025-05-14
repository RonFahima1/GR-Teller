import { useState, useEffect } from 'react';
import { Client } from '../types/client-profile.types';
import { fetchClient } from '../services/api';

/**
 * Hook to fetch and manage client profile data
 * @param clientId - The client's unique identifier
 */
export function useClientData(clientId: string) {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getClientData = async () => {
      if (!clientId) return;
      
      try {
        setLoading(true);
        const data = await fetchClient(clientId);
        setClient(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch client data'));
      } finally {
        setLoading(false);
      }
    };

    getClientData();
  }, [clientId]);

  // Function to update client data
  const updateClient = async (updates: Partial<Client>) => {
    if (!client) return;
    
    try {
      // In a real app, this would call an API to persist changes
      // For now, we just update the local state
      setClient({ ...client, ...updates });
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update client data'));
      return false;
    }
  };

  return { client, loading, error, updateClient };
}
