'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { TaskManagementContainer } from './task-management-container';
import type {
   Campaign,
   CampaignTask,
   CampaignMember,
   CreateTaskData,
   UpdateTaskData,
} from '@/types/campaign';

interface TaskManagementPageProps {
   orgId: string;
   campaignId: string;
   campaign: Campaign;
}

export function TaskManagementPage({ orgId, campaignId, campaign }: TaskManagementPageProps) {
   const router = useRouter();
   const [tasks, setTasks] = useState<CampaignTask[]>([]);
   const [campaignMembers, setCampaignMembers] = useState<CampaignMember[]>([]);
   const [loading, setLoading] = useState(true);

   // Fetch tasks and members on component mount
   useEffect(() => {
      fetchTasks();
      fetchCampaignMembers();
   }, [orgId, campaignId]);

   const fetchTasks = async () => {
      try {
         const response = await fetch(`/api/${orgId}/campaigns/${campaignId}/tasks`);
         if (!response.ok) {
            throw new Error('Failed to fetch tasks');
         }
         const data = await response.json();
         setTasks(data.tasks || []);
      } catch (error) {
         console.error('Error fetching tasks:', error);
         toast.error('Failed to fetch tasks');
      } finally {
         setLoading(false);
      }
   };

   const fetchCampaignMembers = async () => {
      try {
         const response = await fetch(`/api/${orgId}/campaigns/${campaignId}/members`);
         if (!response.ok) {
            throw new Error('Failed to fetch campaign members');
         }
         const data = await response.json();
         setCampaignMembers(data.members || []);
      } catch (error) {
         console.error('Error fetching campaign members:', error);
         toast.error('Failed to fetch campaign members');
      }
   };

   const handleTaskCreate = async (taskData: CreateTaskData) => {
      try {
         const response = await fetch(`/api/${orgId}/campaigns/${campaignId}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData),
         });

         if (!response.ok) {
            throw new Error('Failed to create task');
         }

         const newTask = await response.json();
         setTasks((prev) => [...prev, newTask.task]);
         toast.success('Task created successfully');
      } catch (error) {
         console.error('Error creating task:', error);
         toast.error('Failed to create task');
         throw error;
      }
   };

   const handleTaskUpdate = async (taskId: string, data: UpdateTaskData) => {
      try {
         const response = await fetch(`/api/${orgId}/campaigns/${campaignId}/tasks/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
         });

         if (!response.ok) {
            throw new Error('Failed to update task');
         }

         const updatedTask = await response.json();
         setTasks((prev) =>
            prev.map((task) => (task.id === taskId ? { ...task, ...updatedTask.task } : task))
         );
         toast.success('Task updated successfully');
      } catch (error) {
         console.error('Error updating task:', error);
         toast.error('Failed to update task');
         throw error;
      }
   };

   const handleTaskDelete = async (taskId: string) => {
      try {
         const response = await fetch(`/api/${orgId}/campaigns/${campaignId}/tasks/${taskId}`, {
            method: 'DELETE',
         });

         if (!response.ok) {
            throw new Error('Failed to delete task');
         }

         setTasks((prev) => prev.filter((task) => task.id !== taskId));
         toast.success('Task deleted successfully');
      } catch (error) {
         console.error('Error deleting task:', error);
         toast.error('Failed to delete task');
         throw error;
      }
   };

   const handleBulkAction = async (action: string, taskIds: string[]) => {
      try {
         let successMessage = '';

         switch (action) {
            case 'status':
               // Update status for all selected tasks
               await Promise.all(
                  taskIds.map((taskId) => handleTaskUpdate(taskId, { status: 'IN_PROGRESS' }))
               );
               successMessage = 'Tasks status updated successfully';
               break;

            case 'assign':
               // In a real app, you'd show a modal to select assignee
               toast.info('Bulk assign functionality coming soon');
               return;

            case 'delete':
               // Delete all selected tasks
               await Promise.all(taskIds.map((taskId) => handleTaskDelete(taskId)));
               successMessage = 'Tasks deleted successfully';
               break;

            default:
               toast.error('Unknown bulk action');
               return;
         }

         toast.success(successMessage);
      } catch (error) {
         console.error('Error performing bulk action:', error);
         toast.error('Failed to perform bulk action');
      }
   };

   if (loading) {
      return (
         <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
               <p className="text-muted-foreground">Loading task management...</p>
            </div>
         </div>
      );
   }

   return (
      <div className="space-y-6">
         {/* Page Header */}
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-3xl font-bold">Task Management</h1>
               <p className="text-muted-foreground">
                  Manage tasks for campaign: <span className="font-medium">{campaign.title}</span>
               </p>
            </div>
            <div className="flex items-center gap-2">
               <button
                  onClick={() => router.push(`/${orgId}/campaigns/${campaignId}`)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
               >
                  Back to Campaign
               </button>
            </div>
         </div>

         {/* Task Management Container */}
         <TaskManagementContainer
            tasks={tasks}
            campaignMembers={campaignMembers}
            onTaskCreate={handleTaskCreate}
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={handleTaskDelete}
            onBulkAction={handleBulkAction}
         />
      </div>
   );
}
