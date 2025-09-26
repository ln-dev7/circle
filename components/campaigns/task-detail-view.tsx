'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
   MoreHorizontal,
   Edit,
   Trash2,
   Plus,
   CheckSquare,
   Clock,
   User,
   Calendar,
   Flag,
   MessageSquare,
   FileText,
   ArrowLeft,
} from 'lucide-react';
import type { CampaignTask } from '@/types/campaign';

interface TaskDetailViewProps {
   task: CampaignTask;
   onUpdate: (taskId: string, data: Partial<CampaignTask>) => void;
   onDelete: (taskId: string) => void;
   onBack: () => void;
   onEdit: () => void;
   onAddSubtask: (parentTaskId: string) => void;
}

const taskStatusConfig = {
   TODO: { label: 'To Do', color: 'bg-gray-500', icon: '⏳' },
   IN_PROGRESS: { label: 'In Progress', color: 'bg-blue-500', icon: '🔄' },
   REVIEW: { label: 'Review', color: 'bg-yellow-500', icon: '👀' },
   DONE: { label: 'Done', color: 'bg-green-500', icon: '✅' },
   CANCELLED: { label: 'Cancelled', color: 'bg-red-500', icon: '❌' },
};

const taskPriorityConfig = {
   NO_PRIORITY: { label: 'No Priority', color: 'bg-gray-400' },
   LOW: { label: 'Low', color: 'bg-green-400' },
   MEDIUM: { label: 'Medium', color: 'bg-yellow-400' },
   HIGH: { label: 'High', color: 'bg-orange-400' },
   URGENT: { label: 'Urgent', color: 'bg-red-500' },
};

