'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { getInitiativeById } from '@/mock-data/initiatives';
import { ChevronRight, MoreHorizontal, Star } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { parseAsStringLiteral, useQueryState } from 'nuqs';

const TABS = ['overview', 'activity', 'projects'] as const;

export default function Header() {
   const { orgId, initiativeId } = useParams<{ orgId: string; initiativeId: string }>();
   const initiative = getInitiativeById(initiativeId);
   const [tab, setTab] = useQueryState(
      'tab',
      parseAsStringLiteral(TABS).withDefault('overview')
   );

   if (!initiative) return null;

   return (
      <div className="w-full flex flex-col">
         <div className="w-full flex justify-between items-center border-b py-1.5 px-6 h-10">
            <div className="flex items-center gap-2 min-w-0">
               <SidebarTrigger />
               <Link
                  href={`/${orgId}/initiatives`}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors shrink-0"
               >
                  Initiatives
               </Link>
               <ChevronRight className="size-3.5 text-muted-foreground shrink-0" />
               <span className="inline-flex size-5 items-center justify-center rounded bg-muted/50 text-xs shrink-0">
                  {initiative.icon}
               </span>
               <span className="text-sm font-medium truncate">{initiative.name}</span>
               <Star className="size-3.5 text-muted-foreground shrink-0 ml-1" />
               <MoreHorizontal className="size-3.5 text-muted-foreground shrink-0" />
            </div>
         </div>
         <div className="w-full flex items-center border-b py-1.5 px-6 h-10 gap-1.5">
            {TABS.map((candidate) => (
               <button
                  key={candidate}
                  onClick={() => setTab(candidate)}
                  className={cn(
                     'px-2.5 py-1 rounded-md border text-xs font-medium capitalize transition-colors',
                     tab === candidate
                        ? 'bg-accent border-transparent'
                        : 'text-muted-foreground hover:bg-accent/50'
                  )}
               >
                  {candidate}
               </button>
            ))}
         </div>
      </div>
   );
}
