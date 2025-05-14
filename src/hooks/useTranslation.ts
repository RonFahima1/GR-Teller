"use client";

import { useLanguage } from '@/components/providers/LanguageProvider';

export function useTranslation() {
  const { language } = useLanguage();

  // Simple translation function - in a real app this would use a proper i18n library
  const t = (key: string, params?: Record<string, any>): string => {
    // Just return the key for now as a simple implementation
    return key;
  };

  return {
    t,
    language
  };
} 