'use client';

import { DataTableFilter } from '@/components/data-table-filter';
import { useDataTableFilters } from '@/components/data-table-filter/hooks/use-data-table-filters';
import { useFilterStore } from '@/store/filter-store';
import { useIssuesStore } from '@/store/issues-store';
import { issueFilterColumns } from './issue-filter-columns';

/**
 * Linear-style filter bar: a "Filter" button plus applied filter chips
 * (subject / operator / values / remove), powered by bazza/ui's
 * data-table-filter. Filter state lives in the URL (see filter-store).
 */
export function IssueFilterBar() {
   const { issues } = useIssuesStore();
   const { filters, setFilters } = useFilterStore();

   const { columns, actions, strategy } = useDataTableFilters({
      strategy: 'client',
      data: issues,
      columnsConfig: issueFilterColumns,
      filters,
      onFiltersChange: setFilters,
   });

   return (
      <div className="w-full px-6 py-2 border-b border-border/60 bg-container">
         <DataTableFilter
            columns={columns}
            filters={filters}
            actions={actions}
            strategy={strategy}
         />
      </div>
   );
}
