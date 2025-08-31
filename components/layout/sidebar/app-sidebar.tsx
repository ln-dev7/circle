'use client';

import { RiGithubLine } from '@remixicon/react';
import * as React from 'react';

import { HelpButton } from '@/components/layout/sidebar/help-button';
import { NavInbox } from '@/components/layout/sidebar/nav-inbox';
import { OrgSwitcher } from '@/components/layout/sidebar/org-switcher';
import { Button } from '@/components/ui/button';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';
import Link from 'next/link';
import { X } from 'lucide-react';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
   const [open, setOpen] = React.useState(true);
   return (
      <Sidebar collapsible="offcanvas" {...props}>
         <SidebarHeader>
            <OrgSwitcher />
         </SidebarHeader>
         <SidebarContent>
            <NavInbox />
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
                        Open-source layouts by lndev-ui
                     </div>
                     <div>
                        Collection of beautifully crafted open-source layouts UI built with
                        shadcn/ui.
                     </div>
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
                           square.lndev.me
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
