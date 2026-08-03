'use client';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import {
   PROJECT_DISPLAY_PROPERTIES,
   ProjectsGrouping,
   ProjectsOrdering,
   ProjectsViewType,
   useProjectsDisplayStore,
} from '@/store/projects-display-store';
import { parseAsStringLiteral, useQueryState } from 'nuqs';
import {
   ArrowUpDown,
   ArrowUpNarrowWide,
   ChartNoAxesGantt,
   LayoutGrid,
   List,
   SlidersHorizontal,
} from 'lucide-react';

const VIEW_TYPES: { value: ProjectsViewType; label: string; icon: React.ElementType }[] = [
   { value: 'list', label: 'List', icon: List },
   { value: 'board', label: 'Board', icon: LayoutGrid },
   { value: 'timeline', label: 'Timeline', icon: ChartNoAxesGantt },
];

const GROUPINGS: { value: ProjectsGrouping; label: string }[] = [
   { value: 'team', label: 'Team' },
   { value: 'none', label: 'No grouping' },
];

const ORDERINGS: { value: ProjectsOrdering; label: string }[] = [
   { value: 'start-date', label: 'Start date' },
   { value: 'target-date', label: 'Target date' },
   { value: 'title', label: 'Title' },
];

function OptionRow({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
   return (
      <div className="flex items-center justify-between gap-3 min-h-8">
         <span className="text-sm">{label}</span>
         {children}
      </div>
   );
}

/** Linear-style Display popover for the Projects page (List/Board/Timeline). */
export function ProjectsDisplayOptions() {
   const [tab] = useQueryState(
      'tab',
      parseAsStringLiteral(['all', 'active'] as const).withDefault('all')
   );
   const {
      viewTypes,
      grouping,
      ordering,
      closedProjects,
      showEmptyGroups,
      showProjectList,
      showWeekNumbers,
      displayProperties,
      setViewType,
      setGrouping,
      setOrdering,
      setClosedProjects,
      setShowEmptyGroups,
      setShowProjectList,
      setShowWeekNumbers,
      toggleDisplayProperty,
      resetDisplaySettings,
   } = useProjectsDisplayStore();
   const viewType = viewTypes[tab];

   return (
      <Popover>
         <PopoverTrigger asChild>
            <Button size="xs" variant="ghost" aria-label="Display options">
               <SlidersHorizontal className="size-4" />
            </Button>
         </PopoverTrigger>
         <PopoverContent align="end" className="w-[420px] p-0">
            <div className="p-3 flex flex-col gap-3">
               {/* View switcher */}
               <div className="grid grid-cols-3 gap-2">
                  {VIEW_TYPES.map((view) => (
                     <button
                        key={view.value}
                        type="button"
                        onClick={() => setViewType(tab, view.value)}
                        className={cn(
                           'flex items-center justify-center gap-1.5 h-9 rounded-full border text-sm transition-colors',
                           viewType === view.value
                              ? 'bg-accent text-foreground border-border font-medium'
                              : 'border-border/60 text-muted-foreground hover:text-foreground hover:bg-accent/40'
                        )}
                     >
                        <view.icon className="size-4" />
                        {view.label}
                     </button>
                  ))}
               </div>

               {/* Grouping / ordering */}
               <div className="flex flex-col gap-1.5">
                  <OptionRow
                     label={
                        <span className="flex items-center gap-2">
                           <ArrowUpDown className="size-4 text-muted-foreground" />
                           Grouping
                        </span>
                     }
                  >
                     <Select
                        value={grouping}
                        onValueChange={(value) => setGrouping(value as ProjectsGrouping)}
                     >
                        <SelectTrigger className="h-8 w-36 text-xs">
                           <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                           {GROUPINGS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                 {option.label}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </OptionRow>
                  <OptionRow
                     label={
                        <span className="flex items-center gap-2">
                           <ArrowUpNarrowWide className="size-4 text-muted-foreground" />
                           Ordering
                        </span>
                     }
                  >
                     <Select
                        value={ordering}
                        onValueChange={(value) => setOrdering(value as ProjectsOrdering)}
                     >
                        <SelectTrigger className="h-8 w-36 text-xs">
                           <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                           {ORDERINGS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                 {option.label}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </OptionRow>
               </div>

               <div className="border-t -mx-3" />

               <OptionRow label="Show closed projects">
                  <Select
                     value={closedProjects}
                     onValueChange={(value) => setClosedProjects(value as 'all' | 'hide')}
                  >
                     <SelectTrigger className="h-8 w-36 text-xs">
                        <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="hide">Hide closed</SelectItem>
                     </SelectContent>
                  </Select>
               </OptionRow>

               <div className="border-t -mx-3" />

               {/* Per-view options */}
               <div className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium">
                     {viewType === 'timeline'
                        ? 'Timeline options'
                        : viewType === 'board'
                          ? 'Board options'
                          : 'List options'}
                  </span>
                  {viewType === 'timeline' && (
                     <>
                        <OptionRow label="Show project list">
                           <Switch
                              checked={showProjectList}
                              onCheckedChange={setShowProjectList}
                           />
                        </OptionRow>
                        <OptionRow label="Show week numbers">
                           <Switch
                              checked={showWeekNumbers}
                              onCheckedChange={setShowWeekNumbers}
                           />
                        </OptionRow>
                     </>
                  )}
                  <OptionRow
                     label={viewType === 'board' ? 'Show empty columns' : 'Show empty groups'}
                  >
                     <Switch checked={showEmptyGroups} onCheckedChange={setShowEmptyGroups} />
                  </OptionRow>
               </div>

               {/* Display properties */}
               <div className="flex flex-col gap-2">
                  <span className="text-sm text-muted-foreground">Display properties</span>
                  <div className="flex flex-wrap gap-1.5">
                     {PROJECT_DISPLAY_PROPERTIES.map((property) => {
                        const enabled = displayProperties[property.key];
                        return (
                           <button
                              key={property.key}
                              type="button"
                              onClick={() => toggleDisplayProperty(property.key)}
                              className={cn(
                                 'px-2.5 h-7 rounded-full border text-xs transition-colors',
                                 enabled
                                    ? 'bg-accent text-foreground border-border'
                                    : 'border-border/60 text-muted-foreground hover:text-foreground'
                              )}
                           >
                              {property.label}
                           </button>
                        );
                     })}
                  </div>
               </div>
            </div>

            <div className="border-t px-3 py-2.5 flex items-center justify-between">
               <button
                  type="button"
                  onClick={resetDisplaySettings}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
               >
                  Reset
               </button>
               <button className="text-sm text-indigo-500 dark:text-indigo-400 hover:underline">
                  Set default for everyone
               </button>
            </div>
         </PopoverContent>
      </Popover>
   );
}
