export interface ValidationSchema {
  [key: string]: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: any) => boolean | Promise<boolean>;
    message?: string;
  };
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface ValidationState {
  isValid: boolean;
  errors: ValidationErrors;
  isSubmitting: boolean;
}

export interface ValidationOptions {
  triggerOnBlur?: boolean;
  triggerOnChange?: boolean;
  debounceTime?: number;
}

export type ValidationRule = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | Promise<boolean>;
  message?: string;
};

export type ValidationConfig = {
  [key: string]: ValidationRule;
};
