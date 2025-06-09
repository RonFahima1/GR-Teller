import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Client } from '../../hooks/useSendMoneyForm';
import { FormInput } from './receiver-form/FormInput';
import { FormSelect } from './receiver-form/FormSelect';
import { cn } from '@/lib/utils';

interface AppleReceiverFormProps {
  selectedSender: Client | null;
  initialValues?: Partial<Client>;
  onBack: () => void;
  onSubmit: (formData: Partial<Client>) => void;
  isEditMode?: boolean;
}

export function AppleReceiverForm({
  selectedSender,
  initialValues = {},
  onBack,
  onSubmit,
  isEditMode = false
}: AppleReceiverFormProps) {
  const [formData, setFormData] = useState<Partial<Client>>({
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    relationship: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    ...initialValues
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field if exists
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!formData.firstName?.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName?.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.phone?.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.country?.trim()) newErrors.country = 'Country is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      // Simulate API call delay
      setTimeout(() => {
        onSubmit(formData);
        setIsSubmitting(false);
      }, 500);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-white dark:bg-[#1C1C1E] border-b border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <motion.button
              onClick={onBack}
              className="mr-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </motion.button>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {isEditMode ? 'Edit Receiver' : 'Add New Receiver'}
            </h1>
          </div>
        </div>
      </header>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="flex-1 bg-[#F2F2F7] dark:bg-[#0d0d0e] overflow-auto p-4">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Selected sender info - if available */}
          {selectedSender && (
            <div className="bg-white dark:bg-[#2C2C2E] rounded-lg p-4 shadow-sm border border-gray-100 dark:border-[#3A3A3C]">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Adding receiver for:</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {selectedSender.firstName} {selectedSender.lastName}
              </p>
            </div>
          )}
          
          {/* Personal Information */}
          <div className="bg-white dark:bg-[#2C2C2E] rounded-lg shadow-sm p-4 border border-gray-100 dark:border-[#3A3A3C]">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="First Name*"
                value={formData.firstName || ''}
                onChange={(value) => handleChange('firstName', value)}
                error={errors.firstName}
              />
              
              <FormInput
                label="Middle Name"
                value={formData.middleName || ''}
                onChange={(value) => handleChange('middleName', value)}
              />
              
              <FormInput
                label="Last Name*"
                value={formData.lastName || ''}
                onChange={(value) => handleChange('lastName', value)}
                error={errors.lastName}
              />
              
              <FormInput
                label="Date of Birth"
                value={formData.dateOfBirth || ''}
                onChange={(value) => handleChange('dateOfBirth', value)}
                type="date"
              />
              
              <FormSelect
                label="Gender"
                value={formData.gender || ''}
                onChange={(value) => handleChange('gender', value)}
                options={[
                  { value: '', label: 'Select...' },
                  { value: 'Male', label: 'Male' },
                  { value: 'Female', label: 'Female' },
                  { value: 'Other', label: 'Other' }
                ]}
              />
              
              <FormSelect
                label="Relationship to Sender"
                value={formData.relationship || ''}
                onChange={(value) => handleChange('relationship', value)}
                options={[
                  { value: '', label: 'Select...' },
                  { value: 'Family', label: 'Family' },
                  { value: 'Friend', label: 'Friend' },
                  { value: 'Business', label: 'Business' },
                  { value: 'Other', label: 'Other' }
                ]}
              />
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="bg-white dark:bg-[#2C2C2E] rounded-lg shadow-sm p-4 border border-gray-100 dark:border-[#3A3A3C]">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Phone Number*"
                value={formData.phone || ''}
                onChange={(value) => handleChange('phone', value)}
                error={errors.phone}
              />
              
              <FormInput
                label="Email"
                value={formData.email || ''}
                onChange={(value) => handleChange('email', value)}
                type="email"
              />
              
              <FormInput
                label="Street Address"
                value={formData.address || ''}
                onChange={(value) => handleChange('address', value)}
              />
              
              <FormInput
                label="City"
                value={formData.city || ''}
                onChange={(value) => handleChange('city', value)}
              />
              
              <FormInput
                label="Postal Code"
                value={formData.postalCode || ''}
                onChange={(value) => handleChange('postalCode', value)}
              />
              
              <FormInput
                label="Country*"
                value={formData.country || ''}
                onChange={(value) => handleChange('country', value)}
                error={errors.country}
              />
            </div>
          </div>
        </div>
      </form>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#1C1C1E] border-t border-gray-200 dark:border-gray-800 p-4">
        <div className="flex justify-between items-center max-w-3xl mx-auto">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="px-6 border-gray-200 dark:border-gray-700"
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 bg-[#007AFF] hover:bg-[#0062CC] dark:bg-[#0A84FF] dark:hover:bg-[#409CFF]"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                {isEditMode ? 'Updating...' : 'Creating...'}
              </div>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {isEditMode ? 'Update Receiver' : 'Save Receiver'}
              </>
            )}
          </Button>
        </div>
      </footer>
    </div>
  );
}
