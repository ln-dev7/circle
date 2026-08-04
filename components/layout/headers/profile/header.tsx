'use client';

import { IssueFilterTrigger } from '@/components/common/issues/issue-filter-trigger';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { issueCreatorIndex } from '@/mock-data/issues';
import { User, users } from '@/mock-data/users';
import { cn } from '@/lib/utils';
import { useIssuesStore } from '@/store/issues-store';
import { useRightPanelStore } from '@/store/right-panel-store';
import { useSearchStore } from '@/store/search-store';
import { BarChart3, ChevronRight, PanelRight, SearchIcon, Star } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { parseAsString, useQueryState } from 'nuqs';
import { useEffect, useRef } from 'react';
import { DisplayOptions } from '../display-options';
import Notifications from '../issues/notifications';

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

function HeaderSearch() {
   const { isSearchOpen, toggleSearch, closeSearch, setSearchQuery, searchQuery } =
      useSearchStore();
   const searchInputRef = useRef<HTMLInputElement>(null);
   const searchContainerRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      if (isSearchOpen && searchInputRef.current) {
         searchInputRef.current.focus();
      }
   }, [isSearchOpen]);

   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (
            searchContainerRef.current &&
            !searchContainerRef.current.contains(event.target as Node) &&
            isSearchOpen &&
            searchQuery.trim() === ''
         ) {
            closeSearch();
         }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
   }, [isSearchOpen, closeSearch, searchQuery]);

   if (isSearchOpen) {
      return (
         <div ref={searchContainerRef} className="relative flex items-center w-64">
            <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
               type="search"
               ref={searchInputRef}
               value={searchQuery}
               onChange={(event) => setSearchQuery(event.target.value)}
               placeholder="Search issues..."
               className="pl-8 h-7 text-sm"
               onKeyDown={(event) => {
                  if (event.key === 'Escape') {
                     if (searchQuery.trim() === '') closeSearch();
                     else setSearchQuery('');
                  }
               }}
            />
         </div>
      );
   }
   return (
      <>
         <Button
            variant="ghost"
            size="icon"
            onClick={toggleSearch}
            className="h-8 w-8"
            aria-label="Search"
         >
            <SearchIcon className="h-4 w-4" />
         </Button>
         <Notifications />
      </>
   );
}

export default function Header({ member }: { member: User }) {
   const { orgId } = useParams<{ orgId: string }>();
   const [activeTab] = useQueryState('tab', parseAsString.withDefault('assigned'));
   const { issues } = useIssuesStore();
   const { openPanel, togglePanel } = useRightPanelStore();

   const memberIndex = Math.max(
      0,
      users.findIndex((candidate) => candidate.id === member.id)
   );
   const count =
      activeTab === 'created'
         ? issues.filter((issue) => issueCreatorIndex(issue, users.length) === memberIndex).length
         : issues.filter((issue) => issue.assignee?.id === member.id).length;

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
            <div className="flex items-center gap-2">
               <HeaderSearch />
            </div>
         </div>
         <div className="w-full flex justify-between items-center border-b py-1.5 px-6 h-10">
            <div className="flex items-center gap-3">
               <ProfileTabs />
               <span className="text-sm text-muted-foreground hidden sm:inline">
                  {count} {count === 1 ? 'issue' : 'issues'}
               </span>
            </div>
            <div className="flex items-center gap-1">
               <IssueFilterTrigger />
               <Button
                  size="xs"
                  variant={openPanel === 'insights' ? 'secondary' : 'ghost'}
                  onClick={() => togglePanel('insights')}
                  aria-label="Toggle insights panel"
               >
                  <BarChart3 className="size-4" />
               </Button>
               <Button
                  size="xs"
                  variant={openPanel !== 'hidden' && openPanel !== 'insights' ? 'secondary' : 'ghost'}
                  onClick={() => togglePanel('hidden')}
                  aria-label="Toggle profile panel"
               >
                  <PanelRight className="size-4" />
               </Button>
               <DisplayOptions />
            </div>
         </div>
      </>
   );
}
