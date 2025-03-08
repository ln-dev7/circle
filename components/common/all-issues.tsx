'use client';

import { GroupIssues } from '@/components/common/group-issues';
import { status } from '@/lib/mock-data/status';
import { useIssuesStore } from '@/lib/store/issues-store';
import { useSearchStore } from '@/lib/store/search-store';
import { useViewStore } from '@/lib/store/view-store';
import { cn } from '@/lib/utils';
import { FC } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { SearchIssues } from './search-issues';

export default function AllIssues() {
   const { isSearchOpen, searchQuery } = useSearchStore();
   const { viewType } = useViewStore();

   const isSearching = isSearchOpen && searchQuery.trim() !== '';
   const isViewTypeGrid = viewType === 'grid';

   return (
      <div className={cn('w-full h-full', isViewTypeGrid && 'overflow-x-auto')}>
         {isSearching ? (
            <SearchIssuesView />
         ) : (
            <GroupIssuesListView isViewTypeGrid={isViewTypeGrid} />
         )}
      </div>
   );
}

const SearchIssuesView = () => (
   <div className="px-6 mb-6">
      <SearchIssues />
   </div>
);

const GroupIssuesListView: FC<{
   isViewTypeGrid: boolean;
}> = ({ isViewTypeGrid = false }) => {
   const { issuesByStatus } = useIssuesStore();
   return (
      <DndProvider backend={HTML5Backend}>
         <div className={cn(isViewTypeGrid && 'flex h-full gap-3 px-2 py-2 min-w-max')}>
            {status.map((statusItem) => (
               <GroupIssues
                  key={statusItem.id}
                  status={statusItem}
                  issues={issuesByStatus[statusItem.id] || []}
                  count={issuesByStatus[statusItem.id]?.length || 0}
               />
            ))}
         </div>
      </DndProvider>
   );
};
