'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
   TrendingUp,
   Users,
   CheckSquare,
   FileText,
   Calendar,
   Target,
   BarChart3,
   PieChart,
   Activity,
   Clock,
   AlertTriangle,
   CheckCircle,
   XCircle,
} from 'lucide-react';
import type { Campaign, CampaignTask, CampaignContent } from '@/types/campaign';

interface CampaignAnalyticsPageProps {
   orgId: string;
   campaignId: string;
   campaign: Campaign;
}

const statusConfig = {
   DRAFT: { label: 'Draft', color: 'bg-gray-500', icon: '📝' },
   PLANNING: { label: 'Planning', color: 'bg-yellow-500', icon: '📋' },
   READY: { label: 'Ready', color: 'bg-green-500', icon: '✅' },
   DONE: { label: 'Done', color: 'bg-blue-500', icon: '🎉' },
   CANCELED: { label: 'Canceled', color: 'bg-red-500', icon: '❌' },
};

const healthConfig = {
   ON_TRACK: { label: 'On Track', color: 'bg-green-500', icon: '🟢' },
   AT_RISK: { label: 'At Risk', color: 'bg-yellow-500', icon: '🟡' },
   OFF_TRACK: { label: 'Off Track', color: 'bg-red-500', icon: '🔴' },
};

const taskStatusConfig = {
   TODO: { label: 'To Do', color: 'bg-gray-500', icon: '⏳' },
   IN_PROGRESS: { label: 'In Progress', color: 'bg-blue-500', icon: '🔄' },
   REVIEW: { label: 'Review', color: 'bg-yellow-500', icon: '👀' },
   DONE: { label: 'Done', color: 'bg-green-500', icon: '✅' },
   CANCELLED: { label: 'Cancelled', color: 'bg-red-500', icon: '❌' },
};

const contentStatusConfig = {
   DRAFT: { label: 'Draft', color: 'bg-gray-500', icon: '📝' },
   SUBMITTED: { label: 'Submitted', color: 'bg-yellow-500', icon: '📤' },
   APPROVED: { label: 'Approved', color: 'bg-green-500', icon: '✅' },
   PUBLISHED: { label: 'Published', color: 'bg-blue-500', icon: '🌐' },
   REJECTED: { label: 'Rejected', color: 'bg-red-500', icon: '❌' },
};

