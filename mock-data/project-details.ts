import { ContentBlock } from './issue-details';
import { User, users } from './users';

/* -------------------------------------------------------------------------- */
/*                                 Interfaces                                 */
/* -------------------------------------------------------------------------- */

export interface ProjectMilestone {
   id: string;
   name: string;
   targetDate?: string;
   completed: boolean;
}

export type ProjectUpdateHealth = 'on-track' | 'at-risk' | 'off-track';

export const projectUpdateHealthLabel: Record<ProjectUpdateHealth, string> = {
   'on-track': 'On track',
   'at-risk': 'At risk',
   'off-track': 'Off track',
};

export const projectUpdateHealthColor: Record<ProjectUpdateHealth, string> = {
   'on-track': '#4cb782',
   'at-risk': '#f2c94c',
   'off-track': '#eb5757',
};

/** A posted project update (the "Activity" tab timeline). */
export interface ProjectUpdate {
   id: string;
   author: User;
   date: string; // ISO date
   health: ProjectUpdateHealth;
   blocks: ContentBlock[];
}

/** Lightweight activity event ("x added themselves as a member…"). */
export interface ProjectActivityEvent {
   id: string;
   user: User;
   date: string;
   text: string;
}

export interface ProjectResource {
   label: string;
   url: string;
}

export interface ProjectDetail {
   projectId: string;
   /** One-line summary shown under the project name. */
   summary: string;
   description: ContentBlock[];
   resources: ProjectResource[];
   milestones: ProjectMilestone[];
   updates: ProjectUpdate[];
   activity: ProjectActivityEvent[];
}

/* -------------------------------------------------------------------------- */
/*                            Handcrafted details                             */
/* -------------------------------------------------------------------------- */

