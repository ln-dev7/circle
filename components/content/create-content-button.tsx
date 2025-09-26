'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export function CreateContentButton({ orgId }: { orgId: string }) {
   return (
      <Link href={`/${orgId}/content/new`}>
         <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Content
         </Button>
      </Link>
   );
}
