'use client';

import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CampaignStatus, CAMPAIGN_STATUSES } from '@/types/campaign';

interface CampaignStatusSelectorProps {
   value: CampaignStatus;
   onChange: (status: CampaignStatus) => void;
   disabled?: boolean;
   className?: string;
}

export default function CampaignStatusSelector({
   value,
   onChange,
   disabled = false,
   className = '',
}: CampaignStatusSelectorProps) {
   const getStatusColor = (status: CampaignStatus) => {
      switch (status) {
         case 'DRAFT':
            return 'secondary';
         case 'PLANNING':
            return 'default';
         case 'READY':
            return 'default';
         case 'DONE':
            return 'default';
         case 'CANCELED':
            return 'destructive';
         default:
            return 'secondary';
      }
   };

   const getStatusIcon = (status: CampaignStatus) => {
      switch (status) {
         case 'DRAFT':
            return '📝';
         case 'PLANNING':
            return '📋';
         case 'READY':
            return '✅';
         case 'DONE':
            return '🎉';
         case 'CANCELED':
            return '❌';
         default:
            return '📝';
      }
   };

   return (
      <div className={`space-y-2 ${className}`}>
         <label className="text-sm font-medium">Status</label>
         <Select value={value} onValueChange={onChange} disabled={disabled}>
            <SelectTrigger>
               <SelectValue>
                  <div className="flex items-center gap-2">
                     <span>{getStatusIcon(value)}</span>
                     <span>{value}</span>
                  </div>
               </SelectValue>
            </SelectTrigger>
            <SelectContent>
               {CAMPAIGN_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                     <div className="flex items-center gap-2">
                        <span>{getStatusIcon(status)}</span>
                        <span>{status}</span>
                        <Badge variant={getStatusColor(status)} className="ml-auto text-xs">
                           {status}
                        </Badge>
                     </div>
                  </SelectItem>
               ))}
            </SelectContent>
         </Select>
      </div>
   );
}
