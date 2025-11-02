'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckSquare, Clock, TrendingUp, AlertTriangle, Users, Calendar } from 'lucide-react';
import type { CampaignTask } from '@/types/campaign';

interface TaskAnalyticsProps {
   tasks: CampaignTask[];
}

export function TaskAnalytics({ tasks }: TaskAnalyticsProps) {
   const analytics = useMemo(() => {
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter((task) => task.status === 'DONE').length;
      const inProgressTasks = tasks.filter((task) => task.status === 'IN_PROGRESS').length;
      const overdueTasks = tasks.filter((task) => {
         if (!task.dueDate) return false;
         return new Date(task.dueDate) < new Date();
      }).length;

      const totalEstimatedHours = tasks.reduce((sum, task) => sum + (task.estimatedHours || 0), 0);
      const completedHours = tasks
         .filter((task) => task.status === 'DONE')
         .reduce((sum, task) => sum + (task.estimatedHours || 0), 0);

      const progressPercentage =
         totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      const timeProgressPercentage =
         totalEstimatedHours > 0 ? Math.round((completedHours / totalEstimatedHours) * 100) : 0;

      // Status breakdown
      const statusBreakdown = {
         TODO: tasks.filter((task) => task.status === 'TODO').length,
         IN_PROGRESS: tasks.filter((task) => task.status === 'IN_PROGRESS').length,
         REVIEW: tasks.filter((task) => task.status === 'REVIEW').length,
         DONE: tasks.filter((task) => task.status === 'DONE').length,
         CANCELLED: tasks.filter((task) => task.status === 'CANCELLED').length,
      };

      // Priority breakdown
      const priorityBreakdown = {
         NO_PRIORITY: tasks.filter((task) => task.priority === 'NO_PRIORITY').length,
         LOW: tasks.filter((task) => task.priority === 'LOW').length,
         MEDIUM: tasks.filter((task) => task.priority === 'MEDIUM').length,
         HIGH: tasks.filter((task) => task.priority === 'HIGH').length,
         URGENT: tasks.filter((task) => task.priority === 'URGENT').length,
      };

      // Assignee workload
      const assigneeWorkload = tasks.reduce(
         (acc, task) => {
            if (task.assignee) {
               const assigneeId = task.assignee.id;
               if (!acc[assigneeId]) {
                  acc[assigneeId] = {
                     name: task.assignee.name || 'Unknown',
                     total: 0,
                     completed: 0,
                     inProgress: 0,
                     overdue: 0,
                  };
               }
               acc[assigneeId].total++;
               if (task.status === 'DONE') acc[assigneeId].completed++;
               if (task.status === 'IN_PROGRESS') acc[assigneeId].inProgress++;
               if (task.dueDate && new Date(task.dueDate) < new Date()) {
                  acc[assigneeId].overdue++;
               }
            }
            return acc;
         },
         {} as Record<string, any>
      );

      // Timeline analysis
      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      const dueThisWeek = tasks.filter((task) => {
         if (!task.dueDate) return false;
         const dueDate = new Date(task.dueDate);
         return dueDate >= now && dueDate <= nextWeek;
      }).length;

      const dueThisMonth = tasks.filter((task) => {
         if (!task.dueDate) return false;
         const dueDate = new Date(task.dueDate);
         return dueDate >= now && dueDate <= nextMonth;
      }).length;

      return {
         totalTasks,
         completedTasks,
         inProgressTasks,
         overdueTasks,
         totalEstimatedHours,
         completedHours,
         progressPercentage,
         timeProgressPercentage,
         statusBreakdown,
         priorityBreakdown,
         assigneeWorkload,
         dueThisWeek,
         dueThisMonth,
      };
   }, [tasks]);

   const renderStatusBar = (status: string, count: number, total: number) => {
      const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
      const colorMap: Record<string, string> = {
         TODO: 'bg-gray-500',
         IN_PROGRESS: 'bg-blue-500',
         REVIEW: 'bg-yellow-500',
         DONE: 'bg-green-500',
         CANCELLED: 'bg-red-500',
      };

      return (
         <div className="space-y-2">
            <div className="flex justify-between items-center">
               <span className="text-sm font-medium">{status}</span>
               <span className="text-sm text-muted-foreground">{count} tasks</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
               <div
                  className={`h-2 rounded-full ${colorMap[status]}`}
                  style={{ width: `${percentage}%` }}
               />
            </div>
            <span className="text-xs text-muted-foreground">{percentage}%</span>
         </div>
      );
   };

   const renderPriorityBar = (priority: string, count: number, total: number) => {
      const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
      const colorMap: Record<string, string> = {
         NO_PRIORITY: 'bg-gray-400',
         LOW: 'bg-green-400',
         MEDIUM: 'bg-yellow-400',
         HIGH: 'bg-orange-400',
         URGENT: 'bg-red-500',
      };

      return (
         <div className="space-y-2">
            <div className="flex justify-between items-center">
               <span className="text-sm font-medium">{priority.replace('_', ' ')}</span>
               <span className="text-sm text-muted-foreground">{count} tasks</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
               <div
                  className={`h-2 rounded-full ${colorMap[priority]}`}
                  style={{ width: `${percentage}%` }}
               />
            </div>
            <span className="text-xs text-muted-foreground">{percentage}%</span>
         </div>
      );
   };

   return (
      <div className="space-y-6">
         <div>
            <h2 className="text-2xl font-bold">Task Analytics</h2>
            <p className="text-muted-foreground">Track progress and performance metrics</p>
         </div>

         {/* Overview Cards */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
               <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                     <CheckSquare className="h-5 w-5 text-blue-500" />
                     <div>
                        <p className="text-sm text-muted-foreground">Total Progress</p>
                        <p className="text-xl font-bold">{analytics.progressPercentage}%</p>
                     </div>
                  </div>
                  <Progress value={analytics.progressPercentage} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                     {analytics.completedTasks} of {analytics.totalTasks} tasks completed
                  </p>
               </CardContent>
            </Card>

            <Card>
               <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                     <Clock className="h-5 w-5 text-green-500" />
                     <div>
                        <p className="text-sm text-muted-foreground">Time Progress</p>
                        <p className="text-xl font-bold">{analytics.timeProgressPercentage}%</p>
                     </div>
                  </div>
                  <Progress value={analytics.timeProgressPercentage} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                     {analytics.completedHours}h of {analytics.totalEstimatedHours}h completed
                  </p>
               </CardContent>
            </Card>

            <Card>
               <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                     <AlertTriangle className="h-5 w-5 text-red-500" />
                     <div>
                        <p className="text-sm text-muted-foreground">Overdue Tasks</p>
                        <p className="text-xl font-bold">{analytics.overdueTasks}</p>
                     </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                     {analytics.overdueTasks > 0 ? 'Requires attention' : 'All on track'}
                  </p>
               </CardContent>
            </Card>

            <Card>
               <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                     <TrendingUp className="h-5 w-5 text-purple-500" />
                     <div>
                        <p className="text-sm text-muted-foreground">In Progress</p>
                        <p className="text-xl font-bold">{analytics.inProgressTasks}</p>
                     </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Currently being worked on</p>
               </CardContent>
            </Card>
         </div>

         {/* Detailed Analytics */}
         <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
               <TabsTrigger value="overview">Overview</TabsTrigger>
               <TabsTrigger value="status">Status Breakdown</TabsTrigger>
               <TabsTrigger value="priority">Priority Analysis</TabsTrigger>
               <TabsTrigger value="workload">Team Workload</TabsTrigger>
               <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                     <CardHeader>
                        <CardTitle>Task Status Distribution</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        {Object.entries(analytics.statusBreakdown).map(([status, count]) =>
                           renderStatusBar(status, count, analytics.totalTasks)
                        )}
                     </CardContent>
                  </Card>

                  <Card>
                     <CardHeader>
                        <CardTitle>Priority Distribution</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        {Object.entries(analytics.priorityBreakdown).map(([priority, count]) =>
                           renderPriorityBar(priority, count, analytics.totalTasks)
                        )}
                     </CardContent>
                  </Card>
               </div>
            </TabsContent>

            <TabsContent value="status" className="space-y-4">
               <Card>
                  <CardHeader>
                     <CardTitle>Detailed Status Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-6">
                        {Object.entries(analytics.statusBreakdown).map(([status, count]) => {
                           const percentage =
                              analytics.totalTasks > 0
                                 ? Math.round((count / analytics.totalTasks) * 100)
                                 : 0;
                           return (
                              <div key={status} className="flex items-center justify-between">
                                 <div className="flex items-center gap-3">
                                    <Badge variant="outline">{status.replace('_', ' ')}</Badge>
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

            <TabsContent value="priority" className="space-y-4">
               <Card>
                  <CardHeader>
                     <CardTitle>Priority Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-6">
                        {Object.entries(analytics.priorityBreakdown).map(([priority, count]) => {
                           const percentage =
                              analytics.totalTasks > 0
                                 ? Math.round((count / analytics.totalTasks) * 100)
                                 : 0;
                           return (
                              <div key={priority} className="flex items-center justify-between">
                                 <div className="flex items-center gap-3">
                                    <Badge variant="outline">{priority.replace('_', ' ')}</Badge>
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

            <TabsContent value="workload" className="space-y-4">
               <Card>
                  <CardHeader>
                     <CardTitle>Team Workload Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                     {Object.keys(analytics.assigneeWorkload).length > 0 ? (
                        <div className="space-y-4">
                           {Object.entries(analytics.assigneeWorkload).map(([assigneeId, data]) => (
                              <div key={assigneeId} className="p-4 border rounded-lg">
                                 <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-medium">{data.name}</h4>
                                    <Badge variant="secondary">{data.total} tasks</Badge>
                                 </div>
                                 <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                       <span className="text-muted-foreground">Completed:</span>
                                       <span className="ml-2 font-medium text-green-600">
                                          {data.completed}
                                       </span>
                                    </div>
                                    <div>
                                       <span className="text-muted-foreground">In Progress:</span>
                                       <span className="ml-2 font-medium text-blue-600">
                                          {data.inProgress}
                                       </span>
                                    </div>
                                    <div>
                                       <span className="text-muted-foreground">Overdue:</span>
                                       <span className="ml-2 font-medium text-red-600">
                                          {data.overdue}
                                       </span>
                                    </div>
                                 </div>
                                 <Progress
                                    value={
                                       data.total > 0
                                          ? Math.round((data.completed / data.total) * 100)
                                          : 0
                                    }
                                    className="mt-2"
                                 />
                              </div>
                           ))}
                        </div>
                     ) : (
                        <div className="text-center py-8 text-muted-foreground">
                           <Users className="h-12 w-12 mx-auto mb-4" />
                           <p>No assigned tasks yet</p>
                        </div>
                     )}
                  </CardContent>
               </Card>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                     <CardHeader>
                        <CardTitle>Upcoming Deadlines</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-blue-500" />
                              <span className="text-sm">Due this week</span>
                           </div>
                           <Badge variant="secondary">{analytics.dueThisWeek}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-orange-500" />
                              <span className="text-sm">Due this month</span>
                           </div>
                           <Badge variant="secondary">{analytics.dueThisMonth}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                              <span className="text-sm">Overdue</span>
                           </div>
                           <Badge variant="destructive">{analytics.overdueTasks}</Badge>
                        </div>
                     </CardContent>
                  </Card>

                  <Card>
                     <CardHeader>
                        <CardTitle>Time Tracking</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                           <span className="text-sm">Total Estimated</span>
                           <span className="font-medium">{analytics.totalEstimatedHours}h</span>
                        </div>
                        <div className="flex items-center justify-between">
                           <span className="text-sm">Completed</span>
                           <span className="font-medium text-green-600">
                              {analytics.completedHours}h
                           </span>
                        </div>
                        <div className="flex items-center justify-between">
                           <span className="text-sm">Remaining</span>
                           <span className="font-medium text-orange-600">
                              {analytics.totalEstimatedHours - analytics.completedHours}h
                           </span>
                        </div>
                        <Progress value={analytics.timeProgressPercentage} className="mt-2" />
                     </CardContent>
                  </Card>
               </div>
            </TabsContent>
         </Tabs>
      </div>
   );
}
