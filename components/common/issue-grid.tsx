'use client';

import { Issue } from '@/lib/mock-data/issues';
import { format } from 'date-fns';
import { motion } from 'motion/react';
import { useRef } from 'react';
import { DragSourceMonitor, useDrag, useDrop } from 'react-dnd';
import { AssigneeUser } from './assignee-user';
import { LabelBadge } from './label-badge';
import { PrioritySelector } from './priority-selector';
import { ProjectBadge } from './project-badge';
import { StatusSelector } from './status-selector';

export const IssueDragType = 'ISSUE';
type IssueGridProps = {
   issue: Issue;
};
export function IssueGrid({ issue }: IssueGridProps) {
   const ref = useRef<HTMLDivElement>(null);

   // Set up drag functionality.
   const [{ isDragging }, drag] = useDrag(() => ({
      type: IssueDragType,
      item: issue,
      collect: (monitor: DragSourceMonitor) => ({
         isDragging: monitor.isDragging(),
      }),
   }));

   // Set up drop functionality.
   const [, drop] = useDrop(() => ({
      accept: IssueDragType,
   }));

   // Connect drag and drop to the element.
   drag(drop(ref));

   return (
      <motion.div
         ref={ref}
         layoutId={`issue-grid-${issue.identifier}`}
         className="w-full p-3 bg-background rounded-md shadow-xs border border-border/50 cursor-pointer"
         style={{ opacity: isDragging ? 0.5 : 1 }}
      >
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
            <AssigneeUser user={issue.assignees} />
         </div>
      </motion.div>
   );
}
