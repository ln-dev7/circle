import Triage from '@/components/common/triage/triage';
import Header from '@/components/layout/headers/triage/header';
import MainLayout from '@/components/layout/main-layout';

export default async function TriagePage({ params }: { params: Promise<{ teamId: string }> }) {
   const { teamId } = await params;
   return (
      <MainLayout header={<Header />} headersNumber={1}>
         <Triage teamId={teamId} />
      </MainLayout>
   );
}
