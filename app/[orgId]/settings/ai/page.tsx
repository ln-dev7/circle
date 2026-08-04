import MainLayout from '@/components/layout/main-layout';
import AiAgents from '@/components/common/settings/ai-agents';
import Header from '@/components/layout/headers/settings/header';

export default function Page() {
   return (
      <MainLayout header={<Header />} headersNumber={1}>
         <AiAgents />
      </MainLayout>
   );
}
