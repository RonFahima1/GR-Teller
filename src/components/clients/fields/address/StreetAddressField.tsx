import { useFormContext } from '../../context/FormContext';

export function StreetAddressField() {
  const { form } = useFormContext();

  return (
    <div className="space-y-1">
      <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700">
        Street Address
      </label>
      <input
        id="streetAddress"
        name="address.streetAddress"
        type="text"
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        placeholder="Enter street address"
        maxLength={255}
        value={form.getValues('address.streetAddress') || ''}
        onChange={(e) => form.setValue('address.streetAddress', e.target.value)}
        aria-label="Enter street address"
        aria-invalid={!!form.formState.errors.address?.streetAddress}
        aria-describedby="streetAddress-error"
      />
      {form.formState.errors.address?.streetAddress?.message && (
        <p id="streetAddress-error" className="mt-1 text-sm text-red-600">
          {form.formState.errors.address?.streetAddress?.message}
        </p>
      )}
    </div>
  );
}
