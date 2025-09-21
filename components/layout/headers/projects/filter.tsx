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
import { health as allHealth } from '@/mock-data/projects';
import { priorities } from '@/mock-data/priorities';
import { useProjectsFilterStore } from '@/store/projects-filter-store';
import { useState } from 'react';
import {
   ArrowUpDown,
   BarChart3,
   CheckIcon,
   ChevronRight,
   HeartPulse,
   ListFilter,
} from 'lucide-react';

type FilterType = 'health' | 'priority' | 'sort';

export function Filter() {
   const [open, setOpen] = useState(false);
   const [active, setActive] = useState<FilterType | null>(null);

   const { filters, sort, toggleFilter, clearFilters, getActiveFiltersCount, setSort } =
      useProjectsFilterStore();

   return (
      <Popover open={open} onOpenChange={setOpen}>
         <PopoverTrigger asChild>
            <Button size="xs" variant="ghost" className="relative">
               <ListFilter className="size-4" />
               <span className="hidden sm:inline ml-1">Filter</span>
               {getActiveFiltersCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] rounded-full size-4 flex items-center justify-center">
                     {getActiveFiltersCount()}
                  </span>
               )}
            </Button>
         </PopoverTrigger>
         <PopoverContent className="p-0 w-64" align="start">
            {active === null ? (
               <Command>
                  <CommandList>
                     <CommandGroup>
                        <CommandItem
                           onSelect={() => setActive('health')}
                           className="flex items-center justify-between cursor-pointer"
                        >
                           <span className="flex items-center gap-2">
                              <HeartPulse className="size-4 text-muted-foreground" />
                              Health
                           </span>
                           <div className="flex items-center">
                              {filters.health.length > 0 && (
                                 <span className="text-xs text-muted-foreground mr-1">
                                    {filters.health.length}
                                 </span>
                              )}
                              <ChevronRight className="size-4" />
                           </div>
                        </CommandItem>
                        <CommandItem
                           onSelect={() => setActive('priority')}
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
                           onSelect={() => setActive('sort')}
                           className="flex items-center justify-between cursor-pointer"
                        >
                           <span className="flex items-center gap-2">
                              <ArrowUpDown className="size-4 text-muted-foreground" />
                              Sort by
                           </span>
                           <ChevronRight className="size-4" />
                        </CommandItem>
                     </CommandGroup>
                     {getActiveFiltersCount() > 0 && (
                        <>
                           <CommandSeparator />
                           <CommandGroup>
                              <CommandItem
                                 onSelect={() => clearFilters()}
                                 className="cursor-pointer"
                              >
                                 Clear all filters
                              </CommandItem>
                           </CommandGroup>
                        </>
                     )}
                  </CommandList>
               </Command>
            ) : active === 'health' ? (
               <Command>
                  <div className="flex items-center border-b p-2">
                     <Button
                        variant="ghost"
                        size="icon"
                        className="size-6"
                        onClick={() => setActive(null)}
                     >
                        <ChevronRight className="size-4 rotate-180" />
                     </Button>
                     <span className="ml-2 font-medium">Health</span>
                  </div>
                  <CommandInput placeholder="Search health..." />
                  <CommandList>
                     <CommandEmpty>No health found.</CommandEmpty>
                     <CommandGroup>
                        {allHealth.map((h) => (
                           <CommandItem
                              key={h.id}
                              value={`${h.id} ${h.name}`}
                              onSelect={() => toggleFilter('health', h.id)}
                              className="flex items-center justify-between"
                           >
                              <div className="flex items-center gap-2">
                                 <span
                                    className="size-3 rounded-full"
                                    style={{ backgroundColor: h.color }}
                                 />
                                 {h.name}
                              </div>
                              {filters.health.includes(h.id) && <CheckIcon size={16} />}
                           </CommandItem>
                        ))}
                     </CommandGroup>
                  </CommandList>
               </Command>
            ) : active === 'priority' ? (
               <Command>
                  <div className="flex items-center border-b p-2">
                     <Button
                        variant="ghost"
                        size="icon"
                        className="size-6"
                        onClick={() => setActive(null)}
                     >
                        <ChevronRight className="size-4 rotate-180" />
                     </Button>
                     <span className="ml-2 font-medium">Priority</span>
                  </div>
                  <CommandInput placeholder="Search priorities..." />
                  <CommandList>
                     <CommandEmpty>No priorities found.</CommandEmpty>
                     <CommandGroup>
                        {priorities.map((p) => (
                           <CommandItem
                              key={p.id}
                              value={`${p.id} ${p.name}`}
                              onSelect={() => toggleFilter('priority', p.id)}
                              className="flex items-center justify-between"
                           >
                              <div className="flex items-center gap-2">
                                 <p.icon className="text-muted-foreground size-4" />
                                 {p.name}
                              </div>
                              {filters.priority.includes(p.id) && <CheckIcon size={16} />}
                           </CommandItem>
                        ))}
                     </CommandGroup>
                  </CommandList>
               </Command>
            ) : active === 'sort' ? (
               <Command>
                  <div className="flex items-center border-b p-2">
                     <Button
                        variant="ghost"
                        size="icon"
                        className="size-6"
                        onClick={() => setActive(null)}
                     >
                        <ChevronRight className="size-4 rotate-180" />
                     </Button>
                     <span className="ml-2 font-medium">Sort by</span>
                  </div>
                  <CommandList>
                     <CommandGroup heading="Title">
                        <CommandItem
                           onSelect={() => setSort('title-asc')}
                           className="flex items-center justify-between"
                        >
                           A → Z{sort === 'title-asc' && <CheckIcon size={16} />}
                        </CommandItem>
                        <CommandItem
                           onSelect={() => setSort('title-desc')}
                           className="flex items-center justify-between"
                        >
                           Z → A{sort === 'title-desc' && <CheckIcon size={16} />}
                        </CommandItem>
                     </CommandGroup>
                     <CommandSeparator />
                     <CommandGroup heading="Targeted Date">
                        <CommandItem
                           onSelect={() => setSort('date-asc')}
                           className="flex items-center justify-between"
                        >
                           Oldest to Newest
                           {sort === 'date-asc' && <CheckIcon size={16} />}
                        </CommandItem>
                        <CommandItem
                           onSelect={() => setSort('date-desc')}
                           className="flex items-center justify-between"
                        >
                           Newest to Oldest
                           {sort === 'date-desc' && <CheckIcon size={16} />}
                        </CommandItem>
                     </CommandGroup>
                     <CommandSeparator />
                     <CommandGroup heading="Status">
                        <CommandItem
                           onSelect={() => setSort('status-asc')}
                           className="flex items-center justify-between"
                        >
                           Lowest to Highest
                           {sort === 'status-asc' && <CheckIcon size={16} />}
                        </CommandItem>
                        <CommandItem
                           onSelect={() => setSort('status-desc')}
                           className="flex items-center justify-between"
                        >
                           Highest to Lowest
                           {sort === 'status-desc' && <CheckIcon size={16} />}
                        </CommandItem>
                     </CommandGroup>
                  </CommandList>
               </Command>
            ) : null}
         </PopoverContent>
      </Popover>
   );
}
