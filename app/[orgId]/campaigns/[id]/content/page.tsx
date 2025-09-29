import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getCampaign } from '@/lib/campaigns';
import { CampaignContentPage } from '@/components/campaigns/content/campaign-content-page';

interface CampaignContentPageProps {
   params: {
      orgId: string;
      id: string;
   };
}

export default async function CampaignContentPage({ params }: CampaignContentPageProps) {
   const campaign = await getCampaign(params.orgId, params.id);

   if (!campaign) {
      notFound();
   }

   return (
      <div className="flex flex-col space-y-6">
         <Suspense fallback={<div>Loading content management...</div>}>
            <CampaignContentPage orgId={params.orgId} campaignId={params.id} campaign={campaign} />
         </Suspense>
      </div>
   );
}
