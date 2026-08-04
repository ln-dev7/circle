import MainLayout from '@/components/layout/main-layout';
import AccountSecurity from '@/components/common/settings/account-security';
import Header from '@/components/layout/headers/settings/header';

export default function Page() {
   return (
      <MainLayout header={<Header />} headersNumber={1}>
         <AccountSecurity />
      </MainLayout>
   );
}
