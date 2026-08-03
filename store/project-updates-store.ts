import { create } from 'zustand';
import { ProjectUpdate, ProjectUpdateHealth } from '@/mock-data/project-details';
import { users } from '@/mock-data/users';

interface ProjectUpdatesState {
   /** Updates posted at runtime, newest first, keyed by project id. */
   postedUpdates: Record<string, ProjectUpdate[]>;
   postUpdate: (projectId: string, health: ProjectUpdateHealth, text: string) => void;
}

let nextId = 1;

/**
 * Runtime project updates (the "Post update" composer). Merged with the
 * mock updates from project-details.ts when rendering the Activity tab.
 */
export const useProjectUpdatesStore = create<ProjectUpdatesState>((set) => ({
   postedUpdates: {},
   postUpdate: (projectId, health, text) =>
      set((state) => {
         const update: ProjectUpdate = {
            id: `posted-${nextId++}`,
            author: users[0],
            date: new Date().toISOString().slice(0, 10),
            health,
            blocks: text
               .split(/\n{2,}/)
               .filter((paragraph) => paragraph.trim() !== '')
               .map((paragraph) => ({ type: 'paragraph', text: paragraph.trim() })),
         };
         return {
            postedUpdates: {
               ...state.postedUpdates,
               [projectId]: [update, ...(state.postedUpdates[projectId] ?? [])],
            },
         };
      }),
}));
