'use client';

import * as React from 'react';
import { ChevronsUpDown } from 'lucide-react';

import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { ThemeToggle } from '../theme-toggle';

export function OrgSwitcher() {
   return (
      <SidebarMenu>
         <SidebarMenuItem>
            <DropdownMenu>
               <div className="w-full flex gap-1 items-center pt-2">
                  <DropdownMenuTrigger asChild>
                     <SidebarMenuButton
                        size="lg"
                        className="h-8 p-1 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                     >
                        <div className="flex aspect-square size-6 items-center justify-center rounded bg-orange-500 text-sidebar-primary-foreground">
                           LN
                        </div>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                           <span className="truncate font-semibold">lndev-ui</span>
                        </div>
                        <ChevronsUpDown className="ml-auto" />
                     </SidebarMenuButton>
                  </DropdownMenuTrigger>

                  <ThemeToggle />
               </div>
               <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-60 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
               >
                  <DropdownMenuItem>Log out</DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         </SidebarMenuItem>
      </SidebarMenu>
   );
}
