import { LexoRank } from '@/lib/utils';
import { LabelInterface, labels } from './labels';
import { Priority, priorities } from './priorities';
import { Project, projects } from './projects';
import { Status, status, StatusCategory } from './status';
import { User, users } from './users';

export interface Issue {
   id: string;
   identifier: string;
   title: string;
   description: string;
   status: Status;
   assignee: User | null;
   priority: Priority;
   labels: LabelInterface[];
   createdAt: string;
   /** Cycle the issue belongs to. Empty string = no cycle (backlog stock). */
   cycleId: string;
   project?: Project;
   subissues?: string[];
   rank: string;
   dueDate?: string;
}

/* -------------------------------------------------------------------------- */
/*                             Seed-based generation                          */
/* -------------------------------------------------------------------------- */

const statusById = (id: string): Status => {
   const found = status.find((s) => s.id === id);
   if (!found) throw new Error(`Unknown status id: ${id}`);
   return found;
};

/**
 * Compact issue seed:
 * [identifier, title, statusId, priorityIdx, assigneeIdx | null, labelIdxs, projectIdx | null, cycleId, createdAt, dueDate?]
 *
 * - priorityIdx: index in `priorities` (0 no-priority, 1 urgent, 2 high, 3 medium, 4 low)
 * - assigneeIdx / labelIdxs / projectIdx: indexes in `users` / `labels` / `projects`
 * - cycleId: '' = not planned in any cycle
 */
type IssueSeed = [
   string,
   string,
   string,
   number,
   number | null,
   number[],
   number | null,
   string,
   string,
   string?,
];

