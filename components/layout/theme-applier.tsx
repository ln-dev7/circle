'use client';

import { useThemeStore } from '@/store/theme-store';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';

/* ------------------------------ color helpers ----------------------------- */

const hexToRgb = (hex: string): [number, number, number] => {
   const value = hex.replace('#', '');
   const full =
      value.length === 3
         ? value
              .split('')
              .map((char) => char + char)
              .join('')
         : value.padEnd(6, '0');
   return [
      parseInt(full.slice(0, 2), 16),
      parseInt(full.slice(2, 4), 16),
      parseInt(full.slice(4, 6), 16),
   ];
};

const rgbToHex = (rgb: [number, number, number]) =>
   `#${rgb
      .map((channel) =>
         Math.round(Math.min(255, Math.max(0, channel)))
            .toString(16)
            .padStart(2, '0')
      )
      .join('')}`;

/** Mix two hex colors: t=0 → a, t=1 → b. */
export const mixHex = (a: string, b: string, t: number): string => {
   const ca = hexToRgb(a);
   const cb = hexToRgb(b);
   return rgbToHex([
      ca[0] + (cb[0] - ca[0]) * t,
      ca[1] + (cb[1] - ca[1]) * t,
      ca[2] + (cb[2] - ca[2]) * t,
   ]);
};

export const isDarkColor = (hex: string): boolean => {
   const [r, g, b] = hexToRgb(hex);
   return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5;
};

/* --------------------------- custom theme builder -------------------------- */

interface Surface {
   background: string;
   accent: string;
   contrast: number;
}

const surfaceVars = (surface: Surface, prefix: '' | 'sidebar') => {
   const { background, accent } = surface;
   const dark = isDarkColor(background);
   const fg = dark ? '#f7f8f8' : '#17171c';
   const k = surface.contrast / 100;
   const border = mixHex(background, fg, 0.08 + 0.14 * k);
   const subtle = mixHex(background, fg, 0.05 + 0.09 * k);

   if (prefix === 'sidebar') {
      return {
         '--sidebar': background,
         '--sidebar-foreground': fg,
         '--sidebar-border': border,
         '--sidebar-accent': subtle,
         '--sidebar-accent-foreground': fg,
         '--sidebar-primary': accent,
         '--sidebar-primary-foreground': isDarkColor(accent) ? '#ffffff' : '#17171c',
         '--sidebar-ring': mixHex(accent, background, 0.35),
      } as Record<string, string>;
   }

   return {
      '--background': background,
      '--foreground': fg,
      '--container': mixHex(background, dark ? '#ffffff' : '#000000', 0.03),
      '--card': mixHex(background, dark ? '#ffffff' : '#000000', 0.03),
      '--card-foreground': fg,
      '--popover': mixHex(background, dark ? '#ffffff' : '#000000', 0.05),
      '--popover-foreground': fg,
      '--secondary': subtle,
      '--secondary-foreground': fg,
      '--muted': subtle,
      '--muted-foreground': mixHex(fg, background, 0.35),
      '--accent': subtle,
      '--accent-foreground': fg,
      '--border': border,
      '--input': border,
      '--ring': mixHex(accent, background, 0.3),
      '--primary': accent,
      '--primary-foreground': isDarkColor(accent) ? '#ffffff' : '#17171c',
   } as Record<string, string>;
};

/** Every variable the custom theme may set (for cleanup). */
const CUSTOM_VARS = [
   ...Object.keys(surfaceVars({ background: '#000000', accent: '#000000', contrast: 50 }, '')),
   ...Object.keys(
      surfaceVars({ background: '#000000', accent: '#000000', contrast: 50 }, 'sidebar')
   ),
];

/**
 * Applies the theme-store state to the DOM: keeps next-themes in charge of
 * the light/dark/system class, adds `data-app-theme` for the named variants
 * (pure-light, magic-blue, classic-dark — styled in globals.css) and inlines
 * generated CSS variables for the fully custom theme.
 */
export function ThemeApplier() {
   const { mode, lightVariant, darkVariant, custom } = useThemeStore();
   const { resolvedTheme, setTheme } = useTheme();

   // Keep next-themes in sync with the selected mode.
   useEffect(() => {
      if (mode === 'system') setTheme('system');
      else if (mode === 'light') setTheme('light');
      else if (mode === 'dark') setTheme('dark');
      else setTheme(isDarkColor(custom.background) ? 'dark' : 'light');
   }, [mode, custom.background, setTheme]);

   // Apply the variant / custom variables.
   useEffect(() => {
      const root = document.documentElement;

      for (const name of CUSTOM_VARS) root.style.removeProperty(name);

      if (mode === 'custom') {
         root.dataset.appTheme = 'custom';
         const vars = {
            ...surfaceVars(custom, ''),
            ...(custom.sidebar
               ? surfaceVars(
                    {
                       background: custom.sidebarBackground,
                       accent: custom.sidebarAccent,
                       contrast: custom.sidebarContrast,
                    },
                    'sidebar'
                 )
               : {
                    '--sidebar': mixHex(
                       custom.background,
                       isDarkColor(custom.background) ? '#ffffff' : '#000000',
                       0.02
                    ),
                    '--sidebar-foreground': surfaceVars(custom, '')['--foreground'],
                    '--sidebar-border': surfaceVars(custom, '')['--border'],
                    '--sidebar-accent': surfaceVars(custom, '')['--accent'],
                 }),
         };
         for (const [name, value] of Object.entries(vars)) root.style.setProperty(name, value);
         return;
      }

      const variant = resolvedTheme === 'dark' ? darkVariant : lightVariant;
      if (variant === 'light' || variant === 'dark') delete root.dataset.appTheme;
      else root.dataset.appTheme = variant;
   }, [mode, lightVariant, darkVariant, custom, resolvedTheme]);

   return null;
}
