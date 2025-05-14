import { useContext } from 'react';
import { useFormContext } from '../context/FormContext';
import { NewClientFormData, FormSection, FormState } from '../types/form';

export function useFormHandlers() {
  const context = useFormContext();
  if (!context) {
    throw new Error('useFormHandlers must be used within a FormProvider');
  }

  const { form, state, setState, currentSection, setCurrentSection, handleFileUpload, handleFileRemove, handleSubmit } = context;

  const handleChangeSection = (section: FormSection) => {
    setCurrentSection(section);
  };

  const handleFormSubmit = async (data: NewClientFormData) => {
    try {
      setState(prev => ({ ...prev, isSubmitting: true }));
      // Here you would typically make an API call with the form data
      console.log('Form submitted:', data);
      setState(prev => ({ ...prev, successMessage: 'Client created successfully', isSubmitting: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          [currentSection]: error instanceof Error ? error.message : 'An error occurred'
        },
        isSubmitting: false
      }));
    }
  };

  return {
    form,
    state,
    currentSection,
    handleChangeSection,
    handleFileUpload,
    handleFileRemove,
    handleSubmit: handleSubmit(handleFormSubmit)
  };
}
