'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from 'next-themes';

export const ThemeProvider = React.memo(function ThemeProvider({
   children,
   ...props
}: ThemeProviderProps) {
   return (
      <NextThemesProvider {...props} enableSystem enableColorScheme disableTransitionOnChange>
         {children}
      </NextThemesProvider>
   );
});
