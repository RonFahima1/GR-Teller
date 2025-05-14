import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormData } from '../hooks/useSendMoneyForm';
import { AlertCircle, ArrowRightLeft, Percent, Tag, CreditCard, Landmark, Truck, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AmountEntryProps {
  formData: Partial<FormData>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: keyof FormData, value: string | number) => void;
  // These will now come directly from formData, but passed for clarity/prop contract
  calculatedFee: string; 
  calculatedRecipientAmount: string;
  calculatedTotalAmount: string;
  errors: Record<string, string>;
}

// Define options for dropdowns - these would typically come from API/config
const currencyOptions = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'CNY', label: 'CNY - Chinese Yuan' },
  { value: 'JPY', label: 'JPY - Japanese Yen' },
  { value: 'CAD', label: 'CAD - Canadian Dollar' },
  // Add more currencies as needed
];

const feePayerOptions = [
  { value: 'sender', label: 'Sender Pays Fee' },
  { value: 'beneficiary', label: 'Beneficiary Pays Fee' },
  { value: 'both', label: 'Split Fee (Sender & Beneficiary)' },
];

const paymentMethodOptions = [
  { value: 'cash', label: 'Cash', icon: Wallet },
  { value: 'upay', label: 'Upay', icon: CreditCard },
  { value: 'cashPayLater', label: 'Cash - Pay Later', icon: Wallet },
  { value: 'bankPayLater', label: 'Bank Transfer - Pay Later', icon: Landmark },
  { value: 'cashHomePickup', label: 'Cash - Home Pickup', icon: Truck },
  { value: 'clientAccount', label: 'Client Account Balance', icon: Wallet },
];

