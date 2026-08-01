'use client';

import { Button } from '@/components/ui/button';
import { useRightPanelStore } from '@/store/right-panel-store';
import { BarChart3 } from 'lucide-react';
import { DisplayOptions } from '../display-options';
import { Filter } from './filter';

export default function HeaderOptions() {
   const { openPanel, togglePanel } = useRightPanelStore();

   return (
      <div className="w-full flex justify-between items-center border-b py-1.5 px-6 h-10">
         <Filter />
         <div className="flex items-center gap-1">
            <Button
               size="xs"
               variant={openPanel === 'insights' ? 'secondary' : 'ghost'}
               onClick={() => togglePanel('insights')}
               aria-label="Toggle insights panel"
            >
               <BarChart3 className="size-4" />
            </Button>
            <DisplayOptions />
         </div>
      </div>
   );
}
