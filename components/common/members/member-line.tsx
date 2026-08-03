'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { User } from '@/mock-data/users';
import { format, parseISO } from 'date-fns';
import { SquareUser } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface MemberLineProps {
   user: User;
}

/** "mason.carter" → "Mason Carter" (Linear shows display name + handle). */
const displayNameOf = (user: User) =>
   user.name
      .split('.')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');

/** Linear-style joined date: current year → "Mar 17", otherwise "Oct 2023". */
const joinedLabel = (iso: string) => {
   const date = parseISO(iso);
   return date.getFullYear() === 2026 ? format(date, 'MMM d') : format(date, 'MMM yyyy');
};

const hashString = (value: string): number => {
   let hash = 0;
   for (let i = 0; i < value.length; i++) hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
   return hash;
};

export default function MemberLine({ user }: MemberLineProps) {
   const { orgId } = useParams<{ orgId: string }>();
   const isApplication = user.role === 'Application';
   // Like Linear, some accounts show their e-mail as the primary line.
   const showEmailAsName = !isApplication && hashString(user.id) % 4 === 0;

   return (
      <Link
         href={`/${orgId}/profiles/${user.id}`}
         className="w-full flex items-center py-2.5 px-6 border-b hover:bg-sidebar/50 border-muted-foreground/5 text-sm last:border-b-0"
      >
         {/* Name */}
         <div className="flex-1 min-w-0 flex items-center gap-2.5">
            <Avatar className="size-8 shrink-0">
               <AvatarImage src={user.avatarUrl} alt={user.name} />
               <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start overflow-hidden">
               <span className="font-medium truncate w-full">
                  {showEmailAsName ? user.email : displayNameOf(user)}
               </span>
               <span className="text-xs text-muted-foreground truncate w-full">{user.name}</span>
            </div>
         </div>

         {/* Status (role) */}
         <div className="w-[110px] shrink-0">
            {isApplication ? (
               <span className="text-xs text-muted-foreground">Application</span>
            ) : (
               <span
                  className={cn(
                     'inline-flex items-center text-xs border rounded-md px-1.5 py-0.5',
                     user.role === 'Admin'
                        ? 'text-indigo-500 dark:text-indigo-400 border-indigo-500/30 bg-indigo-500/5'
                        : 'text-muted-foreground'
                  )}
               >
                  {user.role}
               </span>
            )}
         </div>

         {/* Joined */}
         <div className="hidden lg:block w-[100px] shrink-0 text-xs text-muted-foreground">
            {joinedLabel(user.joinedDate)}
         </div>

         {/* Teams */}
         <div className="hidden md:flex w-[170px] shrink-0 items-center gap-1.5 text-xs text-muted-foreground min-w-0">
            {user.teamIds.length > 0 && (
               <>
                  <SquareUser className="size-3.5 shrink-0" />
                  <span className="truncate">
                     {user.teamIds.slice(0, 2).join(', ')}
                     {user.teamIds.length > 2 && ` +${user.teamIds.length - 2}`}
                  </span>
               </>
            )}
         </div>

         {/* Last seen (Linear only shows currently-online members) */}
         <div className="hidden sm:flex w-[90px] shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
            {user.status === 'online' && !isApplication && (
               <>
                  <span className="size-1.5 rounded-full bg-[#00cc66]" />
                  Online
               </>
            )}
         </div>
      </Link>
   );
}
