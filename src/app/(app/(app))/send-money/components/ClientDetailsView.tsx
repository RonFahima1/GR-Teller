import React from 'react';
import { Client, Document } from '../hooks/useSendMoneyForm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Banknote, UserCircle, Home, Phone, Fingerprint, FileText, CreditCard, Wifi, X } from 'lucide-react'; // Added X for close
import { motion, AnimatePresence } from 'framer-motion'; // Added for animations

interface ClientDetailsViewProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
  onShowDocuments?: (documents: Document[]) => void;
  onShowSimCardDetails?: (simId: string) => void;
}

const DetailItem: React.FC<{ label: string; value?: string | number | null; children?: React.ReactNode }> = ({ label, value, children }) => (
  <div className="flex justify-between items-center">
    <span className="font-medium">{label}</span>
    <span className="text-gray-800 dark:text-gray-200">{value}</span>
  </div>
);

export const ClientDetailsView: React.FC<ClientDetailsViewProps> = ({
  isOpen,
  onClose,
  client,
  onShowDocuments,
  onShowSimCardDetails,
}) => {
  // Early return if not open or no client
  if (!isOpen || !client) return null;

  const SectionCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
      {title}
    </h3>
    <div className="flex items-center space-x-2">
      {icon}
    </div>
  </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
 