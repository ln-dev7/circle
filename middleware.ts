import { auth } from '@/lib/auth';
import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n';

const intlMiddleware = createMiddleware({
   locales: locales,
   defaultLocale: 'en',
   localePrefix: 'as-needed',
});

export default auth(async (req) => {
   const { nextUrl } = req;
   const pathname = nextUrl.pathname;

   console.log('Middleware processing:', pathname);

   // Skip middleware for static files and API routes
   if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
      console.log('Skipping middleware for static/API route');
      return null;
   }

   // Check if user is logged in first
   const isLoggedIn = !!req.auth;
   console.log('Is logged in:', isLoggedIn);

   // If user is logged in, skip i18n middleware to prevent locale redirects
   if (isLoggedIn) {
      console.log('User logged in, skipping i18n middleware');

      // Only guard organization routes: /[orgId]/**
      const isOrgRoute = (() => {
         if (pathname === '/') return false;
         if (pathname.startsWith('/auth')) return false;
         if (pathname.startsWith('/api')) return false;
         if (pathname.startsWith('/_next')) return false;
         if (pathname.startsWith('/test')) return false;
         if (/\.[\w]+$/.test(pathname)) return false; // assets
         // Consider any first-segment path as org route for now
         return /^\/[^/]+(\/.*)?$/.test(pathname);
      })();

      console.log('Is org route:', isOrgRoute);

      if (isOrgRoute) {
         console.log('User accessing org route, allowing');
         return null;
      }

      console.log('Middleware allowing request for logged in user');
      return null;
   }

   // Handle i18n routing ONLY for unauthenticated users and specific paths
   if (pathname === '/' || pathname.startsWith('/auth') || pathname.startsWith('/test')) {
      console.log('Applying i18n middleware for unauthenticated user:', pathname);
      const intlResponse = intlMiddleware(req);
      if (intlResponse) {
         console.log('i18n response returned');
         return intlResponse;
      }
   }

   // Allow test page
   if (pathname === '/test') {
      console.log('Allowing test page');
      return null;
   }

   // Only guard organization routes: /[orgId]/**
   const isOrgRoute = (() => {
      if (pathname === '/') return false;
      if (pathname.startsWith('/auth')) return false;
      if (pathname.startsWith('/api')) return false;
      if (pathname.startsWith('/_next')) return false;
      if (pathname.startsWith('/test')) return false;
      if (/\.[\w]+$/.test(pathname)) return false; // assets
      // Consider any first-segment path as org route for now
      return /^\/[^/]+(\/.*)?$/.test(pathname);
   })();

   console.log('Is org route:', isOrgRoute);

   if (!isLoggedIn && isOrgRoute) {
      console.log('Redirecting to signin');
      const url = new URL('/auth/signin', nextUrl);
      url.searchParams.set('callbackUrl', nextUrl.href);
      return Response.redirect(url);
   }

   console.log('Middleware allowing request');
   return null;
});

export const config = {
   matcher: [
      // Match all paths except Next internals and static files
      '/((?!api/health|_next|.*\\..*).*)',
   ],
};
