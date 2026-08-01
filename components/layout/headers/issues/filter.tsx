'use client';

import { Button } from '@/components/ui/button';
import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
   CommandSeparator,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useIssuesStore } from '@/store/issues-store';
import { useFilterStore } from '@/store/filter-store';
import { cycles, cycleStatusLabel } from '@/mock-data/cycles';
import { status as allStatus, StatusCategory } from '@/mock-data/status';
import { priorities } from '@/mock-data/priorities';
import { labels } from '@/mock-data/labels';
import { projects } from '@/mock-data/projects';
import { users } from '@/mock-data/users';
import {
   CheckIcon,
   ChevronRight,
   CircleDot,
   ListFilter,
   RefreshCcw,
   User,
   CircleCheck,
   BarChart3,
   Tag,
   Folder,
} from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Define filter types
type FilterType =
   | 'status'
   | 'statusType'
   | 'assignee'
   | 'priority'
   | 'labels'
   | 'project'
   | 'cycle';

const STATUS_TYPES: { id: StatusCategory; name: string }[] = [
   { id: 'triage', name: 'Triage' },
   { id: 'backlog', name: 'Backlog' },
   { id: 'unstarted', name: 'Unstarted' },
   { id: 'started', name: 'Started' },
   { id: 'completed', name: 'Completed' },
   { id: 'canceled', name: 'Canceled' },
];

