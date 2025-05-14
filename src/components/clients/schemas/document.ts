import { z } from 'zod';

const MAX_ID_NUMBER_LENGTH = 50;

export const documentSchema = z.object({
  idType: z.enum(['passport', 'national_id', 'drivers_license'], {
    errorMap: () => ({ message: 'Please select an ID type' })
  }),
  idNumber: z.string()
    .min(1, 'ID number is required')
    .max(MAX_ID_NUMBER_LENGTH, `ID number must be less than ${MAX_ID_NUMBER_LENGTH} characters`)
    .regex(/^[A-Za-z0-9-]+$/, {
      message: 'ID number can only contain letters, numbers, and hyphens'
    })
    .superRefine((value, ctx) => {
      const type = ctx.parent?.data.idType;
      if (!type) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'ID type must be selected before entering ID number'
        });
        return;
      }
      
      const isValidLength = (val: string, min: number, max: number) => 
        val.length >= min && val.length <= max;

      const isValid = type === 'passport' 
        ? isValidLength(value, 6, 12)
        : type === 'national_id' 
        ? isValidLength(value, 8, 15)
        : isValidLength(value, 10, 20);

      if (!isValid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Invalid ID number length for selected ID type'
        });
      }
    })
});

export type DocumentInfo = z.infer<typeof documentSchema>;
