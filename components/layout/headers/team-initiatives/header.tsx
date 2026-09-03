'use client';

import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { teams } from '@/mock-data/teams';
import { ChevronRight, Plus } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function Header() {
   const { orgId, teamId } = useParams<{ orgId: string; teamId: string }>();
   const team = teams.find((t) => t.id === teamId) ?? teams[0];

   return (
      <div className="w-full flex justify-between items-center border-b py-1.5 px-6 h-10">
         <div className="flex items-center gap-2 min-w-0">
            <SidebarTrigger />
            <Link
               href={`/${orgId}/team/${team.id}/overview`}
               className="flex items-center gap-1.5 min-w-0 hover:opacity-80"
            >
               <div className="inline-flex size-5 bg-muted/50 items-center justify-center rounded shrink-0 text-xs">
                  {team.icon}
               </div>
               <span className="text-sm font-medium truncate">{team.name}</span>
            </Link>
            <ChevronRight className="size-3.5 text-muted-foreground shrink-0" />
            <span className="text-sm font-medium">Initiatives</span>
         </div>
         <Button size="xs" variant="ghost" className="gap-1 text-muted-foreground">
            <Plus className="size-4" />
            New initiative
         </Button>
      </div>
   );
}
