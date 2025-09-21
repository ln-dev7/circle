'use client';

import { projects as allProjects } from '@/mock-data/projects';
import ProjectLine from '@/components/common/projects/project-line';
import { useProjectsFilterStore } from '@/store/projects-filter-store';
import { useMemo } from 'react';
import { status as statusList } from '@/mock-data/status';

export default function Projects() {
   const { filters, sort } = useProjectsFilterStore();

   const statusIndex = useMemo(() => {
      const m = new Map<string, number>();
      statusList.forEach((s, idx) => m.set(s.id, idx));
      return m;
   }, []);

   const displayed = useMemo(() => {
      let list = allProjects.slice();

      // filters
      if (filters.health.length > 0) {
         const hs = new Set(filters.health);
         list = list.filter((p) => hs.has(p.health.id));
      }
      if (filters.priority.length > 0) {
         const ps = new Set(filters.priority);
         list = list.filter((p) => ps.has(p.priority.id));
      }

      // sorting
      const compare = (a: (typeof list)[number], b: (typeof list)[number]) => {
         switch (sort) {
            case 'title-asc':
               return a.name.localeCompare(b.name);
            case 'title-desc':
               return b.name.localeCompare(a.name);
            case 'date-asc':
               return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
            case 'date-desc':
               return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
            case 'status-asc': {
               const ai = statusIndex.get(a.status.id) ?? 0;
               const bi = statusIndex.get(b.status.id) ?? 0;
               return ai - bi;
            }
            case 'status-desc': {
               const ai = statusIndex.get(a.status.id) ?? 0;
               const bi = statusIndex.get(b.status.id) ?? 0;
               return bi - ai;
            }
            default:
               return 0;
         }
      };
      return list.sort(compare);
   }, [filters, sort, statusIndex]);

   return (
      <div className="w-full">
         <div className="bg-container px-6 py-1.5 text-sm flex items-center text-muted-foreground border-b sticky top-0 z-10">
            <div className="w-[60%] sm:w-[70%] xl:w-[46%]">Title</div>
            <div className="w-[20%] sm:w-[10%] xl:w-[13%] pl-2.5">Health</div>
            <div className="hidden w-[10%] sm:block pl-2">Priority</div>
            <div className="hidden xl:block xl:w-[13%] pl-2">Lead</div>
            <div className="hidden xl:block xl:w-[13%] pl-2.5">Target date</div>
            <div className="w-[20%] sm:w-[10%] pl-2">Status</div>
         </div>

         <div className="w-full">
            {displayed.map((project) => (
               <ProjectLine key={project.id} project={project} />
            ))}
         </div>
      </div>
   );
}