const seeds: IssueSeed[] = [
   /* ------------------------- Cycle 21 (current) ------------------------- */
   // Product Feedback (2)
   [
      'LNUI-701',
      'Combobox: keyboard selection skips disabled options inconsistently',
      'product-feedback',
      2,
      0,
      [0, 8],
      0,
      '21',
      '2026-07-21',
   ],
   [
      'LNUI-702',
      'Date picker: month navigation feels laggy on low-end devices',
      'product-feedback',
      3,
      6,
      [5],
      9,
      '21',
      '2026-07-22',
   ],
   // In Progress (4)
   [
      'LNUI-703',
      'Rework Dialog focus trap to support nested portals',
      'in-progress',
      1,
      2,
      [1, 8],
      2,
      '21',
      '2026-07-20',
   ],
   [
      'LNUI-704',
      'Add virtualization to Data Table for 10k+ rows',
      'in-progress',
      2,
      4,
      [5],
      9,
      '21',
      '2026-07-21',
   ],
   [
      'LNUI-705',
      'Ship CLI flag to scaffold components with test files',
      'in-progress',
      3,
      8,
      [2, 9],
      5,
      '21',
      '2026-07-23',
   ],
   [
      'LNUI-706',
      'Migrate color tokens to OKLCH with fallbacks',
      'in-progress',
      2,
      12,
      [4],
      1,
      '21',
      '2026-07-24',
   ],
   // Technical Review (2)
   [
      'LNUI-707',
      'Refactor Tooltip positioning engine to floating middleware',
      'technical-review',
      2,
      1,
      [4],
      7,
      '21',
      '2026-07-20',
   ],
   [
      'LNUI-708',
      'Toast queue: collapse duplicate notifications',
      'technical-review',
      3,
      10,
      [2],
      11,
      '21',
      '2026-07-22',
   ],
   // Paused (1)
   [
      'LNUI-709',
      'Carousel: momentum scrolling on trackpads',
      'paused',
      4,
      14,
      [2],
      0,
      '21',
      '2026-07-21',
   ],
   // Blocked (1)
   [
      'LNUI-710',
      'Command palette: async sources hang when provider throws',
      'blocked',
      1,
      3,
      [1],
      0,
      '21',
      '2026-07-25',
   ],
   // Triage (1)
   [
      'LNUI-711',
      'Report: Select dropdown clipped inside scrollable Sheet',
      'triage',
      0,
      null,
      [1],
      null,
      '21',
      '2026-07-30',
   ],
   // Todo (13)
   [
      'LNUI-712',
      'Add skeleton variants for Card and Table',
      'to-do',
      3,
      5,
      [0],
      6,
      '21',
      '2026-07-20',
   ],
   [
      'LNUI-713',
      'Expose CSS variables for Radix Accordion animations',
      'to-do',
      4,
      null,
      [0],
      0,
      '21',
      '2026-07-21',
   ],
   [
      'LNUI-714',
      'Breadcrumb: support collapsed middle items with popover',
      'to-do',
      3,
      7,
      [2],
      3,
      '21',
      '2026-07-22',
   ],
   [
      'LNUI-715',
      'Form: surface async validation state on submit button',
      'to-do',
      2,
      9,
      [10],
      10,
      '21',
      '2026-07-22',
   ],
   [
      'LNUI-716',
      'Avatar group: overflow counter with tooltip listing users',
      'to-do',
      4,
      11,
      [2],
      6,
      '21',
      '2026-07-23',
   ],
   [
      'LNUI-717',
      'Number input: locale-aware decimal separators',
      'to-do',
      3,
      13,
      [10],
      10,
      '21',
      '2026-07-24',
   ],
   [
      'LNUI-718',
      'Docs: interactive playground for Badge variants',
      'to-do',
      4,
      15,
      [3],
      1,
      '21',
      '2026-07-25',
   ],
   [
      'LNUI-719',
      'Resizable panels: persist layout per page in memory',
      'to-do',
      3,
      16,
      [2],
      4,
      '21',
      '2026-07-26',
   ],
   [
      'LNUI-720',
      'Tabs: add vertical orientation with proper roving focus',
      'to-do',
      2,
      17,
      [8],
      0,
      '21',
      '2026-07-27',
   ],
   [
      'LNUI-721',
      'Progress: indeterminate state with reduced-motion fallback',
      'to-do',
      4,
      18,
      [8],
      11,
      '21',
      '2026-07-28',
   ],
   [
      'LNUI-722',
      'Chart palette: colorblind-safe categorical scale',
      'to-do',
      2,
      19,
      [8, 6],
      4,
      '21',
      '2026-07-29',
   ],
   [
      'LNUI-723',
      'Sidebar: double-click on rail to collapse to icons',
      'to-do',
      4,
      0,
      [2],
      5,
      '21',
      '2026-07-30',
   ],
   [
      'LNUI-724',
      'Dropdown: sub-menu opens off-screen near viewport edge',
      'to-do',
      2,
      null,
      [1],
      8,
      '21',
      '2026-07-31',
   ],
   // Done (10)
   [
      'LNUI-725',
      'Fix Switch thumb misalignment in RTL layouts',
      'done',
      2,
      2,
      [1],
      10,
      '21',
      '2026-07-20',
   ],
   [
      'LNUI-726',
      'Memoize Table row renderer to cut re-renders by 60%',
      'done',
      1,
      4,
      [5],
      9,
      '21',
      '2026-07-20',
   ],
   [
      'LNUI-727',
      'Add aria-live region to inline form errors',
      'done',
      2,
      6,
      [8, 10],
      10,
      '21',
      '2026-07-21',
   ],
   [
      'LNUI-728',
      'Popover: flip to top when bottom space is insufficient',
      'done',
      3,
      8,
      [1],
      7,
      '21',
      '2026-07-21',
   ],
   [
      'LNUI-729',
      'Theme switcher: persist preference and honor system change',
      'done',
      3,
      10,
      [2],
      1,
      '21',
      '2026-07-22',
   ],
   [
      'LNUI-730',
      'Slider: snap points with haptic-like visual ticks',
      'done',
      4,
      12,
      [2],
      10,
      '21',
      '2026-07-23',
   ],
   [
      'LNUI-731',
      'Docs search: index component prop tables',
      'done',
      3,
      14,
      [3],
      3,
      '21',
      '2026-07-24',
   ],
   [
      'LNUI-732',
      'Checkbox: indeterminate propagation for nested lists',
      'done',
      2,
      16,
      [2],
      10,
      '21',
      '2026-07-25',
   ],
   [
      'LNUI-733',
      'Reduce icon bundle size with per-icon entrypoints',
      'done',
      2,
      18,
      [5],
      5,
      '21',
      '2026-07-26',
   ],
   [
      'LNUI-734',
      'Calendar: highlight today with subtle ring in dark mode',
      'done',
      4,
      1,
      [6],
      9,
      '21',
      '2026-07-27',
   ],
   // Shipped (2)
   [
      'LNUI-735',
      'Release Empty State component with illustration slots',
      'shipped',
      3,
      3,
      [2],
      6,
      '21',
      '2026-07-28',
   ],
   [
      'LNUI-736',
      'Publish v2.4 with tree-shakable exports',
      'shipped',
      1,
      5,
      [5, 2],
      5,
      '21',
      '2026-07-29',
   ],
   // Canceled (1)
   [
      'LNUI-737',
      'Prototype parallax hero for docs landing',
      'canceled',
      4,
      7,
      [6],
      3,
      '21',
      '2026-07-30',
   ],

   /* ------------------------ Cycle 22 (upcoming) ------------------------- */
   [
      'LNUI-738',
      'Timeline component: draft API and anatomy',
      'to-do',
      2,
      9,
      [2, 6],
      6,
      '22',
      '2026-07-26',
   ],
   [
      'LNUI-739',
      'File upload: chunked uploads with resumable state',
      'to-do',
      2,
      11,
      [2],
      10,
      '22',
      '2026-07-27',
   ],
   [
      'LNUI-740',
      'Kbd component: platform-aware modifier rendering',
      'to-do',
      4,
      13,
      [0],
      0,
      '22',
      '2026-07-28',
   ],
   [
      'LNUI-741',
      'Stepper: validate steps lazily on next',
      'to-do',
      3,
      15,
      [10],
      10,
      '22',
      '2026-07-29',
   ],
   [
      'LNUI-742',
      'Density mode: compact spacing scale across components',
      'to-do',
      3,
      17,
      [0, 6],
      1,
      '22',
      '2026-07-30',
   ],
   [
      'LNUI-743',
      'Docs: migration guide from v1 tokens to v2 tokens',
      'to-do',
      3,
      19,
      [3],
      3,
      '22',
      '2026-07-31',
   ],
   [
      'LNUI-744',
      'Audit Dialog scroll locking on iOS Safari',
      'paused',
      2,
      0,
      [1, 8],
      2,
      '22',
      '2026-07-25',
   ],
   [
      'LNUI-745',
      'Benchmark charts rendering vs. canvas fallback',
      'paused',
      3,
      2,
      [5],
      4,
      '22',
      '2026-07-26',
   ],

   /* ----------------------- Cycle 20 (completed) ------------------------- */
   [
      'LNUI-681',
      'Add copy-to-clipboard button to code blocks in docs',
      'done',
      3,
      4,
      [3],
      3,
      '20',
      '2026-07-06',
   ],
   ['LNUI-682', 'Fix Tabs indicator jump on font load', 'done', 2, 6, [1], 0, '20', '2026-07-07'],
   [
      'LNUI-683',
      'Ship Combobox multi-select with tag input',
      'shipped',
      2,
      8,
      [2],
      10,
      '20',
      '2026-07-09',
   ],
   [
      'LNUI-684',
      'Contrast pass on muted foreground colors',
      'done',
      2,
      10,
      [8],
      1,
      '20',
      '2026-07-11',
   ],
   [
      'LNUI-685',
      'Table sticky header shadow only when scrolled',
      'done',
      4,
      12,
      [0],
      9,
      '20',
      '2026-07-13',
   ],
   [
      'LNUI-686',
      'Deprecate legacy Grid in favor of layout primitives',
      'canceled',
      3,
      14,
      [4],
      6,
      '20',
      '2026-07-15',
   ],
   [
      'LNUI-687',
      'Snapshot tests for all Badge permutations',
      'done',
      4,
      16,
      [9],
      6,
      '20',
      '2026-07-17',
   ],

   /* ----------------------- Cycle 19 (completed) ------------------------- */
   [
      'LNUI-661',
      'Rewrite Tooltip docs with do/don’t examples',
      'done',
      3,
      1,
      [3],
      7,
      '19',
      '2026-06-22',
   ],
   [
      'LNUI-662',
      'Fix focus ring clipped by overflow-hidden cards',
      'done',
      2,
      3,
      [1, 8],
      6,
      '19',
      '2026-06-24',
   ],
   ['LNUI-663', 'Ship Sonner-based toast presets', 'shipped', 3, 5, [2], 11, '19', '2026-06-26'],
   ['LNUI-664', 'Lazy-load heavy demos on docs pages', 'done', 2, 7, [5], 3, '19', '2026-06-28'],
   [
      'LNUI-665',
      'Select: type-ahead across grouped options',
      'done',
      3,
      9,
      [2],
      8,
      '19',
      '2026-06-30',
   ],
   [
      'LNUI-666',
      'Duplicate of LNUI-662 reported from support',
      'duplicate',
      0,
      null,
      [1],
      6,
      '19',
      '2026-07-01',
   ],
   ['LNUI-667', 'Storybook a11y addon in CI', 'done', 2, 11, [9, 8], 6, '19', '2026-07-03'],

   /* ----------------------- Cycle 18 (completed) ------------------------- */
   [
      'LNUI-641',
      'Fix Sheet drag-to-close threshold on touch',
      'done',
      2,
      13,
      [1],
      2,
      '18',
      '2026-06-08',
   ],
   ['LNUI-642', 'Add Input OTP component', 'shipped', 2, 15, [2], 10, '18', '2026-06-10'],
   [
      'LNUI-643',
      'Prevent layout shift when scrollbar appears with Dialog',
      'done',
      2,
      17,
      [1],
      2,
      '18',
      '2026-06-12',
   ],
   [
      'LNUI-644',
      'Document controlled vs uncontrolled patterns',
      'done',
      3,
      19,
      [3],
      3,
      '18',
      '2026-06-14',
   ],
   [
      'LNUI-645',
      'Spike: CSS anchor positioning for popovers',
      'canceled',
      4,
      0,
      [4],
      7,
      '18',
      '2026-06-16',
   ],
   [
      'LNUI-646',
      'Refactor Avatar to support fallback delays',
      'done',
      4,
      2,
      [4],
      6,
      '18',
      '2026-06-18',
   ],

   /* ----------------------- Cycle 17 (completed) ------------------------- */
   [
      'LNUI-621',
      'Dark mode: fix border contrast on nested cards',
      'done',
      3,
      4,
      [1, 6],
      1,
      '17',
      '2026-05-25',
   ],
   ['LNUI-622', 'Ship Pagination compound component', 'shipped', 2, 6, [2], 9, '17', '2026-05-27'],
   [
      'LNUI-623',
      'Add usage analytics to docs code copy events',
      'done',
      4,
      8,
      [3],
      3,
      '17',
      '2026-05-29',
   ],
   ['LNUI-624', 'Textarea: autosize with max rows', 'done', 3, 10, [2], 10, '17', '2026-06-01'],
   [
      'LNUI-625',
      'Fix Menubar closing when moving across triggers',
      'done',
      2,
      12,
      [1],
      8,
      '17',
      '2026-06-03',
   ],
   [
      'LNUI-626',
      'Explore Houdini paint worklet for gradients',
      'canceled',
      4,
      14,
      [4],
      1,
      '17',
      '2026-06-05',
   ],

   /* ----------------------- Cycle 16 (completed) ------------------------- */
   [
      'LNUI-601',
      'Set up visual regression tests with Playwright',
      'done',
      2,
      16,
      [9],
      6,
      '16',
      '2026-05-11',
   ],
   [
      'LNUI-602',
      'Fix Tooltip flicker when trigger re-renders',
      'done',
      2,
      18,
      [1],
      7,
      '16',
      '2026-05-13',
   ],
   [
      'LNUI-603',
      'Ship Scroll Area with custom scrollbar styling',
      'shipped',
      3,
      1,
      [2],
      0,
      '16',
      '2026-05-15',
   ],
   [
      'LNUI-604',
      'Normalize z-index scale across overlays',
      'done',
      2,
      3,
      [4],
      2,
      '16',
      '2026-05-17',
   ],
   [
      'LNUI-605',
      'Add French and Spanish docs translations',
      'done',
      4,
      5,
      [10],
      3,
      '16',
      '2026-05-19',
   ],

   /* --------------------------- Backlog stock ---------------------------- */
   [
      'LNUI-801',
      'Explore container queries for responsive Card',
      'backlog',
      3,
      null,
      [0],
      6,
      '',
      '2026-06-02',
   ],
   [
      'LNUI-802',
      'Tree view component with async children',
      'backlog',
      3,
      null,
      [2],
      6,
      '',
      '2026-06-05',
   ],
   [
      'LNUI-803',
      'Color picker: eyedropper API integration',
      'backlog',
      4,
      null,
      [2],
      10,
      '',
      '2026-06-09',
   ],
   [
      'LNUI-804',
      'Rich text editor primitives exploration',
      'backlog',
      3,
      null,
      [2, 4],
      null,
      '',
      '2026-06-12',
   ],
   [
      'LNUI-805',
      'Drag handle affordance for sortable lists',
      'backlog',
      4,
      null,
      [0],
      9,
      '',
      '2026-06-15',
   ],
   ['LNUI-806', 'Print stylesheet for docs pages', 'backlog', 4, null, [3], 3, '', '2026-06-18'],
   ['LNUI-807', 'High-contrast theme preset', 'backlog', 3, null, [8, 6], 1, '', '2026-06-21'],
   [
      'LNUI-808',
      'Skeleton auto-generation from component slots',
      'backlog',
      4,
      null,
      [4],
      6,
      '',
      '2026-06-24',
   ],
   ['LNUI-809', 'Masonry layout primitive', 'backlog', 4, null, [2], 4, '', '2026-06-27'],
   [
      'LNUI-810',
      'Investigate React Compiler compatibility',
      'backlog',
      2,
      null,
      [5, 9],
      5,
      '',
      '2026-06-30',
   ],
   [
      'LNUI-811',
      'Currency input with min/max and formatting',
      'backlog',
      3,
      null,
      [10],
      10,
      '',
      '2026-07-03',
   ],
   [
      'LNUI-812',
      'Docs: add keyboard shortcuts cheat sheet',
      'backlog',
      4,
      null,
      [3],
      3,
      '',
      '2026-07-06',
   ],
   [
      'LNUI-813',
      'Idea: AI-assisted theme generator from a brand color',
      'idea',
      0,
      null,
      [6],
      1,
      '',
      '2026-07-08',
   ],
   [
      'LNUI-814',
      'Idea: Figma plugin exporting tokens to CSS variables',
      'idea',
      0,
      null,
      [6, 2],
      1,
      '',
      '2026-07-10',
   ],
   [
      'LNUI-815',
      'Idea: playground sharing via URL snapshots',
      'idea',
      0,
      null,
      [3],
      3,
      '',
      '2026-07-12',
   ],
   [
      'LNUI-816',
      'Idea: motion presets pack (spring, snappy, gentle)',
      'idea',
      0,
      null,
      [2],
      0,
      '',
      '2026-07-14',
   ],
   [
      'LNUI-817',
      'Idea: CLI codemod for breaking changes',
      'idea',
      0,
      null,
      [5],
      5,
      '',
      '2026-07-16',
   ],
   ['LNUI-818', 'Idea: docs dark-mode illustrations', 'idea', 0, null, [6], 3, '', '2026-07-18'],
   [
      'LNUI-819',
      'Report: Combobox crashes with empty option groups',
      'triage',
      1,
      null,
      [1],
      8,
      '',
      '2026-07-29',
   ],
   [
      'LNUI-820',
      'Report: Table header wraps awkwardly in Safari 17',
      'triage',
      0,
      null,
      [1],
      9,
      '',
      '2026-07-30',
   ],
   [
      'LNUI-821',
      'Request: expose Tooltip open delay as prop',
      'triage',
      0,
      null,
      [0],
      7,
      '',
      '2026-07-31',
   ],
];

