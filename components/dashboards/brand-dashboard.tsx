'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
   BarChart3,
   TrendingUp,
   Users,
   Calendar,
   CheckCircle,
   Clock,
   AlertTriangle,
   Eye,
   ThumbsUp,
   MessageSquare,
   Target,
   MousePointer,
   Activity,
} from 'lucide-react';
import { useAnalytics } from '@/hooks/use-analytics';
import { AnalyticsCharts } from '@/components/analytics/analytics-charts';

interface BrandDashboardProps {
   orgId: string;
}

export function BrandDashboard({ orgId }: BrandDashboardProps) {
   const { metrics, loading, error, trackEvent } = useAnalytics(orgId);

   // Mock data for campaigns and approvals (would come from separate APIs)
   const campaigns = [
      {
         id: '1',
         name: 'Summer Campaign 2024',
         status: 'active',
         progress: 75,
         creators: 5,
         contentCount: 24,
         budget: 15000,
         spent: 11250,
      },
      {
         id: '2',
         name: 'Product Launch',
         status: 'planning',
         progress: 30,
         creators: 3,
         contentCount: 8,
         budget: 8000,
         spent: 2400,
      },
   ];

   const pendingApprovals = [
      {
         id: '1',
         title: 'Social Media Post - Summer Vibes',
         creator: 'Sarah Johnson',
         creatorAvatar: '/avatars/sarah.jpg',
         campaign: 'Summer Campaign 2024',
         submittedAt: '2024-07-10',
         type: 'social',
      },
      {
         id: '2',
         title: 'Blog Post - Product Features',
         creator: 'Mike Chen',
         creatorAvatar: '/avatars/mike.jpg',
         campaign: 'Product Launch',
         submittedAt: '2024-07-08',
         type: 'blog',
      },
   ];

   if (loading) {
      return (
         <div className="space-y-6">
            <div className="flex items-center justify-between">
               <div>
                  <Skeleton className="h-8 w-48 mb-2" />
                  <Skeleton className="h-4 w-64" />
               </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
               {[...Array(4)].map((_, i) => (
                  <Card key={i}>
                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-4" />
                     </CardHeader>
                     <CardContent>
                        <Skeleton className="h-8 w-16 mb-2" />
                        <Skeleton className="h-3 w-32" />
                     </CardContent>
                  </Card>
               ))}
            </div>
         </div>
      );
   }

   if (error) {
      return (
         <div className="space-y-6">
            <div className="text-center py-8">
               <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
               <p className="text-red-600">Error loading analytics: {error}</p>
            </div>
         </div>
      );
   }

   return (
      <div className="space-y-6">
         {/* Header */}
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-3xl font-bold">Brand Dashboard</h1>
               <p className="text-muted-foreground">
                  Monitor campaigns, approve content, and track performance
               </p>
            </div>
            <Button>
               <BarChart3 className="mr-2 h-4 w-4" />
               View Analytics
            </Button>
         </div>

         {/* Key Metrics */}
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Impressions</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">
                     {metrics?.impressions.toLocaleString() || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">Total content impressions</p>
               </CardContent>
            </Card>
            <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Clicks</CardTitle>
                  <MousePointer className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">{metrics?.clicks.toLocaleString() || 0}</div>
                  <p className="text-xs text-muted-foreground">Total user interactions</p>
               </CardContent>
            </Card>
            <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">CTR</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">{metrics?.ctr.toFixed(2) || 0}%</div>
                  <p className="text-xs text-muted-foreground">Click-through rate</p>
               </CardContent>
            </Card>
            <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">ROI</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">{metrics?.roi.toFixed(1) || 0}%</div>
                  <p className="text-xs text-muted-foreground">Return on investment</p>
               </CardContent>
            </Card>
         </div>

         {/* Main Content */}
         <Tabs defaultValue="campaigns" className="space-y-4">
            <TabsList>
               <TabsTrigger value="campaigns">Campaign Summaries</TabsTrigger>
               <TabsTrigger value="approvals">Approval Queue</TabsTrigger>
               <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="campaigns" className="space-y-4">
               <Card>
                  <CardHeader>
                     <CardTitle>Campaign Performance</CardTitle>
                     <CardDescription>
                        Overview of all active campaigns and their progress
                     </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     {campaigns.map((campaign) => (
                        <div key={campaign.id} className="p-4 border rounded-lg space-y-4">
                           <div className="flex items-center justify-between">
                              <div>
                                 <h3 className="font-medium">{campaign.name}</h3>
                                 <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                                    <span>{campaign.creators} creators</span>
                                    <span>{campaign.contentCount} pieces</span>
                                    <Badge
                                       variant={
                                          campaign.status === 'active' ? 'default' : 'secondary'
                                       }
                                    >
                                       {campaign.status}
                                    </Badge>
                                 </div>
                              </div>
                              <Button variant="outline" size="sm">
                                 View Details
                              </Button>
                           </div>
                           <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                 <span>Progress</span>
                                 <span>{campaign.progress}%</span>
                              </div>
                              <Progress value={campaign.progress} className="w-full" />
                           </div>
                           <div className="flex justify-between text-sm">
                              <span>
                                 Budget: ${campaign.spent.toLocaleString()} / $
                                 {campaign.budget.toLocaleString()}
                              </span>
                              <span className="text-muted-foreground">
                                 {((campaign.spent / campaign.budget) * 100).toFixed(1)}% spent
                              </span>
                           </div>
                           <Progress
                              value={(campaign.spent / campaign.budget) * 100}
                              className="w-full"
                           />
                        </div>
                     ))}
                  </CardContent>
               </Card>
            </TabsContent>

            <TabsContent value="approvals" className="space-y-4">
               <Card>
                  <CardHeader>
                     <CardTitle>Content Approval Queue</CardTitle>
                     <CardDescription>
                        Review and approve content submissions from creators
                     </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     {pendingApprovals.map((item) => (
                        <div
                           key={item.id}
                           className="flex items-center space-x-4 p-4 border rounded-lg"
                        >
                           <Avatar>
                              <AvatarImage src={item.creatorAvatar} />
                              <AvatarFallback>
                                 {item.creator
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')}
                              </AvatarFallback>
                           </Avatar>
                           <div className="flex-1">
                              <h4 className="font-medium">{item.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                 {item.creator} • {item.campaign} • Submitted {item.submittedAt}
                              </p>
                           </div>
                           <Badge variant="outline">{item.type}</Badge>
                           <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                 <Eye className="mr-2 h-4 w-4" />
                                 Preview
                              </Button>
                              <Button size="sm">
                                 <CheckCircle className="mr-2 h-4 w-4" />
                                 Approve
                              </Button>
                           </div>
                        </div>
                     ))}
                     {pendingApprovals.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                           <CheckCircle className="mx-auto h-12 w-12 mb-4" />
                           <p>No pending approvals</p>
                        </div>
                     )}
                  </CardContent>
               </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
               {metrics && <AnalyticsCharts metrics={metrics} />}
            </TabsContent>
         </Tabs>
      </div>
   );
}
