'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Issue, sortIssuesByPriority } from '@/mock-data/issues';
import { priorities } from '@/mock-data/priorities';
import { Status } from '@/mock-data/status';
import { useDisplaySettingsStore } from '@/store/display-settings-store';
import { Box, User } from 'lucide-react';
import { FC, useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { GroupIssues, IssueGroupDescriptor } from './group-issues';
import { CustomDragLayer } from './issue-grid';

interface GroupedIssuesViewProps {
   issues: Issue[];
   /** Statuses to render when grouping by status (empty groups are skipped unless enabled). */
   statuses: Status[];
   isViewTypeGrid: boolean;
}

const sortIssues = (issues: Issue[], ordering: string): Issue[] => {
   switch (ordering) {
      case 'created':
         return [...issues].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
         );
      case 'title':
         return [...issues].sort((a, b) => a.title.localeCompare(b.title));
      case 'priority':
      default:
         return sortIssuesByPriority(issues);
   }
};

/**
 * Issues grouped according to the Display settings (grouping, ordering,
 * completed visibility, empty groups) — list rows or board columns.
 * Shared by the All/Active/Backlog views and the cycle views.
 */
export const GroupedIssuesView: FC<GroupedIssuesViewProps> = ({
   issues,
   statuses,
   isViewTypeGrid,
}) => {
   const { grouping, ordering, completedIssues, showEmptyGroups } = useDisplaySettingsStore();

   const groups = useMemo(() => {
      let visibleIssues = issues;
      if (completedIssues === 'none') {
         visibleIssues = visibleIssues.filter(
            (issue) => issue.status.category !== 'completed' && issue.status.category !== 'canceled'
         );
      }

      const buildGroups = (): { group: IssueGroupDescriptor; issues: Issue[] }[] => {
         switch (grouping) {
            case 'assignee': {
               const assignees = new Map<string, Issue[]>();
               for (const issue of visibleIssues) {
                  const key = issue.assignee?.id ?? 'no-assignee';
                  assignees.set(key, [...(assignees.get(key) ?? []), issue]);
               }
               return [...assignees.entries()]
                  .sort((a, b) => b[1].length - a[1].length)
                  .map(([key, groupIssues]) => {
                     const assignee = groupIssues[0].assignee;
                     return {
                        group: {
                           id: key,
                           name: assignee?.name ?? 'No assignee',
                           color: '#8f9299',
                           icon: assignee ? (
                              <Avatar className="size-4">
                                 <AvatarImage src={assignee.avatarUrl} alt={assignee.name} />
                                 <AvatarFallback>{assignee.name[0]}</AvatarFallback>
                              </Avatar>
                           ) : (
                              <User className="size-4 text-muted-foreground" />
                           ),
                        },
                        issues: groupIssues,
                     };
                  });
            }
            case 'priority': {
               return priorities
                  .map((priority) => ({
                     group: {
                        id: priority.id,
                        name: priority.name,
                        color: '#8f9299',
                        icon: <priority.icon className="size-4 text-muted-foreground" />,
                     },
                     issues: visibleIssues.filter((issue) => issue.priority.id === priority.id),
                  }))
                  .filter((entry) => showEmptyGroups || entry.issues.length > 0);
            }
            case 'project': {
               const withProject = new Map<string, Issue[]>();
               for (const issue of visibleIssues) {
                  const key = issue.project?.id ?? 'no-project';
                  withProject.set(key, [...(withProject.get(key) ?? []), issue]);
               }
               return [...withProject.entries()]
                  .sort((a, b) => b[1].length - a[1].length)
                  .map(([key, groupIssues]) => {
                     const project = groupIssues[0].project;
                     const Icon = project?.icon ?? Box;
                     return {
                        group: {
                           id: key,
                           name: project?.name ?? 'No project',
                           color: '#8f9299',
                           icon: <Icon className="size-4 text-muted-foreground" />,
                        },
                        issues: groupIssues,
                     };
                  });
            }
            case 'none': {
               return [
                  {
                     group: {
                        id: 'all',
                        name: 'All issues',
                        color: '#8f9299',
                        icon: <Box className="size-4 text-muted-foreground" />,
                     },
                     issues: visibleIssues,
                  },
               ];
            }
            case 'status':
            default: {
               return statuses
                  .map((statusItem) => ({
                     group: {
                        id: statusItem.id,
                        name: statusItem.name,
                        color: statusItem.color,
                        icon: <statusItem.icon />,
                        status: statusItem,
                     },
                     issues: visibleIssues.filter((issue) => issue.status.id === statusItem.id),
                  }))
                  .filter((entry) => showEmptyGroups || entry.issues.length > 0);
            }
         }
      };

      return buildGroups().map((entry) => ({
         ...entry,
         issues: sortIssues(entry.issues, ordering),
      }));
   }, [issues, statuses, grouping, ordering, completedIssues, showEmptyGroups]);

   if (groups.length === 0) {
      return (
         <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
            No issues to show.
         </div>
      );
   }

   return (
      <DndProvider backend={HTML5Backend}>
         <CustomDragLayer />
         <div className={cn(isViewTypeGrid && 'flex h-full gap-3 px-2 py-2 min-w-max')}>
            {groups.map((entry) => (
               <GroupIssues
                  key={entry.group.id}
                  group={entry.group}
                  issues={entry.issues}
                  count={entry.issues.length}
               />
            ))}
         </div>
      </DndProvider>
   );
};
