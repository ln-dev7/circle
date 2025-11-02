import { CampaignForm } from '@/components/campaigns/campaign-form';
import { PageHeader } from '@/components/ui/page-header';

export default function CreateCampaignPage() {
   return (
      <div className="flex flex-col space-y-6">
         <PageHeader title="Create Campaign" description="Start a new marketing campaign" />

         <div className="max-w-2xl">
            <CampaignForm />
         </div>
      </div>
   );
}
