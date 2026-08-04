import MainLayout from '@/components/layout/main-layout';
import TeamSettings from '@/components/common/settings/team-settings';
import Header from '@/components/layout/headers/settings/header';

export default async function Page({ params }: { params: Promise<{ teamId: string }> }) {
   const { teamId } = await params;
   return (
      <MainLayout header={<Header />} headersNumber={1}>
         <TeamSettings teamId={teamId} />
      </MainLayout>
   );
}
