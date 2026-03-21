'use client';

import { Issue } from '@/mock-data/issues';
import { Status } from '@/mock-data/status';
import { useIssuesStore } from '@/store/issues-store';
import { useViewStore } from '@/store/view-store';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { FC, useEffect, useRef } from 'react';
import { DragSourceMonitor, useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { Button } from '../../ui/button';
import { IssueDragType, IssueGrid } from './issue-grid';
import { IssueLine } from './issue-line';
import { useCreateIssueStore } from '@/store/create-issue-store';
import { sortIssuesByPriority, sortIssuesByRank } from '@/mock-data/issues';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

interface GroupIssuesProps {
   status: Status;
   issues: Issue[];
   count: number;
   listDnd?: ListDndController;
}

interface ListDropTarget {
   statusId: string;
   index: number;
}

interface ListDndController {
   activeIssueId: string | null;
   dropTarget: ListDropTarget | null;
   onDragStart: (issueId: string) => void;
   onDragEnd: () => void;
   onMoveIssue: (issueId: string, targetStatusId: string, targetIndex: number) => void;
   onDropIssue: (issueId: string) => void;
}

interface ListDragItem {
   id: string;
}

const IssueListDragType = 'ISSUE_LIST';

export function GroupIssues({ status, issues, count, listDnd }: GroupIssuesProps) {
   const { viewType } = useViewStore();
   const isViewTypeGrid = viewType === 'grid';
   const { openModal } = useCreateIssueStore();
   const sortedIssues = isViewTypeGrid
      ? sortIssuesByPriority(issues)
      : listDnd
        ? issues
        : sortIssuesByRank(issues);
   const isDropStatusActive = listDnd?.dropTarget?.statusId === status.id;

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
                  backgroundColor: isViewTypeGrid
                     ? `${status.color}10`
                     : isDropStatusActive
                       ? `${status.color}14`
                       : `${status.color}08`,
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
            <IssueList status={status} issues={sortedIssues} listDnd={listDnd} />
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
   const [{ isOver }, drop] = useDrop(() => ({
      accept: IssueDragType,
      drop(item: Issue, monitor) {
         if (monitor.didDrop() && item.status.id !== status.id) {
            updateIssueStatus(item.id, status);
         }
      },
      collect: (monitor) => ({
         isOver: !!monitor.isOver(),
      }),
   }));
   drop(ref);

   const sortedIssues = sortIssuesByPriority(issues);

   return (
      <div
         ref={ref}
         className="flex-1 h-full overflow-y-auto p-2 space-y-2 bg-zinc-50/50 dark:bg-zinc-900/50 relative"
      >
         <AnimatePresence>
            {isOver && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className="fixed top-0 left-0 right-0 bottom-0 z-10 flex items-center justify-center pointer-events-none bg-background/90"
                  style={{
                     width: ref.current?.getBoundingClientRect().width || '100%',
                     height: ref.current?.getBoundingClientRect().height || '100%',
                     transform: `translate(${ref.current?.getBoundingClientRect().left || 0}px, ${ref.current?.getBoundingClientRect().top || 0}px)`,
                  }}
               >
                  <div className="bg-background border border-border rounded-md p-3 shadow-md max-w-[90%]">
                     <p className="text-sm font-medium text-center">Board ordered by priority</p>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
         {sortedIssues.map((issue) => (
            <IssueGrid key={issue.id} issue={issue} />
         ))}
      </div>
   );
};

const IssueList: FC<{
   status: Status;
   issues: Issue[];
   listDnd?: ListDndController;
}> = ({ status, issues, listDnd }) => {
   const ref = useRef<HTMLDivElement>(null);

   const [, drop] = useDrop(() => ({
      accept: IssueListDragType,
      hover(item: ListDragItem, monitor) {
         if (!listDnd) return;
         if (!monitor.isOver({ shallow: true })) return;
         if (!ref.current) return;

         const clientOffset = monitor.getClientOffset();
         if (!clientOffset) return;

         if (issues.length === 0) {
            listDnd.onMoveIssue(item.id, status.id, 0);
            return;
         }

         const rect = ref.current.getBoundingClientRect();
         if (clientOffset.y >= rect.bottom - 6) {
            listDnd.onMoveIssue(item.id, status.id, issues.length);
         }
      },
      drop(item: ListDragItem, monitor) {
         if (!listDnd) return;
         if (!monitor.didDrop()) {
            listDnd.onDropIssue(item.id);
         }
      },
   }));

   drop(ref);

   return (
      <div ref={ref} className="space-y-0 relative">
         {issues.map((issue, index) => (
            <SortableIssueLine
               key={issue.id}
               issue={issue}
               index={index}
               statusId={status.id}
               listDnd={listDnd}
               showInsertBefore={
                  !!listDnd &&
                  listDnd.activeIssueId !== issue.id &&
                  listDnd.dropTarget?.statusId === status.id &&
                  listDnd.dropTarget.index === index
               }
            />
         ))}
         {listDnd && (
            <ListEndDropZone
               statusId={status.id}
               index={issues.length}
               listDnd={listDnd}
               showInsertLine={
                  listDnd.dropTarget?.statusId === status.id &&
                  listDnd.dropTarget.index === issues.length
               }
            />
         )}
      </div>
   );
};

const SortableIssueLine: FC<{
   issue: Issue;
   index: number;
   statusId: string;
   listDnd?: ListDndController;
   showInsertBefore: boolean;
}> = ({ issue, index, statusId, listDnd, showInsertBefore }) => {
   const ref = useRef<HTMLDivElement>(null);

   const [{ isDragging }, drag, preview] = useDrag(
      () => ({
         type: IssueListDragType,
         item: () => {
            listDnd?.onDragStart(issue.id);
            return { id: issue.id };
         },
         collect: (monitor: DragSourceMonitor) => ({
            isDragging: monitor.isDragging(),
         }),
         canDrag: () => !!listDnd,
         end: (_, monitor) => {
            if (listDnd && !monitor.didDrop()) {
               listDnd.onDragEnd();
            }
         },
      }),
      [listDnd, issue.id]
   );

   useEffect(() => {
      preview(getEmptyImage(), { captureDraggingState: true });
   }, [preview]);

   const [, drop] = useDrop(
      () => ({
         accept: IssueListDragType,
         hover(item: ListDragItem, monitor) {
            if (!listDnd) return;
            if (!ref.current) return;
            if (item.id === issue.id) return;

            const hoverRect = ref.current.getBoundingClientRect();
            const hoverMiddleY = (hoverRect.bottom - hoverRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            if (!clientOffset) return;

            const hoverClientY = clientOffset.y - hoverRect.top;
            const targetIndex = hoverClientY < hoverMiddleY ? index : index + 1;
            listDnd.onMoveIssue(item.id, statusId, targetIndex);
         },
         drop(item: ListDragItem, monitor) {
            if (!listDnd) return;
            if (!monitor.didDrop()) {
               listDnd.onDropIssue(item.id);
            }
         },
      }),
      [listDnd, issue.id, index, statusId]
   );

   drag(drop(ref));

   return (
      <div ref={ref} className="relative">
         {showInsertBefore && <InsertLine />}
         <div
            className={cn(
               'transition-opacity duration-150',
               isDragging && 'opacity-40',
               listDnd && 'cursor-grab active:cursor-grabbing'
            )}
         >
            <IssueLine issue={issue} layoutId={true} />
         </div>
      </div>
   );
};

const ListEndDropZone: FC<{
   statusId: string;
   index: number;
   listDnd: ListDndController;
   showInsertLine: boolean;
}> = ({ statusId, index, listDnd, showInsertLine }) => {
   const ref = useRef<HTMLDivElement>(null);

   const [, drop] = useDrop(
      () => ({
         accept: IssueListDragType,
         hover(item: ListDragItem) {
            listDnd.onMoveIssue(item.id, statusId, index);
         },
         drop(item: ListDragItem, monitor) {
            if (!monitor.didDrop()) {
               listDnd.onDropIssue(item.id);
            }
         },
      }),
      [listDnd, statusId, index]
   );
   drop(ref);

   return (
      <div ref={ref} className="relative h-2">
         {showInsertLine && <InsertLine />}
      </div>
   );
};

const INSERT_LINE_LAYOUT_ID = 'list-insert-indicator';

const InsertLine = () => {
   const prefersReducedMotion = useReducedMotion();

   const transition = prefersReducedMotion
      ? { duration: 0 }
      : {
           layout: {
              type: 'spring' as const,
              stiffness: 420,
              damping: 36,
              mass: 0.72,
           },
           opacity: { duration: 0.22, ease: [0.16, 1, 0.3, 1] as const },
           scaleX: {
              type: 'spring' as const,
              stiffness: 480,
              damping: 34,
              mass: 0.65,
           },
        };

   return (
      <motion.div
         layoutId={INSERT_LINE_LAYOUT_ID}
         initial={{ opacity: 0, scaleX: 0.72 }}
         animate={{ opacity: 1, scaleX: 1 }}
         transition={transition}
         className="absolute left-6 right-6 -top-px h-[2px] origin-center rounded-full bg-primary/70 pointer-events-none"
      />
   );
};
