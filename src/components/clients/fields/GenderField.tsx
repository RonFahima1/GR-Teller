import { useFormContext } from '../context/FormContext';
import { FormField } from '../components/FormField';

export function GenderField() {
  const { form } = useFormContext();

  return (
    <FormField
      name="personal.gender"
      label="Gender *"
      control={form.control}
      as="select"
      options={[
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' },
      ]}
      required
    />
  );
}
