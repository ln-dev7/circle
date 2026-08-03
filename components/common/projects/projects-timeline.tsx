'use client';

import { CapacityRing } from '@/components/common/cycles/capacity-ring';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Project } from '@/mock-data/projects';
import { useProjectsDisplayStore } from '@/store/projects-display-store';
import { format, parseISO } from 'date-fns';
import { ArrowLeft, ArrowRight, ChevronDown, Plus } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ProjectGroup } from './projects';

interface ProjectsTimelineProps {
   groups: ProjectGroup[];
}

/* Wide, deterministic range (feels infinite): Jan 2020 → Dec 2032 (SSR safe). */
const RANGE_START = Date.UTC(2020, 0, 1);
const RANGE_END = Date.UTC(2032, 11, 31);
const MONTH_WIDTH = 120;
/** Width of the sticky project list column. */
const LIST_WIDTH = 224;

interface MonthCell {
   key: string;
   label: string;
   /** Week-start days of the month (Mondays), for the "Show week numbers" option. */
   weekDays: number[];
}

const MONTHS: MonthCell[] = [];
for (let index = 0; ; index++) {
   const date = new Date(Date.UTC(2020, index, 1));
   if (date.getTime() > RANGE_END) break;
   const weekDays: number[] = [];
   const daysInMonth = new Date(Date.UTC(2020, index + 1, 0)).getUTCDate();
   for (let day = 1; day <= daysInMonth; day++) {
      if (new Date(Date.UTC(2020, index, day)).getUTCDay() === 1) weekDays.push(day);
   }
   MONTHS.push({
      key: date.toISOString().slice(0, 7),
      label:
         date.getUTCMonth() === 0
            ? `${date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' })} ${date.getUTCFullYear()}`
            : date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }),
      weekDays,
   });
}

const TOTAL_WIDTH = MONTHS.length * MONTH_WIDTH;

const offsetFor = (iso: string): number => {
   const time = Date.UTC(
      Number(iso.slice(0, 4)),
      Number(iso.slice(5, 7)) - 1,
      Number(iso.slice(8, 10))
   );
   const clamped = Math.min(Math.max(time, RANGE_START), RANGE_END);
   return ((clamped - RANGE_START) / (RANGE_END - RANGE_START)) * TOTAL_WIDTH;
};

const barBounds = (project: Project) => {
   const left = offsetFor(project.startDate);
   const right = Math.max(offsetFor(project.targetDate ?? project.startDate), left + 130);
   return { left, right };
};

const dateRangeLabel = (project: Project) => {
   const startLabel = format(parseISO(project.startDate), 'MMM d');
   if (!project.targetDate || project.targetDate === project.startDate) return startLabel;
   return `${startLabel} - ${format(parseISO(project.targetDate), 'MMM d')}`;
};

interface Viewport {
   left: number;
   width: number;
}

/** "← Jul 15 - Aug 28" indicator shown when a bar is outside the viewport. */
function OutOfViewIndicator({
   project,
   viewport,
   listOffset,
   onJump,
}: {
   project: Project;
   viewport: Viewport;
   listOffset: number;
   onJump: (contentX: number) => void;
}) {
   const { left, right } = barBounds(project);
   const visibleLeft = viewport.left + listOffset;
   const visibleRight = viewport.left + viewport.width;

   if (right >= visibleLeft + 4 && left <= visibleRight - 4) return null;

   const isPast = right < visibleLeft + 4;
   const label = dateRangeLabel(project);

   return (
      <button
         type="button"
         onClick={() => onJump(left)}
         className="absolute top-1.5 z-[6] flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
         style={
            isPast
               ? { left: visibleLeft + 16 }
               : { left: visibleRight - 16, transform: 'translateX(-100%)' }
         }
      >
         {isPast && <ArrowLeft className="size-3.5" />}
         {label}
         {!isPast && <ArrowRight className="size-3.5" />}
      </button>
   );
}

