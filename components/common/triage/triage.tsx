'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { TriageItem } from '@/mock-data/triage';
import { useTriageStore } from '@/store/triage-store';
import { cn } from '@/lib/utils';
import { Inbox, Plus, TriangleAlert } from 'lucide-react';
import { TriageDetails } from './triage-details';

/* --------------------------------- list row -------------------------------- */

function TriageRow({ item, selected }: { item: TriageItem; selected: boolean }) {
   const { select } = useTriageStore();

   return (
      <button
         onClick={() => select(item.id)}
         className={cn(
            'w-full flex flex-col gap-1 px-4 py-2.5 text-left border-b border-border/40 transition-colors',
            selected ? 'bg-accent/60' : 'hover:bg-sidebar/50'
         )}
      >
         <div className="flex items-center gap-2 min-w-0">
            <span className="flex-1 truncate text-sm font-medium">{item.title}</span>
            <span className="text-xs text-muted-foreground shrink-0">{item.identifier}</span>
         </div>
         <div className="flex items-center gap-2 min-w-0">
            {item.reporter.kind === 'user' ? (
               <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground min-w-0">
                  <Avatar className="size-4">
                     <AvatarImage
                        src={item.reporter.user.avatarUrl}
                        alt={item.reporter.user.name}
                     />
                     <AvatarFallback className="text-[8px]">
                        {item.reporter.user.name[0]}
                     </AvatarFallback>
                  </Avatar>
                  <span className="truncate">{item.reporter.user.name}</span>
               </span>
            ) : (
               <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <TriangleAlert className="size-3.5 text-red-400" />
                  {item.reporter.name}
               </span>
            )}
            <span className="ml-auto text-xs text-muted-foreground shrink-0">
               {item.receivedAgo}
            </span>
         </div>
      </button>
   );
}

/* -------------------------------- empty state ------------------------------ */

function EmptyState({ count }: { count: number }) {
   return (
      <div className="flex-1 h-full hidden lg:flex flex-col items-center justify-center gap-3">
         <Inbox className="size-10 text-muted-foreground/40" strokeWidth={1.2} />
         <span className="text-sm text-muted-foreground">
            {count} issue{count === 1 ? '' : 's'} to triage
         </span>
         <Button variant="outline" size="sm" className="gap-1.5">
            <Plus className="size-4" />
            Create triage issue
         </Button>
      </div>
   );
}

/* ---------------------------------- export --------------------------------- */

/**
 * The intake screen: queue on the left, the selected item (or the calm empty
 * state) on the right — Linear's split triage layout.
 */
export default function Triage({ teamId }: { teamId: string }) {
   const { items, selectedId } = useTriageStore();
   const scoped = items.filter((item) => item.teamId === teamId);
   const selected = scoped.find((item) => item.id === selectedId) ?? null;

   return (
      <div className="w-full h-full flex overflow-hidden">
         <div
            className={cn(
               'w-full lg:w-[400px] lg:shrink-0 lg:border-r h-full overflow-y-auto',
               selected && 'hidden lg:block'
            )}
         >
            {scoped.length === 0 && (
               <div className="px-4 py-8 text-sm text-muted-foreground">
                  Nothing to triage — new reports land here first.
               </div>
            )}
            {scoped.map((item) => (
               <TriageRow key={item.id} item={item} selected={item.id === selectedId} />
            ))}
         </div>
         {selected ? <TriageDetails item={selected} /> : <EmptyState count={scoped.length} />}
      </div>
   );
}