export function Filter() {
   const [open, setOpen] = useState<boolean>(false);
   const [activeFilter, setActiveFilter] = useState<FilterType | null>(null);

   const { filters, toggleFilter, clearFilters, getActiveFiltersCount } = useFilterStore();

   const {
      filterByStatus,
      filterByAssignee,
      filterByPriority,
      filterByLabel,
      filterByProject,
      filterByCycle,
      getAllIssues,
   } = useIssuesStore();

   return (
      <Popover open={open} onOpenChange={setOpen}>
         <PopoverTrigger asChild>
            <Button size="xs" variant="ghost" className="relative">
               <ListFilter className="size-4 mr-1" />
               Filter
               {getActiveFiltersCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] rounded-full size-4 flex items-center justify-center">
                     {getActiveFiltersCount()}
                  </span>
               )}
            </Button>
         </PopoverTrigger>
         <PopoverContent className="p-0 w-60" align="start">
            {activeFilter === null ? (
               <Command>
                  <CommandList>
                     <CommandGroup>
                        <CommandItem
                           onSelect={() => setActiveFilter('status')}
                           className="flex items-center justify-between cursor-pointer"
                        >
                           <span className="flex items-center gap-2">
                              <CircleCheck className="size-4 text-muted-foreground" />
                              Status
                           </span>
                           <div className="flex items-center">
                              {filters.status.length > 0 && (
                                 <span className="text-xs text-muted-foreground mr-1">
                                    {filters.status.length}
                                 </span>
                              )}
                              <ChevronRight className="size-4" />
                           </div>
                        </CommandItem>
                        <CommandItem
                           onSelect={() => setActiveFilter('statusType')}
                           className="flex items-center justify-between cursor-pointer"
                        >
                           <span className="flex items-center gap-2">
                              <CircleDot className="size-4 text-muted-foreground" />
                              Status type
                           </span>
                           <div className="flex items-center">
                              {filters.statusType.length > 0 && (
                                 <span className="text-xs text-muted-foreground mr-1">
                                    {filters.statusType.length}
                                 </span>
                              )}
                              <ChevronRight className="size-4" />
                           </div>
                        </CommandItem>
                        <CommandItem
                           onSelect={() => setActiveFilter('assignee')}
                           className="flex items-center justify-between cursor-pointer"
                        >
                           <span className="flex items-center gap-2">
                              <User className="size-4 text-muted-foreground" />
                              Assignee
                           </span>
                           <div className="flex items-center">
                              {filters.assignee.length > 0 && (
                                 <span className="text-xs text-muted-foreground mr-1">
                                    {filters.assignee.length}
                                 </span>
                              )}
                              <ChevronRight className="size-4" />
                           </div>
                        </CommandItem>
                        <CommandItem
                           onSelect={() => setActiveFilter('priority')}
                           className="flex items-center justify-between cursor-pointer"
                        >
                           <span className="flex items-center gap-2">
                              <BarChart3 className="size-4 text-muted-foreground" />
                              Priority
                           </span>
                           <div className="flex items-center">
                              {filters.priority.length > 0 && (
                                 <span className="text-xs text-muted-foreground mr-1">
                                    {filters.priority.length}
                                 </span>
                              )}
                              <ChevronRight className="size-4" />
                           </div>
                        </CommandItem>
                        <CommandItem
                           onSelect={() => setActiveFilter('labels')}
                           className="flex items-center justify-between cursor-pointer"
                        >
                           <span className="flex items-center gap-2">
                              <Tag className="size-4 text-muted-foreground" />
                              Labels
                           </span>
                           <div className="flex items-center">
                              {filters.labels.length > 0 && (
                                 <span className="text-xs text-muted-foreground mr-1">
                                    {filters.labels.length}
                                 </span>
                              )}
                              <ChevronRight className="size-4" />
                           </div>
                        </CommandItem>
                        <CommandItem
                           onSelect={() => setActiveFilter('project')}
                           className="flex items-center justify-between cursor-pointer"
                        >
                           <span className="flex items-center gap-2">
                              <Folder className="size-4 text-muted-foreground" />
                              Project
                           </span>
                           <div className="flex items-center">
                              {filters.project.length > 0 && (
                                 <span className="text-xs text-muted-foreground mr-1">
                                    {filters.project.length}
                                 </span>
                              )}
                              <ChevronRight className="size-4" />
                           </div>
                        </CommandItem>
                        <CommandItem
                           onSelect={() => setActiveFilter('cycle')}
                           className="flex items-center justify-between cursor-pointer"
                        >
                           <span className="flex items-center gap-2">
                              <RefreshCcw className="size-4 text-muted-foreground" />
                              Cycle
                           </span>
                           <div className="flex items-center">
                              {filters.cycle.length > 0 && (
                                 <span className="text-xs text-muted-foreground mr-1">
                                    {filters.cycle.length}
                                 </span>
                              )}
                              <ChevronRight className="size-4" />
                           </div>
                        </CommandItem>
                     </CommandGroup>
                     {getActiveFiltersCount() > 0 && (
                        <>
                           <CommandSeparator />
                           <CommandGroup>
                              <CommandItem
                                 onSelect={() => clearFilters()}
                                 className="text-destructive"
                              >
                                 Clear all filters
                              </CommandItem>
                           </CommandGroup>
                        </>
                     )}
                  </CommandList>
               </Command>
            ) : activeFilter === 'status' ? (
               <Command>
                  <div className="flex items-center border-b p-2">
                     <Button
                        variant="ghost"
                        size="icon"
                        className="size-6"
                        onClick={() => setActiveFilter(null)}
                     >
                        <ChevronRight className="size-4 rotate-180" />
                     </Button>
                     <span className="ml-2 font-medium">Status</span>
                  </div>
                  <CommandInput placeholder="Search status..." />
                  <CommandList>
                     <CommandEmpty>No status found.</CommandEmpty>
                     <CommandGroup>
                        {allStatus.map((item) => (
                           <CommandItem
                              key={item.id}
                              value={item.id}
                              onSelect={() => toggleFilter('status', item.id)}
                              className="flex items-center justify-between"
                           >
                              <div className="flex items-center gap-2">
                                 <item.icon />
                                 {item.name}
                              </div>
                              {filters.status.includes(item.id) && (
                                 <CheckIcon size={16} className="ml-auto" />
                              )}
                              <span className="text-muted-foreground text-xs">
                                 {filterByStatus(item.id).length}
                              </span>
                           </CommandItem>
                        ))}
                     </CommandGroup>
                  </CommandList>
               </Command>
            ) : activeFilter === 'assignee' ? (
               <Command>
                  <div className="flex items-center border-b p-2">
                     <Button
                        variant="ghost"
                        size="icon"
                        className="size-6"
                        onClick={() => setActiveFilter(null)}
                     >
                        <ChevronRight className="size-4 rotate-180" />
                     </Button>
                     <span className="ml-2 font-medium">Assignee</span>
                  </div>
                  <CommandInput placeholder="Search assignee..." />
                  <CommandList>
                     <CommandEmpty>No assignees found.</CommandEmpty>
                     <CommandGroup>
                        <CommandItem
                           value="unassigned"
                           onSelect={() => toggleFilter('assignee', 'unassigned')}
                           className="flex items-center justify-between"
                        >
                           <div className="flex items-center gap-2">
                              <User className="size-5" />
                              Unassigned
                           </div>
                           {filters.assignee.includes('unassigned') && (
                              <CheckIcon size={16} className="ml-auto" />
                           )}
                           <span className="text-muted-foreground text-xs">
                              {filterByAssignee(null).length}
                           </span>
                        </CommandItem>
                        {users.map((user) => (
                           <CommandItem
                              key={user.id}
                              value={user.id}
                              onSelect={() => toggleFilter('assignee', user.id)}
                              className="flex items-center justify-between"
                           >
                              <div className="flex items-center gap-2">
                                 <Avatar className="size-5">
                                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                 </Avatar>
                                 {user.name}
                              </div>
                              {filters.assignee.includes(user.id) && (
                                 <CheckIcon size={16} className="ml-auto" />
                              )}
                              <span className="text-muted-foreground text-xs">
                                 {filterByAssignee(user.id).length}
                              </span>
                           </CommandItem>
                        ))}
                     </CommandGroup>
                  </CommandList>
               </Command>
            ) : activeFilter === 'priority' ? (
               <Command>
                  <div className="flex items-center border-b p-2">
                     <Button
                        variant="ghost"
                        size="icon"
                        className="size-6"
                        onClick={() => setActiveFilter(null)}
                     >
                        <ChevronRight className="size-4 rotate-180" />
                     </Button>
                     <span className="ml-2 font-medium">Priority</span>
                  </div>
                  <CommandInput placeholder="Search priority..." />
                  <CommandList>
                     <CommandEmpty>No priorities found.</CommandEmpty>
                     <CommandGroup>
                        {priorities.map((item) => (
                           <CommandItem
                              key={item.id}
                              value={item.id}
                              onSelect={() => toggleFilter('priority', item.id)}
                              className="flex items-center justify-between"
                           >
                              <div className="flex items-center gap-2">
                                 <item.icon className="text-muted-foreground size-4" />
                                 {item.name}
                              </div>
                              {filters.priority.includes(item.id) && (
                                 <CheckIcon size={16} className="ml-auto" />
                              )}
                              <span className="text-muted-foreground text-xs">
                                 {filterByPriority(item.id).length}
                              </span>
                           </CommandItem>
                        ))}
                     </CommandGroup>
                  </CommandList>
               </Command>
            ) : activeFilter === 'labels' ? (
               <Command>
                  <div className="flex items-center border-b p-2">
                     <Button
                        variant="ghost"
                        size="icon"
                        className="size-6"
                        onClick={() => setActiveFilter(null)}
                     >
                        <ChevronRight className="size-4 rotate-180" />
                     </Button>
                     <span className="ml-2 font-medium">Labels</span>
                  </div>
                  <CommandInput placeholder="Search labels..." />
                  <CommandList>
                     <CommandEmpty>No labels found.</CommandEmpty>
                     <CommandGroup>
                        {labels.map((label) => (
                           <CommandItem
                              key={label.id}
                              value={label.id}
                              onSelect={() => toggleFilter('labels', label.id)}
                              className="flex items-center justify-between"
                           >
                              <div className="flex items-center gap-2">
                                 <span
                                    className="size-3 rounded-full"
                                    style={{ backgroundColor: label.color }}
                                 ></span>
                                 {label.name}
                              </div>
                              {filters.labels.includes(label.id) && (
                                 <CheckIcon size={16} className="ml-auto" />
                              )}
                              <span className="text-muted-foreground text-xs">
                                 {filterByLabel(label.id).length}
                              </span>
                           </CommandItem>
                        ))}
                     </CommandGroup>
                  </CommandList>
               </Command>
            ) : activeFilter === 'project' ? (
               <Command>
                  <div className="flex items-center border-b p-2">
                     <Button
                        variant="ghost"
                        size="icon"
                        className="size-6"
                        onClick={() => setActiveFilter(null)}
                     >
                        <ChevronRight className="size-4 rotate-180" />
                     </Button>
                     <span className="ml-2 font-medium">Project</span>
                  </div>
                  <CommandInput placeholder="Search projects..." />
                  <CommandList>
                     <CommandEmpty>No projects found.</CommandEmpty>
                     <CommandGroup>
                        {projects.map((project) => (
                           <CommandItem
                              key={project.id}
                              value={project.id}
                              onSelect={() => toggleFilter('project', project.id)}
                              className="flex items-center justify-between"
                           >
                              <div className="flex items-center gap-2">
                                 <project.icon className="size-4" />
                                 {project.name}
                              </div>
                              {filters.project.includes(project.id) && (
                                 <CheckIcon size={16} className="ml-auto" />
                              )}
                              <span className="text-muted-foreground text-xs">
                                 {filterByProject(project.id).length}
                              </span>
                           </CommandItem>
                        ))}
                     </CommandGroup>
                  </CommandList>
               </Command>
            ) : activeFilter === 'statusType' ? (
               <Command>
                  <div className="flex items-center border-b p-2">
                     <Button
                        variant="ghost"
                        size="icon"
                        className="size-6"
                        onClick={() => setActiveFilter(null)}
                     >
                        <ChevronRight className="size-4 rotate-180" />
                     </Button>
                     <span className="ml-2 font-medium">Status type</span>
                  </div>
                  <CommandInput placeholder="Search status types..." />
                  <CommandList>
                     <CommandEmpty>No status type found.</CommandEmpty>
                     <CommandGroup>
                        {STATUS_TYPES.map((item) => (
                           <CommandItem
                              key={item.id}
                              value={item.id}
                              onSelect={() => toggleFilter('statusType', item.id)}
                              className="flex items-center justify-between"
                           >
                              <div className="flex items-center gap-2">
                                 <CircleDot className="size-4 text-muted-foreground" />
                                 {item.name}
                              </div>
                              {filters.statusType.includes(item.id) && (
                                 <CheckIcon size={16} className="ml-auto" />
                              )}
                              <span className="text-muted-foreground text-xs">
                                 {
                                    getAllIssues().filter(
                                       (issue) => issue.status.category === item.id
                                    ).length
                                 }
                              </span>
                           </CommandItem>
                        ))}
                     </CommandGroup>
                  </CommandList>
               </Command>
            ) : activeFilter === 'cycle' ? (
               <Command>
                  <div className="flex items-center border-b p-2">
                     <Button
                        variant="ghost"
                        size="icon"
                        className="size-6"
                        onClick={() => setActiveFilter(null)}
                     >
                        <ChevronRight className="size-4 rotate-180" />
                     </Button>
                     <span className="ml-2 font-medium">Cycle</span>
                  </div>
                  <CommandInput placeholder="Search cycles..." />
                  <CommandList>
                     <CommandEmpty>No cycle found.</CommandEmpty>
                     <CommandGroup>
                        <CommandItem
                           value="no-cycle"
                           onSelect={() => toggleFilter('cycle', 'no-cycle')}
                           className="flex items-center justify-between"
                        >
                           <div className="flex items-center gap-2">
                              <RefreshCcw className="size-4 text-muted-foreground" />
                              No cycle
                           </div>
                           {filters.cycle.includes('no-cycle') && (
                              <CheckIcon size={16} className="ml-auto" />
                           )}
                           <span className="text-muted-foreground text-xs">
                              {filterByCycle('').length}
                           </span>
                        </CommandItem>
                        {cycles.map((cycle) => (
                           <CommandItem
                              key={cycle.id}
                              value={cycle.id}
                              onSelect={() => toggleFilter('cycle', cycle.id)}
                              className="flex items-center justify-between"
                           >
                              <div className="flex items-center gap-2">
                                 <RefreshCcw className="size-4 text-muted-foreground" />
                                 {cycle.name}
                                 <span className="text-[10px] text-muted-foreground">
                                    {cycleStatusLabel[cycle.status]}
                                 </span>
                              </div>
                              {filters.cycle.includes(cycle.id) && (
                                 <CheckIcon size={16} className="ml-auto" />
                              )}
                              <span className="text-muted-foreground text-xs">
                                 {filterByCycle(cycle.id).length}
                              </span>
                           </CommandItem>
                        ))}
                     </CommandGroup>
                  </CommandList>
               </Command>
            ) : null}
         </PopoverContent>
      </Popover>
   );
}
