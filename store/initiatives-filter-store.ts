'use client';

import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs';

export type InitiativesFilterType = 'status' | 'priority' | 'owner' | 'health';

const parsers = {
   status: parseAsArrayOf(parseAsString).withDefault([]),
   priority: parseAsArrayOf(parseAsString).withDefault([]),
   owner: parseAsArrayOf(parseAsString).withDefault([]),
   health: parseAsArrayOf(parseAsString).withDefault([]),
};

/** URL-backed filters of the Initiatives page (nuqs). */
export function useInitiativesFilterStore() {
   const [filters, setFilters] = useQueryStates(parsers, { history: 'replace' });

   const toggleFilter = (type: InitiativesFilterType, id: string) => {
      const current = filters[type];
      setFilters({
         [type]: current.includes(id)
            ? current.filter((entry) => entry !== id)
            : [...current, id],
      });
   };

   const clearFilters = () =>
      setFilters({ status: [], priority: [], owner: [], health: [] });

   const getActiveFiltersCount = () =>
      filters.status.length + filters.priority.length + filters.owner.length +
      filters.health.length;

   return { filters, toggleFilter, clearFilters, getActiveFiltersCount };
}
