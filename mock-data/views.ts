import { Issue, issues } from './issues';
import { Project, projects } from './projects';
import { StatusCategory } from './status';
import { User, users } from './users';

export type ViewType = 'issue' | 'project';

/** Declarative filter of a saved view, applied by getViewIssues/getViewProjects. */
export interface ViewFilter {
   statusCategories?: StatusCategory[];
   statusIds?: string[];
   labelIds?: string[];
   priorityIds?: string[];
   /** Only issues that belong to a project. */
   hasProject?: boolean;
   /** Only issues assigned to nobody. */
   unassigned?: boolean;
}

export interface View {
   id: string;
   name: string;
   description: string;
   /** Emoji shown as the view icon. */
   icon: string;
   type: ViewType;
   /** Owning team; undefined = workspace-level view. */
   teamId?: string;
   owner: User;
   createdAt: string;
   updatedAt: string;
   filter: ViewFilter;
}

/** Saved views of the workspace (Views page). Fake data, LNDev UI storyline. */
export const views: View[] = [
   /* --------------------------------- issues -------------------------------- */
   {
      id: 'blocked-3-days',
      teamId: 'CORE',
      name: '+ 3 days blocked issues',
      description: 'Issues that are Blocked or Paused for more than 3 days',
      icon: '🧊',
      type: 'issue',
      owner: users[0],
      createdAt: '2026-03-04',
      updatedAt: '2026-07-21',
      filter: { statusIds: ['blocked', 'paused'] },
   },
   {
      id: 'in-progress-recent',
      teamId: 'CORE',
      name: '+1 day in progress',
      description: 'Issues that started in the last day and are currently in progress',
      icon: '⏱️',
      type: 'issue',
      owner: users[0],
      createdAt: '2026-03-04',
      updatedAt: '2026-07-30',
      filter: { statusIds: ['in-progress'] },
   },
   {
      id: 'stale-reviews',
      teamId: 'DESIGN',
      name: '+3 days stale review issues',
      description: "Issues in review statuses that haven't been updated in over 3 days",
      icon: '⌛',
      type: 'issue',
      owner: users[2],
      createdAt: '2026-03-19',
      updatedAt: '2026-07-12',
      filter: { statusIds: ['technical-review'] },
   },
   {
      id: 'discuss-backlog-review',
      teamId: 'DESIGN',
      name: 'To discuss — backlog review',
      description: 'Topics to raise between product and engineering during backlog review',
      icon: '💬',
      type: 'issue',
      owner: users[3],
      createdAt: '2026-04-02',
      updatedAt: '2026-07-28',
      filter: { statusIds: ['idea', 'triage'] },
   },
   {
      id: 'ready-for-sprint',
      teamId: 'WEB',
      name: 'Ready for next sprint',
      description: 'Groomed stories ready to be pulled into a cycle',
      icon: '⚡',
      type: 'issue',
      owner: users[5],
      createdAt: '2026-04-15',
      updatedAt: '2026-08-01',
      filter: { statusIds: ['to-do'], priorityIds: ['urgent', 'high', 'medium'] },
   },
   {
      id: 'qa-handoff',
      teamId: 'WEB',
      name: 'QA handoff',
      description: 'Tickets sent by engineering for acceptance testing',
      icon: '🧪',
      type: 'issue',
      owner: users[2],
      createdAt: '2026-04-22',
      updatedAt: '2026-07-25',
      filter: { statusIds: ['technical-review', 'product-feedback'] },
   },
   {
      id: 'active-bugs',
      teamId: 'CORE',
      name: 'Active bugs',
      description: 'Active issues tagged with Bug labels',
      icon: '🐞',
      type: 'issue',
      owner: users[0],
      createdAt: '2026-02-11',
      updatedAt: '2026-08-02',
      filter: { labelIds: ['bug'], statusCategories: ['unstarted', 'started', 'triage'] },
   },
   {
      id: 'active-cycle-issues',
      teamId: 'AI',
      name: 'Active cycle issues',
      description: 'Issues in an active cycle for specific teams',
      icon: '🔄',
      type: 'issue',
      owner: users[4],
      createdAt: '2026-05-02',
      updatedAt: '2026-07-31',
      filter: { statusCategories: ['started'] },
   },
   {
      id: 'unassigned-active',
      teamId: 'AI',
      name: 'Active issues without assignee',
      description: 'Issues in active cycles, not assigned to specific users',
      icon: '🫥',
      type: 'issue',
      owner: users[6],
      createdAt: '2026-05-20',
      updatedAt: '2026-07-18',
      filter: { statusCategories: ['unstarted', 'started'], unassigned: true },
   },
   {
      id: 'manual-bug-reports',
      name: 'Manual bug reports',
      description: 'Issues tagged with Bug label and reported by the team',
      icon: '📝',
      type: 'issue',
      owner: users[1],
      createdAt: '2026-06-03',
      updatedAt: '2026-07-29',
      filter: { labelIds: ['bug'] },
   },
   {
      id: 'security-review',
      name: 'Security review queue',
      description: 'Issues tagged Security awaiting a hardening pass',
      icon: '🔐',
      type: 'issue',
      owner: users[8],
      createdAt: '2026-06-10',
      updatedAt: '2026-07-22',
      filter: { labelIds: ['security'] },
   },
   {
      id: 'completed-issues',
      name: 'Completed issues',
      description: 'Everything shipped or done across the workspace',
      icon: '🏆',
      type: 'issue',
      owner: users[0],
      createdAt: '2026-01-30',
      updatedAt: '2026-08-03',
      filter: { statusCategories: ['completed'] },
   },
   /* -------------------------------- projects ------------------------------- */
   {
      id: 'decision-record-roadmap',
      name: '(DR) Decision record roadmap',
      description: 'Projects accessible to the leads team',
      icon: '🗂️',
      type: 'project',
      owner: users[1],
      createdAt: '2026-03-08',
      updatedAt: '2026-07-15',
      filter: { priorityIds: ['urgent', 'high'] },
   },
   {
      id: 'all-active-projects',
      name: 'All projects',
      description: 'Projects that are currently in progress',
      icon: '📦',
      type: 'project',
      owner: users[0],
      createdAt: '2026-02-14',
      updatedAt: '2026-08-01',
      filter: { statusCategories: ['started'] },
   },
   {
      id: 'roadmap-core',
      teamId: 'CORE',
      name: 'Roadmap — Core components',
      description: 'Projects accessible to the LNDev Core team',
      icon: '🛠️',
      type: 'project',
      owner: users[2],
      createdAt: '2026-03-22',
      updatedAt: '2026-07-27',
      filter: {},
   },
   {
      id: 'roadmap-design',
      teamId: 'DESIGN',
      name: 'Roadmap — Design System',
      description: 'Projects accessible to the Design System team in the Backlog status',
      icon: '🎨',
      type: 'project',
      owner: users[3],
      createdAt: '2026-04-05',
      updatedAt: '2026-07-19',
      filter: { statusCategories: ['backlog'] },
   },
   {
      id: 'roadmap-performance',
      teamId: 'PERF',
      name: 'Roadmap — Performance Lab',
      description: 'Projects with target dates between July and October 2026',
      icon: '☀️',
      type: 'project',
      owner: users[4],
      createdAt: '2026-04-18',
      updatedAt: '2026-07-24',
      filter: {},
   },
   {
      id: 'roadmap-web',
      teamId: 'WEB',
      name: 'Roadmap — Web platform',
      description: 'Projects accessible to the Web Development team',
      icon: '🌐',
      type: 'project',
      owner: users[5],
      createdAt: '2026-05-09',
      updatedAt: '2026-07-30',
      filter: {},
   },
   {
      id: 'roadmap-mobile',
      teamId: 'MOBILE',
      name: 'Roadmap — Mobile (WIP)',
      description: 'Projects accessible to the Mobile team',
      icon: '📱',
      type: 'project',
      owner: users[6],
      createdAt: '2026-06-12',
      updatedAt: '2026-08-02',
      filter: { statusCategories: ['unstarted', 'backlog'] },
   },
];

