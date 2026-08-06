import { Issue } from './issues';
import { User, users } from './users';

/* -------------------------------------------------------------------------- */
/*                         Rich content block model                           */
/* -------------------------------------------------------------------------- */

/**
 * Structured description content. Text supports lightweight inline
 * formatting: `code` and **bold** (parsed by the block renderer).
 */
export type ContentBlock =
   | { type: 'heading'; text: string; level?: 1 | 2 }
   | { type: 'paragraph'; text: string }
   | { type: 'bullet-list'; items: string[] }
   | { type: 'numbered-list'; items: string[] }
   | { type: 'checklist'; items: { text: string; checked: boolean }[] }
   | { type: 'code'; language: string; code: string }
   | { type: 'image'; alt: string; caption?: string; aspect?: 'wide' | 'video' | 'square' }
   | { type: 'video'; title: string; duration?: string }
   | { type: 'quote'; text: string; author?: string }
   | { type: 'divider' }
   | { type: 'issue-ref'; identifier: string; note?: string };

export interface CommentReaction {
   emoji: string;
   count: number;
}

export type ActivityItem =
   | {
        kind: 'event';
        id: string;
        actor: User;
        /** e.g. 'created' | 'status' | 'label' | 'priority' | 'cycle' | 'blocked' | 'unblocked' | 'related' | 'pr' */
        event: string;
        text: string;
        timeAgo: string;
     }
   | {
        kind: 'comment';
        id: string;
        actor: User;
        timeAgo: string;
        body: ContentBlock[];
        reactions?: CommentReaction[];
     };

export interface PrLink {
   id: string;
   title: string;
   status: 'open' | 'merged' | 'draft';
}

export interface IssueDetail {
   identifier: string;
   description: ContentBlock[];
   activity: ActivityItem[];
   subIssueIds?: string[];
   relatedIds?: string[];
   blockedByIds?: string[];
   prLinks?: PrLink[];
   milestone?: string;
}

/* -------------------------------------------------------------------------- */
/*                        Handcrafted issue details                           */
/* -------------------------------------------------------------------------- */

