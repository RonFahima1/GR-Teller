import { useFormContext } from '../../context/FormContext';
import { FormFieldWrapper } from '../components/FormFieldWrapper';
import { FormField } from '../components/FormField';

interface PhoneFieldProps {
  name: string;
  label: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export function PhoneField({
  name,
  label,
  className = '',
  required = false,
  disabled = false,
  placeholder = '+1 (555) 123-4567'
}: PhoneFieldProps) {
  const { form } = useFormContext();

  return (
    <FormFieldWrapper
      name={name}
      label={label}
      className={className}
      required={required}
      disabled={disabled}
    >
      <FormField
        name={name}
        label=""
        control={form.control}
        type="tel"
        error={form.formState.errors[name]?.message}
        disabled={disabled}
        placeholder={placeholder}
      />
    </FormFieldWrapper>
  );
}
