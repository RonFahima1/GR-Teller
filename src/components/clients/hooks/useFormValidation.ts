import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { newClientSchema } from '../schema';
import { NewClientFormData, DocumentType } from '../types/form';

export function useFormValidation() {
  const form = useForm<NewClientFormData>({
    resolver: zodResolver(newClientSchema),
    mode: 'onChange',
    defaultValues: {
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
        phoneNumber: '',
        areaCode: ''
      },
      identification: {
        idType: 'passport',
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
    }
  });

  const validateForm = async () => {
    try {
      await form.trigger();
      return true;
    } catch (error) {
      return false;
    }
  };

  const validateSection = async (section: keyof NewClientFormData) => {
    try {
      await form.trigger(section);
      return true;
    } catch (error) {
      return false;
    }
  };

  const getSectionErrors = (section: keyof NewClientFormData) => {
    return form.formState.errors[section];
  };

  const getFirstError = () => {
    const errors = form.formState.errors;
    for (const section of Object.keys(errors) as Array<keyof NewClientFormData>) {
      const sectionErrors = errors[section];
      if (sectionErrors && Object.keys(sectionErrors).length > 0) {
        return sectionErrors;
      }
    }
    return null;
  };

  return {
    form,
    validateForm,
    validateSection,
    getSectionErrors,
    getFirstError,
    formState: form.formState
  };
}
