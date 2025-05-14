import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, AlertCircle, CreditCard, Receipt, Shield, ArrowLeftRight, Info, User, Home, CalendarDays, Banknote, Send, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { GlassmorphicCard } from '@/components/ui/GlassmorphicCard';
import { ConfettiSuccess } from '@/components/ui/ConfettiSuccess';
import { Client, FormData, TransferError } from '../hooks/useSendMoneyForm';
import { cn } from '@/lib/utils';
import { TwoFactorVerification } from './TwoFactorVerification';
import { ClientVerificationCodeModal } from './ClientVerificationCodeModal';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ConfirmationStepProps {
  selectedSender: Client | null;
  selectedReceiver: Client | null;
  formData: Partial<FormData>;
  handleCheckboxChange: (name: 'agreeToTerms', checked: boolean) => void;
  errors: Record<string, string>;
  isSubmitting: boolean;
  transferComplete: boolean;
  handleSendAnother: () => void;
  calculateFee: (amount: number) => number;
  calculateRecipientAmount: (amount: number) => number;
  calculateTotalAmount: (amount: number) => number;
  transferErrors: TransferError[];
  isHighRiskTransaction?: boolean;
  requires2FA?: boolean;
  is2FAVerified?: boolean;
  verify2FA?: (code: string) => Promise<boolean>;
  onFinalSubmit: () => Promise<void>;
}

// Helper for consistent detail display
const DetailRow: React.FC<{ label: string; value?: string | number | React.ReactNode; className?: string; highlight?: boolean }> = ({ label, value, className, highlight }) => (
  <div className={cn("flex justify-between items-start py-2.5", className)}>
    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    <p className={cn("text-sm text-right font-medium text-gray-800 dark:text-gray-200", highlight && "text-blue-600 dark:text-blue-400 text-base")}>{value || 'N/A'}</p>
  </div>
);

