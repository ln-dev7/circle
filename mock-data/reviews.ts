/**
 * Mock data of the Reviews feature (Linear-style PR reviews): list tabs
 * ("For you" / "Created"), and per-review Overview / Guide / Diff content.
 * Everything is fake and deterministic, on the LNDev UI storyline; the
 * `resolves` identifiers reference real issues from mock-data/issues.ts.
 */

export type ReviewStatus = 'open' | 'merged' | 'closed';
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
   {
      id: 'feat-combobox-multi-select-chips-inside-the-trigger',
      title: 'feat(combobox): multi-select chips inside the trigger [LNUI-920]',
      status: 'open',
      list: 'for-you',
      timeAgo: '30m',
      prNumber: 415,
      branch: 'feat/lnui-920-combobox-chips',
      resolves: ['LNUI-920', 'Combobox: multi-select chips inside the trigger'],
      files: [
         ['combobox.tsx', 'components/ui/combobox', 74, 18, 'implementation'],
         ['chip-list.tsx', 'components/ui/combobox', 42, 0, 'implementation'],
         ['use-chip-overflow.ts', 'hooks', 27, 0, 'implementation'],
         ['combobox.test.tsx', 'components/ui/__tests__', 51, 4, 'tests'],
      ],
      commits: [
         ['7be4a90', 'feat(combobox): render selected values as removable chips', '30m ago'],
         ['c53f1d8', 'feat(combobox): +n overflow counter with a measured chip row', '28m ago'],
      ],
      summary: [
         'Multi-select comboboxes now render their selection as removable chips inside the trigger instead of a joined string.',
         'A `useChipOverflow` hook measures the row and collapses extra chips behind a `+n` counter so the trigger height never grows.',
         'Backspace with an empty input removes the last chip, matching the pattern users know from mail clients.',
      ],
      testPlan: [
         ['`combobox.test.tsx`: chip add/remove, overflow counter, Backspace behaviour', true],
         ['Manual: keyboard-only selection with VoiceOver enabled', false],
      ],
   },
   {
      id: 'feat-form-async-validators-with-debounce-and-abort',
      title: 'feat(form): async validators with debounce and abort [LNUI-777]',
      status: 'open',
      list: 'for-you',
      timeAgo: '45m',
      prNumber: 414,
      branch: 'feat/lnui-777-async-validators',
      resolves: ['LNUI-777', 'Form: async validators with debounce and abort'],
      files: [
         ['form.tsx', 'components/ui/form', 39, 11, 'implementation'],
         ['use-async-validator.ts', 'hooks', 58, 0, 'implementation'],
         ['use-async-validator.test.ts', 'hooks/__tests__', 63, 0, 'tests'],
      ],
      commits: [
         ['91d70aa', 'feat(form): async validator slot on the field wrapper', '45m ago'],
         ['0ce82b7', 'feat(hooks): debounced validation with AbortController', '40m ago'],
      ],
      summary: [
         'Fields accept an async `validate` function; runs are debounced (300 ms default) and stale runs are cancelled with an `AbortController`.',
         'The field exposes a `validating` state so consumers can render a spinner without wiring their own tracking.',
         'Rejections resolve to a field error unless the abort came from a newer keystroke.',
      ],
      testPlan: [
         ['`use-async-validator.test.ts`: debounce window, abort on re-entry, error mapping', true],
         ['Manual: username availability demo against a slow endpoint', false],
      ],
   },
   {
      id: 'fix-progress-label-rounding-at-99-5-percent',
      title: 'fix(progress): label rounding at 99.5 percent [LNUI-912]',
      status: 'merged',
      list: 'for-you',
      timeAgo: '1d',
      prNumber: 410,
      branch: 'fix/lnui-912-progress-rounding',
      resolves: ['LNUI-912', 'Fix Progress label rounding at 99.5 percent'],
      files: [
         ['progress.tsx', 'components/ui/progress', 12, 5, 'implementation'],
         ['format-percent.ts', 'lib', 14, 0, 'implementation'],
         ['progress.test.tsx', 'components/ui/__tests__', 24, 0, 'tests'],
      ],
      commits: [
         ['5da11f3', 'fix(progress): floor the label until the value really completes', '1d ago'],
      ],
      summary: [
         '`Math.round` displayed “100%” from 99.5 upwards while the bar was still short of the end — the label lied for long uploads.',
         'The label now floors values below 100 and only shows “100%” when the value actually reaches the max.',
      ],
      testPlan: [['`progress.test.tsx`: 99.4 → 99%, 99.9 → 99%, 100 → 100%', true]],
   },
   {
      id: 'feat-spinner-size-and-stroke-tokens',
      title: 'feat(spinner): size and stroke tokens [LNUI-914]',
      status: 'merged',
      list: 'for-you',
      timeAgo: '2d',
      prNumber: 413,
      branch: 'feat/lnui-914-spinner-tokens',
      resolves: ['LNUI-914', 'Ship Spinner with size and stroke tokens'],
      files: [
         ['spinner.tsx', 'components/ui/spinner', 46, 0, 'implementation'],
         ['tokens.css', 'app', 9, 0, 'implementation'],
         ['spinner.stories.tsx', 'stories', 19, 0, 'tests'],
      ],
      commits: [
         ['e04c6b1', 'feat(spinner): svg spinner driven by size/stroke tokens', '2d ago'],
         ['b7f309e', 'docs(spinner): sizing and reduced-motion notes', '2d ago'],
      ],
      summary: [
         'New `Spinner` component sized by tokens (`--spinner-size-*`, `--spinner-stroke-*`) so buttons, inputs and empty states stay visually consistent.',
         'Respects `prefers-reduced-motion` by swapping the rotation for a subtle opacity pulse.',
      ],
      testPlan: [
         ['Storybook: sm/md/lg matrix in light and dark', true],
         ['Manual: reduced-motion fallback in system settings', true],
      ],
   },
   {
      id: 'feat-dialog-inert-background-instead-of-aria-hidden',
      title: 'feat(dialog): inert background instead of the aria-hidden walker [LNUI-780]',
      status: 'merged',
      list: 'for-you',
      timeAgo: '2d',
      prNumber: 407,
      branch: 'feat/lnui-780-dialog-inert',
      resolves: ['LNUI-780', 'Dialog: inert background instead of the aria-hidden walker'],
      files: [
         ['dialog.tsx', 'components/ui/dialog', 21, 34, 'implementation'],
         ['use-inert-others.ts', 'hooks', 32, 0, 'implementation'],
         ['dialog.test.tsx', 'components/ui/__tests__', 28, 6, 'tests'],
      ],
      commits: [
         ['a19c44d', 'feat(dialog): mark siblings inert while a dialog is open', '2d ago'],
         ['4f80b23', 'chore(dialog): delete the recursive aria-hidden walker', '2d ago'],
      ],
      summary: [
         'The open dialog used to walk the DOM and stamp `aria-hidden` on every sibling — slow on large pages and easy to leave stale on unmount.',
         'Background subtrees are now marked with the native `inert` attribute via a `useInertOthers` hook, which also blocks focus and clicks for free.',
         'The walker and its cleanup bookkeeping are deleted: −34 lines of tricky code.',
      ],
      testPlan: [
         [
            '`dialog.test.tsx`: background focusables unreachable while open, restored on close',
            true,
         ],
         ['Axe audit on nested dialog demos: 0 violations', true],
      ],
   },
   {
      id: 'fix-combobox-popover-width-in-grid-cells',
      title: 'fix(combobox): popover width when the trigger sits in a grid cell [LNUI-796]',
      status: 'merged',
      list: 'for-you',
      timeAgo: '3d',
      prNumber: 406,
      branch: 'fix/lnui-796-combobox-popover-width',
      resolves: ['LNUI-796', 'Fix Combobox popover width when the trigger sits in a grid cell'],
      files: [
         ['combobox.tsx', 'components/ui/combobox', 11, 6, 'implementation'],
         ['combobox.test.tsx', 'components/ui/__tests__', 17, 0, 'tests'],
      ],
      commits: [
         ['2c96e07', 'fix(combobox): measure the trigger box, not the grid track', '3d ago'],
      ],
      summary: [
         'Inside a CSS grid cell the popover matched the grid track width instead of the trigger, producing a list wider than its input.',
         'The popover now reads `--radix-popper-anchor-width` from the measured trigger box, so intrinsic and stretched triggers both align.',
      ],
      testPlan: [
         ['`combobox.test.tsx`: popover width equals trigger width inside a grid fixture', true],
      ],
   },
   {
      id: 'fix-toast-region-announces-politely',
      title: 'fix(toast): announce politely instead of assertively [LNUI-798]',
      status: 'merged',
      list: 'for-you',
      timeAgo: '3d',
      prNumber: 404,
      branch: 'fix/lnui-798-toast-polite',
      resolves: ['LNUI-798', 'Toast region announces politely instead of assertively'],
      files: [
         ['toast.tsx', 'components/ui/toast', 9, 7, 'implementation'],
         ['toast.test.tsx', 'components/ui/__tests__', 15, 2, 'tests'],
      ],
      commits: [['d7b5e12', 'fix(toast): default the live region to polite', '3d ago']],
      summary: [
         'Success toasts interrupted screen-reader speech mid-sentence because the live region defaulted to `assertive`.',
         'The region is now `polite` by default; only toasts flagged `urgent` (destructive failures) keep the assertive channel.',
      ],
      testPlan: [
         ['`toast.test.tsx`: aria-live values per toast intent', true],
         ['Manual: VoiceOver no longer clips the current utterance on success toasts', true],
      ],
   },
   {
      id: 'feat-button-loading-prop-with-spinner-replacement',
      title: 'feat(button): loading prop with spinner replacement [LNUI-750]',
      status: 'merged',
      list: 'for-you',
      timeAgo: '4d',
      prNumber: 403,
      branch: 'feat/lnui-750-button-loading',
      resolves: ['LNUI-750', 'Add loading prop to Button with spinner replacement'],
      files: [
         ['button.tsx', 'components/ui/button', 26, 4, 'implementation'],
         ['button.test.tsx', 'components/ui/__tests__', 31, 0, 'tests'],
         ['button.stories.tsx', 'stories', 14, 0, 'tests'],
      ],
      commits: [
         ['6e21af7', 'feat(button): loading state swaps the leading icon for a spinner', '4d ago'],
         ['98cd034', 'feat(button): keep the measured width while loading', '4d ago'],
      ],
      summary: [
         '`<Button loading>` disables interaction, swaps the leading icon for the new `Spinner` and announces busy state via `aria-busy`.',
         'The button keeps its measured width while loading so adjacent controls do not shift when the label shortens.',
      ],
      testPlan: [
         ['`button.test.tsx`: aria-busy, pointer events, width lock while loading', true],
         ['Storybook: loading matrix across variants and sizes', true],
      ],
   },
   {
      id: 'feat-avatar-fallback-gradient-from-user-id-hash',
      title: 'feat(avatar): fallback gradient derived from the user id hash [LNUI-763]',
      status: 'merged',
      list: 'for-you',
      timeAgo: '5d',
      prNumber: 401,
      branch: 'feat/lnui-763-avatar-gradient',
      resolves: ['LNUI-763', 'Avatar: fallback gradient derived from the user id hash'],
      files: [
         ['avatar.tsx', 'components/ui/avatar', 18, 3, 'implementation'],
         ['gradient-hash.ts', 'lib', 22, 0, 'implementation'],
         ['gradient-hash.test.ts', 'lib/__tests__', 20, 0, 'tests'],
      ],
      commits: [['f3d8c51', 'feat(avatar): deterministic two-stop gradient fallbacks', '5d ago']],
      summary: [
         'Fallback avatars now render a deterministic two-stop OKLCH gradient hashed from the user id instead of a flat gray circle.',
         'The hue pair is picked from a curated wheel so every generated gradient keeps ≥ 4.5:1 contrast with the white initials.',
      ],
      testPlan: [
         ['`gradient-hash.test.ts`: stable output per id, contrast floor across the wheel', true],
      ],
   },
   {
      id: 'feat-popover-opt-in-modal-mode-with-focus-containment',
      title: 'feat(popover): opt-in modal mode with focus containment [LNUI-766]',
      status: 'merged',
      list: 'for-you',
      timeAgo: '5d',
      prNumber: 400,
      branch: 'feat/lnui-766-popover-modal',
      resolves: ['LNUI-766', 'Popover: opt-in modal mode with focus containment'],
      files: [
         ['popover.tsx', 'components/ui/popover', 24, 8, 'implementation'],
         ['popover.test.tsx', 'components/ui/__tests__', 29, 0, 'tests'],
      ],
      commits: [
         ['0b64e88', 'feat(popover): modal prop traps focus and blocks outside scroll', '5d ago'],
      ],
      summary: [
         '`<Popover modal>` traps Tab focus inside the panel, blocks outside scroll and restores focus to the trigger on close.',
         'The default non-modal behaviour is untouched — the trap only mounts when the prop is set.',
      ],
      testPlan: [['`popover.test.tsx`: focus loop, scroll lock, focus restore on close', true]],
   },
   {
      id: 'feat-scroll-area-shadows-via-scroll-driven-animations',
      title: 'feat(scroll-area): scroll shadows via scroll-driven animations [LNUI-760]',
      status: 'merged',
      list: 'for-you',
      timeAgo: '6d',
      prNumber: 399,
      branch: 'feat/lnui-760-scroll-shadows',
      resolves: ['LNUI-760', 'Scroll area: scroll shadows via scroll-driven animations'],
      files: [
         ['scroll-area.tsx', 'components/ui/scroll-area', 16, 2, 'implementation'],
         ['scroll-shadows.css', 'components/ui/scroll-area', 34, 0, 'implementation'],
         ['scroll-area.stories.tsx', 'stories', 16, 0, 'tests'],
      ],
      commits: [
         ['c81f2ad', 'feat(scroll-area): CSS-only edge shadows with animation-timeline', '6d ago'],
      ],
      summary: [
         'Edge shadows now fade in and out purely in CSS with `animation-timeline: scroll()` — the JS scroll listener and its state updates are gone.',
         'Browsers without scroll-driven animations keep static shadows behind an `@supports` guard, so nothing breaks.',
      ],
      testPlan: [
         ['Storybook: shadows on both axes, nested scroll areas', true],
         ['Manual: Safari fallback renders the static variant', true],
      ],
   },
   {
      id: 'chore-replace-lodash-debounce-with-in-house-scheduler',
      title: 'chore(lib): replace lodash.debounce with an in-house scheduler [LNUI-782]',
      status: 'merged',
      list: 'for-you',
      timeAgo: '1w',
      prNumber: 397,
      branch: 'chore/lnui-782-debounce-scheduler',
      resolves: ['LNUI-782', 'Replace lodash.debounce with an in-house scheduler'],
      files: [
         ['scheduler.ts', 'lib', 41, 0, 'implementation'],
         ['use-debounced-value.ts', 'hooks', 8, 12, 'implementation'],
         ['scheduler.test.ts', 'lib/__tests__', 47, 0, 'tests'],
      ],
      commits: [
         ['33e91b0', 'feat(lib): tiny debounce/throttle scheduler with leading/trailing', '1w ago'],
         ['aa07d95', 'chore: drop the lodash.debounce dependency', '1w ago'],
      ],
      summary: [
         'A 40-line scheduler covers every debounce/throttle call site, so `lodash.debounce` (and 24 KB of transitive install weight) is gone.',
         'Timers are cleared through a shared registry, which fixes two leaks where unmounted components kept pending trailing calls alive.',
      ],
      testPlan: [
         ['`scheduler.test.ts`: leading/trailing matrix, cancel on dispose', true],
         ['Bundle check: no lodash chunk in the client graph', true],
      ],
   },
   {
      id: 'fix-button-gap-with-conditional-icon-only-child',
      title: 'fix(button): gap collapses when an icon-only child is conditional [LNUI-797]',
      status: 'merged',
      list: 'for-you',
      timeAgo: '1w',
      prNumber: 394,
      branch: 'fix/lnui-797-button-gap',
      resolves: ['LNUI-797', 'Button: gap collapses when an icon-only child is conditional'],
      files: [
         ['button.tsx', 'components/ui/button', 7, 4, 'implementation'],
         ['button.test.tsx', 'components/ui/__tests__', 13, 0, 'tests'],
      ],
      commits: [['b4a67c2', 'fix(button): gap utility instead of child margins', '1w ago']],
      summary: [
         'A conditional `{icon && <Icon />}` child rendered `false`, which kept the icon margin applied to the label and produced a lopsided button.',
         'Spacing moved from per-child margins to `gap` on the flex row, so absent children simply contribute nothing.',
      ],
      testPlan: [['`button.test.tsx`: label centered with and without the conditional icon', true]],
   },
   {
      id: 'feat-table-monospace-numeric-cell-variant',
      title: 'feat(table): monospace numeric cell variant [LNUI-761]',
      status: 'merged',
      list: 'for-you',
      timeAgo: '8d',
      prNumber: 393,
      branch: 'feat/lnui-761-table-numeric-cells',
      resolves: ['LNUI-761', 'Add a monospace numeric variant to Table cells'],
      files: [
         ['table.tsx', 'components/ui/table', 15, 2, 'implementation'],
         ['table.test.tsx', 'components/ui/__tests__', 12, 0, 'tests'],
         ['table.stories.tsx', 'stories', 11, 0, 'tests'],
      ],
      commits: [
         ['9f0b3e6', 'feat(table): numeric cells with tabular-nums and right alignment', '8d ago'],
      ],
      summary: [
         '`<Table.Cell numeric>` right-aligns content and applies `font-variant-numeric: tabular-nums` so digit columns line up.',
         'Header cells inherit the alignment from their column, keeping sort icons attached to the label.',
      ],
      testPlan: [['Storybook: pricing table where decimals align across rows', true]],
   },
   {
      id: 'feat-skip-to-content-link-helper-for-app-shells',
      title: 'feat(a11y): skip-to-content link helper for app shells [LNUI-765]',
      status: 'merged',
      list: 'for-you',
      timeAgo: '10d',
      prNumber: 391,
      branch: 'feat/lnui-765-skip-link',
      resolves: ['LNUI-765', 'Add a skip-to-content link helper for app shells'],
      files: [
         ['skip-link.tsx', 'components/layout', 29, 0, 'implementation'],
         ['skip-link.test.tsx', 'components/layout/__tests__', 18, 0, 'tests'],
      ],
      commits: [
         ['1d5c0a9', 'feat(a11y): visually hidden skip link that reveals on focus', '10d ago'],
      ],
      summary: [
         '`<SkipLink targetId>` renders a visually hidden anchor that appears on first Tab and jumps focus past the navigation chrome.',
         'The target gets a temporary `tabindex="-1"` so focus lands reliably in every browser, then cleans itself up on blur.',
      ],
      testPlan: [
         ['`skip-link.test.tsx`: revealed on focus, moves focus to the target region', true],
      ],
   },
   {
      id: 'feat-tabs-lazy-mount-panels-with-keep-mounted-opt-in',
      title: 'feat(tabs): lazy mount panels with a keepMounted opt-in [LNUI-751]',
      status: 'merged',
      list: 'for-you',
      timeAgo: '12d',
      prNumber: 390,
      branch: 'feat/lnui-751-tabs-lazy-mount',
      resolves: ['LNUI-751', 'Tabs: lazy mount panels with a keepMounted opt-in'],
      files: [
         ['tabs.tsx', 'components/ui/tabs', 23, 6, 'implementation'],
         ['tabs.test.tsx', 'components/ui/__tests__', 26, 0, 'tests'],
      ],
      commits: [
         ['74ab1c3', 'feat(tabs): mount panels on first activation only', '12d ago'],
         ['e2d9075', 'feat(tabs): keepMounted keeps state for visited panels', '12d ago'],
      ],
      summary: [
         'Panels now mount on first activation instead of all at once — heavy tab content stops paying its cost upfront.',
         '`keepMounted` keeps a visited panel in the tree (hidden) so forms and scroll positions survive tab switches.',
      ],
      testPlan: [
         ['`tabs.test.tsx`: unvisited panels absent from the DOM, visited state preserved', true],
      ],
   },
   {
      id: 'feat-toolbar-overflow-priority-api',
      title: 'feat(toolbar): overflow priority API [LNUI-916]',
      status: 'merged',
      list: 'for-you',
      timeAgo: '2w',
      prNumber: 389,
      branch: 'feat/lnui-916-toolbar-overflow',
      resolves: ['LNUI-916', 'Ship the Toolbar overflow priority API'],
      files: [
         ['toolbar.tsx', 'components/ui/toolbar', 55, 9, 'implementation'],
         ['use-overflow-priority.ts', 'hooks', 44, 0, 'implementation'],
         ['toolbar.test.tsx', 'components/ui/__tests__', 39, 0, 'tests'],
      ],
      commits: [
         ['8c33d17', 'feat(toolbar): priority-ranked collapse into the overflow menu', '2w ago'],
         ['57e9f04', 'feat(hooks): resize-observed overflow measurement', '2w ago'],
      ],
      summary: [
         'Toolbar items declare a `priority`; when space runs out the lowest priorities collapse into an overflow menu instead of wrapping.',
         'Measurement runs through a single `ResizeObserver` and applies collapse states in one batch, so narrow viewports never flicker.',
      ],
      testPlan: [
         ['`toolbar.test.tsx`: collapse order follows priority across breakpoints', true],
         ['Storybook: editor toolbar demo at 320/768/1280 px', true],
      ],
   },
   {
      id: 'chore-custom-scrollbar-styling-fallback-for-firefox',
      title: 'chore(scroll-area): custom scrollbar styling fallback for Firefox [LNUI-919]',
      status: 'closed',
      list: 'for-you',
      timeAgo: '9d',
      prNumber: 387,
      branch: 'chore/lnui-919-scrollbar-fallback',
      resolves: ['LNUI-919', 'Custom scrollbar styling fallback for Firefox'],
      files: [
         ['scroll-area.tsx', 'components/ui/scroll-area', 19, 5, 'implementation'],
         ['scrollbar-fallback.css', 'components/ui/scroll-area', 26, 0, 'implementation'],
      ],
      commits: [['41f8d02', 'chore(scroll-area): scrollbar-width/color fallback styles', '9d ago']],
      summary: [
         'Attempted a `scrollbar-width`/`scrollbar-color` fallback so Firefox users get slim themed scrollbars without the custom thumb.',
         'Closed: Firefox 133 shipped `::-webkit-scrollbar`-equivalent styling support, so the shared styles now cover it with no fallback layer.',
      ],
      testPlan: [['Superseded by native support — verified on Firefox 133 nightly', false]],
   },
   {
      id: 'chore-migrate-the-docs-playground-to-sandpack-3',
      title: 'chore(docs): migrate the playground to Sandpack 3 [LNUI-772]',
      status: 'closed',
      list: 'for-you',
      timeAgo: '2w',
      prNumber: 385,
      branch: 'chore/lnui-772-sandpack-3',
      resolves: ['LNUI-772', 'Migrate the docs playground to Sandpack 3'],
      files: [
         ['playground.tsx', 'docs/components', 48, 37, 'implementation'],
         ['sandpack-theme.ts', 'docs/lib', 22, 14, 'implementation'],
         ['playground.test.tsx', 'docs/components/__tests__', 20, 8, 'tests'],
      ],
      commits: [
         ['66e0b21', 'chore(docs): bump sandpack-react to v3 and adapt the theme API', '2w ago'],
         ['09fd7c8', 'fix(docs): pin the bundler URL for the new sandpack runtime', '2w ago'],
      ],
      summary: [
         'Upgraded the docs playground to Sandpack 3 for the faster esbuild-based bundler and the new file-tabs API.',
         'Closed without merging: v3.0.2 regressed HMR for CSS modules in the embedded preview — reopening once the upstream fix lands.',
      ],
      testPlan: [['Blocked on upstream — HMR regression reproduced in the demo app', false]],
   },
   {
      id: 'experiment-inline-critical-css-for-the-docs-home',
      title: 'experiment(docs): inline critical CSS for the docs home [LNUI-918]',
      status: 'closed',
      list: 'for-you',
      timeAgo: '3w',
      prNumber: 384,
      branch: 'experiment/lnui-918-critical-css',
      resolves: ['LNUI-918', 'Inline critical CSS experiment for the docs home'],
      files: [
         ['critical-css.ts', 'docs/lib', 61, 0, 'implementation'],
         ['layout.tsx', 'app', 12, 3, 'implementation'],
      ],
      commits: [
         ['d02c9f4', 'experiment(docs): extract and inline above-the-fold CSS at build', '3w ago'],
      ],
      summary: [
         'Build-time extraction inlined ~6 KB of above-the-fold CSS on the docs home to test the FCP impact.',
         'Closed after measuring: FCP improved by only 40 ms at p75 while the HTML payload grew on every page — not worth the pipeline complexity.',
      ],
      testPlan: [['Lighthouse + CrUX comparison over one week of preview traffic', true]],
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
      commits: [
         ['a3c90d8', 'fix(calendar): inclusive range bounds in disabled matchers', '4d ago'],
      ],
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
      resolves: ['LNUI-560', 'Accordion: animate height with CSS grid rows instead of max-height'],
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
      push(
         'add',
         `   it('${review.summary[0]
            ?.slice(0, 48)
            .toLowerCase()
            .replace(/[`'".]/g, '')}…', () => {`
      );
      push('add', `      render(<${fn} />);`);
      push(
         'add',
         `      expect(screen.getByRole('${seed % 2 ? 'dialog' : 'button'}')).toBeInTheDocument();`
      );
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
      push(
         'add',
         `      <div className={cn('relative min-w-0', props.className)} data-slot="${base}">`
      );
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
               ? (review.summary[0]?.split(/[—.:]/)[0].replace(/^Bug/, 'Fixing the bug') ??
                 review.title)
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

/** Agent verdict variants, picked deterministically per review. */
const REVIEW_NOTES: Omit<ReviewNote, 'author' | 'timeAgo'>[] = [
   {
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
      footer:
         'Fixed post-review: the regression surface is now asserted by a test — a break would fail loudly instead of degrading silently.',
   },
   {
      verdictLine: '✅ GO — Clean pass on the first round (0 critical, 0 high, 1 medium deferred).',
      profileLine:
         'Profile computed on the real diff (dev-flow Phase 4.5): logic + accessibility + performance. Security skipped (no data boundary touched).',
      rows: [
         { review: 'Logic', verdict: '✅ PASS', critical: '0', high: '0', medium: '0' },
         {
            review: 'Accessibility',
            verdict: '✅ PASS',
            critical: '0',
            high: '0',
            medium: '1 (deferred)',
         },
         { review: 'Performance', verdict: '✅ PASS', critical: '0', high: '0', medium: '0' },
         { review: 'Security', verdict: '⏭️ SKIPPED', critical: '—', high: '—', medium: '—' },
      ],
      footer:
         'The deferred medium is tracked as a follow-up ticket; no behaviour change shipped without a test.',
   },
   {
      verdictLine:
         '✅ GO — Passed after one fix round: the logic HIGH found in round one was fixed in-branch and re-verified.',
      profileLine:
         'Profile computed on the real diff (dev-flow Phase 4.5): logic + architecture. Performance and security skipped (leaf UI change).',
      rows: [
         {
            review: 'Logic',
            verdict: '✅ PASS (was BLOCKED, fixed)',
            critical: '0',
            high: '1 → fixed',
            medium: '1 (fixed)',
         },
         {
            review: 'Architecture',
            verdict: '✅ PASS',
            critical: '0',
            high: '0',
            medium: '1 (deferred)',
         },
         { review: 'Performance', verdict: '⏭️ SKIPPED', critical: '—', high: '—', medium: '—' },
         { review: 'Security', verdict: '⏭️ SKIPPED', critical: '—', high: '—', medium: '—' },
      ],
      footer:
         'Round-two diff was re-profiled from scratch: the fix did not widen the review surface.',
   },
];

export const reviews: Review[] = seeds.map((seed) => {
   const noteSeed = seedNumber(seed.id);
   return {
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
      checksPassed: seed.status === 'closed' ? 2 : seed.status === 'open' ? 3 : 4,
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
      deployment: {
         project: 'lndev-ui-docs',
         state: seed.status === 'closed' ? 'Skipped' : 'Ready',
         action: 'Preview',
      },
      reviewNote:
         seed.list === 'for-you' && seed.status === 'merged'
            ? {
                 author: 'Atlas',
                 timeAgo: seed.timeAgo === '1h' ? '55min ago' : seed.timeAgo + ' ago',
                 ...REVIEW_NOTES[noteSeed % REVIEW_NOTES.length],
              }
            : undefined,
   };
});

export const forYouReviews = reviews.filter((review) => review.list === 'for-you');
export const createdReviews = reviews.filter((review) => review.list === 'created');

export function getReviewById(id: string): Review | undefined {
   return reviews.find((review) => review.id === id);
}
