import { useFormContext } from '../context/FormContext';
import { FormField } from '../components/FormField';

export function DateOfBirthField() {
  const { form } = useFormContext();

  return (
    <FormField
      name="personal.dob"
      label="Date of Birth"
      control={form.control}
      error={form.formState.errors.personal?.dob?.message}
      type="date"
      min="1920-01-01"
      max={new Date().toISOString().split('T')[0]}
    />
  );
}
