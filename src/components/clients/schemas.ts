import { z } from 'zod';

export const clientSchema = z.object({
  personal: z.object({
    firstName: z.string()
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name must be less than 50 characters')
      .regex(/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces')
      .min(1, 'First name is required'),
    middleName: z.string()
      .max(50, 'Middle name must be less than 50 characters')
      .regex(/^[a-zA-Z\s]*$/, 'Middle name can only contain letters and spaces')
      .optional(),
    lastName: z.string()
      .min(2, 'Last name must be at least 2 characters')
      .max(50, 'Last name must be less than 50 characters')
      .regex(/^[a-zA-Z\s]+$/, 'Last name can only contain letters and spaces')
      .min(1, 'Last name is required'),
    nationality: z.string().min(1, 'Nationality is required'),
    gender: z.enum(['male', 'female', 'other'], {
      errorMap: () => ({ message: 'Please select a gender' })
    }),
    dob: z.string()
      .min(1, 'Date of birth is required')
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Please enter a valid date format (YYYY-MM-DD)')
      .refine((val) => {
        const date = new Date(val);
        const today = new Date();
        const minAge = new Date();
        minAge.setFullYear(today.getFullYear() - 18);
        return date <= today && date >= minAge;
      }, 'You must be at least 18 years old')
  }),
  address: z.object({
    country: z.string()
      .min(2, 'Country must be at least 2 characters')
      .max(50, 'Country must be less than 50 characters')
      .min(1, 'Country is required'),
    streetAddress: z.string()
      .min(2, 'Street address must be at least 2 characters')
      .max(200, 'Street address must be less than 200 characters')
      .min(1, 'Street address is required'),
    city: z.string()
      .min(2, 'City must be at least 2 characters')
      .max(50, 'City must be less than 50 characters')
      .min(1, 'City is required'),
    postalCode: z.string()
      .min(2, 'Postal code must be at least 2 characters')
      .max(20, 'Postal code must be less than 20 characters')
      .min(1, 'Postal code is required')
  }),
  contact: z.object({
    email: z.string()
      .min(1, 'Email is required')
      .max(255, 'Email must be less than 255 characters')
      .email('Please enter a valid email address'),
    phone: z.object({
      country: z.string().min(1, 'Country code is required'),
      number: z.string()
        .min(9, 'Phone number must be exactly 9 digits')
        .max(9, 'Phone number must be exactly 9 digits')
        .regex(/^05\d{7}$/, 'Phone number must start with 05 and contain exactly 9 digits')
        .min(1, 'Phone number is required'),
      areaCode: z.string().min(1, 'Area code is required')
    }),
    customerCard: z.string().optional()
  }),
  identification: z.object({
    idType: z.enum(['passport', 'national_id', 'drivers_license'], {
      errorMap: () => ({ message: 'Please select an ID type' })
    }),
    issuanceCountry: z.string()
      .min(2, 'Issuance country must be at least 2 characters')
      .max(50, 'Issuance country must be less than 50 characters')
      .min(1, 'Issuance country is required'),
    idNumber: z.string()
      .min(1, 'ID number is required')
      .max(50, 'ID number must be less than 50 characters')
      .regex(/^[a-zA-Z0-9\-\s]+$/, 'ID number can only contain letters, numbers, hyphens, and spaces'),
    issueDate: z.string()
      .min(1, 'Issue date is required')
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Please enter a valid date format (YYYY-MM-DD)'),
    expiryDate: z.string()
      .min(1, 'Expiry date is required')
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Please enter a valid date format (YYYY-MM-DD)')
  }),
  employment: z.object({
    occupation: z.string()
      .min(2, 'Occupation must be at least 2 characters')
      .max(100, 'Occupation must be less than 100 characters')
      .min(1, 'Occupation is required'),
    employer: z.string()
      .min(2, 'Employer must be at least 2 characters')
      .max(100, 'Employer must be less than 100 characters')
      .min(1, 'Employer is required'),
    income: z.string()
      .min(2, 'Income must be at least 2 characters')
      .max(20, 'Income must be less than 20 characters')
      .regex(/^[0-9\,\.]+$/, 'Income can only contain numbers, commas, and decimal points')
      .min(1, 'Income is required')
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

export type NewClientFormData = z.infer<typeof clientSchema>;
