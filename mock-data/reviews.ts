/**
 * Mock data of the Reviews feature (Linear-style PR reviews): list tabs
 * ("For you" / "Created"), and per-review Overview / Guide / Diff content.
 * Everything is fake and deterministic, on the LNDev UI storyline; the
 * `resolves` identifiers reference real issues from mock-data/issues.ts.
 */

export type ReviewStatus = 'merged' | 'closed';
export type ReviewList = 'for-you' | 'created';

export type ReviewFileCategory = 'implementation' | 'tests';

export interface ReviewFileStat {
   name: string;
   path: string;
   additions: number;
   deletions: number;
   category: ReviewFileCategory;
}

export interface ReviewCommit {
   sha: string;
   message: string;
   timeAgo: string;
}

export interface DiffLine {
   type: 'context' | 'add' | 'del' | 'skip';
   /** New-file line number (omitted for del/skip). */
   number?: number;
   text?: string;
   /** For 'skip': how many unchanged lines are collapsed. */
   count?: number;
}

export interface FileDiff {
   name: string;
   path: string;
   additions: number;
   deletions: number;
   lines: DiffLine[];
}

export interface GuideSection {
   title: string;
   paragraphs: string[];
   /** File name shown as chips under the prose (stat = "+n -m"). */
   fileRefs: { name: string; path: string; stat: string }[];
   /** Which file diff to show next to the section. */
   diffName: string;
}

export interface ReviewVerdictRow {
   review: string;
   verdict: string;
   critical: string;
   high: string;
   medium: string;
}

export interface ReviewNote {
   author: string;
   timeAgo: string;
   verdictLine: string;
   profileLine: string;
   rows: ReviewVerdictRow[];
   footer?: string;
}

export interface Review {
   /** URL slug. */
   id: string;
   title: string;
   status: ReviewStatus;
   list: ReviewList;
   timeAgo: string;
   repo: string;
   prNumber: number;
   targetBranch: string;
   sourceBranch: string;
   additions: number;
   deletions: number;
   /** Issue this PR resolves (real identifier from mock-data/issues.ts). */
   resolves: { identifier: string; title: string };
   checksPassed: number;
   checksTotal: number;
   files: ReviewFileStat[];
   commits: ReviewCommit[];
   /** Description "Summary" bullets — `inline code` supported via backticks. */
   summary: string[];
   testPlan: { text: string; checked: boolean }[];
   deployment?: { project: string; state: string; action: string };
   reviewNote?: ReviewNote;
}

/* -------------------------------------------------------------------------- */
/*                                   Seeds                                    */
/* -------------------------------------------------------------------------- */

type FileSeed = [name: string, path: string, add: number, del: number, cat: ReviewFileCategory];

interface ReviewSeed {
   id: string;
   title: string;
   status: ReviewStatus;
   list: ReviewList;
   timeAgo: string;
   prNumber: number;
   branch: string;
   resolves: [string, string];
   files: FileSeed[];
   commits: [string, string, string][];
   summary: string[];
   testPlan: [string, boolean][];
}

