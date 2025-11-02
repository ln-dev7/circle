'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CampaignDetail } from './campaign-detail';
import type {
   Campaign,
   UpdateCampaignData,
   AddMemberData,
   CreateTaskData,
   UpdateTaskData,
} from '@/types/campaign';

interface CampaignDetailWrapperProps {
   campaign: Campaign;
}

export function CampaignDetailWrapper({ campaign }: CampaignDetailWrapperProps) {
   const router = useRouter();
   const [loading, setLoading] = useState(false);

   const handleUpdate = async (data: UpdateCampaignData) => {
      setLoading(true);
      try {
         const response = await fetch(`/api/${campaign.organizationId}/campaigns/${campaign.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
         });

         if (!response.ok) {
            throw new Error('Failed to update campaign');
         }

         toast.success('Campaign updated successfully');
         router.refresh();
      } catch (error) {
         console.error('Error updating campaign:', error);
         toast.error('Failed to update campaign');
      } finally {
         setLoading(false);
      }
   };

   const handleDelete = async () => {
      if (
         !confirm('Are you sure you want to delete this campaign? This action cannot be undone.')
      ) {
         return;
      }

      setLoading(true);
      try {
         const response = await fetch(`/api/${campaign.organizationId}/campaigns/${campaign.id}`, {
            method: 'DELETE',
         });

         if (!response.ok) {
            throw new Error('Failed to delete campaign');
         }

         toast.success('Campaign deleted successfully');
         router.push(`/${campaign.organizationId}/campaigns`);
      } catch (error) {
         console.error('Error deleting campaign:', error);
         toast.error('Failed to delete campaign');
      } finally {
         setLoading(false);
      }
   };

   const handleBack = () => {
      router.push(`/${campaign.organizationId}/campaigns`);
   };

   const handleEdit = () => {
      // TODO: Implement edit mode
      toast.info('Edit mode coming soon');
   };

   const handleAddMember = async (data: AddMemberData) => {
      setLoading(true);
      try {
         const response = await fetch(
            `/api/${campaign.organizationId}/campaigns/${campaign.id}/members`,
            {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify(data),
            }
         );

         if (!response.ok) {
            throw new Error('Failed to add member');
         }

         toast.success('Member added successfully');
         router.refresh();
      } catch (error) {
         console.error('Error adding member:', error);
         toast.error('Failed to add member');
      } finally {
         setLoading(false);
      }
   };

   const handleRemoveMember = async (memberId: string) => {
      if (!confirm('Are you sure you want to remove this member?')) {
         return;
      }

      setLoading(true);
      try {
         // TODO: Implement remove member API
         toast.info('Remove member functionality coming soon');
      } catch (error) {
         console.error('Error removing member:', error);
         toast.error('Failed to remove member');
      } finally {
         setLoading(false);
      }
   };

   const handleCreateTask = async (data: CreateTaskData) => {
      setLoading(true);
      try {
         const response = await fetch(
            `/api/${campaign.organizationId}/campaigns/${campaign.id}/tasks`,
            {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify(data),
            }
         );

         if (!response.ok) {
            throw new Error('Failed to create task');
         }

         toast.success('Task created successfully');
         router.refresh();
      } catch (error) {
         console.error('Error creating task:', error);
         toast.error('Failed to create task');
      } finally {
         setLoading(false);
      }
   };

   const handleUpdateTask = async (taskId: string, data: UpdateTaskData) => {
      setLoading(true);
      try {
         // TODO: Implement update task API
         toast.info('Update task functionality coming soon');
      } catch (error) {
         console.error('Error updating task:', error);
         toast.error('Failed to update task');
      } finally {
         setLoading(false);
      }
   };

   const handleDeleteTask = async (taskId: string) => {
      if (!confirm('Are you sure you want to delete this task?')) {
         return;
      }

      setLoading(true);
      try {
         // TODO: Implement delete task API
         toast.info('Delete task functionality coming soon');
      } catch (error) {
         console.error('Error deleting task:', error);
         toast.error('Failed to delete task');
      } finally {
         setLoading(false);
      }
   };

   return (
      <CampaignDetail
         campaign={campaign}
         onUpdate={handleUpdate}
         onDelete={handleDelete}
         onBack={handleBack}
         onEdit={handleEdit}
         onAddMember={handleAddMember}
         onRemoveMember={handleRemoveMember}
         onCreateTask={handleCreateTask}
         onUpdateTask={handleUpdateTask}
         onDeleteTask={handleDeleteTask}
         loading={loading}
      />
   );
}
