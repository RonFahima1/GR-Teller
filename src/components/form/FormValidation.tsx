"use client";

import { ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormValidationProps {
  name: string;
  children: ReactNode;
  className?: string;
}

export function FormValidation({ name, children, className }: FormValidationProps) {
  const {
    formState: { errors },
  } = useFormContext();

  const error = errors[name];
  const errorMessage = error?.message as string;

  return (
    <div className={cn("space-y-2", className)}>
      {children}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="h-4 w-4" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}

// Validation messages
export const validationMessages = {
  required: "This field is required",
  email: "Please enter a valid email address",
  minLength: (min: number) => `Must be at least ${min} characters`,
  maxLength: (max: number) => `Must be at most ${max} characters`,
  pattern: "Invalid format",
  min: (min: number) => `Must be at least ${min}`,
  max: (max: number) => `Must be at most ${max}`,
  number: "Must be a number",
  phone: "Please enter a valid phone number",
  password: {
    minLength: "Password must be at least 8 characters",
    uppercase: "Password must contain at least one uppercase letter",
    lowercase: "Password must contain at least one lowercase letter",
    number: "Password must contain at least one number",
    special: "Password must contain at least one special character",
  },
  confirmPassword: "Passwords do not match",
  amount: {
    min: (min: number) => `Amount must be at least ${min}`,
    max: (max: number) => `Amount must be at most ${max}`,
    required: "Please enter an amount",
  },
  date: {
    past: "Date must be in the past",
    future: "Date must be in the future",
    format: "Please enter a valid date",
  },
  file: {
    size: (max: number) => `File size must be less than ${max}MB`,
    type: "Invalid file type",
    required: "Please select a file",
  },
}; 