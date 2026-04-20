'use client';

import { Issue } from '@/mock-data/issues';
import { priorities } from '@/mock-data/priorities';
import { status as statusCatalog } from '@/mock-data/status';
import { format } from 'date-fns';
import { motion } from 'motion/react';
import { useEffect, useRef } from 'react';
import { DragSourceMonitor, useDrag, useDragLayer } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { GripVertical } from 'lucide-react';
import { AssigneeUser } from './assignee-user';
import { LabelBadge } from './label-badge';
import { PrioritySelector } from './priority-selector';
import { ProjectBadge } from './project-badge';
import { StatusSelector } from './status-selector';
import { ContextMenu, ContextMenuTrigger } from '@/components/ui/context-menu';
import { IssueContextMenu } from './issue-context-menu';
import { useIssueDropLandingStore } from '@/store/issue-drop-landing-store';

export const IssueDragType = 'ISSUE';

export interface IssueDragItem {
   issue: Issue;
   previewVariant: 'list' | 'grid';
}

type IssueGridProps = {
   issue: Issue;
};

export function IssueDragPreviewGrid({ issue }: { issue: Issue }) {
   return (
      <div className="w-full p-3 bg-background rounded-md border border-border/50 overflow-hidden">
         <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
               <PrioritySelector priority={issue.priority} issueId={issue.id} />
               <span className="text-xs text-muted-foreground font-medium">{issue.identifier}</span>
            </div>
            <StatusSelector status={issue.status} issueId={issue.id} />
         </div>

         <h3 className="text-sm font-semibold mb-3 line-clamp-2">{issue.title}</h3>

         <div className="flex flex-wrap gap-1.5 mb-3 min-h-[1.5rem]">
            <LabelBadge label={issue.labels} />
            {issue.project && <ProjectBadge project={issue.project} />}
         </div>

         <div className="flex items-center justify-between mt-auto pt-2">
            <span className="text-xs text-muted-foreground">
               {format(new Date(issue.createdAt), 'MMM dd')}
            </span>
            <AssigneeUser user={issue.assignee} />
         </div>
      </div>
   );
}

export function IssueDragPreviewList({ issue }: { issue: Issue }) {
   const priorityFromCatalog = priorities.find((p) => p.id === issue.priority.id);
   const PriorityIcon = priorityFromCatalog?.icon ?? issue.priority.icon;
   const statusFromCatalog = statusCatalog.find((s) => s.id === issue.status.id);
   const statusColor = statusFromCatalog?.color ?? issue.status.color ?? '#94a3b8';
   const statusName = statusFromCatalog?.name ?? issue.status.name;

   return (
      <div className="flex h-11 w-full items-center gap-2 rounded-md border border-border/50 bg-background px-2 pr-4 shadow-sm">
         <GripVertical className="size-4 shrink-0 text-muted-foreground" aria-hidden />
         {PriorityIcon ? (
            <PriorityIcon className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
         ) : (
            <span className="size-3.5 shrink-0 rounded-sm bg-muted" aria-hidden />
         )}
         <span className="w-[4.5rem] shrink-0 truncate text-xs font-medium text-muted-foreground sm:w-[4.125rem]">
            {issue.identifier}
         </span>
         <span
            className="size-2 shrink-0 rounded-full border border-border/60"
            style={{ backgroundColor: statusColor }}
            title={statusName}
         />
         <span className="min-w-0 flex-1 truncate text-sm font-medium">{issue.title}</span>
         <span className="shrink-0 text-xs text-muted-foreground">
            {format(new Date(issue.createdAt), 'MMM dd')}
         </span>
      </div>
   );
}

// Custom DragLayer to show custom preview during drag
export function CustomDragLayer() {
   const setDragPreviewOffset = useIssueDropLandingStore((s) => s.setDragPreviewOffset);

   const { itemType, isDragging, item, currentOffset } = useDragLayer((monitor) => ({
      item: monitor.getItem() as IssueDragItem | null,
      itemType: monitor.getItemType(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
   }));

   useEffect(() => {
      if (isDragging && currentOffset) {
         setDragPreviewOffset({ x: currentOffset.x, y: currentOffset.y });
      }
   }, [isDragging, currentOffset, setDragPreviewOffset]);

   if (!isDragging || itemType !== IssueDragType || !currentOffset || !item?.issue) {
      return null;
   }

   const { issue, previewVariant } = item;
   const isListPreview = previewVariant === 'list';

   return (
      <div
         className="fixed pointer-events-none z-50 left-0 top-0"
         style={{
            transform: `translate(${currentOffset.x}px, ${currentOffset.y}px)`,
            width: isListPreview ? 'min(36rem, calc(100vw - 1.5rem))' : '348px',
         }}
      >
         {isListPreview ? (
            <IssueDragPreviewList issue={issue} />
         ) : (
            <IssueDragPreviewGrid issue={issue} />
         )}
      </div>
   );
}

export function IssueGrid({ issue }: IssueGridProps) {
   const ref = useRef<HTMLDivElement>(null);
   const isLandingTarget = useIssueDropLandingStore((s) => s.landing?.issueId === issue.id);

   const [{ isDragging }, drag, preview] = useDrag<
      IssueDragItem,
      unknown,
      { isDragging: boolean }
   >(() => ({
      type: IssueDragType,
      item: { issue, previewVariant: 'grid' },
      collect: (monitor: DragSourceMonitor) => ({
         isDragging: monitor.isDragging(),
      }),
   }));

   useEffect(() => {
      preview(getEmptyImage(), { captureDraggingState: true });
   }, [preview]);

   drag(ref);

   return (
      <ContextMenu>
         <ContextMenuTrigger asChild>
            <motion.div
               ref={ref}
               data-issue-drop-land={issue.id}
               className="w-full p-3 bg-background rounded-md shadow-xs border border-border/50 cursor-default"
               style={{
                  opacity: isLandingTarget ? 0 : isDragging ? 0.5 : 1,
                  cursor: isDragging ? 'grabbing' : 'default',
               }}
            >
               <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                     <PrioritySelector priority={issue.priority} issueId={issue.id} />
                     <span className="text-xs text-muted-foreground font-medium">
                        {issue.identifier}
                     </span>
                  </div>
                  <StatusSelector status={issue.status} issueId={issue.id} />
               </div>
               <h3 className="text-sm font-semibold mb-3 line-clamp-2">{issue.title}</h3>
               <div className="flex flex-wrap gap-1.5 mb-3 min-h-[1.5rem]">
                  <LabelBadge label={issue.labels} />
                  {issue.project && <ProjectBadge project={issue.project} />}
               </div>
               <div className="flex items-center justify-between mt-auto pt-2">
                  <span className="text-xs text-muted-foreground">
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
