'use client';

import { Issue } from '@/mock-data/issues';
import { Status } from '@/mock-data/status';
import { useIssuesStore } from '@/store/issues-store';
import { useViewStore } from '@/store/view-store';
import { useIssueDropLandingStore } from '@/store/issue-drop-landing-store';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { FC, useRef } from 'react';
import { useDrop } from 'react-dnd';
import { Button } from '../../ui/button';
import { IssueDragType, IssueGrid, type IssueDragItem } from './issue-grid';
import { IssueLine } from './issue-line';
import { useCreateIssueStore } from '@/store/create-issue-store';
import { sortIssuesByPriority } from '@/mock-data/issues';
import { AnimatePresence, motion } from 'motion/react';

function useStatusColumnDrop(status: Status) {
   const ref = useRef<HTMLDivElement>(null);
   const { updateIssueStatus } = useIssuesStore();

   const [{ isOver, canDrop, isSameStatus }, drop] = useDrop<
      IssueDragItem,
      void,
      { isOver: boolean; canDrop: boolean; isSameStatus: boolean }
   >(() => ({
      accept: IssueDragType,
      drop(item, monitor) {
         const issue = item.issue;
         if (issue.status.id !== status.id) {
            const state = useIssueDropLandingStore.getState();
            const origin =
               state.dragPreviewOffset ??
               monitor.getSourceClientOffset() ??
               monitor.getClientOffset();
            if (origin) {
               state.beginLanding({
                  issueId: issue.id,
                  issue,
                  x: origin.x,
                  y: origin.y,
                  previewVariant: item.previewVariant,
               });
            }
            updateIssueStatus(issue.id, status);
         }
      },
      collect: (monitor) => {
         const dragged = monitor.getItem() as IssueDragItem | undefined;
         const issue = dragged?.issue;
         return {
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
            isSameStatus: issue ? issue.status.id === status.id : false,
         };
      },
   }));
   drop(ref);

   const isDropActive = isOver && canDrop && !isSameStatus;

   return { ref, isDropActive };
}

function StatusColumnDropHighlight({
   isActive,
   message,
   isBoardColumn,
}: {
   isActive: boolean;
   message: string;
   isBoardColumn: boolean;
}) {
   return (
      <AnimatePresence>
         {isActive && (
            <motion.div
               initial={false}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               transition={{ opacity: { duration: 0.08 } }}
               aria-hidden
               className={cn(
                  'pointer-events-none absolute inset-0 z-20 flex items-center justify-center border-2 border-dashed border-ring bg-accent/30 dark:border-sidebar-border dark:bg-sidebar-accent/50',
                  isBoardColumn && 'rounded-md'
               )}
            >
               <span className="max-w-[90%] rounded-md border border-border bg-card/95 px-3 py-1.5 text-center text-sm font-medium text-foreground shadow-sm dark:border-sidebar-border dark:bg-sidebar dark:text-sidebar-foreground">
                  {message}
               </span>
            </motion.div>
         )}
      </AnimatePresence>
   );
}

interface GroupIssuesProps {
   status: Status;
   issues: Issue[];
   count: number;
}

export function GroupIssues({ status, issues, count }: GroupIssuesProps) {
   const { viewType } = useViewStore();
   const isViewTypeGrid = viewType === 'grid';
   const { openModal } = useCreateIssueStore();
   const sortedIssues = sortIssuesByPriority(issues);
   const { ref: columnRef, isDropActive } = useStatusColumnDrop(status);

   return (
      <div
         ref={columnRef}
         className={cn(
            'bg-conainer relative',
            isViewTypeGrid
               ? 'overflow-hidden rounded-md h-full flex-shrink-0 w-[348px] flex flex-col'
               : ''
         )}
      >
         <StatusColumnDropHighlight
            isActive={isDropActive}
            isBoardColumn={isViewTypeGrid}
            message={isViewTypeGrid ? 'Release to move here' : 'Release to change status'}
         />
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

               <Button
                  className="size-6"
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                     e.stopPropagation();
                     openModal(status);
                  }}
               >
                  <Plus className="size-4" />
               </Button>
            </div>
         </div>

         {viewType === 'list' ? (
            <div className="space-y-0">
               {sortedIssues.map((issue) => (
                  <IssueLine key={issue.id} issue={issue} />
               ))}
            </div>
         ) : (
            <IssueGridList issues={issues} />
         )}
      </div>
   );
}

const IssueGridList: FC<{ issues: Issue[] }> = ({ issues }) => {
   const sortedIssues = sortIssuesByPriority(issues);

   return (
      <div className="flex-1 min-h-0 h-full overflow-y-auto p-2 space-y-2 bg-zinc-50/50 dark:bg-zinc-900/50">
         {sortedIssues.map((issue) => (
            <IssueGrid key={issue.id} issue={issue} />
         ))}
      </div>
   );
};