export function CampaignAnalyticsPage({ orgId, campaignId, campaign }: CampaignAnalyticsPageProps) {
   const router = useRouter();
   const [tasks, setTasks] = useState<CampaignTask[]>([]);
   const [contents, setContents] = useState<CampaignContent[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      fetchAnalyticsData();
   }, [orgId, campaignId]);

   const fetchAnalyticsData = async () => {
      try {
         // Fetch tasks and contents for analytics
         const [tasksResponse, contentsResponse] = await Promise.all([
            fetch(`/api/${orgId}/campaigns/${campaignId}/tasks`),
            fetch(`/api/${orgId}/campaigns/${campaignId}/contents`),
         ]);

         if (tasksResponse.ok) {
            const tasksData = await tasksResponse.json();
            setTasks(tasksData.tasks || []);
         }

         if (contentsResponse.ok) {
            const contentsData = await contentsResponse.json();
            setContents(contentsData.contents || []);
         }
      } catch (error) {
         console.error('Error fetching analytics data:', error);
      } finally {
         setLoading(false);
      }
   };

   const calculateTaskProgress = () => {
      if (tasks.length === 0) return 0;
      const completedTasks = tasks.filter((task) => task.status === 'DONE').length;
      return Math.round((completedTasks / tasks.length) * 100);
   };

   const calculateContentProgress = () => {
      if (contents.length === 0) return 0;
      const publishedContents = contents.filter((content) => content.status === 'PUBLISHED').length;
      return Math.round((publishedContents / contents.length) * 100);
   };

   const getTaskStats = () => {
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
      return {
         total: contents.length,
         draft: contents.filter((content) => content.status === 'DRAFT').length,
         submitted: contents.filter((content) => content.status === 'SUBMITTED').length,
         approved: contents.filter((content) => content.status === 'APPROVED').length,
         published: contents.filter((content) => content.status === 'PUBLISHED').length,
         rejected: contents.filter((content) => content.status === 'REJECTED').length,
      };
   };

   const getTimelineProgress = () => {
      if (!campaign.startDate || !campaign.endDate) return 0;

      const now = new Date();
      const start = new Date(campaign.startDate);
      const end = new Date(campaign.endDate);

      if (now < start) return 0;
      if (now > end) return 100;

      const totalDuration = end.getTime() - start.getTime();
      const elapsed = now.getTime() - start.getTime();
      return Math.round((elapsed / totalDuration) * 100);
   };

   const getOverdueTasks = () => {
      const now = new Date();
      return tasks.filter((task) => {
         if (!task.dueDate) return false;
         return new Date(task.dueDate) < now && task.status !== 'DONE';
      });
   };

   const getUpcomingDeadlines = () => {
      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      return tasks
         .filter((task) => {
            if (!task.dueDate) return false;
            const dueDate = new Date(task.dueDate);
            return dueDate >= now && dueDate <= nextWeek && task.status !== 'DONE';
         })
         .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());
   };

   if (loading) {
      return (
         <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
               <p className="text-muted-foreground">Loading analytics...</p>
            </div>
         </div>
      );
   }

   const taskStats = getTaskStats();
   const contentStats = getContentStats();
   const timelineProgress = getTimelineProgress();
   const overdueTasks = getOverdueTasks();
   const upcomingDeadlines = getUpcomingDeadlines();

   return (
      <div className="space-y-6">
         {/* Page Header */}
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-3xl font-bold">Campaign Analytics</h1>
               <p className="text-muted-foreground">
                  Performance insights for: <span className="font-medium">{campaign.title}</span>
               </p>
            </div>
            <div className="flex items-center gap-2">
               <Button
                  variant="outline"
                  onClick={() => router.push(`/${orgId}/campaigns/${campaignId}`)}
               >
                  Back to Campaign
               </Button>
            </div>
         </div>

         {/* Overview Cards */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
               <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                     <CheckSquare className="h-5 w-5 text-blue-500" />
                     <div>
                        <p className="text-sm text-muted-foreground">Task Progress</p>
                        <p className="text-xl font-bold">{calculateTaskProgress()}%</p>
                     </div>
                  </div>
                  <Progress value={calculateTaskProgress()} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                     {taskStats.done} of {taskStats.total} tasks completed
                  </p>
               </CardContent>
            </Card>

            <Card>
               <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                     <FileText className="h-5 w-5 text-green-500" />
                     <div>
                        <p className="text-sm text-muted-foreground">Content Progress</p>
                        <p className="text-xl font-bold">{calculateContentProgress()}%</p>
                     </div>
                  </div>
                  <Progress value={calculateContentProgress()} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                     {contentStats.published} of {contentStats.total} contents published
                  </p>
               </CardContent>
            </Card>

            <Card>
               <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                     <Calendar className="h-5 w-5 text-purple-500" />
                     <div>
                        <p className="text-sm text-muted-foreground">Timeline Progress</p>
                        <p className="text-xl font-bold">{timelineProgress}%</p>
                     </div>
                  </div>
                  <Progress value={timelineProgress} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">Campaign timeline progress</p>
               </CardContent>
            </Card>

            <Card>
               <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                     <Users className="h-5 w-5 text-orange-500" />
                     <div>
                        <p className="text-sm text-muted-foreground">Team Members</p>
                        <p className="text-xl font-bold">{campaign.members?.length || 0}</p>
                     </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Active team members</p>
               </CardContent>
            </Card>
         </div>

         {/* Detailed Analytics */}
         <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
               <TabsTrigger value="overview">Overview</TabsTrigger>
               <TabsTrigger value="tasks">Task Analytics</TabsTrigger>
               <TabsTrigger value="content">Content Analytics</TabsTrigger>
               <TabsTrigger value="timeline">Timeline</TabsTrigger>
               <TabsTrigger value="alerts">Alerts</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                     <CardHeader>
                        <CardTitle>Campaign Status</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                           <span className="text-sm">Status</span>
                           <Badge className={`${statusConfig[campaign.status].color} text-white`}>
                              {statusConfig[campaign.status].icon}{' '}
                              {statusConfig[campaign.status].label}
                           </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                           <span className="text-sm">Health</span>
                           <Badge className={`${healthConfig[campaign.health].color} text-white`}>
                              {healthConfig[campaign.health].icon}{' '}
                              {healthConfig[campaign.health].label}
                           </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                           <span className="text-sm">Priority</span>
                           <Badge variant="outline">
                              {campaign.priority === 'NO_PRIORITY'
                                 ? 'No Priority'
                                 : campaign.priority}
                           </Badge>
                        </div>
                     </CardContent>
                  </Card>

                  <Card>
                     <CardHeader>
                        <CardTitle>Quick Stats</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                           <span className="text-sm">Total Tasks</span>
                           <span className="font-medium">{taskStats.total}</span>
                        </div>
                        <div className="flex items-center justify-between">
                           <span className="text-sm">Total Content</span>
                           <span className="font-medium">{contentStats.total}</span>
                        </div>
                        <div className="flex items-center justify-between">
                           <span className="text-sm">Overdue Tasks</span>
                           <span className="font-medium text-red-600">{overdueTasks.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                           <span className="text-sm">Upcoming Deadlines</span>
                           <span className="font-medium text-orange-600">
                              {upcomingDeadlines.length}
                           </span>
                        </div>
                     </CardContent>
                  </Card>
               </div>
            </TabsContent>

            <TabsContent value="tasks" className="space-y-6">
               <Card>
                  <CardHeader>
                     <CardTitle>Task Status Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-4">
                        {Object.entries(taskStatusConfig).map(([status, config]) => {
                           const count =
                              taskStats[status.toLowerCase() as keyof typeof taskStats] || 0;
                           const percentage =
                              taskStats.total > 0 ? Math.round((count / taskStats.total) * 100) : 0;

                           return (
                              <div key={status} className="flex items-center justify-between">
                                 <div className="flex items-center gap-3">
                                    <span>{config.icon}</span>
                                    <Badge variant="outline">{config.label}</Badge>
                                    <span className="text-sm">{count} tasks</span>
                                 </div>
                                 <div className="flex items-center gap-2">
                                    <Progress value={percentage} className="w-24" />
                                    <span className="text-sm font-medium w-12 text-right">
                                       {percentage}%
                                    </span>
                                 </div>
                              </div>
                           );
                        })}
                     </div>
                  </CardContent>
               </Card>
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
               <Card>
                  <CardHeader>
                     <CardTitle>Content Status Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-4">
                        {Object.entries(contentStatusConfig).map(([status, config]) => {
                           const count =
                              contentStats[status.toLowerCase() as keyof typeof contentStats] || 0;
                           const percentage =
                              contentStats.total > 0
                                 ? Math.round((count / contentStats.total) * 100)
                                 : 0;

                           return (
                              <div key={status} className="flex items-center justify-between">
                                 <div className="flex items-center gap-3">
                                    <span>{config.icon}</span>
                                    <Badge variant="outline">{config.label}</Badge>
                                    <span className="text-sm">{count} items</span>
                                 </div>
                                 <div className="flex items-center gap-2">
                                    <Progress value={percentage} className="w-24" />
                                    <span className="text-sm font-medium w-12 text-right">
                                       {percentage}%
                                    </span>
                                 </div>
                              </div>
                           );
                        })}
                     </div>
                  </CardContent>
               </Card>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                     <CardHeader>
                        <CardTitle>Campaign Timeline</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                           <span className="text-sm">Start Date</span>
                           <span className="font-medium">
                              {campaign.startDate
                                 ? new Date(campaign.startDate).toLocaleDateString()
                                 : 'Not set'}
                           </span>
                        </div>
                        <div className="flex items-center justify-between">
                           <span className="text-sm">End Date</span>
                           <span className="font-medium">
                              {campaign.endDate
                                 ? new Date(campaign.endDate).toLocaleDateString()
                                 : 'Not set'}
                           </span>
                        </div>
                        <div className="flex items-center justify-between">
                           <span className="text-sm">Progress</span>
                           <span className="font-medium">{timelineProgress}%</span>
                        </div>
                        <Progress value={timelineProgress} />
                     </CardContent>
                  </Card>

                  <Card>
                     <CardHeader>
                        <CardTitle>Upcoming Deadlines</CardTitle>
                     </CardHeader>
                     <CardContent>
                        {upcomingDeadlines.length > 0 ? (
                           <div className="space-y-3">
                              {upcomingDeadlines.slice(0, 5).map((task) => (
                                 <div
                                    key={task.id}
                                    className="flex items-center justify-between p-2 border rounded"
                                 >
                                    <span className="text-sm font-medium">{task.title}</span>
                                    <Badge variant="outline" className="text-xs">
                                       {new Date(task.dueDate!).toLocaleDateString()}
                                    </Badge>
                                 </div>
                              ))}
                           </div>
                        ) : (
                           <p className="text-muted-foreground text-center py-4">
                              No upcoming deadlines
                           </p>
                        )}
                     </CardContent>
                  </Card>
               </div>
            </TabsContent>

            <TabsContent value="alerts" className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <AlertTriangle className="h-5 w-5 text-red-500" />
                           Overdue Tasks
                        </CardTitle>
                     </CardHeader>
                     <CardContent>
                        {overdueTasks.length > 0 ? (
                           <div className="space-y-3">
                              {overdueTasks.map((task) => (
                                 <div
                                    key={task.id}
                                    className="flex items-center justify-between p-2 border border-red-200 rounded bg-red-50"
                                 >
                                    <span className="text-sm font-medium">{task.title}</span>
                                    <Badge variant="destructive" className="text-xs">
                                       {Math.abs(
                                          Math.ceil(
                                             (new Date(task.dueDate!).getTime() -
                                                new Date().getTime()) /
                                                (1000 * 60 * 60 * 24)
                                          )
                                       )}
                                       d overdue
                                    </Badge>
                                 </div>
                              ))}
                           </div>
                        ) : (
                           <div className="text-center py-4">
                              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                              <p className="text-muted-foreground">All tasks are on time!</p>
                           </div>
                        )}
                     </CardContent>
                  </Card>

                  <Card>
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <Clock className="h-5 w-5 text-orange-500" />
                           Recent Activity
                        </CardTitle>
                     </CardHeader>
                     <CardContent>
                        <div className="space-y-3">
                           <div className="flex items-center gap-2 text-sm">
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                              <span>Campaign created</span>
                              <span className="text-muted-foreground ml-auto">
                                 {campaign.createdAt
                                    ? new Date(campaign.createdAt).toLocaleDateString()
                                    : 'Unknown'}
                              </span>
                           </div>
                           {campaign.updatedAt && (
                              <div className="flex items-center gap-2 text-sm">
                                 <div className="w-2 h-2 bg-green-500 rounded-full" />
                                 <span>Last updated</span>
                                 <span className="text-muted-foreground ml-auto">
                                    {new Date(campaign.updatedAt).toLocaleDateString()}
                                 </span>
                              </div>
                           )}
                        </div>
                     </CardContent>
                  </Card>
               </div>
            </TabsContent>
         </Tabs>
      </div>
   );
}
