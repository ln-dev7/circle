'use client';

import { CapacityRing } from '@/components/common/cycles/capacity-ring';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Project } from '@/mock-data/projects';
import { useProjectsDisplayStore } from '@/store/projects-display-store';
import { format, parseISO } from 'date-fns';
import { Calendar } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ProjectGroup } from './projects';

function ProjectCard({ project }: { project: Project }) {
   const { orgId } = useParams<{ orgId: string }>();
   const { displayProperties } = useProjectsDisplayStore();

   return (
      <div className="rounded-md border bg-container p-3 hover:bg-accent/30 transition-colors">
         <div className="flex items-start gap-2">
            <span className="inline-flex size-6 bg-muted/50 items-center justify-center rounded shrink-0">
               <project.icon className="size-4" />
            </span>
            <Link
               href={`/${orgId}/project/${project.id}/overview`}
               className="text-sm font-medium leading-snug hover:underline underline-offset-2 min-w-0"
            >
               {project.name}
            </Link>
         </div>

         {displayProperties.health && (
            <div className="mt-2.5 flex items-center gap-1.5 text-xs text-muted-foreground">
               <span
                  className="size-2 rounded-full shrink-0"
                  style={{ backgroundColor: project.health.color }}
               />
               {project.health.name}
               {project.healthUpdatedAgoDays !== undefined && (
                  <span>· {project.healthUpdatedAgoDays}d</span>
               )}
            </div>
         )}

         {displayProperties.labels && project.labels.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
               {project.labels.map((label) => (
                  <span
                     key={label.id}
                     className="inline-flex items-center gap-1 text-[11px] border rounded-full px-1.5 py-px"
                  >
                     <span
                        className="size-1.5 rounded-full"
                        style={{ backgroundColor: label.color }}
                     />
                     {label.name}
                  </span>
               ))}
            </div>
         )}

         <div className="mt-2.5 flex items-center gap-2 text-xs text-muted-foreground">
            {displayProperties.status && (
               <span className="inline-flex items-center gap-1">
                  <CapacityRing value={project.percentComplete} color="#6771c5" />
                  {project.percentComplete}%
               </span>
            )}
            {displayProperties.priority && (
               <project.priority.icon className="size-3.5 shrink-0" />
            )}
            {displayProperties.targetDate && project.targetDate && (
               <span className="inline-flex items-center gap-1">
                  <Calendar className="size-3" />
                  {format(parseISO(project.targetDate), 'MMM d')}
               </span>
            )}
            {displayProperties.lead && (
               <Avatar className="size-4 ml-auto shrink-0">
                  <AvatarImage src={project.lead.avatarUrl} alt={project.lead.name} />
                  <AvatarFallback>{project.lead.name[0]}</AvatarFallback>
               </Avatar>
            )}
         </div>
      </div>
   );
}

/** Projects "Board" view: one column per group (team by default). */
export default function ProjectsBoard({ groups }: { groups: ProjectGroup[] }) {
   return (
      <div className="w-full h-full overflow-x-auto">
         <div className="flex h-full gap-3 px-4 py-3 min-w-max">
            {groups.map((group) => (
               <div key={group.id} className="w-[320px] shrink-0 h-full flex flex-col">
                  <div className="flex items-center gap-2 px-1 pb-2 text-sm font-medium shrink-0">
                     {group.icon && <span>{group.icon}</span>}
                     {group.name}
                     <span className="text-xs text-muted-foreground">{group.projects.length}</span>
                  </div>
                  <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-2 pb-4">
                     {group.projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                     ))}
                     {group.projects.length === 0 && (
                        <div className="text-xs text-muted-foreground border border-dashed rounded-md p-4 text-center">
                           No projects
                        </div>
                     )}
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
}
