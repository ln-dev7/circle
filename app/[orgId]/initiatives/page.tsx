import Initiatives from '@/components/common/initiatives/initiatives';
import Header from '@/components/layout/headers/initiatives/header';
import MainLayout from '@/components/layout/main-layout';

export default function InitiativesPage() {
   return (
      <MainLayout header={<Header />} headersNumber={1}>
         <Initiatives />
      </MainLayout>
   );
}
