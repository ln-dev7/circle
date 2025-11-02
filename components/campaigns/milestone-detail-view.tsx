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
   Calendar,
   CheckSquare,
   Target,
   Clock,
   Users,
   ArrowLeft,
   Flag,
   TrendingUp,
   AlertCircle,
} from 'lucide-react';
import type { CampaignMilestone, CampaignTask } from '@/types/campaign';

interface MilestoneDetailViewProps {
   milestone: CampaignMilestone;
   onUpdate: (milestoneId: string, data: Partial<CampaignMilestone>) => void;
   onDelete: (milestoneId: string) => void;
   onBack: () => void;
   onEdit: () => void;
}

const milestoneStatusConfig = {
   PENDING: { label: 'Pending', color: 'bg-gray-500', icon: '⏳' },
   IN_PROGRESS: { label: 'In Progress', color: 'bg-blue-500', icon: '🔄' },
   COMPLETED: { label: 'Completed', color: 'bg-green-500', icon: '✅' },
   OVERDUE: { label: 'Overdue', color: 'bg-red-500', icon: '⚠️' },
};

export function MilestoneDetailView({
   milestone,
   onUpdate,
   onDelete,
   onBack,
   onEdit,
}: MilestoneDetailViewProps) {
   const [activeTab, setActiveTab] = useState('overview');

   const formatDate = (date: Date | string | null) => {
      if (!date) return 'Not set';
      return new Date(date).toLocaleDateString('en-US', {
         year: 'numeric',
         month: 'long',
         day: 'numeric',
      });
   };

   const getMilestoneStatus = () => {
      const now = new Date();
      const targetDate = new Date(milestone.targetDate);

      if (milestone.completedAt) {
         return 'COMPLETED';
      } else if (now > targetDate) {
         return 'OVERDUE';
      } else if (milestone.startedAt) {
         return 'IN_PROGRESS';
      } else {
         return 'PENDING';
      }
   };

   const calculateProgress = () => {
      const tasks = milestone.tasks || [];
      if (tasks.length === 0) return 0;
      const completedTasks = tasks.filter((task) => task.status === 'DONE').length;
      return Math.round((completedTasks / tasks.length) * 100);
   };

   const getTaskStats = () => {
      const tasks = milestone.tasks || [];
      return {
         total: tasks.length,
         todo: tasks.filter((task) => task.status === 'TODO').length,
         inProgress: tasks.filter((task) => task.status === 'IN_PROGRESS').length,
         review: tasks.filter((task) => task.status === 'REVIEW').length,
         done: tasks.filter((task) => task.status === 'DONE').length,
         cancelled: tasks.filter((task) => task.status === 'CANCELLED').length,
      };
   };

   const getDaysRemaining = () => {
      if (milestone.completedAt) return 0;
      const now = new Date();
      const targetDate = new Date(milestone.targetDate);
      const diffTime = targetDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return Math.max(0, diffDays);
   };

   const renderStatusBadge = (status: string) => {
      const config = milestoneStatusConfig[status as keyof typeof milestoneStatusConfig];
      return (
         <Badge className={`${config.color} text-white`}>
            {config.icon} {config.label}
         </Badge>
      );
   };

   const renderTaskItem = (task: CampaignTask) => {
      const config = {
         TODO: { label: 'To Do', color: 'bg-gray-500', icon: '⏳' },
         IN_PROGRESS: { label: 'In Progress', color: 'bg-blue-500', icon: '🔄' },
         REVIEW: { label: 'Review', color: 'bg-yellow-500', icon: '👀' },
         DONE: { label: 'Done', color: 'bg-green-500', icon: '✅' },
         CANCELLED: { label: 'Cancelled', color: 'bg-red-500', icon: '❌' },
      }[task.status];

      return (
         <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
               <span>{config.icon}</span>
               <div>
                  <h4 className="font-medium">{task.title}</h4>
                  {task.description && (
                     <p className="text-sm text-muted-foreground">{task.description}</p>
                  )}
               </div>
            </div>
            <div className="flex items-center gap-2">
               {task.assignee && (
                  <Avatar className="h-6 w-6">
                     <AvatarImage src={task.assignee.image || ''} />
                     <AvatarFallback className="text-xs">
                        {task.assignee.name?.slice(0, 2).toUpperCase() || 'U'}
                     </AvatarFallback>
                  </Avatar>
               )}
               <Badge variant="outline" className={`${config.color} text-white border-0 text-xs`}>
                  {config.label}
               </Badge>
               {task.dueDate && (
                  <span className="text-xs text-muted-foreground">
                     Due {formatDate(task.dueDate)}
                  </span>
               )}
            </div>
         </div>
      );
   };

   const currentStatus = getMilestoneStatus();
   const taskStats = getTaskStats();
   const progress = calculateProgress();
   const daysRemaining = getDaysRemaining();

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
                  <h1 className="text-2xl font-bold">{milestone.title}</h1>
                  <div className="flex items-center gap-2 mt-1">
                     {renderStatusBadge(currentStatus)}
                     <span className="text-muted-foreground">•</span>
                     <span className="text-muted-foreground">
                        Due {formatDate(milestone.targetDate)}
                     </span>
                     {daysRemaining > 0 && (
                        <>
                           <span className="text-muted-foreground">•</span>
                           <span className="text-muted-foreground">
                              {daysRemaining} days remaining
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
                     <DropdownMenuItem onClick={onEdit}>Edit Milestone</DropdownMenuItem>
                     <DropdownMenuItem
                        onClick={() => onDelete(milestone.id)}
                        className="text-destructive"
                     >
                        Delete Milestone
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
                     <Target className="h-5 w-5 text-green-500" />
                     <div>
                        <p className="text-sm text-muted-foreground">Tasks</p>
                        <p className="text-xl font-bold">{taskStats.total}</p>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                     <Calendar className="h-5 w-5 text-purple-500" />
                     <div>
                        <p className="text-sm text-muted-foreground">Days Left</p>
                        <p
                           className={`text-xl font-bold ${daysRemaining <= 3 ? 'text-red-500' : ''}`}
                        >
                           {daysRemaining}
                        </p>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                     <Users className="h-5 w-5 text-orange-500" />
                     <div>
                        <p className="text-sm text-muted-foreground">Team Members</p>
                        <p className="text-xl font-bold">{milestone.teamMembers?.length || 0}</p>
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Tabs */}
         <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
               <TabsTrigger value="overview">Overview</TabsTrigger>
               <TabsTrigger value="tasks">Tasks ({taskStats.total})</TabsTrigger>
               <TabsTrigger value="timeline">Timeline</TabsTrigger>
               <TabsTrigger value="team">Team</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                     <CardHeader>
                        <CardTitle>📋 Milestone Information</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        {milestone.description && (
                           <div>
                              <h4 className="font-medium mb-2">Description</h4>
                              <p className="text-muted-foreground">{milestone.description}</p>
                           </div>
                        )}
                        <div className="space-y-2">
                           <div className="flex justify-between">
                              <span className="text-muted-foreground">Status:</span>
                              {renderStatusBadge(currentStatus)}
                           </div>
                           <div className="flex justify-between">
                              <span className="text-muted-foreground">Target Date:</span>
                              <span>{formatDate(milestone.targetDate)}</span>
                           </div>
                           <div className="flex justify-between">
                              <span className="text-muted-foreground">Started:</span>
                              <span>
                                 {milestone.startedAt
                                    ? formatDate(milestone.startedAt)
                                    : 'Not started'}
                              </span>
                           </div>
                           <div className="flex justify-between">
                              <span className="text-muted-foreground">Completed:</span>
                              <span>
                                 {milestone.completedAt
                                    ? formatDate(milestone.completedAt)
                                    : 'Not completed'}
                              </span>
                           </div>
                           <div className="flex justify-between">
                              <span className="text-muted-foreground">Created:</span>
                              <span>{formatDate(milestone.createdAt)}</span>
                           </div>
                        </div>
                     </CardContent>
                  </Card>

                  <Card>
                     <CardHeader>
                        <CardTitle>📊 Task Progress</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <div className="space-y-3">
                           <div className="flex justify-between items-center">
                              <span className="text-sm">To Do</span>
                              <span className="text-sm font-medium">{taskStats.todo}</span>
                           </div>
                           <div className="flex justify-between items-center">
                              <span className="text-sm">In Progress</span>
                              <span className="text-sm font-medium">{taskStats.inProgress}</span>
                           </div>
                           <div className="flex justify-between items-center">
                              <span className="text-sm">Review</span>
                              <span className="text-sm font-medium">{taskStats.review}</span>
                           </div>
                           <div className="flex justify-between items-center">
                              <span className="text-sm">Done</span>
                              <span className="text-sm font-medium">{taskStats.done}</span>
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

               {/* Timeline Overview */}
               <Card>
                  <CardHeader>
                     <CardTitle>⏰ Timeline Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-4">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                              <span className="text-sm text-muted-foreground">Created</span>
                           </div>
                           <span className="text-sm font-medium">
                              {formatDate(milestone.createdAt)}
                           </span>
                        </div>

                        {milestone.startedAt && (
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                 <span className="text-sm text-muted-foreground">Started</span>
                              </div>
                              <span className="text-sm font-medium">
                                 {formatDate(milestone.startedAt)}
                              </span>
                           </div>
                        )}

                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <span className="text-sm text-muted-foreground">Target</span>
                           </div>
                           <span className="text-sm font-medium">
                              {formatDate(milestone.targetDate)}
                           </span>
                        </div>

                        {milestone.completedAt && (
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                 <span className="text-sm text-muted-foreground">Completed</span>
                              </div>
                              <span className="text-sm font-medium">
                                 {formatDate(milestone.completedAt)}
                              </span>
                           </div>
                        )}
                     </div>
                  </CardContent>
               </Card>
            </TabsContent>

            <TabsContent value="tasks" className="space-y-4">
               <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">📋 Milestone Tasks ({taskStats.total})</h3>
                  <Button variant="outline" size="sm">
                     <CheckSquare className="h-4 w-4 mr-2" />
                     Add Task
                  </Button>
               </div>

               <div className="space-y-3">
                  {milestone.tasks && milestone.tasks.length > 0 ? (
                     milestone.tasks.map(renderTaskItem)
                  ) : (
                     <div className="text-center py-8">
                        <CheckSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h4 className="font-medium mb-2">No tasks yet</h4>
                        <p className="text-muted-foreground mb-4">
                           Add tasks to track progress on this milestone
                        </p>
                        <Button variant="outline">
                           <CheckSquare className="h-4 w-4 mr-2" />
                           Add First Task
                        </Button>
                     </div>
                  )}
               </div>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4">
               <Card>
                  <CardHeader>
                     <CardTitle>📅 Detailed Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-6">
                        <div className="flex items-center gap-4">
                           <div className="flex-shrink-0">
                              <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                           </div>
                           <div className="flex-1">
                              <h4 className="font-medium">Milestone Created</h4>
                              <p className="text-sm text-muted-foreground">
                                 {formatDate(milestone.createdAt)}
                              </p>
                           </div>
                        </div>

                        {milestone.startedAt && (
                           <div className="flex items-center gap-4">
                              <div className="flex-shrink-0">
                                 <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                              </div>
                              <div className="flex-1">
                                 <h4 className="font-medium">Work Started</h4>
                                 <p className="text-sm text-muted-foreground">
                                    {formatDate(milestone.startedAt)}
                                 </p>
                              </div>
                           </div>
                        )}

                        <div className="flex items-center gap-4">
                           <div className="flex-shrink-0">
                              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                           </div>
                           <div className="flex-1">
                              <h4 className="font-medium">Target Completion</h4>
                              <p className="text-sm text-muted-foreground">
                                 {formatDate(milestone.targetDate)}
                              </p>
                              {daysRemaining > 0 && (
                                 <p className="text-sm text-muted-foreground">
                                    {daysRemaining} days remaining
                                 </p>
                              )}
                           </div>
                        </div>

                        {milestone.completedAt && (
                           <div className="flex items-center gap-4">
                              <div className="flex-shrink-0">
                                 <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                              </div>
                              <div className="flex-1">
                                 <h4 className="font-medium">Milestone Completed</h4>
                                 <p className="text-sm text-muted-foreground">
                                    {formatDate(milestone.completedAt)}
                                 </p>
                              </div>
                           </div>
                        )}
                     </div>
                  </CardContent>
               </Card>
            </TabsContent>

            <TabsContent value="team" className="space-y-4">
               <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                     👥 Team Members ({milestone.teamMembers?.length || 0})
                  </h3>
                  <Button variant="outline" size="sm">
                     <Users className="h-4 w-4 mr-2" />
                     Add Member
                  </Button>
               </div>

               {milestone.teamMembers && milestone.teamMembers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     {milestone.teamMembers.map((member: any) => (
                        <Card key={member.id}>
                           <CardContent className="p-4">
                              <div className="flex items-center gap-3">
                                 <Avatar className="h-10 w-10">
                                    <AvatarImage src={member.user?.image || ''} />
                                    <AvatarFallback>
                                       {member.user?.name?.slice(0, 2).toUpperCase() || 'U'}
                                    </AvatarFallback>
                                 </Avatar>
                                 <div>
                                    <h4 className="font-medium">
                                       {member.user?.name || 'Unknown'}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">{member.role}</p>
                                 </div>
                              </div>
                           </CardContent>
                        </Card>
                     ))}
                  </div>
               ) : (
                  <div className="text-center py-8">
                     <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                     <h4 className="font-medium mb-2">No team members assigned</h4>
                     <p className="text-muted-foreground mb-4">
                        Assign team members to work on this milestone
                     </p>
                     <Button variant="outline">
                        <Users className="h-4 w-4 mr-2" />
                        Add First Member
                     </Button>
                  </div>
               )}
            </TabsContent>
         </Tabs>
      </div>
   );
}
