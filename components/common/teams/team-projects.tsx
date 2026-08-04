'use client';

import Projects from '@/components/common/projects/projects';

/**
 * Team "Projects" page: the exact same projects experience as /projects
 * (tabs, filters, display options, list/board/timeline, insights) scoped
 * to the team.
 */
export default function TeamProjects({ teamId }: { teamId: string }) {
   return <Projects teamId={teamId} />;
}
