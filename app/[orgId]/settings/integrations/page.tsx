import Integrations from '@/components/common/settings/integrations';
import Header from '@/components/layout/headers/settings/header';
import MainLayout from '@/components/layout/main-layout';

export default function IntegrationsSettingsPage() {
   return (
      <MainLayout header={<Header />} headersNumber={1}>
         <Integrations />
      </MainLayout>
   );
}
