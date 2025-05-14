import { z } from 'zod';

// Age constants
const minAge = 18;
const maxAge = 120;

// Validation constants
const MAX_NAME_LENGTH = 50;

export const personalSchema = z.object({
  firstName: z.string()
    .min(1, 'First name is required')
    .max(MAX_NAME_LENGTH, `First name must be less than ${MAX_NAME_LENGTH} characters`)
    .regex(/^[a-zA-Z\s'-]+$/, {
      message: 'First name can only contain letters, spaces, hyphens, and apostrophes'
    }),
  middleName: z.string()
    .max(MAX_NAME_LENGTH, `Middle name must be less than ${MAX_NAME_LENGTH} characters`)
    .regex(/^[a-zA-Z\s'-]*$/, {
      message: 'Middle name can only contain letters, spaces, hyphens, and apostrophes'
    })
    .optional(),
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(MAX_NAME_LENGTH, `Last name must be less than ${MAX_NAME_LENGTH} characters`)
    .regex(/^[a-zA-Z\s'-]+$/, {
      message: 'Last name can only contain letters, spaces, hyphens, and apostrophes'
    }),
  nationality: z.string()
    .min(1, 'Nationality is required')
    .max(MAX_NAME_LENGTH, `Nationality must be less than ${MAX_NAME_LENGTH} characters`)
    .regex(/^[a-zA-Z\s'-]+$/, {
      message: 'Nationality can only contain letters, spaces, hyphens, and apostrophes'
    }),
  gender: z.enum(['male', 'female', 'other'], {
    errorMap: () => ({ message: 'Please select a gender' })
  }),
  dob: z.string()
    .min(1, 'Date of birth is required')
    .refine((value) => {
      const date = new Date(value);
      if (isNaN(date.getTime())) return false;
      const age = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
      return age >= minAge && age <= maxAge;
    }, `Age must be between ${minAge} and ${maxAge} years`)
});

export type PersonalInfo = z.infer<typeof personalSchema>;
