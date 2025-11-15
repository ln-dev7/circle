import { create } from 'zustand';
import { CheckInType } from '@/mock-data/gym-attendance';

export type GymAttendanceSortOption = 'date-asc' | 'date-desc' | 'member-asc' | 'member-desc';

export interface GymAttendanceFilterState {
  selectedTypes: CheckInType[];
  sortBy: GymAttendanceSortOption;
  searchQuery: string;
  setSelectedTypes: (types: CheckInType[]) => void;
  setSortBy: (sortBy: GymAttendanceSortOption) => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
}

const defaultState = {
  selectedTypes: [] as CheckInType[],
  sortBy: 'date-desc' as GymAttendanceSortOption,
  searchQuery: '',
};

export const useGymAttendanceFilterStore = create<GymAttendanceFilterState>((set) => ({
  ...defaultState,
  setSelectedTypes: (types) => set({ selectedTypes: types }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  resetFilters: () => set(defaultState),
}));
