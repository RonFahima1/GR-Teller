'use client'

import { toast } from 'react-hot-toast';

export function useToast() {
  return {
    success: (message: string, options?: { duration?: number }) => {
      return toast.success(message, options);
    },
    error: (message: string, options?: { duration?: number }) => {
      return toast.error(message, options);
    },
    info: (message: string, options?: { duration?: number }) => {
      return toast(message, options);
    },
    loading: (message: string, options?: { duration?: number }) => {
      return toast.loading(message, options);
    },
    dismiss: (id: string) => {
      return toast.dismiss(id);
    },
  };
}
