import MyIssues from '@/components/common/my-issues/my-issues';
import Header from '@/components/layout/headers/my-issues/header';
import MainLayout from '@/components/layout/main-layout';

export default function MyIssuesPage() {
   return (
      <MainLayout header={<Header />} headersNumber={2}>
         <MyIssues />
      </MainLayout>
   );
}
