'use client';

import { GroupedIssuesView } from '@/components/common/issues/grouped-issues-view';
import { InsightsPanel } from '@/components/common/issues/insights-panel';
import { IssueLine } from '@/components/common/issues/issue-line';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Cycle, cycles, formatCycleDateRange } from '@/mock-data/cycles';
import { Issue, issueCreatorIndex } from '@/mock-data/issues';
import { displayOrderedStatus } from '@/mock-data/status';
import { teams } from '@/mock-data/teams';
import { users } from '@/mock-data/users';
import { useIssuesStore } from '@/store/issues-store';
import { useRightPanelStore } from '@/store/right-panel-store';
import { BarChart3, ChevronDown, PanelRight } from 'lucide-react';
import { parseAsStringLiteral, useQueryState } from 'nuqs';
import { useEffect, useMemo, useState } from 'react';

const TABS = ['assigned', 'created', 'subscribed', 'activity'] as const;
type Tab = (typeof TABS)[number];

const TAB_ITEMS: { label: string; value: Tab }[] = [
   { label: 'Assigned', value: 'assigned' },
   { label: 'Created', value: 'created' },
   { label: 'Subscribed', value: 'subscribed' },
   { label: 'Activity', value: 'activity' },
];

/** The "current" user of the mock workspace. */
const ME = users[0];

/* ------------------------------ breakdown panel --------------------------- */

type BreakdownTab = 'labels' | 'priority' | 'projects' | 'teams';

