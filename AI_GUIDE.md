# Circle — AI Guide

> This document is written for AI assistants (and humans) working on this codebase.
> It explains how the project is structured, where every kind of logic lives, how to
> plug a real API behind the UI, and how to extract a single feature into another project.

Circle is a **Linear-inspired project management interface**: issues, projects, teams,
cycles, members, documents and notifications — built as a **pure front-end template**.
There is **no backend, no API, no database and no authentication**: every piece of data
is fake, defined in TypeScript files under `mock-data/`, and all mutations happen
in-memory through Zustand stores.

## Tech stack

| Concern | Choice | Notes |
| --- | --- | --- |
| Framework | Next.js 15 (App Router) | `app/` directory, React 19, Turbopack in dev |
| Language | TypeScript (strict) | Path alias `@/*` → repo root (see `tsconfig.json`) |
| Styling | Tailwind CSS v4 | Theme tokens in `app/globals.css` (`--background`, `--container`, …) |
| UI kit | shadcn/ui (Radix primitives) | Generated components in `components/ui/` — treat as vendored |
| State | Zustand 5 + nuqs | UI state in Zustand (`store/`), filters/sorting synced to the URL via nuqs hooks |
| Charts | Recharts | Burn-up chart + insights bar chart |
| Drag & drop | react-dnd (HTML5 backend) | Board view, drop = change status |
| Animation | motion (Framer Motion) | Layout animations on issue lines/cards |
| Dates | date-fns | Formatting only |
| Ordering | LexoRank (`@kayron013/lexorank`) | Issue `rank` field, re-exported from `lib/utils.ts` |
| Icons | lucide-react, @remixicon/react | Plus hand-written SVGs for statuses/priorities |
| Toasts | sonner | `<Toaster />` mounted in `app/layout.tsx` |
| URL state | nuqs 2 | `NuqsAdapter` wraps the app in `app/layout.tsx`; filter "stores" are nuqs hooks |

Formatting: Prettier with **3-space indentation**, single quotes, 100-col width
(`.prettierrc`). Husky + lint-staged run Prettier/ESLint on commit.

## Repository map

```
app/                          # Next.js routes (thin wrappers around components)
  layout.tsx                  # Root layout: fonts, ThemeProvider (dark default), Toaster
  page.tsx                    # Redirects to /lndev-ui/team/CORE/all
  [orgId]/                    # Fake multi-tenant segment (always "lndev-ui" in mock data)
    inbox/  projects/  teams/  members/  settings/
    issue/[issueId]/                          # Issue detail page (issueId = identifier, e.g. LNUI-703)
    team/[teamId]/
      all/       active/      backlog/          # Issue views (tabs)
      cycle/active/  cycle/upcoming/            # Current / upcoming cycle issues
      cycles/                                   # Cycles timeline + burn-up chart
      overview/  documents/  members/           # Team Home tabs
components/
  common/                     # Feature components (the real UI)
    issues/    inbox/    projects/    teams/    members/    settings/    cycles/
  layout/
    main-layout.tsx           # Sidebar + rounded content shell used by every page
    sidebar/                  # App sidebar (nav, org switcher, create-issue modal)
    headers/                  # Per-page headers (nav row + options row)
  ui/                         # shadcn/ui primitives (button, dialog, table, …)
mock-data/                    # ALL data + domain types (issues, users, teams, …)
store/                        # Zustand stores (state + mutations + filtering)
lib/                          # cn(), LexoRank re-export, status/notification helpers
hooks/                        # use-mobile.ts (responsive breakpoint hook)
```

### Page pattern

Every route follows the same composition — copy it when adding a page:

```tsx
// app/[orgId]/team/[teamId]/example/page.tsx
import MainLayout from '@/components/layout/main-layout';
import Header from '@/components/layout/headers/example/header';
import Example from '@/components/common/example/example';

export default function ExamplePage() {
   return (
      <MainLayout header={<Header />}>   {/* headersNumber={1|2} = header row count */}
         <Example />
      </MainLayout>
   );
}
```

`MainLayout` renders the sidebar, the `CreateIssueModalProvider` and a scrollable
content area whose height depends on `headersNumber` (1 or 2 header rows of 40px).

## Data model (single source of truth: `mock-data/`)

All domain **interfaces live next to their fake data**. Import types from these files.

