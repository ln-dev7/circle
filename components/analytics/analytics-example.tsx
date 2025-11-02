'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAnalytics } from '@/hooks/use-analytics';
import { Eye, MousePointer, ThumbsUp, Share2 } from 'lucide-react';

interface AnalyticsExampleProps {
   orgId: string;
   campaignId?: string;
   contentId?: string;
}

export function AnalyticsExample({ orgId, campaignId, contentId }: AnalyticsExampleProps) {
   const { trackEvent } = useAnalytics(orgId);

   const handleView = async () => {
      try {
         await trackEvent('view', campaignId, contentId, {
            source: 'example_component',
            timestamp: new Date().toISOString(),
         });
         console.log('View event tracked');
      } catch (error) {
         console.error('Failed to track view:', error);
      }
   };

   const handleClick = async () => {
      try {
         await trackEvent('click', campaignId, contentId, {
            element: 'example_button',
            position: 'center',
         });
         console.log('Click event tracked');
      } catch (error) {
         console.error('Failed to track click:', error);
      }
   };

   const handleLike = async () => {
      try {
         await trackEvent('like', campaignId, contentId, {
            reaction_type: 'thumbs_up',
         });
         console.log('Like event tracked');
      } catch (error) {
         console.error('Failed to track like:', error);
      }
   };

   const handleShare = async () => {
      try {
         await trackEvent('share', campaignId, contentId, {
            platform: 'social_media',
         });
         console.log('Share event tracked');
      } catch (error) {
         console.error('Failed to track share:', error);
      }
   };

   return (
      <Card>
         <CardHeader>
            <CardTitle>Analytics Event Tracking Example</CardTitle>
            <CardDescription>
               Click buttons to track different types of analytics events
            </CardDescription>
         </CardHeader>
         <CardContent className="space-y-4">
            <div className="grid gap-2 md:grid-cols-2">
               <Button onClick={handleView} variant="outline" className="justify-start">
                  <Eye className="mr-2 h-4 w-4" />
                  Track View
               </Button>
               <Button onClick={handleClick} variant="outline" className="justify-start">
                  <MousePointer className="mr-2 h-4 w-4" />
                  Track Click
               </Button>
               <Button onClick={handleLike} variant="outline" className="justify-start">
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  Track Like
               </Button>
               <Button onClick={handleShare} variant="outline" className="justify-start">
                  <Share2 className="mr-2 h-4 w-4" />
                  Track Share
               </Button>
            </div>

            <div className="text-sm text-muted-foreground">
               <p>
                  <strong>Campaign ID:</strong> {campaignId || 'Not set'}
               </p>
               <p>
                  <strong>Content ID:</strong> {contentId || 'Not set'}
               </p>
               <p>
                  <strong>Organization ID:</strong> {orgId}
               </p>
            </div>

            <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
               <p>
                  <strong>Usage:</strong>
               </p>
               <pre className="mt-1">
                  {`const { trackEvent } = useAnalytics(orgId);

await trackEvent('event_type', campaignId, contentId, {
  custom_data: 'value'
});`}
               </pre>
            </div>
         </CardContent>
      </Card>
   );
}
