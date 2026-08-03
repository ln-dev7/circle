import AgentChat from '@/components/common/agent/agent-chat';
import Header from '@/components/layout/headers/agent/header';
import MainLayout from '@/components/layout/main-layout';

export default function AgentPage() {
   return (
      <MainLayout header={<Header />} headersNumber={1}>
         <AgentChat />
      </MainLayout>
   );
}
