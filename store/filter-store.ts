'use client';

import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs';

/**
 * Issue filters, synced to the URL via nuqs (?status=…&assignee=…).
 * The hook keeps the exact same API as the previous Zustand store so
 * consumers (Filter dropdown, issue views) don't need to change.
 */
export type IssueFilterKey =
   | 'status'
   | 'assignee'
   | 'priority'
   | 'labels'
   | 'project'
   | 'cycle'
   | 'statusType';

export interface FilterState {
   filters: Record<IssueFilterKey, string[]>;

   setFilter: (type: IssueFilterKey, ids: string[]) => void;
   toggleFilter: (type: IssueFilterKey, id: string) => void;
   clearFilters: () => void;
   clearFilterType: (type: IssueFilterKey) => void;

   hasActiveFilters: () => boolean;
   getActiveFiltersCount: () => number;
}

const arrayParser = parseAsArrayOf(parseAsString).withDefault([]);

const filterParsers = {
   status: arrayParser,
   assignee: arrayParser,
   priority: arrayParser,
   labels: arrayParser,
   project: arrayParser,
   cycle: arrayParser,
   statusType: arrayParser,
};

export function useFilterStore(): FilterState {
   const [filters, setFilters] = useQueryStates(filterParsers, { history: 'replace' });

   const setFilter = (type: IssueFilterKey, ids: string[]) => {
      setFilters({ [type]: ids.length > 0 ? ids : null });
   };

   const toggleFilter = (type: IssueFilterKey, id: string) => {
      const current = filters[type];
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      setFilters({ [type]: next.length > 0 ? next : null });
   };

   const clearFilters = () => {
      setFilters({
         status: null,
         assignee: null,
         priority: null,
         labels: null,
         project: null,
         cycle: null,
         statusType: null,
      });
   };

   const clearFilterType = (type: IssueFilterKey) => {
      setFilters({ [type]: null });
   };

   const hasActiveFilters = () =>
      Object.values(filters).some((filterArray) => filterArray.length > 0);

   const getActiveFiltersCount = () =>
      Object.values(filters).reduce((acc, curr) => acc + curr.length, 0);

   return {
      filters,
      setFilter,
      toggleFilter,
      clearFilters,
      clearFilterType,
      hasActiveFilters,
      getActiveFiltersCount,
   };
}
