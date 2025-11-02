import { useState, useEffect } from 'react';

interface AnalyticsMetrics {
   totalEvents: number;
   eventsByType: Record<string, number>;
   impressions: number;
   clicks: number;
   views: number;
   ctr: number;
   roi: number;
   campaignMetrics: Array<{
      id: string;
      name: string;
      totalEvents: number;
      contentCount: number;
      contentMetrics: Array<{
         id: string;
         title: string;
         events: number;
         impressions: number;
         clicks: number;
         views: number;
      }>;
   }>;
}

export function useAnalytics(orgId: string) {
   const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      const fetchAnalytics = async () => {
         try {
            setLoading(true);
            const response = await fetch(`/api/${orgId}/analytics/metrics`);
            if (!response.ok) {
               throw new Error('Failed to fetch analytics');
            }
            const data = await response.json();
            setMetrics(data);
         } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
         } finally {
            setLoading(false);
         }
      };

      if (orgId) {
         fetchAnalytics();
      }
   }, [orgId]);

   const trackEvent = async (
      event: string,
      campaignId?: string,
      contentId?: string,
      data?: any
   ) => {
      try {
         const response = await fetch(`/api/${orgId}/analytics/track`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               event,
               campaignId,
               contentId,
               data,
            }),
         });

         if (!response.ok) {
            throw new Error('Failed to track event');
         }

         return await response.json();
      } catch (err) {
         console.error('Error tracking event:', err);
         throw err;
      }
   };

   return {
      metrics,
      loading,
      error,
      trackEvent,
   };
}
