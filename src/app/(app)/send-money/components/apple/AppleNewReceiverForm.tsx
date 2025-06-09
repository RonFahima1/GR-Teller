import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, X } from 'lucide-react';
import { Client } from '../../hooks/useSendMoneyForm';

interface AppleNewReceiverFormProps {
  selectedSender: Client | null;
  onBack: () => void;
  onSave: (receiver: Partial<Client>) => void;
  onCancel: () => void;
}

export function AppleNewReceiverForm({
  selectedSender,
  onBack,
  onSave,
  onCancel
}: AppleNewReceiverFormProps) {
  const [formData, setFormData] = useState<Partial<Client>>({
    firstName: '',
    lastName: '',
    middleName: '',
    phone: '',
    email: '',
    country: '',
    dateOfBirth: '',
    gender: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form before submission
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName?.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName?.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    // Email validation (optional field)
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate API call delay
      setTimeout(() => {
        onSave({
          ...formData,
          id: `new-${Date.now()}`, // Generate temporary ID
        });
        setIsSubmitting(false);
      }, 500);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-black">
      {/* iOS-style header */}
      <header className="bg-white dark:bg-[#1C1C1E] border-b border-gray-100 dark:border-gray-800 p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={onCancel}
            className="text-[#007AFF] dark:text-[#0A84FF] hover:opacity-80 focus:outline-none"
          >
            <div className="flex items-center">
              <X className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Cancel</span>
            </div>
          </button>

          <h1 className="text-base font-medium text-gray-900 dark:text-white absolute left-1/2 transform -translate-x-1/2">
            New Receiver
          </h1>
          
          <div className="opacity-0">
            {/* Empty div for flex spacing */}
            <X className="h-4 w-4" />
          </div>
        </div>
      </header>

      {/* Form content */}
      <div className="flex-1 overflow-auto p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white dark:bg-[#1C1C1E] rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Personal Information</h3>
            </div>
            
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {/* First Name */}
              <div className="px-4 py-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName || ''}
                  onChange={handleChange}
                  className={`w-full rounded-lg border ${errors.firstName ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} 
                             bg-white dark:bg-[#2C2C2E] px-3 py-2 text-gray-900 dark:text-white 
                             focus:ring-2 focus:ring-[#007AFF] dark:focus:ring-[#0A84FF] focus:outline-none`}
                />
                {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
              </div>

              {/* Middle Name */}
              <div className="px-4 py-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Middle Name
                </label>
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName || ''}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 
                             bg-white dark:bg-[#2C2C2E] px-3 py-2 text-gray-900 dark:text-white 
                             focus:ring-2 focus:ring-[#007AFF] dark:focus:ring-[#0A84FF] focus:outline-none"
                />
              </div>

              {/* Last Name */}
              <div className="px-4 py-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName || ''}
                  onChange={handleChange}
                  className={`w-full rounded-lg border ${errors.lastName ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} 
                             bg-white dark:bg-[#2C2C2E] px-3 py-2 text-gray-900 dark:text-white 
                             focus:ring-2 focus:ring-[#007AFF] dark:focus:ring-[#0A84FF] focus:outline-none`}
                />
                {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white dark:bg-[#1C1C1E] rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Contact Information</h3>
            </div>
            
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {/* Phone */}
              <div className="px-4 py-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  className={`w-full rounded-lg border ${errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} 
                             bg-white dark:bg-[#2C2C2E] px-3 py-2 text-gray-900 dark:text-white 
                             focus:ring-2 focus:ring-[#007AFF] dark:focus:ring-[#0A84FF] focus:outline-none`}
                />
                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
              </div>

              {/* Email */}
              <div className="px-4 py-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  className={`w-full rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} 
                             bg-white dark:bg-[#2C2C2E] px-3 py-2 text-gray-900 dark:text-white 
                             focus:ring-2 focus:ring-[#007AFF] dark:focus:ring-[#0A84FF] focus:outline-none`}
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              {/* Country */}
              <div className="px-4 py-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country || ''}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 
                             bg-white dark:bg-[#2C2C2E] px-3 py-2 text-gray-900 dark:text-white 
                             focus:ring-2 focus:ring-[#007AFF] dark:focus:ring-[#0A84FF] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* iOS-style fixed bottom action button */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-[#1C1C1E]/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 p-4 flex justify-between items-center">
        <button
          onClick={onCancel}
          className="px-5 py-2.5 rounded-full border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium text-sm hover:bg-gray-50 dark:hover:bg-[#2C2C2E] transition-colors"
        >
          Cancel
        </button>
        
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-full bg-[#007AFF] hover:bg-[#0062CC] dark:bg-[#0A84FF] dark:hover:bg-[#409CFF] text-white font-medium text-sm transition-colors flex items-center"
        >
          {isSubmitting ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-1.5" />
              <span>Save Receiver</span>
            </>
          )}
        </button>
      </footer>
    </div>
  );
}
