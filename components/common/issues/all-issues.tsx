'use client';

import { status } from '@/mock-data/status';
import { useIssuesStore } from '@/store/issues-store';
import { useSearchStore } from '@/store/search-store';
import { useViewStore } from '@/store/view-store';
import { useFilterStore } from '@/store/filter-store';
import { FC, useEffect, useMemo, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { GroupIssues } from './group-issues';
import { SearchIssues } from './search-issues';
import { CustomDragLayer } from './issue-grid';
import { LayoutGroup } from 'motion/react';
import { cn, LexoRank } from '@/lib/utils';
import { Issue } from '@/mock-data/issues';

interface IssuesByStatus {
   [statusId: string]: Issue[];
}

interface ListDropTarget {
   statusId: string;
   index: number;
}

export default function AllIssues() {
   const { isSearchOpen, searchQuery } = useSearchStore();
   const { viewType } = useViewStore();
   const { hasActiveFilters } = useFilterStore();

   const isSearching = isSearchOpen && searchQuery.trim() !== '';
   const isViewTypeGrid = viewType === 'grid';
   const isFiltering = hasActiveFilters();

   return (
      <div className={cn('w-full h-full', isViewTypeGrid && 'overflow-x-auto')}>
         {isSearching ? (
            <SearchIssuesView />
         ) : isFiltering ? (
            <FilteredIssuesView isViewTypeGrid={isViewTypeGrid} />
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

const FilteredIssuesView: FC<{
   isViewTypeGrid: boolean;
}> = ({ isViewTypeGrid = false }) => {
   const { filters } = useFilterStore();
   const { filterIssues } = useIssuesStore();

   const filteredIssues = useMemo(() => {
      return filterIssues(filters);
   }, [filterIssues, filters]);

   const filteredIssuesByStatus = useMemo(() => {
      const result: IssuesByStatus = {};

      status.forEach((statusItem) => {
         result[statusItem.id] = filteredIssues.filter(
            (issue) => issue.status.id === statusItem.id
         );
      });

      return result;
   }, [filteredIssues]);

   return (
      <GroupedIssuesWithListDnd
         isViewTypeGrid={isViewTypeGrid}
         baseGroupedIssues={filteredIssuesByStatus}
         countForStatus={(statusId) => filteredIssuesByStatus[statusId]?.length ?? 0}
      />
   );
};

const GroupIssuesListView: FC<{
   isViewTypeGrid: boolean;
}> = ({ isViewTypeGrid = false }) => {
   const { issuesByStatus } = useIssuesStore();

   return (
      <GroupedIssuesWithListDnd
         isViewTypeGrid={isViewTypeGrid}
         baseGroupedIssues={issuesByStatus}
         countForStatus={(statusId) => issuesByStatus[statusId]?.length ?? 0}
      />
   );
};

interface GroupedIssuesWithListDndProps {
   isViewTypeGrid: boolean;
   baseGroupedIssues: IssuesByStatus;
   countForStatus: (statusId: string) => number;
}

const GroupedIssuesWithListDnd: FC<GroupedIssuesWithListDndProps> = ({
   isViewTypeGrid,
   baseGroupedIssues,
   countForStatus,
}) => {
   const { moveIssueInList } = useIssuesStore();
   const [previewByStatus, setPreviewByStatus] = useState<IssuesByStatus | null>(null);
   const [activeIssueId, setActiveIssueId] = useState<string | null>(null);
   const [dropTarget, setDropTarget] = useState<ListDropTarget | null>(null);

   const normalizeIssuesByStatus = (source: IssuesByStatus): IssuesByStatus => {
      const copy: IssuesByStatus = {};
      status.forEach((statusItem) => {
         copy[statusItem.id] = [...(source[statusItem.id] || [])].sort((a, b) =>
            a.rank.localeCompare(b.rank)
         );
      });
      return copy;
   };

   const currentIssuesByStatus = useMemo(
      () => previewByStatus ?? normalizeIssuesByStatus(baseGroupedIssues),
      [previewByStatus, baseGroupedIssues]
   );

   const movePreviewIssue = (issueId: string, targetStatusId: string, targetIndex: number) => {
      setPreviewByStatus((prev) => {
         const next = normalizeIssuesByStatus(prev ?? baseGroupedIssues);

         let sourceStatusId: string | null = null;
         let sourceIndex = -1;
         let draggedIssue: Issue | undefined;

         for (const statusId of Object.keys(next)) {
            const index = next[statusId].findIndex((issue) => issue.id === issueId);
            if (index !== -1) {
               sourceStatusId = statusId;
               sourceIndex = index;
               draggedIssue = next[statusId][index];
               break;
            }
         }

         if (!sourceStatusId || !draggedIssue) {
            return prev ?? next;
         }

         const boundedTargetIndex = Math.max(
            0,
            Math.min(targetIndex, next[targetStatusId]?.length ?? 0)
         );
         const adjustedTargetIndex =
            sourceStatusId === targetStatusId && sourceIndex < boundedTargetIndex
               ? boundedTargetIndex - 1
               : boundedTargetIndex;

         if (sourceStatusId === targetStatusId && sourceIndex === adjustedTargetIndex) {
            return prev ?? next;
         }

         next[sourceStatusId] = next[sourceStatusId].filter((issue) => issue.id !== issueId);
         next[targetStatusId] = next[targetStatusId] || [];
         next[targetStatusId].splice(adjustedTargetIndex, 0, draggedIssue);

         return next;
      });

      setDropTarget({ statusId: targetStatusId, index: targetIndex });
   };

   const startListDrag = (issueId: string) => {
      setActiveIssueId(issueId);
      setPreviewByStatus(normalizeIssuesByStatus(baseGroupedIssues));
   };

   const endListDrag = () => {
      setActiveIssueId(null);
      setPreviewByStatus(null);
      setDropTarget(null);
   };

   const commitListDrop = (issueId: string) => {
      const source = previewByStatus ?? baseGroupedIssues;

      let finalStatusId: string | null = null;
      let finalIndex = -1;
      Object.keys(source).some((statusId) => {
         const index = (source[statusId] || []).findIndex((issue) => issue.id === issueId);
         if (index !== -1) {
            finalStatusId = statusId;
            finalIndex = index;
            return true;
         }
         return false;
      });

      if (!finalStatusId || finalIndex < 0) {
         endListDrag();
         return;
      }

      const targetStatus = status.find((statusItem) => statusItem.id === finalStatusId);
      if (!targetStatus) {
         endListDrag();
         return;
      }

      const targetList = source[finalStatusId] || [];
      const previousIssue = targetList[finalIndex - 1];
      const nextIssue = targetList[finalIndex + 1];

      let nextRank = '';
      if (previousIssue?.rank && nextIssue?.rank) {
         nextRank = LexoRank.between(previousIssue.rank, nextIssue.rank).toString();
      } else if (previousIssue?.rank) {
         nextRank = LexoRank.between(previousIssue.rank, null).toString();
      } else if (nextIssue?.rank) {
         nextRank = LexoRank.between(null, nextIssue.rank).toString();
      } else {
         nextRank = new LexoRank('a3c').toString();
      }

      moveIssueInList(issueId, targetStatus, nextRank);
      endListDrag();
   };

   useEffect(() => {
      if (!activeIssueId) return;
      setPreviewByStatus(normalizeIssuesByStatus(baseGroupedIssues));
   }, [baseGroupedIssues, activeIssueId]);

   const columns = (
      <div className={cn(isViewTypeGrid && 'flex h-full gap-3 px-2 py-2 min-w-max')}>
         {status.map((statusItem) => (
            <GroupIssues
               key={statusItem.id}
               status={statusItem}
               issues={currentIssuesByStatus[statusItem.id] || []}
               count={countForStatus(statusItem.id)}
               listDnd={{
                  activeIssueId,
                  dropTarget,
                  onDragStart: startListDrag,
                  onDragEnd: endListDrag,
                  onMoveIssue: movePreviewIssue,
                  onDropIssue: commitListDrop,
               }}
            />
         ))}
      </div>
   );

   return (
      <DndProvider backend={HTML5Backend}>
         <CustomDragLayer />
         {isViewTypeGrid ? columns : <LayoutGroup id="list-board-insert">{columns}</LayoutGroup>}
      </DndProvider>
   );
};
