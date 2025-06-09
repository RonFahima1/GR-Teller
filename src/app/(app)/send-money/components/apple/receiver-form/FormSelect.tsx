import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  error?: string;
  disabled?: boolean;
}

export function FormSelect({
  label,
  value,
  onChange,
  options,
  error,
  disabled = false
}: FormSelectProps) {
  const id = `form-select-${label.toLowerCase().replace(/\s+/g, '-')}`;
  
  return (
    <div className="flex flex-col">
      <label 
        htmlFor={id}
        className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={cn(
            "w-full appearance-none px-3 py-2 rounded-lg border",
            "focus:outline-none focus:ring-2 focus:ring-[#007AFF] dark:focus:ring-[#0A84FF] focus:border-transparent",
            "bg-white dark:bg-[#3A3A3C]",
            "text-gray-900 dark:text-white",
            "transition-colors duration-200",
            error
              ? "border-[#FF3B30] dark:border-[#FF453A] bg-red-50 dark:bg-[#3A3A3C]"
              : "border-gray-200 dark:border-[#545458]",
            disabled && "opacity-60 cursor-not-allowed"
          )}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none text-gray-500 dark:text-gray-400" />
      </div>
      {error && (
        <p className="mt-1 text-xs text-[#FF3B30] dark:text-[#FF453A]">
          {error}
        </p>
      )}
    </div>
  );
}
