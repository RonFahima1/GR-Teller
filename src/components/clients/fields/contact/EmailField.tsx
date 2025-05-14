import { useFormContext } from '../../context/FormContext';
import { FormField } from '../../components/FormField';

export function EmailField() {
  const { form } = useFormContext();

  return (
    <FormField
      name="contact.email"
      label="Email Address"
      control={form.control}
      error={form.formState.errors.contact?.email?.message}
      type="email"
      placeholder="Enter email address"
      maxLength={255}
    />
  );
}