function TimelineBar({ project }: { project: Project }) {
   const { orgId } = useParams<{ orgId: string }>();
   const { displayProperties } = useProjectsDisplayStore();
   const left = offsetFor(project.startDate);
   const right = offsetFor(project.targetDate ?? project.startDate);
   const width = Math.max(right - left, 130);

   return (
      <div className="absolute inset-0">
         <Link
            href={`/${orgId}/project/${project.id}/overview`}
            className="absolute top-1 h-7 flex items-center gap-1.5 rounded-md border bg-accent/40 hover:bg-accent px-2.5 text-xs transition-colors overflow-hidden"
            style={{ left, width }}
         >
            <span className="truncate font-medium">{project.name}</span>
            {displayProperties.lead && (
               <Avatar className="size-4 shrink-0">
                  <AvatarImage src={project.lead.avatarUrl} alt={project.lead.name} />
                  <AvatarFallback>{project.lead.name[0]}</AvatarFallback>
               </Avatar>
            )}
            {displayProperties.status && (
               <span className="text-muted-foreground shrink-0">{project.percentComplete}%</span>
            )}
         </Link>
      </div>
   );
}

/**
 * Projects "Timeline" view (the default): month scale, grouped rows,
 * date-positioned bars and a Today marker. The left project list, week
 * numbers and bar contents follow the Display options.
 */
