import { NewClientFormData } from '../types/form';
import { z } from 'zod';

// Helper type to get all possible paths in the form data
export type FormPath = keyof NewClientFormData |
  `${keyof NewClientFormData}.${string}`;

// Helper type to get the value type for a given path
export type FormPathValue<T extends NewClientFormData, P extends FormPath> =
  P extends keyof T
    ? T[P]
    : P extends `${infer Section}.${infer Field}`
    ? Section extends keyof T
      ? Field extends keyof T[Section]
        ? T[Section][Field]
        : never
      : never
    : never;

// Helper function to validate form paths
export function validateFormPath(path: string): path is FormPath {
  const pathSchema = z.union([
    z.enum(['personal', 'address', 'contact', 'identification', 'employment', 'documents'] as const),
    z.string().regex(/^personal\.(firstName|middleName|lastName|nationality|gender|dob)$/),
    z.string().regex(/^address\.(country|streetAddress|city|postalCode)$/),
    z.string().regex(/^contact\.(email|prefix|phone|areaCode|customerCard)$/),
    z.string().regex(/^identification\.(idType|issuanceCountry|idNumber|issueDate|expiryDate)$/),
    z.string().regex(/^employment\.(occupation|employer|income)$/),
    z.string().regex(/^documents\.(idFront|idBack|proofOfAddress)\.([a-z]+)$/)
  ]);

  return pathSchema.safeParse(path).success;
}

// Helper function to get the error path for a given form path
export function getErrorPath(path: FormPath): string {
  if (typeof path === 'string' && path.includes('.')) {
    return path;
  }
  return path as string;
}
