import { z } from 'zod';
import { NewClientFormData, FileData, DocumentType } from '../types/form';

export const newClientSchema = z.object({
  personal: z.object({
    firstName: z.string().min(1, 'First name is required'),
    middleName: z.string().optional(),
    lastName: z.string().min(1, 'Last name is required'),
    nationality: z.string().min(1, 'Nationality is required'),
    gender: z.enum(['male', 'female', 'other']),
    dob: z.string().min(1, 'Date of birth is required'),
  }),
  address: z.object({
    country: z.string().min(1, 'Country is required'),
    streetAddress: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
  }),
  contact: z.object({
    email: z.string().email('Invalid email address'),
    phoneNumber: z.string().min(1, 'Phone number is required'),
    areaCode: z.string().min(1, 'Area code is required'),
  }),
  identification: z.object({
    idType: z.enum(['passport', 'national_id', 'drivers_license']),
    idNumber: z.string().min(1, 'ID number is required'),
    issueDate: z.string().min(1, 'Issue date is required'),
    expiryDate: z.string().min(1, 'Expiry date is required'),
  }),
  employment: z.object({
    occupation: z.string().min(1, 'Occupation is required'),
    employer: z.string().min(1, 'Employer is required'),
    income: z.string().min(1, 'Income is required'),
  }),
  documents: z.object({
    idFront: z.object({
      file: z.instanceof(File),
      previewUrl: z.string(),
      name: z.string(),
      size: z.number(),
      type: z.string()
    }).nullable(),
    idBack: z.object({
      file: z.instanceof(File),
      previewUrl: z.string(),
      name: z.string(),
      size: z.number(),
      type: z.string()
    }).nullable(),
    proofOfAddress: z.object({
      file: z.instanceof(File),
      previewUrl: z.string(),
      name: z.string(),
      size: z.number(),
      type: z.string()
    }).nullable()
  })
});

export type NewClientSchema = z.infer<typeof newClientSchema>;

export function validateSchema(data: NewClientFormData): asserts data is NewClientSchema {
  const result = newClientSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
}
