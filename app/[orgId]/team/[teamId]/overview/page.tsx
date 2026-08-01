import TeamOverview from '@/components/common/teams/team-overview';
import Header from '@/components/layout/headers/team/header';
import MainLayout from '@/components/layout/main-layout';

export default function TeamOverviewPage() {
   return (
      <MainLayout header={<Header />}>
         <TeamOverview />
      </MainLayout>
   );
}
