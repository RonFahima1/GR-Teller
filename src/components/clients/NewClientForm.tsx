'use client';

import { PersonalInfoSection } from './sections/PersonalInfoSection';
import { AddressSection } from './sections/AddressSection';
import { ContactSection } from './sections/ContactSection';
import { DocumentSection } from './sections/DocumentSection';
import { KYCSection } from './sections/KYCSection';
import { FormProvider } from './context/FormContext';
import { useFormContext } from './context/FormContext';
import { FormCard } from './components/FormCard';
import { FormSection, NewClientFormData } from './types/form';

interface NewClientFormProps {
  onSubmit: (data: NewClientFormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export function NewClientForm({ onSubmit, onCancel, isLoading }: NewClientFormProps) {
  return (
    <FormProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
        <form onSubmit={(e) => {
          e.preventDefault();
          const { handleSubmit, form } = useFormContext();
          const handleFormSubmit = async (data: NewClientFormData) => {
            await onSubmit(data);
          };
          handleSubmit(handleFormSubmit)(e);
        }} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Personal Information</h3>
                <PersonalInfoSection />
              </div>
              <div className="bg-white dark:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Address Information</h3>
                <AddressSection />
              </div>
              <div className="bg-white dark:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Contact Information</h3>
                <ContactSection />
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Identification</h3>
                <KYCSection />
              </div>
              <div className="bg-white dark:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Documents</h3>
                <DocumentSection />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-white bg-white dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 text-sm font-medium text-white bg-blue-600 dark:bg-blue-700 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
