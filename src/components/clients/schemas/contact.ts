import { z } from 'zod';

export const contactSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .max(255, 'Email must be less than 255 characters')
    .regex(/^[^\s@]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
      message: 'Please enter a valid email address'
    }),
  phoneNumber: z.string()
    .min(1, 'Phone number is required')
    .max(20, 'Phone number must be less than 20 characters')
    .regex(/^\+?[0-9]{1,4}\s*\([0-9]{1,3}\)\s*[0-9]{1,9}$/, {
      message: 'Please enter a valid phone number (e.g., +1 (555) 123-4567)'
    })
    .transform((value) => {
      const cleaned = value.replace(/\D/g, '');
      return cleaned.length >= 7 && cleaned.length <= 15;
    }, 'Phone number must have 7-15 digits'),
  areaCode: z.string()
    .min(1, 'Area code is required')
    .max(3, 'Area code must be 1-3 digits')
    .regex(/^[0-9]{1,3}$/, {
      message: 'Area code must be 1-3 digits'
    })
});

export type ContactInfo = z.infer<typeof contactSchema>;
