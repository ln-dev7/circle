import { create } from 'zustand';
import { EquipmentCategory, EquipmentStatus, MaintenancePriority } from '@/mock-data/gym-equipment';

export type GymEquipmentSortOption =
  | 'name-asc'
  | 'name-desc'
  | 'purchase-asc'
  | 'purchase-desc'
  | 'maintenance-asc'
  | 'maintenance-desc';

export interface GymEquipmentFilterState {
  selectedCategories: EquipmentCategory[];
  selectedStatuses: EquipmentStatus[];
  selectedPriorities: MaintenancePriority[];
  sortBy: GymEquipmentSortOption;
  searchQuery: string;
  setSelectedCategories: (categories: EquipmentCategory[]) => void;
  setSelectedStatuses: (statuses: EquipmentStatus[]) => void;
  setSelectedPriorities: (priorities: MaintenancePriority[]) => void;
  setSortBy: (sortBy: GymEquipmentSortOption) => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
}

const defaultState = {
  selectedCategories: [] as EquipmentCategory[],
  selectedStatuses: [] as EquipmentStatus[],
  selectedPriorities: [] as MaintenancePriority[],
  sortBy: 'name-asc' as GymEquipmentSortOption,
  searchQuery: '',
};

export const useGymEquipmentFilterStore = create<GymEquipmentFilterState>((set) => ({
  ...defaultState,
  setSelectedCategories: (categories) => set({ selectedCategories: categories }),
  setSelectedStatuses: (statuses) => set({ selectedStatuses: statuses }),
  setSelectedPriorities: (priorities) => set({ selectedPriorities: priorities }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  resetFilters: () => set(defaultState),
}));
