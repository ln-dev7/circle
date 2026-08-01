import IssueDetails from '@/components/common/issues/details/issue-details';
import Header from '@/components/layout/headers/issue/header';
import MainLayout from '@/components/layout/main-layout';

export default function IssueDetailPage() {
   return (
      <MainLayout header={<Header />} headersNumber={1}>
         <IssueDetails />
      </MainLayout>
   );
}
