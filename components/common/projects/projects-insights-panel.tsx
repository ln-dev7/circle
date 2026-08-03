'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { health as healthList, Project } from '@/mock-data/projects';
import { teams } from '@/mock-data/teams';
import { users } from '@/mock-data/users';
import { useProjectsFilterStore } from '@/store/projects-filter-store';
import { useRightPanelStore } from '@/store/right-panel-store';
import { X } from 'lucide-react';
import { useMemo } from 'react';

interface ProjectsInsightsPanelProps {
   projects: Project[];
}

interface CountRow {
   key: string;
   label: string;
   leading: React.ReactNode;
   count: number;
   onClick?: () => void;
   active?: boolean;
}

function CountList({ rows }: { rows: CountRow[] }) {
   if (rows.length === 0) {
      return <p className="text-xs text-muted-foreground px-1 py-3">Nothing to show yet.</p>;
   }
   return (
      <div className="flex flex-col">
         {rows.map((row) => {
            return (
               <button
                  key={row.key}
                  type="button"
                  onClick={row.onClick}
                  className={cn(
                     'group flex items-center justify-between gap-3 py-2 px-2 -mx-2 rounded-md text-left',
                     row.onClick && 'cursor-pointer hover:bg-accent/50 transition-colors',
                     row.active && 'bg-accent hover:bg-accent'
                  )}
               >
                  <div className="flex items-center gap-2 min-w-0">
                     {row.leading}
                     <span className="text-sm truncate">{row.label}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                     {row.onClick && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-background/80 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                           {row.active ? 'Clear filter' : 'Filter'}
                        </span>
                     )}
                     <span className="text-sm text-muted-foreground">{row.count}</span>
                  </div>
               </button>
            );
         })}
      </div>
   );
}

/** Right panel of the Projects page: counters by health / team / lead. */
export default function ProjectsInsightsPanel({ projects }: ProjectsInsightsPanelProps) {
   const { closePanel } = useRightPanelStore();
   const { filters, toggleFilter } = useProjectsFilterStore();

   const healthRows = useMemo<CountRow[]>(
      () =>
         healthList.map((entry) => ({
            key: entry.id,
            label: entry.id === 'no-update' ? 'No update expected' : entry.name,
            leading: (
               <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
            ),
            count: projects.filter((project) => project.health.id === entry.id).length,
            onClick: () => toggleFilter('health', entry.id),
            active: filters.health.length === 1 && filters.health[0] === entry.id,
         })),
      [projects, filters.health, toggleFilter]
   );

   const teamRows = useMemo<CountRow[]>(
      () =>
         teams
            .map((team) => ({
               key: team.id,
               label: team.name,
               leading: <span className="text-sm shrink-0">{team.icon}</span>,
               count: projects.filter((project) => project.teamId === team.id).length,
            }))
            .filter((row) => row.count > 0)
            .sort((a, b) => b.count - a.count),
      [projects]
   );

   const leadRows = useMemo<CountRow[]>(
      () =>
         users
            .map((user) => ({
               key: user.id,
               label: user.name,
               leading: (
                  <Avatar className="size-5 shrink-0">
                     <AvatarImage src={user.avatarUrl} alt={user.name} />
                     <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
               ),
               count: projects.filter((project) => project.lead.id === user.id).length,
            }))
            .filter((row) => row.count > 0)
            .sort((a, b) => b.count - a.count),
      [projects]
   );

   return (
      <div className="flex flex-col h-full w-full overflow-y-auto">
         <div className="flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
            <div className="flex items-baseline gap-1.5">
               <span className="text-xl font-semibold">{projects.length}</span>
               <span className="text-sm text-muted-foreground">projects</span>
            </div>
            <Button variant="ghost" size="icon" className="size-7" onClick={closePanel}>
               <X className="size-4" />
            </Button>
         </div>

         <div className="px-4 pb-6">
            <Tabs defaultValue="health">
               <TabsList className="h-8 bg-transparent gap-1 p-0">
                  <TabsTrigger value="health" className="text-xs px-2.5 rounded-full">
                     Health
                  </TabsTrigger>
                  <TabsTrigger value="teams" className="text-xs px-2.5 rounded-full">
                     Teams
                  </TabsTrigger>
                  <TabsTrigger value="leads" className="text-xs px-2.5 rounded-full">
                     Leads
                  </TabsTrigger>
               </TabsList>
               <TabsContent value="health">
                  <CountList rows={healthRows} />
               </TabsContent>
               <TabsContent value="teams">
                  <CountList rows={teamRows} />
               </TabsContent>
               <TabsContent value="leads">
                  <CountList rows={leadRows} />
               </TabsContent>
            </Tabs>
         </div>
      </div>
   );
}
