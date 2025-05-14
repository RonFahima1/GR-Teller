import { Control, FieldError, FieldErrors } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { FormPath, validateFormPath, getErrorPath } from '../utils/form-path';
import { NewClientFormData } from '../types/form';

interface FormFieldProps {
  name: keyof NewClientFormData | `${keyof NewClientFormData}.${string}`;
  label: string;
  control: Control<NewClientFormData>;
  error?: string | FieldError;
  type?: 'text' | 'number' | 'email' | 'password' | 'date';
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  min?: number | string;
  max?: number | string;
  format?: string;
  as?: 'select' | 'textarea' | 'input';
  options?: Array<{ value: string; label: string }>;
  children?: React.ReactNode;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  selectProps?: React.SelectHTMLAttributes<HTMLSelectElement>;
  textareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
}

const placeholders = {
  'personal.firstName': 'Client first name',
  'personal.middleName': 'Client middle name (optional)',
  'personal.lastName': 'Client last name',
  'personal.dob': 'Client DOB (MM/DD/YYYY)',
  'contact.email': 'Client email address',
  'contact.phone': 'Client phone number',
  'address.streetAddress': 'Client street address',
  'address.city': 'Client city',
  'address.postalCode': 'Client postal code',
  'employment.income': 'Client monthly income',
  'documents.proofOfAddress': 'Upload client address proof'
} as const;

export function FormField({
  name,
  label,
  control,
  error,
  type = 'text',
  placeholder,
  className,
  disabled,
  required,
  ariaLabel,
  ariaDescribedBy,
  min,
  max,
  format,
  as = 'input',
  options,
  children,
  inputProps,
  selectProps,
  textareaProps
}: FormFieldProps) {
  // Get the error path using the form path utility
  const errorPath = getErrorPath(name);
  const formError = error || control._formState.errors[errorPath];

  const baseProps = {
    className: cn(
      'block w-full rounded-lg border border-primary-200 dark:border-primary-700 bg-background dark:bg-background/30 px-3 py-2.5 text-sm text-foreground dark:text-foreground/90 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400 transition-all duration-200 hover:border-primary-400 dark:hover:border-primary-600',
      disabled ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '',
      className
    ),
    disabled,
    required,
    'aria-label': ariaLabel || label,
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': !!formError
  };

  // Merge props with proper typing
  const mergedInputProps = {
    type,
    placeholder: placeholder || (placeholders as Record<string, string>)[name] || '',
    ...baseProps,
    ...control.register(name),
    ...inputProps
  } as React.InputHTMLAttributes<HTMLInputElement>;

  const mergedSelectProps = {
    ...baseProps,
    ...control.register(name),
    ...selectProps
  } as React.SelectHTMLAttributes<HTMLSelectElement>;

  const mergedTextareaProps = {
    ...baseProps,
    ...control.register(name),
    ...textareaProps
  } as React.TextareaHTMLAttributes<HTMLTextAreaElement>;

  return (
    <div className="space-y-1">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-foreground dark:text-foreground/90"
      >
        {label}
      </label>
      {children ? (
        children
      ) : as === 'select' ? (
        <select {...mergedSelectProps}>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : as === 'textarea' ? (
        <textarea {...mergedTextareaProps} rows={4} />
      ) : (
        <input {...mergedInputProps} />
      )}
      {formError && (
        <div className="mt-1 text-xs text-destructive dark:text-destructive/90 font-medium">
          {typeof formError === 'string' ? formError : formError.message}
        </div>
      )}
    </div>
  );
}
