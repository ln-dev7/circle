import MainLayout from '@/components/layout/main-layout';
import Header from '@/components/layout/headers/projects/header';
import Projects from '@/components/common/projects/projects';

export default function ProjectsPage() {
   return (
      <MainLayout header={<Header />} headersNumber={1}>
         <Projects />
      </MainLayout>
   );
}
