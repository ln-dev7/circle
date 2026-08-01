'use client';

import { CyclePlayIcon } from '@/components/common/cycles/cycle-line';
import { Button } from '@/components/ui/button';
import { getCycleById } from '@/mock-data/cycles';
import { IssueDetail } from '@/mock-data/issue-details';
import { Issue } from '@/mock-data/issues';
import { Ban, GitPullRequestArrow, Plus } from 'lucide-react';
import { AssigneeUser } from '../assignee-user';
import { LabelBadge } from '../label-badge';
import { PrioritySelector } from '../priority-selector';
import { StatusSelector } from '../status-selector';
import { IssueRefRow } from './content-blocks';

interface IssuePropertiesPanelProps {
   issue: Issue;
   detail: IssueDetail;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
   return (
      <div>
         <h3 className="text-xs font-medium text-muted-foreground mb-2">{title}</h3>
         {children}
      </div>
   );
}

/**
 * Right sidebar of the issue page: editable properties (status, priority,
 * assignee), cycle, labels, project + milestone, relations and linked PRs.
 */
export function IssuePropertiesPanel({ issue, detail }: IssuePropertiesPanelProps) {
   const cycle = issue.cycleId ? getCycleById(issue.cycleId) : undefined;

   return (
      <div className="flex flex-col gap-7">
         <Section title="Properties">
            <div className="flex flex-col gap-1.5">
               <div className="flex items-center gap-1.5 -ml-1.5">
                  <StatusSelector status={issue.status} issueId={issue.id} />
                  <span className="text-sm">{issue.status.name}</span>
               </div>
               <div className="flex items-center gap-1.5 -ml-1.5">
                  <PrioritySelector priority={issue.priority} issueId={issue.id} />
                  <span className="text-sm">{issue.priority.name}</span>
               </div>
               <div className="flex items-center gap-2 mt-0.5">
                  <AssigneeUser user={issue.assignee} />
                  <span className="text-sm">{issue.assignee ? issue.assignee.name : 'Assign'}</span>
               </div>
               {cycle && (
                  <div className="flex items-center gap-2 mt-0.5">
                     <CyclePlayIcon className="size-4" />
                     <span className="text-sm">{cycle.name}</span>
                  </div>
               )}
            </div>
         </Section>

         <Section title="Labels">
            <div className="flex items-center flex-wrap gap-1.5">
               <LabelBadge label={issue.labels} />
               <Button variant="ghost" size="icon" className="size-6 rounded-full border">
                  <Plus className="size-3.5" />
               </Button>
            </div>
         </Section>

         {issue.project && (
            <Section title="Project">
               <div className="flex items-center gap-2 text-sm">
                  <issue.project.icon className="size-4 text-muted-foreground shrink-0" />
                  <span className="truncate">{issue.project.name}</span>
               </div>
               {detail.milestone && (
                  <div className="flex items-center gap-2 text-sm mt-1.5 pl-6 text-muted-foreground">
                     <span className="size-2 rotate-45 border border-amber-400 shrink-0" />
                     <span className="truncate">{detail.milestone}</span>
                  </div>
               )}
            </Section>
         )}

         {detail.blockedByIds && detail.blockedByIds.length > 0 && (
            <Section title="Blocked by">
               <div className="flex flex-col">
                  {detail.blockedByIds.map((identifier) => (
                     <div key={identifier} className="flex items-center gap-1.5 min-w-0">
                        <Ban className="size-3.5 text-red-500 shrink-0" />
                        <IssueRefRow identifier={identifier} />
                     </div>
                  ))}
               </div>
            </Section>
         )}

         {detail.relatedIds && detail.relatedIds.length > 0 && (
            <Section title="Related">
               <div className="flex flex-col">
                  {detail.relatedIds.map((identifier) => (
                     <IssueRefRow key={identifier} identifier={identifier} />
                  ))}
               </div>
            </Section>
         )}

         {detail.prLinks && detail.prLinks.length > 0 && (
            <Section title="Diffs">
               <div className="flex flex-col gap-1">
                  {detail.prLinks.map((pr) => (
                     <div key={pr.id} className="flex items-center gap-2 text-sm min-w-0">
                        <GitPullRequestArrow
                           className={
                              'size-3.5 shrink-0 ' +
                              (pr.status === 'merged' ? 'text-purple-400' : 'text-green-500')
                           }
                        />
                        <span className="text-muted-foreground shrink-0">{pr.id}</span>
                        <span className="truncate">{pr.title}</span>
                        <span className="ml-auto shrink-0 text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-accent text-muted-foreground">
                           {pr.status}
                        </span>
                     </div>
                  ))}
               </div>
            </Section>
         )}
      </div>
   );
}
