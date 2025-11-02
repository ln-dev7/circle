'use client';

import { useState, useEffect } from 'react';
import { Campaign, UpdateCampaignData, User } from '@/types/campaign';
import CampaignForm from './campaign-form';

interface CampaignEditFormProps {
   campaign: Campaign;
   onSubmit: (data: UpdateCampaignData) => void;
   onCancel: () => void;
   teams: User[];
   members: User[];
   loading?: boolean;
}

export default function CampaignEditForm({
   campaign,
   onSubmit,
   onCancel,
   teams,
   members,
   loading = false,
}: CampaignEditFormProps) {
   const [initialData, setInitialData] = useState<UpdateCampaignData>({});

   useEffect(() => {
      // Convert campaign data to form data
      setInitialData({
         name: campaign.name,
         summary: campaign.summary || undefined,
         description: campaign.description || undefined,
         status: campaign.status,
         health: campaign.health,
         priority: campaign.priority,
         leadId: campaign.leadId || undefined,
         startDate: campaign.startDate
            ? new Date(campaign.startDate).toISOString().split('T')[0]
            : undefined,
         targetDate: campaign.targetDate
            ? new Date(campaign.targetDate).toISOString().split('T')[0]
            : undefined,
      });
   }, [campaign]);

   const handleSubmit = (data: UpdateCampaignData) => {
      // Merge with existing data to preserve unchanged fields
      const updatedData = { ...initialData, ...data };
      onSubmit(updatedData);
   };

   return (
      <div className="space-y-6">
         <div>
            <h2 className="text-lg font-semibold">Edit Campaign</h2>
            <p className="text-sm text-muted-foreground">Update campaign details and settings</p>
         </div>

         <CampaignForm
            campaign={campaign}
            onSubmit={handleSubmit}
            onCancel={onCancel}
            teams={teams}
            members={members}
            loading={loading}
            mode="edit"
         />
      </div>
   );
}
