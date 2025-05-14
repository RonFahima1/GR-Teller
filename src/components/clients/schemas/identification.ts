import { z } from 'zod';
import { IDType } from '../constants/identification';

// Validation constants
const MAX_ID_NUMBER_LENGTH = 50;

// ID number validation based on type
const validateIDNumber = (value: string, type: IDType) => {
  const isValidLength = (val: string, min: number, max: number) => 
    val.length >= min && val.length <= max;

  return type === 'passport' 
    ? isValidLength(value, 6, 12)
    : type === 'national_id' 
    ? isValidLength(value, 8, 15)
    : type === 'drivers_license'
    ? isValidLength(value, 10, 20)
    : false;
};

export const identificationSchema = z.object({
  idType: z.enum(['passport', 'national_id', 'drivers_license'] as const, {
    errorMap: () => ({ message: 'Please select an ID type' })
  }),
  idNumber: z.string()
    .min(1, 'ID number is required')
    .max(MAX_ID_NUMBER_LENGTH, `ID number must be less than ${MAX_ID_NUMBER_LENGTH} characters`)
    .superRefine((value, ctx) => {
      const idType = ctx.parent?.data.idType;
      if (!idType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'ID type must be selected before entering ID number'
        });
        return;
      }
      
      const isValid = validateIDNumber(value, idType);
      if (!isValid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please enter a valid ID number for the selected ID type'
        });
      }
    }),
  issueDate: z.string()
    .min(1, 'Issue date is required')
    .superRefine((value, ctx) => {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please enter a valid date'
        });
      }
      
      if (date > new Date()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Issue date cannot be in the future'
        });
      }
    }),
  expiryDate: z.string()
    .min(1, 'Expiry date is required')
    .transform((value, ctx) => {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please enter a valid date'
        });
      }
      return value;
    })
    .superRefine((value, ctx) => {
      const expiryDate = new Date(value);
      const issueDate = new Date(ctx.parent?.data.issueDate || '');
      if (expiryDate <= issueDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Expiry date must be after issue date'
        });
      }
    })
});

export type IdentificationInfo = z.infer<typeof identificationSchema>;
