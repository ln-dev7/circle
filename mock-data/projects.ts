import { Status, status } from './status';
import {
   Accessibility,
   Bell,
   Blocks,
   Bomb,
   BrickWall,
   Cuboid,
   FormInput,
   Globe,
   Grid2X2,
   HelpCircle,
   LayoutDashboard,
   Loader,
   Lock,
   LucideIcon,
   Play,
   Settings,
   Shapes,
   Table,
   TrafficCone,
   Vault,
   Wallpaper,
} from 'lucide-react';
import { RemixiconComponentType } from '@remixicon/react';
import { User, users } from './users';
import { LabelInterface, labels } from './labels';
import { Priority, priorities } from './priorities';
export interface Project {
   id: string;
   name: string;
   status: Status;
   icon: LucideIcon | RemixiconComponentType;
   percentComplete: number;
   startDate: string;
   /** Planned completion date (Linear "Target date"). */
   targetDate?: string;
   lead: User;
   priority: Priority;
   health: Health;
   /** Owning team (see mock-data/teams.ts). */
   teamId: string;
   labels: LabelInterface[];
   initiative?: string;
   /** Days since the last health update (undefined = no update yet). */
   healthUpdatedAgoDays?: number;
}

type BaseProject = Omit<
   Project,
   'targetDate' | 'teamId' | 'labels' | 'initiative' | 'healthUpdatedAgoDays'
>;

export interface Health {
   id: 'no-update' | 'off-track' | 'on-track' | 'at-risk';
   name: string;
   color: string;
   description: string;
}

export const health: Health[] = [
   {
      id: 'no-update',
      name: 'No Update',
      color: '#8f9299',
      description: 'The project has not been updated in the last 30 days.',
   },
   {
      id: 'off-track',
      name: 'Off Track',
      color: '#eb5757',
      description: 'The project is not on track and may be delayed.',
   },
   {
      id: 'on-track',
      name: 'On Track',
      color: '#4cb782',
      description: 'The project is on track and on schedule.',
   },
   {
      id: 'at-risk',
      name: 'At Risk',
      color: '#f2c94c',
      description: 'The project is at risk and may be delayed.',
   },
];

