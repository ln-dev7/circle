import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type InitiativesGrouping = 'none' | 'status';
export type InitiativesOrdering = 'manual' | 'name' | 'target';

export interface InitiativesDisplayProperties {
   description: boolean;
   status: boolean;
   priority: boolean;
   owner: boolean;
   leadTeam: boolean;
   target: boolean;
   projects: boolean;
   health: boolean;
   activeProjects: boolean;
}

interface InitiativesDisplayState {
   grouping: InitiativesGrouping;
   ordering: InitiativesOrdering;
   displayProperties: InitiativesDisplayProperties;
   setGrouping: (grouping: InitiativesGrouping) => void;
   setOrdering: (ordering: InitiativesOrdering) => void;
   toggleProperty: (property: keyof InitiativesDisplayProperties) => void;
}

/** Display options of the Initiatives page (grouping, ordering, columns). */
export const useInitiativesDisplayStore = create<InitiativesDisplayState>()(
   persist(
      (set) => ({
         grouping: 'none',
         ordering: 'manual',
         displayProperties: {
            description: true,
            status: true,
            priority: true,
            owner: true,
            leadTeam: true,
            target: true,
            projects: true,
            health: true,
            activeProjects: true,
         },
         setGrouping: (grouping) => set({ grouping }),
         setOrdering: (ordering) => set({ ordering }),
         toggleProperty: (property) =>
            set((state) => ({
               displayProperties: {
                  ...state.displayProperties,
                  [property]: !state.displayProperties[property],
               },
            })),
      }),
      // v2: the leadTeam column joined the set (old persisted shapes lack it).
      { name: 'initiatives-display-v2' }
   )
);
