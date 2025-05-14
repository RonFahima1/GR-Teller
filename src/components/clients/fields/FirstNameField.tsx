import { useFormContext } from '../context/FormContext';
import { FormField } from '../components/FormField';

export function FirstNameField() {
  const { form } = useFormContext();

  return (
    <FormField
      name="personal.firstName"
      label="First Name"
      control={form.control}
      error={form.formState.errors.personal?.firstName?.message}
      placeholder="Enter first name"
      maxLength={50}
    />
  );
}
