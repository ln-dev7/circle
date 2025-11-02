'use client';

import { useState } from 'react';
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CampaignForm from './campaign-form';
import { CreateCampaignData, User } from '@/types/campaign';

interface CampaignCreationModalProps {
   isOpen: boolean;
   onClose: () => void;
   onSubmit: (data: CreateCampaignData) => void;
   teams: User[];
   members: User[];
   loading?: boolean;
}

export default function CampaignCreationModal({
   isOpen,
   onClose,
   onSubmit,
   teams,
   members,
   loading = false,
}: CampaignCreationModalProps) {
   const handleSubmit = (data: CreateCampaignData) => {
      onSubmit(data);
      onClose();
   };

   return (
      <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
               <DialogTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Create New Campaign
               </DialogTitle>
            </DialogHeader>

            <CampaignForm
               onSubmit={handleSubmit}
               onCancel={onClose}
               teams={teams}
               members={members}
               loading={loading}
            />
         </DialogContent>
      </Dialog>
   );
}
