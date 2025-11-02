'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export function CreateCampaignButton() {
   const params = useParams();
   const orgId = params.orgId as string;

   return (
      <Link href={`/${orgId}/campaigns/new`}>
         <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
         </Button>
      </Link>
   );
}
