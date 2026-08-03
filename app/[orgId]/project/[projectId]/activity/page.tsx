import ProjectActivity from '@/components/common/projects/details/project-activity';
import Header from '@/components/layout/headers/project/header';
import MainLayout from '@/components/layout/main-layout';
import { getProjectById } from '@/mock-data/projects';
import { notFound } from 'next/navigation';

interface ProjectPageProps {
   params: Promise<{ projectId: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
   const { projectId } = await params;
   const project = getProjectById(projectId);

   if (!project) {
      notFound();
   }

   return (
      <MainLayout header={<Header projectId={projectId} />}>
         <ProjectActivity projectId={projectId} />
      </MainLayout>
   );
}
