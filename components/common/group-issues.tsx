'use client';

import { Issue } from '@/lib/mock-data/issues';
import { Status } from '@/lib/mock-data/status';
import { useIssuesStore } from '@/lib/store/issues-store';
import { useViewStore } from '@/lib/store/view-store';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { FC, useRef } from 'react';
import { useDrop } from 'react-dnd';
import { Button } from '../ui/button';
import { IssueDragType, IssueGrid } from './issue-grid';
import { IssueLine } from './issue-line';

interface GroupIssuesProps {
   status: Status;
   issues: Issue[];
   count: number;
}

export function GroupIssues({ status, issues, count }: GroupIssuesProps) {
   const { viewType } = useViewStore();
   const isViewTypeGrid = viewType === 'grid';

   return (
      <div
         className={cn(
            'bg-conainer',
            isViewTypeGrid
               ? 'overflow-hidden rounded-md h-full flex-shrink-0 w-[348px] flex flex-col'
               : ''
         )}
      >
         <div
            className={cn(
               'sticky top-0 z-10 bg-container w-full',
               isViewTypeGrid ? 'rounded-t-md h-[50px]' : 'h-10'
            )}
         >
            <div
               className={cn(
                  'w-full h-full flex items-center justify-between',
                  isViewTypeGrid ? 'px-3' : 'px-6'
               )}
               style={{
                  backgroundColor: isViewTypeGrid ? `${status.color}10` : `${status.color}08`,
               }}
            >
               <div className="flex items-center gap-2">
                  <status.icon />
                  <span className="text-sm font-medium">{status.name}</span>
                  <span className="text-sm text-muted-foreground">{count}</span>
               </div>

               <Button className="size-6 " size="icon" variant="ghost">
                  <Plus className="size-4" />
               </Button>
            </div>
         </div>

         {viewType === 'list' ? (
            <div className="space-y-0">
               {issues.map((issue) => (
                  <IssueLine key={issue.id} issue={issue} />
               ))}
            </div>
         ) : (
            <IssueGridList issues={issues} status={status} />
         )}
      </div>
   );
}

const IssueGridList: FC<{ issues: Issue[]; status: Status }> = ({ issues, status }) => {
   const ref = useRef<HTMLDivElement>(null);
   const { updateIssueStatus } = useIssuesStore();

   // Set up drop functionality to accept only issue items.
   const [, drop] = useDrop(() => ({
      accept: IssueDragType,
      drop(item: Issue, monitor) {
         if (monitor.didDrop() && item.status.id !== status.id) {
            updateIssueStatus(item.id, status);
         }
      },
   }));
   drop(ref);

   return (
      <div
         ref={ref}
         className="flex-1 overflow-y-auto p-2 space-y-2 bg-zinc-50/50 dark:bg-zinc-900/50"
      >
         {issues.map((issue) => (
            <IssueGrid key={issue.id} issue={issue} />
         ))}
      </div>
   );
};
