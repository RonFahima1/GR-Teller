import { z } from 'zod';

export type FormSection =
  | 'personal'
  | 'address'
  | 'contact'
  | 'identification'
  | 'employment'
  | 'documents';

export type DocumentType = 'idFront' | 'idBack' | 'proofOfAddress';

export interface FileData {
  file: File;
  previewUrl: string;
  name: string;
  size: number;
  type: string;
}

export interface FormState {
  isSubmitting: boolean;
  errors: Record<string, string>;
  currentSection: FormSection;
  fileUploads: Record<DocumentType, FileData | undefined>;
  successMessage?: string;
}

export type IdType = 'passport' | 'national_id' | 'drivers_license';

export type Gender = 'male' | 'female' | 'other';

export interface NewClientFormData {
  personal: {
    firstName: string;
    middleName?: string;
    lastName: string;
    nationality: string;
    gender: Gender;
    dob: string;
  };
  address: {
    country: string;
    streetAddress: string;
    city: string;
    postalCode?: string;
  };
  contact: {
    email: string;
    prefix: string;
    phone: string;
    areaCode: string;
    customerCard?: string;
  };
  identification: {
    idType: IdType;
    issuanceCountry: string;
    idNumber: string;
    issueDate: string;
    expiryDate: string;
  };
  employment: {
    occupation: string;
    employer: string;
    income: string;
  };
  documents: Record<DocumentType, FileData | null>;
}

export const SECTIONS: readonly FormSection[] = [
  'personal',
  'address',
  'contact',
  'identification',
  'employment',
  'documents'
] as const;

export const DOCUMENT_TYPES: readonly DocumentType[] = [
  'idFront',
  'idBack',
  'proofOfAddress'
] as const;
