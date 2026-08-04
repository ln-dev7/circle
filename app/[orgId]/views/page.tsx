import Views from '@/components/common/views/views';
import Header from '@/components/layout/headers/views/header';
import MainLayout from '@/components/layout/main-layout';

export default function ViewsPage() {
   return (
      <MainLayout header={<Header />} headersNumber={1}>
         <Views />
      </MainLayout>
   );
}
