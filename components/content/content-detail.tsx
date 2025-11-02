'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
   ArrowLeft,
   Edit,
   Trash2,
   Eye,
   Calendar,
   FileText,
   BarChart3,
   TrendingUp,
   Users,
   Clock,
} from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

interface Content {
   id: string;
   title: string;
   body: string | null;
   status: string;
   createdAt: Date | string;
   updatedAt: Date | string;
   campaign: {
      id: string;
      name: string;
   };
   assets: any[];
}

interface ContentDetailProps {
   content: Content;
}

export function ContentDetail({ content }: ContentDetailProps) {
   const params = useParams();
   const orgId = params.orgId as string;
   const [loading, setLoading] = useState(false);
   const [activeTab, setActiveTab] = useState('overview');

   const handleDelete = async () => {
      if (!confirm('Are you sure you want to delete this content? This action cannot be undone.')) {
         return;
      }

      setLoading(true);
      try {
         const response = await fetch(`/api/${orgId}/content/${content.id}`, {
            method: 'DELETE',
         });

         if (response.ok) {
            toast.success('Content deleted successfully');
            window.location.href = `/${orgId}/content`;
         } else {
            const error = await response.json();
            toast.error(error.error || 'Failed to delete content');
         }
      } catch (error) {
         console.error('Error deleting content:', error);
         toast.error('An unexpected error occurred');
      } finally {
         setLoading(false);
      }
   };

   const createdDate = new Date(content.createdAt);
   const updatedDate = new Date(content.updatedAt);

   const getStatusColor = (status: string) => {
      switch (status) {
         case 'DRAFT':
            return 'secondary';
         case 'SUBMITTED':
            return 'default';
         case 'APPROVED':
            return 'default';
         case 'PUBLISHED':
            return 'default';
         case 'REJECTED':
            return 'destructive';
         default:
            return 'secondary';
      }
   };

   const getStatusIcon = (status: string) => {
      switch (status) {
         case 'DRAFT':
            return '📝';
         case 'SUBMITTED':
            return '📤';
         case 'APPROVED':
            return '✅';
         case 'PUBLISHED':
            return '🚀';
         case 'REJECTED':
            return '❌';
         default:
            return '📄';
      }
   };

   const getContentStats = () => {
      // Mock stats - in real app, these would come from analytics API
      return {
         views: Math.floor(Math.random() * 1000) + 100,
         engagement: Math.floor(Math.random() * 100) + 10,
         shares: Math.floor(Math.random() * 50) + 5,
         comments: Math.floor(Math.random() * 20) + 2,
      };
   };

   const contentStats = getContentStats();

   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
               <Link href={`/${orgId}/content`}>
                  <Button variant="ghost" size="sm">
                     <ArrowLeft className="h-4 w-4 mr-2" />
                     Back to Content
                  </Button>
               </Link>
               <div>
                  <h1 className="text-3xl font-bold">{content.title}</h1>
                  <div className="flex items-center gap-2 mt-2">
                     <span>{getStatusIcon(content.status)}</span>
                     <Badge variant={getStatusColor(content.status) as any}>{content.status}</Badge>
                     <span className="text-muted-foreground">•</span>
                     <span className="text-muted-foreground">{content.campaign.name}</span>
                     <span className="text-muted-foreground">•</span>
                     <span className="text-muted-foreground">
                        Created {formatDistanceToNow(createdDate, { addSuffix: true })}
                     </span>
                  </div>
               </div>
            </div>
            <div className="flex items-center gap-2">
               <Button variant="outline" asChild>
                  <Link href={`/${orgId}/content/${content.id}/edit`}>
                     <Edit className="h-4 w-4 mr-2" />
                     Edit
                  </Link>
               </Button>
               <Button variant="destructive" onClick={handleDelete} disabled={loading}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  {loading ? 'Deleting...' : 'Delete'}
               </Button>
            </div>
         </div>

         {/* Overview Cards */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
               <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                     <Eye className="h-5 w-5 text-blue-500" />
                     <div>
                        <p className="text-sm text-muted-foreground">Views</p>
                        <p className="text-xl font-bold">{contentStats.views}</p>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                     <TrendingUp className="h-5 w-5 text-green-500" />
                     <div>
                        <p className="text-sm text-muted-foreground">Engagement</p>
                        <p className="text-xl font-bold">{contentStats.engagement}%</p>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                     <Users className="h-5 w-5 text-purple-500" />
                     <div>
                        <p className="text-sm text-muted-foreground">Shares</p>
                        <p className="text-xl font-bold">{contentStats.shares}</p>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                     <Clock className="h-5 w-5 text-orange-500" />
                     <div>
                        <p className="text-sm text-muted-foreground">Last Updated</p>
                        <p className="text-sm font-medium">
                           {formatDistanceToNow(updatedDate, { addSuffix: true })}
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
               <TabsTrigger value="content">Content</TabsTrigger>
               <TabsTrigger value="analytics">Analytics</TabsTrigger>
               <TabsTrigger value="assets">Assets ({content.assets?.length || 0})</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                     <CardHeader>
                        <CardTitle>📋 Content Information</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <div className="space-y-2">
                           <div className="flex justify-between">
                              <span className="text-muted-foreground">Title:</span>
                              <span className="font-medium">{content.title}</span>
                           </div>
                           <div className="flex justify-between">
                              <span className="text-muted-foreground">Status:</span>
                              <Badge variant={getStatusColor(content.status) as any}>
                                 {content.status}
                              </Badge>
                           </div>
                           <div className="flex justify-between">
                              <span className="text-muted-foreground">Campaign:</span>
                              <Link
                                 href={`/${orgId}/campaigns/${content.campaign.id}`}
                                 className="text-blue-600 hover:underline"
                              >
                                 {content.campaign.name}
                              </Link>
                           </div>
                           <div className="flex justify-between">
                              <span className="text-muted-foreground">Created:</span>
                              <span>{createdDate.toLocaleDateString()}</span>
                           </div>
                           <div className="flex justify-between">
                              <span className="text-muted-foreground">Last Updated:</span>
                              <span>{updatedDate.toLocaleDateString()}</span>
                           </div>
                        </div>
                     </CardContent>
                  </Card>

                  <Card>
                     <CardHeader>
                        <CardTitle>📊 Quick Stats</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <div className="space-y-3">
                           <div className="flex justify-between items-center">
                              <span className="text-sm">Views</span>
                              <span className="text-sm font-medium">{contentStats.views}</span>
                           </div>
                           <div className="flex justify-between items-center">
                              <span className="text-sm">Engagement Rate</span>
                              <span className="text-sm font-medium">
                                 {contentStats.engagement}%
                              </span>
                           </div>
                           <div className="flex justify-between items-center">
                              <span className="text-sm">Shares</span>
                              <span className="text-sm font-medium">{contentStats.shares}</span>
                           </div>
                           <div className="flex justify-between items-center">
                              <span className="text-sm">Comments</span>
                              <span className="text-sm font-medium">{contentStats.comments}</span>
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-4">
               <Card>
                  <CardHeader>
                     <CardTitle>📄 Content Body</CardTitle>
                  </CardHeader>
                  <CardContent>
                     {content.body ? (
                        <div
                           className="prose dark:prose-invert max-w-none"
                           dangerouslySetInnerHTML={{ __html: content.body }}
                        />
                     ) : (
                        <div className="text-center py-8 text-muted-foreground">
                           <FileText className="h-12 w-12 mx-auto mb-4" />
                           <p>No content body available</p>
                        </div>
                     )}
                  </CardContent>
               </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <BarChart3 className="h-5 w-5" />
                           Performance Metrics
                        </CardTitle>
                     </CardHeader>
                     <CardContent>
                        <div className="space-y-4">
                           <div className="flex justify-between items-center">
                              <span className="text-sm">Views</span>
                              <div className="flex items-center gap-2">
                                 <div className="w-32 bg-gray-200 rounded-full h-2">
                                    <div
                                       className="bg-blue-600 h-2 rounded-full"
                                       style={{ width: `${(contentStats.views / 1000) * 100}%` }}
                                    ></div>
                                 </div>
                                 <span className="text-sm font-medium">{contentStats.views}</span>
                              </div>
                           </div>
                           <div className="flex justify-between items-center">
                              <span className="text-sm">Engagement</span>
                              <div className="flex items-center gap-2">
                                 <div className="w-32 bg-gray-200 rounded-full h-2">
                                    <div
                                       className="bg-green-600 h-2 rounded-full"
                                       style={{ width: `${contentStats.engagement}%` }}
                                    ></div>
                                 </div>
                                 <span className="text-sm font-medium">
                                    {contentStats.engagement}%
                                 </span>
                              </div>
                           </div>
                           <div className="flex justify-between items-center">
                              <span className="text-sm">Shares</span>
                              <div className="flex items-center gap-2">
                                 <div className="w-32 bg-gray-200 rounded-full h-2">
                                    <div
                                       className="bg-purple-600 h-2 rounded-full"
                                       style={{ width: `${(contentStats.shares / 50) * 100}%` }}
                                    ></div>
                                 </div>
                                 <span className="text-sm font-medium">{contentStats.shares}</span>
                              </div>
                           </div>
                        </div>
                     </CardContent>
                  </Card>

                  <Card>
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <TrendingUp className="h-5 w-5" />
                           Content Timeline
                        </CardTitle>
                     </CardHeader>
                     <CardContent>
                        <div className="space-y-4">
                           <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Created</span>
                              <span className="font-medium">
                                 {createdDate.toLocaleDateString()}
                              </span>
                           </div>
                           <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Last Updated</span>
                              <span className="font-medium">
                                 {updatedDate.toLocaleDateString()}
                              </span>
                           </div>
                           <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Age</span>
                              <span className="font-medium">
                                 {formatDistanceToNow(createdDate)}
                              </span>
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               </div>

               <Card>
                  <CardHeader>
                     <CardTitle>📈 Engagement Trends</CardTitle>
                     <CardDescription>Content performance over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                     <div className="text-center py-8 text-muted-foreground">
                        <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                        <p>Detailed analytics charts coming soon</p>
                        <p className="text-sm">
                           Track views, engagement, and conversion metrics over time
                        </p>
                     </div>
                  </CardContent>
               </Card>
            </TabsContent>

            <TabsContent value="assets" className="space-y-4">
               <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">📎 Attached Assets</h3>
                  <Button variant="outline" size="sm">
                     <FileText className="h-4 w-4 mr-2" />
                     Add Asset
                  </Button>
               </div>

               {content.assets && content.assets.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     {content.assets.map((asset: any) => (
                        <Card key={asset.id}>
                           <CardContent className="p-4">
                              <div className="flex items-center gap-3">
                                 <FileText className="h-8 w-8 text-blue-500" />
                                 <div>
                                    <h4 className="font-medium">
                                       {asset.name || 'Untitled Asset'}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                       {asset.type || 'Unknown type'}
                                    </p>
                                 </div>
                              </div>
                           </CardContent>
                        </Card>
                     ))}
                  </div>
               ) : (
                  <div className="text-center py-8">
                     <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                     <h4 className="font-medium mb-2">No assets attached</h4>
                     <p className="text-muted-foreground mb-4">
                        Attach images, documents, or other files to this content
                     </p>
                     <Button variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        Add First Asset
                     </Button>
                  </div>
               )}
            </TabsContent>
         </Tabs>
      </div>
   );
}
