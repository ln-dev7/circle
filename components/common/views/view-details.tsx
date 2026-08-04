'use client';

import { GroupedIssuesView } from '@/components/common/issues/grouped-issues-view';
import { InsightsPanel } from '@/components/common/issues/insights-panel';
import ProjectsList from '@/components/common/projects/projects-list';
import { ProjectGroup } from '@/components/common/projects/projects';
import { status as allStatus } from '@/mock-data/status';
import {
   filterIssuesForView,
   filterProjectsForView,
   getViewById,
   View,
} from '@/mock-data/views';
import { useRightPanelStore } from '@/store/right-panel-store';
import { useMemo } from 'react';

function IssueViewBody({ view }: { view: View }) {
   const { openPanel } = useRightPanelStore();
   const issues = useMemo(() => filterIssuesForView(view), [view]);

   return (
      <div className="w-full h-full flex flex-col overflow-hidden">
         <div className="flex-1 min-h-0 w-full flex overflow-hidden">
            <div className="flex-1 min-w-0 h-full overflow-hidden">
               <GroupedIssuesView
                  issues={issues}
                  totalIssues={issues}
                  statuses={allStatus}
                  isViewTypeGrid={false}
               />
            </div>
            {openPanel === 'insights' && (
               <aside className="hidden lg:flex w-[420px] shrink-0 border-l h-full overflow-hidden bg-container">
                  <InsightsPanel issues={issues} />
               </aside>
            )}
         </div>
      </div>
   );
}

function ProjectViewBody({ view }: { view: View }) {
   const groups = useMemo<ProjectGroup[]>(() => {
      const projects = filterProjectsForView(view);
      const byStatus = new Map<string, ProjectGroup>();
      for (const project of projects) {
         const key = project.status.id;
         if (!byStatus.has(key)) {
            byStatus.set(key, { id: key, name: project.status.name, projects: [] });
         }
         byStatus.get(key)!.projects.push(project);
      }
      return [...byStatus.values()];
   }, [view]);

   return <ProjectsList groups={groups} />;
}

/** Saved-view detail page: filtered issues (with insights) or projects. */
export default function ViewDetails({ viewId }: { viewId: string }) {
   const view = getViewById(viewId);

   if (!view) {
      return (
         <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
            View not found
         </div>
      );
   }

   return view.type === 'issue' ? <IssueViewBody view={view} /> : <ProjectViewBody view={view} />;
}
