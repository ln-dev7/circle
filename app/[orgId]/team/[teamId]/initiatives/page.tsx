import Initiatives from '@/components/common/initiatives/initiatives';
import Header from '@/components/layout/headers/team-initiatives/header';
import MainLayout from '@/components/layout/main-layout';

export default async function TeamInitiativesPage({
   params,
}: {
   params: Promise<{ teamId: string }>;
}) {
   const { teamId } = await params;
   return (
      <MainLayout header={<Header />} headersNumber={1}>
         <Initiatives teamId={teamId} />
      </MainLayout>
   );
}
