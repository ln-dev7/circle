'use client';

import { Issue } from '@/mock-data/issues';
import { format } from 'date-fns';
import { AssigneeUser } from './assignee-user';
import { LabelBadge } from './label-badge';
import { PrioritySelector } from './priority-selector';
import { ProjectBadge } from './project-badge';
import { StatusSelector } from './status-selector';
import { IssueDragType, type IssueDragItem } from './issue-grid';
import { motion } from 'motion/react';
import { GripVertical } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { DragSourceMonitor, useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

import { ContextMenu, ContextMenuTrigger } from '@/components/ui/context-menu';
import { IssueContextMenu } from './issue-context-menu';
import { useIssueDropLandingStore } from '@/store/issue-drop-landing-store';
import { cn } from '@/lib/utils';

export function IssueLine({ issue }: { issue: Issue }) {
   const isLandingTarget = useIssueDropLandingStore((s) => s.landing?.issueId === issue.id);
   const dragHandleRef = useRef<HTMLButtonElement>(null);

   const [{ isDragging }, drag, preview] = useDrag<
      IssueDragItem,
      unknown,
      { isDragging: boolean }
   >(() => ({
      type: IssueDragType,
      item: { issue, previewVariant: 'list' },
      collect: (monitor: DragSourceMonitor) => ({
         isDragging: monitor.isDragging(),
      }),
   }));

   useEffect(() => {
      preview(getEmptyImage(), { captureDraggingState: true });
   }, [preview]);

   drag(dragHandleRef);

   return (
      <ContextMenu>
         <ContextMenuTrigger asChild>
            <motion.div
               data-issue-drop-land={issue.id}
               className={cn(
                  'w-full flex items-center justify-start h-11 pl-2 pr-6 hover:bg-sidebar/50',
                  isDragging && 'opacity-50',
                  isLandingTarget && 'opacity-0'
               )}
            >
               <button
                  ref={dragHandleRef}
                  type="button"
                  aria-label={`Drag to move ${issue.identifier}`}
                  className="flex shrink-0 items-center justify-center rounded p-1 text-muted-foreground hover:bg-sidebar/80 hover:text-foreground cursor-grab active:cursor-grabbing touch-none"
                  onClick={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
               >
                  <GripVertical className="size-4" aria-hidden />
               </button>
               <div className="flex min-w-0 flex-1 items-center gap-0.5">
                  <PrioritySelector priority={issue.priority} issueId={issue.id} />
                  <span className="text-sm hidden sm:inline-block text-muted-foreground font-medium w-[66px] truncate shrink-0 mr-0.5">
                     {issue.identifier}
                  </span>
                  <StatusSelector status={issue.status} issueId={issue.id} />
                  <span className="min-w-0 flex flex-1 items-center justify-start mr-1 ml-0.5">
                     <span className="text-xs sm:text-sm font-medium sm:font-semibold truncate">
                        {issue.title}
                     </span>
                  </span>
               </div>
               <div className="flex items-center justify-end gap-2 ml-auto sm:w-fit">
                  <div className="w-3 shrink-0"></div>
                  <div className="-space-x-5 hover:space-x-1 lg:space-x-1 items-center justify-end hidden sm:flex duration-200 transition-all">
                     <LabelBadge label={issue.labels} />
                     {issue.project && <ProjectBadge project={issue.project} />}
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0 hidden sm:inline-block">
                     {format(new Date(issue.createdAt), 'MMM dd')}
                  </span>
                  <AssigneeUser user={issue.assignee} />
               </div>
            </motion.div>
         </ContextMenuTrigger>
         <IssueContextMenu issueId={issue.id} />
      </ContextMenu>
   );
}
