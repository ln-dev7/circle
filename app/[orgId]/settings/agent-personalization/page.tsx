import MainLayout from '@/components/layout/main-layout';
import AgentPersonalization from '@/components/common/settings/agent-personalization';
import Header from '@/components/layout/headers/settings/header';

export default function Page() {
   return (
      <MainLayout header={<Header />} headersNumber={1}>
         <AgentPersonalization />
      </MainLayout>
   );
}
