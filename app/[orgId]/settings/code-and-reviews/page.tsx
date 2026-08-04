import MainLayout from '@/components/layout/main-layout';
import AccountCodeReviews from '@/components/common/settings/account-code-reviews';
import Header from '@/components/layout/headers/settings/header';

export default function Page() {
   return (
      <MainLayout header={<Header />} headersNumber={1}>
         <AccountCodeReviews />
      </MainLayout>
   );
}
