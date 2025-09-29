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
   User,
   CheckSquare,
   Calendar,
   Mail,
   Phone,
   MapPin,
   Clock,
   ArrowLeft,
   Crown,
   Shield,
   Users,
   Eye,
} from 'lucide-react';
import type { CampaignMember, CampaignTask } from '@/types/campaign';

interface MemberDetailViewProps {
   member: CampaignMember;
   onUpdateRole: (memberId: string, role: CampaignMember['role']) => void;
   onRemove: (memberId: string) => void;
   onBack: () => void;
   onEdit: () => void;
}

const roleConfig = {
   OWNER: {
      label: 'Owner',
      color: 'bg-purple-500',
      icon: Crown,
      description: 'Full campaign control',
   },
   MANAGER: {
      label: 'Manager',
      color: 'bg-blue-500',
      icon: Shield,
      description: 'Manage tasks and members',
   },
   MEMBER: {
      label: 'Member',
      color: 'bg-green-500',
      icon: Users,
      description: 'Work on assigned tasks',
   },
   VIEWER: {
      label: 'Viewer',
      color: 'bg-gray-500',
      icon: Eye,
      description: 'View campaign information',
   },
};

const taskStatusConfig = {
   TODO: { label: 'To Do', color: 'bg-gray-500', icon: '⏳' },
   IN_PROGRESS: { label: 'In Progress', color: 'bg-blue-500', icon: '🔄' },
   REVIEW: { label: 'Review', color: 'bg-yellow-500', icon: '👀' },
   DONE: { label: 'Done', color: 'bg-green-500', icon: '✅' },
   CANCELLED: { label: 'Cancelled', color: 'bg-red-500', icon: '❌' },
};

