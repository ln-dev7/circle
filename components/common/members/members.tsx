'use client';

import { users as allUsers } from '@/mock-data/users';
import MemberLine from './member-line';
import { useMembersFilterStore } from '@/store/members-filter-store';
import { useMemo } from 'react';

export default function Members() {
   const { filters, sort } = useMembersFilterStore();

   const displayed = useMemo(() => {
      let list = allUsers.slice();

      // filter by role (called Status in UI)
      if (filters.role.length > 0) {
         const roles = new Set(filters.role);
         list = list.filter((u) => roles.has(u.role));
      }

      // sorting
      const compare = (a: (typeof list)[number], b: (typeof list)[number]) => {
         switch (sort) {
            case 'name-asc':
               return a.name.localeCompare(b.name);
            case 'name-desc':
               return b.name.localeCompare(a.name);
            case 'joined-asc':
               return new Date(a.joinedDate).getTime() - new Date(b.joinedDate).getTime();
            case 'joined-desc':
               return new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime();
            case 'teams-asc':
               return a.teamIds.length - b.teamIds.length;
            case 'teams-desc':
               return b.teamIds.length - a.teamIds.length;
            default:
               return 0;
         }
      };

      return list.sort(compare);
   }, [filters, sort]);

   return (
      <div className="w-full">
         <div className="bg-container px-6 py-1.5 text-sm flex items-center text-muted-foreground border-b sticky top-0 z-10">
            <div className="w-[70%] md:w-[60%] lg:w-[55%]">Name</div>
            <div className="w-[30%] md:w-[20%] lg:w-[15%]">Status</div>
            <div className="hidden lg:block w-[15%]">Joined</div>
            <div className="w-[30%] hidden md:block md:w-[20%] lg:w-[15%]">Teams</div>
         </div>

         <div className="w-full">
            {displayed.map((user) => (
               <MemberLine key={user.id} user={user} />
            ))}
         </div>
      </div>
   );
}