const detailsById: Record<string, Omit<ProjectDetail, 'projectId'>> = {
   // LNDev UI - Core Components
   '1': {
      summary:
         'Rebuild the core primitives (Button, Input, Dialog, Menu) on a shared behavior layer. Goal: one accessibility contract, fewer bundle bytes, no visual regressions.',
      description: [
         { type: 'heading', text: '1. Problem alignment' },
         { type: 'heading', text: '🔍 Problem & insights', level: 2 },
         {
            type: 'paragraph',
            text: 'Each core primitive currently ships its own focus, dismiss and positioning logic. The duplication costs ~9kb gzipped, and subtle behavior differences (Escape handling, focus return) confuse users who mix components.',
         },
         {
            type: 'paragraph',
            text: 'A shared behavior layer lets us fix accessibility once and guarantees that every overlay component dismisses, traps and restores focus the same way.',
         },
         { type: 'heading', text: '👥 Target audience', level: 2 },
         {
            type: 'paragraph',
            text: 'Product teams building data-dense internal tools, in **desktop-first** environments. The migration must be codemod-friendly for the ~40 apps already on v2.',
         },
         { type: 'divider' },
         { type: 'heading', text: '2. Solution' },
         {
            type: 'bullet-list',
            items: [
               'Extract `useDismissable`, `useFocusScope` and `useAnchorPosition` into `@lndev-ui/behaviors`.',
               'Rewrite Dialog, Menu, Popover and Tooltip on top of the shared hooks.',
               'Ship codemods and a visual-regression suite before flipping the default export.',
            ],
         },
         {
            type: 'quote',
            text: 'Success = zero visual diffs on the 40 reference apps, and a single a11y audit that covers every overlay.',
         },
      ],
      resources: [{ label: 'PRD — Core primitives rewrite', url: '#' }],
      milestones: [
         { id: 'm1', name: 'Behavior layer extracted', targetDate: '2026-08-14', completed: true },
         { id: 'm2', name: 'Dialog + Menu migrated', targetDate: '2026-09-04', completed: false },
         { id: 'm3', name: 'Codemod + release', targetDate: '2026-09-25', completed: false },
      ],
      updates: [
         {
            id: 'u1',
            author: users[2],
            date: '2026-07-28',
            health: 'on-track',
            blocks: [
               {
                  type: 'paragraph',
                  text: 'Behavior layer is merged. Dialog is running on `useFocusScope` behind a flag — no regressions on the playground suite (212 scenarios).',
               },
               {
                  type: 'checklist',
                  items: [
                     { text: 'useDismissable extracted and covered by tests', checked: true },
                     { text: 'Dialog migrated behind `next` flag', checked: true },
                     { text: 'Menu migration', checked: false },
                  ],
               },
            ],
         },
         {
            id: 'u2',
            author: users[0],
            date: '2026-07-14',
            health: 'on-track',
            blocks: [
               {
                  type: 'paragraph',
                  text: 'Kickoff done. Scope locked to the four overlay primitives; Tabs and Accordion move to the Q4 initiative.',
               },
            ],
         },
      ],
      activity: [
         { id: 'a1', user: users[4], date: '2026-07-24', text: 'commented “Tested on the staging playground — focus return works across nested portals.”' },
         { id: 'a2', user: users[7], date: '2026-07-17', text: 'added themselves as a member' },
         { id: 'a3', user: users[0], date: '2026-07-10', text: 'changed the target date to Sep 25' },
      ],
   },

   // LNDev UI - Theming
   '2': {
      summary:
         'Token pipeline v2: OKLCH palettes, semantic aliases and per-brand theme packages generated from a single source of truth.',
      description: [
         { type: 'heading', text: '1. Problem alignment' },
         { type: 'heading', text: '🔍 Problem & insights', level: 2 },
         {
            type: 'paragraph',
            text: 'Brands override raw hex values today, so every palette tweak fans out into hand-edited files. Contrast bugs slip through because nothing validates the derived pairs.',
         },
         { type: 'heading', text: '🎯 Goals', level: 2 },
         {
            type: 'numbered-list',
            items: [
               'One `tokens.json` source of truth, OKLCH end to end.',
               'Semantic alias layer (`surface`, `accent`, `danger`…) between core and components.',
               'CI check that every generated pair passes APCA Lc 60.',
            ],
         },
         { type: 'divider' },
         { type: 'heading', text: '2. Rollout' },
         {
            type: 'bullet-list',
            items: [
               'Week 1–2: generator + validator.',
               'Week 3: migrate the default theme, ship codemods for custom themes.',
               'Week 4: brand pilots (two design partners), then GA.',
            ],
         },
      ],
      resources: [
         { label: 'Spec — Token pipeline v2', url: '#' },
         { label: 'APCA validation sheet', url: '#' },
      ],
      milestones: [
         { id: 'm1', name: 'Generator + validator', targetDate: '2026-08-21', completed: true },
         { id: 'm2', name: 'Default theme migrated', targetDate: '2026-09-11', completed: false },
      ],
      updates: [
         {
            id: 'u1',
            author: users[0],
            date: '2026-07-30',
            health: 'at-risk',
            blocks: [
               {
                  type: 'paragraph',
                  text: 'Validator is done but the OKLCH fallback story for older Safari is bigger than planned — we may need a build-time sRGB snapshot per theme. Two days of spike scheduled.',
               },
            ],
         },
      ],
      activity: [
         { id: 'a1', user: users[3], date: '2026-07-26', text: 'attached “APCA validation sheet”' },
         { id: 'a2', user: users[0], date: '2026-07-19', text: 'set the health to At risk' },
      ],
   },

   // LNDev UI - Data Tables
   '10': {
      summary:
         'Data grid GA: virtualization to 100k rows, column pinning, row grouping and a headless sorting/filtering core shared with the docs examples.',
      description: [
         { type: 'heading', text: '1. Problem alignment' },
         {
            type: 'paragraph',
            text: 'The current Table component tops out around 2k rows and every team re-implements pinning and grouping on top. The grid is the most requested component of the last three quarterly surveys.',
         },
         { type: 'heading', text: '👥 Target audience', level: 2 },
         {
            type: 'paragraph',
            text: 'Ops and analytics teams. P95 dataset observed in telemetry: 38k rows, 24 columns.',
         },
         { type: 'divider' },
         { type: 'heading', text: '2. Non-goals' },
         {
            type: 'bullet-list',
            items: [
               'Spreadsheet-style editing (tracked separately).',
               'Server-driven row models — the core stays client-first for GA.',
            ],
         },
      ],
      resources: [{ label: 'PRD — Data grid GA', url: '#' }],
      milestones: [
         { id: 'm1', name: 'Virtualized body', targetDate: '2026-08-28', completed: true },
         { id: 'm2', name: 'Column pinning', targetDate: '2026-09-18', completed: false },
         { id: 'm3', name: 'Row grouping + GA', targetDate: '2026-10-09', completed: false },
      ],
      updates: [
         {
            id: 'u1',
            author: users[4],
            date: '2026-07-27',
            health: 'on-track',
            blocks: [
               {
                  type: 'paragraph',
                  text: '100k-row benchmark holds 60fps on an M1 Air with overscan 8. Pinning shadow separators are in review.',
               },
               {
                  type: 'code',
                  language: 'text',
                  code: 'scroll p50: 4.1ms · p95: 11.8ms · dropped frames: 0.4%',
               },
            ],
         },
      ],
      activity: [
         { id: 'a1', user: users[10], date: '2026-07-22', text: 'commented “Grouping API looks great with aggregate footers.”' },
         { id: 'a2', user: users[4], date: '2026-07-15', text: 'created the milestone “Row grouping + GA”' },
      ],
   },
};

