import Teams from '@/components/common/teams/teams';
import Header from '@/components/layout/headers/teams/header';
import MainLayout from '@/components/layout/main-layout';

export default function TeamsPage() {
   return (
      <MainLayout header={<Header />} headersNumber={1}>
         <Teams />
      </MainLayout>
   );
}
