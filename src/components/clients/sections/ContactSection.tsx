import { useFormContext } from '../context/FormContext';
import { FormCard } from '../components/FormCard';
import { FormField } from '../components/FormField';
import { PhoneInput } from '../fields/PhoneInput';

export function ContactSection() {
  const { form } = useFormContext();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        name="contact.email"
        label="Email Address *"
        control={form.control}
        type="email"
        required
      />
      <PhoneInput
        name="contact.phone"
        label="Phone Number *"
        control={form.control}
        required
      />
    </div>
  );
}