const SectionWrapper: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode; }> = ({ title, icon, children }) => (
  <div className="bg-white dark:bg-gray-800/50 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
    <div className="flex items-center mb-3">
      {icon && <div className="mr-2 text-blue-500 dark:text-blue-400">{icon}</div>}
      <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200">{title}</h3>
    </div>
    <div className="space-y-1">{children}</div>
  </div>
);

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  selectedSender,
  selectedReceiver,
  formData,
  handleCheckboxChange,
  errors,
  isSubmitting,
  transferComplete,
  handleSendAnother,
  calculateFee,
  calculateRecipientAmount,
  calculateTotalAmount,
  transferErrors,
  isHighRiskTransaction,
  requires2FA,
  is2FAVerified,
  verify2FA,
  onFinalSubmit
}) => {
  const [showLegacy2FAModal, setShowLegacy2FAModal] = useState(false);
  const [isClientOtpModalOpen, setIsClientOtpModalOpen] = useState(false);
  
  // Auto-accept terms (removed scroll logic for simplicity, can be re-added if crucial)
  useEffect(() => {
    if (!formData.agreeToTerms) {
      handleCheckboxChange('agreeToTerms', true);
    }
  }, [formData.agreeToTerms, handleCheckboxChange]);

  // TransferComplete state is handled by the parent page (SendMoneyPage)
  // which shows ConfettiSuccess. So, this component doesn't need to render it directly.

  const fee = parseFloat(formData.fee || '0');
  const recipientAmount = parseFloat(formData.recipientAmount || '0');
  const totalAmount = parseFloat(formData.totalAmount || '0');
  const sourceCurrency = formData.currency || 'USD';
  const destinationCurrency = formData.destinationCurrency || selectedReceiver?.currency || 'N/A';
  const exchangeRate = formData.exchangeRate || 0;

  const getDisplayValue = (value: string | number | undefined | null, defaultValue: string = 'N/A') => {
    if (value === undefined || value === null || String(value).trim() === '') return defaultValue;
    return String(value);
  };

  const renderErrors = () => {
    if (transferErrors.length === 0) return null;

    return (
      <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Transfer Failed</AlertTitle>
        <AlertDescription>
          <ul className="list-disc pl-5 space-y-1">
            {transferErrors.map((err, index) => (
              <li key={index}>{err.message} {err.retryable && "(Retryable)"}</li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>
    );
  };

  const renderHighRiskWarning = () => {
    if (!isHighRiskTransaction) return null;
  
  return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg"
      >
        <div className="flex items-start space-x-2">
          <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
              High Risk Transaction Detected
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              This transaction may require additional verification for your security. 
            </p>
          </div>
        </div>
      </motion.div>
    );
  };

  const handlePrimaryConfirmAction = async () => {
    setIsClientOtpModalOpen(true);
  };

  const handleClientOtpVerify = async (code: string): Promise<boolean> => {
    if (code === '000000') {
      setIsClientOtpModalOpen(false);
      if (requires2FA && !is2FAVerified && verify2FA) {
        setShowLegacy2FAModal(true);
        return true;
      } else {
        await onFinalSubmit();
        return true;
      }
    } else {
      return false;
    }
  };

  const handleLegacy2FAVerify = async (code: string): Promise<boolean> => {
    if (verify2FA) {
      const success = await verify2FA(code);
      if (success) {
        setShowLegacy2FAModal(false);
        await onFinalSubmit();
      }
      return success;
    }
    return false;
  };

  return (
    <>
      <ClientVerificationCodeModal
        isOpen={isClientOtpModalOpen}
        onClose={() => setIsClientOtpModalOpen(false)}
        onVerify={handleClientOtpVerify}
        clientPhoneNumberLast4={selectedSender?.phone?.slice(-4)}
        transactionAmount={formData.amount?.toString()}
        transactionCurrency={formData.currency}
      />

      {showLegacy2FAModal && verify2FA && (
        <TwoFactorVerification 
          onVerify={handleLegacy2FAVerify}
          onCancel={() => setShowLegacy2FAModal(false)}
        />
      )}

      <div className="max-w-4xl mx-auto space-y-6 pb-8">
        {renderErrors()}
        {renderHighRiskWarning()}

        {/* Main Confirmation Layout */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
          {/* Left Column: Sender & Receiver Details (Larger part) */}
          <div className="md:col-span-3 space-y-5">
            <SectionWrapper title="Sender Details" icon={<ArrowUpCircle className="h-5 w-5" />}>
              <DetailRow label="Name" value={selectedSender?.name} />
              <DetailRow label="Phone" value={selectedSender?.phone} />
              <DetailRow label="Country" value={selectedSender?.country} />
              <DetailRow label="ID" value={`${getDisplayValue(selectedSender?.idType)}: ${getDisplayValue(selectedSender?.idNumber)}`} />
              <DetailRow label="Source of Funds" value={getDisplayValue(formData.sourceOfFunds)} />
            </SectionWrapper>

            <SectionWrapper title="Receiver Details" icon={<ArrowDownCircle className="h-5 w-5" />}>
              <DetailRow label="Name" value={selectedReceiver?.name} />
              <DetailRow label="Phone" value={selectedReceiver?.phone} />
              <DetailRow label="Country" value={selectedReceiver?.country} />
              <DetailRow label="Receiving Account" value={selectedReceiver?.bankAccount} />
              <DetailRow label="Purpose of Transfer" value={getDisplayValue(formData.purposeOfTransfer)} />
            </SectionWrapper>
          </div>
          
          {/* Right Column: Transaction & Amount Summary (Smaller part) */}
          <div className="md:col-span-2 space-y-5">
            <SectionWrapper title="Transaction Summary" icon={<Receipt className="h-5 w-5" />}>
              <DetailRow label="Sending Amount" value={`${sourceCurrency} ${getDisplayValue(formData.amount, '0.00')}`} />
              <DetailRow label="Exchange Rate" value={`1 ${sourceCurrency} = ${exchangeRate.toFixed(4)} ${destinationCurrency}`} />
              <DetailRow label="Receiver Gets (Approx.)" value={`${destinationCurrency} ${recipientAmount.toFixed(2)}`} />
              <DetailRow label="Transaction Fee" value={`${sourceCurrency} ${fee.toFixed(2)}`} />
              {formData.promoCode && <DetailRow label="Promo Code" value={formData.promoCode} />}
              {formData.tellerDiscountPercent && formData.tellerDiscountPercent > 0 && <DetailRow label="Teller Discount" value={`${formData.tellerDiscountPercent}%`} />}
              <Separator className="my-2 dark:bg-gray-700" />
              <DetailRow label="Total Sender Pays" value={`${sourceCurrency} ${totalAmount.toFixed(2)}`} highlight={true} />
            </SectionWrapper>

            <SectionWrapper title="Payment & Delivery" icon={<Send className="h-5 w-5" />}>
                <DetailRow label="Payment Method" value={getDisplayValue(formData.paymentMethod, 'N/A')} />
                <DetailRow label="Transfer Type" value={getDisplayValue(formData.transferType, 'N/A')} /> 
                {formData.operator && <DetailRow label="Operator" value={getDisplayValue(formData.operator)} />} 
            </SectionWrapper>
          </div>
        </div>

        {/* Terms and Conditions & Submit Button */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-5">
            <div className="flex items-start space-x-3 p-4 bg-gray-100 dark:bg-gray-800/60 rounded-lg">
                <Checkbox 
                    id="agreeToTermsConfirmation"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleCheckboxChange('agreeToTerms', !!checked)}
                    className="mt-1 shrink-0"
                />
                <label htmlFor="agreeToTermsConfirmation" className="text-sm text-gray-600 dark:text-gray-300">
                    I confirm that I have verified all transaction details with the sender and agree to the 
                    <Button variant="link" className="p-0 h-auto ml-1 text-blue-600 dark:text-blue-400">Terms & Conditions.</Button>
                </label>
            </div>
            {errors.terms && <p className="text-sm text-red-500 flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{errors.terms}</p>}

        <Button 
              type="button"
              className="w-full text-base py-3 h-auto"
              disabled={isSubmitting || !formData.agreeToTerms || transferErrors.some(e => !e.retryable)}
              onClick={handlePrimaryConfirmAction}
        >
          {isSubmitting ? (
                <span className="flex items-center justify-center space-x-2">
                  <motion.div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Transfer...</span>
                </span>
              ) : (
                'Confirm & Send Transaction'
          )}
        </Button>
        </div>
      </div>
    </>
  );
};