export default function ProjectsTimeline({ groups }: ProjectsTimelineProps) {
   const { showProjectList, showWeekNumbers, displayProperties } = useProjectsDisplayStore();
   const [todayOffset, setTodayOffset] = useState<number | null>(null);
   const [viewport, setViewport] = useState<Viewport | null>(null);
   const scrollRef = useRef<HTMLDivElement>(null);
   const frameRef = useRef<number | null>(null);

   const listOffset = showProjectList ? LIST_WIDTH : 0;

   const syncViewport = useCallback(() => {
      if (!scrollRef.current) return;
      setViewport({ left: scrollRef.current.scrollLeft, width: scrollRef.current.clientWidth });
   }, []);

   const handleScroll = useCallback(() => {
      if (frameRef.current !== null) return;
      frameRef.current = requestAnimationFrame(() => {
         frameRef.current = null;
         syncViewport();
      });
   }, [syncViewport]);

   useEffect(() => {
      const offset = offsetFor(new Date().toISOString().slice(0, 10));
      setTodayOffset(offset);
      // Bring today into view on mount (a third from the left edge).
      if (scrollRef.current) {
         scrollRef.current.scrollLeft = Math.max(0, offset - scrollRef.current.clientWidth / 3);
      }
      syncViewport();
      return () => {
         if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      };
   }, [syncViewport]);

   const jumpTo = useCallback((contentX: number) => {
      scrollRef.current?.scrollTo({
         left: Math.max(0, contentX - (scrollRef.current.clientWidth ?? 800) / 3),
         behavior: 'smooth',
      });
   }, []);

   const scrollToToday = () => {
      if (scrollRef.current && todayOffset !== null) {
         scrollRef.current.scrollTo({
            left: Math.max(0, todayOffset - scrollRef.current.clientWidth / 3),
            behavior: 'smooth',
         });
      }
   };

   return (
      <div className="relative w-full h-full">
         {/* Floating scale controls (Linear-style) */}
         <div className="absolute top-1 right-4 z-30 flex items-center gap-1.5">
            <button
               type="button"
               onClick={scrollToToday}
               className="h-7 px-2.5 rounded-md border bg-container text-xs font-medium hover:bg-accent transition-colors shadow-xs"
            >
               Today
            </button>
            <button
               type="button"
               className="h-7 px-2.5 rounded-md border bg-container text-xs font-medium hover:bg-accent transition-colors shadow-xs inline-flex items-center gap-1"
            >
               Year
               <ChevronDown className="size-3 text-muted-foreground" />
            </button>
         </div>

         <div ref={scrollRef} onScroll={handleScroll} className="w-full h-full overflow-auto">
            <div style={{ width: TOTAL_WIDTH }} className="relative min-h-full">
               {/* Month scale */}
               <div className="sticky top-0 z-20 border-b bg-container">
                  <div className="flex">
                     {MONTHS.map((month) => (
                        <div
                           key={month.key}
                           style={{ width: MONTH_WIDTH }}
                           className="shrink-0 px-2 pt-1.5 pb-0.5 text-[11px] font-medium text-muted-foreground border-r border-border/40 uppercase tracking-wide"
                        >
                           {month.label}
                        </div>
                     ))}
                  </div>
                  {showWeekNumbers && (
                     <div className="flex">
                        {MONTHS.map((month) => (
                           <div
                              key={month.key}
                              style={{ width: MONTH_WIDTH }}
                              className="shrink-0 px-2 pb-1 text-[10px] text-muted-foreground/70 border-r border-border/40 flex gap-2"
                           >
                              {month.weekDays.map((day) => (
                                 <span key={day}>{day}</span>
                              ))}
                           </div>
                        ))}
                     </div>
                  )}
               </div>

               {/* Month grid lines */}
               <div className="absolute inset-0 top-7 flex pointer-events-none">
                  {MONTHS.map((month) => (
                     <div
                        key={month.key}
                        style={{ width: MONTH_WIDTH }}
                        className="shrink-0 border-r border-border/25 h-full"
                     />
                  ))}
               </div>

               {/* Today marker */}
               {todayOffset !== null && (
                  <div
                     className="absolute top-7 bottom-0 w-px bg-violet-500 z-10"
                     style={{ left: todayOffset }}
                  >
                     <span className="absolute -top-0.5 -translate-x-1/2 text-[10px] font-semibold bg-violet-500 text-white rounded px-1 py-px uppercase">
                        Today
                     </span>
                  </div>
               )}

               {/* Groups */}
               <div className="relative z-[5] pb-8">
                  {groups.map((group) => (
                     <div key={group.id}>
                        <div className="sticky left-0 flex items-center gap-2 px-4 h-9 text-sm font-medium bg-accent/30 border-y border-border/40 w-screen max-w-full">
                           {group.icon && <span>{group.icon}</span>}
                           {group.name}
                           <span className="text-xs text-muted-foreground">
                              {group.projects.length}
                           </span>
                           <button className="ml-auto text-muted-foreground hover:text-foreground transition-colors">
                              <Plus className="size-3.5" />
                           </button>
                        </div>
                        <div className="py-1">
                           {group.projects.map((project) => (
                              <div key={project.id} className="relative h-9">
                                 <TimelineBar project={project} />
                                 {viewport && (
                                    <OutOfViewIndicator
                                       project={project}
                                       viewport={viewport}
                                       listOffset={listOffset}
                                       onJump={jumpTo}
                                    />
                                 )}
                                 {showProjectList && (
                                    <div className="sticky left-0 z-10 inline-flex items-center gap-1.5 w-56 px-4 h-9 bg-container/95 backdrop-blur-sm text-xs border-r border-border/40">
                                       <span className="inline-flex size-5 bg-muted/50 items-center justify-center rounded shrink-0">
                                          <project.icon className="size-3" />
                                       </span>
                                       <span className="truncate flex-1">{project.name}</span>
                                       {displayProperties.health && (
                                          <span
                                             className="size-2 rounded-full shrink-0"
                                             style={{ backgroundColor: project.health.color }}
                                          />
                                       )}
                                       {displayProperties.status && (
                                          <CapacityRing
                                             value={project.percentComplete}
                                             color="#6771c5"
                                          />
                                       )}
                                       {displayProperties.priority && (
                                          <project.priority.icon
                                             className={cn('size-3 shrink-0 text-muted-foreground')}
                                          />
                                       )}
                                       {displayProperties.lead && (
                                          <Avatar className="size-4 shrink-0">
                                             <AvatarImage
                                                src={project.lead.avatarUrl}
                                                alt={project.lead.name}
                                             />
                                             <AvatarFallback>
                                                {project.lead.name[0]}
                                             </AvatarFallback>
                                          </Avatar>
                                       )}
                                    </div>
                                 )}
                              </div>
                           ))}
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
   );
}
