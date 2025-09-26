'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table';
import {
   Users,
   Building,
   Settings,
   Shield,
   Activity,
   UserPlus,
   Crown,
   AlertTriangle,
   CheckCircle,
   Clock,
} from 'lucide-react';

interface AdminDashboardProps {
   orgId: string;
}

export function AdminDashboard({ orgId }: AdminDashboardProps) {
   const t = useTranslations('dashboard');

   // Mock data - in real app, this would come from API
   const organizationStats = {
      totalUsers: 45,
      activeUsers: 38,
      totalCampaigns: 12,
      activeCampaigns: 8,
      totalContent: 156,
      pendingApprovals: 23,
   };

   const users = [
      {
         id: '1',
         name: 'Sarah Johnson',
         email: 'sarah@company.com',
         role: 'CREATOR',
         status: 'active',
         lastActive: '2024-07-10',
         campaigns: 3,
      },
      {
         id: '2',
         name: 'Mike Chen',
         email: 'mike@company.com',
         role: 'BRAND_OWNER',
         status: 'active',
         lastActive: '2024-07-09',
         campaigns: 5,
      },
      {
         id: '3',
         name: 'Emma Davis',
         email: 'emma@company.com',
         role: 'CREATOR',
         status: 'inactive',
         lastActive: '2024-06-15',
         campaigns: 2,
      },
   ];

   const pendingInvites = [
      {
         id: '1',
         email: 'john.doe@company.com',
         role: 'CREATOR',
         invitedBy: 'Sarah Johnson',
         invitedAt: '2024-07-08',
         status: 'pending',
      },
      {
         id: '2',
         email: 'jane.smith@agency.com',
         role: 'BRAND_OWNER',
         invitedBy: 'Mike Chen',
         invitedAt: '2024-07-07',
         status: 'pending',
      },
   ];

   const systemAlerts = [
      {
         id: '1',
         type: 'warning',
         message: '5 users have not logged in for 30+ days',
         timestamp: '2024-07-10T10:30:00Z',
      },
      {
         id: '2',
         type: 'info',
         message: 'Monthly analytics report is ready',
         timestamp: '2024-07-10T09:00:00Z',
      },
   ];

   return (
      <div className="space-y-6">
         {/* Header */}
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-3xl font-bold">{t('admin_title')}</h1>
               <p className="text-muted-foreground">{t('admin_description')}</p>
            </div>
            <Button>
               <Settings className="mr-2 h-4 w-4" />
               {t('system_settings')}
            </Button>
         </div>

         {/* Organization Overview */}
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('total_users')}</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">{organizationStats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                     {organizationStats.activeUsers} {t('active_users')}
                  </p>
               </CardContent>
            </Card>
            <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('active_campaigns')}</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">{organizationStats.activeCampaigns}</div>
                  <p className="text-xs text-muted-foreground">
                     of {organizationStats.totalCampaigns} total
                  </p>
               </CardContent>
            </Card>
            <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('content_pieces')}</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">{organizationStats.totalContent}</div>
                  <p className="text-xs text-muted-foreground">+12% this month</p>
               </CardContent>
            </Card>
            <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('pending_approvals')}</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">{organizationStats.pendingApprovals}</div>
                  <p className="text-xs text-muted-foreground">{t('requires_attention')}</p>
               </CardContent>
            </Card>
         </div>

         {/* Main Content */}
         <Tabs defaultValue="users" className="space-y-4">
            <TabsList>
               <TabsTrigger value="users">{t('user_management')}</TabsTrigger>
               <TabsTrigger value="organization">{t('organization')}</TabsTrigger>
               <TabsTrigger value="system">{t('system')}</TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-4">
               <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                     <CardHeader>
                        <CardTitle>{t('team_members')}</CardTitle>
                        <CardDescription>{t('manage_user_roles')}</CardDescription>
                     </CardHeader>
                     <CardContent>
                        <Table>
                           <TableHeader>
                              <TableRow>
                                 <TableHead>{t('user')}</TableHead>
                                 <TableHead>{t('role')}</TableHead>
                                 <TableHead>{t('status')}</TableHead>
                                 <TableHead>{t('actions')}</TableHead>
                              </TableRow>
                           </TableHeader>
                           <TableBody>
                              {users.map((user) => (
                                 <TableRow key={user.id}>
                                    <TableCell>
                                       <div className="flex items-center space-x-2">
                                          <Avatar className="h-8 w-8">
                                             <AvatarFallback>
                                                {user.name
                                                   .split(' ')
                                                   .map((n) => n[0])
                                                   .join('')}
                                             </AvatarFallback>
                                          </Avatar>
                                          <div>
                                             <p className="font-medium text-sm">{user.name}</p>
                                             <p className="text-xs text-muted-foreground">
                                                {user.email}
                                             </p>
                                          </div>
                                       </div>
                                    </TableCell>
                                    <TableCell>
                                       <Badge
                                          variant={user.role === 'ADMIN' ? 'default' : 'secondary'}
                                       >
                                          {user.role === 'BRAND_OWNER'
                                             ? t('brand_owner')
                                             : user.role === 'CREATOR'
                                               ? t('creator')
                                               : t('admin')}
                                       </Badge>
                                    </TableCell>
                                    <TableCell>
                                       <Badge
                                          variant={
                                             user.status === 'active' ? 'default' : 'secondary'
                                          }
                                       >
                                          {user.status}
                                       </Badge>
                                    </TableCell>
                                    <TableCell>
                                       <Button variant="outline" size="sm">
                                          {t('edit')}
                                       </Button>
                                    </TableCell>
                                 </TableRow>
                              ))}
                           </TableBody>
                        </Table>
                     </CardContent>
                  </Card>

                  <Card>
                     <CardHeader>
                        <CardTitle>{t('pending_invites')}</CardTitle>
                        <CardDescription>{t('users_waiting_join')}</CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        {pendingInvites.map((invite) => (
                           <div
                              key={invite.id}
                              className="flex items-center justify-between p-3 border rounded-lg"
                           >
                              <div>
                                 <p className="font-medium text-sm">{invite.email}</p>
                                 <p className="text-xs text-muted-foreground">
                                    {t('invited_by')} {invite.invitedBy} • {invite.invitedAt}
                                 </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                 <Badge variant="outline">{invite.role}</Badge>
                                 <Button size="sm" variant="outline">
                                    {t('resend')}
                                 </Button>
                              </div>
                           </div>
                        ))}
                        <Button className="w-full">
                           <UserPlus className="mr-2 h-4 w-4" />
                           {t('invite_new_user')}
                        </Button>
                     </CardContent>
                  </Card>
               </div>
            </TabsContent>

            <TabsContent value="organization" className="space-y-4">
               <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                     <CardHeader>
                        <CardTitle>Organization Settings</CardTitle>
                        <CardDescription>Configure organization-wide settings</CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <div className="space-y-2">
                           <label className="text-sm font-medium">Organization Name</label>
                           <p className="text-sm text-muted-foreground">Acme Marketing Inc.</p>
                        </div>
                        <div className="space-y-2">
                           <label className="text-sm font-medium">Default User Role</label>
                           <p className="text-sm text-muted-foreground">Creator</p>
                        </div>
                        <div className="space-y-2">
                           <label className="text-sm font-medium">Content Approval Required</label>
                           <p className="text-sm text-muted-foreground">Yes</p>
                        </div>
                        <Button variant="outline">
                           <Settings className="mr-2 h-4 w-4" />
                           Edit Settings
                        </Button>
                     </CardContent>
                  </Card>

                  <Card>
                     <CardHeader>
                        <CardTitle>Role Permissions</CardTitle>
                        <CardDescription>Manage what each role can access</CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <div className="space-y-3">
                           <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                 <Crown className="h-4 w-4 text-yellow-500" />
                                 <span className="font-medium">Admin</span>
                              </div>
                              <Badge>Full Access</Badge>
                           </div>
                           <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                 <Shield className="h-4 w-4 text-blue-500" />
                                 <span className="font-medium">Brand Owner</span>
                              </div>
                              <Badge variant="secondary">Limited Access</Badge>
                           </div>
                           <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                 <Users className="h-4 w-4 text-green-500" />
                                 <span className="font-medium">Creator</span>
                              </div>
                              <Badge variant="outline">Content Access</Badge>
                           </div>
                        </div>
                        <Button variant="outline">
                           <Shield className="mr-2 h-4 w-4" />
                           Manage Permissions
                        </Button>
                     </CardContent>
                  </Card>
               </div>
            </TabsContent>

            <TabsContent value="system" className="space-y-4">
               <Card>
                  <CardHeader>
                     <CardTitle>System Alerts</CardTitle>
                     <CardDescription>Important notifications and system status</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     {systemAlerts.map((alert) => (
                        <div
                           key={alert.id}
                           className="flex items-start space-x-3 p-3 border rounded-lg"
                        >
                           {alert.type === 'warning' ? (
                              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                           ) : (
                              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                           )}
                           <div className="flex-1">
                              <p className="font-medium text-sm">{alert.message}</p>
                              <p className="text-xs text-muted-foreground">
                                 {new Date(alert.timestamp).toLocaleString()}
                              </p>
                           </div>
                           <Button variant="outline" size="sm">
                              View Details
                           </Button>
                        </div>
                     ))}
                  </CardContent>
               </Card>

               <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                     <CardHeader>
                        <CardTitle className="text-base">System Health</CardTitle>
                     </CardHeader>
                     <CardContent>
                        <div className="flex items-center space-x-2">
                           <CheckCircle className="h-5 w-5 text-green-500" />
                           <span className="text-sm">All systems operational</span>
                        </div>
                     </CardContent>
                  </Card>
                  <Card>
                     <CardHeader>
                        <CardTitle className="text-base">API Usage</CardTitle>
                     </CardHeader>
                     <CardContent>
                        <p className="text-2xl font-bold">94%</p>
                        <p className="text-xs text-muted-foreground">of monthly limit</p>
                     </CardContent>
                  </Card>
                  <Card>
                     <CardHeader>
                        <CardTitle className="text-base">Storage</CardTitle>
                     </CardHeader>
                     <CardContent>
                        <p className="text-2xl font-bold">67%</p>
                        <p className="text-xs text-muted-foreground">of allocated space</p>
                     </CardContent>
                  </Card>
               </div>
            </TabsContent>
         </Tabs>
      </div>
   );
}
