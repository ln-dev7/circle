'use client';

import { getIssueDetail } from '@/mock-data/issue-details';
import { useIssuesStore } from '@/store/issues-store';
import { Paperclip, Plus, SmilePlus } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { AssigneeUser } from '../assignee-user';
import { ActivityFeed } from './activity-feed';
import { ContentBlocks } from './content-blocks';
import { IssuePropertiesPanel } from './issue-properties-panel';

/**
 * Issue detail page: rich description, sub-issues, activity feed and a
 * properties sidebar — Linear-style.
 */
export default function IssueDetails() {
   const { orgId, issueId } = useParams<{ orgId: string; issueId: string }>();
   const { issues } = useIssuesStore();

   const issue = useMemo(
      () => issues.find((candidate) => candidate.identifier === issueId),
      [issues, issueId]
   );

   const detail = useMemo(() => (issue ? getIssueDetail(issue) : null), [issue]);

   if (!issue || !detail) {
      return (
         <div className="flex flex-col items-center justify-center h-full gap-2 text-sm text-muted-foreground">
            <p>Issue {issueId} not found.</p>
            <Link href={`/${orgId ?? 'lndev-ui'}/team/CORE/all`} className="underline">
               Back to issues
            </Link>
         </div>
      );
   }

   const subIssues = (detail.subIssueIds ?? [])
      .map((identifier) => issues.find((candidate) => candidate.identifier === identifier))
      .filter((candidate) => candidate !== undefined);

   return (
      <div className="w-full h-full flex overflow-hidden">
         {/* Main column */}
         <div className="flex-1 min-w-0 h-full overflow-y-auto">
            <div className="max-w-3xl mx-auto px-8 py-10">
               <h1 className="text-3xl font-semibold leading-tight text-balance">{issue.title}</h1>

               <div className="mt-6">
                  <ContentBlocks blocks={detail.description} />
               </div>

               {/* Quick actions */}
               <div className="flex items-center gap-3 mt-6 text-muted-foreground">
                  <button className="hover:text-foreground" aria-label="Add reaction">
                     <SmilePlus className="size-4" />
                  </button>
                  <button className="hover:text-foreground" aria-label="Attach file">
                     <Paperclip className="size-4" />
                  </button>
               </div>

               {/* Sub-issues */}
               <div className="mt-8">
                  {subIssues.length > 0 ? (
                     <>
                        <h2 className="text-sm font-medium mb-1">
                           Sub-issues{' '}
                           <span className="text-muted-foreground">
                              {
                                 subIssues.filter(
                                    (subIssue) => subIssue.status.category === 'completed'
                                 ).length
                              }
                              /{subIssues.length}
                           </span>
                        </h2>
                        <div className="flex flex-col border-t border-border/50">
                           {subIssues.map((subIssue) => (
                              <Link
                                 key={subIssue.id}
                                 href={`/${orgId ?? 'lndev-ui'}/issue/${subIssue.identifier}`}
                                 className="flex items-center gap-2.5 h-10 px-1 border-b border-border/50 hover:bg-sidebar/50 text-sm min-w-0"
                              >
                                 <subIssue.status.icon />
                                 <span className="text-muted-foreground shrink-0 text-xs font-medium">
                                    {subIssue.identifier}
                                 </span>
                                 <span className="truncate font-medium">{subIssue.title}</span>
                                 <span className="ml-auto shrink-0">
                                    <AssigneeUser user={subIssue.assignee} />
                                 </span>
                              </Link>
                           ))}
                        </div>
                     </>
                  ) : (
                     <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                        <Plus className="size-4" />
                        Add sub-issues
                     </button>
                  )}
               </div>

               <div className="border-t border-border/60 mt-8" />

               <ActivityFeed activity={detail.activity} />
            </div>
         </div>

         {/* Properties sidebar */}
         <aside className="hidden lg:block w-80 shrink-0 border-l h-full overflow-y-auto bg-container px-5 py-6">
            <IssuePropertiesPanel issue={issue} detail={detail} />
         </aside>
      </div>
   );
}
