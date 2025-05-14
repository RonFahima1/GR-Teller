import { ReactNode } from 'react';
import { useController } from 'react-hook-form';
import { cn } from '../../../lib/utils';

interface BaseFieldProps {
  name: string;
  label: string;
  control: any;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  ariaInvalid?: boolean;
  children?: ReactNode;
}

export function BaseField({
  name,
  label,
  control,
  error,
  disabled = false,
  required = false,
  ariaLabel,
  ariaDescribedBy,
  ariaInvalid,
  children,
}: BaseFieldProps) {
  const {
    field,
    fieldState: { invalid }
  } = useController({
    name,
    control,
    defaultValue: ''
  });

  return (
    <div className="space-y-1">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-1">
        {children}
      </div>
      {error && (
        <p
          id={`${name}-error`}
          className="mt-1 text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