/* -------------------------------------------------------------------------- */
/*                        Deterministic fallback details                      */
/* -------------------------------------------------------------------------- */

const hashString = (value: string): number => {
   let hash = 0;
   for (let i = 0; i < value.length; i++) {
      hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
   }
   return hash;
};

const SUMMARIES = [
   'Bring the surface up to the design-system quality bar: accessibility pass, density options and dark-mode contrast review.',
   'Close the top requests from the quarterly survey and pay down the issues backlog before the next marketing push.',
   'Stabilize the API, document the recipes and ship the migration codemod for teams still on v2.',
];

const FALLBACK_BLOCKS: ContentBlock[][] = [
   [
      { type: 'heading', text: 'Why now' },
      {
         type: 'paragraph',
         text: 'Usage of this surface doubled over the last two quarters while its issue backlog kept growing. This project consolidates the fixes, closes the accessibility gaps and documents the supported patterns.',
      },
      { type: 'heading', text: 'Scope' },
      {
         type: 'bullet-list',
         items: [
            'Fix the top reported bugs (see the Issues tab).',
            'Audit keyboard and screen-reader flows.',
            'Refresh the docs examples and add two real-world recipes.',
         ],
      },
   ],
   [
      { type: 'heading', text: 'Problem' },
      {
         type: 'paragraph',
         text: 'Teams keep rebuilding this locally because the shipped version misses a few key options. The fork count is the signal: five internal copies, all slightly wrong.',
      },
      { type: 'heading', text: 'Approach' },
      {
         type: 'numbered-list',
         items: [
            'Interview the three heaviest consumers.',
            'Land the missing options behind a minor release.',
            'Delete the forks — track adoption in telemetry.',
         ],
      },
   ],
];

const fallbackDetail = (projectId: string): Omit<ProjectDetail, 'projectId'> => {
   const hash = hashString(projectId);
   return {
      summary: SUMMARIES[hash % SUMMARIES.length],
      description: FALLBACK_BLOCKS[hash % FALLBACK_BLOCKS.length],
      resources: [],
      milestones: [],
      updates: [],
      activity: [
         {
            id: 'a1',
            user: users[hash % users.length],
            date: '2026-07-21',
            text: 'added themselves as a member',
         },
      ],
   };
};

export function getProjectDetail(projectId: string): ProjectDetail {
   const detail = detailsById[projectId] ?? fallbackDetail(projectId);
   return { projectId, ...detail };
}
