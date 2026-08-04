'use client';

import { cn } from '@/lib/utils';
import { Issue } from '@/mock-data/issues';
import { teams } from '@/mock-data/teams';
import { useRightPanelStore } from '@/store/right-panel-store';
import { X } from 'lucide-react';
import { useMemo, useState } from 'react';

type BreakdownTab = 'labels' | 'priority' | 'projects' | 'teams';

interface BreakdownRow {
   key: string;
   label: string;
   color?: string;
   count: number;
}

const LABEL_COLORS: Record<string, string> = {
   purple: '#8b5cf6',
   red: '#ef4444',
   green: '#22c55e',
   blue: '#3b82f6',
   yellow: '#eab308',
   orange: '#f97316',
   pink: '#ec4899',
   gray: '#6b7280',
   indigo: '#6366f1',
   teal: '#14b8a6',
   cyan: '#06b6d4',
};

const PRIORITY_COLORS: Record<string, string> = {
   'no-priority': '#94a3b8',
   'urgent': '#eb5757',
   'high': '#f2994a',
   'medium': '#facc15',
   'low': '#4cb782',
};

/**
 * Right panel of My issues: Labels / Priority / Projects / Teams counters
 * over the currently displayed issues (Linear side panel).
 */
export function BreakdownPanel({ issues }: { issues: Issue[] }) {
   const { closePanel } = useRightPanelStore();
   const [tab, setTab] = useState<BreakdownTab>('labels');

   const rows = useMemo<BreakdownRow[]>(() => {
      const counter = new Map<string, BreakdownRow>();
      const bump = (key: string, row: Omit<BreakdownRow, 'count'>) => {
         const existing = counter.get(key);
         if (existing) existing.count += 1;
         else counter.set(key, { ...row, count: 1 });
      };
      for (const issue of issues) {
         if (tab === 'labels') {
            for (const label of issue.labels) {
               bump(label.id, {
                  key: label.id,
                  label: label.name,
                  color: LABEL_COLORS[label.color] ?? '#6b7280',
               });
            }
         } else if (tab === 'priority') {
            bump(issue.priority.id, {
               key: issue.priority.id,
               label: issue.priority.name,
               color: PRIORITY_COLORS[issue.priority.id] ?? '#94a3b8',
            });
         } else if (tab === 'projects') {
            if (issue.project) {
               bump(issue.project.id, { key: issue.project.id, label: issue.project.name });
            }
         } else if (issue.project) {
            const team = teams.find((candidate) => candidate.id === issue.project?.teamId);
            bump(issue.project.teamId, {
               key: issue.project.teamId,
               label: team ? `${team.icon} ${team.name}` : issue.project.teamId,
            });
         }
      }
      return [...counter.values()].sort((a, b) => b.count - a.count);
   }, [tab, issues]);

   return (
      <div className="w-full h-full overflow-y-auto p-4 flex flex-col gap-4">
         <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
               {(
                  [
                     ['labels', 'Labels'],
                     ['priority', 'Priority'],
                     ['projects', 'Projects'],
                     ['teams', 'Teams'],
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
            <button
               onClick={() => closePanel()}
               className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
               aria-label="Close panel"
            >
               <X className="size-4" />
            </button>
         </div>
         <div className="flex flex-col gap-1">
            {rows.map((row) => (
               <div
                  key={row.key}
                  className="flex items-center gap-2 px-1.5 py-1.5 rounded-md hover:bg-accent/40 text-sm"
               >
                  {row.color && (
                     <span
                        className="size-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: row.color }}
                     />
                  )}
                  <span className="flex-1 truncate">{row.label}</span>
                  <span className="text-muted-foreground text-xs">{row.count}</span>
               </div>
            ))}
            {rows.length === 0 && (
               <span className="text-sm text-muted-foreground py-6 text-center">No data</span>
            )}
         </div>
      </div>
   );
}
