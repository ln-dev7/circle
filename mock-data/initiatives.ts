import { Priority, priorities } from './priorities';
import { Health, health, Project, projects } from './projects';
import { User, users } from './users';

export type InitiativeStatus = 'active' | 'planned' | 'completed';

export interface Initiative {
   id: string;
   name: string;
   description?: string;
   /** Emoji used as the initiative icon. */
   icon: string;
   status: InitiativeStatus;
   priority: Priority;
   owner?: User;
   /** Target label shown in the list ("Q3 2026", "Sep 30th", …). */
   target?: string;
   health: Health;
   projectIds: string[];
   createdAt: string;
}

export const INITIATIVE_STATUS_META: Record<
   InitiativeStatus,
   { label: string; color: string }
> = {
   active: { label: 'Active', color: '#f2c94c' },
   planned: { label: 'Planned', color: '#95a2b3' },
   completed: { label: 'Completed', color: '#5e6ad2' },
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
];

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
