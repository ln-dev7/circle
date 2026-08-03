'use client';

import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { getProjectById } from '@/mock-data/projects';
import { useRightPanelStore } from '@/store/right-panel-store';
import { BarChart3, ChevronRight, Link2, MoreHorizontal, PanelRight, Star } from 'lucide-react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

const PROJECT_TABS = [
   { label: 'Overview', segment: 'overview' },
   { label: 'Activity', segment: 'activity' },
   { label: 'Issues', segment: 'issues' },
];

function ProjectTabs({ projectId }: { projectId: string }) {
   const { orgId } = useParams<{ orgId: string }>();
   const pathname = usePathname();

   return (
      <div className="flex items-center gap-1">
         {PROJECT_TABS.map((tab) => {
            const href = `/${orgId}/project/${projectId}/${tab.segment}`;
            const isActive = pathname === href;
            return (
               <Link
                  key={tab.segment}
                  href={href}
                  aria-current={isActive ? 'page' : undefined}
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

function PanelToggles() {
   const { openPanel, togglePanel } = useRightPanelStore();

   return (
      <div className="flex items-center gap-1">
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
            variant={openPanel === 'hidden' ? 'ghost' : 'secondary'}
            onClick={() => togglePanel('hidden')}
            aria-label="Toggle side panel"
         >
            <PanelRight className="size-4" />
         </Button>
      </div>
   );
}

export default function Header({ projectId }: { projectId: string }) {
   const { orgId } = useParams<{ orgId: string }>();
   const project = getProjectById(projectId);
   if (!project) return null;

   return (
      <>
         <div className="w-full flex justify-between items-center border-b py-1.5 px-6 h-10">
            <div className="flex items-center gap-2 min-w-0">
               <SidebarTrigger className="" />
               <div className="flex items-center gap-1.5 text-sm min-w-0">
                  <Link
                     href={`/${orgId}/projects`}
                     className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                     Projects
                  </Link>
                  <ChevronRight className="size-3.5 text-muted-foreground shrink-0" />
                  <span className="inline-flex size-5 bg-muted/50 items-center justify-center rounded shrink-0">
                     <project.icon className="size-3.5" />
                  </span>
                  <span className="font-medium truncate">{project.name}</span>
                  <Button variant="ghost" size="icon" className="size-6 text-muted-foreground">
                     <Star className="size-3.5" />
                  </Button>
               </div>
            </div>
            <div className="flex items-center gap-1">
               <Button variant="ghost" size="icon" className="size-7 text-muted-foreground">
                  <Link2 className="size-4" />
               </Button>
               <Button variant="ghost" size="icon" className="size-7 text-muted-foreground">
                  <MoreHorizontal className="size-4" />
               </Button>
            </div>
         </div>
         <div className="w-full flex justify-between items-center border-b py-1.5 px-6 h-10">
            <ProjectTabs projectId={project.id} />
            <PanelToggles />
         </div>
      </>
   );
}
