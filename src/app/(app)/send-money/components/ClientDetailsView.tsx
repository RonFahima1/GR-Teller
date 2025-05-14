import React from 'react';
import { Client, Document } from '../hooks/useSendMoneyForm'; // Adjust path as needed
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Banknote, UserCircle, Home, Phone, Fingerprint, FileText, ShieldAlert, CreditCard, Wifi, X, CalendarDays, LinkIcon, Building, Briefcase, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ClientDetailsViewProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
  onShowDocuments?: (documents: Document[]) => void;
  onShowLimits?: () => void; // Placeholder, actual limits might come from elsewhere
  onAddPrepaidCard?: () => void;
  onShowSimCardDetails?: (simId: string) => void;
}

const DetailRow: React.FC<{ 
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

export const ClientDetailsView: React.FC<ClientDetailsViewProps> = ({
  isOpen,
  onClose,
  client,
  onShowDocuments,
  onShowLimits,
  onAddPrepaidCard,
  onShowSimCardDetails,
}) => {
  if (!isOpen || !client) {
    return null;
  }

  // Helper to format names
  const formatClientName = (c: Client) => {
    return [c.firstName, c.middleName, c.lastName].filter(Boolean).join(' ');
  };
  
  const clientDisplayName = client.name || formatClientName(client);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60] flex items-center justify-center p-4" // Darker backdrop, more blur
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 40 }}
            transition={{ type: 'spring', stiffness: 280, damping: 25 }}
            className="bg-gray-50 dark:bg-gray-800 shadow-2xl rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden" // Adjusted max-width for a more focused view, rounded-2xl
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700/60 sticky top-0 bg-gray-50 dark:bg-gray-800 z-10">
              <div className="flex items-center space-x-3">
                <UserCircle className="h-7 w-7 text-blue-500 dark:text-blue-400" />
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {clientDisplayName}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Client Profile</p>
                </div>
              </div>
              <Button variant="ghost_icon" size="sm" onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Scrollable Content Area */}
            <div className="p-3 sm:p-6 space-y-2 overflow-y-auto flex-grow custom-scrollbar">
              
              {/* Personal Information */}
              <SectionTitle title="Personal Information" />
              <div className="bg-white dark:bg-gray-800/50 rounded-lg shadow-sm p-2 sm:p-4">
                <DetailRow icon={<UserCircle size={18}/>} label="First Name" value={client.firstName} />
                {client.middleName && <Separator className="my-0 dark:bg-gray-700/50" />}
                {client.middleName && <DetailRow icon={<UserCircle size={18} className="opacity-0"/>} label="Middle Name" value={client.middleName} />}
                <Separator className="my-0 dark:bg-gray-700/50" />
                <DetailRow icon={<UserCircle size={18} className="opacity-0"/>} label="Last Name" value={client.lastName} />
                <Separator className="my-0 dark:bg-gray-700/50" />
                <DetailRow icon={<CalendarDays size={18}/>} label="Date of Birth" value={client.dateOfBirth} />
                <Separator className="my-0 dark:bg-gray-700/50" />
                <DetailRow icon={<UserCircle size={18} className="opacity-0"/>} label="Gender" value={client.gender} />
                <Separator className="my-0 dark:bg-gray-700/50" />
                <DetailRow icon={<Globe size={18}/>} label="Nationality" value={client.nationality} />
              </div>

              {/* Contact Details */}
              <SectionTitle title="Contact Details" />
              <div className="bg-white dark:bg-gray-800/50 rounded-lg shadow-sm p-2 sm:p-4">
                <DetailRow icon={<Phone size={18}/>} label="Phone Number" value={client.phone} />
                <Separator className="my-0 dark:bg-gray-700/50" />
                <DetailRow icon={<Home size={18}/>} label="Email" value={client.email} />
                {client.customerCardNumber && <Separator className="my-0 dark:bg-gray-700/50" />}
                {client.customerCardNumber && <DetailRow icon={<CreditCard size={18}/>} label="Customer Card #" value={client.customerCardNumber} />}
              </div>
              
              {/* Address Information */}
              <SectionTitle title="Address Information" />
              <div className="bg-white dark:bg-gray-800/50 rounded-lg shadow-sm p-2 sm:p-4">
                <DetailRow icon={<Home size={18}/>} label="Street Address" value={client.streetAddress} />
                <Separator className="my-0 dark:bg-gray-700/50" />
                <DetailRow icon={<Home size={18} className="opacity-0"/>} label="City" value={client.city} />
                <Separator className="my-0 dark:bg-gray-700/50" />
                <DetailRow icon={<Home size={18} className="opacity-0"/>} label="Postal Code" value={client.postalCode} />
                <Separator className="my-0 dark:bg-gray-700/50" />
                <DetailRow icon={<Globe size={18}/>} label="Country" value={client.country} />
              </div>

              {/* Identification (ID) */}
              <SectionTitle title="Identification (ID)" />
              <div className="bg-white dark:bg-gray-800/50 rounded-lg shadow-sm p-2 sm:p-4">
                <DetailRow icon={<Fingerprint size={18}/>} label="ID Type" value={client.idType} />
                <Separator className="my-0 dark:bg-gray-700/50" />
                <DetailRow icon={<Fingerprint size={18} className="opacity-0"/>} label="ID Number" value={client.idNumber} />
                <Separator className="my-0 dark:bg-gray-700/50" />
                <DetailRow icon={<Globe size={18}/>} label="Issuance Country" value={client.idIssuanceCountry} />
                <Separator className="my-0 dark:bg-gray-700/50" />
                <DetailRow icon={<CalendarDays size={18}/>} label="Issue Date" value={client.idIssueDate} />
                <Separator className="my-0 dark:bg-gray-700/50" />
                <DetailRow icon={<CalendarDays size={18}/>} label="Expiry Date" value={client.idExpiryDate} />
              </div>
              
              {/* Bank Account Details */}
              {(client.bankCode || client.branchCode || client.bankAccount) && (
                <>
                  <SectionTitle title="Bank Account" />
                  <div className="bg-white dark:bg-gray-800/50 rounded-lg shadow-sm p-2 sm:p-4">
                    {client.bankCode && <DetailRow icon={<Banknote size={18}/>} label="Bank Code" value={client.bankCode} />}
                    {client.branchCode && <Separator className="my-0 dark:bg-gray-700/50" />}
                    {client.branchCode && <DetailRow icon={<Banknote size={18} className="opacity-0"/>} label="Branch Code" value={client.branchCode} />}
                    {client.bankAccount && <Separator className="my-0 dark:bg-gray-700/50" />}
                    {client.bankAccount && <DetailRow icon={<Banknote size={18} className="opacity-0"/>} label="Account Number" value={client.bankAccount} />}
                    <Separator className="my-0 dark:bg-gray-700/50" />
                     <DetailRow icon={<ShieldAlert size={18}/>} label="Status">
                        <Badge 
                          variant={client.status === 'Active' ? 'default' : 'destructive'} 
                          className={cn(
                            "px-2.5 py-0.5 text-xs font-medium",
                            client.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-700/30 dark:text-red-300'
                          )}
                        >
                          {client.status}
                        </Badge>
                      </DetailRow>
                  </div>
                </>
              )}
              
              {/* Account Balances */}
              {client.accountBalances && client.accountBalances.length > 0 && (
                <>
                  <SectionTitle title="Account Balances" />
                  <div className="bg-white dark:bg-gray-800/50 rounded-lg shadow-sm p-2 sm:p-4">
                    {(client.accountBalances || []).map((acc, index, arr) => (
                      <React.Fragment key={index}>
                        <DetailRow 
                          icon={<Banknote size={18}/>} 
                          label={`${acc.currency} ${acc.type ? `(${acc.type})` : ''}`} 
                          value={acc.balance.toFixed(2)}
                          valueClassName="text-lg" // Larger balance
                        />
                        {index < arr.length - 1 && <Separator className="my-0 dark:bg-gray-700/50" />}
                      </React.Fragment>
                    ))}
                  </div>
                </>
              )}

              {/* Relationship / Employment */}
              {(client.employer || client.division) && (
                <>
                  <SectionTitle title="Relationship / Employment" />
                  <div className="bg-white dark:bg-gray-800/50 rounded-lg shadow-sm p-2 sm:p-4">
                    {client.employer && <DetailRow icon={<Briefcase size={18}/>} label="Employer" value={client.employer} />}
                    {client.division && <Separator className="my-0 dark:bg-gray-700/50" />}
                    {client.division && <DetailRow icon={<Building size={18}/>} label="Division" value={client.division} />}
                  </div>
                </>
              )}

              {/* Documents & Limits */}
              <SectionTitle title="Compliance" />
              <div className="bg-white dark:bg-gray-800/50 rounded-lg shadow-sm">
                {onShowDocuments && (
                  <button
                    onClick={() => client.documents && onShowDocuments(client.documents)}
                    disabled={!client.documents || client.documents.length === 0}
                    className="w-full text-left px-4 sm:px-6 py-3.5 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors flex items-center justify-between rounded-t-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center">
                      <FileText size={18} className="mr-3 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm text-gray-800 dark:text-gray-100 font-medium">
                        {client.documents && client.documents.length > 0 ? `View ${client.documents.length} Document(s)` : 'No Documents'}
                      </span>
                    </div>
                    {client.documents && client.documents.length > 0 && <ChevronRight size={18} className="text-gray-400 dark:text-gray-500" />}
                  </button>
                )}
                <Separator className="my-0 mx-4 sm:mx-6 dark:bg-gray-700/50" />
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

              {/* Products */}
              {client.products && (client.products.prepaidCards || client.products.simCards) && (
                <>
                  <SectionTitle title="Associated Products" />
                  <div className="bg-white dark:bg-gray-800/50 rounded-lg shadow-sm">
                    {client.products.prepaidCards && client.products.prepaidCards.map((card, idx, arr) => (
                      <button 
                        key={card.id} 
                        onClick={onAddPrepaidCard && card.addCardLink ? onAddPrepaidCard : undefined} // Or specific handler if view only
                        className="w-full text-left px-4 sm:px-6 py-3.5 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!onAddPrepaidCard || !card.addCardLink}
                      >
                        <div className="flex items-center">
                          <CreditCard size={18} className="mr-3 text-gray-500 dark:text-gray-400" />
                          <div className="text-sm">
                            <span className="text-gray-800 dark:text-gray-100 font-medium">Prepaid Card: ...{card.last4}</span>
                            <Badge 
                              variant={card.status.toLowerCase() === 'active' ? 'default' : 'destructive'} 
                              className={cn(
                                "ml-2 px-1.5 py-0 text-xs",
                                card.status.toLowerCase() === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-700/30 dark:text-amber-300' // Assuming non-active is warning/amber
                              )}
                            >
                              {card.status}
                            </Badge>
                          </div>
                        </div>
                        {onAddPrepaidCard && card.addCardLink && <LinkIcon size={16} className="text-blue-500 dark:text-blue-400" />}
                      </button>
                    ))}
                    {client.products.prepaidCards && client.products.simCards && <Separator className="my-0 mx-4 sm:mx-6 dark:bg-gray-700/50" />}
                    {client.products.simCards && client.products.simCards.map(sim => (
                       <button 
                        key={sim.id} 
                        onClick={onShowSimCardDetails && sim.showDetailsLink ? () => onShowSimCardDetails(sim.id) : undefined}
                        className="w-full text-left px-4 sm:px-6 py-3.5 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!onShowSimCardDetails || !sim.showDetailsLink}
                      >
                         <div className="flex items-center">
                           <Wifi size={18} className="mr-3 text-gray-500 dark:text-gray-400" />
                           <div className="text-sm">
                            <span className="text-gray-800 dark:text-gray-100 font-medium">SIM Card: {sim.number}</span>
                            <Badge 
                              variant={sim.status.toLowerCase() === 'active' ? 'default' : 'destructive'} 
                              className={cn(
                                "ml-2 px-1.5 py-0 text-xs",
                                sim.status.toLowerCase() === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-700/30 dark:text-amber-300' // Assuming non-active is warning/amber
                              )}
                            >
                              {sim.status}
                            </Badge>
                           </div>
                         </div>
                         {onShowSimCardDetails && sim.showDetailsLink && <LinkIcon size={16} className="text-blue-500 dark:text-blue-400" />}
                       </button>
                    ))}
                  </div>
                </>
              )}
              
              {/* QR Code Data */}
              {client.qrCodeData && (
                <>
                  <SectionTitle title="QR Code Data" />
                  <div className="bg-white dark:bg-gray-800/50 rounded-lg shadow-sm p-2 sm:p-4">
                    <DetailRow icon={<Wifi size={18}/>} label="QR Data" value={client.qrCodeData} />
                    {/* Placeholder for actual QR image - this would require a library or component */}
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 pl-7">An actual QR code image could be displayed here.</p>
                  </div>
                </>
              )}
              <div className="h-4"></div> {/* Extra space at the bottom */}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Need to add ChevronRight if not already globally available or in lucide-react
// For now, assuming it might need to be defined if not imported:
const ChevronRight: React.FC<{size: number; className?: string}> = ({size, className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("lucide lucide-chevron-right", className)}><path d="m9 18 6-6-6-6"/></svg>
); 