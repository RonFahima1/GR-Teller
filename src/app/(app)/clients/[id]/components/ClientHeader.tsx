import React from 'react';
import { Client } from '../types/client-profile.types';

interface ClientHeaderProps {
  client: Client;
}

/**
 * Header component showing client information and action buttons
 */
export function ClientHeader({ client }: ClientHeaderProps) {
  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold mb-1">{client.name}</h1>
        <div className="text-gray-600 text-sm">{client.email} · {client.phone}</div>
        <div className="mt-1 text-xs">
          <span className="inline-block px-2 py-0.5 rounded bg-green-100 text-green-700 mr-2">
            {client.status}
          </span>
          <span className="inline-block px-2 py-0.5 rounded bg-blue-100 text-blue-700">
            KYC: {client.kycStatus}
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="px-4 py-2 rounded bg-blue-600 text-white">Edit</button>
        <button className="px-4 py-2 rounded bg-gray-200 text-gray-800">Block</button>
      </div>
    </div>
  );
}
