import { z } from 'zod';

// Validation constants
const MAX_OCCUPATION_LENGTH = 50;
const MAX_EMPLOYER_LENGTH = 100;
const MAX_INCOME_LENGTH = 20;

// Income validation
const validateIncome = (value: string) => {
  const num = parseFloat(value.replace(/[^\d.-]+/g, ''));
  return !isNaN(num) && num >= 0;
};

export const employmentSchema = z.object({
  occupation: z.string()
    .min(1, 'Occupation is required')
    .max(MAX_OCCUPATION_LENGTH, `Occupation must be less than ${MAX_OCCUPATION_LENGTH} characters`)
    .regex(/^[a-zA-Z\s'-]+$/, {
      message: 'Occupation can only contain letters, spaces, hyphens, and apostrophes'
    }),
  employer: z.string()
    .min(1, 'Employer name is required')
    .max(MAX_EMPLOYER_LENGTH, `Employer must be less than ${MAX_EMPLOYER_LENGTH} characters`)
    .regex(/^[a-zA-Z0-9\s.,'-]+$/, {
      message: 'Employer name can only contain letters, numbers, spaces, and common punctuation'
    }),
  income: z.string()
    .min(1, 'Income is required')
    .max(MAX_INCOME_LENGTH, `Income must be less than ${MAX_INCOME_LENGTH} characters`)
    .transform((value) => value.replace(/[^\d.-]+/g, ''))
    .refine(validateIncome, 'Please enter a valid income amount')
    .transform((value) => parseFloat(value))
});

export type EmploymentInfo = z.infer<typeof employmentSchema>;
