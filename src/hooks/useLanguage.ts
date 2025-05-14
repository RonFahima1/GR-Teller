import { useContext } from "react";
import { LanguageContext } from "@/components/providers/LanguageProvider";
import { Locale, defaultLocale } from "@/i18n/config";

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Return default values when context is not available
    return {
      locale: defaultLocale,
      setLocale: () => console.warn("LanguageProvider not initialized"),
    };
  }
  return context;
}

export function useDirection() {
  const { locale } = useLanguage();
  return locale === "ar" || locale === "he" ? "rtl" : "ltr";
} 