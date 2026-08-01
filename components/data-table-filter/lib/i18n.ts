import en from '../locales/en.json'

export type Locale = 'en'

type Translations = Record<string, string>

const translations: Record<Locale, Translations> = {
  en,
}

export function t(key: string, locale: Locale): string {
  return translations[locale][key] ?? key
}
