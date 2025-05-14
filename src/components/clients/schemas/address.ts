import { z } from 'zod';

// Validation constants
const MAX_STREET_LENGTH = 100;
const MAX_CITY_LENGTH = 50;
const MAX_STATE_LENGTH = 50;
const MAX_POSTAL_CODE_LENGTH = 20;
const MAX_COUNTRY_LENGTH = 50;

export const addressSchema = z.object({
  street: z.string()
    .min(1, 'Street is required')
    .max(MAX_STREET_LENGTH, `Street must be less than ${MAX_STREET_LENGTH} characters`)
    .regex(/^[a-zA-Z0-9\s.,'-]+$/, {
      message: 'Street can only contain letters, numbers, spaces, and common punctuation'
    }),
  city: z.string()
    .min(1, 'City is required')
    .max(MAX_CITY_LENGTH, `City must be less than ${MAX_CITY_LENGTH} characters`)
    .regex(/^[a-zA-Z\s'-]+$/, {
      message: 'City can only contain letters, spaces, hyphens, and apostrophes'
    }),
  state: z.string()
    .min(1, 'State is required')
    .max(MAX_STATE_LENGTH, `State must be less than ${MAX_STATE_LENGTH} characters`)
    .regex(/^[a-zA-Z\s'-]+$/, {
      message: 'State can only contain letters, spaces, hyphens, and apostrophes'
    }),
  postalCode: z.string()
    .min(1, 'Postal code is required')
    .max(MAX_POSTAL_CODE_LENGTH, `Postal code must be less than ${MAX_POSTAL_CODE_LENGTH} characters`)
    .regex(/^[a-zA-Z0-9\s-]+$/, {
      message: 'Postal code can only contain letters, numbers, spaces, and hyphens'
    }),
  country: z.string()
    .min(1, 'Country is required')
    .max(MAX_COUNTRY_LENGTH, `Country must be less than ${MAX_COUNTRY_LENGTH} characters`)
    .regex(/^[a-zA-Z\s'-]+$/, {
      message: 'Country can only contain letters, spaces, hyphens, and apostrophes'
    })
});

export type AddressInfo = z.infer<typeof addressSchema>;
