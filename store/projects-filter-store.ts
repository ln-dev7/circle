import { create } from 'zustand';

export type ProjectsSort =
   | 'title-asc'
   | 'title-desc'
   | 'date-asc'
   | 'date-desc'
   | 'status-asc'
   | 'status-desc';

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

export const useProjectsFilterStore = create<ProjectsFilterState>((set, get) => ({
   filters: {
      health: [],
      priority: [],
   },
   sort: 'title-asc',

   setSort: (sort) => set({ sort }),

   setFilter: (type, ids) =>
      set((state) => ({
         filters: {
            ...state.filters,
            [type]: ids,
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
            health: [],
            priority: [],
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
