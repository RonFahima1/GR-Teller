import { useFormContext } from '../context/FormContext';
import { FormCard } from '../components/FormCard';
import { FormField } from '../components/FormField';
import { ID_TYPES } from '../constants';

export function IdentificationSection() {
  const { form } = useFormContext();

  return (
    <FormCard title="Identification Information">
      <FormField
        name="identification.idType"
        label="ID Type"
        control={form.control}
        as="select"
        options={ID_TYPES.map((type) => ({ value: type, label: type }))}
      />
      <FormField
        name="identification.idNumber"
        label="ID Number"
        control={form.control}
        error={form.formState.errors.identification?.idNumber?.message}
        placeholder="Enter ID number"
      />
      <FormField
        name="identification.issueDate"
        label="Issue Date"
        control={form.control}
        type="date"
        error={form.formState.errors.identification?.issueDate?.message}
      />
      <FormField
        name="identification.expiryDate"
        label="Expiry Date"
        control={form.control}
        type="date"
        error={form.formState.errors.identification?.expiryDate?.message}
      />
    </FormCard>
  );
}
