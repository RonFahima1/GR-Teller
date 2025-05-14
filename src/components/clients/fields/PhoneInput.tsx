import { useFormContext } from '../context/FormContext';
import { FormField } from '../components/FormField';
import { cn } from '../../../lib/utils';
import { PrefixSelector } from './PrefixSelector';
import { useEffect, useState } from 'react';
import { Control, FieldError } from 'react-hook-form';
import { NewClientFormData } from '../types/form';
import { FormPath } from '../utils/form';

const formatPhoneNumber = (number: string) => {
  // Remove all non-digit characters
  const cleaned = number.replace(/\D/g, '');
  
  // Format as 052-397-3739
  if (cleaned.length === 9) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return cleaned;
};

interface PhoneInputProps {
  name: FormPath;
  label: string;
  control: Control<NewClientFormData>;
  required?: boolean;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  error?: string | FieldError;
}

export function PhoneInput({
  name,
  label,
  control,
  required = true,
  className,
  disabled,
  ariaLabel,
  ariaDescribedBy,
  error,
}: PhoneInputProps) {
  const { form } = useFormContext();
  const [countryCode, setCountryCode] = useState<string>('');

  useEffect(() => {
    const prefix = form.getValues('contact.prefix');
    if (prefix) {
      setCountryCode(prefix);
    }
  }, [form]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    setCountryCode(code);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove all non-digit characters
    const formattedValue = formatPhoneNumber(value.slice(0, 9)); // Limit to 9 digits and format
    
    form.setValue('contact.phone', formattedValue);
  };

  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const value = form.getValues('contact.phone');
    if (typeof value === 'string') {
      setInputValue(value);
    }
  }, [form]);

  return (
    <FormField
      name="contact.phone"
      label={label}
      control={control}
      required={required}
      className={className}
      disabled={disabled}
      ariaLabel={ariaLabel}
      ariaDescribedBy={ariaDescribedBy}
      error={error}
    >
      <div className="flex items-center gap-2">
        <PrefixSelector
          name="contact.prefix"
          control={control}
          required
          className="w-24"
          onChange={handleCountryChange}
        />
        <input
          type="tel"
          {...control.register('contact.phone')}
          className={cn(
            'block w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800/30 px-3 py-2.5 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 placeholder-gray-300 dark:placeholder-gray-600 transition-all duration-200',
            disabled ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '',
            className
          )}
          disabled={disabled}
          required={required}
          pattern="\d*"
          maxLength={9}
          placeholder="052-397-3739"
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '');
            const formattedValue = formatPhoneNumber(value.slice(0, 9));
            setInputValue(formattedValue);
            form.setValue('contact.phone', formattedValue);
          }}
          value={inputValue}
          aria-label={label}
          aria-invalid={error ? 'true' : 'false'}
        />
      </div>
    </FormField>
  );
}