| File | Types | Notable fields |
| --- | --- | --- |
| `mock-data/status.tsx` | `Status`, `StatusCategory` | 13 workflow statuses with SVG icon components and a `category` (`triage` \| `backlog` \| `unstarted` \| `started` \| `completed` \| `canceled`). Also exports `workflowOrderedStatus`, `displayOrderedStatus`, `getStatusesByCategory()`, `StatusIcon`, and reusable icon builders (`StatusPieIcon`, `StatusGearIcon`, …). ⚠️ The first six entries keep historical array indexes — `inbox.ts` and `projects.ts` reference `status[0..5]`. |
| `mock-data/issues.ts` | `Issue` | Generated from a compact `seeds` array (~90 issues). `cycleId` links to a cycle ('' = no cycle). `rank` uses LexoRank. Helpers: `groupIssuesByStatus`, `sortIssuesByPriority`, `filterIssuesByCycle`, `filterIssuesByCategories`. |
| `mock-data/cycles.ts` | `Cycle`, `CycleStatus`, `CycleBurnupPoint` | `status` (`planned`/`upcoming`/`current`/`completed`), capacity, scope/started/completed, `burnup` chart points (deterministically generated). Helpers: `getCurrentCycle`, `getUpcomingCycle`, `getCyclesByTeam`, `formatCycleDateRange`. |
| `mock-data/priorities.tsx` | `Priority` | 5 levels with SVG icon components |
| `mock-data/labels.ts` | `LabelInterface` | id, name, CSS color keyword |
| `mock-data/projects.ts` | `Project`, `Health` | percentComplete, lead (User), priority, health |
| `mock-data/teams.ts` | `Team` | members (User[]), projects (Project[]), `joined` |
| `mock-data/users.ts` | `User` | status (online/offline/away), role, teamIds |
| `mock-data/documents.ts` | `TeamDocument`, `DocumentFolder` | Docs grouped in folders, creator, timestamps, `pinned` |
| `mock-data/issue-details.ts` | `IssueDetail`, `ContentBlock`, `ActivityItem`, `PrLink` | Rich issue-page content: structured description blocks (headings, lists, checklists, code, image/video placeholders, quotes, issue refs), activity events + comments, relations, PR links. ~12 handcrafted details + a **deterministic fallback generator** (`getIssueDetail(issue)`) for every other issue. |
| `mock-data/inbox.ts` | `InboxItem`, `NotificationType` | Issue-shaped + notification fields (read, user, content) |
| `mock-data/side-bar-nav.ts` | — | Static nav items for sidebar/settings |

## State management (`store/`)

Two flavors live side by side and expose hook-shaped APIs:

- **Zustand stores** (in-memory, some persisted to localStorage)
- **nuqs hooks** (state lives in the URL query string) — they kept the historical
  `useXxxStore()` names so consumers didn't change when they were migrated

| Store | Kind | Role | Mutates data? |
| --- | --- | --- | --- |
| `issues-store.ts` | Zustand | Holds the issues array + `issuesByStatus`; CRUD (`addIssue`, `updateIssue`, `deleteIssue`, `updateIssueStatus/Priority/Assignee/Project`, label add/remove); read filters (`filterByStatus/Priority/Assignee/Label/Project/Cycle`, `searchIssues`, `filterIssues` — supports status/assignee/priority/labels/project/cycle/statusType) | ✅ the main mutable store |
| `notifications-store.ts` | Zustand | Inbox items, selection, read/unread | ✅ |
| `filter-store.ts` | **nuqs** | Issue filters in the URL under a single `?filters=` param — the state is bazza/ui's `FiltersState` (`{ columnId, type, operator, values }[]`), so operators like *is not* / *exclude* survive in shareable URLs | URL state |
| `projects-filter-store.ts`, `team-filter-store.ts`, `members-filter-store.ts` | **nuqs** | Per-page filters + sorting in the URL (`?sort=…`) | URL state |
| `display-settings-store.ts` | Zustand (persisted) | Linear-style "Display" options: grouping (status/assignee/priority/project/none), ordering (priority/created/title), completed-issue visibility, show empty groups, per-row display properties (ID, status, priority, labels, project, due date, created, assignee, cycle) | UI state |
| `view-store.ts` | Zustand (persisted) | List vs Board | UI state |
| `search-store.ts` | Zustand | Search open/query | UI state |
| `create-issue-store.ts` | Zustand | Create-issue modal open state + default status | UI state |
| `right-panel-store.ts` | Zustand | Right side panel on issue/cycle pages (`'insights'` \| `'cycle-details'` \| null) | UI state |

