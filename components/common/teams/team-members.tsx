'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { teams } from '@/mock-data/teams';
import { Plus, SlidersHorizontal } from 'lucide-react';
import { useParams } from 'next/navigation';

/**
 * Team Home — "Members" tab: members of the current team with
 * their email and role.
 */
export default function TeamMembers() {
   const { teamId } = useParams<{ orgId: string; teamId: string }>();
   const team = teams.find((t) => t.id === teamId) ?? teams[0];

   const members = [...team.members].sort((a, b) => a.name.localeCompare(b.name));

   return (
      <div className="w-full">
         <div className="flex items-center justify-between px-6 py-3">
            <span className="text-sm text-muted-foreground font-medium">Name ↓</span>
            <div className="flex items-center gap-2">
               <Button size="xs" variant="secondary">
                  <Plus className="size-4 mr-1" />
                  Add a member
               </Button>
               <Button size="xs" variant="ghost">
                  <SlidersHorizontal className="size-4" />
               </Button>
            </div>
         </div>

         <div className="bg-container px-6 py-1.5 text-sm flex items-center text-muted-foreground border-b sticky top-0 z-10">
            <div className="w-[55%] md:w-[45%]">Name</div>
            <div className="hidden md:block md:w-[35%]">Email</div>
            <div className="w-[45%] md:w-[20%]">Role</div>
         </div>

         {members.map((member) => (
            <div
               key={member.id}
               className="w-full flex items-center px-6 h-12 hover:bg-sidebar/50 border-b border-border/30 text-sm"
            >
               <div className="w-[55%] md:w-[45%] flex items-center gap-2.5 min-w-0">
                  <Avatar className="size-6 shrink-0">
                     <AvatarImage src={member.avatarUrl} alt={member.name} />
                     <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                     <span className="font-medium truncate">{member.name}</span>
                     <span className="text-xs text-muted-foreground truncate">
                        {member.name.split('.')[0]}
                     </span>
                  </div>
               </div>
               <div className="hidden md:block md:w-[35%] text-muted-foreground truncate">
                  {member.email}
               </div>
               <div className="w-[45%] md:w-[20%]">
                  <span className="text-xs px-2 py-1 rounded-md bg-accent text-muted-foreground">
                     {member.role}
                  </span>
               </div>
            </div>
         ))}
      </div>
   );
}
