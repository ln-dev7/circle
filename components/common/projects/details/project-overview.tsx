'use client';

import { ContentBlocks } from '@/components/common/issues/details/content-blocks';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getProjectDetail } from '@/mock-data/project-details';
import { getProjectById } from '@/mock-data/projects';
import { useIssuesStore } from '@/store/issues-store';
import { teams } from '@/mock-data/teams';
import { format, parseISO } from 'date-fns';
import { ArrowRight, ChevronDown, FileText, PenLine, Plus } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo, useRef } from 'react';
import { DocumentOutline, getOutlineItems } from './document-outline';
import { ProjectSidePanel } from './project-side-panel';

interface ProjectOverviewProps {
   projectId: string;
}

const formatDay = (iso?: string) => (iso ? format(parseISO(iso), 'MMM do') : '—');

/** Project "Overview" tab: description column + properties side panel. */
export default function ProjectOverview({ projectId }: ProjectOverviewProps) {
   const project = getProjectById(projectId)!;
   const detail = getProjectDetail(projectId);
   const { issues: allIssues } = useIssuesStore();
   const issues = useMemo(
      () => allIssues.filter((issue) => issue.project?.id === project.id),
      [allIssues, project.id]
   );

   const { orgId } = useParams<{ orgId: string }>();
   const team = teams.find((candidate) => candidate.id === project.teamId);
   const scrollRef = useRef<HTMLDivElement>(null);
   const outlineItems = useMemo(() => getOutlineItems(detail.description), [detail.description]);

   return (
      <div className="w-full h-full flex overflow-hidden">
         {/* Main column */}
         <div className="flex-1 min-w-0 h-full relative">
            <DocumentOutline items={outlineItems} scrollRef={scrollRef} />
            <div ref={scrollRef} className="h-full overflow-y-auto">
            <div className="max-w-3xl mx-auto px-6 lg:px-10 py-10">
               <div className="inline-flex size-10 bg-muted/50 items-center justify-center rounded-md mb-4">
                  <project.icon className="size-6" />
               </div>
               <h1 className="text-3xl font-semibold tracking-tight">{project.name}</h1>
               <p className="mt-3 text-muted-foreground leading-relaxed">{detail.summary}</p>

               {/* Inline properties */}
               <div className="mt-6 flex flex-col gap-2.5 text-sm">
                  <div className="flex items-center gap-3">
                     <span className="w-24 text-muted-foreground shrink-0">Properties</span>
                     <div className="flex items-center gap-3 flex-wrap">
                        <span className="inline-flex items-center gap-1.5">
                           <project.status.icon />
                           {project.status.name}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                           <project.priority.icon className="size-3.5 text-muted-foreground" />
                           {project.priority.name}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                           <Avatar className="size-4">
                              <AvatarImage src={project.lead.avatarUrl} alt={project.lead.name} />
                              <AvatarFallback>{project.lead.name[0]}</AvatarFallback>
                           </Avatar>
                           {project.lead.name}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                           {formatDay(project.startDate)}
                           <ArrowRight className="size-3" />
                           {formatDay(project.targetDate)}
                        </span>
                        {team && (
                           <span className="inline-flex items-center gap-1.5">
                              {team.icon} {team.name}
                           </span>
                        )}
                     </div>
                  </div>

                  {project.initiative && (
                     <div className="flex items-center gap-3">
                        <span className="w-24 text-muted-foreground shrink-0">Initiatives</span>
                        <span className="inline-flex items-center gap-1.5">
                           📄 {project.initiative}
                           <button className="text-muted-foreground hover:text-foreground transition-colors">
                              <Plus className="size-3.5" />
                           </button>
                        </span>
                     </div>
                  )}

                  <div className="flex items-center gap-3">
                     <span className="w-24 text-muted-foreground shrink-0">Labels</span>
                     <div className="flex items-center gap-1.5">
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
                              <ChevronDown className="size-3 text-muted-foreground" />
                           </span>
                        ))}
                        <button className="text-muted-foreground hover:text-foreground transition-colors">
                           <Plus className="size-3.5" />
                        </button>
                     </div>
                  </div>

                  {detail.resources.length > 0 && (
                     <div className="flex items-center gap-3">
                        <span className="w-24 text-muted-foreground shrink-0">Resources</span>
                        <div className="flex items-center gap-2 flex-wrap">
                           {detail.resources.map((resource) => (
                              <a
                                 key={resource.label}
                                 href={resource.url}
                                 className="inline-flex items-center gap-1.5 text-xs border rounded-md px-2 py-1 hover:bg-accent/50 transition-colors"
                              >
                                 <FileText className="size-3.5 text-muted-foreground" />
                                 {resource.label}
                              </a>
                           ))}
                           <button className="text-muted-foreground hover:text-foreground transition-colors">
                              <Plus className="size-3.5" />
                           </button>
                        </div>
                     </div>
                  )}
               </div>

               {/* Update CTA */}
               <Link
                  href={`/${orgId}/project/${project.id}/activity`}
                  className="mt-8 flex items-center justify-center gap-2 border rounded-lg py-4 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/30 transition-colors"
               >
                  <PenLine className="size-4" />
                  Write {detail.updates.length === 0 ? 'first ' : ''}project update
               </Link>

               {/* Description */}
               <div className="mt-10">
                  <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground mb-2">
                     Description
                     <ChevronDown className="size-3.5" />
                  </div>
                  <div className="text-[15px] leading-relaxed">
                     <ContentBlocks blocks={detail.description} />
                  </div>
               </div>
            </div>
            </div>
         </div>

         {/* Side panel */}
         <ProjectSidePanel project={project} detail={detail} issues={issues} />
      </div>
   );
}
