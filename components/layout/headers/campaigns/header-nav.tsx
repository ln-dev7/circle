'use client';

import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Plus } from 'lucide-react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function HeaderNav() {
   const params = useParams();
   const orgId = params.orgId as string;
   const [campaignCount, setCampaignCount] = useState(0);

   useEffect(() => {
      fetchCampaignCount();
   }, [orgId]);

   const fetchCampaignCount = async () => {
      try {
         const response = await fetch(`/api/${orgId}/campaigns`);
         if (response.ok) {
            const data = await response.json();
            setCampaignCount(data.length);
         }
      } catch (error) {
         console.error('Error fetching campaign count:', error);
      }
   };

   return (
      <div className="w-full flex justify-between items-center border-b py-1.5 px-6 h-10">
         <div className="flex items-center gap-2">
            <SidebarTrigger className="" />
            <div className="flex items-center gap-1">
               <span className="text-sm font-medium">Campaigns</span>
               <span className="text-xs bg-accent rounded-md px-1.5 py-1">{campaignCount}</span>
            </div>
         </div>
         <div className="flex items-center gap-2">
            <Link href={`/${orgId}/campaigns/new`}>
               <Button className="relative" size="xs" variant="secondary">
                  <Plus className="size-4" />
                  <span className="hidden sm:inline ml-1">Create campaign</span>
               </Button>
            </Link>
         </div>
      </div>
   );
}
