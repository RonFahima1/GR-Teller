import { useFormContext } from '../context/FormContext';
import { FormCard } from '../components/FormCard';
import { FormField } from '../components/FormField';
import { FileUploadField } from '../fields/FileUploadField';
import { Controller } from 'react-hook-form';
import { FileData } from '../types/form';

export function DocumentSection() {
  const { form, handleFileUpload } = useFormContext();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FileUploadField
        name="documents.idFront"
        label="ID Front *"
        control={form.control}
        required
        maxSize={5242880}
        accept="application/pdf,image/jpeg,image/png"
      />
      <FileUploadField
        name="documents.idBack"
        label="ID Back *"
        control={form.control}
        required
        maxSize={5242880}
        accept="application/pdf,image/jpeg,image/png"
      />
      <FileUploadField
        name="documents.proofOfAddress"
        label="Proof of Address *"
        control={form.control}
        required
        maxSize={5242880}
        accept="application/pdf,image/jpeg,image/png"
      />
    </div>
  );
}
