'use client';

import type { FilterModel, FiltersState } from '@/components/data-table-filter/core/types';
import { createParser, useQueryState } from 'nuqs';
import { useCallback } from 'react';

/**
 * Issue filters, synced to the URL via nuqs under a single `?filters=` param.
 *
 * The state shape is bazza/ui's `FiltersState` (an array of
 * `{ columnId, type, operator, values }`) so it plugs directly into the
 * Linear-style <DataTableFilter /> component while staying shareable
 * through the URL.
 */

const isFilterModel = (value: unknown): value is FilterModel => {
   if (typeof value !== 'object' || value === null) return false;
   const candidate = value as Record<string, unknown>;
   return (
      typeof candidate.columnId === 'string' &&
      typeof candidate.type === 'string' &&
      typeof candidate.operator === 'string' &&
      Array.isArray(candidate.values)
   );
};

const filtersParser = createParser<FiltersState>({
   parse: (value) => {
      try {
         const parsed: unknown = JSON.parse(value);
         if (!Array.isArray(parsed)) return null;
         return parsed.filter(isFilterModel);
      } catch {
         return null;
      }
   },
   serialize: (value) => JSON.stringify(value),
   eq: (a, b) => JSON.stringify(a) === JSON.stringify(b),
}).withDefault([]);

export interface FilterState {
   /** Active filters (bazza/ui FiltersState). */
   filters: FiltersState;
   /** Controlled setter, compatible with useDataTableFilters' onFiltersChange. */
   setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;

   clearFilters: () => void;
   hasActiveFilters: () => boolean;
   getActiveFiltersCount: () => number;
}

export function useFilterStore(): FilterState {
   const [filters, setFiltersState] = useQueryState('filters', filtersParser);

   const setFilters: React.Dispatch<React.SetStateAction<FiltersState>> = useCallback(
      (action) => {
         void setFiltersState((previous) => {
            const next = typeof action === 'function' ? action(previous) : action;
            return next.length > 0 ? next : null;
         });
      },
      [setFiltersState]
   );

   const clearFilters = useCallback(() => {
      void setFiltersState(null);
   }, [setFiltersState]);

   return {
      filters,
      setFilters,
      clearFilters,
      hasActiveFilters: () => filters.length > 0,
      getActiveFiltersCount: () => filters.length,
   };
}
