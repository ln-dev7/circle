'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, FileText, Clock, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface Campaign {
   id: string;
   name: string;
   description?: string;
   createdAt: string;
   contents: any[];
   schedules: any[];
}

interface CampaignCardProps {
   campaign: Campaign;
   orgId: string;
}

export function CampaignCard({ campaign, orgId }: CampaignCardProps) {
   const contentCount = campaign.contents.length;
   const scheduleCount = campaign.schedules.length;
   const createdDate = new Date(campaign.createdAt);

   return (
      <Card className="hover:shadow-md transition-shadow">
         <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
               <div className="space-y-1">
                  <CardTitle className="text-lg font-semibold line-clamp-2">
                     {campaign.name}
                  </CardTitle>
                  {campaign.description && (
                     <CardDescription className="line-clamp-2">
                        {campaign.description}
                     </CardDescription>
                  )}
               </div>
               <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
               </Button>
            </div>
         </CardHeader>

         <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
               <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span>
                     {contentCount} content{contentCount !== 1 ? 's' : ''}
                  </span>
               </div>
               <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>
                     {scheduleCount} schedule{scheduleCount !== 1 ? 's' : ''}
                  </span>
               </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
               <Calendar className="h-4 w-4" />
               <span>Created {formatDistanceToNow(createdDate, { addSuffix: true })}</span>
            </div>

            <div className="flex gap-2">
               <Link href={`/${orgId}/campaigns/${campaign.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                     View Details
                  </Button>
               </Link>
               <Link href={`/${orgId}/content/new?campaignId=${campaign.id}`}>
                  <Button size="sm">Add Content</Button>
               </Link>
            </div>
         </CardContent>
      </Card>
   );
}
