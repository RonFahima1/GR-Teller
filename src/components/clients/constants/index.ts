export const ID_TYPES = [
  'passport',
  'national_id',
  'drivers_license'
] as const;

export type IDType = typeof ID_TYPES[number];
