'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { teams } from '@/mock-data/teams';
import { Link2, MoreHorizontal, Star } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function HeaderNav() {
   const { teamId } = useParams<{ orgId: string; teamId: string }>();
   const team = teams.find((t) => t.id === teamId) ?? teams[0];

   return (
      <div className="w-full flex justify-between items-center border-b py-1.5 px-6 h-10">
         <div className="flex items-center gap-2 min-w-0">
            <SidebarTrigger />
            <div className="inline-flex size-5 bg-muted/50 items-center justify-center rounded shrink-0 text-xs">
               {team.icon}
            </div>
            <span className="text-sm font-medium truncate">{team.name}</span>
            <Star className="size-3.5 text-muted-foreground shrink-0 ml-1" />
            <MoreHorizontal className="size-3.5 text-muted-foreground shrink-0" />
         </div>
         <Link2 className="size-4 text-muted-foreground shrink-0" />
      </div>
   );
}
