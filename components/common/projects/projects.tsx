'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { projects as allProjects, Project } from '@/mock-data/projects';
import { teams } from '@/mock-data/teams';
import { useProjectsFilterStore } from '@/store/projects-filter-store';
import { useProjectsDisplayStore } from '@/store/projects-display-store';
import { useRightPanelStore } from '@/store/right-panel-store';
import { BarChart3 } from 'lucide-react';
import { parseAsStringLiteral, useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { Filter } from '@/components/layout/headers/projects/filter';
import ProjectsBoard from './projects-board';
import { ProjectsDisplayOptions } from './projects-display-options';
import ProjectsInsightsPanel from './projects-insights-panel';
import ProjectsList from './projects-list';
import ProjectsTimeline from './projects-timeline';

export interface ProjectGroup {
   id: string;
   name: string;
   icon?: string;
   projects: Project[];
}

const TABS = ['all', 'active'] as const;

const TAB_ITEMS: { label: string; value: (typeof TABS)[number] }[] = [
   { label: 'All projects', value: 'all' },
   { label: 'Active projects', value: 'active' },
];

/** Status categories considered "active" for the Active projects tab. */
const ACTIVE_CATEGORIES = new Set(['triage', 'backlog', 'unstarted', 'started']);
/** Categories hidden by "Show closed projects: Hide closed". */
const CLOSED_CATEGORIES = new Set(['completed', 'canceled']);

/**
 * Projects page. With a `teamId` the whole page (tabs, filters, display
 * options, views, insights) is scoped to that team's projects.
 */
export default function Projects({ teamId }: { teamId?: string }) {
   const { filters } = useProjectsFilterStore();
   const { viewTypes, grouping, ordering, closedProjects, showEmptyGroups } =
      useProjectsDisplayStore();
   const { openPanel, togglePanel } = useRightPanelStore();
   const [tab, setTab] = useQueryState('tab', parseAsStringLiteral(TABS).withDefault('all'));
   const viewType = viewTypes[tab];

   const displayed = useMemo(() => {
      let list = allProjects.slice();

      if (teamId) {
         list = list.filter((project) => project.teamId === teamId);
      }
      if (tab === 'active') {
         list = list.filter((project) => ACTIVE_CATEGORIES.has(project.status.category));
      }
      if (closedProjects === 'hide') {
         list = list.filter((project) => !CLOSED_CATEGORIES.has(project.status.category));
      }
      if (filters.health.length > 0) {
         const healthSet = new Set(filters.health);
         list = list.filter((project) => healthSet.has(project.health.id));
      }
      if (filters.priority.length > 0) {
         const prioritySet = new Set(filters.priority);
         list = list.filter((project) => prioritySet.has(project.priority.id));
      }

      const compare = (a: Project, b: Project) => {
         switch (ordering) {
            case 'title':
               return a.name.localeCompare(b.name);
            case 'target-date':
               return (a.targetDate ?? '').localeCompare(b.targetDate ?? '');
            case 'start-date':
            default:
               return a.startDate.localeCompare(b.startDate);
         }
      };
      return list.sort(compare);
   }, [tab, closedProjects, filters, ordering, teamId]);

   const groups = useMemo<ProjectGroup[]>(() => {
      if (grouping === 'none') {
         return [{ id: 'all', name: 'All projects', projects: displayed }];
      }
      return teams
         .map((team) => ({
            id: team.id,
            name: team.name,
            icon: team.icon,
            projects: displayed.filter((project) => project.teamId === team.id),
         }))
         .filter((group) => showEmptyGroups || group.projects.length > 0);
   }, [displayed, grouping, showEmptyGroups]);

   return (
      <div className="w-full h-full flex flex-col overflow-hidden">
         {/* Tabs + view controls (Linear-style) */}
         <div className="w-full flex justify-between items-center border-b py-1.5 px-6 h-10 shrink-0">
            <div className="flex items-center gap-1">
               {TAB_ITEMS.map((item) => {
                  const isActive = tab === item.value;
                  return (
                     <button
                        key={item.value}
                        type="button"
                        onClick={() => void setTab(item.value === 'all' ? null : item.value)}
                        className={cn(
                           'px-2.5 h-7 inline-flex items-center rounded-full border text-xs font-medium transition-colors',
                           isActive
                              ? 'bg-accent text-foreground border-border'
                              : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/50'
                        )}
                     >
                        {item.label}
                     </button>
                  );
               })}
            </div>
            <div className="flex items-center gap-1">
               <Filter />
               <ProjectsDisplayOptions />
               <Button
                  size="xs"
                  variant={openPanel === 'insights' ? 'secondary' : 'ghost'}
                  onClick={() => togglePanel('insights')}
                  aria-label="Toggle projects insights panel"
               >
                  <BarChart3 className="size-4" />
               </Button>
            </div>
         </div>

         <div className="flex-1 min-h-0 w-full flex overflow-hidden">
            <div className="flex-1 min-w-0 h-full overflow-hidden">
               {viewType === 'timeline' && <ProjectsTimeline groups={groups} />}
               {viewType === 'board' && <ProjectsBoard groups={groups} />}
               {viewType === 'list' && <ProjectsList groups={groups} />}
            </div>

            {openPanel === 'insights' && (
               <aside className="hidden lg:flex w-[360px] shrink-0 border-l h-full overflow-hidden bg-container">
                  <ProjectsInsightsPanel projects={displayed} />
               </aside>
            )}
         </div>
      </div>
   );
}
