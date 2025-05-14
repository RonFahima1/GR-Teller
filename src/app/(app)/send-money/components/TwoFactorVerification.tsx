import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GlassmorphicCard } from '@/components/ui/GlassmorphicCard';

interface TwoFactorVerificationProps {
  onVerify: (code: string) => Promise<boolean>;
  onCancel: () => void;
  error?: string;
}

export const TwoFactorVerification: React.FC<TwoFactorVerificationProps> = ({
  onVerify,
  onCancel,
  error
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <GlassmorphicCard className="w-full max-w-md p-6 space-y-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-full">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Two-Factor Authentication
          </h2>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300">
          For your security, this transaction requires two-factor authentication.
          Please enter the verification code sent to your registered device.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Enter verification code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="text-center text-2xl tracking-widest"
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
                className="flex items-center space-x-2 text-red-600"
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
              className="flex-1"
              disabled={!code || isVerifying}
            >
              {isVerifying ? 'Verifying...' : 'Verify'}
            </Button>
          </div>
        </form>

        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
          Didn't receive the code?{' '}
          <button
            type="button"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            onClick={() => {
              // Implement resend logic here
              alert('New code sent!');
            }}
          >
            Resend code
          </button>
        </p>
      </GlassmorphicCard>
    </motion.div>
  );
}; 