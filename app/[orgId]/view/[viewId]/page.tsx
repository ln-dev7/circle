import ViewDetails from '@/components/common/views/view-details';
import Header from '@/components/layout/headers/view/header';
import MainLayout from '@/components/layout/main-layout';

export default async function ViewDetailsPage({
   params,
}: {
   params: Promise<{ viewId: string }>;
}) {
   const { viewId } = await params;
   return (
      <MainLayout header={<Header />} headersNumber={2}>
         <ViewDetails viewId={viewId} />
      </MainLayout>
   );
}
