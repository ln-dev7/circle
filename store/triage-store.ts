import { Issue } from '@/mock-data/issues';
import { priorities } from '@/mock-data/priorities';
import { status } from '@/mock-data/status';
import { TriageItem, triageItems } from '@/mock-data/triage';
import { create } from 'zustand';
import { useIssuesStore } from './issues-store';

/**
 * The intake queue. Accept promotes the item into a real Todo issue (it lands
 * in the issues store), Decline and Snooze just clear it from the queue —
 * everything in memory, like every other store here.
 */
interface TriageState {
   items: TriageItem[];
   selectedId: string | null;

   select: (id: string | null) => void;
   itemsForTeam: (teamId: string) => TriageItem[];
   pendingCount: (teamId: string) => number;
   accept: (id: string) => void;
   decline: (id: string) => void;
   snooze: (id: string) => void;
}

/** Next item to select once `id` leaves the team's queue. */
const nextSelection = (items: TriageItem[], id: string): string | null => {
   const scoped = items.filter((item) => item.id !== id);
   const gone = items.find((item) => item.id === id);
   if (!gone) return null;
   const sibling = scoped.find((item) => item.teamId === gone.teamId);
   return sibling?.id ?? null;
};

const toIssue = (item: TriageItem): Issue => ({
   id: `issue-${item.id}`,
   identifier: item.identifier,
   title: item.title,
   description: item.sections.map((section) => section.body).join('\n\n'),
   status: status.find((s) => s.id === 'to-do') ?? status[0],
   assignee: item.intelligence.suggestedAssignee ?? null,
   priority: priorities[0],
   labels: item.intelligence.suggestedLabels,
   createdAt: new Date().toISOString().slice(0, 10),
   cycleId: '',
   project: item.intelligence.suggestedProject,
   rank: '',
});

export const useTriageStore = create<TriageState>((set, get) => ({
   items: triageItems,
   selectedId: null,

   select: (id) => set({ selectedId: id }),

   itemsForTeam: (teamId) => get().items.filter((item) => item.teamId === teamId),

   pendingCount: (teamId) => get().items.filter((item) => item.teamId === teamId).length,

   accept: (id) => {
      const item = get().items.find((entry) => entry.id === id);
      if (!item) return;
      useIssuesStore.getState().addIssue(toIssue(item));
      set((state) => ({
         items: state.items.filter((entry) => entry.id !== id),
         selectedId: nextSelection(state.items, id),
      }));
   },

   decline: (id) =>
      set((state) => ({
         items: state.items.filter((entry) => entry.id !== id),
         selectedId: nextSelection(state.items, id),
      })),

   snooze: (id) =>
      set((state) => ({
         items: state.items.filter((entry) => entry.id !== id),
         selectedId: nextSelection(state.items, id),
      })),
}));
