import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { Printer, ArrowRight, Check, Download } from 'lucide-react';

interface ConfettiSuccessProps {
  message: string;
  description?: string;
  actionLabel?: string;
  onActionClick?: () => void;
  amount?: string;
  currency?: string;
  receiverName?: string;
  onSendAnother?: () => void;
  senderName?: string;
  transferDate?: string;
  referenceId?: string;
  fee?: string;
  totalAmount?: string;
}

export const ConfettiSuccess = ({
  message,
  description,
  actionLabel,
  onActionClick,
  amount,
  currency,
  receiverName,
  onSendAnother,
  senderName = 'Sender',
  transferDate = new Date().toLocaleDateString(),
  referenceId = Math.random().toString(36).substring(2, 10).toUpperCase(),
  fee = '5.00',
  totalAmount
}: ConfettiSuccessProps) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  // Calculate total if not provided
  const calculatedTotal = totalAmount || (amount ? (parseFloat(amount) + parseFloat(fee)).toFixed(2) : '0.00');

  // Handle print functionality
  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };

  useEffect(() => {
    // Trigger confetti after a short delay
    const timer = setTimeout(() => {
      setShowConfetti(true);

      // Fire confetti with more modest settings
      const duration = 1500; // Reduced duration
      const end = Date.now() + duration;

      const leftConfetti = () => {
        confetti({
          particleCount: 25, // Reduced particle count
          angle: 60,
          spread: 50, // Reduced spread
          origin: { x: 0.2, y: 0.5 }, // Moved origin more toward center
          colors: ['#007AFF', '#34C759', '#5AC8FA'],
          gravity: 0.8, // Increased gravity for faster fall
          scalar: 0.8 // Smaller confetti pieces
        });
      };

      const rightConfetti = () => {
        confetti({
          particleCount: 25, // Reduced particle count
          angle: 120,
          spread: 50, // Reduced spread
          origin: { x: 0.8, y: 0.5 }, // Moved origin more toward center
          colors: ['#007AFF', '#34C759', '#5AC8FA'],
          gravity: 0.8, // Increased gravity for faster fall
          scalar: 0.8 // Smaller confetti pieces
        });
      };

      // Fire confetti a few times
      leftConfetti();
      rightConfetti();

      // Set up interval for continuous confetti
      const interval = setInterval(() => {
        if (Date.now() > end) {
          return clearInterval(interval);
        }

        leftConfetti();
        rightConfetti();
      }, 250);

      return () => clearInterval(interval);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {showConfetti && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm print:bg-white print:backdrop-blur-none overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            // This ensures the modal is positioned properly in the viewport
            paddingTop: "calc(4rem + env(safe-area-inset-top))", // Space for search bar
            paddingBottom: "calc(2rem + env(safe-area-inset-bottom))", // Space at bottom
          }}
        >
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-xl mx-4 max-h-[85vh] flex flex-col print:shadow-none print:max-w-full print:mx-0"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            data-component-name="MotionComponent"
          >
            {/* Print Header - Only visible when printing */}
            <div className="hidden print:block p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Global Remit</h1>
                <p className="text-gray-500">{transferDate}</p>
              </div>
            </div>

            <motion.div
              className="p-6 text-center flex-1 apple-scroll"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              data-component-name="MotionComponent"
            >
              <motion.div
                className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 print:mb-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                transition={{ delay: 0.5, type: "spring", stiffness: 150 }}
              >
                <Check className="h-10 w-10 text-green-600" />
              </motion.div>
              
              <motion.h2
                className="text-2xl font-bold text-gray-900 mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                {message}
              </motion.h2>
              
              {description && (
                <motion.p
                  className="text-gray-600 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  {description}
                </motion.p>
              )}
              
              {/* iOS-style Transaction Receipt with scrollable area */}
              {amount && currency && (
                <motion.div 
                  className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 mb-6 border border-gray-200 dark:border-gray-700 print:border-none print:p-0 print:bg-white overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  style={{ maxHeight: 'calc(100% - 4rem)' }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Transaction Receipt</h3>
                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-2 py-1 rounded-full">Completed</span>
                  </div>
                  
                  <div className="space-y-3 apple-scroll max-h-[45vh] md:max-h-[50vh]"
                  >
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm text-gray-500 dark:text-gray-400">From</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{senderName}</span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm text-gray-500 dark:text-gray-400">To</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{receiverName}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Amount</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{currency}{amount}</span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Fee</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{currency}{fee}</span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Total</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{currency}{calculatedTotal}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Date</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{transferDate}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Reference ID</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{referenceId}</span>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="flex flex-col sm:flex-row gap-3 print:hidden"
              >
                {onSendAnother ? (
                  <Button
                    onClick={onSendAnother}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2"
                  >
                    <ArrowRight className="h-4 w-4" />
                    Send Another
                  </Button>
                ) : null}
                
                {actionLabel && onActionClick ? (
                  <Button
                    onClick={onActionClick}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-xl font-medium"
                  >
                    {actionLabel}
                  </Button>
                ) : null}
                
                <Button
                  onClick={handlePrint}
                  disabled={isPrinting}
                  className="sm:flex-none bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2"
                >
                  <Printer className="h-4 w-4" />
                  {isPrinting ? 'Printing...' : 'Print Receipt'}
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
