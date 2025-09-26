import { useState, useEffect } from 'react';
import { Content } from '../types';

export function useDraftContent(orgId: string, selectedCampaigns?: string[]) {
   const [draftContent, setDraftContent] = useState<Content[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      const fetchDraftContent = async () => {
         try {
            setIsLoading(true);
            setError(null);

            // Build query parameters
            const params = new URLSearchParams({
               status: 'DRAFT',
            });

            if (selectedCampaigns && selectedCampaigns.length > 0) {
               params.append('campaignId', selectedCampaigns.join(','));
            }

            const response = await fetch(`/api/${orgId}/content?${params.toString()}`);

            if (!response.ok) {
               throw new Error(`Failed to fetch draft content: ${response.statusText}`);
            }

            const result = await response.json();

            if (result.ok && result.data) {
               setDraftContent(result.data);
            } else {
               throw new Error(result.error?.message || 'Failed to fetch draft content');
            }
         } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            setDraftContent([]);
         } finally {
            setIsLoading(false);
         }
      };

      fetchDraftContent();
   }, [orgId, selectedCampaigns]);

   return { draftContent, isLoading, error };
}
