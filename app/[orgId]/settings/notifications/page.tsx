import MainLayout from '@/components/layout/main-layout';
import AccountNotifications from '@/components/common/settings/account-notifications';
import Header from '@/components/layout/headers/settings/header';

export default function Page() {
   return (
      <MainLayout header={<Header />} headersNumber={1}>
         <AccountNotifications />
      </MainLayout>
   );
}
