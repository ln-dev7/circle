import { create } from 'zustand';
import { ClassDifficulty, ClassCategory } from '@/mock-data/gym-classes';

export type GymClassesSortOption =
  | 'name-asc'
  | 'name-desc'
  | 'capacity-asc'
  | 'capacity-desc'
  | 'enrolled-asc'
  | 'enrolled-desc';

export interface GymClassesFilterState {
  selectedCategories: ClassCategory[];
  selectedDifficulties: ClassDifficulty[];
  sortBy: GymClassesSortOption;
  searchQuery: string;
  setSelectedCategories: (categories: ClassCategory[]) => void;
  setSelectedDifficulties: (difficulties: ClassDifficulty[]) => void;
  setSortBy: (sortBy: GymClassesSortOption) => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
}

const defaultState = {
  selectedCategories: [] as ClassCategory[],
  selectedDifficulties: [] as ClassDifficulty[],
  sortBy: 'name-asc' as GymClassesSortOption,
  searchQuery: '',
};

export const useGymClassesFilterStore = create<GymClassesFilterState>((set) => ({
  ...defaultState,
  setSelectedCategories: (categories) => set({ selectedCategories: categories }),
  setSelectedDifficulties: (difficulties) => set({ selectedDifficulties: difficulties }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  resetFilters: () => set(defaultState),
}));
