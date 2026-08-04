import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SidebarVisibility = 'always' | 'badged' | 'never';
export type SidebarBadgeStyle = 'count' | 'dot';

export type SidebarItemKey =
   | 'inbox'
   | 'reviews'
   | 'my-issues'
   | 'agent'
   | 'initiatives'
   | 'projects'
   | 'views'
   | 'teams'
   | 'members';

export type SidebarSection = 'personal' | 'workspace';

interface SidebarPrefsState {
   badgeStyle: SidebarBadgeStyle;
   visibility: Record<SidebarItemKey, SidebarVisibility>;
   /** Item order per section (drag & drop in the Customize sidebar modal). */
   order: Record<SidebarSection, SidebarItemKey[]>;
   setBadgeStyle: (style: SidebarBadgeStyle) => void;
   setVisibility: (item: SidebarItemKey, visibility: SidebarVisibility) => void;
   moveItem: (section: SidebarSection, from: number, to: number) => void;
}

const DEFAULT_VISIBILITY: Record<SidebarItemKey, SidebarVisibility> = {
   'inbox': 'always',
   'reviews': 'always',
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
const DEFAULT_ORDER: Record<SidebarSection, SidebarItemKey[]> = {
   personal: ['inbox', 'reviews', 'my-issues', 'agent'],
   workspace: ['initiatives', 'projects', 'views', 'teams', 'members'],
};

export const useSidebarPrefsStore = create<SidebarPrefsState>()(
   persist(
      (set) => ({
         badgeStyle: 'count',
         visibility: DEFAULT_VISIBILITY,
         order: DEFAULT_ORDER,
         setBadgeStyle: (badgeStyle) => set({ badgeStyle }),
         setVisibility: (item, value) =>
            set((state) => ({ visibility: { ...state.visibility, [item]: value } })),
         moveItem: (section, from, to) =>
            set((state) => {
               const keys = [...state.order[section]];
               if (from < 0 || from >= keys.length || to < 0 || to >= keys.length) return state;
               const [moved] = keys.splice(from, 1);
               keys.splice(to, 0, moved);
               return { order: { ...state.order, [section]: keys } };
            }),
      }),
      { name: 'sidebar-prefs' }
   )
);

/**
 * Stored order, resilient to new items: unknown keys are dropped, missing
 * defaults are appended at the end.
 */
export function resolveOrder(
   stored: SidebarItemKey[] | undefined,
   defaults: SidebarItemKey[]
): SidebarItemKey[] {
   const result = (stored ?? []).filter((key) => defaults.includes(key));
   // Insert items missing from the stored order (added after it was
   // persisted) right after their default predecessor, not at the end.
   defaults.forEach((key, index) => {
      if (result.includes(key)) return;
      let insertAt = 0;
      for (let i = index - 1; i >= 0; i--) {
         const position = result.indexOf(defaults[i]);
         if (position !== -1) {
            insertAt = position + 1;
            break;
         }
      }
      result.splice(insertAt, 0, key);
   });
   return result;
}

/**
 * Should an item be rendered, given its visibility pref and badge count?
 * A missing pref (item added after the prefs were persisted) counts as
 * "always" so new sidebar entries show up by default.
 */
export function isSidebarItemVisible(
   visibility: SidebarVisibility | undefined,
   badgeCount: number
): boolean {
   if (!visibility || visibility === 'always') return true;
   if (visibility === 'badged') return badgeCount > 0;
   return false;
}
