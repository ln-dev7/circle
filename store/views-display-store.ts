import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ViewsOrdering = 'name' | 'created' | 'updated';

interface ViewsDisplayState {
   ordering: ViewsOrdering;
   /** Columns shown on the Views list. */
   displayProperties: {
      created: boolean;
      updated: boolean;
      owner: boolean;
   };
   setOrdering: (ordering: ViewsOrdering) => void;
   toggleProperty: (property: keyof ViewsDisplayState['displayProperties']) => void;
}

/** Display options of the Views page (ordering + visible columns). */
export const useViewsDisplayStore = create<ViewsDisplayState>()(
   persist(
      (set) => ({
         ordering: 'name',
         displayProperties: { created: false, updated: false, owner: true },
         setOrdering: (ordering) => set({ ordering }),
         toggleProperty: (property) =>
            set((state) => ({
               displayProperties: {
                  ...state.displayProperties,
                  [property]: !state.displayProperties[property],
               },
            })),
      }),
      { name: 'views-display' }
   )
);
