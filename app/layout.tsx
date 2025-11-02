import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { SessionProvider } from 'next-auth/react';
import './globals.css';

const geistSans = Geist({
   variable: '--font-geist-sans',
   subsets: ['latin'],
});

const geistMono = Geist_Mono({
   variable: '--font-geist-mono',
   subsets: ['latin'],
});

const siteUrl = 'https://circle.lndev.me';

export const metadata: Metadata = {
   title: {
      template: '%s | Circle by lndev-ui',
      default: 'Circle by lndev-ui',
   },
   description:
      'Project management interface inspired by Linear. Built with Next.js and shadcn/ui, this application allows tracking of issues, projects and teams with a modern, responsive UI.',
   openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteUrl,
      siteName: 'Circle',
      images: [
         {
            url: `${siteUrl}/banner.png`,
            width: 2560,
            height: 1440,
            alt: 'lndev/ui',
         },
      ],
   },
   twitter: {
      card: 'summary_large_image',
      site: '@ln_dev7',
      creator: '@ln_dev7',
      images: [
         {
            url: `${siteUrl}/banner.png`,
            width: 2560,
            height: 1440,
            alt: 'Circle',
         },
      ],
   },
   authors: [{ name: 'Leonel NGOYA', url: 'https://lndev.me/' }],
   keywords: ['ui', 'lndev', 'components', 'template'],
};

import { ThemeProvider } from '@/components/layout/theme-provider';

export default async function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   const messages = await getMessages();

   return (
      <html lang="en" suppressHydrationWarning>
         <head>
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
         </head>
         <body
            suppressHydrationWarning
            className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background`}
         >
            <NextIntlClientProvider messages={messages}>
               <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
                  <SessionProvider>
                     {children}
                     <Toaster />
                  </SessionProvider>
               </ThemeProvider>
            </NextIntlClientProvider>
         </body>
      </html>
   );
}
