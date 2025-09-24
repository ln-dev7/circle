'use client';

import { Button } from '@/components/ui/button';
import {
   Command,
   CommandGroup,
   CommandItem,
   CommandList,
   CommandSeparator,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useMemo, useState } from 'react';
import { ArrowUpDown, CheckIcon, ChevronRight, ListFilter, Shield } from 'lucide-react';
import { Team, teams } from '@/mock-data/teams';
import { useTeamsFilterStore } from '@/store/team-filter-store';

type FilterType = 'membership' | 'sort' | 'identifiers';

const Membership: Array<'Joined' | 'Not-Joined'> = ['Joined', 'Not-Joined'];

export function Filter() {
   const [open, setOpen] = useState(false);
   const [active, setActive] = useState<FilterType | null>(null);

   const Identifiers: Team['id'][] = useMemo(() => {
      return teams.map((team) => team.id);
   }, [teams]);

   const { filters, sort, toggleFilter, clearFilters, getActiveFiltersCount, setSort } =
      useTeamsFilterStore();

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
            {active === null ? (
               <Command>
                  <CommandList>
                     <CommandGroup>
                        <CommandItem
                           onSelect={() => setActive('membership')}
                           className="flex items-center justify-between cursor-pointer"
                        >
                           <span className="flex items-center gap-2">
                              <Shield className="size-4 text-muted-foreground" />
                              Members
                           </span>
                           <div className="flex items-center">
                              {filters.membership.length > 0 && (
                                 <span className="text-xs text-muted-foreground mr-1">
                                    {filters.membership.length}
                                 </span>
                              )}
                              <ChevronRight className="size-4" />
                           </div>
                        </CommandItem>
                        <CommandItem
                           onSelect={() => setActive('identifiers')}
                           className="flex items-center justify-between cursor-pointer"
                        >
                           <span className="flex items-center gap-2">
                              <Shield className="size-4 text-muted-foreground" />
                              Identifiers
                           </span>
                           <div className="flex items-center">
                              {filters.identifier.length > 0 && (
                                 <span className="text-xs text-muted-foreground mr-1">
                                    {filters.identifier.length}
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
            ) : active === 'membership' ? (
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
                     <span className="ml-2 font-medium">Status</span>
                  </div>
                  <CommandList>
                     <CommandGroup>
                        {Membership.map((type) => (
                           <CommandItem
                              key={type}
                              value={type}
                              onSelect={() => toggleFilter('membership', type)}
                              className="flex items-center justify-between"
                           >
                              {type}
                              {filters.membership.includes(type) && <CheckIcon size={16} />}
                           </CommandItem>
                        ))}
                     </CommandGroup>
                  </CommandList>
               </Command>
            ) : active === 'identifiers' ? (
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
                     <span className="ml-2 font-medium">Status</span>
                  </div>
                  <CommandList>
                     <CommandGroup>
                        {Identifiers.map((id) => (
                           <CommandItem
                              key={id}
                              value={id}
                              onSelect={() => toggleFilter('identifier', id)}
                              className="flex items-center justify-between"
                           >
                              {id}
                              {filters.identifier.includes(id) && <CheckIcon size={16} />}
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
                     <CommandGroup heading="Name">
                        <CommandItem
                           onSelect={() => setSort('name-asc')}
                           className="flex items-center justify-between"
                        >
                           A → Z{sort === 'name-asc' && <CheckIcon size={16} />}
                        </CommandItem>
                        <CommandItem
                           onSelect={() => setSort('name-desc')}
                           className="flex items-center justify-between"
                        >
                           Z → A{sort === 'name-desc' && <CheckIcon size={16} />}
                        </CommandItem>
                     </CommandGroup>
                     <CommandSeparator />
                     <CommandGroup heading="Members">
                        <CommandItem
                           onSelect={() => setSort('members-asc')}
                           className="flex items-center justify-between"
                        >
                           No. of Members (asc)
                           {sort === 'members-asc' && <CheckIcon size={16} />}
                        </CommandItem>
                        <CommandItem
                           onSelect={() => setSort('members-desc')}
                           className="flex items-center justify-between"
                        >
                           No. of Members (desc)
                           {sort === 'members-desc' && <CheckIcon size={16} />}
                        </CommandItem>
                     </CommandGroup>
                     <CommandSeparator />
                     <CommandGroup heading="Projects">
                        <CommandItem
                           onSelect={() => setSort('projects-asc')}
                           className="flex items-center justify-between"
                        >
                           No. of Projects (asc)
                           {sort === 'projects-asc' && <CheckIcon size={16} />}
                        </CommandItem>
                        <CommandItem
                           onSelect={() => setSort('projects-desc')}
                           className="flex items-center justify-between"
                        >
                           No. of Projects (desc)
                           {sort === 'projects-desc' && <CheckIcon size={16} />}
                        </CommandItem>
                     </CommandGroup>
                  </CommandList>
               </Command>
            ) : null}
         </PopoverContent>
      </Popover>
   );
}
