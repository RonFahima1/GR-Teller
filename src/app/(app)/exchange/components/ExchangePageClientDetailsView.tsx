'use client';

import React from 'react';
import { Client, Document } from '../types'; // Adjusted import path
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Banknote, UserCircle, Home, Phone, Fingerprint, FileText, ShieldAlert, CreditCard, Wifi, X, CalendarDays, LinkIcon, Building, Briefcase, Globe, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ExchangePageClientDetailsViewProps { // Renamed
  isOpen: boolean;
  onClose: () => void;
  customer: Client | null; // Renamed to customer
  // Props from original for structural similarity, may not all be used in exchange context
  onShowDocuments?: (documents: Document[]) => void;
  onShowLimits?: () => void; 
  onAddPrepaidCard?: () => void;
  onShowSimCardDetails?: (simId: string) => void;
}

const DetailRow: React.FC<{ /* ... same as original ... */ 
  icon?: React.ReactNode; 
  label: string; 
  value?: string | number | null; 
  children?: React.ReactNode;
  className?: string;
  valueClassName?: string;
}> = ({ icon, label, value, children, className, valueClassName }) => (
  <div className={cn("flex items-start py-3.5", className)}>
    {icon && <div className="mr-3 mt-0.5 text-gray-500 dark:text-gray-400 shrink-0">{icon}</div>}
    <div className="flex-grow">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{label}</p>
      <div className={cn("text-sm text-gray-800 dark:text-gray-100 font-medium", valueClassName)}>
        {children || value || 'N/A'}
      </div>
    </div>
  </div>
);

const SectionTitle: React.FC<{ title: string; className?: string }> = ({ title, className }) => (
  <h4 className={cn("text-base font-semibold text-gray-700 dark:text-gray-300 mt-6 mb-2 px-1", className)}>
    {title}
  </h4>
);

