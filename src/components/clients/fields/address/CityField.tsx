import { useFormContext } from '../../context/FormContext';
import { FormField } from '../../components/FormField';

export function CityField() {
  const { form } = useFormContext();

  return (
    <div className="space-y-1">
      <label htmlFor="city" className="block text-sm font-medium text-gray-700">
        City
      </label>
      <input
        id="city"
        name="address.city"
        type="text"
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        placeholder="Enter city"
        maxLength={100}
        value={form.getValues('address.city') || ''}
        onChange={(e) => form.setValue('address.city', e.target.value)}
        aria-label="Enter city name"
        aria-invalid={!!form.formState.errors.address?.city}
        aria-describedby="city-error"
      />
      {form.formState.errors.address?.city?.message && (
        <p id="city-error" className="mt-1 text-sm text-red-600">
          {form.formState.errors.address?.city?.message}
        </p>
      )}
    </div>
  );
}
