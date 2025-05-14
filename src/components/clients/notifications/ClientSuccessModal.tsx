import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import ConfettiEffect from './ConfettiEffect';
import ClientSummary from './ClientSummary';
import { NewClientFormData } from '../../../types/form';

interface ClientSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientData: NewClientFormData;
}

const ClientSuccessModal: React.FC<ClientSuccessModalProps> = ({
  isOpen,
  onClose,
  clientData,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <ConfettiEffect isActive={isOpen} />
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 flex items-center justify-center p-4 z-30"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-background dark:bg-background/90 rounded-xl p-6 max-w-2xl w-full mx-4"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">
                  Client Successfully Created!
                </h2>
                <button
                  onClick={onClose}
                  className="text-foreground/70 hover:text-foreground/90"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-primary-50 dark:bg-primary-900/30 p-4 rounded-lg">
                  <p className="text-sm text-primary-800 dark:text-primary-300">
                    Congratulations! The client has been successfully created and added to the system.
                  </p>
                </div>

                <ClientSummary clientData={clientData} />

                <div className="flex justify-end">
                  <button
                    onClick={onClose}
                    className="inline-flex items-center px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ClientSuccessModal;
