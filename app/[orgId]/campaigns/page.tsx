import MainLayout from '@/components/layout/main-layout';
import Header from '@/components/layout/headers/campaigns/header';
import Campaigns from '@/components/common/campaigns/campaigns';

export default function CampaignsPage() {
   return (
      <MainLayout header={<Header />}>
         <Campaigns />
      </MainLayout>
   );
}
