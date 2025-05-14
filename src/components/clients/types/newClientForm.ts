import { FileData } from './form';

export interface NewClientFormData {
  // Personal Information
  personal: {
    firstName: string;
    middleName?: string;
    lastName: string;
    nationality: string;
    gender: 'male' | 'female' | 'other';
    dob: string;
  };

  // Address
  address: {
    country: string;
    streetAddress: string;
    city: string;
    postalCode: string;
  };

  // Contact Details
  contact: {
    email: string;
    phoneNumber: string;
    areaCode: string;
  };

  // Identification
  identification: {
    idType: 'passport' | 'national_id' | 'drivers_license';
    idNumber: string;
    issueDate: string;
    expiryDate: string;
  };

  // Employment
  employment: {
    occupation: string;
    employer: string;
    income: string;
  };

  // Documents
  documents: {
    idFront: FileData | null;
    idBack: FileData | null;
    proofOfAddress: FileData | null;
  };
}

export interface FormSection {
  title: string;
  description?: string;
  fields: Array<{
    name: string;
    label: string;
    type: 'text' | 'date' | 'select' | 'radio' | 'phone' | 'email';
    required: boolean;
    options?: Array<{ value: string; label: string }>;
    placeholder?: string;
  }>;
}

export type Gender = 'male' | 'female';
