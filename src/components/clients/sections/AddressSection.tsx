import { useFormContext } from '../context/FormContext';
import { FormField } from '../components/FormField';
import { CountrySelect } from '../fields/CountrySelect';

export function AddressSection() {
  const { form } = useFormContext();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        name="address.street"
        label="Street Address *"
        control={form.control}
        required
      />
      <FormField
        name="address.city"
        label="City *"
        control={form.control}
        required
      />
      <FormField
        name="address.state"
        label="State/Province *"
        control={form.control}
        required
      />
      <FormField
        name="address.postalCode"
        label="Postal Code *"
        control={form.control}
        required
      />
      <CountrySelect
        name="address.country"
        label="Country *"
        control={form.control}
        required
        className="col-span-2"
      />
    </div>
  );
}
