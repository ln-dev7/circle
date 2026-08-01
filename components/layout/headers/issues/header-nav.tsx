'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { useSearchStore } from '@/store/search-store';
import { SearchIcon } from 'lucide-react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import Notifications from './notifications';

const ISSUE_VIEW_TABS = [
   { label: 'Active', segment: 'active' },
   { label: 'Backlog', segment: 'backlog' },
   { label: 'All issues', segment: 'all' },
];

function IssueViewTabs() {
   const { orgId, teamId } = useParams<{ orgId: string; teamId: string }>();
   const pathname = usePathname();

   return (
      <div className="flex items-center gap-1">
         {ISSUE_VIEW_TABS.map((tab) => {
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
   );
}

export default function HeaderNav() {
   const { isSearchOpen, toggleSearch, closeSearch, setSearchQuery, searchQuery } =
      useSearchStore();
   const searchInputRef = useRef<HTMLInputElement>(null);
   const searchContainerRef = useRef<HTMLDivElement>(null);
   const previousValueRef = useRef<string>('');

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
            isSearchOpen
         ) {
            if (searchQuery.trim() === '') {
               closeSearch();
            }
         }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
      };
   }, [isSearchOpen, closeSearch, searchQuery]);

   return (
      <div className="w-full flex justify-between items-center border-b py-1.5 px-6 h-10">
         <div className="flex items-center gap-3">
            <SidebarTrigger className="" />
            <IssueViewTabs />
         </div>

         <div className="flex items-center gap-2">
            {isSearchOpen ? (
               <div
                  ref={searchContainerRef}
                  className="relative flex items-center justify-center w-64 transition-all duration-200 ease-in-out"
               >
                  <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                     type="search"
                     ref={searchInputRef}
                     value={searchQuery}
                     onChange={(e) => {
                        previousValueRef.current = searchQuery;
                        const newValue = e.target.value;
                        setSearchQuery(newValue);

                        if (previousValueRef.current && newValue === '') {
                           const inputEvent = e.nativeEvent as InputEvent;
                           if (
                              inputEvent.inputType !== 'deleteContentBackward' &&
                              inputEvent.inputType !== 'deleteByCut'
                           ) {
                              closeSearch();
                           }
                        }
                     }}
                     placeholder="Search issues..."
                     className="pl-8 h-7 text-sm"
                     onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                           if (searchQuery.trim() === '') {
                              closeSearch();
                           } else {
                              setSearchQuery('');
                           }
                        }
                     }}
                  />
               </div>
            ) : (
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
            )}
         </div>
      </div>
   );
}
