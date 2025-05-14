import { useFormContext } from '../context/FormContext';
import { FormCard } from '../components/FormCard';
import { FormField } from '../components/FormField';
import { Controller } from 'react-hook-form';
import { NewClientFormData } from '../types/form';
import { NationalityField } from '../fields/NationalityField';
import { GenderField } from '../fields/GenderField';
import { CountrySelect } from '../fields/CountrySelect';

export function PersonalInfoSection() {
  const { form } = useFormContext();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        name="personal.firstName"
        label="First Name *"
        control={form.control}
        required
      />
      <FormField
        name="personal.middleName"
        label="Middle Name"
        control={form.control}
      />
      <FormField
        name="personal.lastName"
        label="Last Name *"
        control={form.control}
        required
      />
      <FormField
        name="personal.dob"
        label="Date of Birth *"
        control={form.control}
        type="date"
        required
      />
      <GenderField
        name="personal.gender"
        label="Gender *"
        control={form.control}
        required
      />
      <CountrySelect
        name="personal.nationality"
        label="Nationality *"
        control={form.control}
        required
      />
    </div>
  );
}