/* -------------------------------------------------------------------------- */
/*                                   Ranks                                    */
/* -------------------------------------------------------------------------- */

// Generates issue ranks using the LexoRank algorithm.
export const ranks: string[] = [];
const generateIssuesRanks = () => {
   const firstRank = new LexoRank('a3c');
   ranks.push(firstRank.toString());
   for (let i = 1; i < seeds.length + 20; i++) {
      const previousRank = LexoRank.from(ranks[i - 1]);
      ranks.push(previousRank.increment().toString());
   }
};
generateIssuesRanks();

/* -------------------------------------------------------------------------- */
/*                                   Issues                                   */
/* -------------------------------------------------------------------------- */

export const issues: Issue[] = seeds.map((seed, index) => {
   const [
      identifier,
      title,
      statusId,
      priorityIdx,
      assigneeIdx,
      labelIdxs,
      projectIdx,
      cycleId,
      createdAt,
      dueDate,
   ] = seed;

   return {
      id: String(index + 1),
      identifier,
      title,
      description: '',
      status: statusById(statusId),
      priority: priorities[priorityIdx],
      assignee: assigneeIdx === null ? null : (users[assigneeIdx] ?? null),
      labels: labelIdxs.map((i) => labels[i]).filter(Boolean),
      project: projectIdx === null ? undefined : projects[projectIdx],
      cycleId,
      createdAt,
      rank: ranks[index],
      ...(dueDate ? { dueDate } : {}),
   };
});