⚠️ Only **issues** and **notifications** are truly mutable. The Projects, Teams and
Members pages read directly from `mock-data/` and apply their filter stores in
`useMemo` — there is no projects/teams/members store to mutate yet.

## Feature inventory (what to grab if you only want one part)

Each feature is self-contained under `components/common/<feature>` + its header under
`components/layout/headers/<feature>`. Dependencies below are in addition to
`components/ui/*`, `lib/utils.ts` and Tailwind.

- **Filter bar** (`components/common/issues/issue-filter-bar.tsx` + `issue-filter-columns.tsx`
  + vendored `components/data-table-filter/`) — Linear-style filter chips
  (subject / operator / values / remove) built on [bazza/ui data-table-filter]
  (vendored, Radix + shadcn, lint-exempted in `eslint.config.mjs`). Column configs are
  built from mock-data via `createColumnConfigHelper<Issue>()`; `applyIssueFilters()`
  applies a `FiltersState` to any issue list using bazza's filter functions.
  To add a filterable field: add one entry in `issue-filter-columns.tsx`.
- **Issues views** (`components/common/issues/`) — `all-issues.tsx` (accepts
  `categories?: StatusCategory[]` for the Active/Backlog tabs), `grouped-issues-view.tsx`
  (grouping/ordering-aware list/board + DnD), `group-issues.tsx` (generic
  `IssueGroupDescriptor` — a group is a status, an assignee, a priority or a project),
  `issue-line.tsx`, `issue-grid.tsx` (both honor `display-settings-store` display
  properties and link to the issue page), selectors (status/priority/assignee),
  `issue-context-menu.tsx`, `search-issues.tsx`, `insights-panel.tsx`. Needs:
  `issues-store`, `filter-store`, `view-store`, `display-settings-store`,
  `search-store`, `right-panel-store`, `mock-data/{issues,status,priorities,labels,projects,users}`.
