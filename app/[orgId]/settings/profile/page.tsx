import MainLayout from '@/components/layout/main-layout';
import Profile from '@/components/common/settings/profile';
import Header from '@/components/layout/headers/settings/header';

export default function Page() {
   return (
      <MainLayout header={<Header />} headersNumber={1}>
         <Profile />
      </MainLayout>
   );
}