const seeds: ReviewSeed[] = [
   /* ------------------------------- For you ------------------------------- */
   {
      id: 'fix-sheet-header-truncation-with-long-titles',
      title: 'fix(sheet): header truncation with long titles [LNUI-903]',
      status: 'merged',
      list: 'for-you',
      timeAgo: '1h',
      prNumber: 412,
      branch: 'fix/lnui-903-sheet-header-truncation',
      resolves: ['LNUI-903', 'Fix Sheet header truncation with long titles'],
      files: [
         ['sheet.tsx', 'components/ui/sheet', 31, 6, 'implementation'],
         ['sheet-header.tsx', 'components/ui/sheet', 12, 2, 'implementation'],
         ['use-truncate.ts', 'hooks', 9, 0, 'implementation'],
         ['sheet.test.tsx', 'components/ui/__tests__', 44, 0, 'tests'],
         ['use-truncate.test.ts', 'hooks/__tests__', 21, 0, 'tests'],
      ],
      commits: [
         ['4c19ae2', 'fix(sheet): clamp the header title to two lines', '1h ago'],
         ['b02d7f1', 'feat(hooks): extract a reusable useTruncate hook', '1h ago'],
         ['9e441cc', 'fix(sheet): review round — keep the close button reachable', '1h ago'],
      ],
      summary: [
         'Bug: a Sheet with a long title pushed the close button out of the header — the title had no `min-width: 0` in the flex row, so the header overflowed instead of truncating.',
         'Root cause: `SheetHeader` laid out title and actions with `flex` but never constrained the title column. Truncation classes on the title had no effect because the flex item could grow past the container.',
         'Fix: the title cell is now `min-w-0` with a two-line clamp (`line-clamp-2`), and a new `useTruncate` hook exposes whether the text is actually clamped so the full title can be shown in a tooltip. Covers dialogs, side sheets and the mobile bottom sheet.',
      ],
      testPlan: [
         ['`sheet.test.tsx`: long titles clamp to two lines, close button stays visible', true],
         ['`use-truncate.test.ts`: reports clamped state on overflow and resize', true],
         ['Full suite: 148 files / 1 912 tests pass, `tsc --noEmit` clean', true],
      ],
   },
   {
      id: 'fix-dialog-title-id-collision-with-multiple-instances',
      title: 'fix(dialog): title id collision with multiple instances [LNUI-909]',
      status: 'merged',
      list: 'for-you',
      timeAgo: '6h',
      prNumber: 409,
      branch: 'fix/lnui-909-dialog-title-id',
      resolves: ['LNUI-909', 'Fix Dialog title id collision with multiple instances'],
      files: [
         ['dialog.tsx', 'components/ui/dialog', 18, 9, 'implementation'],
         ['use-stable-id.ts', 'hooks', 14, 0, 'implementation'],
         ['dialog.test.tsx', 'components/ui/__tests__', 37, 3, 'tests'],
      ],
      commits: [
         ['77aa310', 'fix(dialog): derive the title id from useId', '6h ago'],
         ['d1905be', 'test(dialog): two dialogs mounted at once keep distinct ids', '6h ago'],
      ],
      summary: [
         'Two dialogs mounted at the same time shared the hard-coded `dialog-title` id, so screen readers announced the wrong title for the second instance.',
         'The id is now derived from React `useId` through a small `useStableId` hook, keeping SSR and client ids in sync.',
         '`aria-labelledby` and `aria-describedby` always point at the ids of their own instance.',
      ],
      testPlan: [
         ['`dialog.test.tsx`: two mounted dialogs expose distinct title ids', true],
         ['Axe audit on the docs dialog page: 0 violations', true],
      ],
   },
   {
      id: 'feat-pagination-compound-component-api',
      title: 'feat(pagination): compound component API [LNUI-622]',
      status: 'merged',
      list: 'for-you',
      timeAgo: '7h',
      prNumber: 405,
      branch: 'feat/lnui-622-pagination-compound',
      resolves: ['LNUI-622', 'Ship Pagination compound component'],
      files: [
         ['pagination.tsx', 'components/ui/pagination', 96, 0, 'implementation'],
         ['use-pagination-range.ts', 'hooks', 38, 0, 'implementation'],
         ['pagination.test.tsx', 'components/ui/__tests__', 58, 0, 'tests'],
         ['pagination.stories.tsx', 'stories', 27, 0, 'tests'],
      ],
      commits: [
         ['ab8c1f0', 'feat(pagination): root, item, ellipsis and nav sub-components', '7h ago'],
         ['3f0de52', 'feat(hooks): windowed page ranges with boundaries', '7h ago'],
      ],
      summary: [
         'New `Pagination` compound component: `Pagination.Root`, `.Item`, `.Previous`, `.Next` and `.Ellipsis`, styled with the existing button recipes.',
         'A `usePaginationRange` hook computes the windowed page list (boundary + sibling counts) so the markup stays fully controlled by the consumer.',
         'Keyboard and screen-reader behaviour follows the WAI-ARIA pagination pattern (`nav` landmark + `aria-current="page"`).',
      ],
      testPlan: [
         ['`pagination.test.tsx`: range windows, boundaries and aria attributes', true],
         ['Storybook: default, compact and controlled examples', true],
      ],
   },
   {
      id: 'feat-docs-search-by-prop-name-and-enum-values',
      title: 'feat(docs): search by prop name and enum values [LNUI-911]',
      status: 'merged',
      list: 'for-you',
      timeAgo: '1d',
      prNumber: 398,
      branch: 'feat/lnui-911-docs-prop-search',
      resolves: ['LNUI-911', 'Search docs by prop name and enum values'],
      files: [
         ['search-index.ts', 'docs/lib', 52, 11, 'implementation'],
         ['prop-table.tsx', 'docs/components', 24, 5, 'implementation'],
         ['search-index.test.ts', 'docs/lib/__tests__', 40, 0, 'tests'],
      ],
      commits: [
         ['58e2b91', 'feat(docs): index prop names and enum values', '1d ago'],
         ['c4417ad', 'feat(docs): deep-link search hits to the prop row', '1d ago'],
      ],
      summary: [
         'The docs search index now includes every component prop name and enum value, so searching `sideOffset` or `"destructive"` lands on the right API table.',
         'Search hits deep-link to the exact prop row (scroll + highlight) instead of the top of the page.',
         'The index is built at compile time from the same TypeScript definitions that power the prop tables — no manual sync.',
      ],
      testPlan: [
         ['`search-index.test.ts`: props, enums and aliases are indexed', true],
         ['Manual: `sideOffset`, `variant`, `"ghost"` land on the expected rows', true],
      ],
   },
   /* ------------------------------- Created ------------------------------- */
   {
      id: 'fix-slider-keyboard-step-with-fractional-precision',
      title: 'fix(slider): keyboard step with fractional precision [LNUI-900]',
      status: 'merged',
      list: 'created',
      timeAgo: '2h',
      prNumber: 411,
      branch: 'fix/lnui-900-slider-fractional-step',
      resolves: ['LNUI-900', 'Fix Slider keyboard step with fractional precision'],
      files: [
         ['slider.tsx', 'components/ui/slider', 22, 8, 'implementation'],
         ['decimal.ts', 'lib', 16, 0, 'implementation'],
         ['slider.test.tsx', 'components/ui/__tests__', 33, 0, 'tests'],
      ],
      commits: [
         ['91b3e07', 'fix(slider): round keyboard steps to the step precision', '2h ago'],
         ['12c88d4', 'feat(lib): decimal-safe add/clamp helpers', '2h ago'],
      ],
      summary: [
         'Arrow keys on a slider with `step={0.1}` accumulated floating point noise (`0.30000000000000004`) after a few presses.',
         'Steps are now applied with decimal-safe helpers that round to the precision of the `step` prop.',
         'The same helpers clamp `min`/`max` so the thumb can always reach both boundaries exactly.',
      ],
      testPlan: [
         ['`slider.test.tsx`: 0.1 steps stay exact across 100 presses', true],
         ['`decimal.test.ts` covered by lib suite', true],
      ],
   },
   {
      id: 'fix-dropdown-checkbox-item-icon-alignment-in-rtl',
      title: 'fix(dropdown): checkbox item icon alignment in RTL [LNUI-901]',
      status: 'merged',
      list: 'created',
      timeAgo: '6h',
      prNumber: 408,
      branch: 'fix/lnui-901-dropdown-rtl',
      resolves: ['LNUI-901', 'Dropdown: checkbox item icon alignment in RTL'],
      files: [
         ['dropdown-menu.tsx', 'components/ui/dropdown-menu', 14, 7, 'implementation'],
         ['dropdown-menu.test.tsx', 'components/ui/__tests__', 19, 0, 'tests'],
      ],
      commits: [['6d02c11', 'fix(dropdown): logical padding for checkbox items', '6h ago']],
      summary: [
         'Checkbox and radio dropdown items used physical `padding-left`, so the check indicator overlapped the label in RTL locales.',
         'Paddings and the indicator slot now use logical properties (`padding-inline-start`, `inset-inline-start`).',
      ],
      testPlan: [['`dropdown-menu.test.tsx`: indicator position under `dir="rtl"`', true]],
   },
   {
      id: 'feat-theme-reduce-hydration-payload-of-the-theme-script',
      title: 'feat(theme): reduce hydration payload of the theme script [LNUI-905]',
      status: 'merged',
      list: 'created',
      timeAgo: '1d',
      prNumber: 402,
      branch: 'feat/lnui-905-theme-script-payload',
      resolves: ['LNUI-905', 'Reduce the hydration payload of the theme script by inlining'],
      files: [
         ['theme-script.ts', 'lib/theme', 28, 41, 'implementation'],
         ['theme-provider.tsx', 'components/layout', 9, 12, 'implementation'],
         ['theme-script.test.ts', 'lib/theme/__tests__', 26, 0, 'tests'],
      ],
      commits: [
         ['e77f21a', 'feat(theme): inline a minified bootstrap script', '1d ago'],
         ['0b1349c', 'chore(theme): drop the runtime storage listener', '1d ago'],
      ],
      summary: [
         'The theme bootstrap is now a 312-byte inlined script instead of a hydrated component — no flash of the wrong theme and ~4 KB less JavaScript on first load.',
         'The script only reads `localStorage` once; cross-tab sync moved to a lazy listener attached after hydration.',
      ],
      testPlan: [
         ['`theme-script.test.ts`: system/light/dark resolution matrix', true],
         ['Lighthouse: TBT unchanged, LCP -80 ms on the docs home', true],
      ],
   },
   {
      id: 'fix-calendar-disabled-matcher-for-date-ranges',
      title: 'fix(calendar): disabled matcher for date ranges [LNUI-906]',
      status: 'merged',
      list: 'created',
      timeAgo: '4d',
      prNumber: 396,
      branch: 'fix/lnui-906-calendar-disabled-ranges',
      resolves: ['LNUI-906', 'Fix Calendar disabled matcher for date ranges'],
      files: [
         ['calendar.tsx', 'components/ui/calendar', 17, 10, 'implementation'],
         ['date-matchers.ts', 'lib', 21, 4, 'implementation'],
         ['calendar.test.tsx', 'components/ui/__tests__', 29, 0, 'tests'],
      ],
      commits: [['a3c90d8', 'fix(calendar): inclusive range bounds in disabled matchers', '4d ago']],
      summary: [
         'A `disabled={{ from, to }}` matcher excluded its `to` day because the comparison used exclusive bounds after the timezone normalization.',
         'Range matchers are now normalized to start-of-day in the calendar timezone and compared inclusively.',
      ],
      testPlan: [['`calendar.test.tsx`: from/to boundaries disabled across DST', true]],
   },
   {
      id: 'feat-tabs-home-and-end-keys-jump-to-first-and-last-tab',
      title: 'feat(tabs): Home and End keys jump to first and last tab [LNUI-908]',
      status: 'merged',
      list: 'created',
      timeAgo: '4d',
      prNumber: 395,
      branch: 'feat/lnui-908-tabs-home-end',
      resolves: ['LNUI-908', 'Tabs: Home and End keys jump to the first and last tab'],
      files: [
         ['tabs.tsx', 'components/ui/tabs', 15, 3, 'implementation'],
         ['tabs.test.tsx', 'components/ui/__tests__', 22, 0, 'tests'],
      ],
      commits: [['f5510b9', 'feat(tabs): Home/End roving focus', '4d ago']],
      summary: [
         '`Home` and `End` now move focus (and selection, in automatic mode) to the first and last enabled tab, matching the WAI-ARIA tabs pattern.',
         'Disabled tabs are skipped in both directions.',
      ],
      testPlan: [['`tabs.test.tsx`: Home/End with disabled boundaries', true]],
   },
   {
      id: 'fix-command-escape-closes-nested-pages-before-the-dialog',
      title: 'fix(command): Escape closes nested pages before the dialog [LNUI-910]',
      status: 'merged',
      list: 'created',
      timeAgo: '5d',
      prNumber: 392,
      branch: 'fix/lnui-910-command-escape',
      resolves: ['LNUI-910', 'Command menu: Escape closes nested pages before the dialog'],
      files: [
         ['command.tsx', 'components/ui/command', 19, 6, 'implementation'],
         ['command.test.tsx', 'components/ui/__tests__', 25, 0, 'tests'],
      ],
      commits: [['08d4b72', 'fix(command): pop the page stack on Escape', '5d ago']],
      summary: [
         'Pressing Escape inside a nested command page closed the whole palette instead of going back one level.',
         'Escape now pops the page stack first and only closes the dialog from the root page; `stopPropagation` keeps outer dialogs open.',
      ],
      testPlan: [['`command.test.tsx`: nested page → root → close sequence', true]],
   },
   {
      id: 'feat-skeleton-match-the-line-height-rhythm-of-text-presets',
      title: 'feat(skeleton): match the line-height rhythm of Text presets [LNUI-907]',
      status: 'merged',
      list: 'created',
      timeAgo: '1w',
      prNumber: 388,
      branch: 'feat/lnui-907-skeleton-rhythm',
      resolves: ['LNUI-907', 'Skeleton: match the line-height rhythm of Text presets'],
      files: [
         ['skeleton.tsx', 'components/ui/skeleton', 26, 9, 'implementation'],
         ['skeleton.stories.tsx', 'stories', 18, 0, 'tests'],
      ],
      commits: [['b99d0c3', 'feat(skeleton): text-preset aware line skeletons', '1w ago']],
      summary: [
         '`Skeleton.Text` accepts the same `preset` prop as `Text` and renders bars whose height and gap match the real line boxes — no layout shift when content arrives.',
         'The last line is shortened to 60% by default to read as a paragraph.',
      ],
      testPlan: [['Storybook: side-by-side skeleton vs loaded text, zero shift', true]],
   },
   {
      id: 'fix-accordion-animate-height-with-css-grid-rows',
      title: 'fix(accordion): animate height with CSS grid rows [LNUI-560]',
      status: 'merged',
      list: 'created',
      timeAgo: '1w',
      prNumber: 386,
      branch: 'fix/lnui-560-accordion-grid-rows',
      resolves: [
         'LNUI-560',
         'Accordion: animate height with CSS grid rows instead of max-height',
      ],
      files: [
         ['accordion.tsx', 'components/ui/accordion', 12, 18, 'implementation'],
         ['accordion.test.tsx', 'components/ui/__tests__', 16, 2, 'tests'],
      ],
      commits: [['2ac77e5', 'fix(accordion): grid-template-rows transition', '1w ago']],
      summary: [
         'The open/close animation used a hard-coded `max-height`, which clipped tall content and eased incorrectly for short content.',
         'The content now animates `grid-template-rows: 0fr → 1fr`, which tracks the real height for free and removes the magic number.',
      ],
      testPlan: [['`accordion.test.tsx`: tall content is not clipped when open', true]],
   },
   {
      id: 'do-not-merge-chore-preview-design-tokens-dry-run',
      title: '[DO NOT MERGE] chore(preview): design tokens dry run — staging link',
      status: 'closed',
      list: 'created',
      timeAgo: '12d',
      prNumber: 371,
      branch: 'chore/preview-design-tokens-dry-run',
      resolves: ['LNUI-807', 'High-contrast theme preset'],
      files: [
         ['tokens.css', 'app', 210, 0, 'implementation'],
         ['tokens-preview.tsx', 'docs/components', 44, 0, 'implementation'],
      ],
      commits: [['5f3310a', 'chore(preview): generate the token sheet for review', '12d ago']],
      summary: [
         'Throwaway branch to preview the generated high-contrast token sheet on staging — opened only to get a deploy link for the design review.',
         'Closed without merging once the review was done; the real work lands with LNUI-807.',
      ],
      testPlan: [['Preview deployment only — not meant to land', false]],
   },
];

