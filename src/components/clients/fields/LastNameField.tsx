import { useFormContext } from '../context/FormContext';
import { FormField } from '../components/FormField';

export function LastNameField() {
  const { form } = useFormContext();

  return (
    <FormField
      name="personal.lastName"
      label="Last Name"
      control={form.control}
      error={form.formState.errors.personal?.lastName?.message}
      placeholder="Enter last name"
      maxLength={50}
    />
  );
}
