import TeamDocuments from '@/components/common/teams/team-documents';
import Header from '@/components/layout/headers/team/header';
import MainLayout from '@/components/layout/main-layout';

export default function TeamDocumentsPage() {
   return (
      <MainLayout header={<Header />}>
         <TeamDocuments />
      </MainLayout>
   );
}
