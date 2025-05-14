import { useFormContext } from '../context/FormContext';
import { COUNTRIES } from '../constants/countries';
import { FormField } from '../components/FormField';

export function NationalityField() {
  const { form } = useFormContext();

  return (
    <FormField
      name="personal.nationality"
      label="Nationality"
      control={form.control}
      required
      as="select"
      options={COUNTRIES.map(country => ({
        value: country.value,
        label: country.label
      }))}
    />
  );
}