const details: IssueDetail[] = [
   {
      identifier: 'LNUI-703',
      description: [
         { type: 'heading', text: 'Context' },
         {
            type: 'paragraph',
            text: 'The current focus trap in `Dialog` relies on a hand-rolled `focusin` listener. It breaks as soon as a nested portal (Select, Combobox, DatePicker) renders its content outside the dialog subtree: focus is yanked back to the dialog and the nested widget closes.',
         },
         { type: 'heading', text: 'Proposed approach' },
         {
            type: 'paragraph',
            text: 'Track an **allowlist of portal roots** registered through context. Any element inside a registered root is treated as part of the dialog for focus containment purposes.',
         },
         {
            type: 'code',
            language: 'tsx',
            code: `const PortalRootContext = createContext<Set<HTMLElement>>(new Set());

export function useDialogPortalRoot(node: HTMLElement | null) {
   const roots = useContext(PortalRootContext);
   useEffect(() => {
      if (!node) return;
      roots.add(node);
      return () => void roots.delete(node);
   }, [node, roots]);
}`,
         },
         { type: 'heading', text: 'Acceptance criteria' },
         {
            type: 'checklist',
            items: [
               { text: 'Select opened inside a Dialog keeps focus on its listbox', checked: true },
               { text: 'Nested Dialog (2 levels) traps focus on the topmost layer', checked: true },
               { text: 'Escape closes only the topmost layer', checked: false },
               { text: 'VoiceOver / NVDA announce the dialog correctly', checked: false },
            ],
         },
         { type: 'divider' },
         {
            type: 'issue-ref',
            identifier: 'LNUI-643',
            note: 'previous scrollbar layout-shift fix touches the same overlay code',
         },
      ],
      activity: [
         {
            kind: 'event',
            id: 'a1',
            actor: users[1],
            event: 'created',
            text: 'created the issue',
            timeAgo: '12d ago',
         },
         {
            kind: 'event',
            id: 'a2',
            actor: users[1],
            event: 'label',
            text: 'added label Bug',
            timeAgo: '12d ago',
         },
         {
            kind: 'event',
            id: 'a3',
            actor: users[2],
            event: 'status',
            text: 'moved from Todo to In Progress',
            timeAgo: '9d ago',
         },
         {
            kind: 'comment',
            id: 'a4',
            actor: users[1],
            timeAgo: '8d ago',
            body: [
               {
                  type: 'paragraph',
                  text: 'Heads up: Radix solves this with a `DismissableLayer` tree. Worth reading their implementation before we reinvent it — the branch pruning logic is subtle.',
               },
            ],
            reactions: [{ emoji: '👍', count: 3 }],
         },
         {
            kind: 'comment',
            id: 'a5',
            actor: users[2],
            timeAgo: '6d ago',
            body: [
               {
                  type: 'paragraph',
                  text: 'Agreed. I kept the context registry approach but mirrored their layer ordering. Draft PR is up, the two remaining checkboxes need the screen-reader pass.',
               },
            ],
         },
      ],
      relatedIds: ['LNUI-643', 'LNUI-744'],
      prLinks: [
         { id: '#212', title: 'fix(dialog): portal-aware focus containment', status: 'open' },
      ],
   },
   {
      identifier: 'LNUI-704',
      description: [
         {
            type: 'paragraph',
            text: 'Rendering 10k+ rows makes the `DataTable` unusable: initial render takes **4.2s** and scrolling drops to ~11fps on a mid-range laptop.',
         },
         {
            type: 'image',
            alt: 'React Profiler flamegraph of a 10k-row render',
            caption: 'Profiler capture — 92% of the time is spent mounting row cells',
            aspect: 'wide',
         },
         { type: 'heading', text: 'Plan' },
         {
            type: 'numbered-list',
            items: [
               'Windowing with a fixed overscan of 12 rows (no external dep, ~120 LOC)',
               'Row measurement cache keyed by row id for variable heights',
               'Sticky header stays outside the scroll container',
               'Keyboard navigation jumps must scroll the virtual window',
            ],
         },
         {
            type: 'video',
            title: 'Scroll capture — prototype at 120fps',
            duration: '0:42',
         },
         {
            type: 'quote',
            text: 'Budget: first paint of the table under 300ms with 10k rows, scroll at 60fps minimum.',
            author: 'perf budget, Q3 notes',
         },
      ],
      activity: [
         {
            kind: 'event',
            id: 'b1',
            actor: users[4],
            event: 'created',
            text: 'created the issue',
            timeAgo: '11d ago',
         },
         {
            kind: 'event',
            id: 'b2',
            actor: users[4],
            event: 'cycle',
            text: 'added issue to Cycle 21',
            timeAgo: '11d ago',
         },
         {
            kind: 'event',
            id: 'b3',
            actor: users[0],
            event: 'priority',
            text: 'set priority to High',
            timeAgo: '10d ago',
         },
         {
            kind: 'comment',
            id: 'b4',
            actor: users[0],
            timeAgo: '4d ago',
            body: [
               {
                  type: 'paragraph',
                  text: 'Prototype numbers on the reference dataset: first paint **278ms**, steady scroll at 60fps, 74MB heap (was 410MB). Ship it.',
               },
            ],
            reactions: [
               { emoji: '🔥', count: 4 },
               { emoji: '🚀', count: 2 },
            ],
         },
      ],
      subIssueIds: ['LNUI-726'],
      relatedIds: ['LNUI-685'],
      prLinks: [{ id: '#198', title: 'perf(table): windowed row rendering', status: 'merged' }],
   },
   {
      identifier: 'LNUI-701',
      description: [
         { type: 'heading', text: 'Steps to reproduce' },
         {
            type: 'numbered-list',
            items: [
               'Open the Combobox demo with a list containing disabled options',
               'Focus the input and press `ArrowDown` repeatedly',
               'Reach a disabled option surrounded by two enabled ones',
            ],
         },
         { type: 'heading', text: 'Expected' },
         {
            type: 'paragraph',
            text: 'Focus skips the disabled option and lands on the next enabled one, in both directions.',
         },
         { type: 'heading', text: 'Actual' },
         {
            type: 'paragraph',
            text: 'Going **down** skips correctly, going **up** stops on the disabled option and the `aria-activedescendant` points to a non-interactive element.',
         },
         { type: 'video', title: 'Screen recording — keyboard navigation bug', duration: '0:18' },
         { type: 'divider' },
         {
            type: 'paragraph',
            text: 'Likely an off-by-one in `findNextEnabledIndex` when iterating backwards.',
         },
      ],
      activity: [
         {
            kind: 'event',
            id: 'c1',
            actor: users[0],
            event: 'created',
            text: 'created the issue',
            timeAgo: '10d ago',
         },
         {
            kind: 'event',
            id: 'c2',
            actor: users[0],
            event: 'status',
            text: 'moved from Triage to Product Feedback',
            timeAgo: '9d ago',
         },
         {
            kind: 'comment',
            id: 'c3',
            actor: users[7],
            timeAgo: '7d ago',
            body: [
               {
                  type: 'paragraph',
                  text: 'Confirmed on Firefox and Safari as well — not browser specific. The backwards iterator starts at `index` instead of `index - 1`.',
               },
            ],
            reactions: [{ emoji: '👀', count: 2 }],
         },
      ],
      relatedIds: ['LNUI-819'],
   },
   {
      identifier: 'LNUI-702',
      description: [
         {
            type: 'quote',
            text: 'Navigating between months on my old Android phone takes almost a second, the animation stutters badly.',
            author: 'user feedback, support ticket #482',
         },
         {
            type: 'paragraph',
            text: 'Reproduced on a throttled 4x CPU profile. Each month navigation re-renders **42 day cells** plus the header, and every cell recomputes its formatter.',
         },
         { type: 'heading', text: 'Hypotheses' },
         {
            type: 'bullet-list',
            items: [
               'The `Intl.DateTimeFormat` instance is created per cell per render — hoist and reuse',
               'Month transition animates `box-shadow` (paint-heavy), switch to `transform`/`opacity`',
               'Day cells can be memoized: only selection and today change between renders',
            ],
         },
         {
            type: 'image',
            alt: 'Chrome performance trace of a month navigation',
            caption: 'Trace — 610ms scripting, 220ms rendering on 4x throttle',
            aspect: 'wide',
         },
      ],
      activity: [
         {
            kind: 'event',
            id: 'd1',
            actor: users[6],
            event: 'created',
            text: 'created the issue',
            timeAgo: '10d ago',
         },
         {
            kind: 'comment',
            id: 'd2',
            actor: users[6],
            timeAgo: '5d ago',
            body: [
               {
                  type: 'paragraph',
                  text: 'Hoisting the formatter alone cuts scripting from 610ms to 180ms. The rest is the shadow animation.',
               },
            ],
         },
         {
            kind: 'comment',
            id: 'd3',
            actor: users[13],
            timeAgo: '4d ago',
            body: [
               {
                  type: 'paragraph',
                  text: 'Design is fine with a simple opacity crossfade on low-end devices — we can key it on `prefers-reduced-motion` too.',
               },
            ],
            reactions: [{ emoji: '✅', count: 1 }],
         },
      ],
   },
   {
      identifier: 'LNUI-706',
      description: [
         { type: 'heading', text: 'Goals' },
         {
            type: 'bullet-list',
            items: [
               'Move every color token from HSL to **OKLCH** for perceptual uniformity',
               'Keep HSL fallbacks for browsers without `oklch()` support',
               'No visual regression above a deltaE of 1.5 on existing themes',
            ],
         },
         { type: 'heading', text: 'Token mapping' },
         {
            type: 'code',
            language: 'css',
            code: `:root {
   /* before */
   --primary: hsl(243 75% 59%);

   /* after — fallback first, then OKLCH override */
   --primary: hsl(243 75% 59%);
}

@supports (color: oklch(0% 0 0)) {
   :root {
      --primary: oklch(58.5% 0.233 277.1);
   }
}`,
         },
         { type: 'heading', text: 'Migration steps' },
         {
            type: 'checklist',
            items: [
               {
                  text: 'Script converting the HSL palette to OKLCH (round-trip checked)',
                  checked: true,
               },
               { text: 'Regenerate `globals.css` tokens for light + dark', checked: true },
               { text: 'Visual diff on the 12 template pages', checked: false },
               { text: 'Update theming docs and the theme generator', checked: false },
            ],
         },
         { type: 'divider' },
         { type: 'issue-ref', identifier: 'LNUI-729', note: 'theme switcher must re-read tokens' },
      ],
      activity: [
         {
            kind: 'event',
            id: 'e1',
            actor: users[12],
            event: 'created',
            text: 'created the issue',
            timeAgo: '8d ago',
         },
         {
            kind: 'event',
            id: 'e2',
            actor: users[12],
            event: 'status',
            text: 'moved from Backlog to In Progress',
            timeAgo: '7d ago',
         },
         {
            kind: 'comment',
            id: 'e3',
            actor: users[19],
            timeAgo: '2d ago',
            body: [
               {
                  type: 'paragraph',
                  text: 'The converted dark palette looks noticeably smoother on gradients. Two tokens (`--warning`, `--chart-3`) drifted above deltaE 1.5, adjusting chroma manually.',
               },
            ],
            reactions: [{ emoji: '🎨', count: 2 }],
         },
      ],
      subIssueIds: ['LNUI-729', 'LNUI-734'],
      milestone: 'Design Tokens v2',
   },
   {
      identifier: 'LNUI-710',
      description: [
         {
            type: 'paragraph',
            text: 'When an async source passed to the command palette **throws** (network error, bad JSON), the loading spinner never resolves and the whole palette becomes unresponsive — even for local commands.',
         },
         {
            type: 'code',
            language: 'text',
            code: `Unhandled Promise Rejection: TypeError: results is not iterable
   at CommandPalette.mergeSources (command-palette.tsx:141)
   at async Promise.all (index 2)`,
         },
         {
            type: 'paragraph',
            text: 'Fix direction: isolate each source with `Promise.allSettled`, render per-source error rows, and keep local commands interactive while remote sources are pending.',
         },
      ],
      activity: [
         {
            kind: 'event',
            id: 'f1',
            actor: users[3],
            event: 'created',
            text: 'created the issue',
            timeAgo: '7d ago',
         },
         {
            kind: 'event',
            id: 'f2',
            actor: users[3],
            event: 'blocked',
            text: 'marked this issue as blocked by LNUI-707',
            timeAgo: '6d ago',
         },
         {
            kind: 'comment',
            id: 'f3',
            actor: users[3],
            timeAgo: '3d ago',
            body: [
               {
                  type: 'paragraph',
                  text: 'Blocked on the positioning refactor because the error rows change the palette height and the old positioning code jumps.',
               },
            ],
         },
      ],
      blockedByIds: ['LNUI-707'],
      relatedIds: ['LNUI-728'],
   },
   {
      identifier: 'LNUI-712',
      description: [
         {
            type: 'paragraph',
            text: 'Card and Table need first-class skeleton variants so loading states stop being hand-rolled in every app.',
         },
         {
            type: 'checklist',
            items: [
               { text: '`CardSkeleton` — header, media slot, two text lines', checked: false },
               { text: '`TableSkeleton` — configurable rows × columns', checked: false },
               { text: 'Shimmer respects `prefers-reduced-motion`', checked: false },
            ],
         },
         {
            type: 'image',
            alt: 'Skeleton variants design mock',
            caption: 'Design mock — card and table skeletons, light & dark',
            aspect: 'video',
         },
      ],
      activity: [
         {
            kind: 'event',
            id: 'g1',
            actor: users[5],
            event: 'created',
            text: 'created the issue',
            timeAgo: '12d ago',
         },
         {
            kind: 'event',
            id: 'g2',
            actor: users[5],
            event: 'cycle',
            text: 'added issue to Cycle 21',
            timeAgo: '12d ago',
         },
      ],
   },
   {
      identifier: 'LNUI-718',
      description: [
         {
            type: 'paragraph',
            text: 'The Badge docs page should embed an **interactive playground**: variant, size, and color pickers with live code output users can copy.',
         },
         {
            type: 'image',
            alt: 'Playground layout wireframe',
            caption: 'Wireframe — controls on the left, live preview + code on the right',
            aspect: 'wide',
         },
         {
            type: 'image',
            alt: 'Mobile layout of the playground',
            caption: 'On mobile the controls collapse into a bottom sheet',
            aspect: 'square',
         },
         {
            type: 'bullet-list',
            items: [
               'Controls are generated from the component prop table (single source of truth)',
               'Code output stays in sync and is copy-pastable',
               'Playground state is encoded in the URL for sharing',
            ],
         },
      ],
      activity: [
         {
            kind: 'event',
            id: 'h1',
            actor: users[15],
            event: 'created',
            text: 'created the issue',
            timeAgo: '7d ago',
         },
         {
            kind: 'comment',
            id: 'h2',
            actor: users[9],
            timeAgo: '5d ago',
            body: [
               {
                  type: 'paragraph',
                  text: 'URL-encoded state pairs nicely with the docs search indexing work — shared playground links become deep links into the docs.',
               },
            ],
         },
      ],
      relatedIds: ['LNUI-731', 'LNUI-815'],
   },
   {
      identifier: 'LNUI-722',
      description: [
         {
            type: 'paragraph',
            text: 'Our categorical chart palette fails for deuteranopia: series 2 and 4 are indistinguishable. We need a colorblind-safe scale that still matches the brand.',
         },
         {
            type: 'image',
            alt: 'Current vs proposed palette under CVD simulation',
            caption: 'Simulation — top: current palette, bottom: proposal under deuteranopia',
            aspect: 'wide',
         },
         { type: 'heading', text: 'Constraints' },
         {
            type: 'bullet-list',
            items: [
               'Minimum 8 distinguishable categorical steps',
               'Each step readable against both `--background` values (light/dark)',
               'Sequential and diverging ramps derived from the same anchors',
            ],
         },
         {
            type: 'quote',
            text: 'Color should never be the only channel encoding a data series.',
            author: 'a11y guidelines, charts section',
         },
      ],
      activity: [
         {
            kind: 'event',
            id: 'i1',
            actor: users[19],
            event: 'created',
            text: 'created the issue',
            timeAgo: '3d ago',
         },
         {
            kind: 'event',
            id: 'i2',
            actor: users[19],
            event: 'label',
            text: 'added labels Accessibility, Design',
            timeAgo: '3d ago',
         },
      ],
      relatedIds: ['LNUI-727'],
   },
   {
      identifier: 'LNUI-726',
      description: [
         {
            type: 'paragraph',
            text: 'Every keystroke in the table filter re-rendered **all** visible rows. Wrapping the row renderer in `memo` with a custom comparator cut re-renders by ~60%.',
         },
         {
            type: 'code',
            language: 'tsx',
            code: `const TableRow = memo(TableRowImpl, (prev, next) =>
   prev.row.id === next.row.id &&
   prev.row.version === next.row.version &&
   prev.isSelected === next.isSelected
);`,
         },
         {
            type: 'paragraph',
            text: 'Measured on the 1k-row demo: keystroke latency went from 96ms to **34ms** (p95).',
         },
      ],
      activity: [
         {
            kind: 'event',
            id: 'j1',
            actor: users[4],
            event: 'created',
            text: 'created the issue',
            timeAgo: '11d ago',
         },
         {
            kind: 'event',
            id: 'j2',
            actor: users[4],
            event: 'pr',
            text: 'linked pull request #196',
            timeAgo: '10d ago',
         },
         {
            kind: 'event',
            id: 'j3',
            actor: users[4],
            event: 'status',
            text: 'moved from In Progress to Done',
            timeAgo: '9d ago',
         },
         {
            kind: 'comment',
            id: 'j4',
            actor: users[8],
            timeAgo: '9d ago',
            body: [{ type: 'paragraph', text: 'Nice one — the filter feels instant now. 🎉' }],
            reactions: [{ emoji: '🎉', count: 5 }],
         },
      ],
      prLinks: [{ id: '#196', title: 'perf(table): memoize row renderer', status: 'merged' }],
   },
   {
      identifier: 'LNUI-735',
      description: [
         {
            type: 'paragraph',
            text: 'The **Empty State** component ships with three illustration slots (no-data, error, first-use) and composable actions.',
         },
         {
            type: 'image',
            alt: 'Empty state component preview',
            caption: 'Preview — no-data variant with primary + secondary actions',
            aspect: 'video',
         },
         { type: 'heading', text: 'Release notes' },
         {
            type: 'bullet-list',
            items: [
               '`<EmptyState />` with `illustration`, `title`, `description`, `actions` slots',
               'Ships with 3 neutral SVG illustrations, tree-shaken when unused',
               'Docs page with usage guidelines and do/don’t examples',
            ],
         },
         {
            type: 'quote',
            text: 'An empty state is the first screen most users see — treat it as a landing page, not an afterthought.',
         },
      ],
      activity: [
         {
            kind: 'event',
            id: 'k1',
            actor: users[3],
            event: 'created',
            text: 'created the issue',
            timeAgo: '9d ago',
         },
         {
            kind: 'event',
            id: 'k2',
            actor: users[3],
            event: 'pr',
            text: 'linked pull request #205',
            timeAgo: '5d ago',
         },
         {
            kind: 'event',
            id: 'k3',
            actor: users[3],
            event: 'status',
            text: 'moved from Technical Review to Shipped',
            timeAgo: '2d ago',
         },
      ],
      prLinks: [{ id: '#205', title: 'feat(empty-state): new component + docs', status: 'merged' }],
   },
   {
      identifier: 'LNUI-819',
      description: [
         { type: 'heading', text: 'Repro' },
         {
            type: 'numbered-list',
            items: [
               'Pass an option group with an empty `options` array',
               'Open the Combobox',
               'Crash on first keystroke',
            ],
         },
         {
            type: 'code',
            language: 'text',
            code: `TypeError: Cannot read properties of undefined (reading 'value')
   at getFirstOption (combobox.tsx:88)
   at handleKeyDown (combobox.tsx:203)`,
         },
         {
            type: 'paragraph',
            text: 'Reported through the docs feedback widget. Needs triage: either skip empty groups at render time or guard `getFirstOption`.',
         },
      ],
      activity: [
         {
            kind: 'event',
            id: 'l1',
            actor: users[16],
            event: 'created',
            text: 'created the issue from docs feedback',
            timeAgo: '2d ago',
         },
      ],
      relatedIds: ['LNUI-701'],
   },
];

