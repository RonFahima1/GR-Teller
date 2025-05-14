import { useFormContext } from '../../context/FormContext';
import { FormField } from '../../components/FormField';

export function PostalCodeField() {
  const { form } = useFormContext();

  return (
    <div className="space-y-1">
      <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
        Postal Code
      </label>
      <input
        id="postalCode"
        name="address.postalCode"
        type="text"
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        placeholder="Enter postal code"
        maxLength={20}
        value={form.getValues('address.postalCode') || ''}
        onChange={(e) => form.setValue('address.postalCode', e.target.value)}
        aria-label="Enter postal code"
        aria-invalid={!!form.formState.errors.address?.postalCode}
        aria-describedby="postalCode-error"
      />
      {form.formState.errors.address?.postalCode?.message && (
        <p id="postalCode-error" className="mt-1 text-sm text-red-600">
          {form.formState.errors.address?.postalCode?.message}
        </p>
      )}
    </div>
  );
}
