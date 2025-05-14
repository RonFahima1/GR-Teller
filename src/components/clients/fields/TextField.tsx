import { ReactNode } from 'react';
import { useController } from 'react-hook-form';
import { cn } from '../../../lib/utils';
import { BaseField } from '../components/BaseField';

interface TextFieldProps {
  name: string;
  label: string;
  control: any;
  type?: 'text' | 'email' | 'tel' | 'number' | 'password';
  placeholder?: string;
  className?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  min?: string | number;
  max?: string | number;
  maxLength?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  ariaInvalid?: boolean;
}

export function TextField({
  name,
  label,
  control,
  type = 'text',
  placeholder = '',
  className = '',
  error,
  disabled = false,
  required = false,
  min,
  max,
  maxLength,
  onChange,
  ariaLabel,
  ariaDescribedBy,
  ariaInvalid,
}: TextFieldProps) {
  const {
    field,
    fieldState: { invalid }
  } = useController({
    name,
    control,
    defaultValue: ''
  });

  const inputProps = {
    ...field,
    className: cn(
      'block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm',
      invalid ? 'border-red-500' : '',
      disabled ? 'bg-gray-100 cursor-not-allowed' : '',
      className
    ),
    type,
    placeholder,
    disabled,
    min,
    max,
    maxLength,
    'aria-label': ariaLabel || label,
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid || invalid,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e);
      }
      field.onChange(e);
    }
  };

  return (
    <BaseField
      name={name}
      label={label}
      control={control}
      error={error}
      disabled={disabled}
      required={required}
      ariaLabel={ariaLabel}
      ariaDescribedBy={ariaDescribedBy}
      ariaInvalid={ariaInvalid}
    >
      <input {...inputProps} />
    </BaseField>
  );
}
