'use client';

import { CapacityRing } from '@/components/common/cycles/capacity-ring';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Project } from '@/mock-data/projects';
import { useProjectsDisplayStore } from '@/store/projects-display-store';
import { format, parseISO } from 'date-fns';
import { ArrowLeft, ArrowRight, Check, ChevronDown, Plus } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ProjectPeekPanel } from './project-peek-panel';
import { ProjectGroup } from './projects';

interface ProjectsTimelineProps {
   groups: ProjectGroup[];
}

/* Wide, deterministic range (feels infinite): Jan 2020 → Dec 2032 (SSR safe). */
const RANGE_START = Date.UTC(2020, 0, 1);
const RANGE_END = Date.UTC(2032, 11, 31);
/** Width of the sticky project list column. */
const LIST_WIDTH = 224;

/** Zoom levels for the scale dropdown (month column width in px). */
const ZOOM_LEVELS = [
   { id: 'year', label: 'Year', shortcut: 'Y', monthWidth: 120 },
   { id: 'quarter', label: 'Quarter', shortcut: 'Q', monthWidth: 240 },
   { id: 'month', label: 'Month', shortcut: 'M', monthWidth: 480 },
   { id: 'week', label: 'Week', shortcut: 'W', monthWidth: 960 },
] as const;
type TimelineZoom = (typeof ZOOM_LEVELS)[number]['id'];

const monthWidthOf = (zoom: TimelineZoom) =>
   ZOOM_LEVELS.find((level) => level.id === zoom)!.monthWidth;

interface MonthCell {
   key: string;
   label: string;
}

const MONTHS: MonthCell[] = [];
for (let index = 0; ; index++) {
   const date = new Date(Date.UTC(2020, index, 1));
   if (date.getTime() > RANGE_END) break;
   MONTHS.push({
      key: date.toISOString().slice(0, 7),
      label:
         date.getUTCMonth() === 0
            ? `${date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' })} ${date.getUTCFullYear()}`
            : date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }),
   });
}

const totalWidthOf = (monthWidth: number) => MONTHS.length * monthWidth;

/* --------------------------- Scale date labels --------------------------- */

const DAY_MS = 86_400_000;
/** First Monday inside the range (Jan 6, 2020). */
const FIRST_MONDAY = Date.UTC(2020, 0, 6);

interface ScaleDate {
   time: number;
   /** Day of month, e.g. 17. */
   day: number;
   /** ISO week number, for the "Show week numbers" display option. */
   week: number;
}

const isoWeekOf = (time: number): number => {
   const date = new Date(time);
   const target = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
   const dayNumber = (target.getUTCDay() + 6) % 7;
   target.setUTCDate(target.getUTCDate() - dayNumber + 3);
   const firstThursday = new Date(Date.UTC(target.getUTCFullYear(), 0, 4));
   const firstDayNumber = (firstThursday.getUTCDay() + 6) % 7;
   firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDayNumber + 3);
   return 1 + Math.round((target.getTime() - firstThursday.getTime()) / (7 * DAY_MS));
};

/** Every Monday of the range (weekly ticks + zoomed-in date labels). */
const WEEKLY_DATES: ScaleDate[] = [];
for (let time = FIRST_MONDAY; time <= RANGE_END; time += 7 * DAY_MS) {
   WEEKLY_DATES.push({ time, day: new Date(time).getUTCDate(), week: isoWeekOf(time) });
}
/** Every other Monday (date labels at the Year zoom). */
const BIWEEKLY_DATES: ScaleDate[] = WEEKLY_DATES.filter((_, index) => index % 2 === 0);

const offsetForTime = (time: number, monthWidth: number): number =>
   ((time - RANGE_START) / (RANGE_END - RANGE_START)) * totalWidthOf(monthWidth);

const offsetFor = (iso: string, monthWidth: number): number => {
   const time = Date.UTC(
      Number(iso.slice(0, 4)),
      Number(iso.slice(5, 7)) - 1,
      Number(iso.slice(8, 10))
   );
   const clamped = Math.min(Math.max(time, RANGE_START), RANGE_END);
   return ((clamped - RANGE_START) / (RANGE_END - RANGE_START)) * totalWidthOf(monthWidth);
};

