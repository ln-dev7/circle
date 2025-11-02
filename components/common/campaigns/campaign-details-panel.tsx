'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { X, Layers, FileText, Users, Calendar, Clock, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface CampaignDetails {
   id: string;
   name: string;
   description?: string;
   health: 'ON_TRACK' | 'AT_RISK' | 'OFF_TRACK';
   totalTasks: number;
   pic: string[];
   startDate: string;
   endDate: string;
   status: 'PLAN' | 'DO' | 'DONE' | 'CANCELED';
   createdAt: string;
   updatedAt: string;
   contents?: any[];
   schedules?: any[];
}

interface CampaignDetailsPanelProps {
   campaignId: string;
   orgId: string;
   onClose: () => void;
}

export default function CampaignDetailsPanel({
   campaignId,
   orgId,
   onClose,
}: CampaignDetailsPanelProps) {
   const [campaign, setCampaign] = useState<CampaignDetails | null>(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      fetchCampaignDetails();
   }, [campaignId, orgId]);

   const fetchCampaignDetails = async () => {
      try {
         const response = await fetch(`/api/${orgId}/campaigns/${campaignId}`);
         if (response.ok) {
            const data = await response.json();
            setCampaign(data);
         } else {
            console.error(
               'Failed to fetch campaign details:',
               response.status,
               response.statusText
            );
            // Set a fallback campaign object to prevent crashes
            setCampaign({
               id: campaignId,
               name: 'Campaign Not Found',
               description: 'Unable to load campaign details',
               health: 'OFF_TRACK',
               totalTasks: 0,
               pic: [],
               startDate: '',
               endDate: '',
               status: 'PLAN',
               createdAt: new Date().toISOString(),
               updatedAt: new Date().toISOString(),
               contents: [],
               schedules: [],
            });
         }
      } catch (error) {
         console.error('Error fetching campaign details:', error);
         // Set a fallback campaign object to prevent crashes
         setCampaign({
            id: campaignId,
            name: 'Error Loading Campaign',
            description: 'Failed to load campaign details due to network error',
            health: 'OFF_TRACK',
            totalTasks: 0,
            pic: [],
            startDate: '',
            endDate: '',
            status: 'PLAN',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            contents: [],
            schedules: [],
         });
      } finally {
         setLoading(false);
      }
   };

   const getHealthColor = (health: string) => {
      switch (health) {
         case 'ON_TRACK':
            return 'default';
         case 'AT_RISK':
            return 'destructive';
         case 'OFF_TRACK':
            return 'secondary';
         default:
            return 'default';
      }
   };

   const getStatusColor = (status: string) => {
      switch (status) {
         case 'PLAN':
            return 'secondary';
         case 'DO':
            return 'default';
         case 'DONE':
            return 'default';
         case 'CANCELED':
            return 'destructive';
         default:
            return 'secondary';
      }
   };

   if (loading) {
      return (
         <div className="fixed inset-y-0 right-0 w-96 bg-background border-l shadow-lg transform transition-transform duration-300 ease-in-out z-50">
            <div className="h-full flex items-center justify-center">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
         </div>
      );
   }

   if (!campaign) {
      return null;
   }

   return (
      <div className="fixed inset-y-0 right-0 w-96 bg-background border-l shadow-lg transform transition-transform duration-300 ease-in-out z-50">
         {/* Header */}
         <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Campaign Details</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
               <X className="h-4 w-4" />
            </Button>
         </div>

         {/* Content */}
         <div className="h-full overflow-y-auto p-4 space-y-4">
            {/* Basic Info */}
            <Card>
               <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                     <Layers className="h-4 w-4" />
                     {campaign.name || 'Unnamed Campaign'}
                  </CardTitle>
               </CardHeader>
               <CardContent className="space-y-3">
                  {campaign.description && (
                     <p className="text-sm text-muted-foreground">{campaign.description}</p>
                  )}

                  <div className="flex items-center gap-2">
                     <Badge variant={getHealthColor(campaign.health || 'ON_TRACK') as any}>
                        {(campaign.health || 'ON_TRACK').replace('_', ' ')}
                     </Badge>
                     <Badge variant={getStatusColor(campaign.status || 'PLAN') as any}>
                        {campaign.status || 'PLAN'}
                     </Badge>
                  </div>
               </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
               <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                     <Calendar className="h-4 w-4" />
                     Timeline
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="flex items-center justify-between text-sm">
                     <span>
                        Start:{' '}
                        {campaign.startDate
                           ? new Date(campaign.startDate).toLocaleDateString()
                           : 'Not set'}
                     </span>
                     <span>
                        End:{' '}
                        {campaign.endDate
                           ? new Date(campaign.endDate).toLocaleDateString()
                           : 'Not set'}
                     </span>
                  </div>
               </CardContent>
            </Card>

            {/* Team */}
            <Card>
               <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                     <Users className="h-4 w-4" />
                     Team ({(campaign.pic || []).length})
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="space-y-2">
                     {(campaign.pic || []).map((member, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                           <div className="w-2 h-2 bg-primary rounded-full"></div>
                           <span>{member}</span>
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>

            {/* Tasks & Content */}
            <Card>
               <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                     <FileText className="h-4 w-4" />
                     Tasks & Content ({campaign.totalTasks || 0})
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="space-y-2">
                     {(campaign.contents || []).length > 0 ? (
                        (campaign.contents || []).slice(0, 5).map((content: any) => (
                           <div
                              key={content.id}
                              className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded"
                           >
                              <span className="truncate">
                                 {content.title || 'Untitled Content'}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                 {content.status || 'Unknown'}
                              </Badge>
                           </div>
                        ))
                     ) : (
                        <p className="text-sm text-muted-foreground">No tasks yet</p>
                     )}
                  </div>
               </CardContent>
            </Card>

            {/* Schedules */}
            <Card>
               <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                     <Clock className="h-4 w-4" />
                     Schedules ({campaign.schedules?.length || 0})
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="space-y-2">
                     {campaign.schedules && campaign.schedules.length > 0 ? (
                        campaign.schedules.slice(0, 3).map((schedule: any) => (
                           <div key={schedule.id} className="text-sm p-2 bg-muted/50 rounded">
                              <div className="font-medium">
                                 {schedule.name || 'Unnamed Schedule'}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                 {schedule.runAt
                                    ? new Date(schedule.runAt).toLocaleDateString()
                                    : 'No date set'}
                              </div>
                           </div>
                        ))
                     ) : (
                        <p className="text-sm text-muted-foreground">No schedules yet</p>
                     )}
                  </div>
               </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-2">
               <Link href={`/${orgId}/campaigns/${campaign.id || ''}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                     <Edit className="h-4 w-4 mr-2" />
                     Edit Campaign
                  </Button>
               </Link>
               <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4" />
               </Button>
            </div>
         </div>
      </div>
   );
}