interface BreakdownRow {
   key: string;
   label: string;
   color?: string;
   icon?: string;
   avatarUrl?: string;
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

/** Right panel of the Created tab: counts by label / priority / project / team. */
function BreakdownPanel({ issues }: { issues: Issue[] }) {
   const [tab, setTab] = useState<BreakdownTab>('labels');

   const rows = useMemo<BreakdownRow[]>(() => {
      const counter = new Map<string, BreakdownRow>();
      const bump = (key: string, row: Omit<BreakdownRow, 'count'>) => {
         const existing = counter.get(key);
         if (existing) existing.count += 1;
         else counter.set(key, { ...row, key, count: 1 });
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
            bump(issue.priority.id, { key: issue.priority.id, label: issue.priority.name });
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
      <aside className="hidden lg:flex flex-col w-80 shrink-0 border-l h-full overflow-y-auto bg-container p-4 gap-4">
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
         </div>
      </aside>
   );
}

/* ------------------------------ assigned groups --------------------------- */

interface IssueGroupBlock {
   key: string;
   label: string;
   meta?: string;
   issues: Issue[];
}

function GroupedList({ groups }: { groups: IssueGroupBlock[] }) {
   return (
      <div className="flex flex-col">
         {groups.map((group) => (
            <div key={group.key}>
               <div className="flex items-center gap-2 px-6 h-9 text-sm font-medium bg-[color-mix(in_oklab,var(--accent)_30%,var(--container))] border-b border-border/40 sticky top-0 z-[5]">
                  <ChevronDown className="size-3.5 text-muted-foreground" />
                  {group.label}
                  <span className="text-xs text-muted-foreground">{group.issues.length}</span>
                  {group.meta && (
                     <span className="text-xs text-muted-foreground">{group.meta}</span>
                  )}
               </div>
               {group.issues.map((issue) => (
                  <IssueLine key={issue.id} issue={issue} />
               ))}
            </div>
         ))}
         {groups.length === 0 && (
            <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
               No issues
            </div>
         )}
      </div>
   );
}

/* ----------------------------------- page --------------------------------- */

/** "My issues": Assigned / Created / Subscribed / Activity tabs. */
export default function MyIssues() {
   const [tab, setTab] = useQueryState('tab', parseAsStringLiteral(TABS).withDefault('assigned'));
   const { issues } = useIssuesStore();
   const { openPanel, togglePanel, openPanelOfType } = useRightPanelStore();
   const [showBreakdown, setShowBreakdown] = useState(true);

   // The insights panel is open by default on this page (Linear parity).
   useEffect(() => {
      openPanelOfType('insights');
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const assigned = useMemo(
      () => issues.filter((issue) => issue.assignee?.id === ME.id),
      [issues]
   );
   const created = useMemo(
      () =>
         issues
            .filter((issue) => issueCreatorIndex(issue, users.length) === 0)
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      [issues]
   );
   const subscribed = useMemo(
      () =>
         issues
            .filter(
               (issue) =>
                  issue.assignee?.id === ME.id ||
                  issueCreatorIndex(issue, users.length) === 0 ||
                  issueCreatorIndex(issue, 7) === 3
            )
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      [issues]
   );
   const activityIssues = subscribed;

   const assignedGroups = useMemo<IssueGroupBlock[]>(() => {
      const byCycle = new Map<string, Issue[]>();
      for (const issue of assigned) {
         const key = issue.status.category === 'completed' ? 'completed' : issue.cycleId || 'backlog';
         if (!byCycle.has(key)) byCycle.set(key, []);
         byCycle.get(key)!.push(issue);
      }
      const cycleOf = (id: string): Cycle | undefined =>
         cycles.find((candidate) => candidate.id === id);
      const groups: IssueGroupBlock[] = [];
      for (const [key, list] of byCycle) {
         if (key === 'backlog' || key === 'completed') continue;
         const cycle = cycleOf(key);
         groups.push({
            key,
            label: cycle?.name ?? `Cycle ${key}`,
            meta: cycle ? formatCycleDateRange(cycle) : undefined,
            issues: list,
         });
      }
      groups.sort((a, b) => a.label.localeCompare(b.label));
      if (byCycle.has('backlog')) {
         groups.push({ key: 'backlog', label: 'Backlog', issues: byCycle.get('backlog')! });
      }
      if (byCycle.has('completed')) {
         groups.push({ key: 'completed', label: 'Completed', issues: byCycle.get('completed')! });
      }
      return groups;
   }, [assigned]);

   const currentList =
      tab === 'assigned' ? assigned : tab === 'created' ? created : subscribed;

   return (
      <div className="w-full h-full flex flex-col overflow-hidden">
         <div className="flex items-center justify-between px-6 pt-3 pb-2 shrink-0">
            <div className="flex items-center gap-1.5">
               {TAB_ITEMS.map((item) => (
                  <button
                     key={item.value}
                     onClick={() => setTab(item.value)}
                     className={cn(
                        'px-2.5 py-1 rounded-md border text-xs font-medium transition-colors',
                        tab === item.value
                           ? 'bg-accent border-transparent'
                           : 'text-muted-foreground hover:bg-accent/50'
                     )}
                  >
                     {item.label}
                  </button>
               ))}
            </div>
            {tab !== 'activity' &&
               (tab === 'created' ? (
                  <Button
                     size="xs"
                     variant={showBreakdown ? 'secondary' : 'ghost'}
                     onClick={() => setShowBreakdown((value) => !value)}
                  >
                     <PanelRight className="size-4" />
                  </Button>
               ) : (
                  <Button
                     size="xs"
                     variant={openPanel === 'insights' ? 'secondary' : 'ghost'}
                     onClick={() => togglePanel('insights')}
                  >
                     <BarChart3 className="size-4" />
                  </Button>
               ))}
         </div>

         <div className="flex-1 min-h-0 flex overflow-hidden">
            <div className="flex-1 min-w-0 h-full overflow-y-auto">
               {tab === 'assigned' && <GroupedList groups={assignedGroups} />}
               {tab === 'created' && (
                  <GroupedList groups={[{ key: 'created', label: 'Created', issues: created }]} />
               )}
               {tab === 'subscribed' && (
                  <GroupedList
                     groups={[{ key: 'subscribed', label: 'Subscribed', issues: subscribed }]}
                  />
               )}
               {tab === 'activity' && (
                  <div className="h-full px-2">
                     <GroupedIssuesView
                        issues={activityIssues}
                        totalIssues={activityIssues}
                        statuses={displayOrderedStatus}
                        isViewTypeGrid={true}
                     />
                  </div>
               )}
            </div>

            {showBreakdown && tab === 'created' && <BreakdownPanel issues={created} />}
            {openPanel === 'insights' && (tab === 'assigned' || tab === 'subscribed') && (
               <aside className="hidden lg:flex w-[420px] shrink-0 border-l h-full overflow-hidden bg-container">
                  <InsightsPanel issues={currentList} />
               </aside>
            )}
         </div>
      </div>
   );
}