const barBounds = (project: Project, monthWidth: number) => {
   const left = offsetFor(project.startDate, monthWidth);
   const right = Math.max(
      offsetFor(project.targetDate ?? project.startDate, monthWidth),
      left + 130
   );
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

/**
 * "← Jul 15 - Aug 28" indicator shown when a bar is outside the viewport.
 * Pinned with position: sticky (pure CSS) so it never drifts during fast
 * scrolling — JS is only used to decide which side to show.
 */
function OutOfViewIndicator({
   project,
   viewport,
   listOffset,
   monthWidth,
   onJump,
}: {
   project: Project;
   viewport: Viewport;
   listOffset: number;
   monthWidth: number;
   onJump: (contentX: number) => void;
}) {
   const { left, right } = barBounds(project, monthWidth);
   const visibleLeft = viewport.left + listOffset;
   const visibleRight = viewport.left + viewport.width;

   if (right >= visibleLeft + 4 && left <= visibleRight - 4) return null;

   const isPast = right < visibleLeft + 4;
   const label = dateRangeLabel(project);

   return (
      <button
         type="button"
         onClick={() => onJump(left)}
         className={cn(
            'sticky z-[6] flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap pointer-events-auto',
            !isPast && 'ml-auto'
         )}
         style={isPast ? { left: listOffset + 16 } : { right: 16 }}
      >
         {isPast && <ArrowLeft className="size-3.5" />}
         {label}
         {!isPast && <ArrowRight className="size-3.5" />}
      </button>
   );
}

function TimelineBar({
   project,
   monthWidth,
   selected,
   onSelect,
}: {
   project: Project;
   monthWidth: number;
   selected: boolean;
   onSelect: (projectId: string) => void;
}) {
   const { displayProperties } = useProjectsDisplayStore();
   const left = offsetFor(project.startDate, monthWidth);
   const right = offsetFor(project.targetDate ?? project.startDate, monthWidth);
   const width = Math.max(right - left, 130);

   return (
      <div className="absolute inset-0">
         <button
            type="button"
            onClick={() => onSelect(project.id)}
            className={cn(
               'absolute top-1 h-7 flex items-center gap-1.5 rounded-md border bg-accent/40 hover:bg-accent px-2.5 text-xs transition-colors overflow-hidden',
               selected && 'border-dashed border-violet-500 bg-accent'
            )}
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
         </button>
      </div>
   );
}

/**
 * Projects "Timeline" view (the default): month scale, grouped rows,
 * date-positioned bars and a Today marker. The left project list, week
 * numbers and bar contents follow the Display options; the scale dropdown
 * (Year / Quarter / Month / Week, with Y/Q/M/W shortcuts) changes the zoom.
 */
export default function ProjectsTimeline({ groups }: ProjectsTimelineProps) {
   const { showProjectList, showWeekNumbers, displayProperties } = useProjectsDisplayStore();
   const [todayIso, setTodayIso] = useState<string | null>(null);
   const [viewport, setViewport] = useState<Viewport | null>(null);
   const [zoom, setZoom] = useState<TimelineZoom>('year');
   const [peekProjectId, setPeekProjectId] = useState<string | null>(null);
   const scrollRef = useRef<HTMLDivElement>(null);
   const frameRef = useRef<number | null>(null);

   const monthWidth = monthWidthOf(zoom);
   const totalWidth = totalWidthOf(monthWidth);
   const listOffset = showProjectList ? LIST_WIDTH : 0;
   const todayOffset = todayIso !== null ? offsetFor(todayIso, monthWidth) : null;
   const todayLabel = todayIso !== null ? format(parseISO(todayIso), 'MMM d').toUpperCase() : null;
   /** The line would sit on the sticky project list → hide it (the pill stays on the scale). */
   const todayOverlapsList =
      viewport !== null && todayOffset !== null && todayOffset < viewport.left + listOffset + 28;
   /** Date labels: every other Monday zoomed out, every Monday zoomed in. */
   const scaleDates = zoom === 'year' ? BIWEEKLY_DATES : WEEKLY_DATES;

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
      const iso = new Date().toISOString().slice(0, 10);
      setTodayIso(iso);
      // Bring today into view on mount (a third from the left edge, but always
      // clear of the sticky project list so the line stays visible).
      if (scrollRef.current) {
         const offset = offsetFor(iso, monthWidthOf('year'));
         const listWidth = useProjectsDisplayStore.getState().showProjectList ? LIST_WIDTH : 0;
         const anchor = Math.max(scrollRef.current.clientWidth / 3, listWidth + 80);
         scrollRef.current.scrollLeft = Math.max(0, offset - anchor);
      }
      syncViewport();
      return () => {
         if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      };
   }, [syncViewport]);

   /** Change zoom while keeping the date at the middle of the viewport anchored. */
   const setZoomLevel = useCallback(
      (next: TimelineZoom) => {
         if (next === zoom) return;
         const element = scrollRef.current;
         setZoom(next);
         if (element) {
            const previousWidth = totalWidthOf(monthWidthOf(zoom));
            const nextWidth = totalWidthOf(monthWidthOf(next));
            const anchor = (element.scrollLeft + element.clientWidth / 2) / previousWidth;
            requestAnimationFrame(() => {
               element.scrollLeft = anchor * nextWidth - element.clientWidth / 2;
               syncViewport();
            });
         }
      },
      [zoom, syncViewport]
   );

   // Y / Q / M / W keyboard shortcuts (ignored while typing).
   useEffect(() => {
      const onKeyDown = (event: KeyboardEvent) => {
         if (event.metaKey || event.ctrlKey || event.altKey) return;
         const target = event.target as HTMLElement | null;
         if (
            target &&
            (target.tagName === 'INPUT' ||
               target.tagName === 'TEXTAREA' ||
               target.isContentEditable)
         ) {
            return;
         }
         const level = ZOOM_LEVELS.find(
            (candidate) => candidate.shortcut.toLowerCase() === event.key.toLowerCase()
         );
         if (level) setZoomLevel(level.id);
      };
      window.addEventListener('keydown', onKeyDown);
      return () => window.removeEventListener('keydown', onKeyDown);
   }, [setZoomLevel]);

   const jumpTo = useCallback(
      (contentX: number) => {
         if (!scrollRef.current) return;
         const anchor = Math.max(scrollRef.current.clientWidth / 3, listOffset + 80);
         scrollRef.current.scrollTo({
            left: Math.max(0, contentX - anchor),
            behavior: 'smooth',
         });
      },
      [listOffset]
   );

   const scrollToToday = () => {
      if (scrollRef.current && todayOffset !== null) {
         // Land today clear of the sticky project list, so on small screens
         // the line never ends up hidden behind it.
         const anchor = Math.max(scrollRef.current.clientWidth / 3, listOffset + 80);
         scrollRef.current.scrollTo({
            left: Math.max(0, todayOffset - anchor),
            behavior: 'smooth',
         });
      }
   };

   return (
      <div className="relative w-full h-full">
         {peekProjectId !== null && (
            <ProjectPeekPanel projectId={peekProjectId} onClose={() => setPeekProjectId(null)} />
         )}
         {/* Floating scale controls (Linear-style) */}
         <div className="absolute top-1 right-4 z-30 flex items-center gap-1.5">
            <button
               type="button"
               onClick={scrollToToday}
               className="h-7 px-2.5 rounded-md border bg-container text-xs font-medium hover:bg-accent transition-colors shadow-xs"
            >
               Today
            </button>
            <DropdownMenu>
               <DropdownMenuTrigger className="h-7 px-2.5 rounded-md border bg-container text-xs font-medium hover:bg-accent transition-colors shadow-xs inline-flex items-center gap-1 outline-none">
                  {ZOOM_LEVELS.find((level) => level.id === zoom)!.label}
                  <ChevronDown className="size-3 text-muted-foreground" />
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end" className="w-40">
                  {ZOOM_LEVELS.map((level) => (
                     <DropdownMenuItem
                        key={level.id}
                        onClick={() => setZoomLevel(level.id)}
                        className="flex items-center gap-2 text-sm"
                     >
                        <span className="flex-1">{level.label}</span>
                        {zoom === level.id && <Check className="size-3.5" />}
                        <span className="text-xs text-muted-foreground">{level.shortcut}</span>
                     </DropdownMenuItem>
                  ))}
               </DropdownMenuContent>
            </DropdownMenu>
         </div>

         <div ref={scrollRef} onScroll={handleScroll} className="w-full h-full overflow-auto">
            <div style={{ width: totalWidth }} className="relative min-h-full">
               {/* Month scale: month names, weekly ticks and date labels */}
               <div className="sticky top-0 z-20 border-b bg-container select-none">
                  <div className="relative flex">
                     {MONTHS.map((month) => (
                        <div
                           key={month.key}
                           style={{ width: monthWidth }}
                           className="shrink-0 px-2 pt-1.5 pb-0.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap overflow-hidden"
                        >
                           {month.label}
                        </div>
                     ))}
                     {/* Weekly tick marks */}
                     <div className="absolute inset-x-0 bottom-0 pointer-events-none">
                        {WEEKLY_DATES.map((date) => (
                           <span
                              key={date.time}
                              className="absolute bottom-0 h-1 w-px bg-muted-foreground/30"
                              style={{ left: offsetForTime(date.time, monthWidth) }}
                           />
                        ))}
                     </div>
                  </div>
                  {/* Date labels (every other Monday at the Year zoom, weekly beyond) */}
                  <div className="relative h-5">
                     {scaleDates.map((date) => {
                        const left = offsetForTime(date.time, monthWidth);
                        if (todayOffset !== null && Math.abs(left - todayOffset) < 30) return null;
                        return (
                           <span
                              key={date.time}
                              className="absolute top-0 -translate-x-1/2 text-[10px] text-muted-foreground/80 whitespace-nowrap"
                              style={{ left }}
                           >
                              {showWeekNumbers ? `W${date.week}` : date.day}
                           </span>
                        );
                     })}
                     {/* Today pill, pinned to the scale */}
                     {todayOffset !== null && (
                        <span
                           className="absolute -top-0.5 -translate-x-1/2 text-[10px] font-semibold bg-violet-500 text-white rounded-full px-1.5 py-px uppercase whitespace-nowrap pointer-events-none z-10"
                           style={{ left: todayOffset }}
                        >
                           {todayLabel}
                        </span>
                     )}
                  </div>
               </div>

               {/* Month grid lines */}
               <div className="absolute inset-0 top-7 flex pointer-events-none">
                  {MONTHS.map((month) => (
                     <div
                        key={month.key}
                        style={{ width: monthWidth }}
                        className="shrink-0 border-r border-border/25 h-full"
                     />
                  ))}
               </div>

               {/* Today marker (hidden while it overlaps the sticky project list) */}
               {todayOffset !== null && !todayOverlapsList && (
                  <div
                     className="absolute top-7 bottom-0 w-px bg-violet-500 z-10"
                     style={{ left: todayOffset }}
                  />
               )}

               {/* Groups */}
               <div className="relative z-[5] pb-8">
                  {groups.map((group) => (
                     <div key={group.id}>
                        <div className="sticky left-0 flex items-center gap-2 px-4 h-9 text-sm font-medium bg-[color-mix(in_oklab,var(--accent)_30%,var(--container))] border-y border-border/40 w-screen max-w-full">
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
                              <div key={project.id} className="relative h-9 flex items-center">
                                 <TimelineBar
                                    project={project}
                                    monthWidth={monthWidth}
                                    selected={peekProjectId === project.id}
                                    onSelect={(projectId) =>
                                       setPeekProjectId((current) =>
                                          current === projectId ? null : projectId
                                       )
                                    }
                                 />
                                 {showProjectList && (
                                    <div className="sticky left-0 z-10 flex items-center gap-1.5 w-56 shrink-0 px-4 h-9 bg-container/95 backdrop-blur-sm text-xs border-r border-border/40">
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
                                             <AvatarFallback>{project.lead.name[0]}</AvatarFallback>
                                          </Avatar>
                                       )}
                                    </div>
                                 )}
                                 {viewport && (
                                    <OutOfViewIndicator
                                       project={project}
                                       viewport={viewport}
                                       listOffset={listOffset}
                                       monthWidth={monthWidth}
                                       onJump={jumpTo}
                                    />
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
