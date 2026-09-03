import { Priority, priorities } from './priorities';
import { Health, health, Project, projects } from './projects';
import { User, users } from './users';

export type InitiativeStatus = 'active' | 'planned' | 'completed' | 'canceled';

export interface Initiative {
   id: string;
   name: string;
   description?: string;
   /** Emoji used as the initiative icon. */
   icon: string;
   status: InitiativeStatus;
   priority: Priority;
   owner?: User;
   /** Team steering the initiative (see mock-data/teams) — Linear "Lead team". */
   leadTeamId?: string;
   /** Target label shown in the list ("Q3 2026", "Sep 30th", …). */
   target?: string;
   health: Health;
   projectIds: string[];
   createdAt: string;
}

export const INITIATIVE_STATUS_META: Record<InitiativeStatus, { label: string; color: string }> = {
   active: { label: 'Active', color: '#f2c94c' },
   planned: { label: 'Planned', color: '#95a2b3' },
   completed: { label: 'Completed', color: '#5e6ad2' },
   canceled: { label: 'Canceled', color: '#95a2b3' },
};

const noUpdate = health[0];
const byId = (id: string): Health => health.find((entry) => entry.id === id) ?? noUpdate;

/**
 * Workspace initiatives (Linear "Initiatives" page). Fake data around the
 * LNDev UI component-library storyline; projects reference mock-data/projects.
 */
