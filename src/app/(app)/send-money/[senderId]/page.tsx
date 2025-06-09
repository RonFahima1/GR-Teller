import React from 'react';
import { Metadata } from 'next';
import { AppleSenderProfilePage } from '../components/apple';
import { mockDetailedClients } from '../components/apple/mockDetailedClients';

type Props = {
  params: { senderId: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Find client data
  const client = mockDetailedClients.find(client => client.id === params.senderId);
  
  return {
    title: client ? `${client.firstName} ${client.lastName} | Sender Profile` : 'Sender Profile',
  };
}

export default function SenderProfilePage({ params }: Props) {
  return <AppleSenderProfilePage senderId={params.senderId} />;
}
