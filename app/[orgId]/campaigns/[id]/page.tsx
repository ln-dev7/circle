import { Suspense } from 'react';
import { CampaignDetail } from '@/components/campaigns/campaign-detail';
import { notFound } from 'next/navigation';
import { getCampaign } from '@/lib/campaigns';
import { CampaignDetailWrapper } from '@/components/campaigns/campaign-detail-wrapper';

interface CampaignPageProps {
   params: {
      orgId: string;
      id: string;
   };
}

export default async function CampaignPage({ params }: CampaignPageProps) {
   const campaign = await getCampaign(params.orgId, params.id);

   if (!campaign) {
      notFound();
   }

   return (
      <div className="flex flex-col space-y-6">
         <Suspense fallback={<div>Loading campaign...</div>}>
            <CampaignDetailWrapper campaign={campaign} />
         </Suspense>
      </div>
   );
}
