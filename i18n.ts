import { getRequestConfig } from 'next-intl/server';

// Can be imported from a shared config
export const locales = ['en', 'vi'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
   // Validate that the incoming `locale` parameter is valid
   const validLocale = locales.includes(locale as any) ? locale : 'en';

   return {
      locale: validLocale as string,
      messages: (await import(`./messages/${validLocale}.json`)).default,
   };
});
