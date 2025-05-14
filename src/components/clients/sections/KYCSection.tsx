import { useFormContext } from '../context/FormContext';
import { FormCard } from '../components/FormCard';
import { FormField } from '../components/FormField';
import { DateField } from '../fields/DateField';
import { CountrySelect } from '../fields/CountrySelect';
import { NewClientFormData } from '../types/newClientForm';
import { DocumentType } from '../types/form';

interface DateFieldProps {
  name: keyof NewClientFormData['identification'] | DocumentType;
  label: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  minDate?: string;
  maxDate?: string;
  placeholder?: string;
  format?: string;
}

export function KYCSection() {
  const { form } = useFormContext();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        name="identification.idType"
        label="ID Type *"
        control={form.control}
        required
        as="select"
        options={[
          { value: 'passport', label: 'Passport' },
          { value: 'national_id', label: 'National ID' },
          { value: 'drivers_license', label: 'Driver\'s License' }
        ]}
      />
      <CountrySelect
        name="identification.issuanceCountry"
        label="Issuance Country *"
        control={form.control}
        required
      />
      <FormField
        name="identification.idNumber"
        label="ID Number *"
        control={form.control}
        required
        placeholder="Enter ID number"
      />
      <DateField
        name="identification.idIssueDate"
        label="ID Issue Date *"
        control={form.control}
        required
        minDate="1900-01-01"
        maxDate="2099-12-31"
        placeholder="Select issue date"
      />
      <DateField
        name="identification.idExpiryDate"
        label="ID Expiry Date *"
        control={form.control}
        required
        minDate="1900-01-01"
        maxDate="2099-12-31"
        placeholder="Select expiry date"
      />
    </div>
  );
}
