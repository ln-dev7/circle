'use client';

import { useState } from 'react';
import {
   ArrowLeft,
   Edit,
   MoreHorizontal,
   Users,
   CheckSquare,
   Calendar,
   Target,
   TrendingUp,
   Settings,
   Plus,
   FileText,
   BarChart3,
   PieChart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import type {
   Campaign,
   CampaignTask,
   CampaignMember,
   UpdateCampaignData,
   CreateTaskData,
   UpdateTaskData,
   AddMemberData,
} from '@/types/campaign';

interface CampaignDetailProps {
   campaign: Campaign;
   onUpdate: (data: UpdateCampaignData) => void;
   onDelete: () => void;
   onBack: () => void;
   onEdit: () => void;
   onAddMember: (data: AddMemberData) => void;
   onRemoveMember: (memberId: string) => void;
   onCreateTask: (data: CreateTaskData) => void;
   onUpdateTask: (taskId: string, data: UpdateTaskData) => void;
   onDeleteTask: (taskId: string) => void;
   loading?: boolean;
}

const statusConfig = {
   DRAFT: { label: 'Draft', color: 'bg-gray-500' },
   PLANNING: { label: 'Planning', color: 'bg-yellow-500' },
   READY: { label: 'Ready', color: 'bg-green-500' },
   DONE: { label: 'Done', color: 'bg-blue-500' },
   CANCELED: { label: 'Canceled', color: 'bg-red-500' },
};

const healthConfig = {
   ON_TRACK: { label: 'On Track', color: 'bg-green-500', icon: '🟢' },
   AT_RISK: { label: 'At Risk', color: 'bg-yellow-500', icon: '🟡' },
   OFF_TRACK: { label: 'Off Track', color: 'bg-red-500', icon: '🔴' },
};

const priorityConfig = {
   NO_PRIORITY: { label: 'No Priority', color: 'bg-gray-400' },
   LOW: { label: 'Low', color: 'bg-green-400' },
   MEDIUM: { label: 'Medium', color: 'bg-yellow-400' },
   HIGH: { label: 'High', color: 'bg-orange-400' },
   URGENT: { label: 'Urgent', color: 'bg-red-500' },
};

const taskStatusConfig = {
   TODO: { label: 'To Do', color: 'bg-gray-500', icon: '⏳' },
   IN_PROGRESS: { label: 'In Progress', color: 'bg-blue-500', icon: '🔄' },
   REVIEW: { label: 'Review', color: 'bg-yellow-500', icon: '👀' },
   DONE: { label: 'Done', color: 'bg-green-500', icon: '✅' },
   CANCELLED: { label: 'Cancelled', color: 'bg-red-500', icon: '❌' },
};

export function CampaignDetail({
   campaign,
   onUpdate,
   onDelete,
   onBack,
   onEdit,
   onAddMember,
   onRemoveMember,
   onCreateTask,
   onUpdateTask,
   onDeleteTask,
   loading = false,
}: CampaignDetailProps) {
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
      const tasks = campaign.tasks || [];
      if (tasks.length === 0) return 0;
      const completedTasks = tasks.filter((task) => task.status === 'DONE').length;
      return Math.round((completedTasks / tasks.length) * 100);
   };

   const getTaskStats = () => {
      const tasks = campaign.tasks || [];
      return {
         total: tasks.length,
         todo: tasks.filter((task) => task.status === 'TODO').length,
         inProgress: tasks.filter((task) => task.status === 'IN_PROGRESS').length,
         review: tasks.filter((task) => task.status === 'REVIEW').length,
         done: tasks.filter((task) => task.status === 'DONE').length,
         cancelled: tasks.filter((task) => task.status === 'CANCELLED').length,
      };
   };

   const getContentStats = () => {
      const contents = campaign.contents || [];
      return {
         total: contents.length,
         draft: contents.filter((content) => content.status === 'DRAFT').length,
         submitted: contents.filter((content) => content.status === 'SUBMITTED').length,
         approved: contents.filter((content) => content.status === 'APPROVED').length,
         published: contents.filter((content) => content.status === 'PUBLISHED').length,
         rejected: contents.filter((content) => content.status === 'REJECTED').length,
      };
   };

   const renderStatusBadge = (status: Campaign['status']) => {
      const config = statusConfig[status];
      return <Badge className={`${config.color} text-white`}>{config.label}</Badge>;
   };

   const renderHealthIndicator = (health: Campaign['health']) => {
      const config = healthConfig[health];
      return (
         <div className="flex items-center gap-2">
            <span>{config.icon}</span>
            <span>{config.label}</span>
         </div>
      );
   };

   const renderPriorityBadge = (priority: Campaign['priority']) => {
      if (priority === 'NO_PRIORITY')
         return <span className="text-muted-foreground">No Priority</span>;
      const config = priorityConfig[priority];
      return (
         <Badge variant="outline" className={`${config.color} text-white border-0`}>
            {config.label}
         </Badge>
      );
   };

   const renderTaskItem = (task: CampaignTask) => {
      const config = taskStatusConfig[task.status];
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
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                     <DropdownMenuItem onClick={() => onUpdateTask(task.id, { status: 'DONE' })}>
                        Mark as Done
                     </DropdownMenuItem>
                     <DropdownMenuItem
                        onClick={() => onDeleteTask(task.id)}
                        className="text-destructive"
                     >
                        Delete Task
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
         </div>
      );
   };

   const renderTeamMember = (member: CampaignMember) => (
      <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
         <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
               <AvatarImage src={member.user.image || ''} />
               <AvatarFallback>{member.user.name?.slice(0, 2).toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
            <div>
               <h4 className="font-medium">{member.user.name || 'Unknown'}</h4>
               <p className="text-sm text-muted-foreground">{member.user.email}</p>
            </div>
         </div>
         <div className="flex items-center gap-2">
            <Badge variant="outline">{member.role}</Badge>
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                     <MoreHorizontal className="h-4 w-4" />
                  </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end">
                  <DropdownMenuItem
                     onClick={() => onRemoveMember(member.id)}
                     className="text-destructive"
                  >
                     Remove Member
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         </div>
      </div>
   );

   const renderContentItem = (content: any) => (
      <div key={content.id} className="flex items-center justify-between p-3 border rounded-lg">
         <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-blue-500" />
            <div>
               <h4 className="font-medium">{content.title}</h4>
               <p className="text-sm text-muted-foreground">
                  {content.body ? `${content.body.substring(0, 100)}...` : 'No content'}
               </p>
            </div>
         </div>
         <div className="flex items-center gap-2">
            <Badge variant="outline">{content.status}</Badge>
            <Button variant="ghost" size="sm" asChild>
               <a href={`/content/${content.id}`}>View</a>
            </Button>
         </div>
      </div>
   );

   const taskStats = getTaskStats();
   const contentStats = getContentStats();
   const progress = calculateProgress();

   return (
      <div className="space-y-6">
         {/* Header */}
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
               <Button variant="ghost" size="sm" onClick={onBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Campaigns
               </Button>
               <Separator orientation="vertical" className="h-6" />
               <div>
                  <h1 className="text-2xl font-bold">{campaign.name}</h1>
                  <div className="flex items-center gap-2 mt-1">
                     {renderHealthIndicator(campaign.health)}
                     <span className="text-muted-foreground">•</span>
                     {renderStatusBadge(campaign.status)}
                     <span className="text-muted-foreground">•</span>
                     {renderPriorityBadge(campaign.priority)}
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
                     <DropdownMenuItem onClick={onEdit}>Edit Campaign</DropdownMenuItem>
                     <DropdownMenuItem onClick={onDelete} className="text-destructive">
                        Delete Campaign
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
                     <FileText className="h-5 w-5 text-purple-500" />
                     <div>
                        <p className="text-sm text-muted-foreground">Content</p>
                        <p className="text-xl font-bold">{contentStats.total}</p>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                     <Users className="h-5 w-5 text-orange-500" />
                     <div>
                        <p className="text-sm text-muted-foreground">Team</p>
                        <p className="text-xl font-bold">{campaign.members?.length || 0}</p>
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
               <TabsTrigger value="content">Content ({contentStats.total})</TabsTrigger>
               <TabsTrigger value="team">Team ({campaign.members?.length || 0})</TabsTrigger>
               <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                     <CardHeader>
                        <CardTitle>📋 Overview</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        {campaign.summary && (
                           <div>
                              <h4 className="font-medium mb-2">Summary</h4>
                              <p className="text-muted-foreground">{campaign.summary}</p>
                           </div>
                        )}
                        {campaign.description && (
                           <div>
                              <h4 className="font-medium mb-2">Description</h4>
                              <p className="text-muted-foreground">{campaign.description}</p>
                           </div>
                        )}
                        <div className="space-y-2">
                           <div className="flex justify-between">
                              <span className="text-muted-foreground">Status:</span>
                              {renderStatusBadge(campaign.status)}
                           </div>
                           <div className="flex justify-between">
                              <span className="text-muted-foreground">Health:</span>
                              {renderHealthIndicator(campaign.health)}
                           </div>
                           <div className="flex justify-between">
                              <span className="text-muted-foreground">Priority:</span>
                              {renderPriorityBadge(campaign.priority)}
                           </div>
                           <div className="flex justify-between">
                              <span className="text-muted-foreground">Start Date:</span>
                              <span>{formatDate(campaign.startDate)}</span>
                           </div>
                           <div className="flex justify-between">
                              <span className="text-muted-foreground">Target Date:</span>
                              <span>{formatDate(campaign.targetDate)}</span>
                           </div>
                        </div>
                     </CardContent>
                  </Card>

                  <Card>
                     <CardHeader>
                        <CardTitle>📊 Progress Overview</CardTitle>
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
            </TabsContent>

            <TabsContent value="tasks" className="space-y-4">
               <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">📋 Tasks ({taskStats.total})</h3>
                  <div className="flex items-center gap-2">
                     <Button
                        onClick={() => onCreateTask({ title: 'New Task', campaignId: campaign.id })}
                     >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Task
                     </Button>
                     <Button variant="outline" asChild>
                        <a href={`/${campaign.organizationId}/campaigns/${campaign.id}/tasks`}>
                           Manage Tasks
                        </a>
                     </Button>
                  </div>
               </div>
               <div className="space-y-3">
                  {campaign.tasks && campaign.tasks.length > 0 ? (
                     campaign.tasks.map(renderTaskItem)
                  ) : (
                     <div className="text-center py-8">
                        <h4 className="font-medium mb-2">No tasks yet</h4>
                        <p className="text-muted-foreground mb-4">
                           Add tasks to track progress on this campaign
                        </p>
                        <Button
                           onClick={() =>
                              onCreateTask({ title: 'New Task', campaignId: campaign.id })
                           }
                        >
                           <Plus className="h-4 w-4 mr-2" />
                           Add First Task
                        </Button>
                     </div>
                  )}
               </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-4">
               <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">📄 Content ({contentStats.total})</h3>
                  <div className="flex items-center gap-2">
                     <Button asChild>
                        <a href={`/content/new?campaignId=${campaign.id}`}>
                           <Plus className="h-4 w-4 mr-2" />
                           Create Content
                        </a>
                     </Button>
                     <Button variant="outline" asChild>
                        <a href={`/${campaign.organizationId}/campaigns/${campaign.id}/content`}>
                           Manage Content
                        </a>
                     </Button>
                  </div>
               </div>

               {/* Content Stats */}
               <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <Card>
                     <CardContent className="p-3 text-center">
                        <div className="text-2xl font-bold text-gray-500">{contentStats.draft}</div>
                        <div className="text-sm text-muted-foreground">Draft</div>
                     </CardContent>
                  </Card>
                  <Card>
                     <CardContent className="p-3 text-center">
                        <div className="text-2xl font-bold text-yellow-500">
                           {contentStats.submitted}
                        </div>
                        <div className="text-sm text-muted-foreground">Submitted</div>
                     </CardContent>
                  </Card>
                  <Card>
                     <CardContent className="p-3 text-center">
                        <div className="text-2xl font-bold text-blue-500">
                           {contentStats.approved}
                        </div>
                        <div className="text-sm text-muted-foreground">Approved</div>
                     </CardContent>
                  </Card>
                  <Card>
                     <CardContent className="p-3 text-center">
                        <div className="text-2xl font-bold text-green-500">
                           {contentStats.published}
                        </div>
                        <div className="text-sm text-muted-foreground">Published</div>
                     </CardContent>
                  </Card>
                  <Card>
                     <CardContent className="p-3 text-center">
                        <div className="text-2xl font-bold text-red-500">
                           {contentStats.rejected}
                        </div>
                        <div className="text-sm text-muted-foreground">Rejected</div>
                     </CardContent>
                  </Card>
               </div>

               <div className="space-y-3">
                  {campaign.contents && campaign.contents.length > 0 ? (
                     campaign.contents.map(renderContentItem)
                  ) : (
                     <div className="text-center py-8">
                        <h4 className="font-medium mb-2">No content yet</h4>
                        <p className="text-muted-foreground mb-4">
                           Create content for this campaign
                        </p>
                        <Button asChild>
                           <a href={`/content/new?campaignId=${campaign.id}`}>
                              <Plus className="h-4 w-4 mr-2" />
                              Create First Content
                           </a>
                        </Button>
                     </div>
                  )}
               </div>
            </TabsContent>

            <TabsContent value="team" className="space-y-4">
               <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                     👥 Team Members ({campaign.members?.length || 0})
                  </h3>
                  <div className="flex items-center gap-2">
                     <Button onClick={() => onAddMember({ userId: '', role: 'MEMBER' })}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Member
                     </Button>
                     <Button variant="outline" asChild>
                        <a href={`/${campaign.organizationId}/campaigns/${campaign.id}/members`}>
                           Manage Team
                        </a>
                     </Button>
                  </div>
               </div>
               <div className="space-y-3">
                  {campaign.lead && (
                     <div className="p-3 border rounded-lg bg-muted/30">
                        <div className="flex items-center gap-3">
                           <Avatar className="h-10 w-10">
                              <AvatarImage src={campaign.lead.image || ''} />
                              <AvatarFallback>
                                 {campaign.lead.name?.slice(0, 2).toUpperCase() || 'L'}
                              </AvatarFallback>
                           </Avatar>
                           <div>
                              <h4 className="font-medium flex items-center gap-2">
                                 {campaign.lead.name || 'Unknown'}
                                 <Badge variant="outline">Lead</Badge>
                              </h4>
                              <p className="text-sm text-muted-foreground">{campaign.lead.email}</p>
                           </div>
                        </div>
                     </div>
                  )}
                  {campaign.members && campaign.members.length > 0 ? (
                     campaign.members.map(renderTeamMember)
                  ) : (
                     <div className="text-center py-8">
                        <h4 className="font-medium mb-2">No team members yet</h4>
                        <p className="text-muted-foreground mb-4">
                           Add team members to collaborate on this campaign
                        </p>
                        <Button onClick={() => onAddMember({ userId: '', role: 'MEMBER' })}>
                           <Plus className="h-4 w-4 mr-2" />
                           Add First Member
                        </Button>
                     </div>
                  )}
               </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
               <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">📊 Analytics Overview</h3>
                  <Button variant="outline" asChild>
                     <a href={`/${campaign.organizationId}/campaigns/${campaign.id}/analytics`}>
                        View Full Analytics
                     </a>
                  </Button>
               </div>
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <BarChart3 className="h-5 w-5" />
                           Task Progress
                        </CardTitle>
                     </CardHeader>
                     <CardContent>
                        <div className="space-y-3">
                           <div className="flex justify-between items-center">
                              <span className="text-sm">To Do</span>
                              <div className="flex items-center gap-2">
                                 <Progress
                                    value={(taskStats.todo / taskStats.total) * 100}
                                    className="w-20"
                                 />
                                 <span className="text-sm font-medium">{taskStats.todo}</span>
                              </div>
                           </div>
                           <div className="flex justify-between items-center">
                              <span className="text-sm">In Progress</span>
                              <div className="flex items-center gap-2">
                                 <Progress
                                    value={(taskStats.inProgress / taskStats.total) * 100}
                                    className="w-20"
                                 />
                                 <span className="text-sm font-medium">{taskStats.inProgress}</span>
                              </div>
                           </div>
                           <div className="flex justify-between items-center">
                              <span className="text-sm">Review</span>
                              <div className="flex items-center gap-2">
                                 <Progress
                                    value={(taskStats.review / taskStats.total) * 100}
                                    className="w-20"
                                 />
                                 <span className="text-sm font-medium">{taskStats.review}</span>
                              </div>
                           </div>
                           <div className="flex justify-between items-center">
                              <span className="text-sm">Done</span>
                              <div className="flex items-center gap-2">
                                 <Progress
                                    value={(taskStats.done / taskStats.total) * 100}
                                    className="w-20"
                                 />
                                 <span className="text-sm font-medium">{taskStats.done}</span>
                              </div>
                           </div>
                        </div>
                     </CardContent>
                  </Card>

                  <Card>
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <PieChart className="h-5 w-5" />
                           Content Status
                        </CardTitle>
                     </CardHeader>
                     <CardContent>
                        <div className="space-y-3">
                           <div className="flex justify-between items-center">
                              <span className="text-sm">Draft</span>
                              <div className="flex items-center gap-2">
                                 <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                                 <span className="text-sm font-medium">{contentStats.draft}</span>
                              </div>
                           </div>
                           <div className="flex justify-between items-center">
                              <span className="text-sm">Submitted</span>
                              <div className="flex items-center gap-2">
                                 <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                 <span className="text-sm font-medium">
                                    {contentStats.submitted}
                                 </span>
                              </div>
                           </div>
                           <div className="flex justify-between items-center">
                              <span className="text-sm">Approved</span>
                              <div className="flex items-center gap-2">
                                 <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                 <span className="text-sm font-medium">
                                    {contentStats.approved}
                                 </span>
                              </div>
                           </div>
                           <div className="flex justify-between items-center">
                              <span className="text-sm">Published</span>
                              <div className="flex items-center gap-2">
                                 <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                 <span className="text-sm font-medium">
                                    {contentStats.published}
                                 </span>
                              </div>
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               </div>

               <Card>
                  <CardHeader>
                     <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Campaign Timeline
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-4">
                        <div className="flex justify-between items-center">
                           <span className="text-sm text-muted-foreground">Start Date</span>
                           <span className="font-medium">{formatDate(campaign.startDate)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-sm text-muted-foreground">Target Date</span>
                           <span className="font-medium">{formatDate(campaign.targetDate)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-sm text-muted-foreground">Days Remaining</span>
                           <span className="font-medium">
                              {campaign.targetDate
                                 ? Math.max(
                                      0,
                                      Math.ceil(
                                         (new Date(campaign.targetDate).getTime() -
                                            new Date().getTime()) /
                                            (1000 * 60 * 60 * 24)
                                      )
                                   )
                                 : 'Not set'}{' '}
                              days
                           </span>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </TabsContent>
         </Tabs>
      </div>
   );
}
