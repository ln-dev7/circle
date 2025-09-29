'use client';

import { Button } from '@/components/ui/button';
import { Filter, Layout } from 'lucide-react';

export default function HeaderOptions() {
   return (
      <div className="w-full flex justify-between items-center border-b py-1.5 px-6 h-10">
         <div className="flex items-center gap-2">
            <Button variant="ghost" size="xs">
               <Filter className="size-4 mr-1" />
               Filter
            </Button>
         </div>
         <div className="flex items-center gap-2">
            <Button variant="ghost" size="xs">
               <Layout className="size-4 mr-1" />
               Display
            </Button>
         </div>
      </div>
   );
}
