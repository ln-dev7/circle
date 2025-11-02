import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getCampaign } from '@/lib/campaigns';
import { TaskManagementPage } from '@/components/campaigns/task-management/task-management-page';

interface CampaignTasksPageProps {
   params: {
      orgId: string;
      id: string;
   };
}

export default async function CampaignTasksPage({ params }: CampaignTasksPageProps) {
   const campaign = await getCampaign(params.orgId, params.id);

   if (!campaign) {
      notFound();
   }

   return (
      <div className="flex flex-col space-y-6">
         <Suspense fallback={<div>Loading task management...</div>}>
            <TaskManagementPage orgId={params.orgId} campaignId={params.id} campaign={campaign} />
         </Suspense>
      </div>
   );
}
