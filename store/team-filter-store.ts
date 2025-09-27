import { Team } from '@/mock-data/teams';
import { create } from 'zustand';

export type TeamsSort =
   | 'name-asc'
   | 'name-desc'
   | 'members-asc' //number of members
   | 'members-desc'
   | 'projects-asc' //number of projects
   | 'projects-desc';

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

export const useTeamsFilterStore = create<TeamsFilterState>((set, get) => ({
   filters: {
      membership: [],
      identifier: [],
   },
   sort: 'name-asc',

   setSort: (sort) => set({ sort }),
   setFilter: (type, ids) =>
      set((state) => ({
         filters: {
            ...state.filters,
            [type]: ids as 'Joined' | 'Not-Joined' | Team['id'],
         },
      })),

   toggleFilter: (type, id) => {
      set((state) => {
         if (type === 'membership') {
            const current = state.filters.membership;
            const typedId = id as 'Joined' | 'Not-Joined';
            const next = current.includes(typedId)
               ? current.filter((ele) => ele !== typedId)
               : [...current, typedId];

            return {
               filters: {
                  ...state.filters,
                  membership: next,
               },
            };
         } else {
            const current = state.filters.identifier;
            const typedId = id as Team['id'];
            const next = current.includes(id)
               ? current.filter((currentId) => currentId !== typedId)
               : [...current, typedId];

            return {
               filters: {
                  ...state.filters,
                  identifier: next,
               },
            };
         }
      });
   },
   clearFilters: () => set({ filters: { membership: [], identifier: [] } }),
   clearFilterType: (type) =>
      set((state) => {
         return {
            filters: {
               ...state.filters,
               [type]: [],
            },
         };
      }),
   hasActiveFilters: () => {
      const { filters } = get();
      return Object.values(filters).some((arr) => arr.length > 0);
   },
   getActiveFiltersCount: () => {
      const { filters } = get();
      return Object.values(filters).reduce((sum, arr) => sum + arr.length, 0);
   },
}));
