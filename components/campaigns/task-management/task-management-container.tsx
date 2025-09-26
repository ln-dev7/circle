'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/dialog';
import { Kanban, List, BarChart3, Plus } from 'lucide-react';
import { TaskBoard } from './task-board';
import { TaskList } from './task-list';
import { TaskAnalytics } from './task-analytics';
import { TaskCreationModal } from './task-creation-modal';
import type { CampaignTask, CampaignMember } from '@/types/campaign';

interface TaskManagementContainerProps {
   tasks: CampaignTask[];
   campaignMembers: CampaignMember[];
   onTaskCreate: (taskData: Partial<CampaignTask>) => Promise<void>;
   onTaskUpdate: (taskId: string, data: Partial<CampaignTask>) => Promise<void>;
   onTaskDelete: (taskId: string) => Promise<void>;
   onBulkAction: (action: string, taskIds: string[]) => Promise<void>;
}

type ViewMode = 'board' | 'list' | 'analytics';

export function TaskManagementContainer({
   tasks,
   campaignMembers,
   onTaskCreate,
   onTaskUpdate,
   onTaskDelete,
   onBulkAction,
}: TaskManagementContainerProps) {
   const [viewMode, setViewMode] = useState<ViewMode>('board');
   const [showCreateModal, setShowCreateModal] = useState(false);
   const [selectedTask, setSelectedTask] = useState<CampaignTask | null>(null);
   const [loading, setLoading] = useState(false);

   const topLevelTasks = useMemo(() => {
      return tasks.filter((task) => !task.parentTaskId);
   }, [tasks]);

   const handleTaskCreate = async (taskData: Partial<CampaignTask>) => {
      try {
         setLoading(true);
         await onTaskCreate(taskData);
         setShowCreateModal(false);
      } catch (error) {
         console.error('Failed to create task:', error);
         // In a real app, you'd show an error toast here
      } finally {
         setLoading(false);
      }
   };

   const handleTaskUpdate = async (taskId: string, data: Partial<CampaignTask>) => {
      try {
         setLoading(true);
         await onTaskUpdate(taskId, data);
      } catch (error) {
         console.error('Failed to update task:', error);
         // In a real app, you'd show an error toast here
      } finally {
         setLoading(false);
      }
   };

   const handleTaskDelete = async (taskId: string) => {
      try {
         setLoading(true);
         await onTaskDelete(taskId);
      } catch (error) {
         console.error('Failed to delete task:', error);
         // In a real app, you'd show an error toast here
      } finally {
         setLoading(false);
      }
   };

   const handleBulkAction = async (action: string, taskIds: string[]) => {
      try {
         setLoading(true);
         await onBulkAction(action, taskIds);
      } catch (error) {
         console.error('Failed to perform bulk action:', error);
         // In a real app, you'd show an error toast here
      } finally {
         setLoading(false);
      }
   };

   const handleTaskClick = (task: CampaignTask) => {
      setSelectedTask(task);
      // In a real app, you'd navigate to the task detail view or open a modal
      console.log('Task clicked:', task);
   };

   const handleCreateSubtask = (parentTask: CampaignTask) => {
      setSelectedTask(parentTask);
      setShowCreateModal(true);
   };

   const renderViewModeButton = (mode: ViewMode, icon: React.ReactNode, label: string) => (
      <Button
         variant={viewMode === mode ? 'default' : 'outline'}
         size="sm"
         onClick={() => setViewMode(mode)}
         className="flex items-center gap-2"
      >
         {icon}
         {label}
      </Button>
   );

   return (
      <div className="space-y-6">
         {/* Header */}
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-3xl font-bold">Task Management</h1>
               <p className="text-muted-foreground">
                  Manage and track all campaign tasks and subtasks
               </p>
            </div>
            <div className="flex items-center gap-2">
               <Button onClick={() => setShowCreateModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Task
               </Button>
            </div>
         </div>

         {/* View Mode Toggle */}
         <div className="flex items-center gap-2 p-2 bg-muted rounded-lg w-fit">
            {renderViewModeButton('board', <Kanban className="h-4 w-4" />, 'Board')}
            {renderViewModeButton('list', <List className="h-4 w-4" />, 'List')}
            {renderViewModeButton('analytics', <BarChart3 className="h-4 w-4" />, 'Analytics')}
         </div>

         {/* Task Statistics */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                     Total Tasks
                  </span>
               </div>
               <p className="text-2xl font-bold text-blue-700 dark:text-blue-300 mt-1">
                  {tasks.length}
               </p>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">
                     Completed
                  </span>
               </div>
               <p className="text-2xl font-bold text-green-700 dark:text-green-300 mt-1">
                  {tasks.filter((task) => task.status === 'DONE').length}
               </p>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                     In Progress
                  </span>
               </div>
               <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300 mt-1">
                  {tasks.filter((task) => task.status === 'IN_PROGRESS').length}
               </p>
            </div>

            <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <span className="text-sm font-medium text-red-700 dark:text-red-300">
                     Overdue
                  </span>
               </div>
               <p className="text-2xl font-bold text-red-700 dark:text-red-300 mt-1">
                  {
                     tasks.filter((task) => {
                        if (!task.dueDate) return false;
                        return new Date(task.dueDate) < new Date();
                     }).length
                  }
               </p>
            </div>
         </div>

         {/* View Content */}
         {viewMode === 'board' && (
            <TaskBoard
               tasks={topLevelTasks}
               onTaskUpdate={handleTaskUpdate}
               onTaskCreate={() => setShowCreateModal(true)}
               onTaskClick={handleTaskClick}
            />
         )}

         {viewMode === 'list' && (
            <TaskList
               tasks={topLevelTasks}
               onTaskUpdate={handleTaskUpdate}
               onTaskDelete={handleTaskDelete}
               onTaskCreate={() => setShowCreateModal(true)}
               onTaskClick={handleTaskClick}
               onBulkAction={handleBulkAction}
            />
         )}

         {viewMode === 'analytics' && <TaskAnalytics tasks={tasks} />}

         {/* Task Creation Modal */}
         <TaskCreationModal
            open={showCreateModal}
            onOpenChange={setShowCreateModal}
            onSubmit={handleTaskCreate}
            campaignMembers={campaignMembers}
            parentTask={selectedTask}
            loading={loading}
         />
      </div>
   );
}
