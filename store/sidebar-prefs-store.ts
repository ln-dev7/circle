import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SidebarVisibility = 'always' | 'badged' | 'never';
export type SidebarBadgeStyle = 'count' | 'dot';

export type SidebarItemKey =
   | 'inbox'
   | 'my-issues'
   | 'agent'
   | 'initiatives'
   | 'projects'
   | 'views'
   | 'teams'
   | 'members';

interface SidebarPrefsState {
   badgeStyle: SidebarBadgeStyle;
   visibility: Record<SidebarItemKey, SidebarVisibility>;
   setBadgeStyle: (style: SidebarBadgeStyle) => void;
   setVisibility: (item: SidebarItemKey, visibility: SidebarVisibility) => void;
}

const DEFAULT_VISIBILITY: Record<SidebarItemKey, SidebarVisibility> = {
   'inbox': 'always',
   'my-issues': 'always',
   'agent': 'always',
   'initiatives': 'always',
   'projects': 'always',
   'views': 'always',
   'teams': 'always',
   'members': 'always',
};

/**
 * "Customize sidebar" preferences: default badge style and per-item
 * visibility (always / show when badged / don't show). Persisted so the
 * sidebar keeps its shape across sessions.
 */
export const useSidebarPrefsStore = create<SidebarPrefsState>()(
   persist(
      (set) => ({
         badgeStyle: 'count',
         visibility: DEFAULT_VISIBILITY,
         setBadgeStyle: (badgeStyle) => set({ badgeStyle }),
         setVisibility: (item, value) =>
            set((state) => ({ visibility: { ...state.visibility, [item]: value } })),
      }),
      { name: 'sidebar-prefs' }
   )
);

/** Should an item be rendered, given its visibility pref and badge count? */
export function isSidebarItemVisible(
   visibility: SidebarVisibility,
   badgeCount: number
): boolean {
   if (visibility === 'always') return true;
   if (visibility === 'badged') return badgeCount > 0;
   return false;
}
