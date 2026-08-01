'use client';

import {
   PanelFilterTarget,
   usePanelFilter,
} from '@/components/common/issues/use-panel-filter';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Cycle, cycleStatusLabel, formatCycleDateRange } from '@/mock-data/cycles';
import { Issue } from '@/mock-data/issues';
import { useRightPanelStore } from '@/store/right-panel-store';
import { Plus, User, X } from 'lucide-react';
import { useMemo } from 'react';
import { CapacityRing } from './capacity-ring';
import { CycleBurnupChart } from './cycle-burnup-chart';
import { CyclePlayIcon } from './cycle-line';

interface BreakdownRow {
   key: string;
   label: string;
   leading: React.ReactNode;
   total: number;
   completedPercent: number;
   /** When set, clicking the row toggles this exclusive filter. */
   filter?: PanelFilterTarget;
}

interface CycleDetailsPanelProps {
   cycle: Cycle;
   issues: Issue[];
}

const isCompleted = (issue: Issue) => issue.status.category === 'completed';

function buildBreakdown<T>(
   issues: Issue[],
   getKey: (issue: Issue) => T | undefined,
   describe: (key: T) => Omit<BreakdownRow, 'total' | 'completedPercent'>
): BreakdownRow[] {
   const buckets = new Map<T, Issue[]>();
   for (const issue of issues) {
      const key = getKey(issue);
      if (key === undefined) continue;
      const bucket = buckets.get(key) ?? [];
      bucket.push(issue);
      buckets.set(key, bucket);
   }

   return [...buckets.entries()]
      .map(([key, bucket]) => ({
         ...describe(key),
         total: bucket.length,
         completedPercent: Math.round((bucket.filter(isCompleted).length / bucket.length) * 100),
      }))
      .sort((a, b) => b.total - a.total);
}

interface BreakdownListProps {
   rows: BreakdownRow[];
   isActive: (target: PanelFilterTarget) => boolean;
   toggle: (target: PanelFilterTarget) => void;
}

function BreakdownList({ rows, isActive, toggle }: BreakdownListProps) {
   if (rows.length === 0) {
      return <p className="text-xs text-muted-foreground px-1 py-3">Nothing to show yet.</p>;
   }

   return (
      <div className="flex flex-col">
         {rows.map((row) => {
            const active = row.filter ? isActive(row.filter) : false;
            return (
               <button
                  key={row.key}
                  type="button"
                  onClick={row.filter ? () => toggle(row.filter!) : undefined}
                  className={cn(
                     'group flex w-full items-center justify-between gap-3 py-2 px-2 -mx-2 rounded-md text-left transition-colors',
                     row.filter && 'cursor-pointer hover:bg-accent/50',
                     active && 'bg-accent hover:bg-accent'
                  )}
               >
                  <div className="flex items-center gap-2 min-w-0">
                     {row.leading}
                     <span className="text-sm truncate">{row.label}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 text-sm text-muted-foreground">
                     {row.filter && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                           {active ? 'Clear filter' : 'Filter'}
                        </span>
                     )}
                     <CapacityRing value={row.completedPercent} color="#6771c5" />
                     <span className="whitespace-nowrap">
                        {row.completedPercent}% of {row.total}
                     </span>
                  </div>
               </button>
            );
         })}
      </div>
   );
}

/**
 * Right side panel with the cycle summary: dates, progress stats,
 * compact burn-up chart and breakdowns by assignee / label / priority / project.
 */
