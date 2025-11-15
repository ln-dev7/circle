import { create } from 'zustand';
import { BookingStatus } from '@/mock-data/gym-bookings';

export type GymBookingsSortOption = 'date-asc' | 'date-desc' | 'member-asc' | 'member-desc';

export interface GymBookingsFilterState {
  selectedStatuses: BookingStatus[];
  sortBy: GymBookingsSortOption;
  searchQuery: string;
  setSelectedStatuses: (statuses: BookingStatus[]) => void;
  setSortBy: (sortBy: GymBookingsSortOption) => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
}

const defaultState = {
  selectedStatuses: [] as BookingStatus[],
  sortBy: 'date-desc' as GymBookingsSortOption,
  searchQuery: '',
};

export const useGymBookingsFilterStore = create<GymBookingsFilterState>((set) => ({
  ...defaultState,
  setSelectedStatuses: (statuses) => set({ selectedStatuses: statuses }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  resetFilters: () => set(defaultState),
}));
