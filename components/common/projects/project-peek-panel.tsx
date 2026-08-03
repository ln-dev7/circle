'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getProjectDetail } from '@/mock-data/project-details';
import { getProjectById } from '@/mock-data/projects';
import { teams } from '@/mock-data/teams';
import { useIssuesStore } from '@/store/issues-store';
import { format, parseISO } from 'date-fns';
import {
   ArrowRight,
   Calendar,
   CalendarPlus,
   ChevronRight,
   Compass,
   Plus,
   Slack,
   Star,
   Tag,
   UserPlus,
   X,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { ProjectProgressChart } from './details/project-progress-chart';

interface ProjectPeekPanelProps {
   projectId: string;
   onClose: () => void;
}

const formatDay = (iso?: string) => (iso ? format(parseISO(iso), 'MMM do') : '—');

function PropertyRow({ label, children }: { label: string; children: React.ReactNode }) {
   return (
      <div className="flex items-center gap-4 min-h-8">
         <span className="text-sm text-muted-foreground w-24 shrink-0">{label}</span>
         <div className="flex items-center gap-1.5 text-sm min-w-0">{children}</div>
      </div>
   );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
   return (
      <div className={`rounded-xl border bg-container shadow-lg p-4 ${className ?? ''}`}>
         {children}
      </div>
   );
}

/**
 * Floating panel opened in place when a project bar is clicked on the
 * timeline (Linear-style "peek"): header, properties, milestones and
 * progress cards stacked over the right side of the timeline.
 */
export function ProjectPeekPanel({ projectId, onClose }: ProjectPeekPanelProps) {
   const { orgId } = useParams<{ orgId: string }>();
   const { issues: allIssues } = useIssuesStore();

   const project = getProjectById(projectId);
   const detail = getProjectDetail(projectId);

   const issues = useMemo(
      () => allIssues.filter((issue) => issue.project?.id === projectId),
      [allIssues, projectId]
   );

   useEffect(() => {
      const onKeyDown = (event: KeyboardEvent) => {
         if (event.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', onKeyDown);
      return () => window.removeEventListener('keydown', onKeyDown);
   }, [onClose]);

   const members = useMemo(() => {
      const seen = new Set<string>();
      return issues
         .map((issue) => issue.assignee)
         .filter((assignee): assignee is NonNullable<typeof assignee> => {
            if (!assignee || seen.has(assignee.id)) return false;
            seen.add(assignee.id);
            return true;
         });
   }, [issues]);

   if (!project) return null;

   const team = teams.find((candidate) => candidate.id === project.teamId);
   const started = issues.filter((issue) => issue.status.category === 'started').length;
   const completed = issues.filter((issue) => issue.status.category === 'completed').length;

   return (
      <aside className="absolute top-10 right-2 bottom-2 w-[400px] max-w-[calc(100%-1rem)] z-40 flex flex-col gap-2 overflow-y-auto">
         {/* Header */}
         <Card className="flex items-center gap-2 py-3">
            <span className="inline-flex size-6 bg-muted/50 items-center justify-center rounded shrink-0">
               <project.icon className="size-3.5" />
            </span>
            <Link
               href={`/${orgId}/project/${project.id}/overview`}
               className="flex-1 min-w-0 flex items-center gap-1.5 group"
               aria-label="Open project"
            >
               <span className="font-medium truncate group-hover:text-foreground/80 transition-colors">
                  {project.name}
               </span>
               <ChevronRight className="size-4 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors" />
            </Link>
            <button className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
               <Star className="size-4" />
            </button>
            <button
               onClick={onClose}
               className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
               aria-label="Close panel"
            >
               <X className="size-4" />
            </button>
         </Card>

         {/* Properties */}
         <Card>
            <div className="flex items-center justify-between mb-1.5">
               <h3 className="text-sm font-medium">Properties</h3>
               <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <Plus className="size-3.5" />
               </button>
            </div>
            <div className="flex flex-col">
               <PropertyRow label="Status">
                  <project.status.icon />
                  <span>{project.status.name}</span>
               </PropertyRow>
               <PropertyRow label="Priority">
                  <project.priority.icon className="size-3.5 text-muted-foreground" />
                  <span>{project.priority.name}</span>
               </PropertyRow>
               <PropertyRow label="Lead">
                  <Avatar className="size-5">
                     <AvatarImage src={project.lead.avatarUrl} alt={project.lead.name} />
                     <AvatarFallback>{project.lead.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="truncate max-w-40">{project.lead.name}</span>
               </PropertyRow>
               <PropertyRow label="Members">
                  {members.length > 0 ? (
                     <span className="inline-flex items-center gap-1.5">
                        <span className="flex -space-x-1.5">
                           {members.slice(0, 3).map((member) => (
                              <Avatar key={member.id} className="size-5 border-2 border-container">
                                 <AvatarImage src={member.avatarUrl} alt={member.name} />
                                 <AvatarFallback>{member.name[0]}</AvatarFallback>
                              </Avatar>
                           ))}
                        </span>
                        {members.length} {members.length === 1 ? 'member' : 'members'}
                     </span>
                  ) : (
                     <button className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                        <UserPlus className="size-3.5" />
                        Add members
                     </button>
                  )}
               </PropertyRow>
               <PropertyRow label="Dates">
                  <span className="inline-flex items-center gap-1">
                     <Calendar className="size-3.5 text-muted-foreground" />
                     {formatDay(project.startDate)}
                  </span>
                  <ArrowRight className="size-3 text-muted-foreground" />
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                     <CalendarPlus className="size-3.5" />
                     {project.targetDate ? (
                        <span className="text-foreground">{formatDay(project.targetDate)}</span>
                     ) : (
                        'Target'
                     )}
                  </span>
               </PropertyRow>
               <PropertyRow label="Teams">
                  <span className="inline-flex items-center gap-1.5">
                     {team?.icon} {team?.name ?? project.teamId}
                  </span>
               </PropertyRow>
               <PropertyRow label="Slack">
                  <button className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                     <Slack className="size-3.5" />
                     Connect channel
                  </button>
               </PropertyRow>
               <PropertyRow label="Initiatives">
                  {project.initiative ? (
                     <span className="truncate max-w-44">{project.initiative}</span>
                  ) : (
                     <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                        <Compass className="size-3.5" />
                        No initiative
                     </span>
                  )}
               </PropertyRow>
               <PropertyRow label="Labels">
                  <div className="flex items-center gap-1.5">
                     {project.labels.length === 0 && (
                        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                           <Tag className="size-3.5" />
                           Add label
                        </span>
                     )}
                     {project.labels.map((label) => (
                        <span
                           key={label.id}
                           className="inline-flex items-center gap-1 text-xs border rounded-full px-2 py-0.5"
                        >
                           <span
                              className="size-2 rounded-full"
                              style={{ backgroundColor: label.color }}
                           />
                           {label.name}
                        </span>
                     ))}
                  </div>
               </PropertyRow>
            </div>
         </Card>

         {/* Milestones */}
         <Card>
            <div className="flex items-center justify-between mb-2">
               <h3 className="text-sm font-medium">Milestones</h3>
               <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <Plus className="size-3.5" />
               </button>
            </div>
            {detail.milestones.length === 0 ? (
               <p className="text-xs text-muted-foreground">
                  Add milestones to organize work within your project and break it into more
                  granular stages. <span className="text-foreground/70 underline">Learn more</span>
               </p>
            ) : (
               <div className="flex flex-col gap-1.5">
                  {detail.milestones.map((milestone) => (
                     <div
                        key={milestone.id}
                        className="flex items-center justify-between gap-2 text-sm"
                     >
                        <span
                           className={
                              milestone.completed
                                 ? 'line-through text-muted-foreground truncate'
                                 : 'truncate'
                           }
                        >
                           {milestone.name}
                        </span>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                           {formatDay(milestone.targetDate)}
                        </span>
                     </div>
                  ))}
               </div>
            )}
         </Card>

         {/* Progress */}
         <Card>
            <h3 className="text-sm font-medium mb-3">Progress</h3>
            <div className="grid grid-cols-3 gap-2 mb-2">
               <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                     <span className="size-2 rounded-[2px] bg-[#8f9299]" />
                     Scope
                  </div>
                  <span className="text-sm font-medium">{issues.length}</span>
               </div>
               <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                     <span className="size-2 rounded-[2px] bg-[#facc15]" />
                     Started
                  </div>
                  <span className="text-sm font-medium">{started}</span>
               </div>
               <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                     <span className="size-2 rounded-[2px] bg-[#6771c5]" />
                     Completed
                  </div>
                  <span className="text-sm font-medium">{completed}</span>
               </div>
            </div>
            <ProjectProgressChart
               startDate={project.startDate}
               endDate={project.targetDate ?? project.startDate}
               scope={issues.length}
               started={started}
               completed={completed}
            />
         </Card>
      </aside>
   );
}
