import { create } from 'zustand';

export type MembersSort =
   | 'name-asc'
   | 'name-desc'
   | 'joined-asc' // oldest first
   | 'joined-desc' // newest first
   | 'teams-asc'
   | 'teams-desc';

export interface MembersFilterState {
   filters: {
      role: ('Guest' | 'Member' | 'Admin')[];
   };
   sort: MembersSort;

   setSort: (sort: MembersSort) => void;
   setFilter: (type: 'role', ids: string[]) => void;
   toggleFilter: (type: 'role', id: 'Guest' | 'Member' | 'Admin') => void;
   clearFilters: () => void;
   clearFilterType: (type: 'role') => void;

   hasActiveFilters: () => boolean;
   getActiveFiltersCount: () => number;
}

export const useMembersFilterStore = create<MembersFilterState>((set, get) => ({
   filters: {
      role: [],
   },
   sort: 'name-asc',

   setSort: (sort) => set({ sort }),

   setFilter: (type, ids) =>
      set((state) => ({
         filters: {
            ...state.filters,
            [type]: ids as ('Guest' | 'Member' | 'Admin')[],
         },
      })),

   toggleFilter: (type, id) =>
      set((state) => {
         const current = state.filters[type];
         const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
         return {
            filters: {
               ...state.filters,
               [type]: next,
            },
         };
      }),

   clearFilters: () =>
      set({
         filters: {
            role: [],
         },
      }),

   clearFilterType: (type) =>
      set((state) => ({
         filters: {
            ...state.filters,
            [type]: [],
         },
      })),

   hasActiveFilters: () => {
      const { filters } = get();
      return Object.values(filters).some((arr) => arr.length > 0);
   },
   getActiveFiltersCount: () => {
      const { filters } = get();
      return Object.values(filters).reduce((sum, arr) => sum + arr.length, 0);
   },
}));
