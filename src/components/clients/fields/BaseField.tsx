import { useFormContext } from '../context/FormContext';
import { FormFieldWrapper } from '../components/FormFieldWrapper';
import { FormField } from '../components/FormField';
import { DocumentType, NewClientFormData } from '../types/form';

interface BaseFieldProps {
  name: keyof NewClientFormData | DocumentType;
  label: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
}

export function BaseField({
  name,
  label,
  className = '',
  required = false,
  disabled = false,
  children
}: BaseFieldProps) {
  const { form } = useFormContext();
  const error = form.formState.errors[name as keyof NewClientFormData]?.message;

  return (
    <FormFieldWrapper
      name={name}
      label={label}
      className={className}
      required={required}
      disabled={disabled}
      error={error}
    >
      {children || (
        <FormField
          name={name}
          label={label}
          control={form.control}
          error={error}
          disabled={disabled}
        />
      )}
    </FormFieldWrapper>
  );
}
