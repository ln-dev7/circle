'use client';

import ProjectsList from '@/components/common/projects/projects-list';
import { ProjectGroup } from '@/components/common/projects/projects';
import { getProjectsByTeam } from '@/mock-data/projects';
import { useMemo } from 'react';

/** Team "Projects" page: the team's projects grouped by status. */
export default function TeamProjects({ teamId }: { teamId: string }) {
   const groups = useMemo<ProjectGroup[]>(() => {
      const projects = getProjectsByTeam(teamId);
      const byStatus = new Map<string, ProjectGroup>();
      for (const project of projects) {
         const key = project.status.id;
         if (!byStatus.has(key)) {
            byStatus.set(key, { id: key, name: project.status.name, projects: [] });
         }
         byStatus.get(key)!.projects.push(project);
      }
      return [...byStatus.values()];
   }, [teamId]);

   if (groups.length === 0) {
      return (
         <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
            No projects yet
         </div>
      );
   }

   return <ProjectsList groups={groups} />;
}
