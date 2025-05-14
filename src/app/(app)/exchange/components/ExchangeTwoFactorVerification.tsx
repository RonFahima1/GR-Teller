'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertCircle, Send } from 'lucide-react'; // Added Send icon for thematic relevance
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GlassmorphicCard } from '@/components/ui/GlassmorphicCard'; // Assuming this is a shared component

interface ExchangeTwoFactorVerificationProps {
  onVerify: (code: string) => Promise<boolean>;
  onCancel: () => void;
  error?: string;
  customerPhone?: string; // To display partial phone
  exchangeAmount?: string; // To display amount
  exchangeCurrency?: string; // To display currency
}

export const ExchangeTwoFactorVerification: React.FC<ExchangeTwoFactorVerificationProps> = ({
  onVerify,
  onCancel,
  error,
  customerPhone,
  exchangeAmount,
  exchangeCurrency,
}) => {
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState(error);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setVerificationError(undefined);

    try {
      const success = await onVerify(code);
      if (!success) {
        setVerificationError('Invalid verification code. Please try again.');
      }
    } catch (error) {
      setVerificationError('An error occurred during verification. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Constructing the description dynamically
  let descriptionText = 'For security reasons, this transaction requires two-factor authentication. ';
  if (customerPhone && exchangeAmount && exchangeCurrency) {
    descriptionText = `For security reasons, a one-time code has been sent via SMS to the client phone (${customerPhone}). `;
    descriptionText += `This is for a currency exchange of ${exchangeAmount} ${exchangeCurrency}. `;
  }
  descriptionText += 'Please enter the 6-digit code below to proceed.';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <GlassmorphicCard className="w-full max-w-md p-6 space-y-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-full">
            <Send className="w-6 h-6 text-blue-600" /> 
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Verified Currency Exchange
          </h2>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300">
          {descriptionText}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="000000" // Demo placeholder
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="text-center text-2xl tracking-widest font-mono"
              maxLength={6}
              pattern="[0-9]*"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
            />
            
            {verificationError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center space-x-2 text-red-600 dark:text-red-400"
              >
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{verificationError}</span>
              </motion.div>
            )}
          </div>

          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
              disabled={isVerifying}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!code || code.length !== 6 || isVerifying}
            >
              {isVerifying ? 'Verifying...' : 'Verify & Proceed'}
            </Button>
          </div>
        </form>

        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
          Didn't receive the code?{' '}
          <button
            type="button"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            onClick={() => {
              // Implement resend logic here if needed
              console.log('Resend code requested for exchange OTP');
              alert('A new code has been sent (simulated)!');
            }}
          >
            Resend code
          </button>
        </p>
      </GlassmorphicCard>
    </motion.div>
  );
}; 