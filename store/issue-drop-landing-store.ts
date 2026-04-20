import type { Issue } from '@/mock-data/issues';
import { create } from 'zustand';

export interface IssueDropLanding {
   issueId: string;
   issue: Issue;
   x: number;
   y: number;
   previewVariant: 'list' | 'grid';
}

interface IssueDropLandingState {
   landing: IssueDropLanding | null;
   /** Last CustomDragLayer position (matches on-screen preview). */
   dragPreviewOffset: { x: number; y: number } | null;
   setDragPreviewOffset: (offset: { x: number; y: number } | null) => void;
   beginLanding: (landing: IssueDropLanding) => void;
   clearLanding: () => void;
}

export const useIssueDropLandingStore = create<IssueDropLandingState>((set) => ({
   landing: null,
   dragPreviewOffset: null,
   setDragPreviewOffset: (dragPreviewOffset) => set({ dragPreviewOffset }),
   beginLanding: (landing) => set({ landing }),
   clearLanding: () => set({ landing: null, dragPreviewOffset: null }),
}));
