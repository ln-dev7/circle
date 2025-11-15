import { create } from 'zustand';
import { MembershipTier, MembershipStatus } from '@/mock-data/gym-members';

export type GymMembersSortOption =
  | 'name-asc'
  | 'name-desc'
  | 'joined-asc'
  | 'joined-desc'
  | 'expiry-asc'
  | 'expiry-desc';

export interface GymMembersFilterState {
  selectedTiers: MembershipTier[];
  selectedStatuses: MembershipStatus[];
  sortBy: GymMembersSortOption;
  searchQuery: string;
  setSelectedTiers: (tiers: MembershipTier[]) => void;
  setSelectedStatuses: (statuses: MembershipStatus[]) => void;
  setSortBy: (sortBy: GymMembersSortOption) => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
}

const defaultState = {
  selectedTiers: [] as MembershipTier[],
  selectedStatuses: [] as MembershipStatus[],
  sortBy: 'name-asc' as GymMembersSortOption,
  searchQuery: '',
};

export const useGymMembersFilterStore = create<GymMembersFilterState>((set) => ({
  ...defaultState,
  setSelectedTiers: (tiers) => set({ selectedTiers: tiers }),
  setSelectedStatuses: (statuses) => set({ selectedStatuses: statuses }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  resetFilters: () => set(defaultState),
}));
