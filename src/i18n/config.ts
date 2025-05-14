export const defaultLocale = "en" as const;
export const locales = ["en", "es", "fr", "ar", "he"] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  ar: "العربية",
  he: "עברית",
};

export const localeDirections: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  es: "ltr",
  fr: "ltr",
  ar: "rtl",
  he: "rtl",
}; 