export function MemberDetailView({
   member,
   onUpdateRole,
   onRemove,
   onBack,
   onEdit,
}: MemberDetailViewProps) {
   const [activeTab, setActiveTab] = useState('overview');

   const formatDate = (date: Date | string | null) => {
      if (!date) return 'Not set';
      return new Date(date).toLocaleDateString('en-US', {
         year: 'numeric',
         month: 'long',
         day: 'numeric',
      });
   };

   const getAssignedTasks = () => {
      // In real app, this would come from the campaign's tasks filtered by assignee
      return member.assignedTasks || [];
   };

   const getTaskStats = () => {
      const tasks = getAssignedTasks();
      return {
         total: tasks.length,
         todo: tasks.filter((task) => task.status === 'TODO').length,
         inProgress: tasks.filter((task) => task.status === 'IN_PROGRESS').length,
         review: tasks.filter((task) => task.status === 'REVIEW').length,
         done: tasks.filter((task) => task.status === 'DONE').length,
         cancelled: tasks.filter((task) => task.status === 'CANCELLED').length,
      };
   };

   const calculateProgress = () => {
      const tasks = getAssignedTasks();
      if (tasks.length === 0) return 0;
      const completedTasks = tasks.filter((task) => task.status === 'DONE').length;
      return Math.round((completedTasks / tasks.length) * 100);
   };

   const renderRoleBadge = (role: CampaignMember['role']) => {
      const config = roleConfig[role];
      const IconComponent = config.icon;
      return (
         <Badge className={`${config.color} text-white`}>
            <IconComponent className="h-3 w-3 mr-1" />
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

   const assignedTasks = getAssignedTasks();
   const taskStats = getTaskStats();
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
               <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                     <AvatarImage src={member.user.image || ''} />
                     <AvatarFallback className="text-lg">
                        {member.user.name?.slice(0, 2).toUpperCase() || 'U'}
                     </AvatarFallback>
                  </Avatar>
                  <div>
                     <h1 className="text-2xl font-bold">{member.user.name || 'Unknown User'}</h1>
                     <div className="flex items-center gap-2 mt-1">
                        {renderRoleBadge(member.role)}
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">{member.user.email}</span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">
                           Joined {formatDate(member.createdAt)}
                        </span>
                     </div>
                  </div>
               </div>
            </div>
            <div className="flex items-center gap-2">
               <Button variant="outline" onClick={onEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Role
               </Button>
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                     <DropdownMenuItem onClick={onEdit}>Change Role</DropdownMenuItem>
                     <DropdownMenuItem
                        onClick={() => onRemove(member.id)}
                        className="text-destructive"
                     >
                        Remove Member
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
                        <p className="text-sm text-muted-foreground">Task Progress</p>
                        <p className="text-xl font-bold">{progress}%</p>
                     </div>
                  </div>
                  <Progress value={progress} className="mt-2" />
               </CardContent>
            </Card>

            <Card>
               <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                     <CheckSquare className="h-5 w-5 text-green-500" />
                     <div>
                        <p className="text-sm text-muted-foreground">Assigned Tasks</p>
                        <p className="text-xl font-bold">{taskStats.total}</p>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                     <CheckSquare className="h-5 w-5 text-green-500" />
                     <div>
                        <p className="text-sm text-muted-foreground">Completed</p>
                        <p className="text-xl font-bold">{taskStats.done}</p>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                     <Clock className="h-5 w-5 text-orange-500" />
                     <div>
                        <p className="text-sm text-muted-foreground">Member Since</p>
                        <p className="text-sm font-medium">{formatDate(member.createdAt)}</p>
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
               <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                     <CardHeader>
                        <CardTitle>👤 Member Information</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <div className="space-y-2">
                           <div className="flex justify-between">
                              <span className="text-muted-foreground">Name:</span>
                              <span className="font-medium">{member.user.name || 'Unknown'}</span>
                           </div>
                           <div className="flex justify-between">
                              <span className="text-muted-foreground">Email:</span>
                              <span className="font-medium">{member.user.email}</span>
                           </div>
                           <div className="flex justify-between">
                              <span className="text-muted-foreground">Role:</span>
                              {renderRoleBadge(member.role)}
                           </div>
                           <div className="flex justify-between">
                              <span className="text-muted-foreground">Joined:</span>
                              <span>{formatDate(member.createdAt)}</span>
                           </div>
                           <div className="flex justify-between">
                              <span className="text-muted-foreground">Last Active:</span>
                              <span>{formatDate(member.updatedAt)}</span>
                           </div>
                        </div>
                     </CardContent>
                  </Card>

                  <Card>
                     <CardHeader>
                        <CardTitle>📊 Task Statistics</CardTitle>
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

               <Card>
                  <CardHeader>
                     <CardTitle>🔑 Role Permissions</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(roleConfig).map(([role, config]) => {
                           const IconComponent = config.icon;
                           const isCurrentRole = member.role === role;
                           return (
                              <div
                                 key={role}
                                 className={`p-4 border rounded-lg ${
                                    isCurrentRole
                                       ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                                       : 'border-gray-200'
                                 }`}
                              >
                                 <div className="flex items-center gap-3">
                                    <IconComponent
                                       className={`h-5 w-5 ${isCurrentRole ? 'text-blue-500' : 'text-gray-400'}`}
                                    />
                                    <div>
                                       <h4
                                          className={`font-medium ${isCurrentRole ? 'text-blue-700 dark:text-blue-300' : ''}`}
                                       >
                                          {config.label}
                                       </h4>
                                       <p className="text-sm text-muted-foreground">
                                          {config.description}
                                       </p>
                                    </div>
                                    {isCurrentRole && (
                                       <Badge
                                          variant="outline"
                                          className="border-blue-500 text-blue-700 dark:text-blue-300"
                                       >
                                          Current
                                       </Badge>
                                    )}
                                 </div>
                              </div>
                           );
                        })}
                     </div>
                  </CardContent>
               </Card>
            </TabsContent>

            <TabsContent value="tasks" className="space-y-4">
               <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">📋 Assigned Tasks ({taskStats.total})</h3>
                  <Button variant="outline" size="sm">
                     <CheckSquare className="h-4 w-4 mr-2" />
                     View All Tasks
                  </Button>
               </div>

               <div className="space-y-3">
                  {assignedTasks.length > 0 ? (
                     assignedTasks.map(renderTaskItem)
                  ) : (
                     <div className="text-center py-8">
                        <CheckSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h4 className="font-medium mb-2">No tasks assigned</h4>
                        <p className="text-muted-foreground mb-4">
                           This member hasn't been assigned any tasks yet
                        </p>
                        <Button variant="outline">
                           <CheckSquare className="h-4 w-4 mr-2" />
                           Assign Tasks
                        </Button>
                     </div>
                  )}
               </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
               <Card>
                  <CardHeader>
                     <CardTitle>📝 Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="text-center py-8 text-muted-foreground">
                        <Clock className="h-12 w-12 mx-auto mb-4" />
                        <p>Activity tracking coming soon</p>
                        <p className="text-sm">
                           Track member actions, task updates, and contributions
                        </p>
                     </div>
                  </CardContent>
               </Card>
            </TabsContent>
         </Tabs>
      </div>
   );
}
