'use client';

import { ContentBlocks } from '@/components/common/issues/details/content-blocks';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import {
   getProjectDetail,
   ProjectUpdate,
   ProjectUpdateHealth,
   projectUpdateHealthColor,
   projectUpdateHealthLabel,
} from '@/mock-data/project-details';
import { getProjectById } from '@/mock-data/projects';
import { useIssuesStore } from '@/store/issues-store';
import { useProjectUpdatesStore } from '@/store/project-updates-store';
import { format, parseISO } from 'date-fns';
import { Paperclip, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ProjectSidePanel } from './project-side-panel';

interface ProjectActivityProps {
   projectId: string;
}

function HealthBadge({ health }: { health: ProjectUpdateHealth }) {
   return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium rounded-full border px-2 py-0.5">
         <span
            className="size-2 rounded-full"
            style={{ backgroundColor: projectUpdateHealthColor[health] }}
         />
         {projectUpdateHealthLabel[health]}
      </span>
   );
}

function UpdateCard({ update }: { update: ProjectUpdate }) {
   return (
      <div className="border rounded-lg p-4">
         <div className="flex items-center gap-2 text-sm">
            <Avatar className="size-5">
               <AvatarImage src={update.author.avatarUrl} alt={update.author.name} />
               <AvatarFallback>{update.author.name[0]}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{update.author.name}</span>
            <span className="text-xs text-muted-foreground">
               {format(parseISO(update.date), 'MMM d')}
            </span>
            <span className="ml-auto">
               <HealthBadge health={update.health} />
            </span>
         </div>
         <div className="mt-2 text-sm leading-relaxed">
            <ContentBlocks blocks={update.blocks} />
         </div>
      </div>
   );
}

/** Project "Activity" tab: update composer + monthly timeline. */
export default function ProjectActivity({ projectId }: ProjectActivityProps) {
   const project = getProjectById(projectId)!;
   const detail = getProjectDetail(projectId);
   const { issues: allIssues } = useIssuesStore();
   const issues = useMemo(
      () => allIssues.filter((issue) => issue.project?.id === project.id),
      [allIssues, project.id]
   );
   const { postedUpdates, postUpdate } = useProjectUpdatesStore();
   const [mode, setMode] = useState<'comment' | 'update'>('update');
   const [health, setHealth] = useState<ProjectUpdateHealth>('on-track');
   const [text, setText] = useState('');

   const updates = useMemo<ProjectUpdate[]>(
      () => [...(postedUpdates[project.id] ?? []), ...detail.updates],
      [postedUpdates, project.id, detail.updates]
   );

   const updatesByMonth = useMemo(() => {
      const groups = new Map<string, ProjectUpdate[]>();
      for (const update of updates) {
         const month = format(parseISO(update.date), 'MMMM');
         groups.set(month, [...(groups.get(month) ?? []), update]);
      }
      return [...groups.entries()];
   }, [updates]);

   const completedPercent =
      issues.length > 0
         ? Math.round(
              (issues.filter((issue) => issue.status.category === 'completed').length /
                 issues.length) *
                 100
           )
         : 0;

   const handlePost = () => {
      if (text.trim() === '') return;
      postUpdate(project.id, health, text);
      setText('');
   };

   return (
      <div className="w-full h-full flex overflow-hidden">
         <div className="flex-1 min-w-0 h-full overflow-y-auto">
            <div className="max-w-3xl mx-auto px-6 lg:px-10 py-8">
               {/* Composer */}
               <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2">
                     <div className="flex items-center rounded-md border p-0.5 text-xs">
                        {(['comment', 'update'] as const).map((value) => (
                           <button
                              key={value}
                              type="button"
                              onClick={() => setMode(value)}
                              className={cn(
                                 'px-2 py-1 rounded-[5px] capitalize transition-colors',
                                 mode === value
                                    ? 'bg-accent text-foreground'
                                    : 'text-muted-foreground hover:text-foreground'
                              )}
                           >
                              {value}
                           </button>
                        ))}
                     </div>
                     {mode === 'update' && (
                        <DropdownMenu>
                           <DropdownMenuTrigger className="outline-none">
                              <HealthBadge health={health} />
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="start" className="w-40">
                              {(Object.keys(projectUpdateHealthLabel) as ProjectUpdateHealth[]).map(
                                 (value) => (
                                    <DropdownMenuItem key={value} onClick={() => setHealth(value)}>
                                       <span
                                          className="size-2 rounded-full"
                                          style={{
                                             backgroundColor: projectUpdateHealthColor[value],
                                          }}
                                       />
                                       {projectUpdateHealthLabel[value]}
                                    </DropdownMenuItem>
                                 )
                              )}
                           </DropdownMenuContent>
                        </DropdownMenu>
                     )}
                  </div>

                  <textarea
                     value={text}
                     onChange={(event) => setText(event.target.value)}
                     placeholder={mode === 'update' ? 'Write a project update…' : 'Leave a comment…'}
                     className="mt-3 w-full min-h-24 resize-y bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  />

                  {mode === 'update' && (
                     <div className="mt-1 border-l-2 pl-4 py-1 flex flex-col gap-1.5 text-xs text-muted-foreground">
                        <div className="flex gap-6">
                           <span className="w-20">Priority</span>
                           <span>
                              No priority → <span className="text-foreground">{project.priority.name}</span>
                           </span>
                        </div>
                        <div className="flex gap-6">
                           <span className="w-20">Lead</span>
                           <span>
                              <span className="text-foreground">{project.lead.name}</span> assigned
                           </span>
                        </div>
                        <div className="flex gap-6">
                           <span className="w-20">Target date</span>
                           <span>
                              set to{' '}
                              <span className="text-foreground">
                                 {project.targetDate
                                    ? format(parseISO(project.targetDate), 'MMM do')
                                    : '—'}
                              </span>
                           </span>
                        </div>
                        <div className="flex gap-6">
                           <span className="w-20">Progress</span>
                           <span>
                              0% → <span className="text-foreground">{completedPercent}%</span>
                           </span>
                        </div>
                     </div>
                  )}

                  <div className="mt-3 flex items-center justify-between">
                     <Button variant="outline" size="xs" className="gap-1.5">
                        <Sparkles className="size-3.5" />
                        Write with Agent
                     </Button>
                     <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="size-7 text-muted-foreground">
                           <Paperclip className="size-4" />
                        </Button>
                        <Button size="xs" onClick={handlePost} disabled={text.trim() === ''}>
                           Post {mode === 'update' ? 'update' : 'comment'}
                        </Button>
                     </div>
                  </div>
               </div>

               {/* Timeline */}
               {updatesByMonth.length === 0 ? (
                  <p className="mt-10 text-sm text-muted-foreground text-center">
                     No updates yet — post the first one to keep the team in the loop.
                  </p>
               ) : (
                  updatesByMonth.map(([month, monthUpdates]) => (
                     <div key={month} className="mt-8">
                        <h3 className="text-lg font-semibold mb-3">{month}</h3>
                        <div className="flex flex-col gap-3">
                           {monthUpdates.map((update) => (
                              <UpdateCard key={update.id} update={update} />
                           ))}
                        </div>
                     </div>
                  ))
               )}
            </div>
         </div>

         <ProjectSidePanel project={project} detail={detail} issues={issues} />
      </div>
   );
}
