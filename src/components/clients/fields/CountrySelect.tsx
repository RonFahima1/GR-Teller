import { Control } from 'react-hook-form';
import { cn } from '../../../utils/cn';
import { COUNTRIES } from '../constants/countries';
import { NewClientFormData } from '../types/form';

interface CountrySelectProps {
  name: string;
  label: string;
  control: Control<NewClientFormData>;
  className?: string;
  required?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function CountrySelect({
  name,
  label,
  control,
  className = '',
  required = false,
  ariaLabel,
  ariaDescribedBy,
  onChange,
}: CountrySelectProps) {
  const register = control.register;
  const errorState = control._formState.errors[name as keyof NewClientFormData];

  const errorMessage = typeof errorState === 'string' 
    ? errorState 
    : errorState?.message?.toString() || null;

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor={name}>
        {label}
      </label>
      <select
        {...register(name as keyof NewClientFormData)}
        className={cn(
          'block w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800/30 px-3 py-2.5 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200',
          errorState ? 'border-red-500' : '',
          className
        )}
        aria-label={ariaLabel || label}
        aria-describedby={ariaDescribedBy}
        aria-invalid={!!errorState}
        onChange={onChange}
      >
        <option value="">Select {label}</option>
        {COUNTRIES.map((country) => (
          <option key={country.value} value={country.value}>
            {country.label}
          </option>
        ))}
      </select>
      {errorMessage && (
        <p className="text-sm text-red-500 dark:text-red-400 mt-1">{errorMessage}</p>
      )}
    </div>
  );
}
