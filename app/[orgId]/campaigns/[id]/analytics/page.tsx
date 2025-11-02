import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getCampaign } from '@/lib/campaigns';
import { CampaignAnalyticsPage } from '@/components/campaigns/analytics/campaign-analytics-page';

interface CampaignAnalyticsPageProps {
   params: {
      orgId: string;
      id: string;
   };
}

export default async function CampaignAnalyticsPage({ params }: CampaignAnalyticsPageProps) {
   const campaign = await getCampaign(params.orgId, params.id);

   if (!campaign) {
      notFound();
   }

   return (
      <div className="flex flex-col space-y-6">
         <Suspense fallback={<div>Loading analytics...</div>}>
            <CampaignAnalyticsPage
               orgId={params.orgId}
               campaignId={params.id}
               campaign={campaign}
            />
         </Suspense>
      </div>
   );
}
