import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/* Linear-style display settings for the Teams page. */

export type TeamsOrdering = 'name' | 'members' | 'projects';

export type TeamDisplayPropertyKey =
   | 'membership'
   | 'owners'
   | 'projects'
   | 'cycle'
   | 'created'
   | 'updated'
   | 'members';

export const TEAM_DISPLAY_PROPERTIES: { key: TeamDisplayPropertyKey; label: string }[] = [
   { key: 'membership', label: 'Membership' },
   { key: 'owners', label: 'Owners' },
   { key: 'projects', label: 'Projects' },
   { key: 'cycle', label: 'Cycle' },
   { key: 'created', label: 'Created' },
   { key: 'updated', label: 'Updated' },
   { key: 'members', label: 'Members' },
];

const DEFAULT_PROPERTIES: Record<TeamDisplayPropertyKey, boolean> = {
   membership: true,
   owners: false,
   projects: true,
   cycle: true,
   created: false,
   updated: false,
   members: true,
};

interface TeamsDisplayState {
   ordering: TeamsOrdering;
   displayProperties: Record<TeamDisplayPropertyKey, boolean>;

   setOrdering: (ordering: TeamsOrdering) => void;
   toggleDisplayProperty: (key: TeamDisplayPropertyKey) => void;
   resetDisplaySettings: () => void;
}

const DEFAULTS = {
   ordering: 'name' as TeamsOrdering,
   displayProperties: DEFAULT_PROPERTIES,
};

export const useTeamsDisplayStore = create<TeamsDisplayState>()(
   persist(
      (set) => ({
         ...DEFAULTS,

         setOrdering: (ordering) => set({ ordering }),
         toggleDisplayProperty: (key) =>
            set((state) => ({
               displayProperties: {
                  ...state.displayProperties,
                  [key]: !state.displayProperties[key],
               },
            })),
         resetDisplaySettings: () => set({ ...DEFAULTS }),
      }),
      {
         name: 'teams-display-settings',
         storage: createJSONStorage(() => localStorage),
      }
   )
);
