'use client';

import { CycleDetailsPanel } from '@/components/common/cycles/cycle-details-panel';
import { cn } from '@/lib/utils';
import { getCurrentCycle, getUpcomingCycle } from '@/mock-data/cycles';
import { Issue } from '@/mock-data/issues';
import { displayOrderedStatus } from '@/mock-data/status';
import { useFilterStore } from '@/store/filter-store';
import { useIssuesStore } from '@/store/issues-store';
import { useRightPanelStore } from '@/store/right-panel-store';
import { useSearchStore } from '@/store/search-store';
import { useViewStore } from '@/store/view-store';
import { useMemo } from 'react';
import { GroupedIssuesView } from './grouped-issues-view';
import { InsightsPanel } from './insights-panel';
import { SearchIssues } from './search-issues';

export type CycleView = 'active' | 'upcoming';

interface CycleIssuesProps {
   /** 'active' = current cycle, 'upcoming' = next cycle. */
   cycleView: CycleView;
}

/**
 * Issue view scoped to a cycle — same behavior as AllIssues (search,
 * filters, list/board) plus the cycle details / insights side panels.
 */
export default function CycleIssues({ cycleView }: CycleIssuesProps) {
   const { isSearchOpen, searchQuery } = useSearchStore();
   const { viewType } = useViewStore();
   const { hasActiveFilters, filters } = useFilterStore();
   const { issues, filterIssues } = useIssuesStore();
   const { openPanel } = useRightPanelStore();

   const cycle = cycleView === 'active' ? getCurrentCycle() : getUpcomingCycle();

   const isSearching = isSearchOpen && searchQuery.trim() !== '';
   const isViewTypeGrid = viewType === 'grid';
   const isFiltering = hasActiveFilters();

   const cycleIssues = useMemo(
      () => issues.filter((issue) => issue.cycleId === cycle.id),
      [issues, cycle.id]
   );

   const displayedIssues = useMemo(() => {
      if (!isFiltering) return cycleIssues;
      const filtered: Issue[] = filterIssues(filters);
      return filtered.filter((issue) => issue.cycleId === cycle.id);
   }, [cycleIssues, isFiltering, filterIssues, filters, cycle.id]);

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
      <div className="w-full h-full flex overflow-hidden">
         <div
            className={cn(
               'flex-1 min-w-0 h-full',
               isViewTypeGrid ? 'overflow-x-auto' : 'overflow-y-auto'
            )}
         >
            <GroupedIssuesView
               issues={displayedIssues}
               statuses={displayOrderedStatus}
               isViewTypeGrid={isViewTypeGrid}
            />
         </div>

         {openPanel === 'insights' && (
            <aside className="hidden lg:flex w-[420px] shrink-0 border-l h-full overflow-hidden bg-container">
               <InsightsPanel issues={displayedIssues} />
            </aside>
         )}
         {openPanel === 'cycle-details' && (
            <aside className="hidden lg:flex w-[420px] shrink-0 border-l h-full overflow-hidden bg-container">
               <CycleDetailsPanel cycle={cycle} issues={cycleIssues} />
            </aside>
         )}
      </div>
   );
}
