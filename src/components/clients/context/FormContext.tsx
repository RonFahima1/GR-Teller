import { createContext, useContext, useState, ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clientSchema } from '../schemas';
import { NewClientFormData, FormState, FormSection, DocumentType, FileData } from '../types/form';

interface FormContextType {
  form: ReturnType<typeof useForm<NewClientFormData>>;
  state: FormState;
  setState: React.Dispatch<React.SetStateAction<FormState>>;
  currentSection: FormSection;
  setCurrentSection: React.Dispatch<React.SetStateAction<FormSection>>;
  handleFileUpload: (type: DocumentType, file: File) => void;
  handleFileRemove: (type: DocumentType) => void;
  handleSubmit: (onSubmit: (data: NewClientFormData) => Promise<void>) => (e: React.BaseSyntheticEvent | undefined) => Promise<void>;
  resetForm: () => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export function useFormContext() {
  const context = useContext(FormContext) as FormContextType | undefined;
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
}

export function FormProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<FormState>({
    isSubmitting: false,
    errors: {},
    currentSection: 'personal',
    fileUploads: {
      idFront: undefined,
      idBack: undefined,
      proofOfAddress: undefined
    },
    successMessage: undefined
  });

  const [currentSection, setCurrentSection] = useState<FormSection>('personal');

  const defaultValues: NewClientFormData = {
    personal: {
      firstName: '',
      middleName: '',
      lastName: '',
      nationality: '',
      gender: 'male',
      dob: ''
    },
    address: {
      country: '',
      streetAddress: '',
      city: '',
      postalCode: ''
    },
    contact: {
      email: '',
      phone: {
        country: '',
        number: '',
        areaCode: ''
      },
      customerCard: ''
    },
    identification: {
      idType: 'passport',
      issuanceCountry: '',
      idNumber: '',
      issueDate: '',
      expiryDate: ''
    },
    employment: {
      occupation: '',
      employer: '',
      income: ''
    },
    documents: {
      idFront: null,
      idBack: null,
      proofOfAddress: null
    }
  };

  const form = useForm<NewClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: defaultValues as NewClientFormData,
    mode: 'onChange'
  });

  const resetForm = () => {
    form.reset(defaultValues);
    setState(prev => ({
      ...prev,
      errors: {},
      fileUploads: {
        idFront: undefined,
        idBack: undefined,
        proofOfAddress: undefined
      },
      successMessage: undefined
    }));
    setCurrentSection('personal');
  };

  const handleFileUpload = (type: DocumentType, file: File) => {
    const previewUrl = URL.createObjectURL(file);
    const fileData: FileData = {
      file,
      previewUrl,
      name: file.name,
      size: file.size,
      type: file.type
    };
    
    // Map document types to form fields
    const documentTypeMap: Record<DocumentType, string> = {
      idFront: 'documents.idFront',
      idBack: 'documents.idBack',
      proofOfAddress: 'documents.proofOfAddress'
    };

    // Set the file data in the form
    form.setValue(documentTypeMap[type], fileData as FileData);
    setState(prev => ({
      ...prev,
      fileUploads: {
        ...prev.fileUploads,
        [type]: fileData
      }
    }));
  };

  const handleFileRemove = (type: DocumentType) => {
    const currentFile = form.getValues(documentTypeMap[type]) as FileData;
    if (currentFile && currentFile.previewUrl) {
      URL.revokeObjectURL(currentFile.previewUrl);
    }
    form.setValue(documentTypeMap[type], null);
    setState(prev => ({
      ...prev,
      fileUploads: {
        ...prev.fileUploads,
        [type]: undefined
      }
    }));
  };

  const handleSubmit = (onSubmit: (data: NewClientFormData) => Promise<void>) => async (e: React.BaseSyntheticEvent | undefined) => {
    if (e) e.preventDefault();
    if (state.isSubmitting) return;

    try {
      setState(prev => ({ ...prev, isSubmitting: true }));
      const result = await form.trigger();
      if (!result) {
        setState(prev => ({
          ...prev,
          errors: {
            ...prev.errors,
            validation: 'Please fix the validation errors before submitting'
          }
        }));
        return;
      }

      const data = form.getValues();
      await onSubmit(data);
      setState(prev => ({
        ...prev,
        successMessage: 'Client registration successful',
        isSubmitting: false
      }));
      // Reset form after successful submission
      resetForm();
    } catch (error: any) {
      console.error('Form submission error:', error);
      setState(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          submission: error?.message || 'An error occurred while submitting the form'
        },
        isSubmitting: false
      }));
    }
  };

  return (
    <FormContext.Provider
      value={{
        form,
        state,
        setState,
        currentSection,
        setCurrentSection,
        handleFileUpload,
        handleFileRemove,
        handleSubmit,
        resetForm
      }}
    >
      {children}
    </FormContext.Provider>
  );
}
