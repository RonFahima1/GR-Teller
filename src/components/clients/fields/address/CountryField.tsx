import { useFormContext } from '../../context/FormContext';
import { FormField } from '../../components/FormField';
import { COUNTRIES } from '../../constants/countries';

export function CountryField() {
  const { form } = useFormContext();

  return (
    <div className="space-y-1">
      <label htmlFor="country" className="block text-sm font-medium text-gray-700">
        Country
      </label>
      <select
        id="country"
        name="address.country"
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        value={form.getValues('address.country') || ''}
        onChange={(e) => form.setValue('address.country', e.target.value)}
        aria-label="Select country"
        aria-invalid={!!form.formState.errors.address?.country}
        aria-describedby="country-error"
      >
        <option value="">Select country</option>
        {COUNTRIES.map((country) => (
          <option key={country.value} value={country.value}>
            {country.label}
          </option>
        ))}
      </select>
      {form.formState.errors.address?.country?.message && (
        <p id="country-error" className="mt-1 text-sm text-red-600">
          {form.formState.errors.address?.country?.message}
        </p>
      )}
    </div>
  );
}
