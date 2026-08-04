import MainLayout from '@/components/layout/main-layout';
import Preferences from '@/components/common/settings/preferences';
import Header from '@/components/layout/headers/settings/header';

export default function Page() {
   return (
      <MainLayout header={<Header />} headersNumber={1}>
         <Preferences />
      </MainLayout>
   );
}
