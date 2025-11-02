'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Languages } from 'lucide-react';
import { locales } from '@/lib/i18n';

export default function LanguageSwitcher() {
   const t = useTranslations('common');
   const locale = useLocale();
   const router = useRouter();
   const pathname = usePathname();

   const switchLocale = (newLocale: string) => {
      // Store the locale preference
      localStorage.setItem('locale', newLocale);

      // For now, reload the page to apply the new locale
      // In production, you might want to implement proper locale routing
      window.location.reload();
   };

   return (
      <div className="bg-card rounded-lg border p-6">
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <Languages size={20} className="text-muted-foreground" />
               <div>
                  <h3 className="font-medium text-card-foreground">{t('language')}</h3>
                  <p className="text-sm text-muted-foreground">Choose your preferred language</p>
               </div>
            </div>
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="min-w-[120px]">
                     {locale === 'en' ? t('english') : t('vietnamese')}
                  </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end">
                  <DropdownMenuItem
                     onClick={() => switchLocale('en')}
                     className={locale === 'en' ? 'bg-accent' : ''}
                  >
                     {t('english')}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                     onClick={() => switchLocale('vi')}
                     className={locale === 'vi' ? 'bg-accent' : ''}
                  >
                     {t('vietnamese')}
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         </div>
      </div>
   );
}
