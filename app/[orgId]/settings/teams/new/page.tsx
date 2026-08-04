import MainLayout from '@/components/layout/main-layout';
import Header from '@/components/layout/headers/settings/header';
import NewTeam from '@/components/common/settings/new-team';

export default function Page() {
   return (
      <MainLayout header={<Header />} headersNumber={1}>
         <NewTeam />
      </MainLayout>
   );
}
