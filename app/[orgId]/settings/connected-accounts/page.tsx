import MainLayout from '@/components/layout/main-layout';
import AccountConnections from '@/components/common/settings/account-connections';
import Header from '@/components/layout/headers/settings/header';

export default function Page() {
   return (
      <MainLayout header={<Header />} headersNumber={1}>
         <AccountConnections />
      </MainLayout>
   );
}
