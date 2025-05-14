import { useFormContext } from '../context/FormContext';
import { DocumentType, FileData } from '../../../components/clients/types/form';
import { useState } from 'react';

interface FileUploadProps {
  type: DocumentType;
  label: string;
  error?: string;
}

export function FileUpload({ type, label, error }: FileUploadProps) {
  const { form, handleFileUpload, handleFileRemove, state } = useFormContext();
  const [isDragging, setIsDragging] = useState(false);
  const file = form.getValues(`documents.${type}`) as FileData | undefined;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(type, file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(type, file);
    }
  };

  const handleRemove = () => {
    handleFileRemove(type);
  };

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div
        className={`relative border-2 border-dashed rounded-lg p-4 cursor-pointer transition-colors duration-200 ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onDrop={handleDrop}
      >
        {file ? (
          <div className="flex items-center space-x-4">
            <img
              src={file.previewUrl}
              alt={file.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">{file.name}</p>
              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
            </div>
            <button
              onClick={handleRemove}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <div className="mt-2 text-sm text-gray-600">
              <p>Drag and drop your file here, or click to browse</p>
              <p className="mt-1 text-xs text-gray-500">
                PNG, JPG, PDF up to 10MB
              </p>
            </div>
          </div>
        )}
        <input
          type="file"
          className="hidden"
          onChange={handleFileSelect}
          accept="image/png,image/jpeg,application/pdf"
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
