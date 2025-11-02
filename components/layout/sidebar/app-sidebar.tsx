'use client';

import { RiGithubLine } from '@remixicon/react';
import * as React from 'react';
import { useTranslations } from 'next-intl';

import { HelpButton } from '@/components/layout/sidebar/help-button';
import { NavInbox } from '@/components/layout/sidebar/nav-inbox';
import { NavTeams } from '@/components/layout/sidebar/nav-teams';
import { NavWorkspace } from '@/components/layout/sidebar/nav-workspace';
import { NavAccount } from '@/components/layout/sidebar/nav-account';
import { NavFeatures } from '@/components/layout/sidebar/nav-features';
import { NavTeamsSettings } from '@/components/layout/sidebar/nav-teams-settings';
import { OrgSwitcher } from '@/components/layout/sidebar/org-switcher';
import { Button } from '@/components/ui/button';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';
import Link from 'next/link';
import { X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { BackToApp } from '@/components/layout/sidebar/back-to-app';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
   const [open, setOpen] = React.useState(true);
   const pathname = usePathname();
   const isSettings = pathname.includes('/settings');
   const isOrgPage = pathname.match(/^\/[^\/]+$/); // Matches /orgId pattern
   const t = useTranslations('sidebar');

   return (
      <Sidebar collapsible="offcanvas" {...props}>
         <SidebarHeader>{isSettings ? <BackToApp /> : <OrgSwitcher />}</SidebarHeader>
         <SidebarContent>
            {isSettings ? (
               <>
                  <NavAccount />
                  <NavFeatures />
                  <NavTeamsSettings />
               </>
            ) : isOrgPage ? (
               <>
                  <NavWorkspace />
               </>
            ) : (
               <>
                  <NavInbox />
                  <NavWorkspace />
                  <NavTeams />
               </>
            )}
         </SidebarContent>
         <SidebarFooter>
            <div className="w-full flex flex-col gap-2">
               {open && (
                  <div className="group/sidebar relative flex flex-col gap-2 rounded-lg border p-4 text-sm w-full">
                     <div
                        className="absolute top-2.5 right-2 z-10 cursor-pointer"
                        onClick={() => setOpen(!open)}
                        role="button"
                     >
                        <X className="size-4" />
                     </div>
                     <div className="text-balance text-lg font-semibold leading-tight group-hover/sidebar:underline">
                        {t('open_source_layouts')}
                     </div>
                     <div>{t('layouts_description')}</div>
                     <Link
                        target="_blank"
                        rel="noreferrer"
                        className="absolute inset-0"
                        href="https://square.lndev.me"
                     >
                        <span className="sr-only">Square by lndev-ui</span>
                     </Link>
                     <Button size="sm" className="w-full">
                        <Link
                           href="https://square.lndev.me"
                           target="_blank"
                           rel="noopener noreferrer"
                        >
                           {t('visit_square')}
                        </Link>
                     </Button>
                  </div>
               )}
               <a className="my-1.5" href="https://vercel.com/oss">
                  <img alt="Vercel OSS Program" src="https://vercel.com/oss/program-badge.svg" />
               </a>
               <div className="w-full flex items-center justify-between">
                  <HelpButton />
                  <Button size="icon" variant="secondary" asChild>
                     <Link
                        href="https://github.com/ln-dev7/circle"
                        target="_blank"
                        rel="noopener noreferrer"
                     >
                        <RiGithubLine className="size-4" />
                     </Link>
                  </Button>
               </div>
            </div>
         </SidebarFooter>
      </Sidebar>
   );
}