- **Issue detail page** (`components/common/issues/details/` + `app/[orgId]/issue/[issueId]/`)
  — `issue-details.tsx` (composition), `content-blocks.tsx` (renders `ContentBlock[]`
  with inline \`code\`/**bold** parsing, image & video placeholders, issue refs),
  `activity-feed.tsx` (events + comments + local composer),
  `issue-properties-panel.tsx` (editable status/priority/assignee, labels, project,
  milestone, blocked-by/related, PR links), header with prev/next navigation
  (`components/layout/headers/issue/`). Needs the issues feature + `mock-data/issue-details.ts`.
- **Cycles** (`components/common/cycles/`) — `cycles.tsx` (timeline),
  `cycle-line.tsx`, `cycle-burnup-chart.tsx` (+ `CycleProgressLegend`),
  `capacity-ring.tsx`, `cycle-details-panel.tsx`. `cycle-issues.tsx` (in
  `components/common/issues/`) renders a cycle-scoped issue view. Needs:
  `mock-data/cycles.ts`, recharts, the issues feature.
- **Team Home** (`components/common/teams/team-{overview,documents,members}.tsx`
  + `components/layout/headers/team/`) — needs `mock-data/{teams,documents}`.
- **Inbox** (`components/common/inbox/`) — resizable two-pane notifications (single-pane
  with back navigation on mobile). Notifications reference REAL issues by identifier
  (`InboxItem extends Issue`) and the preview pane renders the actual issue (live store
  data + rich description + properties column). Needs `notifications-store`,
  `mock-data/inbox.ts`, `react-resizable-panels`, the issue-details renderer.
- **Projects / Teams / Members tables** (`components/common/{projects,teams,members}/`)
  — plain sorted/filtered tables + their filter stores.
- **Create issue modal** (`components/layout/sidebar/create-new-issue/`) — dialog with
  status/priority/assignee/project/label selectors; writes through `issues-store.addIssue`.
- **App shell** (`components/layout/main-layout.tsx` + `sidebar/`) — everything else
  plugs into it.

Routing conventions: URLs are `/{orgId}/…` with `orgId` hard-coded to `lndev-ui` in
mock nav data, and `teamId` matching `Team.id` (e.g. `CORE`). Issue views intentionally
show all issues regardless of `teamId` (mock simplification).

## How to integrate a real API

The mock layer was designed to be swapped. The seams:

1. **Keep the types.** Reuse the interfaces from `mock-data/*` (move them to a
   `types/` folder if you prefer) — every component is typed against them.
2. **Replace reads.**
   - Issues: `store/issues-store.ts` seeds its state with `mockIssues`. Replace that
     initial value with data fetched from your API (e.g. hydrate the store in a server
     component / route handler, or fetch in a `useEffect` and `set({ issues })`).
   - Projects / Teams / Members / Documents / Cycles: components import the arrays
     directly (`import { projects } from '@/mock-data/projects'` etc.). Replace these
     imports with your fetching layer (React Query, server components, SWR…), keeping
     the same shapes.
3. **Replace writes.** All issue mutations funnel through `issues-store` actions
   (`addIssue`, `updateIssue`, `deleteIssue`, `updateIssueStatus`, …) and notification
   mutations through `notifications-store`. Add your API calls inside those actions
   (optimistic update = keep the current `set(...)`, then call the API and roll back
   on failure). No component calls a mutation outside these stores.
4. **Search & filters** are pure client-side functions in `issues-store`
   (`searchIssues`, `filterIssues`). Point them at your API if you need server-side
   search. Filter **selections** already live in the URL (nuqs) — deep links keep
   working when you swap the data source.
5. **Ordering**: when persisting drag-and-drop, store the LexoRank `rank` string —
   see `lib/utils.ts` and the `ranks` generation in `mock-data/issues.ts`.
6. **Auth/org**: the `[orgId]` and `[teamId]` route params are already in place;
   today components fall back to the first team when `teamId` is unknown
   (`teams.find(...) ?? teams[0]`) — replace with real lookups.

Suggested adapter pattern: create `lib/api/issues.ts` exposing
`fetchIssues() / createIssue() / updateIssue() / deleteIssue()`, call these from the
store actions, and delete nothing else — the UI will keep working.

## Statuses & workflow logic

- A status belongs to a `StatusCategory`; views are category-driven:
  - **Active tab** (`/team/[teamId]/active`) → categories `unstarted` + `started`
  - **Backlog tab** (`/team/[teamId]/backlog`) → categories `backlog` + `triage`
  - **All issues** (`/team/[teamId]/all`) → everything
- Board/list groups render in `displayOrderedStatus` order and **skip empty groups**.
- The insights panel table uses `workflowOrderedStatus` order.
- Cycle progress (`completed` stats, details-panel breakdowns) counts issues whose
  `status.category === 'completed'`.
- To add a status: add one entry to `status` in `mock-data/status.tsx` (append at the
  end — don't reorder the first six), pick an icon builder (`StatusPieIcon(color,
  fraction)`, `StatusGearIcon`, `StatusCheckIcon`, `StatusXIcon`, …) and a category.
  Everything else (views, filters, selectors, insights) picks it up automatically.

## Conventions & gotchas

- `'use client'` on every component that touches a store, DnD, or browser APIs.
  Route `page.tsx` files stay server components.
- Use the `cn()` helper (`lib/utils.ts`) to merge Tailwind classes.
- Background surfaces: `bg-container` (custom token), hover rows: `hover:bg-sidebar/50`.
- Right side panels are 420px `<aside>`s hidden below `lg`, toggled via
  `right-panel-store` from the header option buttons.
- Filters/sorting belong in the URL: use a nuqs hook (see `store/filter-store.ts`
  as the template) instead of a new Zustand store when adding one.
- Issue detail content is data, not markup: extend the `ContentBlock` union in
  `mock-data/issue-details.ts` + one case in `content-blocks.tsx` to add a block type.
- Charts must be deterministic across SSR/CSR — never use `Math.random()`/`Date.now()`
  when generating chart data (see `generateBurnup` in `mock-data/cycles.ts`).
- `next/font` fetches Geist from Google Fonts at build time — offline builds must stub
  it or set up a local font.
- Some mock relations are intentionally loose (e.g. team issues aren't filtered by
  `teamId`, duplicated projects inside teams). Tighten them when a real API arrives.

## Commands

```bash
pnpm install       # install deps
pnpm dev           # dev server (Turbopack) on http://localhost:3000
pnpm build         # production build (type-checks + lints)
pnpm lint          # ESLint
pnpm format        # Prettier
```
