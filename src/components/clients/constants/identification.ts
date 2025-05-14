export type IDType = 'passport' | 'national_id' | 'drivers_license';

export interface IDTypeConfig {
  label: string;
  rules: {
    pattern: RegExp;
    min: number;
    max: number;
  };
}

export const ID_TYPES: Record<IDType, IDTypeConfig> = {
  passport: {
    label: 'Passport',
    rules: {
      pattern: /^[A-Z0-9]{6,12}$/, min: 6, max: 12
    }
  },
  national_id: {
    label: 'National ID',
    rules: {
      pattern: /^[0-9]{9,12}$/, min: 9, max: 12
    }
  },
  drivers_license: {
    label: "Driver's License",
    rules: {
      pattern: /^[A-Z0-9]{6,12}$/, min: 6, max: 12
    }
  }
};

export const ID_TYPE_LENGTHS = {
  passport: { min: 6, max: 12 },
  national_id: { min: 9, max: 12 },
  drivers_license: { min: 6, max: 12 }
};

export const ID_TYPE_FORMATS = {
  passport: /^[A-Za-z0-9-]+$/, // Letters, numbers, hyphens
  national_id: /^[A-Za-z0-9-]+$/, // Letters, numbers, hyphens
  drivers_license: /^[A-Za-z0-9-]+$/ // Letters, numbers, hyphens
} as const;