export const ExchangePageClientDetailsView: React.FC<ExchangePageClientDetailsViewProps> = ({ // Renamed
  isOpen,
  onClose,
  customer, // Renamed
  onShowDocuments,
  onShowLimits,
  onAddPrepaidCard,
  onShowSimCardDetails,
}) => {
  if (!isOpen || !customer) { // Renamed
    return null;
  }

  const formatCustomerName = (c: Client) => { // Renamed
    return [c.firstName, c.middleName, c.lastName].filter(Boolean).join(' ');
  };
  
  const customerDisplayName = customer.name || formatCustomerName(customer); // Renamed

  // Using the exact JSX structure from the original ClientDetailsView,
  // only changing variable names from 'client' to 'customer' where directly referencing the prop.
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 40 }}
            transition={{ type: 'spring', stiffness: 280, damping: 25 }}
            className="bg-gray-50 dark:bg-gray-800 shadow-2xl rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700/60 sticky top-0 bg-gray-50 dark:bg-gray-800 z-10">
              <div className="flex items-center space-x-3">
                <UserCircle className="h-7 w-7 text-blue-500 dark:text-blue-400" />
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {customerDisplayName}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Customer Profile</p> {/* Changed */}
                </div>
              </div>
              <Button variant="ghost_icon" size="sm" onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-3 sm:p-6 space-y-2 overflow-y-auto custom-scrollbar">
              <SectionTitle title="Personal Information" />
              <div className="bg-white dark:bg-gray-800/50 rounded-lg shadow-sm p-2 sm:p-4">
                <DetailRow icon={<UserCircle size={18}/>} label="First Name" value={customer.firstName} />
                {customer.middleName && <Separator className="my-0 dark:bg-gray-700/50" />}
                {customer.middleName && <DetailRow icon={<UserCircle size={18} className="opacity-0"/>} label="Middle Name" value={customer.middleName} />}
                <Separator className="my-0 dark:bg-gray-700/50" />
                <DetailRow icon={<UserCircle size={18} className="opacity-0"/>} label="Last Name" value={customer.lastName} />
                {/* ... (all other DetailRow and SectionTitle uses remain structurally identical, using 'customer.' where appropriate) ... */}
                <Separator className="my-0 dark:bg-gray-700/50" />
                <DetailRow icon={<CalendarDays size={18}/>} label="Date of Birth" value={customer.dateOfBirth} />
                <Separator className="my-0 dark:bg-gray-700/50" />
                <DetailRow icon={<UserCircle size={18} className="opacity-0"/>} label="Gender" value={customer.gender} />
                <Separator className="my-0 dark:bg-gray-700/50" />
                <DetailRow icon={<Globe size={18}/>} label="Nationality" value={customer.nationality} />
              </div>

              <SectionTitle title="Contact Details" />
              <div className="bg-white dark:bg-gray-800/50 rounded-lg shadow-sm p-2 sm:p-4">
                <DetailRow icon={<Phone size={18}/>} label="Phone Number" value={customer.phone} />
                <Separator className="my-0 dark:bg-gray-700/50" />
                <DetailRow icon={<Home size={18}/>} label="Email" value={customer.email} />
                {customer.customerCardNumber && <Separator className="my-0 dark:bg-gray-700/50" />}
                {customer.customerCardNumber && <DetailRow icon={<CreditCard size={18}/>} label="Customer Card #" value={customer.customerCardNumber} />}
              </div>
              
              <SectionTitle title="Address Information" />
              <div className="bg-white dark:bg-gray-800/50 rounded-lg shadow-sm p-2 sm:p-4">
                <DetailRow icon={<Home size={18}/>} label="Street Address" value={customer.streetAddress} />
                <Separator className="my-0 dark:bg-gray-700/50" />
                <DetailRow icon={<Home size={18} className="opacity-0"/>} label="City" value={customer.city} />
                <Separator className="my-0 dark:bg-gray-700/50" />
                <DetailRow icon={<Home size={18} className="opacity-0"/>} label="Postal Code" value={customer.postalCode} />
                <Separator className="my-0 dark:bg-gray-700/50" />
                <DetailRow icon={<Globe size={18}/>} label="Country" value={customer.country} />
              </div>

              <SectionTitle title="Identification (ID)" />
              <div className="bg-white dark:bg-gray-800/50 rounded-lg shadow-sm p-2 sm:p-4">
                <DetailRow icon={<Fingerprint size={18}/>} label="ID Type" value={customer.idType} />
                <Separator className="my-0 dark:bg-gray-700/50" />
                <DetailRow icon={<Fingerprint size={18} className="opacity-0"/>} label="ID Number" value={customer.idNumber} />
                <Separator className="my-0 dark:bg-gray-700/50" />
                <DetailRow icon={<Globe size={18}/>} label="Issuance Country" value={customer.idIssuanceCountry} />
                <Separator className="my-0 dark:bg-gray-700/50" />
                <DetailRow icon={<CalendarDays size={18}/>} label="Issue Date" value={customer.idIssueDate} />
                <Separator className="my-0 dark:bg-gray-700/50" />
                <DetailRow icon={<CalendarDays size={18}/>} label="Expiry Date" value={customer.idExpiryDate} />
              </div>
              
              {(customer.bankCode || customer.branchCode || customer.bankAccount) && (
                <>
                  <SectionTitle title="Bank Account" />
                  <div className="bg-white dark:bg-gray-800/50 rounded-lg shadow-sm p-2 sm:p-4">
                    {customer.bankCode && <DetailRow icon={<Banknote size={18}/>} label="Bank Code" value={customer.bankCode} />}
                    {customer.branchCode && <Separator className="my-0 dark:bg-gray-700/50" />}
                    {customer.branchCode && <DetailRow icon={<Banknote size={18} className="opacity-0"/>} label="Branch Code" value={customer.branchCode} />}
                    {customer.bankAccount && <Separator className="my-0 dark:bg-gray-700/50" />}
                    {customer.bankAccount && <DetailRow icon={<Banknote size={18} className="opacity-0"/>} label="Account Number" value={customer.bankAccount} />}
                    <Separator className="my-0 dark:bg-gray-700/50" />
                     <DetailRow icon={<ShieldAlert size={18}/>} label="Status">
                        <Badge 
                          variant={customer.status === 'Active' ? 'default' : 'destructive'} 
                          className={cn(
                            "px-2.5 py-0.5 text-xs font-medium",
                            customer.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-700/30 dark:text-red-300'
                          )}
                        >
                          {customer.status}
                        </Badge>
                      </DetailRow>
                  </div>
                </>
              )}
              
              {customer.accountBalances && customer.accountBalances.length > 0 && (
                <>
                  <SectionTitle title="Account Balances" />
                  <div className="bg-white dark:bg-gray-800/50 rounded-lg shadow-sm p-2 sm:p-4">
                    {(customer.accountBalances || []).map((acc, index, arr) => (
                      <React.Fragment key={index}>
                        <DetailRow 
                          icon={<Banknote size={18}/>} 
                          label={`${acc.currency} ${acc.type ? `(${acc.type})` : ''}`} 
                          value={acc.balance.toFixed(2)}
                          valueClassName="text-lg"
                        />
                        {index < arr.length - 1 && <Separator className="my-0 dark:bg-gray-700/50" />}
                      </React.Fragment>
                    ))}
                  </div>
                </>
              )}

              {(customer.employer || customer.division) && (
                <>
                  <SectionTitle title="Relationship / Employment" />
                  <div className="bg-white dark:bg-gray-800/50 rounded-lg shadow-sm p-2 sm:p-4">
                    {customer.employer && <DetailRow icon={<Briefcase size={18}/>} label="Employer" value={customer.employer} />}
                    {customer.division && <Separator className="my-0 dark:bg-gray-700/50" />}
                    {customer.division && <DetailRow icon={<Building size={18}/>} label="Division" value={customer.division} />}
                  </div>
                </>
              )}

              {(onShowDocuments || onShowLimits) && (
                <>
                  <SectionTitle title="Compliance & Products" />
                  <div className="bg-white dark:bg-gray-800/50 rounded-lg shadow-sm">
                    {onShowDocuments && (
                      <button
                        onClick={() => customer.documents && onShowDocuments(customer.documents)}
                        disabled={!customer.documents || customer.documents.length === 0}
                        className="w-full text-left px-4 sm:px-6 py-3.5 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors flex items-center justify-between rounded-t-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="flex items-center">
                          <FileText size={18} className="mr-3 text-gray-500 dark:text-gray-400" />
                          <span className="text-sm text-gray-800 dark:text-gray-100 font-medium">
                            {customer.documents && customer.documents.length > 0 ? `View ${customer.documents.length} Document(s)` : 'No Documents'}
                          </span>
                        </div>
                        {customer.documents && customer.documents.length > 0 && <ChevronRight size={18} className="text-gray-400 dark:text-gray-500" />}
                      </button>
                    )}
                    {onShowDocuments && onShowLimits && <Separator className="my-0 mx-4 sm:mx-6 dark:bg-gray-700/50" />}
                    {onShowLimits && (
                       <button
                        onClick={onShowLimits}
                        className="w-full text-left px-4 sm:px-6 py-3.5 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors flex items-center justify-between rounded-b-lg"
                      >
                        <div className="flex items-center">
                          <ShieldAlert size={18} className="mr-3 text-gray-500 dark:text-gray-400" />
                          <span className="text-sm text-gray-800 dark:text-gray-100 font-medium">Transaction Limits</span>
                        </div>
                        <ChevronRight size={18} className="text-gray-400 dark:text-gray-500" />
                      </button>
                    )}
                  </div>
                </>
              )}
              
              {customer.products && (onAddPrepaidCard || onShowSimCardDetails) && (customer.products.prepaidCards || customer.products.simCards) && (
                <>
                  <div className="bg-white dark:bg-gray-800/50 rounded-lg shadow-sm mt-4">
                    {customer.products.prepaidCards && onAddPrepaidCard && customer.products.prepaidCards.map((card, idx, arr) => (
                      <React.Fragment key={card.id}> 
                        <button
                          onClick={onAddPrepaidCard}
                          className="w-full text-left px-4 sm:px-6 py-3.5 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <div className="flex items-center">
                            <CreditCard size={18} className="mr-3 text-gray-500 dark:text-gray-400" />
                            <span className="text-sm text-gray-800 dark:text-gray-100 font-medium">Prepaid Card: ...{card.number?.slice(-4) || card.last4} ({card.status})</span>
                          </div>
                          <ChevronRight size={18} className="text-gray-400 dark:text-gray-500" />
                        </button>
                        {(idx < arr.length - 1 || (customer.products?.simCards && customer.products.simCards.length > 0 && onShowSimCardDetails)) && <Separator className="my-0 mx-4 sm:mx-6 dark:bg-gray-700/50" />} 
                      </React.Fragment>
                    ))}
                    {customer.products.simCards && onShowSimCardDetails && customer.products.simCards.map((sim, idx, arr) => (
                      <React.Fragment key={sim.id}>
                        <button
                          onClick={() => onShowSimCardDetails(sim.id)}
                          className="w-full text-left px-4 sm:px-6 py-3.5 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <div className="flex items-center">
                            <Wifi size={18} className="mr-3 text-gray-500 dark:text-gray-400" />
                            <span className="text-sm text-gray-800 dark:text-gray-100 font-medium">SIM Card: ...{sim.number.slice(-4)} ({sim.status})</span>
                          </div>
                          <ChevronRight size={18} className="text-gray-400 dark:text-gray-500" />
                        </button>
                        {idx < arr.length -1 && <Separator className="my-0 mx-4 sm:mx-6 dark:bg-gray-700/50" />}
                      </React.Fragment>
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 