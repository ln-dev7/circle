'use client';

import Link from 'next/link';
import { PlusIcon } from 'lucide-react';

import {
   SidebarGroup,
   SidebarGroupLabel,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
} from '@/components/ui/sidebar';
import { teams } from '@/mock-data/teams';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';

export function NavTeamsSettings() {
   const { orgId } = useParams<{ orgId: string }>();
   const joinedTeams = teams.filter((t) => t.joined);
   return (
      <SidebarGroup>
         <SidebarGroupLabel>Your teams</SidebarGroupLabel>
         <SidebarMenu>
            {joinedTeams.map((team) => (
               <SidebarMenuItem key={team.id}>
                  <SidebarMenuButton asChild>
                     <Link href={`/${orgId}/settings/teams/${team.id}`}>
                        <div className="inline-flex size-6 bg-muted/50 items-center justify-center rounded shrink-0">
                           <div className="text-sm">{team.icon}</div>
                        </div>
                        <span>{team.name}</span>
                     </Link>
                  </SidebarMenuButton>
               </SidebarMenuItem>
            ))}
            <SidebarMenuItem>
               <SidebarMenuButton asChild>
                  <Button variant="ghost" className="w-full justify-start gap-2 px-2" asChild>
                     <Link href={`/${orgId}/settings/teams/new`}>
                        <PlusIcon className="size-4" />
                        <span>Join or create a team</span>
                     </Link>
                  </Button>
               </SidebarMenuButton>
            </SidebarMenuItem>
         </SidebarMenu>
      </SidebarGroup>
   );
}
