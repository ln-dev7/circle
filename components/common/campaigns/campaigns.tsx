'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import CampaignLine from './campaign-line';
import CampaignDetailsPanel from './campaign-details-panel';

interface Campaign {
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
}

export default function Campaigns() {
   const params = useParams();
   const orgId = params.orgId as string;
   const [campaigns, setCampaigns] = useState<Campaign[]>([]);
   const [loading, setLoading] = useState(true);
   const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

   useEffect(() => {
      fetchCampaigns();
   }, [orgId]);

   const fetchCampaigns = async () => {
      try {
         const response = await fetch(`/api/${orgId}/campaigns`);
         if (response.ok) {
            const data = await response.json();
            // Transform the data to match our new interface
            const transformedCampaigns = data.map((campaign: any) => ({
               id: campaign.id,
               name: campaign.name || 'Unnamed Campaign',
               description: campaign.description,
               health: campaign.health || 'ON_TRACK',
               totalTasks: campaign.contents?.length || 0,
               pic: campaign.members?.map(
                  (member: any) => member.user?.name || member.user?.email || 'Unknown User'
               ) || ['Unassigned'],
               startDate: campaign.startDate || campaign.createdAt,
               endDate: campaign.endDate || campaign.updatedAt,
               status: campaign.status || 'PLAN',
               createdAt: campaign.createdAt,
               updatedAt: campaign.updatedAt,
            }));
            setCampaigns(transformedCampaigns);
         }
      } catch (error) {
         console.error('Error fetching campaigns:', error);
      } finally {
         setLoading(false);
      }
   };

   const handleOpenDetails = (campaignId: string) => {
      setSelectedCampaignId(campaignId);
   };

   const handleCloseDetails = () => {
      setSelectedCampaignId(null);
   };

   if (loading) {
      return (
         <div className="w-full">
            <div className="bg-container px-6 py-1.5 text-sm flex items-center text-muted-foreground border-b sticky top-0 z-10">
               <div className="w-[35%]">Title</div>
               <div className="w-[12%]">Health</div>
               <div className="w-[12%]">Total Tasks</div>
               <div className="w-[15%]">PIC</div>
               <div className="w-[18%]">Timeline</div>
               <div className="w-[8%]">Status</div>
            </div>
            <div className="w-full">
               {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-full flex items-center py-3 px-6 border-b">
                     <div className="w-[35%]">
                        <div className="h-4 bg-muted rounded animate-pulse w-32"></div>
                     </div>
                     <div className="w-[12%]">
                        <div className="h-4 bg-muted rounded animate-pulse w-16"></div>
                     </div>
                     <div className="w-[12%]">
                        <div className="h-4 bg-muted rounded animate-pulse w-16"></div>
                     </div>
                     <div className="w-[15%]">
                        <div className="h-4 bg-muted rounded animate-pulse w-20"></div>
                     </div>
                     <div className="w-[18%]">
                        <div className="h-4 bg-muted rounded animate-pulse w-24"></div>
                     </div>
                     <div className="w-[8%]">
                        <div className="h-4 bg-muted rounded animate-pulse w-16"></div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      );
   }

   return (
      <div className="w-full relative">
         <div className="bg-container px-6 py-1.5 text-sm flex items-center text-muted-foreground border-b sticky top-0 z-10">
            <div className="w-[35%]">Title</div>
            <div className="w-[12%]">Health</div>
            <div className="w-[12%]">Total Tasks</div>
            <div className="w-[15%]">PIC</div>
            <div className="w-[18%]">Timeline</div>
            <div className="w-[8%]">Status</div>
         </div>

         <div className="w-full">
            {campaigns.length === 0 ? (
               <div className="w-full flex items-center py-12 px-6 text-center">
                  <div className="w-full">
                     <p className="text-muted-foreground mb-4">No campaigns yet</p>
                     <p className="text-sm text-muted-foreground">
                        Create your first campaign to get started
                     </p>
                  </div>
               </div>
            ) : (
               campaigns.map((campaign) => (
                  <CampaignLine
                     key={campaign.id}
                     campaign={campaign}
                     orgId={orgId}
                     onOpenDetails={handleOpenDetails}
                  />
               ))
            )}
         </div>

         {/* Right Panel */}
         {selectedCampaignId && (
            <CampaignDetailsPanel
               campaignId={selectedCampaignId}
               orgId={orgId}
               onClose={handleCloseDetails}
            />
         )}
      </div>
   );
}
