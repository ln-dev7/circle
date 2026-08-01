'use client';

import { Team } from '@/mock-data/teams';
import { parseAsArrayOf, parseAsString, parseAsStringLiteral, useQueryStates } from 'nuqs';

export type TeamsSort =
   | 'name-asc'
   | 'name-desc'
   | 'members-asc' //number of members
   | 'members-desc'
   | 'projects-asc' //number of projects
   | 'projects-desc';

const SORTS: TeamsSort[] = [
   'name-asc',
   'name-desc',
   'members-asc',
   'members-desc',
   'projects-asc',
   'projects-desc',
];

export interface TeamsFilterState {
   filters: {
      membership: ('Joined' | 'Not-Joined')[];
      identifier: Team['id'][];
   };
   sort: TeamsSort;

   setSort: (sort: TeamsSort) => void;
   setFilter: (
      type: 'membership' | 'identifier',
      ids: 'Joined' | 'Not-Joined' | Team['id']
   ) => void;
   toggleFilter: (
      type: 'membership' | 'identifier',
      id: 'Joined' | 'Not-Joined' | Team['id']
   ) => void;
   clearFilters: () => void;
   clearFilterType: (type: 'membership' | 'identifier') => void;
   hasActiveFilters: () => boolean;
   getActiveFiltersCount: () => number;
}

const parsers = {
   membership: parseAsArrayOf(parseAsString).withDefault([]),
   identifier: parseAsArrayOf(parseAsString).withDefault([]),
   sort: parseAsStringLiteral(SORTS).withDefault('name-asc'),
};

/** Teams page filters + sorting, URL-synced via nuqs (?membership=…&identifier=…&sort=…). */
export function useTeamsFilterStore(): TeamsFilterState {
   const [state, setState] = useQueryStates(parsers, { history: 'replace' });

   const filters = {
      membership: state.membership as ('Joined' | 'Not-Joined')[],
      identifier: state.identifier,
   };

   return {
      filters,
      sort: state.sort,

      setSort: (sort) => setState({ sort: sort === 'name-asc' ? null : sort }),
      setFilter: (type, ids) => setState({ [type]: [ids] }),
      toggleFilter: (type, id) => {
         const current = filters[type] as string[];
         const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
         setState({ [type]: next.length > 0 ? next : null });
      },
      clearFilters: () => setState({ membership: null, identifier: null }),
      clearFilterType: (type) => setState({ [type]: null }),

      hasActiveFilters: () => Object.values(filters).some((arr) => arr.length > 0),
      getActiveFiltersCount: () => Object.values(filters).reduce((sum, arr) => sum + arr.length, 0),
   };
}
