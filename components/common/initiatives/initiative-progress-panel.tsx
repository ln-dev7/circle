'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { getInitiativeProjects, Initiative } from '@/mock-data/initiatives';
import { health as allHealth } from '@/mock-data/projects';
import { teams } from '@/mock-data/teams';
import { useMemo, useState } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

type BreakdownTab = 'health' | 'status' | 'teams' | 'leads';

/** Deterministic pseudo-random from a string seed (SSR safe). */
const seedNumber = (seed: string): number =>
   seed.split('').reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) % 997, 7);

interface ProgressPoint {
   label: string;
   completed: number;
   started: number;
   scope: number;
}

/** Progress area chart + Health/Status/Teams/Leads breakdown of an initiative. */
export function InitiativeProgressPanel({ initiative }: { initiative: Initiative }) {
   const [tab, setTab] = useState<BreakdownTab>('teams');
   const projects = useMemo(() => getInitiativeProjects(initiative), [initiative]);

   const series = useMemo<ProgressPoint[]>(() => {
      const seed = seedNumber(initiative.id);
      const scope = Math.max(projects.length * 8, 16);
      const points: ProgressPoint[] = [];
      for (let index = 0; index < 12; index++) {
         const progress = index / 11;
         const wobble = ((seed * (index + 3)) % 7) / 10;
         const completed = Math.round(scope * progress * (0.55 + wobble / 4));
         const started = Math.min(
            scope,
            completed + Math.round(scope * (0.12 + wobble / 5) * (0.4 + progress))
         );
         points.push({
            label: `W${index + 1}`,
            completed,
            started: started - completed,
            scope: scope - started,
         });
      }
      return points;
   }, [initiative.id, projects.length]);

   const rows = useMemo(() => {
      if (tab === 'teams') {
         const byTeam = new Map<string, number>();
         for (const project of projects) {
            byTeam.set(project.teamId, (byTeam.get(project.teamId) ?? 0) + 1);
         }
         return [...byTeam.entries()].map(([teamId, count]) => {
            const team = teams.find((entry) => entry.id === teamId);
            return { key: teamId, icon: team?.icon ?? '👥', label: team?.name ?? teamId, count };
         });
      }
      if (tab === 'leads') {
         const byLead = new Map<string, { label: string; avatarUrl?: string; count: number }>();
         for (const project of projects) {
            const existing = byLead.get(project.lead.id);
            if (existing) existing.count += 1;
            else
               byLead.set(project.lead.id, {
                  label: project.lead.name,
                  avatarUrl: project.lead.avatarUrl,
                  count: 1,
               });
         }
         return [...byLead.entries()].map(([key, row]) => ({ key, ...row, icon: undefined }));
      }
      if (tab === 'status') {
         const byStatus = new Map<string, { label: string; color: string; count: number }>();
         for (const project of projects) {
            const existing = byStatus.get(project.status.id);
            if (existing) existing.count += 1;
            else
               byStatus.set(project.status.id, {
                  label: project.status.name,
                  color: project.status.color,
                  count: 1,
               });
         }
         return [...byStatus.entries()].map(([key, row]) => ({ key, ...row, icon: undefined }));
      }
      return allHealth
         .map((entry) => ({
            key: entry.id,
            label: entry.name,
            color: entry.color,
            icon: undefined,
            count: projects.filter((project) => project.health.id === entry.id).length,
         }))
         .filter((row) => row.count > 0);
   }, [tab, projects]);

   return (
      <div className="flex flex-col gap-3">
         <span className="text-sm font-medium">Progress</span>
         <div className="h-44 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={series} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
                  <XAxis
                     dataKey="label"
                     tick={{ fontSize: 10 }}
                     tickLine={false}
                     axisLine={false}
                     interval={5}
                  />
                  <Tooltip
                     contentStyle={{
                        background: 'var(--container)',
                        border: '1px solid var(--border)',
                        borderRadius: 8,
                        fontSize: 12,
                     }}
                  />
                  <Area
                     type="monotone"
                     dataKey="completed"
                     stackId="progress"
                     stroke="#5e6ad2"
                     fill="#5e6ad2"
                     fillOpacity={0.55}
                     name="Completed"
                  />
                  <Area
                     type="monotone"
                     dataKey="started"
                     stackId="progress"
                     stroke="#f2c94c"
                     fill="#f2c94c"
                     fillOpacity={0.4}
                     name="Started"
                  />
                  <Area
                     type="monotone"
                     dataKey="scope"
                     stackId="progress"
                     stroke="#95a2b3"
                     fill="#95a2b3"
                     fillOpacity={0.18}
                     name="Scope"
                  />
               </AreaChart>
            </ResponsiveContainer>
         </div>
         <div className="flex items-center gap-1.5 flex-wrap">
            {(
               [
                  ['health', 'Health'],
                  ['status', 'Status'],
                  ['teams', 'Teams'],
                  ['leads', 'Leads'],
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
               <div key={row.key} className="flex items-center gap-2 text-sm py-1">
                  {'avatarUrl' in row && row.avatarUrl ? (
                     <Avatar className="size-5">
                        <AvatarImage src={row.avatarUrl} alt={row.label} />
                        <AvatarFallback className="text-[9px]">{row.label[0]}</AvatarFallback>
                     </Avatar>
                  ) : 'color' in row && row.color ? (
                     <span
                        className="size-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: row.color }}
                     />
                  ) : (
                     <span className="text-sm">{row.icon}</span>
                  )}
                  <span className="flex-1 truncate">{row.label}</span>
                  <span className="text-muted-foreground text-xs">{row.count}</span>
               </div>
            ))}
         </div>
      </div>
   );
}
