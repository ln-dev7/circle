'use client';

import { GroupedIssuesView } from '@/components/common/issues/grouped-issues-view';
import { getProjectDetail } from '@/mock-data/project-details';
import { getProjectById } from '@/mock-data/projects';
import { useIssuesStore } from '@/store/issues-store';
import { displayOrderedStatus } from '@/mock-data/status';
import { useMemo } from 'react';
import { ProjectSidePanel } from './project-side-panel';

interface ProjectIssuesProps {
   projectId: string;
}

/** Project "Issues" tab: the project's issues grouped by status. */
export default function ProjectIssues({ projectId }: ProjectIssuesProps) {
   const project = getProjectById(projectId)!;
   const detail = getProjectDetail(projectId);
   const { issues: allIssues } = useIssuesStore();
   const issues = useMemo(
      () => allIssues.filter((issue) => issue.project?.id === project.id),
      [allIssues, project.id]
   );

   return (
      <div className="w-full h-full flex overflow-hidden">
         <div className="flex-1 min-w-0 h-full overflow-hidden">
            <GroupedIssuesView
               issues={issues}
               totalIssues={issues}
               statuses={displayOrderedStatus}
               isViewTypeGrid={false}
            />
         </div>
         <ProjectSidePanel project={project} detail={detail} issues={issues} />
      </div>
   );
}
