import TeamMembers from '@/components/common/teams/team-members';
import Header from '@/components/layout/headers/team/header';
import MainLayout from '@/components/layout/main-layout';

export default function TeamMembersPage() {
   return (
      <MainLayout header={<Header />}>
         <TeamMembers />
      </MainLayout>
   );
}
