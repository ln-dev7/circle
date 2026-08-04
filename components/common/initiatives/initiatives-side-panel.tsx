'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { getInitiativeProjects, Initiative } from '@/mock-data/initiatives';
import { health as allHealth } from '@/mock-data/projects';
import { teams } from '@/mock-data/teams';
import { UserRound } from 'lucide-react';
import { useMemo, useState } from 'react';

type PanelTab = 'owner' | 'team' | 'health';

interface BreakdownRow {
   key: string;
   label: string;
   count: number;
   avatarUrl?: string;
   icon?: string;
   color?: string;
}

/** Right side panel of the Initiatives page: counts by owner / team / health. */
export function InitiativesSidePanel({ initiatives }: { initiatives: Initiative[] }) {
   const [tab, setTab] = useState<PanelTab>('owner');

   const rows = useMemo<BreakdownRow[]>(() => {
      if (tab === 'owner') {
         const byOwner = new Map<string, BreakdownRow>();
         for (const initiative of initiatives) {
            const key = initiative.owner?.id ?? 'no-owner';
            const existing = byOwner.get(key);
            if (existing) existing.count += 1;
            else
               byOwner.set(key, {
                  key,
                  label: initiative.owner?.name ?? 'No owner',
                  avatarUrl: initiative.owner?.avatarUrl,
                  count: 1,
               });
         }
         return [...byOwner.values()].sort((a, b) => b.count - a.count);
      }
      if (tab === 'team') {
         const byTeam = new Map<string, BreakdownRow>();
         for (const initiative of initiatives) {
            const teamIds = new Set(
               getInitiativeProjects(initiative).map((project) => project.teamId)
            );
            for (const teamId of teamIds) {
               const team = teams.find((entry) => entry.id === teamId);
               if (!team) continue;
               const existing = byTeam.get(teamId);
               if (existing) existing.count += 1;
               else byTeam.set(teamId, { key: teamId, label: team.name, icon: team.icon, count: 1 });
            }
         }
         return [...byTeam.values()].sort((a, b) => b.count - a.count);
      }
      return allHealth
         .map((entry) => ({
            key: entry.id,
            label: entry.name,
            color: entry.color,
            count: initiatives.filter((initiative) => initiative.health.id === entry.id).length,
         }))
         .filter((row) => row.count > 0)
         .sort((a, b) => b.count - a.count);
   }, [tab, initiatives]);

   return (
      <aside className="hidden lg:flex flex-col w-72 shrink-0 border-l h-full overflow-y-auto bg-container p-4 gap-4">
         <div className="flex items-center gap-1.5">
            {(
               [
                  ['owner', 'Owner'],
                  ['team', 'Team'],
                  ['health', 'Health'],
               ] as const
            ).map(([key, label]) => (
               <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={cn(
                     'px-2.5 py-1 rounded-full border text-xs font-medium transition-colors',
                     tab === key
                        ? 'bg-accent border-transparent'
                        : 'text-muted-foreground hover:bg-accent/50'
                  )}
               >
                  {label}
               </button>
            ))}
         </div>
         <div className="flex flex-col gap-1">
            {rows.map((row) => (
               <div
                  key={row.key}
                  className="flex items-center gap-2 px-1.5 py-1.5 rounded-md hover:bg-accent/40 text-sm"
               >
                  {tab === 'owner' &&
                     (row.avatarUrl ? (
                        <Avatar className="size-5">
                           <AvatarImage src={row.avatarUrl} alt={row.label} />
                           <AvatarFallback className="text-[9px]">{row.label[0]}</AvatarFallback>
                        </Avatar>
                     ) : (
                        <UserRound className="size-4 text-muted-foreground" />
                     ))}
                  {tab === 'team' && <span className="text-sm">{row.icon}</span>}
                  {tab === 'health' && (
                     <span
                        className="size-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: row.color }}
                     />
                  )}
                  <span className="flex-1 truncate">{row.label}</span>
                  <span className="text-muted-foreground text-xs">{row.count}</span>
               </div>
            ))}
         </div>
      </aside>
   );
}
