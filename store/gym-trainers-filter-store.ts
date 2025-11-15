import { create } from 'zustand';
import { TrainerStatus, TrainerSpecialty } from '@/mock-data/gym-trainers';

export type GymTrainersSortOption =
  | 'name-asc'
  | 'name-desc'
  | 'rating-asc'
  | 'rating-desc'
  | 'clients-asc'
  | 'clients-desc';

export interface GymTrainersFilterState {
  selectedStatuses: TrainerStatus[];
  selectedSpecialties: TrainerSpecialty[];
  sortBy: GymTrainersSortOption;
  searchQuery: string;
  setSelectedStatuses: (statuses: TrainerStatus[]) => void;
  setSelectedSpecialties: (specialties: TrainerSpecialty[]) => void;
  setSortBy: (sortBy: GymTrainersSortOption) => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
}

const defaultState = {
  selectedStatuses: [] as TrainerStatus[],
  selectedSpecialties: [] as TrainerSpecialty[],
  sortBy: 'name-asc' as GymTrainersSortOption,
  searchQuery: '',
};

export const useGymTrainersFilterStore = create<GymTrainersFilterState>((set) => ({
  ...defaultState,
  setSelectedStatuses: (statuses) => set({ selectedStatuses: statuses }),
  setSelectedSpecialties: (specialties) => set({ selectedSpecialties: specialties }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  resetFilters: () => set(defaultState),
}));
