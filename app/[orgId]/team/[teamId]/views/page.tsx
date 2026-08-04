import Views from '@/components/common/views/views';
import Header from '@/components/layout/headers/team-views/header';
import MainLayout from '@/components/layout/main-layout';

export default async function TeamViewsPage({
   params,
}: {
   params: Promise<{ teamId: string }>;
}) {
   const { teamId } = await params;
   return (
      <MainLayout header={<Header />} headersNumber={1}>
         <Views teamId={teamId} />
      </MainLayout>
   );
}