const baseProjects: BaseProject[] = [
   {
      id: '1',
      name: 'LNDev UI - Core Components',
      status: status[0],
      icon: Cuboid,
      percentComplete: 80,
      startDate: '2025-03-08',
      lead: users[2],
      priority: priorities[1],
      health: health[0],
   },
   {
      id: '2',
      name: 'LNDev UI - Theming',
      status: status[1],
      icon: Blocks,
      percentComplete: 50,
      startDate: '2025-03-14',
      lead: users[0],
      priority: priorities[0],
      health: health[3],
   },
   {
      id: '3',
      name: 'LNDev UI - Modals',
      status: status[2],
      icon: Vault,
      percentComplete: 0,
      startDate: '2025-03-09',
      lead: users[1],
      priority: priorities[2],
      health: health[1],
   },
   {
      id: '4',
      name: 'LNDev UI - Navigation',
      status: status[3],
      icon: BrickWall,
      percentComplete: 0,
      startDate: '2025-03-10',
      lead: users[2],
      priority: priorities[0],
      health: health[2],
   },
   {
      id: '5',
      name: 'LNDev UI - Layout',
      status: status[4],
      icon: Wallpaper,
      percentComplete: 0,
      startDate: '2025-03-11',
      lead: users[0],
      priority: priorities[0],
      health: health[3],
   },
   {
      id: '6',
      name: 'LNDev UI - Sidebar',
      status: status[5],
      icon: TrafficCone,
      percentComplete: 0,
      startDate: '2025-03-12',
      lead: users[1],
      priority: priorities[0],
      health: health[1],
   },
   {
      id: '7',
      name: 'LNDev UI - Cards',
      status: status[1],
      icon: Grid2X2,
      percentComplete: 0,
      startDate: '2025-03-13',
      lead: users[2],
      priority: priorities[0],
      health: health[2],
   },
   {
      id: '8',
      name: 'LNDev UI - Tooltip',
      status: status[2],
      icon: Bomb,
      percentComplete: 0,
      startDate: '2025-03-14',
      lead: users[0],
      priority: priorities[0],
      health: health[3],
   },
   {
      id: '9',
      name: 'LNDev UI - Dropdown',
      status: status[3],
      icon: Shapes,
      percentComplete: 50,
      startDate: '2025-03-15',
      lead: users[1],
      priority: priorities[0],
      health: health[3],
   },
   {
      id: '10',
      name: 'LNDev UI - Data Tables',
      status: status[0],
      icon: Table,
      percentComplete: 65,
      startDate: '2025-03-18',
      lead: users[2],
      priority: priorities[1],
      health: health[0],
   },
   {
      id: '11',
      name: 'LNDev UI - Form Controls',
      status: status[2],
      icon: FormInput,
      percentComplete: 30,
      startDate: '2025-03-19',
      lead: users[0],
      priority: priorities[1],
      health: health[2],
   },
   {
      id: '12',
      name: 'LNDev UI - Notifications',
      status: status[1],
      icon: Bell,
      percentComplete: 45,
      startDate: '2025-03-20',
      lead: users[1],
      priority: priorities[0],
      health: health[1],
   },
   {
      id: '13',
      name: 'LNDev UI - Authentication Flow',
      status: status[0],
      icon: Lock,
      percentComplete: 75,
      startDate: '2025-03-05',
      lead: users[2],
      priority: priorities[0],
      health: health[0],
   },
   {
      id: '14',
      name: 'LNDev UI - User Preferences',
      status: status[3],
      icon: Settings,
      percentComplete: 10,
      startDate: '2025-03-22',
      lead: users[0],
      priority: priorities[2],
      health: health[2],
   },
   {
      id: '15',
      name: 'LNDev UI - Dashboard Widgets',
      status: status[1],
      icon: LayoutDashboard,
      percentComplete: 55,
      startDate: '2025-03-17',
      lead: users[1],
      priority: priorities[1],
      health: health[0],
   },
   {
      id: '16',
      name: 'LNDev UI - Onboarding Guide',
      status: status[2],
      icon: HelpCircle,
      percentComplete: 25,
      startDate: '2025-03-24',
      lead: users[2],
      priority: priorities[1],
      health: health[3],
   },
   {
      id: '17',
      name: 'LNDev UI - Progress Indicators',
      status: status[4],
      icon: Loader,
      percentComplete: 40,
      startDate: '2025-03-16',
      lead: users[0],
      priority: priorities[0],
      health: health[1],
   },
   {
      id: '18',
      name: 'LNDev UI - Internationalization',
      status: status[5],
      icon: Globe,
      percentComplete: 15,
      startDate: '2025-03-25',
      lead: users[1],
      priority: priorities[2],
      health: health[2],
   },
   {
      id: '19',
      name: 'LNDev UI - Accessibility Features',
      status: status[0],
      icon: Accessibility,
      percentComplete: 60,
      startDate: '2025-03-21',
      lead: users[2],
      priority: priorities[0],
      health: health[0],
   },
   {
      id: '20',
      name: 'LNDev UI - Media Player',
      status: status[3],
      icon: Play,
      percentComplete: 20,
      startDate: '2025-03-26',
      lead: users[0],
      priority: priorities[1],
      health: health[3],
   },
];

/* -------------------------------------------------------------------------- */
/*            Extended, Linear-style attributes (teams, dates, labels)        */
/* -------------------------------------------------------------------------- */

const TEAM_ROTATION = ['CORE', 'DESIGN', 'PERF', 'WEB', 'API', 'ANALYTICS'];

const INITIATIVES = [
   'Q3 — Ship the component platform',
   'Q3 — Raise quality and accessibility',
   'Q4 — Grow design system adoption',
];

const pad = (value: number) => String(value).padStart(2, '0');

/** Deterministic date helper (no Date.now — SSR safe). */
const isoDate = (year: number, month: number, day: number): string => {
   const normalizedYear = year + Math.floor((month - 1) / 12);
   const normalizedMonth = ((month - 1) % 12) + 1;
   return `${normalizedYear}-${pad(normalizedMonth)}-${pad(Math.min(day, 28))}`;
};

export const projects: Project[] = baseProjects.map((project, index) => {
   // Spread active work around mid-2026 so the timeline view reads well.
   const startMonth = 2 + ((index * 5) % 10); // Feb → Nov 2026
   const startDate = isoDate(2026, startMonth, 1 + ((index * 7) % 26));
   const targetDate = isoDate(2026, startMonth + 2 + (index % 4), 1 + ((index * 11) % 26));

   return {
      ...project,
      startDate,
      targetDate,
      teamId: TEAM_ROTATION[index % TEAM_ROTATION.length],
      labels: [labels[index % labels.length]],
      initiative: INITIATIVES[index % INITIATIVES.length],
      healthUpdatedAgoDays: project.health.id === 'no-update' ? undefined : 1 + (index % 9),
   };
});

export function getProjectById(id: string): Project | undefined {
   return projects.find((project) => project.id === id);
}

export function getProjectsByTeam(teamId: string): Project[] {
   return projects.filter((project) => project.teamId === teamId);
}
