import { useFormContext } from '../context/FormContext';
import { FormCard } from '../components/FormCard';
import { FormField } from '../components/FormField';

export function EmploymentSection() {
  const { form } = useFormContext();

  return (
    <FormCard title="Employment Information">
      <FormField
        name="employment.occupation"
        label="Occupation"
        control={form.control}
        error={form.formState.errors.employment?.occupation?.message}
        placeholder="Enter occupation"
      />
      <FormField
        name="employment.employer"
        label="Employer"
        control={form.control}
        error={form.formState.errors.employment?.employer?.message}
        placeholder="Enter employer name"
      />
      <FormField
        name="employment.income"
        label="Annual Income"
        control={form.control}
        error={form.formState.errors.employment?.income?.message}
        placeholder="Enter annual income"
        type="number"
        min="0"
      />
    </FormCard>
  );
}