export const issueViews = views.filter((view) => view.type === 'issue');
export const projectViews = views.filter((view) => view.type === 'project');

export function getViewsByTeam(teamId: string): View[] {
   return views.filter((view) => view.teamId === teamId);
}

export function getViewById(id: string): View | undefined {
   return views.find((view) => view.id === id);
}

/** Apply an issue view's declarative filter to the issue list. */
export function filterIssuesForView(view: View, source: Issue[] = issues): Issue[] {
   const { filter } = view;
   return source.filter((issue) => {
      if (filter.statusCategories && !filter.statusCategories.includes(issue.status.category)) {
         return false;
      }
      if (filter.statusIds && !filter.statusIds.includes(issue.status.id)) return false;
      if (filter.labelIds && !issue.labels.some((label) => filter.labelIds?.includes(label.id))) {
         return false;
      }
      if (filter.priorityIds && !filter.priorityIds.includes(issue.priority.id)) return false;
      if (filter.hasProject && !issue.project) return false;
      if (filter.unassigned && issue.assignee) return false;
      return true;
   });
}

/** Apply a project view's declarative filter to the project list. */
export function filterProjectsForView(view: View, source: Project[] = projects): Project[] {
   const { filter } = view;
   return source.filter((project) => {
      if (filter.statusCategories && !filter.statusCategories.includes(project.status.category)) {
         return false;
      }
      if (filter.priorityIds && !filter.priorityIds.includes(project.priority.id)) return false;
      return true;
   });
}
