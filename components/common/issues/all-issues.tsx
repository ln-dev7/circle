'use client';

import { cn } from '@/lib/utils';
import { Issue } from '@/mock-data/issues';
import { getStatusesByCategory, StatusCategory, displayOrderedStatus } from '@/mock-data/status';
import { useFilterStore } from '@/store/filter-store';
import { useIssuesStore } from '@/store/issues-store';
import { applyIssueFilters } from './issue-filter-columns';
import { IssueFilterBar } from './issue-filter-bar';
import { useRightPanelStore } from '@/store/right-panel-store';
import { useSearchStore } from '@/store/search-store';
import { useViewStore } from '@/store/view-store';
import { useMemo } from 'react';
import { GroupedIssuesView } from './grouped-issues-view';
import { InsightsPanel } from './insights-panel';
import { SearchIssues } from './search-issues';

interface AllIssuesProps {
   /**
    * Optional status-category filter, used by the "Active" and "Backlog"
    * tabs. When omitted, every status is shown ("All issues").
    */
   categories?: StatusCategory[];
}

export default function AllIssues({ categories }: AllIssuesProps) {
   const { isSearchOpen, searchQuery } = useSearchStore();
   const { viewType } = useViewStore();
   const { filters } = useFilterStore();
   const { issues } = useIssuesStore();
   const { openPanel } = useRightPanelStore();

   const isSearching = isSearchOpen && searchQuery.trim() !== '';
   const isViewTypeGrid = viewType === 'grid';

   const statuses = useMemo(
      () => (categories ? getStatusesByCategory(categories) : displayOrderedStatus),
      [categories]
   );

   const displayedIssues = useMemo(() => {
      let result: Issue[] = applyIssueFilters(issues, filters);
      if (categories) {
         result = result.filter((issue) => categories.includes(issue.status.category));
      }
      return result;
   }, [issues, filters, categories]);

   if (isSearching) {
      return (
         <div className="w-full h-full">
            <div className="px-6 mb-6">
               <SearchIssues />
            </div>
         </div>
      );
   }

   return (
      <div className="w-full h-full flex flex-col overflow-hidden">
         <IssueFilterBar />
         <div className="flex-1 min-h-0 w-full flex overflow-hidden">
            <div
               className={cn(
                  'flex-1 min-w-0 h-full',
                  isViewTypeGrid ? 'overflow-x-auto' : 'overflow-y-auto'
               )}
            >
               <GroupedIssuesView
                  issues={displayedIssues}
                  statuses={statuses}
                  isViewTypeGrid={isViewTypeGrid}
               />
            </div>

            {openPanel === 'insights' && (
               <aside className="hidden lg:flex w-[420px] shrink-0 border-l h-full overflow-hidden bg-container">
                  <InsightsPanel issues={displayedIssues} />
               </aside>
            )}
         </div>
      </div>
   );
}