export function CycleDetailsPanel({ cycle, issues }: CycleDetailsPanelProps) {
   const { closePanel } = useRightPanelStore();
   const { isActive, toggle } = usePanelFilter();

   const completedPercent = cycle.scope > 0 ? Math.round((cycle.completed / cycle.scope) * 100) : 0;
   const startedPercent = cycle.scope > 0 ? Math.round((cycle.started / cycle.scope) * 100) : 0;

   const assigneeRows = useMemo(
      () =>
         buildBreakdown(
            issues,
            (issue) => issue.assignee?.id ?? 'no-assignee',
            (key) => {
               const assignee = issues.find((i) => i.assignee?.id === key)?.assignee;
               if (!assignee) {
                  return {
                     key: 'no-assignee',
                     label: 'No assignee',
                     leading: (
                        <div className="size-5 rounded-full border border-dashed flex items-center justify-center shrink-0">
                           <User className="size-3 text-muted-foreground" />
                        </div>
                     ),
                     filter: { columnId: 'assignee' as const, value: 'unassigned' },
                  };
               }
               return {
                  key: assignee.id,
                  label: assignee.name,
                  leading: (
                     <Avatar className="size-5 shrink-0">
                        <AvatarImage src={assignee.avatarUrl} alt={assignee.name} />
                        <AvatarFallback>{assignee.name[0]}</AvatarFallback>
                     </Avatar>
                  ),
                  filter: { columnId: 'assignee' as const, value: assignee.id },
               };
            }
         ),
      [issues]
   );

   const labelRows = useMemo(
      () =>
         buildBreakdown(
            issues,
            (issue) => issue.labels[0]?.id,
            (key) => {
               const label = issues
                  .flatMap((issue) => issue.labels)
                  .find((candidate) => candidate.id === key);
               return {
                  key: String(key),
                  label: label?.name ?? 'Unlabeled',
                  leading: (
                     <span
                        className="size-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: label?.color ?? 'gray' }}
                     />
                  ),
                  filter: { columnId: 'labels' as const, value: String(key) },
               };
            }
         ),
      [issues]
   );

   const priorityRows = useMemo(
      () =>
         buildBreakdown(
            issues,
            (issue) => issue.priority.id,
            (key) => {
               const priority = issues.find((i) => i.priority.id === key)?.priority;
               const Icon = priority?.icon;
               return {
                  key: String(key),
                  label: priority?.name ?? 'No priority',
                  leading: Icon ? (
                     <Icon className="size-3.5 text-muted-foreground shrink-0" />
                  ) : null,
                  filter: { columnId: 'priority' as const, value: String(key) },
               };
            }
         ),
      [issues]
   );

   const projectRows = useMemo(
      () =>
         buildBreakdown(
            issues,
            (issue) => issue.project?.id,
            (key) => {
               const project = issues.find((i) => i.project?.id === key)?.project;
               const Icon = project?.icon;
               return {
                  key: String(key),
                  label: project?.name ?? 'No project',
                  leading: Icon ? (
                     <Icon className="size-3.5 text-muted-foreground shrink-0" />
                  ) : null,
                  filter: { columnId: 'project' as const, value: String(key) },
               };
            }
         ),
      [issues]
   );

   return (
      <div className="flex flex-col h-full w-full">
         {/* Header */}
         <div className="px-4 pt-4 shrink-0">
            <div className="flex items-center justify-between gap-2">
               <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs px-2 py-1 rounded-md bg-accent text-muted-foreground">
                     {cycleStatusLabel[cycle.status]}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-md bg-accent text-muted-foreground">
                     {formatCycleDateRange(cycle)}
                  </span>
               </div>
               <Button variant="ghost" size="icon" className="size-7" onClick={closePanel}>
                  <X className="size-4" />
               </Button>
            </div>

            <div className="flex items-center gap-2 mt-4">
               <CyclePlayIcon />
               <h2 className="text-lg font-semibold">{cycle.name}</h2>
            </div>

            <button className="flex items-center gap-1.5 mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
               <Plus className="size-4" />
               Add document or link...
            </button>
         </div>

         {/* Progress */}
         <div className="px-4 mt-6 shrink-0">
            <h3 className="text-sm font-medium mb-3">Progress</h3>
            <div className="grid grid-cols-3 gap-2 mb-3">
               <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                     <span className="size-2 rounded-[2px] bg-[#8f9299]" />
                     Scope
                  </div>
                  <div className="text-sm">
                     <span className="font-medium">{cycle.scope}</span>{' '}
                     {cycle.scopeDelta !== 0 && (
                        <span className="text-xs text-red-500">+{cycle.scopeDelta}%</span>
                     )}
                  </div>
               </div>
               <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                     <span className="size-2 rounded-[2px] bg-[#facc15]" />
                     Started
                  </div>
                  <div className="text-sm">
                     <span className="font-medium">{cycle.started}</span>{' '}
                     <span className="text-xs text-muted-foreground">• {startedPercent}%</span>
                  </div>
               </div>
               <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                     <span className="size-2 rounded-[2px] bg-[#6771c5]" />
                     Completed
                  </div>
                  <div className="text-sm">
                     <span className="font-medium">{cycle.completed}</span>{' '}
                     <span className="text-xs text-muted-foreground">• {completedPercent}%</span>
                  </div>
               </div>
            </div>
            <CycleBurnupChart cycle={cycle} height={150} compact />
         </div>

         {/* Breakdowns */}
         <div className="px-4 mt-6 pb-6 flex-1 overflow-y-auto">
            <Tabs defaultValue="assignees">
               <TabsList className="h-8 bg-transparent gap-1 p-0">
                  <TabsTrigger value="assignees" className="text-xs px-2.5 rounded-full">
                     Assignees
                  </TabsTrigger>
                  <TabsTrigger value="labels" className="text-xs px-2.5 rounded-full">
                     Labels
                  </TabsTrigger>
                  <TabsTrigger value="priority" className="text-xs px-2.5 rounded-full">
                     Priority
                  </TabsTrigger>
                  <TabsTrigger value="projects" className="text-xs px-2.5 rounded-full">
                     Projects
                  </TabsTrigger>
               </TabsList>
               <TabsContent value="assignees">
                  <BreakdownList rows={assigneeRows} isActive={isActive} toggle={toggle} />
               </TabsContent>
               <TabsContent value="labels">
                  <BreakdownList rows={labelRows} isActive={isActive} toggle={toggle} />
               </TabsContent>
               <TabsContent value="priority">
                  <BreakdownList rows={priorityRows} isActive={isActive} toggle={toggle} />
               </TabsContent>
               <TabsContent value="projects">
                  <BreakdownList rows={projectRows} isActive={isActive} toggle={toggle} />
               </TabsContent>
            </Tabs>
         </div>
      </div>
   );
}
