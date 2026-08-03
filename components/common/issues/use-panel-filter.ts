'use client';

import type { FiltersState } from '@/components/data-table-filter/core/types';
import { useFilterStore } from '@/store/filter-store';
import { useCallback, useState } from 'react';

/** A single clickable value inside a right-side panel. */
export interface PanelFilterTarget {
   columnId: 'status' | 'assignee' | 'priority' | 'labels' | 'project' | 'cycle';
   value: string;
}

const matchesTarget = (filters: FiltersState, target: PanelFilterTarget) =>
   filters.some(
      (filter) =>
         filter.columnId === target.columnId &&
         filter.values.length === 1 &&
         filter.values[0] === target.value
   );

/**
 * Exclusive click-to-filter used by the right-side panels (insights,
 * cycle details): clicking a row applies a single filter for that value,
 * clicking another row replaces it, and clicking the active row again
 * removes it. Panel-applied filters never stack with each other, but they
 * land in the regular filter bar so they stay visible and shareable.
 */
export function usePanelFilter() {
   const { filters, setFilters } = useFilterStore();
   const [current, setCurrent] = useState<PanelFilterTarget | null>(null);

   const isActive = useCallback(
      (target: PanelFilterTarget) =>
         current?.columnId === target.columnId &&
         current.value === target.value &&
         matchesTarget(filters, target),
      [current, filters]
   );

   const toggle = useCallback(
      (target: PanelFilterTarget) => {
         const isSame = current?.columnId === target.columnId && current.value === target.value;

         setFilters((previous) => {
            // Drop the filter this panel previously applied (if still there).
            let next = current
               ? previous.filter(
                    (filter) =>
                       !(
                          filter.columnId === current.columnId &&
                          filter.values.length === 1 &&
                          filter.values[0] === current.value
                       )
                 )
               : [...previous];

            if (!isSame) {
               next = [
                  ...next,
                  {
                     columnId: target.columnId,
                     type: target.columnId === 'labels' ? 'multiOption' : 'option',
                     operator: target.columnId === 'labels' ? 'include' : 'is',
                     values: [target.value],
                  },
               ];
            }
            return next;
         });

         setCurrent(isSame ? null : target);
      },
      [current, setFilters]
   );

   return { isActive, toggle };
}
