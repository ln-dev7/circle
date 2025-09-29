'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, MoreHorizontal, User, Calendar, Flag } from 'lucide-react';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { CampaignTask } from '@/types/campaign';

interface TaskBoardProps {
   tasks: CampaignTask[];
   onTaskUpdate: (taskId: string, data: Partial<CampaignTask>) => void;
   onTaskCreate: () => void;
   onTaskClick: (task: CampaignTask) => void;
}

const taskStatusConfig = {
   TODO: { label: 'To Do', color: 'bg-gray-500', bgLight: 'bg-gray-50', border: 'border-gray-200' },
   IN_PROGRESS: {
      label: 'In Progress',
      color: 'bg-blue-500',
      bgLight: 'bg-blue-50',
      border: 'border-blue-200',
   },
   REVIEW: {
      label: 'Review',
      color: 'bg-yellow-500',
      bgLight: 'bg-yellow-50',
      border: 'border-yellow-200',
   },
   DONE: {
      label: 'Done',
      color: 'bg-green-500',
      bgLight: 'bg-green-50',
      border: 'border-green-200',
   },
   CANCELLED: {
      label: 'Cancelled',
      color: 'bg-red-500',
      bgLight: 'bg-red-50',
      border: 'border-red-200',
   },
};

const taskPriorityConfig = {
   NO_PRIORITY: { label: 'No Priority', color: 'bg-gray-400' },
   LOW: { label: 'Low', color: 'bg-green-400' },
   MEDIUM: { label: 'Medium', color: 'bg-yellow-400' },
   HIGH: { label: 'High', color: 'bg-orange-400' },
   URGENT: { label: 'Urgent', color: 'bg-red-500' },
};

export function TaskBoard({ tasks, onTaskUpdate, onTaskCreate, onTaskClick }: TaskBoardProps) {
   const [draggedTask, setDraggedTask] = useState<string | null>(null);

   const groupedTasks = useMemo(() => {
      const groups: Record<string, CampaignTask[]> = {
         TODO: [],
         IN_PROGRESS: [],
         REVIEW: [],
         DONE: [],
         CANCELLED: [],
      };

      tasks.forEach((task) => {
         if (groups[task.status]) {
            groups[task.status].push(task);
         }
      });

      return groups;
   }, [tasks]);

   const handleDragStart = (e: React.DragEvent, taskId: string) => {
      setDraggedTask(taskId);
      e.dataTransfer.effectAllowed = 'move';
   };

   const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
   };

   const handleDrop = (e: React.DragEvent, targetStatus: string) => {
      e.preventDefault();
      if (draggedTask) {
         onTaskUpdate(draggedTask, { status: targetStatus as CampaignTask['status'] });
         setDraggedTask(null);
      }
   };

   const renderTaskCard = (task: CampaignTask) => {
      const priorityConfig = taskPriorityConfig[task.priority];

      return (
         <Card
            key={task.id}
            className={`cursor-pointer hover:shadow-md transition-shadow ${
               draggedTask === task.id ? 'opacity-50' : ''
            }`}
            draggable
            onDragStart={(e) => handleDragStart(e, task.id)}
            onClick={() => onTaskClick(task)}
         >
            <CardContent className="p-3">
               <div className="space-y-2">
                  <div className="flex items-start justify-between">
                     <h4 className="font-medium text-sm line-clamp-2">{task.title}</h4>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <MoreHorizontal className="h-3 w-3" />
                           </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                           <DropdownMenuItem onClick={() => onTaskClick(task)}>
                              View Details
                           </DropdownMenuItem>
                           <DropdownMenuItem
                              onClick={() => onTaskUpdate(task.id, { status: 'DONE' })}
                           >
                              Mark as Done
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                  </div>

                  {task.description && (
                     <p className="text-xs text-muted-foreground line-clamp-2">
                        {task.description}
                     </p>
                  )}

                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        {task.assignee && (
                           <Avatar className="h-6 w-6">
                              <AvatarImage src={task.assignee.image || ''} />
                              <AvatarFallback className="text-xs">
                                 {task.assignee.name?.slice(0, 2).toUpperCase() || 'U'}
                              </AvatarFallback>
                           </Avatar>
                        )}
                        {task.priority !== 'NO_PRIORITY' && (
                           <Badge
                              variant="outline"
                              className={`${priorityConfig.color} text-white border-0 text-xs`}
                           >
                              <Flag className="h-2 w-2 mr-1" />
                              {priorityConfig.label}
                           </Badge>
                        )}
                     </div>

                     {task.dueDate && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                           <Calendar className="h-3 w-3" />
                           {new Date(task.dueDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                           })}
                        </div>
                     )}
                  </div>

                  {task.subtasks && task.subtasks.length > 0 && (
                     <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="w-2 h-2 bg-blue-400 rounded-full" />
                        {task.subtasks.length} subtask{task.subtasks.length !== 1 ? 's' : ''}
                     </div>
                  )}
               </div>
            </CardContent>
         </Card>
      );
   };

   const renderStatusColumn = (status: string, tasks: CampaignTask[]) => {
      const config = taskStatusConfig[status as keyof typeof taskStatusConfig];

      return (
         <div
            key={status}
            className={`flex-1 min-w-64 ${config.bgLight} ${config.border} rounded-lg p-4`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status)}
         >
            <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 ${config.color} rounded-full`} />
                  <h3 className="font-semibold text-sm">{config.label}</h3>
                  <Badge variant="secondary" className="text-xs">
                     {tasks.length}
                  </Badge>
               </div>
               {status === 'TODO' && (
                  <Button size="sm" variant="ghost" onClick={onTaskCreate}>
                     <Plus className="h-4 w-4" />
                  </Button>
               )}
            </div>

            <div className="space-y-3">
               {tasks.map(renderTaskCard)}
               {tasks.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                     <p className="text-sm">No tasks</p>
                  </div>
               )}
            </div>
         </div>
      );
   };

   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <div>
               <h2 className="text-2xl font-bold">Task Board</h2>
               <p className="text-muted-foreground">Manage and track campaign tasks</p>
            </div>
            <Button onClick={onTaskCreate}>
               <Plus className="h-4 w-4 mr-2" />
               New Task
            </Button>
         </div>

         <div className="flex gap-4 overflow-x-auto pb-4">
            {Object.entries(groupedTasks).map(([status, statusTasks]) =>
               renderStatusColumn(status, statusTasks)
            )}
         </div>
      </div>
   );
}
