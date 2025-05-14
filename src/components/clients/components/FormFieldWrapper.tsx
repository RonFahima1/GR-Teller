                   import React, { ReactNode } from 'react';
import { useFormContext } from '../context/FormContext';
import { FormField } from './FormField';
import { DocumentType, NewClientFormData } from '../types/form';

interface FormFieldWrapperProps {
  name: string;
  label: string;
  children?: ReactNode;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  isFileUpload?: boolean;
  accept?: string;
  maxSize?: number;
  error?: string;
}

export const FormFieldWrapper: React.FC<FormFieldWrapperProps> = ({
  name,
  label,
  children,
  className = '',
  required = false,
  disabled = false,
  isFileUpload = false,
  accept,
  maxSize
}) => {
  const { form, state, handleFileUpload, handleFileRemove } = useFormContext();
  const error = form.formState.errors[name as string];
  const fileError = state.errors[name as keyof typeof state.errors];

  const errorMessage = error ? (error as any).message : null;
  const fileErrorMessage = fileError ? (fileError as any) : null;

  return (
    <div className={`space-y-1 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {isFileUpload ? (
        <div className="flex flex-col gap-2">
          {children}
          {state.fileUploads[name as DocumentType] && (
            <div className="flex items-center gap-2">
              <img
                src={state.fileUploads[name as DocumentType]?.previewUrl}
                alt="Uploaded document"
                className="w-20 h-20 object-cover rounded"
              />
              <button
                onClick={() => handleFileRemove(name as DocumentType)}
                className="text-red-500 hover:text-red-700"
                type="button"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      ) : (
        children || (
          <FormField
            name={name}
            label=""
            control={form.control}
            error={errorMessage}
            disabled={disabled}
          />
        )
      )}

      {(errorMessage || fileErrorMessage) && (
        <p className="mt-1 text-sm text-red-600">
          {errorMessage || fileErrorMessage}
        </p>
      )}
    </div>
  );
}
