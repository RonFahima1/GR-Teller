import { useFormContext } from '../../context/FormContext';
import { FormField } from '../../components/FormField';

const COUNTRY_CODES = [
  { code: '+1', country: 'United States' },
  { code: '+44', country: 'United Kingdom' },
  { code: '+49', country: 'Germany' },
  { code: '+33', country: 'France' },
  { code: '+39', country: 'Italy' },
  { code: '+81', country: 'Japan' },
  { code: '+82', country: 'South Korea' },
  { code: '+86', country: 'China' },
  { code: '+61', country: 'Australia' },
  { code: '+65', country: 'Singapore' }
];

export function PhoneField() {
  const { form } = useFormContext();

  const handleCountryChange = (code: string) => {
    const areaCode = form.getValues('contact.areaCode') || '';
    const phoneNumber = form.getValues('contact.phoneNumber')?.split(' ')[2] || '';
    form.setValue('contact.phoneNumber', `${code} (${areaCode}) ${phoneNumber}`);
  };

  const handleAreaChange = (areaCode: string) => {
    const countryAndArea = form.getValues('contact.phoneNumber')?.split(' ')[0] || '+1';
    const phoneNumber = form.getValues('contact.phoneNumber')?.split(' ')[2] || '';
    form.setValue('contact.areaCode', areaCode);
    form.setValue('contact.phoneNumber', `${countryAndArea} (${areaCode}) ${phoneNumber}`);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const countryAndArea = form.getValues('contact.phoneNumber')?.split(' ')[0] || '+1';
    const areaCode = form.getValues('contact.areaCode') || '';
    form.setValue('contact.phoneNumber', `${countryAndArea} (${areaCode}) ${value}`);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Phone Number</label>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <select
            value={form.getValues('contact.phoneNumber')?.split(' ')[0] || '+1'}
            onChange={(e) => handleCountryChange(e.target.value)}
            className="mt-1 block w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            {COUNTRY_CODES.map((country) => (
              <option key={country.code} value={country.code}>
                {country.country} ({country.code})
              </option>
            ))}
          </select>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Area Code"
              value={form.getValues('contact.areaCode') || ''}
              onChange={(e) => handleAreaChange(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <input
              type="tel"
              placeholder="Phone Number"
              value={form.getValues('contact.phoneNumber')?.split(' ')[2] || ''}
              onChange={handlePhoneChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {form.formState.errors.contact?.phoneNumber?.message && (
        <p className="mt-1 text-sm text-red-600">
          {form.formState.errors.contact?.phoneNumber?.message}
        </p>
      )}
    </div>
  );
}
