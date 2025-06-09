import React from 'react';
import { cn } from '@/lib/utils';

interface FormInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

export function FormInput({
  label,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  error,
  disabled = false
}: FormInputProps) {
  const id = `form-input-${label.toLowerCase().replace(/\s+/g, '-')}`;
  
  return (
    <div className="flex flex-col">
      <label 
        htmlFor={id}
        className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "w-full px-3 py-2 rounded-lg border",
          "focus:outline-none focus:ring-2 focus:ring-[#007AFF] dark:focus:ring-[#0A84FF] focus:border-transparent",
          "bg-white dark:bg-[#3A3A3C]",
          "text-gray-900 dark:text-white",
          "placeholder:text-gray-400 dark:placeholder:text-gray-500",
          "transition-colors duration-200",
          error
            ? "border-[#FF3B30] dark:border-[#FF453A] bg-red-50 dark:bg-[#3A3A3C]"
            : "border-gray-200 dark:border-[#545458]",
          disabled && "opacity-60 cursor-not-allowed"
        )}
      />
      {error && (
        <p className="mt-1 text-xs text-[#FF3B30] dark:text-[#FF453A]">
          {error}
        </p>
      )}
    </div>
  );
}
