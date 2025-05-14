import { ReactNode } from 'react';
import { useController } from 'react-hook-form';
import { cn } from '../../../lib/utils';
import { BaseField } from '../components/BaseField';

interface SelectFieldProps {
  name: string;
  label: string;
  control: any;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  className?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  ariaInvalid?: boolean;
}

export function SelectField({
  name,
  label,
  control,
  options,
  placeholder = '',
  className = '',
  error,
  disabled = false,
  required = false,
  onChange,
  ariaLabel,
  ariaDescribedBy,
  ariaInvalid,
}: SelectFieldProps) {
  const {
    field,
    fieldState: { invalid }
  } = useController({
    name,
    control,
    defaultValue: ''
  });

  const selectProps = {
    ...field,
    className: cn(
      'block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm capitalize',
      invalid ? 'border-red-500' : '',
      disabled ? 'bg-gray-100 cursor-not-allowed' : '',
      className
    ),
    disabled,
    'aria-label': ariaLabel || label,
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid || invalid,
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
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
      <select {...selectProps}>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="capitalize"
          >
            {option.label}
          </option>
        ))}
      </select>
    </BaseField>
  );
}
