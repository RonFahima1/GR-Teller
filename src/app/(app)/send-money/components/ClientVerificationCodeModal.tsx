import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, MessageSquareWarning } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Assuming you have an Input component
import { cn } from '@/lib/utils';

interface ClientVerificationCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (code: string) => Promise<boolean>; // Returns true if verification is successful
  clientPhoneNumberLast4?: string; // To display last 4 digits of phone
  transactionAmount?: string; // To display transaction amount for context
  transactionCurrency?: string; // Transaction currency
}

export const ClientVerificationCodeModal: React.FC<ClientVerificationCodeModalProps> = ({
  isOpen,
  onClose,
  onVerify,
  clientPhoneNumberLast4,
  transactionAmount,
  transactionCurrency,
}) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setCode('');
      setError(null);
      setIsLoading(false);
      // Focus the input when the modal opens
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Allow only numbers
    if (value.length <= 6) {
      setCode(value);
      if (error) setError(null); // Clear error when user types
    }
  };

  const handleSubmit = async () => {
    if (code.length !== 6) {
      setError('Please enter a 6-digit code.');
      inputRef.current?.focus();
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const success = await onVerify(code);
      if (success) {
        // onClose(); // Caller will handle closing on success if needed to chain actions
      } else {
        setError('Invalid verification code. Please try again.');
        inputRef.current?.focus();
        setCode(''); // Clear code on error
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      inputRef.current?.focus();
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleModalClose = () => {
    if (!isLoading) {
      onClose();
    }
  }

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
          onClick={handleModalClose} // Close on backdrop click only if not loading
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: 'spring', stiffness: 280, damping: 25 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
              <div className='flex items-center space-x-2'>
                <ShieldCheck className="h-6 w-6 text-blue-500 dark:text-blue-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Verify Transaction
                </h3>
              </div>
              <Button variant="ghost_icon" size="sm" onClick={handleModalClose} disabled={isLoading} className="rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                For your security, a one-time code has been sent via SMS to the client's phone
                {clientPhoneNumberLast4 ? ` ending in ****${clientPhoneNumberLast4}` : ''}.
              </p>
              {transactionAmount && transactionCurrency && (
                <p className="text-center text-lg font-medium text-gray-800 dark:text-gray-100">
                  Transaction Amount: {transactionAmount} {transactionCurrency}
                </p>
              )}
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                Please enter the 6-digit code below to proceed.
              </p>
              
              <Input
                ref={inputRef}
                type="text" // Using text to handle custom formatting if needed, but enforcing numeric through pattern
                value={code}
                onChange={handleInputChange}
                placeholder="000000"
                maxLength={6}
                className={cn(
                  "text-center text-2xl tracking-[0.3em] font-mono py-3 h-auto",
                  error && "border-red-500 dark:border-red-400 focus:ring-red-500/50"
                )}
                onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSubmit()}
                disabled={isLoading}
              />

              {error && (
                <div className="flex items-center justify-center text-sm text-red-600 dark:text-red-400 p-2 bg-red-50 dark:bg-red-900/30 rounded-md">
                  <MessageSquareWarning className="h-4 w-4 mr-2 flex-shrink-0" />
                  {error}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline_primary" 
                onClick={handleModalClose} 
                className="w-full sm:w-auto" 
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit} 
                className="w-full sm:flex-1" 
                disabled={isLoading || code.length !== 6}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <motion.div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Verifying...
                  </span>
                ) : (
                  'Verify & Proceed'
                )}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 