/* -------------------------------------------------------------------------- */
/*                        Deterministic detail expansion                      */
/* -------------------------------------------------------------------------- */

const seedNumber = (value: string): number =>
   value.split('').reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) % 9973, 11);

/** Deterministic, plausible-looking TypeScript diff for a file. */
export function getReviewFileDiff(review: Review, file: ReviewFileStat): FileDiff {
   const seed = seedNumber(review.id + file.name);
   const base = file.name.replace(/\.(test|stories)?\.?(tsx?|css)$/, '');
   const camel = base.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
   const isTest = file.category === 'tests';
   const lines: DiffLine[] = [];
   let n = 1;
   const push = (type: DiffLine['type'], text: string) => {
      lines.push({ type, number: type === 'del' ? undefined : n, text });
      if (type !== 'del') n += 1;
   };

   const pascal = camel[0].toUpperCase() + camel.slice(1);
   const isHook = base.startsWith('use-');
   /** Function name of the file (hooks keep their camelCase name). */
   const fn = isHook ? camel : pascal;
   const stateHook = isHook ? `${camel}State` : `use${pascal}State`;

   if (isTest) {
      push('context', "import { describe, expect, it } from 'vitest';");
      push('context', "import { render, screen } from '@testing-library/react';");
      push('add', `import { ${fn} } from '../${base}';`);
      push('context', '');
      push('context', `describe('${fn}', () => {`);
      push('add', `   it('${review.summary[0]?.slice(0, 48).toLowerCase().replace(/[`'".]/g, '')}…', () => {`);
      push('add', `      render(<${fn} />);`);
      push('add', `      expect(screen.getByRole('${seed % 2 ? 'dialog' : 'button'}')).toBeInTheDocument();`);
      push('add', '   });');
      push('add', '');
      push('add', `   it('keeps the previous behaviour for the default props', () => {`);
      push('add', `      const { container } = render(<${fn} />);`);
      push('add', '      expect(container.firstChild).toMatchSnapshot();');
      push('add', '   });');
      push('context', '});');
      lines.push({ type: 'skip', count: 18 + (seed % 30) });
   } else {
      push('context', "'use client';");
      push('context', '');
      push('context', "import { cn } from '@/lib/utils';");
      push('add', `import { ${stateHook} } from './${isHook ? base : `use-${base}`}-state';`);
      push('context', '');
      push('context', `export function ${fn}(props: ${pascal}Props) {`);
      push('del', '   const state = legacyState(props);');
      push('add', `   const state = ${stateHook}(props);`);
      push('context', '');
      push('add', '   // The measured size tracks the content box, so nested scroll');
      push('add', '   // containers no longer report a stale height on first paint.');
      push('add', `   const measured = state.measure({ clamp: ${seed % 2 ? 'true' : 'false'} });`);
      push('context', '');
      push('context', '   return (');
      push('add', `      <div className={cn('relative min-w-0', props.className)} data-slot="${base}">`);
      push('context', '         {props.children}');
      push('context', '      </div>');
      push('context', '   );');
      push('context', '}');
      lines.push({ type: 'skip', count: 24 + (seed % 40) });
   }

   return {
      name: file.name,
      path: file.path,
      additions: file.additions,
      deletions: file.deletions,
      lines,
   };
}

/** Guide sections: one per implementation file (max 2), prose from the summary. */
export function getReviewGuide(review: Review): GuideSection[] {
   const implementation = review.files.filter((file) => file.category === 'implementation');
   const sections = implementation.slice(0, 2).map((file, index) => {
      const others = review.files.filter((candidate) => candidate !== file).slice(0, 3);
      return {
         title:
            index === 0
               ? review.summary[0]?.split(/[—.:]/)[0].replace(/^Bug/, 'Fixing the bug') ??
                 review.title
               : `Wiring ${file.name}`,
         paragraphs: [
            review.summary[index] ?? review.summary[0] ?? '',
            review.summary[index + 1] ?? 'The change is covered by the tests listed below.',
         ],
         fileRefs: [
            {
               name: file.name,
               path: file.path,
               stat: `+${file.additions}${file.deletions ? ` -${file.deletions}` : ''}`,
            },
            ...others.map((other) => ({
               name: other.name,
               path: other.path,
               stat: `+${other.additions}${other.deletions ? ` -${other.deletions}` : ''}`,
            })),
         ],
         diffName: file.name,
      };
   });
   return sections;
}

/* -------------------------------------------------------------------------- */
/*                                  Reviews                                   */
/* -------------------------------------------------------------------------- */

export const reviews: Review[] = seeds.map((seed) => ({
   id: seed.id,
   title: seed.title,
   status: seed.status,
   list: seed.list,
   timeAgo: seed.timeAgo,
   repo: 'lndev-ui',
   prNumber: seed.prNumber,
   targetBranch: 'main',
   sourceBranch: seed.branch,
   additions: seed.files.reduce((acc, file) => acc + file[2], 0),
   deletions: seed.files.reduce((acc, file) => acc + file[3], 0),
   resolves: { identifier: seed.resolves[0], title: seed.resolves[1] },
   checksPassed: seed.status === 'closed' ? 2 : 4,
   checksTotal: 5,
   files: seed.files.map(([name, path, additions, deletions, category]) => ({
      name,
      path,
      additions,
      deletions,
      category,
   })),
   commits: seed.commits.map(([sha, message, timeAgo]) => ({ sha, message, timeAgo })),
   summary: seed.summary,
   testPlan: seed.testPlan.map(([text, checked]) => ({ text, checked })),
   deployment:
      seed.status === 'merged'
         ? { project: 'lndev-ui-docs', state: 'Ready', action: 'Preview' }
         : { project: 'lndev-ui-docs', state: 'Skipped', action: 'Preview' },
   reviewNote:
      seed.list === 'for-you'
         ? {
              author: 'Atlas',
              timeAgo: seed.timeAgo === '1h' ? '55min ago' : seed.timeAgo + ' ago',
              verdictLine:
                 '✅ GO — All selected reviews passed (0 critical, 0 high). The architecture HIGH was fixed in-branch and re-verified by mutation testing.',
              profileLine:
                 'Profile computed on the real diff (dev-flow Phase 4.5): logic + performance + architecture. Security skipped (no auth surface — UI rendering only).',
              rows: [
                 {
                    review: 'Logic',
                    verdict: '✅ PASS',
                    critical: '0',
                    high: '0',
                    medium: '2 (1 fixed, 1 deferred)',
                 },
                 {
                    review: 'Performance',
                    verdict: '✅ PASS',
                    critical: '0',
                    high: '0',
                    medium: '1 (pre-existing, deferred)',
                 },
                 {
                    review: 'Architecture',
                    verdict: '✅ PASS (was BLOCKED, fixed)',
                    critical: '0',
                    high: '0 → fixed',
                    medium: '2 (deferred)',
                 },
                 { review: 'Security', verdict: '⏭️ SKIPPED', critical: '—', high: '—', medium: '—' },
              ],
              footer: 'Fixed post-review: the flex column constraint is now asserted by a test — a regression would fail loudly instead of clipping silently.',
           }
         : undefined,
}));

export const forYouReviews = reviews.filter((review) => review.list === 'for-you');
export const createdReviews = reviews.filter((review) => review.list === 'created');

export function getReviewById(id: string): Review | undefined {
   return reviews.find((review) => review.id === id);
}
