import InitiativeDetails from '@/components/common/initiatives/initiative-details';
import Header from '@/components/layout/headers/initiative/header';
import MainLayout from '@/components/layout/main-layout';

export default async function InitiativeDetailsPage({
   params,
}: {
   params: Promise<{ initiativeId: string }>;
}) {
   const { initiativeId } = await params;
   return (
      <MainLayout header={<Header />} headersNumber={2}>
         <InitiativeDetails initiativeId={initiativeId} />
      </MainLayout>
   );
}
