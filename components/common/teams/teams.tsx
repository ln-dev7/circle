'use client';

import { teams as allTeams } from '@/mock-data/teams';
import TeamLine from './team-line';
import { useTeamsFilterStore } from '@/store/team-filter-store';
import { useMemo } from 'react';

export default function Teams() {
   const { filters, sort } = useTeamsFilterStore();

   const displayed = useMemo(() => {
      let list = allTeams.slice();

      // filter by membership
      if (filters.membership.length > 0) {
         const selectedMembership = new Set(filters.membership);
         list = list.filter((team) =>
            selectedMembership.has(team.joined ? 'Joined' : 'Not-Joined')
         );
      }

      // filter by identifier
      if (filters.identifier.length > 0) {
         const selectedIdentifiers = new Set(filters.identifier);
         list = list.filter((team) => selectedIdentifiers.has(team.id));
      }

      // sorting
      const compare = (a: (typeof list)[number], b: (typeof list)[number]) => {
         switch (sort) {
            case 'name-asc':
               return a.name.localeCompare(b.name);
            case 'name-desc':
               return b.name.localeCompare(a.name);
            case 'members-asc':
               return a.members.length - b.members.length;
            case 'members-desc':
               return b.members.length - a.members.length;
            case 'projects-asc':
               return a.projects.length - b.projects.length;
            case 'projects-desc':
               return b.projects.length - a.projects.length;
            default:
               return 0;
         }
      };

      return list.sort(compare);
   }, [filters, sort]);

   return (
      <div className="w-full">
         <div className="bg-container px-6 py-1.5 text-sm flex items-center text-muted-foreground border-b sticky top-0 z-10">
            <div className="w-[70%] sm:w-[50%] md:w-[45%] lg:w-[40%]">Name</div>
            <div className="hidden sm:block sm:w-[20%] md:w-[15%]">Membership</div>
            <div className="hidden sm:block sm:w-[20%] md:w-[15%]">Identifier</div>
            <div className="w-[30%] sm:w-[20%] md:w-[15%]">Members</div>
            <div className="hidden sm:block sm:w-[20%] md:w-[15%]">Projects</div>
         </div>

         <div className="w-full">
            {displayed.map((team) => (
               <TeamLine key={team.id} team={team} />
            ))}
         </div>
      </div>
   );
}
