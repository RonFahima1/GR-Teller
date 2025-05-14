export * from './personal';
export * from './address';
export * from './contact';
export * from './document';
export * from './employment';
export * from './identification';

// Combined schema
import { z } from 'zod';
import { personalSchema } from './personal';
import { addressSchema } from './address';
import { contactSchema } from './contact';
import { documentSchema } from './document';
import { employmentSchema } from './employment';
import { identificationSchema } from './identification';

export const clientSchema = z.object({
  personal: personalSchema,
  address: addressSchema,
  contact: contactSchema,
  document: documentSchema,
  employment: employmentSchema,
  identification: identificationSchema
});

export type ClientFormData = z.infer<typeof clientSchema>;
