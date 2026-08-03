'use client';

import { Issue } from '@/mock-data/issues';
import { Project } from '@/mock-data/projects';
import { useIssuesStore } from '@/store/issues-store';
import { useProjectsDisplayStore } from '@/store/projects-display-store';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { HealthPopover } from './health-popover';
import { PrioritySelector } from './priority-selector';
import { LeadSelector } from './lead-selector';
import { StatusWithPercent } from './status-with-percent';
import { DatePicker } from './date-picker';

interface ProjectLineProps {
   project: Project;
}

const countIssues = (issues: Issue[], projectId: string) =>
   issues.filter((issue) => issue.project?.id === projectId).length;

export default function ProjectLine({ project }: ProjectLineProps) {
   const { orgId } = useParams<{ orgId: string }>();
   const { issues } = useIssuesStore();
   const { displayProperties } = useProjectsDisplayStore();
   const issueCount = useMemo(() => countIssues(issues, project.id), [issues, project.id]);

   return (
      <div className="w-full flex items-center py-3 px-6 border-b hover:bg-sidebar/50 border-muted-foreground/5 text-sm">
         <div className="flex-1 min-w-0 flex items-center gap-2">
            <div className="relative">
               <div className="inline-flex size-6 bg-muted/50 items-center justify-center rounded shrink-0">
                  <project.icon className="size-4" />
               </div>
            </div>
            <div className="flex flex-col items-start overflow-hidden">
               <Link
                  href={`/${orgId}/project/${project.id}/overview`}
                  className="font-medium truncate w-full hover:underline underline-offset-2"
               >
                  {project.name}
               </Link>
            </div>
            {displayProperties.labels &&
               project.labels.map((label) => (
                  <span
                     key={label.id}
                     className="hidden lg:inline-flex items-center gap-1 text-[11px] border rounded-full px-1.5 py-px text-muted-foreground shrink-0"
                  >
                     <span
                        className="size-1.5 rounded-full"
                        style={{ backgroundColor: label.color }}
                     />
                     {label.name}
                  </span>
               ))}
         </div>

         {displayProperties.health && (
            <div className="hidden sm:block w-[120px] shrink-0">
               <HealthPopover project={project} />
            </div>
         )}
         {displayProperties.priority && (
            <div className="hidden md:block w-[70px] shrink-0">
               <PrioritySelector priority={project.priority} />
            </div>
         )}
         {displayProperties.lead && (
            <div className="hidden xl:block w-[130px] shrink-0">
               <LeadSelector lead={project.lead} />
            </div>
         )}
         {displayProperties.targetDate && (
            <div className="hidden xl:block w-[110px] shrink-0">
               <DatePicker date={project.targetDate ? new Date(project.targetDate) : undefined} />
            </div>
         )}
         {displayProperties.issues && (
            <div className="hidden xl:block w-[60px] shrink-0 text-muted-foreground text-xs pl-2.5">
               {issueCount}
            </div>
         )}
         {displayProperties.status && (
            <div className="w-[90px] shrink-0">
               <StatusWithPercent
                  status={project.status}
                  percentComplete={project.percentComplete}
               />
            </div>
         )}
      </div>
   );
}
