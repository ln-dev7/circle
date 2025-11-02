import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Can be imported from a shared config
export const locales = ['en', 'vi'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
   // Validate that the incoming `locale` parameter is valid
   if (!locales.includes(locale as any)) notFound();

   return {
      locale: locale as string,
      messages: (await import(`../messages/${locale}.json`)).default,
   };
});
