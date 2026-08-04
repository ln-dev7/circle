'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { issueViews, projectViews, View } from '@/mock-data/views';
import { teams } from '@/mock-data/teams';
import { useViewsDisplayStore, ViewsOrdering } from '@/store/views-display-store';
import { ArrowDown, Plus, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { parseAsStringLiteral, useQueryState } from 'nuqs';
import { useMemo } from 'react';

const TABS = ['issues', 'projects'] as const;

const formatDate = (iso: string): string => {
   const [year, month, day] = iso.split('-').map(Number);
   const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
   ];
   return `${months[(month ?? 1) - 1]} ${day}, ${year}`;
};

function DisplayOptions() {
   const { ordering, displayProperties, setOrdering, toggleProperty } = useViewsDisplayStore();

   return (
      <Popover>
         <PopoverTrigger asChild>
            <Button size="xs" variant="ghost">
               <SlidersHorizontal className="size-4" />
            </Button>
         </PopoverTrigger>
         <PopoverContent align="end" className="w-72 p-3 flex flex-col gap-3">
            <div className="flex items-center justify-between">
               <span className="text-xs text-muted-foreground">Ordering</span>
               <Select
                  value={ordering}
                  onValueChange={(value) => setOrdering(value as ViewsOrdering)}
               >
                  <SelectTrigger className="w-32 h-7 text-xs">
                     <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="name">Name</SelectItem>
                     <SelectItem value="created">Created</SelectItem>
                     <SelectItem value="updated">Updated</SelectItem>
                  </SelectContent>
               </Select>
            </div>
            <div className="flex flex-col gap-2">
               <span className="text-xs text-muted-foreground">Display properties</span>
               <div className="flex flex-wrap gap-1.5">
                  {(
                     [
                        ['created', 'Created'],
                        ['updated', 'Updated'],
                        ['owner', 'Owner'],
                     ] as const
                  ).map(([key, label]) => (
                     <button
                        key={key}
                        onClick={() => toggleProperty(key)}
                        className={cn(
                           'px-2 py-0.5 rounded-md border text-xs transition-colors',
                           displayProperties[key]
                              ? 'bg-accent border-transparent'
                              : 'text-muted-foreground hover:bg-accent/50'
                        )}
                     >
                        {label}
                     </button>
                  ))}
               </div>
            </div>
         </PopoverContent>
      </Popover>
   );
}

function ViewRow({ view, orgId }: { view: View; orgId: string }) {
   const { displayProperties } = useViewsDisplayStore();
   return (
      <Link
         href={`/${orgId}/view/${view.id}`}
         className="flex items-center gap-3 px-6 py-2.5 border-b border-border/50 hover:bg-sidebar/50 transition-colors"
      >
         <span className="inline-flex size-6 items-center justify-center rounded bg-muted/50 text-sm shrink-0">
            {view.icon}
         </span>
         <span className="flex flex-col min-w-0 flex-1">
            <span className="text-sm font-medium truncate">{view.name}</span>
            <span className="text-xs text-muted-foreground truncate">{view.description}</span>
         </span>
         {displayProperties.created && (
            <span className="hidden sm:block text-xs text-muted-foreground w-24 shrink-0">
               {formatDate(view.createdAt)}
            </span>
         )}
         {displayProperties.updated && (
            <span className="hidden sm:block text-xs text-muted-foreground w-24 shrink-0">
               {formatDate(view.updatedAt)}
            </span>
         )}
         {displayProperties.owner && (
            <span className="flex items-center gap-1.5 w-32 shrink-0 justify-end">
               <Avatar className="size-5">
                  <AvatarImage src={view.owner.avatarUrl} alt={view.owner.name} />
                  <AvatarFallback className="text-[9px]">{view.owner.name[0]}</AvatarFallback>
               </Avatar>
               <span className="text-xs text-muted-foreground truncate max-w-24">
                  {view.owner.name}
               </span>
            </span>
         )}
      </Link>
   );
}

/**
 * "Views" page: saved issue / project views. With a `teamId`, only that
 * team's views are listed (team sidebar "Views" entry); otherwise the whole
 * workspace is shown.
 */
export default function Views({ teamId }: { teamId?: string }) {
   const { orgId } = useParams<{ orgId: string }>();
   const [tab, setTab] = useQueryState('tab', parseAsStringLiteral(TABS).withDefault('issues'));
   const { ordering } = useViewsDisplayStore();
   const team = teamId ? teams.find((entry) => entry.id === teamId) : undefined;

   const list = useMemo(() => {
      let source = tab === 'issues' ? issueViews : projectViews;
      if (teamId) source = source.filter((view) => view.teamId === teamId);
      return [...source].sort((a, b) => {
         if (ordering === 'created') return b.createdAt.localeCompare(a.createdAt);
         if (ordering === 'updated') return b.updatedAt.localeCompare(a.updatedAt);
         return a.name.localeCompare(b.name);
      });
   }, [tab, ordering, teamId]);

   return (
      <div className="w-full h-full overflow-y-auto">
         <div className="flex items-center justify-between px-6 pt-3 pb-2">
            <div className="flex items-center gap-1.5">
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
            <DisplayOptions />
         </div>

         <div className="flex items-center gap-1 px-6 py-1.5 text-xs text-muted-foreground border-b">
            Name
            <ArrowDown className="size-3" />
         </div>

         <div className="flex items-center justify-between px-6 py-2 bg-sidebar/60 border-b border-border/50">
            <span className="flex items-center gap-2 text-sm">
               {team ? (
                  <span className="inline-flex size-5 items-center justify-center rounded bg-muted/50 text-xs">
                     {team.icon}
                  </span>
               ) : (
                  <span className="inline-flex size-5 items-center justify-center rounded bg-primary text-primary-foreground text-[10px] font-semibold">
                     LN
                  </span>
               )}
               <span className="font-medium">{team ? team.name : 'LNDev UI'}</span>
               <span className="text-muted-foreground text-xs">
                  · {team ? 'Team' : 'Workspace'}
               </span>
            </span>
            <Button size="xs" variant="ghost">
               <Plus className="size-3.5" />
            </Button>
         </div>

         {list.map((view) => (
            <ViewRow key={view.id} view={view} orgId={orgId} />
         ))}
         {list.length === 0 && (
            <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
               No views yet
            </div>
         )}
      </div>
   );
}