/* -------------------------------------------------------------------------- */
/*                     Deterministic fallback generation                      */
/* -------------------------------------------------------------------------- */

const hashString = (value: string): number => {
   let hash = 0;
   for (let i = 0; i < value.length; i++) {
      hash = (hash * 31 + value.charCodeAt(i)) % 100003;
   }
   return hash;
};

/**
 * Builds a plausible detail for issues without a handcrafted one.
 * Deterministic (seeded by the identifier) so SSR and client match.
 */
const buildFallbackDetail = (issue: Issue): IssueDetail => {
   const seed = hashString(issue.identifier);
   const author = issue.assignee ?? users[seed % users.length];
   const reporter = users[(seed + 7) % users.length];

   const intro: ContentBlock = {
      type: 'paragraph',
      text: `${issue.title}. Scoped for the ${issue.project ? `**${issue.project.name}**` : 'component library'} work — implementation notes below.`,
   };

   const variants: ContentBlock[][] = [
      [
         intro,
         {
            type: 'checklist',
            items: [
               { text: 'Align on the API surface in the team channel', checked: seed % 2 === 0 },
               { text: 'Implementation + unit tests', checked: false },
               { text: 'Docs page updated with an example', checked: false },
            ],
         },
      ],
      [
         intro,
         {
            type: 'bullet-list',
            items: [
               'Keep the public API backward compatible',
               'No new runtime dependency',
               'Follow the existing Tailwind token conventions',
            ],
         },
         {
            type: 'paragraph',
            text: 'Edge cases and browser quirks should be captured as test cases before closing.',
         },
      ],
      [
         { type: 'heading', text: 'Context' },
         intro,
         { type: 'heading', text: 'Plan' },
         {
            type: 'numbered-list',
            items: [
               'Spike and validate the approach on the docs demo',
               'Implement behind the existing component API',
               'Review with design before merging',
            ],
         },
      ],
      [
         intro,
         {
            type: 'quote',
            text: 'Small, composable primitives beat configurable monoliths.',
            author: 'library design principles',
         },
         {
            type: 'paragraph',
            text: 'Ping the maintainers before changing anything exported from the package root.',
         },
      ],
   ];

   const activity: ActivityItem[] = [
      {
         kind: 'event',
         id: `${issue.id}-created`,
         actor: reporter,
         event: 'created',
         text: 'created the issue',
         timeAgo: `${(seed % 12) + 2}d ago`,
      },
   ];

   if (issue.cycleId !== '') {
      activity.push({
         kind: 'event',
         id: `${issue.id}-cycle`,
         actor: reporter,
         event: 'cycle',
         text: `added issue to Cycle ${issue.cycleId}`,
         timeAgo: `${(seed % 10) + 1}d ago`,
      });
   }

   if (issue.status.category === 'started' || issue.status.category === 'completed') {
      activity.push({
         kind: 'event',
         id: `${issue.id}-status`,
         actor: author,
         event: 'status',
         text: `moved from Todo to ${issue.status.name}`,
         timeAgo: `${(seed % 6) + 1}d ago`,
      });
   }

   if (seed % 3 === 0) {
      activity.push({
         kind: 'comment',
         id: `${issue.id}-comment`,
         actor: users[(seed + 3) % users.length],
         timeAgo: `${(seed % 4) + 1}d ago`,
         body: [
            {
               type: 'paragraph',
               text: 'Taking a look this week — will post findings here before opening a PR.',
            },
         ],
      });
   }

   return {
      identifier: issue.identifier,
      description: variants[seed % variants.length],
      activity,
   };
};

/* -------------------------------------------------------------------------- */
/*                                   Access                                   */
/* -------------------------------------------------------------------------- */

const detailByIdentifier = new Map(details.map((detail) => [detail.identifier, detail]));

export function getIssueDetail(issue: Issue): IssueDetail {
   return detailByIdentifier.get(issue.identifier) ?? buildFallbackDetail(issue);
}