export const AmountEntry: React.FC<AmountEntryProps> = ({
  formData,
  handleInputChange,
  handleSelectChange,
  calculatedFee,
  calculatedRecipientAmount,
  calculatedTotalAmount,
  errors,
}) => {
  const sourceCurrency = formData.currency || 'USD';
  const destinationCurrency = formData.destinationCurrency || 'EUR'; // Use from formData
  const exchangeRateDisplay = formData.exchangeRate ? formData.exchangeRate.toFixed(4) : 'N/A';

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Amount & Payment</h2>

      {/* Amount & Currency Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        {/* You Send */}
        <div className="md:col-span-1">
          <Label htmlFor="amount">You Send</Label>
          <div className="flex items-center">
            <Input 
              id="amount" name="amount" type="number" value={formData.amount || ''} 
              onChange={handleInputChange} placeholder="0.00"
              className={cn("rounded-r-none", errors.amount ? 'border-red-500' : '' )} required 
            />
            <Select value={sourceCurrency} onValueChange={(value) => handleSelectChange('currency', value)}>
              <SelectTrigger className="w-[100px] rounded-l-none border-l-0"><SelectValue /></SelectTrigger>
              <SelectContent>
                {currencyOptions.map(option => (
                  <SelectItem key={option.value} value={option.value} disabled={option.value === destinationCurrency}>{option.label.split(' - ')[0]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {errors.amount && <p className="text-sm text-red-500 mt-1 flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{errors.amount}</p>}
        </div>

        {/* Exchange Rate Display (Centered for visual flow) */}
        <div className="md:col-span-1 flex flex-col items-center justify-center text-center pt-4 md:pt-0">
          {formData.amount && formData.exchangeRate && parseFloat(formData.amount) > 0 && formData.exchangeRate > 0 ? (
            <>
              <ArrowRightLeft className="h-6 w-6 text-blue-500 mb-1" />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                1 {sourceCurrency} = {exchangeRateDisplay} {destinationCurrency}
              </p>
            </>
          ) : (
            <div className="h-10"> {/* Placeholder for alignment when no rate */}
              {formData.amount && parseFloat(formData.amount) > 0 && <p className="text-xs text-gray-400">Select currencies</p> }
            </div>
          )}
        </div>
        
        {/* Receiver Gets */}
        <div className="md:col-span-1">
          <Label htmlFor="recipientAmount">Receiver Gets (Approx.)</Label>
          <div className="flex items-center">
            <Input 
              id="recipientAmount" name="recipientAmount" type="text" 
              value={calculatedRecipientAmount} // Display calculated value
              readOnly disabled
              className={cn("rounded-r-none bg-gray-100 dark:bg-gray-800", errors.recipientAmount ? 'border-red-500' : '' )} 
            />
            <Select value={destinationCurrency} onValueChange={(value) => handleSelectChange('destinationCurrency', value)}>
              <SelectTrigger className="w-[100px] rounded-l-none border-l-0"><SelectValue /></SelectTrigger>
              <SelectContent>
                {currencyOptions.map(option => (
                  <SelectItem key={option.value} value={option.value} disabled={option.value === sourceCurrency}>{option.label.split(' - ')[0]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {errors.recipientAmount && <p className="text-sm text-red-500 mt-1 flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{errors.recipientAmount}</p>}
        </div>
      </div>
      
      {/* Fee Configuration */}
      <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800/30 space-y-4">
        <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Fees & Charges</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="extraChargesPercent">Extra Charges (%)</Label>
            <div className="relative">
              <Input 
                id="extraChargesPercent" 
                name="extraChargesPercent" 
                type="number" 
                value={formData.extraChargesPercent === undefined ? '' : formData.extraChargesPercent} 
                onChange={handleInputChange} 
                placeholder="e.g., 1.5 for 1.5%"
                className="pl-7"
              />
              <Percent className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div>
            <Label htmlFor="tellerDiscountPercent">Teller Discount (%)</Label>
            <div className="relative">
              <Input 
                id="tellerDiscountPercent" 
                name="tellerDiscountPercent" 
                type="number" 
                value={formData.tellerDiscountPercent === undefined ? '' : formData.tellerDiscountPercent} 
                onChange={handleInputChange} 
                placeholder="e.g., 0.5 for 0.5%"
                className="pl-7"
              />
              <Percent className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div>
            <Label htmlFor="feePayer">Fee Payer</Label>
            <Select value={formData.feePayer || 'sender'} onValueChange={(value) => handleSelectChange('feePayer', value)}>
              <SelectTrigger id="feePayer"><SelectValue /></SelectTrigger>
              <SelectContent>
                {feePayerOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="promoCode">Promo Code</Label>
          <div className="relative">
            <Input 
              id="promoCode" name="promoCode" value={formData.promoCode || ''} onChange={handleInputChange} 
              placeholder="Enter promo code" className="pl-7"
            />
            <Tag className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
        <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Summary</h3>
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Amount to Send:</span>
            <span className="font-medium text-gray-800 dark:text-gray-200">{formData.amount || '0.00'} {sourceCurrency}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Transaction Fee:</span>
            <span className="font-medium text-gray-800 dark:text-gray-200">{calculatedFee} {sourceCurrency}</span>
          </div>
          <hr className="my-2 border-gray-200 dark:border-gray-700"/>
          <div className="flex justify-between text-base font-semibold">
            <span className="text-gray-800 dark:text-white">Total Sender Pays:</span>
            <span className="text-blue-600 dark:text-blue-400">{calculatedTotalAmount} {sourceCurrency}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Receiver Gets (approx.):</span>
            <span className="font-medium text-gray-800 dark:text-gray-200">{calculatedRecipientAmount} {destinationCurrency}</span>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div>
        <Label htmlFor="paymentMethod">Payment Method</Label>
        <Select value={formData.paymentMethod || 'cash'} onValueChange={(value) => handleSelectChange('paymentMethod', value)}>
          <SelectTrigger id="paymentMethod" className={errors.paymentMethod ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            {paymentMethodOptions.map(option => {
              const Icon = option.icon;
              return (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center">
                    <Icon className="h-4 w-4 mr-2 text-gray-500" />
                    {option.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        {errors.paymentMethod && <p className="text-sm text-red-500 mt-1 flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{errors.paymentMethod}</p>}
      </div>

      {/* Change to Return Placeholder */}
      {formData.paymentMethod === 'cash' && (
        <div className="p-3 border rounded-lg bg-yellow-50 dark:bg-yellow-800/30">
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            Note: 'Change to Return' calculation will appear here if you implement an 'Amount Tendered' field for cash payments.
          </p>
        </div>
      )}

    </div>
  );
};
