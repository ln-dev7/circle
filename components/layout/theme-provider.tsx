'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from 'next-themes';
import { ThemeApplier } from '@/components/layout/theme-applier';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
   return (
      <NextThemesProvider {...props} enableSystem enableColorScheme disableTransitionOnChange>
         <ThemeApplier />
         {children}
      </NextThemesProvider>
   );
}
