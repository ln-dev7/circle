import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
   /* config options here */
   devIndicators: false,
   experimental: {
      optimizeCss: true,
   },
   images: {
      domains: ['your-production-domain.com'], // Add your domains
   },
};

export default withNextIntl(nextConfig);
