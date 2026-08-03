'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { User } from '@/mock-data/users';
import { cn } from '@/lib/utils';
import { ChevronRight, Star } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { parseAsString, useQueryState } from 'nuqs';

const PROFILE_TABS = [
   { label: 'Assigned', value: 'assigned' },
   { label: 'Created', value: 'created' },
];

function ProfileTabs() {
   const [activeTab, setActiveTab] = useQueryState('tab', parseAsString.withDefault('assigned'));

   return (
      <div className="flex items-center gap-1">
         {PROFILE_TABS.map((tab) => {
            const isActive = activeTab === tab.value;
            return (
               <button
                  key={tab.value}
                  type="button"
                  onClick={() => void setActiveTab(tab.value === 'assigned' ? null : tab.value)}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                     'px-2.5 h-7 inline-flex items-center rounded-full border text-xs font-medium transition-colors',
                     isActive
                        ? 'bg-accent text-foreground border-border'
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  )}
               >
                  {tab.label}
               </button>
            );
         })}
      </div>
   );
}

export default function Header({ member }: { member: User }) {
   const { orgId } = useParams<{ orgId: string }>();

   return (
      <>
         <div className="w-full flex justify-between items-center border-b py-1.5 px-6 h-10">
            <div className="flex items-center gap-2 min-w-0">
               <SidebarTrigger className="" />
               <div className="flex items-center gap-1.5 text-sm min-w-0">
                  <Link
                     href={`/${orgId}/members`}
                     className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                     Members
                  </Link>
                  <ChevronRight className="size-3.5 text-muted-foreground shrink-0" />
                  <Avatar className="size-5 shrink-0">
                     <AvatarImage src={member.avatarUrl} alt={member.name} />
                     <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium truncate">{member.name}</span>
                  <Button variant="ghost" size="icon" className="size-6 text-muted-foreground">
                     <Star className="size-3.5" />
                  </Button>
               </div>
            </div>
         </div>
         <div className="w-full flex justify-between items-center border-b py-1.5 px-6 h-10">
            <ProfileTabs />
         </div>
      </>
   );
}
