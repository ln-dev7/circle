'use client';

import { parseAsArrayOf, parseAsString, parseAsStringLiteral, useQueryStates } from 'nuqs';

export type ProjectsSort =
   | 'title-asc'
   | 'title-desc'
   | 'date-asc'
   | 'date-desc'
   | 'status-asc'
   | 'status-desc';

const SORTS: ProjectsSort[] = [
   'title-asc',
   'title-desc',
   'date-asc',
   'date-desc',
   'status-asc',
   'status-desc',
];

export interface ProjectsFilterState {
   filters: {
      health: string[]; // health ids
      priority: string[]; // priority ids
   };
   sort: ProjectsSort;

   setSort: (sort: ProjectsSort) => void;
   setFilter: (type: 'health' | 'priority', ids: string[]) => void;
   toggleFilter: (type: 'health' | 'priority', id: string) => void;
   clearFilters: () => void;
   clearFilterType: (type: 'health' | 'priority') => void;

   hasActiveFilters: () => boolean;
   getActiveFiltersCount: () => number;
}

const parsers = {
   health: parseAsArrayOf(parseAsString).withDefault([]),
   priority: parseAsArrayOf(parseAsString).withDefault([]),
   sort: parseAsStringLiteral(SORTS).withDefault('title-asc'),
};

/** Projects page filters + sorting, URL-synced via nuqs (?health=…&priority=…&sort=…). */
export function useProjectsFilterStore(): ProjectsFilterState {
   const [state, setState] = useQueryStates(parsers, { history: 'replace' });

   const filters = { health: state.health, priority: state.priority };

   return {
      filters,
      sort: state.sort,

      setSort: (sort) => setState({ sort: sort === 'title-asc' ? null : sort }),
      setFilter: (type, ids) => setState({ [type]: ids.length > 0 ? ids : null }),
      toggleFilter: (type, id) => {
         const current = filters[type];
         const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
         setState({ [type]: next.length > 0 ? next : null });
      },
      clearFilters: () => setState({ health: null, priority: null }),
      clearFilterType: (type) => setState({ [type]: null }),

      hasActiveFilters: () => Object.values(filters).some((arr) => arr.length > 0),
      getActiveFiltersCount: () => Object.values(filters).reduce((sum, arr) => sum + arr.length, 0),
   };
}
