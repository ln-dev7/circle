'use client';

import {
   MY_ISSUES_TAB_ITEMS,
   scopeMyIssues,
   useMyIssuesTab,
} from '@/components/common/my-issues/use-my-issues';
import { IssueFilterTrigger } from '@/components/common/issues/issue-filter-trigger';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { useIssuesStore } from '@/store/issues-store';
import { useRightPanelStore } from '@/store/right-panel-store';
import { useSearchStore } from '@/store/search-store';
import { BarChart3, PanelRight, SearchIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { DisplayOptions } from '../display-options';
import Notifications from '../issues/notifications';

function HeaderNav() {
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

   return (
      <div className="w-full flex justify-between items-center border-b py-1.5 px-6 h-10">
         <div className="flex items-center gap-2">
            <SidebarTrigger />
            <span className="text-sm font-medium">My issues</span>
         </div>
         <div className="flex items-center gap-2">
            {isSearchOpen ? (
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

function HeaderOptions() {
   const [tab, setTab] = useMyIssuesTab();
   const { issues } = useIssuesStore();
   const { openPanel, togglePanel } = useRightPanelStore();

   const count = scopeMyIssues(issues, tab).length;

   return (
      <div className="w-full flex justify-between items-center border-b py-1.5 px-6 h-10">
         <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
               {MY_ISSUES_TAB_ITEMS.map((item) => (
                  <button
                     key={item.value}
                     type="button"
                     onClick={() => void setTab(item.value === 'assigned' ? null : item.value)}
                     className={cn(
                        'px-2.5 h-7 inline-flex items-center rounded-full border text-xs font-medium transition-colors',
                        tab === item.value
                           ? 'bg-accent text-foreground border-border'
                           : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/50'
                     )}
                  >
                     {item.label}
                  </button>
               ))}
            </div>
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
               variant={openPanel === 'breakdown' ? 'secondary' : 'ghost'}
               onClick={() => togglePanel('breakdown')}
               aria-label="Toggle breakdown panel"
            >
               <PanelRight className="size-4" />
            </Button>
            <DisplayOptions />
         </div>
      </div>
   );
}

export default function Header() {
   return (
      <>
         <HeaderNav />
         <HeaderOptions />
      </>
   );
}
