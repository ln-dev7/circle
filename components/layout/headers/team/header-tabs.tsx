'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

const TEAM_TABS = [
   { label: 'Overview', segment: 'overview' },
   { label: 'Documents', segment: 'documents' },
   { label: 'Members', segment: 'members' },
];

export default function HeaderTabs() {
   const { orgId, teamId } = useParams<{ orgId: string; teamId: string }>();
   const pathname = usePathname();

   return (
      <div className="w-full flex justify-between items-center border-b py-1.5 px-6 h-10">
         <div className="flex items-center gap-1">
            {TEAM_TABS.map((tab) => {
               const href = `/${orgId}/team/${teamId}/${tab.segment}`;
               const isActive = pathname === href;
               return (
                  <Link
                     key={tab.segment}
                     href={href}
                     className={cn(
                        'px-2.5 h-7 inline-flex items-center rounded-full border text-xs font-medium transition-colors',
                        isActive
                           ? 'bg-accent text-foreground border-border'
                           : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/50'
                     )}
                  >
                     {tab.label}
                  </Link>
               );
            })}
         </div>
      </div>
   );
}
