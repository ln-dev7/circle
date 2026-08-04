import MainLayout from '@/components/layout/main-layout';
import ProjectStatusesSettings from '@/components/common/settings/project-statuses-settings';
import Header from '@/components/layout/headers/settings/header';

export default function Page() {
   return (
      <MainLayout header={<Header />} headersNumber={1}>
         <ProjectStatusesSettings />
      </MainLayout>
   );
}
