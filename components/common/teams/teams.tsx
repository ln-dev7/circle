'use client';

import { teams as allTeams } from '@/mock-data/teams';
import { useTeamsFilterStore } from '@/store/team-filter-store';
import { useTeamsDisplayStore } from '@/store/teams-display-store';
import { useMemo } from 'react';
import { Filter } from '@/components/layout/headers/teams/filter';
import TeamLine from './team-line';
import { TeamsDisplayOptions } from './teams-display-options';

export default function Teams() {
   const { filters } = useTeamsFilterStore();
   const { ordering, displayProperties } = useTeamsDisplayStore();

   const displayed = useMemo(() => {
      let list = allTeams.slice();

      if (filters.membership.length > 0) {
         const selectedMembership = new Set(filters.membership);
         list = list.filter((team) =>
            selectedMembership.has(team.joined ? 'Joined' : 'Not-Joined')
         );
      }
      if (filters.identifier.length > 0) {
         const selectedIdentifiers = new Set(filters.identifier);
         list = list.filter((team) => selectedIdentifiers.has(team.id));
      }

      const compare = (a: (typeof list)[number], b: (typeof list)[number]) => {
         switch (ordering) {
            case 'members':
               return b.members.length - a.members.length;
            case 'projects':
               return b.projects.length - a.projects.length;
            case 'name':
            default:
               return a.name.localeCompare(b.name);
         }
      };
      return list.sort(compare);
   }, [filters, ordering]);

   return (
      <div className="w-full">
         {/* Count + view controls (Linear-style) */}
         <div className="w-full flex justify-between items-center border-b py-1.5 px-6 h-10 sticky top-0 bg-container z-20">
            <span className="text-sm text-muted-foreground">
               {displayed.length} {displayed.length === 1 ? 'team' : 'teams'}
            </span>
            <div className="flex items-center gap-1">
               <Filter />
               <TeamsDisplayOptions />
            </div>
         </div>

         {/* Column headers */}
         <div className="bg-container px-6 py-1.5 text-sm flex items-center text-muted-foreground border-b sticky top-10 z-10">
            <div className="flex-1 min-w-0">Name</div>
            {displayProperties.membership && (
               <div className="hidden sm:block w-[110px] shrink-0">Membership</div>
            )}
            {displayProperties.owners && (
               <div className="hidden lg:block w-[70px] shrink-0">Owners</div>
            )}
            {displayProperties.members && <div className="w-[150px] shrink-0">Members</div>}
            {displayProperties.cycle && (
               <div className="hidden md:block w-[80px] shrink-0">Cycle</div>
            )}
            {displayProperties.projects && (
               <div className="hidden sm:block w-[80px] shrink-0">Projects</div>
            )}
            {displayProperties.created && (
               <div className="hidden xl:block w-[90px] shrink-0">Created</div>
            )}
            {displayProperties.updated && (
               <div className="hidden xl:block w-[90px] shrink-0">Updated</div>
            )}
         </div>

         <div className="w-full">
            {displayed.map((team) => (
               <TeamLine key={team.id} team={team} />
            ))}
         </div>
      </div>
   );
}
