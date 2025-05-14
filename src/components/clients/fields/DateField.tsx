import { useFormContext } from '../context/FormContext';
import { BaseField } from './BaseField';
import { Control } from 'react-hook-form';
import { cn } from '../../../utils/cn';
import { NewClientFormData } from '../types/form';

interface DateFieldProps {
  name: string;
  label: string;
  control: Control<NewClientFormData>;
  error?: string;
  type?: 'text' | 'number' | 'email' | 'password' | 'date';
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  ariaInvalid?: boolean;
  minDate?: string;
  maxDate?: string;
  format?: string;
}

export function DateField({
  name,
  label,
  control,
  error,
  type = 'date',
  placeholder = '',
  className = '',
  disabled = false,
  required = false,
  ariaLabel,
  ariaDescribedBy,
  ariaInvalid,
  minDate,
  maxDate,
  format,
}: DateFieldProps) {
  const register = control.register;
  const errorState = error || control._formState.errors[name as keyof NewClientFormData];

  const errorMessage = typeof errorState === 'string' 
    ? errorState 
    : errorState?.message?.toString() || null;

  const commonProps = {
    ...register(name as keyof NewClientFormData),
    className: cn(
      'block w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800/30 px-3 py-2.5 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200',
      errorState ? 'border-red-500' : '',
      disabled ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '',
      className
    ),
    placeholder,
    disabled,
    required,
    'aria-label': ariaLabel || label,
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid || !!errorState,
    min: minDate,
    max: maxDate,
    format
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor={name}>
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          {...commonProps}
        />
        {errorState && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )}
      </div>
      {errorMessage && (
        <p className="text-sm text-red-500 dark:text-red-400 mt-1">{errorMessage}</p>
      )}
    </div>
  );
}
