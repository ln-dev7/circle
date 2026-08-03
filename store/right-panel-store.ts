import { create } from 'zustand';

/**
 * Right side panel shown on issues / cycle / project pages.
 * - 'insights': analytics panel (issue count by status, segmented by priority)
 * - 'cycle-details': current cycle summary (progress chart + breakdowns)
 * - 'hidden': used by pages whose default panel is visible (project pages)
 *   to collapse the side panel entirely
 */
export type RightPanelType = 'insights' | 'cycle-details' | 'hidden';

interface RightPanelState {
   openPanel: RightPanelType | null;

   togglePanel: (panel: RightPanelType) => void;
   openPanelOfType: (panel: RightPanelType) => void;
   closePanel: () => void;
}

export const useRightPanelStore = create<RightPanelState>((set) => ({
   openPanel: null,

   togglePanel: (panel) =>
      set((state) => ({ openPanel: state.openPanel === panel ? null : panel })),
   openPanelOfType: (panel) => set({ openPanel: panel }),
   closePanel: () => set({ openPanel: null }),
}));