export const initiatives: Initiative[] = [
   {
      id: 'component-platform',
      name: 'Q3 — Ship the component platform',
      description: 'Deliver the full core component suite with stable APIs and docs.',
      icon: '🧱',
      status: 'active',
      priority: priorities[0],
      owner: users[0],
      target: 'Q3 2026',
      health: byId('on-track'),
      projectIds: ['1', '2', '3', '7', '13', '19'],
      createdAt: '2026-04-02',
   },
   {
      id: 'quality-accessibility',
      name: 'Q3 — Raise quality and accessibility',
      description: 'WCAG AA across the library, visual regression coverage and audits.',
      icon: '♿',
      status: 'active',
      priority: priorities[2],
      owner: users[3],
      target: 'Q3 2026',
      health: byId('at-risk'),
      projectIds: ['4', '10', '16', '22'],
      createdAt: '2026-04-11',
   },
   {
      id: 'design-system-adoption',
      name: 'Q4 — Grow design system adoption',
      description: 'Templates, starter kits and integrations that drive adoption.',
      icon: '🌱',
      status: 'active',
      priority: priorities[3],
      owner: users[1],
      target: 'Q4 2026',
      health: noUpdate,
      projectIds: ['5', '11', '17', '23'],
      createdAt: '2026-05-06',
   },
   {
      id: 'performance-lab',
      name: 'Q3 — Cut bundle size in half',
      description: 'Tree-shakeable exports, lazy primitives and a leaner runtime.',
      icon: '⚡',
      status: 'active',
      priority: priorities[1],
      owner: users[4],
      leadTeamId: 'PERF',
      target: 'Q3 2026',
      health: byId('on-track'),
      projectIds: ['6', '12', '18'],
      createdAt: '2026-04-20',
   },
   {
      id: 'docs-refresh',
      name: 'Q3 — Documentation refresh',
      icon: '📚',
      status: 'active',
      priority: priorities[0],
      owner: users[6],
      target: 'Q3 2026',
      health: noUpdate,
      projectIds: ['8', '14'],
      createdAt: '2026-05-14',
   },
   {
      id: 'theming-engine',
      name: 'Q4 — Next-gen theming engine',
      description: 'Design tokens, runtime variants and a visual theme builder.',
      icon: '🎨',
      status: 'planned',
      priority: priorities[2],
      owner: users[2],
      leadTeamId: 'DESIGN',
      target: 'Q4 2026',
      health: noUpdate,
      projectIds: ['2', '9', '15'],
      createdAt: '2026-06-01',
   },
   {
      id: 'mobile-primitives',
      name: 'Q4 — Mobile-first primitives',
      description: 'Touch targets, gestures and adaptive layouts for small screens.',
      icon: '📱',
      status: 'planned',
      priority: priorities[0],
      owner: users[5],
      target: 'Q4 2026',
      health: noUpdate,
      projectIds: ['20', '24'],
      createdAt: '2026-06-09',
   },
   {
      id: 'playground',
      name: 'Q4 — Interactive component playground',
      icon: '🛝',
      status: 'planned',
      priority: priorities[4],
      owner: users[7],
      target: 'Sep 30th',
      health: noUpdate,
      projectIds: ['21', '25'],
      createdAt: '2026-06-18',
   },
   {
      id: 'backlog-grooming',
      name: 'Backlog — Community requests',
      icon: '🧺',
      status: 'planned',
      priority: priorities[0],
      target: 'Q4 2026',
      health: noUpdate,
      projectIds: ['9', '24'],
      createdAt: '2026-06-25',
   },
   {
      id: 'v2-launch',
      name: 'Q2 — Launch LNDev UI v2',
      description: 'Rebrand, new website and the v2 breaking-changes migration guide.',
      icon: '🚀',
      status: 'completed',
      priority: priorities[1],
      owner: users[0],
      target: 'Q2 2026',
      health: byId('on-track'),
      projectIds: ['1', '5', '8'],
      createdAt: '2026-01-12',
   },
   {
      id: 'infra-migration',
      name: 'Q2 — Move CI to self-hosted runners',
      icon: '🏗️',
      status: 'completed',
      priority: priorities[3],
      owner: users[8],
      target: 'Q2 2026',
      health: byId('on-track'),
      projectIds: ['12'],
      createdAt: '2026-02-03',
   },
   {
      id: 'storybook-migration-first-pass',
      name: 'Storybook migration — first pass',
      description:
         'Move every story to the new format in one sweep. Called off: the codemod choked on custom decorators, replaced by the incremental second pass.',
      icon: '📖',
      status: 'canceled',
      priority: priorities[2],
      owner: users[2],
      leadTeamId: 'CORE',
      target: 'Sep 30th',
      health: noUpdate,
      projectIds: ['3', '7'],
      createdAt: '2026-05-02',
   },
   {
      id: 'storybook-migration-second-pass',
      name: 'Storybook migration — second pass',
      description:
         'Same goal, sliced package by package: each chunk migrates, ships and locks before the next one starts.',
      icon: '📖',
      status: 'planned',
      priority: priorities[2],
      owner: users[2],
      leadTeamId: 'CORE',
      target: 'Sep 30th',
      health: noUpdate,
      projectIds: ['13', '19'],
      createdAt: '2026-06-28',
   },
   {
      id: 'a11y-certification',
      name: 'Q4 — WCAG AA certification, third-party audited',
      description:
         'External audit across the 40 core components, remediation sprints, and the public conformance report.',
      icon: '🏅',
      status: 'active',
      priority: priorities[1],
      owner: users[9],
      leadTeamId: 'UX',
      target: 'Q4 2026',
      health: byId('at-risk'),
      projectIds: ['4', '10', '16'],
      createdAt: '2026-05-19',
   },
   {
      id: 'charts-v2',
      name: 'Q4 — Charts v2 on the new canvas renderer',
      description:
         'Rebuild the charts package on the shared canvas renderer: 10× point budget, streaming data, one theming pipeline.',
      icon: '📈',
      status: 'active',
      priority: priorities[2],
      owner: users[10],
      leadTeamId: 'PERF',
      target: 'Q4 2026',
      health: byId('on-track'),
      projectIds: ['6', '18'],
      createdAt: '2026-05-27',
   },
   {
      id: 'templates-marketplace',
      name: 'Q4 — Community templates marketplace',
      description:
         'Submission flow, review pipeline and revenue share for community-built templates and blocks.',
      icon: '🛍️',
      status: 'active',
      priority: priorities[3],
      owner: users[11],
      leadTeamId: 'CORE',
      target: 'Oct 15th',
      health: byId('off-track'),
      projectIds: ['5', '11', '17'],
      createdAt: '2026-06-03',
   },
   {
      id: 'i18n-rtl',
      name: 'Q4 — First-class RTL and logical properties',
      description:
         'Every component audited for logical properties, an RTL visual test lane, and mirrored icon variants.',
      icon: '🌍',
      status: 'active',
      priority: priorities[2],
      owner: users[12],
      leadTeamId: 'UX',
      target: 'Q4 2026',
      health: byId('on-track'),
      projectIds: ['10', '16'],
      createdAt: '2026-06-11',
   },
   {
      id: 'telemetry-dashboard',
      name: 'Q3 — Component adoption telemetry, opt-in',
      description:
         'Anonymous, opt-in usage signals feeding the public adoption dashboard — one switch, zero calls when off.',
      icon: '📊',
      status: 'active',
      priority: priorities[3],
      owner: users[13],
      leadTeamId: 'DATA',
      target: 'Q3 2026',
      health: byId('on-track'),
      projectIds: ['14', '20'],
      createdAt: '2026-04-28',
   },
   {
      id: 'native-mobile-kit',
      name: 'Q1 2027 — Native mobile kit (RN bindings)',
      description:
         'React Native bindings for the 12 most-used primitives, sharing tokens with the web library.',
      icon: '📲',
      status: 'planned',
      priority: priorities[2],
      owner: users[14],
      leadTeamId: 'MOBILE',
      target: 'Q1 2027',
      health: noUpdate,
      projectIds: ['20'],
      createdAt: '2026-07-02',
   },
   {
      id: 'design-linter',
      name: 'Q1 2027 — Design linter for Figma files',
      description:
         'A plugin that flags off-token colors, off-grid spacing and detached components before handoff.',
      icon: '🧹',
      status: 'planned',
      priority: priorities[3],
      owner: users[15],
      leadTeamId: 'DESIGN',
      target: 'Q1 2027',
      health: noUpdate,
      projectIds: ['2', '15'],
      createdAt: '2026-07-08',
   },
   {
      id: 'ssr-streaming',
      name: 'Q4 — Zero-flash SSR streaming support',
      description:
         'Every component renders server-side without hydration mismatch, themes resolve before first paint.',
      icon: '🌊',
      status: 'planned',
      priority: priorities[1],
      owner: users[16],
      leadTeamId: 'PERF',
      target: 'Q4 2026',
      health: noUpdate,
      projectIds: ['6', '12'],
      createdAt: '2026-07-15',
   },
   {
      id: 'docs-search-ai',
      name: 'Q4 — Ask-the-docs search',
      description:
         'Semantic search over docs, guides and API references, with copy-ready code answers.',
      icon: '🔎',
      status: 'planned',
      priority: priorities[3],
      owner: users[17],
      leadTeamId: 'DATA',
      target: 'Q4 2026',
      health: noUpdate,
      projectIds: ['8', '14'],
      createdAt: '2026-07-21',
   },
   {
      id: 'enterprise-theming',
      name: 'Q1 2027 — Enterprise theming: multi-brand workspaces',
      description:
         'One workspace, many brands: scoped token sets, brand switching at runtime and per-tenant overrides.',
      icon: '🏢',
      status: 'planned',
      priority: priorities[2],
      owner: users[18],
      leadTeamId: 'DESIGN',
      target: 'Q1 2027',
      health: noUpdate,
      projectIds: ['2', '9'],
      createdAt: '2026-07-29',
   },
   {
      id: 'q1-stability',
      name: 'Q1 — Zero-P0 quarter',
      description:
         'The bug-debt quarter: every open P0/P1 closed, flaky tests quarantined, error budget policy adopted.',
      icon: '🧯',
      status: 'completed',
      priority: priorities[1],
      owner: users[19],
      leadTeamId: 'CORE',
      target: 'Q1 2026',
      health: byId('on-track'),
      projectIds: ['3', '7'],
      createdAt: '2025-12-10',
   },
   {
      id: 'q1-docs-versioning',
      name: 'Q1 — Versioned documentation',
      description: 'Docs frozen per major version, with an always-current canonical.',
      icon: '🗂️',
      status: 'completed',
      priority: priorities[3],
      owner: users[20],
      leadTeamId: 'DATA',
      target: 'Q1 2026',
      health: byId('on-track'),
      projectIds: ['8'],
      createdAt: '2026-01-06',
   },
   {
      id: 'q2-icon-library',
      name: 'Q2 — Icon library: 400 icons, three sizes',
      description: 'The full icon set redrawn on the shared grid, shipped as its own package.',
      icon: '✒️',
      status: 'completed',
      priority: priorities[2],
      owner: users[21],
      leadTeamId: 'DESIGN',
      target: 'Q2 2026',
      health: byId('on-track'),
      projectIds: ['15'],
      createdAt: '2026-02-17',
   },
   {
      id: 'web-components-bridge',
      name: 'Web Components bridge',
      description:
         'Called off after the spike: the bridge doubled the maintenance surface for <2% of demand. Revisit if custom-elements demand grows.',
      icon: '🌉',
      status: 'canceled',
      priority: priorities[4],
      owner: users[7],
      leadTeamId: 'CORE',
      target: 'Q3 2026',
      health: noUpdate,
      projectIds: ['13'],
      createdAt: '2026-03-12',
   },
   {
      id: 'legacy-ie-support',
      name: 'Extended legacy-browser support tier',
      description:
         'Canceled with the v2 launch: the paid legacy tier attracted three prospects, none converted.',
      icon: '🦖',
      status: 'canceled',
      priority: priorities[0],
      owner: users[5],
      leadTeamId: 'PERF',
      target: 'Q2 2026',
      health: noUpdate,
      projectIds: ['12'],
      createdAt: '2026-02-25',
   },
];

/** Initiatives a team sees: it leads them, or one of its projects is inside. */
export function getTeamInitiatives(teamId: string): Initiative[] {
   return initiatives.filter(
      (initiative) =>
         initiative.leadTeamId === teamId ||
         getInitiativeProjects(initiative).some((project) => project.teamId === teamId)
   );
}

export function getInitiativeById(id: string): Initiative | undefined {
   return initiatives.find((initiative) => initiative.id === id);
}

export function getInitiativeProjects(initiative: Initiative): Project[] {
   return initiative.projectIds
      .map((id) => projects.find((project) => project.id === id))
      .filter((project): project is Project => Boolean(project));
}

/** Projects considered "completed" for the n / m counter. */
export function countCompletedProjects(initiative: Initiative): number {
   return getInitiativeProjects(initiative).filter(
      (project) => project.status.category === 'completed' || project.percentComplete >= 100
   ).length;
}
