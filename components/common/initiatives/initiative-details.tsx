'use client';

import ProjectsTimeline from '@/components/common/projects/projects-timeline';
import { ProjectGroup } from '@/components/common/projects/projects';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
   countCompletedProjects,
   getInitiativeById,
   getInitiativeProjects,
   Initiative,
   INITIATIVE_STATUS_META,
} from '@/mock-data/initiatives';
import { Project } from '@/mock-data/projects';
import {
   CalendarRange,
   ChevronDown,
   FilePenLine,
   FileText,
   Plus,
   Tag,
   UserRound,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { parseAsStringLiteral, useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { InitiativeProgressPanel } from './initiative-progress-panel';
import { InitiativeStatusIcon } from './initiative-status-icon';

const TABS = ['overview', 'activity', 'projects'] as const;

const formatTarget = (iso: string): string => {
   const [, month, day] = iso.split('-').map(Number);
   const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
   ];
   return `${months[(month ?? 1) - 1]} ${day}`;
};

/* ------------------------------ projects table ---------------------------- */

const GROUP_ORDER: { key: string; label: string; match: (project: Project) => boolean }[] = [
   { key: 'in-progress', label: 'In Progress', match: (p) => p.status.category === 'started' },
   { key: 'planned', label: 'Planned', match: (p) => p.status.category === 'unstarted' },
   {
      key: 'backlog',
      label: 'Backlog',
      match: (p) => p.status.category === 'backlog' || p.status.category === 'triage',
   },
   { key: 'completed', label: 'Completed', match: (p) => p.status.category === 'completed' },
];

function ProjectsSection({ initiative }: { initiative: Initiative }) {
   const { orgId } = useParams<{ orgId: string }>();
   const projects = getInitiativeProjects(initiative);
   const groups = GROUP_ORDER.map((group) => ({
      ...group,
      projects: projects.filter(group.match),
   })).filter((group) => group.projects.length > 0);

   return (
      <section className="flex flex-col gap-2">
         <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Projects</h2>
            <Plus className="size-4 text-muted-foreground" />
         </div>
         <div className="flex items-center gap-2 py-1.5 text-xs text-muted-foreground border-b">
            <span className="flex-1">Name</span>
            <span className="hidden sm:block w-16 shrink-0">Health</span>
            <span className="hidden sm:block w-16 shrink-0">Priority</span>
            <span className="hidden md:block w-12 shrink-0">Lead</span>
            <span className="hidden md:block w-24 shrink-0">Target date</span>
            <span className="w-16 shrink-0">Status</span>
         </div>
         {groups.map((group) => (
            <div key={group.key} className="flex flex-col">
               <div className="flex items-center gap-2 py-1.5 text-xs text-muted-foreground">
                  <ChevronDown className="size-3" />
                  {group.label}
                  <span className="flex-1 border-b border-border/60" />
               </div>
               {group.projects.map((project) => (
                  <Link
                     key={project.id}
                     href={`/${orgId}/project/${project.id}/overview`}
                     className="flex items-center gap-2 py-2 text-sm hover:bg-sidebar/50 rounded-md px-1 -mx-1 transition-colors"
                  >
                     <project.icon className="size-4 text-muted-foreground shrink-0" />
                     <span className="flex-1 truncate font-medium">{project.name}</span>
                     <span className="hidden sm:block w-16 shrink-0">
                        <span
                           className="size-2.5 rounded-full inline-block"
                           style={{ backgroundColor: project.health.color }}
                        />
                     </span>
                     <span className="hidden sm:block w-16 shrink-0">
                        <project.priority.icon className="size-4 text-muted-foreground" />
                     </span>
                     <span className="hidden md:block w-12 shrink-0">
                        <Avatar className="size-5">
                           <AvatarImage src={project.lead.avatarUrl} alt={project.lead.name} />
                           <AvatarFallback className="text-[9px]">
                              {project.lead.name[0]}
                           </AvatarFallback>
                        </Avatar>
                     </span>
                     <span className="hidden md:flex items-center gap-1 w-24 shrink-0 text-xs text-muted-foreground">
                        {project.targetDate ? (
                           <>
                              <CalendarRange className="size-3.5" />
                              {formatTarget(project.targetDate)}
                           </>
                        ) : (
                           '—'
                        )}
                     </span>
                     <span className="w-16 shrink-0 text-xs text-muted-foreground">
                        {project.percentComplete}%
                     </span>
                  </Link>
               ))}
            </div>
         ))}
      </section>
   );
}

/* ------------------------------- overview tab ----------------------------- */

function PropertyRow({ label, children }: { label: string; children: React.ReactNode }) {
   return (
      <div className="flex items-center gap-2 text-sm">
         <span className="w-24 text-muted-foreground text-xs shrink-0">{label}</span>
         {children}
      </div>
   );
}

function Overview({ initiative }: { initiative: Initiative }) {
   const completed = countCompletedProjects(initiative);
   const total = initiative.projectIds.length;

   return (
      <div className="w-full h-full flex overflow-hidden">
         <div className="flex-1 min-w-0 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-8 py-10 flex flex-col gap-6">
               <span className="inline-flex size-10 items-center justify-center rounded-md bg-muted/50 text-2xl">
                  {initiative.icon}
               </span>
               <div className="flex flex-col gap-2">
                  <h1 className="text-2xl font-semibold">{initiative.name}</h1>
                  <p className="text-sm text-muted-foreground">
                     {initiative.description ?? 'Add a short summary…'}
                  </p>
               </div>

               <div className="flex items-center gap-3 flex-wrap text-sm">
                  <span className="text-muted-foreground text-xs w-24">Properties</span>
                  <span className="inline-flex items-center gap-1.5">
                     <InitiativeStatusIcon status={initiative.status} />
                     {INITIATIVE_STATUS_META[initiative.status].label}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                     <initiative.priority.icon className="size-4" />
                     {initiative.priority.name}
                  </span>
                  {initiative.owner ? (
                     <span className="inline-flex items-center gap-1.5">
                        <Avatar className="size-4">
                           <AvatarImage
                              src={initiative.owner.avatarUrl}
                              alt={initiative.owner.name}
                           />
                           <AvatarFallback className="text-[8px]">
                              {initiative.owner.name[0]}
                           </AvatarFallback>
                        </Avatar>
                        {initiative.owner.name}
                     </span>
                  ) : (
                     <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                        <UserRound className="size-4" /> Owner
                     </span>
                  )}
                  {initiative.target && (
                     <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                        <CalendarRange className="size-4" />
                        {initiative.target}
                     </span>
                  )}
               </div>

               <div className="flex items-center gap-3 text-sm">
                  <span className="text-muted-foreground text-xs w-24">Resources</span>
                  <button className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                     <Plus className="size-4" />
                     Add document or link…
                  </button>
               </div>

               <button className="flex items-center justify-center gap-2 rounded-lg border py-4 text-sm text-muted-foreground hover:bg-accent/40 transition-colors">
                  <FilePenLine className="size-4" />
                  Write first initiative update
               </button>

               <div className="flex flex-col gap-2">
                  <h2 className="text-sm font-medium">Description</h2>
                  <p className="text-sm text-muted-foreground">
                     {initiative.description ?? 'Add description…'}
                  </p>
               </div>

               <ProjectsSection initiative={initiative} />
            </div>
         </div>

         <aside className="hidden lg:flex flex-col w-80 shrink-0 border-l h-full overflow-y-auto p-5 gap-6 bg-container">
            <div className="flex flex-col gap-3">
               <span className="text-sm font-medium">Properties</span>
               <PropertyRow label="Status">
                  <span className="inline-flex items-center gap-1.5">
                     <InitiativeStatusIcon status={initiative.status} />
                     {INITIATIVE_STATUS_META[initiative.status].label}
                  </span>
               </PropertyRow>
               <PropertyRow label="Priority">
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                     <initiative.priority.icon className="size-4" />
                     {initiative.priority.name}
                  </span>
               </PropertyRow>
               <PropertyRow label="Owner">
                  {initiative.owner ? (
                     <span className="inline-flex items-center gap-1.5">
                        <Avatar className="size-4">
                           <AvatarImage
                              src={initiative.owner.avatarUrl}
                              alt={initiative.owner.name}
                           />
                           <AvatarFallback className="text-[8px]">
                              {initiative.owner.name[0]}
                           </AvatarFallback>
                        </Avatar>
                        {initiative.owner.name}
                     </span>
                  ) : (
                     <span className="text-muted-foreground inline-flex items-center gap-1.5">
                        <UserRound className="size-4" /> Add owner
                     </span>
                  )}
               </PropertyRow>
               <PropertyRow label="Target date">
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                     <CalendarRange className="size-4" />
                     {initiative.target ?? 'Add target date'}
                  </span>
               </PropertyRow>
               <PropertyRow label="Labels">
                  <span className="text-muted-foreground inline-flex items-center gap-1.5">
                     <Tag className="size-4" /> Add label
                  </span>
               </PropertyRow>
               <PropertyRow label="Projects">
                  <span className="text-muted-foreground text-xs">
                     {completed} / {total} completed
                  </span>
               </PropertyRow>
            </div>

            <InitiativeProgressPanel initiative={initiative} />

            <div className="flex flex-col gap-3">
               <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Activity</span>
                  <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                     See all
                  </button>
               </div>
               <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                  <span className="flex items-start gap-2">
                     <FilePenLine className="size-3.5 mt-px shrink-0" />
                     {initiative.owner?.name ?? 'someone'} renamed the initiative ·{' '}
                     {formatTarget(initiative.createdAt)}
                  </span>
                  <span className="flex items-start gap-2">
                     <FileText className="size-3.5 mt-px shrink-0" />
                     {initiative.owner?.name ?? 'someone'} created the initiative ·{' '}
                     {formatTarget(initiative.createdAt)}
                  </span>
               </div>
            </div>
         </aside>
      </div>
   );
}

/* ------------------------------- activity tab ----------------------------- */

function Activity({ initiative }: { initiative: Initiative }) {
   const events = [
      {
         label: `${initiative.owner?.name ?? 'someone'} created the initiative`,
         date: formatTarget(initiative.createdAt),
      },
      {
         label: `${initiative.owner?.name ?? 'someone'} changed the status to ${INITIATIVE_STATUS_META[initiative.status].label}`,
         date: formatTarget(initiative.createdAt),
      },
      {
         label: `${initiative.projectIds.length} projects added to the initiative`,
         date: formatTarget(initiative.createdAt),
      },
   ];
   return (
      <div className="max-w-2xl mx-auto px-8 py-10 flex flex-col gap-4 w-full">
         <h2 className="text-lg font-medium">Activity</h2>
         <div className="flex flex-col">
            {events.map((event, index) => (
               <div
                  key={index}
                  className="flex items-center gap-3 py-3 border-b border-border/50 text-sm"
               >
                  <FileText className="size-4 text-muted-foreground shrink-0" />
                  <span className="flex-1">{event.label}</span>
                  <span className="text-xs text-muted-foreground">{event.date}</span>
               </div>
            ))}
         </div>
      </div>
   );
}

/* ---------------------------------- export -------------------------------- */

/** Initiative detail page: Overview / Activity / Projects tabs. */
export default function InitiativeDetails({ initiativeId }: { initiativeId: string }) {
   const [tab] = useQueryState('tab', parseAsStringLiteral(TABS).withDefault('overview'));
   const initiative = getInitiativeById(initiativeId);

   const timelineGroups = useMemo<ProjectGroup[]>(() => {
      if (!initiative) return [];
      return [
         {
            id: initiative.id,
            name: initiative.name,
            icon: initiative.icon,
            projects: getInitiativeProjects(initiative),
         },
      ];
   }, [initiative]);

   if (!initiative) {
      return (
         <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
            Initiative not found
         </div>
      );
   }

   if (tab === 'activity') return <Activity initiative={initiative} />;
   if (tab === 'projects') return <ProjectsTimeline groups={timelineGroups} />;
   return <Overview initiative={initiative} />;
}