/* -------------------------------------------------------------------------- */
/*                                  Helpers                                   */
/* -------------------------------------------------------------------------- */

export function groupIssuesByStatus(issues: Issue[]): Record<string, Issue[]> {
   return issues.reduce<Record<string, Issue[]>>((acc, issue) => {
      const statusId = issue.status.id;

      if (!acc[statusId]) {
         acc[statusId] = [];
      }

      acc[statusId].push(issue);

      return acc;
   }, {});
}

export function sortIssuesByPriority(issues: Issue[]): Issue[] {
   const priorityOrder: Record<string, number> = {
      'urgent': 0,
      'high': 1,
      'medium': 2,
      'low': 3,
      'no-priority': 4,
   };

   return issues
      .slice()
      .sort(
         (a, b) =>
            priorityOrder[a.priority.id as keyof typeof priorityOrder] -
            priorityOrder[b.priority.id as keyof typeof priorityOrder]
      );
}

export function filterIssuesByCycle(allIssues: Issue[], cycleId: string): Issue[] {
   return allIssues.filter((issue) => issue.cycleId === cycleId);
}

export function filterIssuesByCategories(
   allIssues: Issue[],
   categories: StatusCategory[]
): Issue[] {
   return allIssues.filter((issue) => categories.includes(issue.status.category));
}