export function TaskDetailView({
   task,
   onUpdate,
   onDelete,
   onBack,
   onEdit,
   onAddSubtask,
}: TaskDetailViewProps) {
   const [activeTab, setActiveTab] = useState('overview');

   const formatDate = (date: Date | string | null) => {
      if (!date) return 'Not set';
      return new Date(date).toLocaleDateString('en-US', {
         year: 'numeric',
         month: 'long',
         day: 'numeric',
      });
   };

   const calculateProgress = () => {
      const subtasks = task.subtasks || [];
      if (subtasks.length === 0) return 0;
      const completedSubtasks = subtasks.filter((subtask) => subtask.status === 'DONE').length;
      return Math.round((completedSubtasks / subtasks.length) * 100);
   };

   const getSubtaskStats = () => {
      const subtasks = task.subtasks || [];
      return {
         total: subtasks.length,
         todo: subtasks.filter((subtask) => subtask.status === 'TODO').length,
         inProgress: subtasks.filter((subtask) => subtask.status === 'IN_PROGRESS').length,
         review: subtasks.filter((subtask) => subtask.status === 'REVIEW').length,
         done: subtasks.filter((subtask) => subtask.status === 'DONE').length,
         cancelled: subtasks.filter((subtask) => subtask.status === 'CANCELLED').length,
      };
   };

   const renderStatusBadge = (status: CampaignTask['status']) => {
      const config = taskStatusConfig[status];
      return (
         <Badge className={`${config.color} text-white`}>
            {config.icon} {config.label}
         </Badge>
      );
   };

   const renderPriorityBadge = (priority: CampaignTask['priority']) => {
      if (priority === 'NO_PRIORITY')
         return <span className="text-muted-foreground">No Priority</span>;
      const config = taskPriorityConfig[priority];
      return (
         <Badge variant="outline" className={`${config.color} text-white border-0`}>
            <Flag className="h-3 w-3 mr-1" />
            {config.label}
         </Badge>
      );
   };

   const renderSubtaskItem = (subtask: CampaignTask) => {
      const config = taskStatusConfig[subtask.status];
      return (
         <div key={subtask.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
               <span>{config.icon}</span>
               <div>
                  <h4 className="font-medium">{subtask.title}</h4>
                  {subtask.description && (
                     <p className="text-sm text-muted-foreground">{subtask.description}</p>
                  )}
               </div>
            </div>
            <div className="flex items-center gap-2">
               {subtask.assignee && (
                  <Avatar className="h-6 w-6">
                     <AvatarImage src={subtask.assignee.image || ''} />
                     <AvatarFallback className="text-xs">
                        {subtask.assignee.name?.slice(0, 2).toUpperCase() || 'U'}
                     </AvatarFallback>
                  </Avatar>
               )}
               <Badge variant="outline" className={`${config.color} text-white border-0 text-xs`}>
                  {config.label}
               </Badge>
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                     <DropdownMenuItem onClick={() => onUpdate(subtask.id, { status: 'DONE' })}>
                        Mark as Done
                     </DropdownMenuItem>
                     <DropdownMenuItem
                        onClick={() => onDelete(subtask.id)}
                        className="text-destructive"
                     >
                        Delete Subtask
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
         </div>
      );
   };

   const subtaskStats = getSubtaskStats();
   const progress = calculateProgress();

   return (
      <div className="space-y-6">
         {/* Header */}
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
               <Button variant="ghost" size="sm" onClick={onBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Campaign
               </Button>
               <Separator orientation="vertical" className="h-6" />
               <div>
                  <h1 className="text-2xl font-bold">{task.title}</h1>
                  <div className="flex items-center gap-2 mt-1">
                     {renderStatusBadge(task.status)}
                     <span className="text-muted-foreground">•</span>
                     {renderPriorityBadge(task.priority)}
                     {task.dueDate && (
                        <>
                           <span className="text-muted-foreground">•</span>
                           <span className="text-muted-foreground">
                              Due {formatDate(task.dueDate)}
                           </span>
                        </>
                     )}
                  </div>
               </div>
            </div>
            <div className="flex items-center gap-2">
               <Button variant="outline" onClick={onEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
               </Button>
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                     <DropdownMenuItem onClick={onEdit}>Edit Task</DropdownMenuItem>
                     <DropdownMenuItem
                        onClick={() => onDelete(task.id)}
                        className="text-destructive"
                     >
                        Delete Task
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
         </div>

         {/* Overview Cards */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
               <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                     <CheckSquare className="h-5 w-5 text-blue-500" />
                     <div>
                        <p className="text-sm text-muted-foreground">Progress</p>
                        <p className="text-xl font-bold">{progress}%</p>
                     </div>
                  </div>
                  <Progress value={progress} className="mt-2" />
               </CardContent>
            </Card>

            <Card>
               <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                     <FileText className="h-5 w-5 text-green-500" />
                     <div>
                        <p className="text-sm text-muted-foreground">Subtasks</p>
                        <p className="text-xl font-bold">{subtaskStats.total}</p>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                     <User className="h-5 w-5 text-purple-500" />
                     <div>
                        <p className="text-sm text-muted-foreground">Assignee</p>
                        <p className="text-sm font-medium">
                           {task.assignee ? task.assignee.name : 'Unassigned'}
                        </p>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                     <Calendar className="h-5 w-5 text-orange-500" />
                     <div>
                        <p className="text-sm text-muted-foreground">Due Date</p>
                        <p className="text-sm font-medium">
                           {task.dueDate ? formatDate(task.dueDate) : 'Not set'}
                        </p>
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Tabs */}
         <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
               <TabsTrigger value="overview">Overview</TabsTrigger>
               <TabsTrigger value="subtasks">Subtasks ({subtaskStats.total})</TabsTrigger>
               <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                     <CardHeader>
                        <CardTitle>📋 Task Information</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        {task.description && (
                           <div>
                              <h4 className="font-medium mb-2">Description</h4>
                              <p className="text-muted-foreground">{task.description}</p>
                           </div>
                        )}
                        <div className="space-y-2">
                           <div className="flex justify-between">
                              <span className="text-muted-foreground">Status:</span>
                              {renderStatusBadge(task.status)}
                           </div>
                           <div className="flex justify-between">
                              <span className="text-muted-foreground">Priority:</span>
                              {renderPriorityBadge(task.priority)}
                           </div>
                           <div className="flex justify-between">
                              <span className="text-muted-foreground">Assignee:</span>
                              <span>
                                 {task.assignee ? (
                                    <div className="flex items-center gap-2">
                                       <Avatar className="h-6 w-6">
                                          <AvatarImage src={task.assignee.image || ''} />
                                          <AvatarFallback className="text-xs">
                                             {task.assignee.name?.slice(0, 2).toUpperCase() || 'U'}
                                          </AvatarFallback>
                                       </Avatar>
                                       <span>{task.assignee.name}</span>
                                    </div>
                                 ) : (
                                    'Unassigned'
                                 )}
                              </span>
                           </div>
                           <div className="flex justify-between">
                              <span className="text-muted-foreground">Due Date:</span>
                              <span>{formatDate(task.dueDate)}</span>
                           </div>
                           <div className="flex justify-between">
                              <span className="text-muted-foreground">Created:</span>
                              <span>{formatDate(task.createdAt)}</span>
                           </div>
                           <div className="flex justify-between">
                              <span className="text-muted-foreground">Updated:</span>
                              <span>{formatDate(task.updatedAt)}</span>
                           </div>
                        </div>
                     </CardContent>
                  </Card>

                  <Card>
                     <CardHeader>
                        <CardTitle>📊 Subtask Progress</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <div className="space-y-3">
                           <div className="flex justify-between items-center">
                              <span className="text-sm">To Do</span>
                              <span className="text-sm font-medium">{subtaskStats.todo}</span>
                           </div>
                           <div className="flex justify-between items-center">
                              <span className="text-sm">In Progress</span>
                              <span className="text-sm font-medium">{subtaskStats.inProgress}</span>
                           </div>
                           <div className="flex justify-between items-center">
                              <span className="text-sm">Review</span>
                              <span className="text-sm font-medium">{subtaskStats.review}</span>
                           </div>
                           <div className="flex justify-between items-center">
                              <span className="text-sm">Done</span>
                              <span className="text-sm font-medium">{subtaskStats.done}</span>
                           </div>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center font-medium">
                           <span>Total Progress</span>
                           <span>{progress}%</span>
                        </div>
                        <Progress value={progress} />
                     </CardContent>
                  </Card>
               </div>
            </TabsContent>

            <TabsContent value="subtasks" className="space-y-4">
               <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">📋 Subtasks ({subtaskStats.total})</h3>
                  <Button onClick={() => onAddSubtask(task.id)}>
                     <Plus className="h-4 w-4 mr-2" />
                     Add Subtask
                  </Button>
               </div>
               <div className="space-y-3">
                  {task.subtasks && task.subtasks.length > 0 ? (
                     task.subtasks.map(renderSubtaskItem)
                  ) : (
                     <div className="text-center py-8">
                        <h4 className="font-medium mb-2">No subtasks yet</h4>
                        <p className="text-muted-foreground mb-4">
                           Add subtasks to break down this task into smaller components
                        </p>
                        <Button onClick={() => onAddSubtask(task.id)}>
                           <Plus className="h-4 w-4 mr-2" />
                           Add First Subtask
                        </Button>
                     </div>
                  )}
               </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
               <Card>
                  <CardHeader>
                     <CardTitle>📝 Activity Log</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="text-center py-8 text-muted-foreground">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4" />
                        <p>Activity tracking coming soon</p>
                        <p className="text-sm">Track comments, status changes, and updates</p>
                     </div>
                  </CardContent>
               </Card>
            </TabsContent>
         </Tabs>
      </div>
   );
}
