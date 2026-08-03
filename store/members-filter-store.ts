'use client';

import { parseAsArrayOf, parseAsString, parseAsStringLiteral, useQueryStates } from 'nuqs';

export type MembersSort =
   | 'name-asc'
   | 'name-desc'
   | 'joined-asc' // oldest first
   | 'joined-desc' // newest first
   | 'teams-asc'
   | 'teams-desc';

const SORTS: MembersSort[] = [
   'name-asc',
   'name-desc',
   'joined-asc',
   'joined-desc',
   'teams-asc',
   'teams-desc',
];

export interface MembersFilterState {
   filters: {
      role: ('Guest' | 'Member' | 'Admin' | 'Application')[];
   };
   sort: MembersSort;

   setSort: (sort: MembersSort) => void;
   setFilter: (type: 'role', ids: string[]) => void;
   toggleFilter: (type: 'role', id: 'Guest' | 'Member' | 'Admin' | 'Application') => void;
   clearFilters: () => void;
   clearFilterType: (type: 'role') => void;

   hasActiveFilters: () => boolean;
   getActiveFiltersCount: () => number;
}

const parsers = {
   role: parseAsArrayOf(parseAsString).withDefault([]),
   sort: parseAsStringLiteral(SORTS).withDefault('name-asc'),
};

/** Members page filters + sorting, URL-synced via nuqs (?role=…&sort=…). */
export function useMembersFilterStore(): MembersFilterState {
   const [state, setState] = useQueryStates(parsers, { history: 'replace' });

   const filters = { role: state.role as ('Guest' | 'Member' | 'Admin' | 'Application')[] };

   return {
      filters,
      sort: state.sort,

      setSort: (sort) => setState({ sort: sort === 'name-asc' ? null : sort }),
      setFilter: (_type, ids) => setState({ role: ids.length > 0 ? ids : null }),
      toggleFilter: (_type, id) => {
         const next = filters.role.includes(id)
            ? filters.role.filter((x) => x !== id)
            : [...filters.role, id];
         setState({ role: next.length > 0 ? next : null });
      },
      clearFilters: () => setState({ role: null }),
      clearFilterType: () => setState({ role: null }),

      hasActiveFilters: () => filters.role.length > 0,
      getActiveFiltersCount: () => filters.role.length,
   };
}
