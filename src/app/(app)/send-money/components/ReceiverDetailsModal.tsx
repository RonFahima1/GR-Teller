import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserCircle, Phone, Home, CalendarDays, Link as LinkIconLucide, Globe, Users, Landmark } from 'lucide-react'; // Added Users, Landmark
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Receiver } from '@/types/receiver'; // Import the new Receiver interface
import { cn } from '@/lib/utils';

interface ReceiverDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiver: Receiver | null;
}

// Using a similar DetailRow and SectionTitle as in ClientDetailsView for consistency
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
  <h4 className={cn("text-base font-semibold text-gray-700 dark:text-gray-300 mt-5 mb-1.5 px-1", className)}>
    {title}
  </h4>
);

export const ReceiverDetailsModal: React.FC<ReceiverDetailsModalProps> = ({
  isOpen,
  onClose,
  receiver,
}) => {
  if (!isOpen || !receiver) {
    return null;
  }

  const receiverDisplayName = [receiver.firstName, receiver.middleName, receiver.lastName].filter(Boolean).join(' ');

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 40 }}
            transition={{ type: 'spring', stiffness: 280, damping: 25 }}
            className="bg-gray-50 dark:bg-gray-800 shadow-2xl rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden" // Adjusted max-width
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700/60 sticky top-0 bg-gray-50 dark:bg-gray-800 z-10">
              <div className="flex items-center space-x-3">
                <UserCircle className="h-7 w-7 text-purple-500 dark:text-purple-400" /> 
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {receiverDisplayName}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Receiver Profile</p>
                </div>
              </div>
              <Button variant="ghost_icon" size="sm" onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Scrollable Content Area */}
            <div className="p-3 sm:p-6 space-y-1 overflow-y-auto flex-grow custom-scrollbar">
              
              <SectionTitle title="Personal Information" />
              <div className="bg-white dark:bg-gray-800/50 rounded-lg shadow-sm p-2 sm:p-4">
                <DetailRow icon={<UserCircle size={18}/>} label="First Name" value={receiver.firstName} />
                {receiver.middleName && <Separator className="my-0 dark:bg-gray-700/50" />}
                {receiver.middleName && <DetailRow icon={<UserCircle size={18} className="opacity-0"/>} label="Middle Name" value={receiver.middleName} />}
                <Separator className="my-0 dark:bg-gray-700/50" />
                <DetailRow icon={<UserCircle size={18} className="opacity-0"/>} label="Last Name" value={receiver.lastName} />
                {receiver.dateOfBirth && <Separator className="my-0 dark:bg-gray-700/50" />}
                {receiver.dateOfBirth && <DetailRow icon={<CalendarDays size={18}/>} label="Date of Birth" value={receiver.dateOfBirth} />}
                {receiver.gender && <Separator className="my-0 dark:bg-gray-700/50" />}
                {receiver.gender && <DetailRow icon={<UserCircle size={18} className="opacity-0"/>} label="Gender" value={receiver.gender} />}
                <Separator className="my-0 dark:bg-gray-700/50" />
                 <DetailRow icon={<Globe size={18}/>} label="Country" value={receiver.country} />
              </div>

              <SectionTitle title="Contact & Location" />
              <div className="bg-white dark:bg-gray-800/50 rounded-lg shadow-sm p-2 sm:p-4">
                <DetailRow icon={<Phone size={18}/>} label="Phone Number" value={receiver.phone} />
                {receiver.email && <Separator className="my-0 dark:bg-gray-700/50" />}
                {receiver.email && <DetailRow icon={<Home size={18}/>} label="Email" value={receiver.email} />}
                {receiver.streetAddress && <Separator className="my-0 dark:bg-gray-700/50" />}
                {receiver.streetAddress && <DetailRow icon={<Home size={18} className="opacity-0"/>} label="Street Address" value={receiver.streetAddress} />}
                {receiver.city && <Separator className="my-0 dark:bg-gray-700/50" />}
                {receiver.city && <DetailRow icon={<Home size={18} className="opacity-0"/>} label="City" value={receiver.city} />}
                {receiver.postalCode && <Separator className="my-0 dark:bg-gray-700/50" />}
                {receiver.postalCode && <DetailRow icon={<Home size={18} className="opacity-0"/>} label="Postal Code" value={receiver.postalCode} />}
              </div>

              {receiver.relationshipToSender && (
                <>
                  <SectionTitle title="Relationship" />
                  <div className="bg-white dark:bg-gray-800/50 rounded-lg shadow-sm p-2 sm:p-4">
                    <DetailRow icon={<Users size={18}/>} label="Relationship to Sender" value={receiver.relationshipToSender} />
                  </div>
                </>
              )}
              
              {/* Optional Banking Info Section - Add if these fields are in your Receiver type and populated */}
              {(receiver.bankName || receiver.bankAccountNumber) && (
                <>
                  <SectionTitle title="Banking Details (Optional)" />
                  <div className="bg-white dark:bg-gray-800/50 rounded-lg shadow-sm p-2 sm:p-4">
                    {receiver.bankName && <DetailRow icon={<Landmark size={18}/>} label="Bank Name" value={receiver.bankName} />}
                    {receiver.bankAccountNumber && <Separator className="my-0 dark:bg-gray-700/50" />}
                    {receiver.bankAccountNumber && <DetailRow icon={<Landmark size={18} className="opacity-0"/>} label="Account Number" value={receiver.bankAccountNumber} />}
                    {/* Add Swift, Branch etc. if available */}
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