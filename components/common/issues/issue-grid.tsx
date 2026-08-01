'use client';

import { Issue } from '@/mock-data/issues';
import { useDisplaySettingsStore } from '@/store/display-settings-store';
import { format } from 'date-fns';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'motion/react';
import { useEffect, useRef } from 'react';
import { DragSourceMonitor, useDrag, useDragLayer, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { AssigneeUser } from './assignee-user';
import { LabelBadge } from './label-badge';
import { PrioritySelector } from './priority-selector';
import { ProjectBadge } from './project-badge';
import { StatusSelector } from './status-selector';
import { ContextMenu, ContextMenuTrigger } from '@/components/ui/context-menu';
import { IssueContextMenu } from './issue-context-menu';

export const IssueDragType = 'ISSUE';
type IssueGridProps = {
   issue: Issue;
};

// Custom DragLayer component to render the drag preview
function IssueDragPreview({ issue }: { issue: Issue }) {
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

// Custom DragLayer to show custom preview during drag
export function CustomDragLayer() {
   const { itemType, isDragging, item, currentOffset } = useDragLayer((monitor) => ({
      item: monitor.getItem() as Issue,
      itemType: monitor.getItemType(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
   }));

   if (!isDragging || itemType !== IssueDragType || !currentOffset) {
      return null;
   }

   return (
      <div
         className="fixed pointer-events-none z-50 left-0 top-0"
         style={{
            transform: `translate(${currentOffset.x}px, ${currentOffset.y}px)`,
            width: '348px', // Match the width of your cards
         }}
      >
         <IssueDragPreview issue={item} />
      </div>
   );
}

export function IssueGrid({ issue }: IssueGridProps) {
   const ref = useRef<HTMLDivElement>(null);
   const { orgId } = useParams<{ orgId: string }>();
   const { displayProperties } = useDisplaySettingsStore();

   // Set up drag functionality.
   const [{ isDragging }, drag, preview] = useDrag(() => ({
      type: IssueDragType,
      item: issue,
      collect: (monitor: DragSourceMonitor) => ({
         isDragging: monitor.isDragging(),
      }),
   }));

   // Use empty image as drag preview (we'll create a custom one with DragLayer)
   useEffect(() => {
      preview(getEmptyImage(), { captureDraggingState: true });
   }, [preview]);

   // Set up drop functionality.
   const [, drop] = useDrop(() => ({
      accept: IssueDragType,
   }));

   // Connect drag and drop to the element.
   drag(drop(ref));

   return (
      <ContextMenu>
         <ContextMenuTrigger asChild>
            <motion.div
               ref={ref}
               className="w-full p-3 bg-background rounded-md shadow-xs border border-border/50 cursor-default"
               layoutId={`issue-grid-${issue.identifier}`}
               style={{
                  opacity: isDragging ? 0.5 : 1,
                  cursor: isDragging ? 'grabbing' : 'default',
               }}
            >
               <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                     {displayProperties.priority && (
                        <PrioritySelector priority={issue.priority} issueId={issue.id} />
                     )}
                     {displayProperties.id && (
                        <span className="text-xs text-muted-foreground font-medium">
                           {issue.identifier}
                        </span>
                     )}
                  </div>
                  {displayProperties.status && (
                     <StatusSelector status={issue.status} issueId={issue.id} />
                  )}
               </div>
               <Link href={`/${orgId ?? 'lndev-ui'}/issue/${issue.identifier}`}>
                  <h3 className="text-sm font-semibold mb-3 line-clamp-2">{issue.title}</h3>
               </Link>
               <div className="flex flex-wrap gap-1.5 mb-3 min-h-[1.5rem]">
                  {displayProperties.labels && <LabelBadge label={issue.labels} />}
                  {displayProperties.project && issue.project && (
                     <ProjectBadge project={issue.project} />
                  )}
               </div>
               <div className="flex items-center justify-between mt-auto pt-2">
                  {displayProperties.created ? (
                     <span className="text-xs text-muted-foreground">
                        {format(new Date(issue.createdAt), 'MMM dd')}
                     </span>
                  ) : (
                     <span />
                  )}
                  {displayProperties.assignee && <AssigneeUser user={issue.assignee} />}
               </div>
            </motion.div>
         </ContextMenuTrigger>
         <IssueContextMenu issueId={issue.id} />
      </ContextMenu>
   );
}
