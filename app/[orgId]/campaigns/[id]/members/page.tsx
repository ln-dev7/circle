import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getCampaign } from '@/lib/campaigns';
import { CampaignMembersPage } from '@/components/campaigns/members/campaign-members-page';

interface CampaignMembersPageProps {
   params: {
      orgId: string;
      id: string;
   };
}

export default async function CampaignMembersPage({ params }: CampaignMembersPageProps) {
   const campaign = await getCampaign(params.orgId, params.id);

   if (!campaign) {
      notFound();
   }

   return (
      <div className="flex flex-col space-y-6">
         <Suspense fallback={<div>Loading member management...</div>}>
            <CampaignMembersPage orgId={params.orgId} campaignId={params.id} campaign={campaign} />
         </Suspense>
      </div>
   );
}
