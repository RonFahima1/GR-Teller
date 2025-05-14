import { useController } from 'react-hook-form';
import { cn } from '../../../lib/utils';
import { FileData } from '../types/form';
import { useRef } from 'react';

interface FileUploadFieldProps {
  name: string;
  label: string;
  control: any;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  accept?: string;
  maxSize?: number;
  preview?: boolean;
  dragAndDrop?: boolean;
  reloadButton?: boolean;
  showLimits?: boolean;
}

interface UploadedFile {
  file: File;
  previewUrl: string;
  name: string;
  size: number;
  type: string;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export function FileUploadField({
  name,
  label,
  control,
  className = '',
  required = false,
  disabled = false,
  accept = 'image/jpeg,image/png,application/pdf',
  maxSize = 5 * 1024 * 1024,
  preview = true,
  dragAndDrop = false,
  reloadButton = false,
  showLimits = false
}: FileUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    field: { onChange, value },
    fieldState: { error }
  } = useController({
    name,
    control,
    defaultValue: null
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSize) {
      onChange(null);
      return;
    }

    const fileData: FileData = {
      file,
      previewUrl: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      type: file.type
    };

    onChange(fileData);
  };

  const handleFileRemove = () => {
    if (value && value.previewUrl) {
      URL.revokeObjectURL(value.previewUrl);
    }
    onChange(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) {
      const dt = new DataTransfer();
      dt.items.add(file);
      if (inputRef.current) {
        inputRef.current.files = dt.files;
        handleFileChange({ target: inputRef.current } as React.ChangeEvent<HTMLInputElement>);
      }
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor={name}>
        {label}
      </label>
      <div className="relative">
      <div
        className={cn(
          'relative cursor-pointer rounded-lg border-2 border-dashed p-4 text-center transition-all duration-200',
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/80',
          value ? 'border-primary/80' : 'border-gray-300'
        )}
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {value ? (
          <div className="space-y-1">
            {preview && value.previewUrl && (
              <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden">
                <img
                  src={value.previewUrl}
                  alt={value.name}
                  className="h-full w-full object-cover"
                />
                {dragAndDrop && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
                    <span className="text-sm">Drag & drop to replace</span>
                  </div>
                )}
              </div>
            )}
            <div className="flex justify-between text-xs">
              <span className="font-medium text-blue-600">{value.name}</span>
              <span className="text-gray-500">{formatFileSize(value.size)}</span>
            </div>

            <div className="mt-1 flex justify-center gap-2">
              {reloadButton && (
                <button
                  type="button"
                  onClick={() => {
                    handleFileRemove();
                    inputRef.current?.click();
                  }}
                  className="rounded-md bg-blue-500 px-2 py-1 text-xs font-medium text-white hover:bg-blue-600 transition-colors duration-200"
                >
                  Replace
                </button>
              )}
              <button
                type="button"
                onClick={handleFileRemove}
                className="rounded-md bg-red-500 px-2 py-1 text-xs font-medium text-white hover:bg-red-600 transition-colors duration-200"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-center">
              <svg
                className="h-8 w-8 text-gray-400"
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
            </div>
          </div>
        )}
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          ref={inputRef}
          className="hidden"
          disabled={disabled}
        />
      </div>
      {error && (
        <div className="mt-2 p-2 rounded-md bg-red-50 border border-red-200">
          <p className="text-sm text-red-600">
            <span className="font-medium">Error:</span> {error}
          </p>
        </div>
      )}
      </div>
      {error && (
        <p className="text-sm text-red-500 dark:text-red-400 mt-1">{error instanceof Object ? error.message : error}</p>
      )}
    </div>
  );
}
